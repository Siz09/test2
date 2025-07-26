"use client";

import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
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

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({
    email: "",
  });
  const [touched, setTouched] = useState({
    email: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Define validateForm as a useCallback to avoid dependency issues
  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    } else {
      newErrors.email = "";
    }

    setErrors(newErrors);
    return isValid;
  }, [formData]);

  // Validate form on input change
  useEffect(() => {
    validateForm();
  }, [validateForm]);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

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
    setTouched({ email: true });

    if (!validateForm()) return;

    setIsSubmitting(true);
    setApiError("");
    setSuccessMessage("");

    try {
      await authService.requestPasswordReset(formData.email);
      
      setSuccessMessage(
        "If an account with this email exists, a password reset link has been sent to your email address. Please check your inbox and follow the instructions."
      );
      
      // Clear the form
      setFormData({ email: "" });
      setTouched({ email: false });
      
    } catch (error) {
      console.error("Password reset request failed:", error);
      
      // Always show the same message for security reasons
      if (error.response?.status === 404) {
        setSuccessMessage(
          "If an account with this email exists, a password reset link has been sent to your email address. Please check your inbox and follow the instructions."
        );
      } else if (error.response?.data?.message) {
        setApiError(error.response.data.message);
      } else {
        setApiError("Unable to process your request. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <AuthCard
      title="Reset your password"
      imageSrc="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      imageAlt="Password reset illustration"
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
          <label htmlFor="email" className={touched.email && errors.email ? "text-error" : ""}>
            Email Address <span className="required">*</span>
          </label>
          <div className={`input-container ${touched.email && errors.email ? "input-error" : ""}`}>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.email && !errors.email ? "input-valid" : ""}
              required
              disabled={isSubmitting}
            />
            <Mail className="input-icon" size={20} />
            <AnimatePresence>
              {touched.email && !errors.email && formData.email && (
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
            {touched.email && errors.email && (
              <motion.p
                className="error-message"
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                {errors.email}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          className="form-info"
          variants={formControlVariants}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          <p className="form-help-text">
            Enter the email address associated with your account and we'll send you a link to reset your password.
          </p>
        </motion.div>

        <motion.button
          className={`auth-button primary-button ${isSubmitting ? "button-loading" : ""}`}
          type="submit"
          disabled={isSubmitting || !formData.email}
          variants={buttonVariants}
          initial="idle"
          whileHover="hover"
          whileTap="tap"
          custom={3}
        >
          {isSubmitting ? "Sending Reset Link..." : "Send Reset Link"}
        </motion.button>

        <motion.div
          className="form-links"
          variants={formControlVariants}
          initial="hidden"
          animate="visible"
          custom={4}
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

        <motion.div
          className="divider"
          variants={formControlVariants}
          initial="hidden"
          animate="visible"
          custom={5}
        >
          <span className="divider-line"></span>
          <span className="divider-text">OR</span>
          <span className="divider-line"></span>
        </motion.div>

        <motion.div
          className="auth-links"
          variants={formControlVariants}
          initial="hidden"
          animate="visible"
          custom={6}
        >
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="auth-link">
              Sign up here
            </Link>
          </p>
        </motion.div>
      </form>
    </AuthCard>
  );
}