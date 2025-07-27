import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { partnerService } from '../../services/api';

const PartnerAddTest = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company: '',
    fullname: '',
    email: '',
    contact: '',
    venue: '',
    status: '',
  });
  const [panCardImage, setPanCardImage] = useState(null);
  const [businessDocument, setBusinessDocument] = useState(null);
  const [sendEmail, setSendEmail] = useState(false);
  const [accountActive, setAccountActive] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = `${key} is required`;
      }
    });
    if (!panCardImage) newErrors.panCardImage = 'PAN card image is required';
    if (!businessDocument) newErrors.businessDocument = 'Business document is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      setApiError("");
      try {
        // Prepare form data for file upload
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          data.append(key, value);
        });
        data.append('panCardImage', panCardImage);
        data.append('businessDocument', businessDocument);
        data.append('sendWelcomeEmail', sendEmail);
        data.append('status', accountActive ? 'Active' : 'Inactive');
        const response = await partnerService.addPartner(data);
        console.log("Partner added successfully:", response);
        await new Promise((resolve) => setTimeout(resolve, 300));
        alert("Partner added successfully!");
        setFormData({
          company: '',
          fullname: '',
          email: '',
          contact: '',
          venue: '',
          status: '',
        });
        setPanCardImage(null);
        setBusinessDocument(null);
        setSendEmail(false);
        setAccountActive(true);
        navigate('/admin/partners');
      } catch (error) {
        console.error("Partner add failed:", error);
        if (error.response) {
          if (error.response.status === 409) {
            setApiError("Partner with this name already exists.");
          } else if (error.response.data && error.response.data.message) {
            setApiError(error.response.data.message);
          } else {
            setApiError("Partner add failed. Please try again later.");
          }
        } else {
          setApiError("Unable to connect to the server. Please try again later.");
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="add-user-container" style={{ maxWidth: 700, margin: '2rem auto', background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: 32 }}>
      <div className="add-user-header" style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontWeight: 700, fontSize: 32 }}>User Information</h1>
        <p style={{ color: '#555' }}>Enter the details for the new user account</p>
      </div>
      {apiError && <div style={{ color: 'red', marginBottom: 10 }}>{apiError}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="userType" style={{ fontWeight: 600 }}>User Type</label>
          <input type="text" id="userType" value="Partner" disabled style={{ background: '#f5f5f5', fontWeight: 600, marginBottom: 16 }} />
        </div>
        <div className="form-group">
          <label htmlFor="fullname">Full Name</label>
          <input
            type="text"
            id="fullname"
            name="fullname"
            placeholder="Enter full name"
            value={formData.fullname}
            onChange={handleChange}
            className={errors.fullname ? 'error' : ''}
          />
          {errors.fullname && <span className="error-message" style={{ color: 'red' }}>{errors.fullname}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter email address"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error-message" style={{ color: 'red' }}>{errors.email}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="contact">Phone Number</label>
          <input
            type="text"
            id="contact"
            name="contact"
            placeholder="Enter phone number"
            value={formData.contact}
            onChange={handleChange}
            className={errors.contact ? 'error' : ''}
          />
          {errors.contact && <span className="error-message" style={{ color: 'red' }}>{errors.contact}</span>}
        </div>
        <hr style={{ margin: '32px 0' }} />
        <div className="form-header" style={{ marginBottom: 24 }}>
          <h2 style={{ fontWeight: 700, fontSize: 24 }}>Partner Information</h2>
          <p style={{ color: '#555' }}>Enter the details for the new partner account</p>
        </div>
        <div className="form-group">
          <label htmlFor="company">Business Name</label>
          <input
            type="text"
            id="company"
            name="company"
            placeholder="Enter business name"
            value={formData.company}
            onChange={handleChange}
            className={errors.company ? 'error' : ''}
          />
          {errors.company && <span className="error-message" style={{ color: 'red' }}>{errors.company}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="venue">Business Registration Number</label>
          <input
            type="text"
            id="venue"
            name="venue"
            placeholder="Enter business registration number"
            value={formData.venue}
            onChange={handleChange}
            className={errors.venue ? 'error' : ''}
          />
          {errors.venue && <span className="error-message" style={{ color: 'red' }}>{errors.venue}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="status">Business Address</label>
          <input
            type="text"
            id="status"
            name="status"
            placeholder="Enter business address"
            value={formData.status}
            onChange={handleChange}
            className={errors.status ? 'error' : ''}
          />
          {errors.status && <span className="error-message" style={{ color: 'red' }}>{errors.status}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="panCardImage">PAN Card Image</label>
          <input
            type="file"
            id="panCardImage"
            name="panCardImage"
            onChange={(e) => setPanCardImage(e.target.files[0])}
            className={errors.panCardImage ? 'error' : ''}
          />
          {errors.panCardImage && <span className="error-message" style={{ color: 'red' }}>{errors.panCardImage}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="businessDocument">Document of Business</label>
          <input
            type="file"
            id="businessDocument"
            name="businessDocument"
            onChange={(e) => setBusinessDocument(e.target.files[0])}
            className={errors.businessDocument ? 'error' : ''}
          />
          {errors.businessDocument && <span className="error-message" style={{ color: 'red' }}>{errors.businessDocument}</span>}
        </div>
        <div className="form-row" style={{ display: 'flex', gap: 16 }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Create password (min 8 characters)"
              value={formData.password || ''}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-message" style={{ color: 'red' }}>{errors.password}</span>}
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword || ''}
              onChange={handleChange}
              className={errors.confirmPassword ? 'error' : ''}
            />
            {errors.confirmPassword && <span className="error-message" style={{ color: 'red' }}>{errors.confirmPassword}</span>}
          </div>
        </div>
        <div className="form-group-checkbox" style={{ marginTop: 16 }}>
          <input
            type="checkbox"
            id="sendEmail"
            checked={sendEmail}
            onChange={(e) => setSendEmail(e.target.checked)}
          />
          <label htmlFor="sendEmail" style={{ marginLeft: 8 }}>Send welcome email with login details</label>
        </div>
        <div className="form-group-checkbox">
          <input
            type="checkbox"
            id="accountActive"
            checked={accountActive}
            onChange={(e) => setAccountActive(e.target.checked)}
          />
          <label htmlFor="accountActive" style={{ marginLeft: 8 }}>Account active</label>
        </div>
        <div className="form-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
          <button type="button" className="btn-cancel" style={{ padding: '8px 18px', borderRadius: 6, border: '1px solid #ccc', background: '#f5f5f5', fontWeight: 500, cursor: 'pointer' }} onClick={() => window.history.back()}>
            Cancel
          </button>
          <button type="submit" className="btn-create" style={{ padding: '8px 18px', borderRadius: 6, background: '#111', color: '#fff', fontWeight: 600, cursor: 'pointer' }} disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PartnerAddTest;
