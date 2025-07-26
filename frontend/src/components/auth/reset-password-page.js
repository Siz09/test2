"use client";

import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Lock, AlertCircle, CheckCircle, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AuthCard from "./auth-card";
import { authService } from "../../services/api";

// Animation variants
const formControlVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.1,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
};

const buttonVariants = {
  idle: { scale: 1 },
  hover: { scale: 1.03 },
  tap: { scale: 0.97 },
};

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState({
    password: false,
    confirmPassword: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [tokenValid, setTokenValid] = useState(true);

  // Check if token exists
  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setApiError("Invalid or missing reset token. Please request a new password reset.");
    }
  }, [token]);

  // Define validateForm as a useCallback to avoid dependency issues
  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    } else {
      newErrors.password = "";
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    } else {
      newErrors.confirmPassword = "";
    }

    setErrors(newErrors);
    return isValid;
  }, [formData]);

  // Validate form on input change
  useEffect(() => {
    validateForm();
  }, [validateForm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (apiError) {
      setApiError("");
    }
    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({
      ...touched,
      [name]: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ password: true, confirmPassword: true });

    if (!validateForm() || !tokenValid) return;

    setIsSubmitting(true);
    setApiError("");
    setSuccessMessage("");

    try {
      await authService.resetPassword(token, formData.password);
      
      setSuccessMessage("Your password has been successfully reset! Redirecting to login...");
      
      // Clear the form
      setFormData({ password: "", confirmPassword: "" });
      setTouched({ password: false, confirmPassword: false });
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 3000);
      
    } catch (error) {
      console.error("Password reset failed:", error);
      
      if (error.response) {
        if (error.response.status === 400) {
          setApiError("Invalid or expired reset token. Please request a new password reset.");
          setTokenValid(false);
        } else if (error.response.status === 404) {
          setApiError("Reset token not found. Please request a new password reset.");
          setTokenValid(false);
        } else if (error.response.data?.message) {
          setApiError(error.response.data.message);
        } else {
          setApiError("Password reset failed. Please try again.");
        }
      } else {
        setApiError("Unable to connect to the server. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  const handleRequestNewReset = () => {
    navigate("/forgot-password");
  };

  if (!tokenValid) {
    return (
      <AuthCard
        title="Invalid Reset Link"
        imageSrc="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        imageAlt="Invalid reset link illustration"
        imagePosition="left"
      >
        <div className="error-state">
          <motion.div
            className="error-banner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <AlertCircle size={16} />
            <span>{apiError}</span>
          </motion.div>

          <div className="error-actions">
            <motion.button
              className="auth-button primary-button"
              onClick={handleRequestNewReset}
              variants={buttonVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
            >
              Request New Reset Link
            </motion.button>

            <motion.button
              type="button"
              className="back-to-login-button"
              onClick={handleBackToLogin}
              whileHover={{ x: -3 }}
              whileTap={{ scale: 0.97 }}
            >
              <ArrowLeft size={16} />
              Back to Login
            </motion.button>
          </div>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Set new password"
      imageSrc="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      imageAlt="Reset password illustration"
      imagePosition="left"
    >
      <form onSubmit={handleSubmit} noValidate>
        <AnimatePresence>
          {apiError && (
            <motion.div
              className="error-banner"
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AlertCircle size={16} />
              <span>{apiError}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {successMessage && (
            <motion.div
              className="success-banner"
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CheckCircle size={16} />
              <span>{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="form-group"
          variants={formControlVariants}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          <label htmlFor="password" className={touched.password && errors.password ? "text-error" : ""}>
            New Password <span className="required">*</span>
          </label>
          <div className={`input-container ${touched.password && errors.password ? "input-error" : ""}`}>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Enter your new password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.password && !errors.password ? "input-valid" : ""}
              required
              disabled={isSubmitting}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex="-1"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            <AnimatePresence>
              {touched.password && !errors.password && formData.password && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <CheckCircle className="valid-icon" size={16} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <AnimatePresence>
            {touched.password && errors.password && (
              <motion.p
                className="error-message"
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                {errors.password}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          className="form-group"
          variants={formControlVariants}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          <label htmlFor="confirmPassword" className={touched.confirmPassword && errors.confirmPassword ? "text-error" : ""}>
            Confirm New Password <span className="required">*</span>
          </label>
          <div className={`input-container ${touched.confirmPassword && errors.confirmPassword ? "input-error" : ""}`}>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.confirmPassword && !errors.confirmPassword ? "input-valid" : ""}
              required
              disabled={isSubmitting}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              tabIndex="-1"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            <AnimatePresence>
              {touched.confirmPassword && !errors.confirmPassword && formData.confirmPassword && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <CheckCircle className="valid-icon" size={16} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <AnimatePresence>
            {touched.confirmPassword && errors.confirmPassword && (
              <motion.p
                className="error-message"
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                {errors.confirmPassword}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          className="form-info"
          variants={formControlVariants}
          initial="hidden"
          animate="visible"
          custom={3}
        >
          <p className="form-help-text">
            Your password must be at least 8 characters long and contain a mix of letters, numbers, and symbols for better security.
          </p>
        </motion.div>

        <motion.button
          className={`auth-button primary-button ${isSubmitting ? "button-loading" : ""}`}
          type="submit"
          disabled={isSubmitting || !formData.password || !formData.confirmPassword}
          variants={buttonVariants}
          initial="idle"
          whileHover="hover"
          whileTap="tap"
          custom={4}
        >
          {isSubmitting ? "Updating Password..." : "Update Password"}
        </motion.button>

        <motion.div
          className="form-links"
          variants={formControlVariants}
          initial="hidden"
          animate="visible"
          custom={5}
        >
          <motion.button
            type="button"
            className="back-to-login-button"
            onClick={handleBackToLogin}
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.97 }}
          >
            <ArrowLeft size={16} />
            Back to Login
          </motion.button>
        </motion.div>
      </form>
    </AuthCard>
  );
}