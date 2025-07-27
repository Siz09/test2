"use client"

import { useState, useEffect } from "react"
import { bookingService,venueService } from "../../services/api"
import "../../styles/venue-booking.css"
import "../../styles/modern-components.css"
import Header from "./Header"
import { useLocation, useNavigate } from 'react-router-dom';

const VenueBooking = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { venueId } = state || {};

  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    duration: '4',
    guests: '',
    specialRequests: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]); 
  const [venueDetails, setVenueDetails] = useState(null); // ✅ New state for venue data

  useEffect(() => {
    if (!venueId) navigate('/venues');
  }, [venueId, navigate]);

  // ✅ Fetch venue details
  useEffect(() => {
    const fetchVenueDetails = async () => {
      try {
        const data = await venueService.getVenue(venueId); 
        setVenueDetails(data);
      } catch (err) {
        console.error('Error fetching venue details:', err);
      }
    };
    if (venueId) fetchVenueDetails();
  }, [venueId]);

  // Fetch booked slots when date changes
  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (formData.date && venueId) {
        try {
          const bookings = await bookingService.getBookingsByVenueAndDate(venueId, formData.date);
          setBookedSlots(bookings);
        } catch (err) {
          console.error('Error fetching booked slots:', err);
        }
      }
    };
    fetchBookedSlots();
  }, [formData.date, venueId]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.date) errs.date = 'Please select a date';
    else {
      const sel = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (sel < today) errs.date = 'Please select a future date';
    }
    if (!formData.startTime) errs.startTime = 'Please select a start time';
    const g = parseInt(formData.guests, 10);
    if (!g || g < 1) errs.guests = 'Please enter number of guests';
    else if (g > 1000) errs.guests = 'Maximum 1000 guests allowed';
    setFormErrors(errs);
    return !Object.keys(errs).length;
  };

  const isTimeDisabled = (time) => {
    const selectedDate = formData.date;
    if (!selectedDate || bookedSlots.length === 0) return false;

    const checkTime = new Date(`${selectedDate}T${time}:00`);

    return bookedSlots.some(slot => {
      const bookingStart = new Date(slot.bookedTime);
      const bookingEnd = new Date(bookingStart.getTime() + slot.duration * 60 * 60 * 1000);
      const bufferStart = new Date(bookingStart.getTime() - 60 * 60 * 1000);
      const bufferEnd = new Date(bookingEnd.getTime() + 60 * 60 * 1000);

      return checkTime >= bufferStart && checkTime < bufferEnd;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    const bookedTime = `${formData.date}T${formData.startTime}:00`;

    try {
      const storedId = localStorage.getItem('userId');
      if (!storedId) throw new Error('User not logged in');

      const venueIdNum = Number(venueId);
      const attendeeIdNum = Number(storedId);
      const durationNum = parseInt(formData.duration, 10);
      const guestsNum = parseInt(formData.guests, 10);

      if (
        isNaN(venueIdNum) ||
        isNaN(attendeeIdNum) ||
        isNaN(durationNum) ||
        isNaN(guestsNum)
      ) {
        throw new Error('Invalid booking data, please check your input.');
      }

      await bookingService.createBooking({
        venueId: venueIdNum,
        attendeeId: attendeeIdNum,
        bookedTime,
        duration: durationNum,
        guests: guestsNum,
        specialRequests: formData.specialRequests.trim(),
        status: 'pending',
      });

      setSuccess(true);
      setFormData({ date: '', startTime: '', duration: '4', guests: '', specialRequests: '' });
      setTimeout(() => setSuccess(false), 3000);

    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const timeOptions = [
    '09:00','10:00','11:00','12:00','13:00','14:00','15:00',
    '16:00','17:00','18:00','19:00','20:00'
  ];

  return (
    <div className="venue-booking-page">
      <Header />

      <section className="venue-hero-section">
        <img
          src={venueDetails?.imageUrl || "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1200&h=400&fit=crop&crop=center"}
          alt={venueDetails?.venueName || "Venue Image"}
          className="venue-hero-background"
        />
        <div className="venue-hero-content">
          <h1 className="venue-hero-title">{venueDetails?.venueName || "Book Your Perfect Venue"}</h1>
          <div className="venue-hero-tagline">
            <p className="venue-hero-text-primary">We bring</p>
            <p className="venue-hero-text-highlight">dream events</p>
            <p className="venue-hero-text-primary">to life!</p>
          </div>
        </div>
      </section>

      <main className="venue-main-content">
        <div className="venue-content-grid">
          {/* Venue Details */}
          <div className="venue-details-section">
            <h2 className="venue-details-title">{venueDetails?.venueName}</h2>

            <div className="venue-image-carousel">
              <img
                src={venueDetails?.imageUrl || "https://images.unsplash.com/photo-1519167758481-83f29c8e8d4b?w=800&h=400&fit=crop"}
                alt={venueDetails?.venueName || "Venue Image"}
                className="venue-carousel-image"
              />
            </div>

            <div className="venue-rating-section">
              <div className="venue-rating-container">
                <div className="venue-rating-stars">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="venue-star-icon">★</span>
                  ))}
                </div>
                <span className="venue-rating-number">4.8</span>
                <span className="venue-rating-count">(124 reviews)</span>
              </div>
            </div>

            <div className="venue-tabs-container">
              <div className="venue-tab-content">
                <div className="venue-about-section">
                  <h3 className="venue-section-heading">About this venue</h3>
                  <p className="venue-description-text">
                    {venueDetails?.description || "Loading venue details..."}
                  </p>

                  <div className="venue-info-grid">
                    <div className="venue-info-item">
                      <div className="venue-info-heading">
                        <span>👥</span> Capacity
                      </div>
                      <div className="venue-info-text">{venueDetails?.capacity || "N/A"} guests</div>
                    </div>
                    <div className="venue-info-item">
                      <div className="venue-info-heading">
                        <span>📍</span> Location
                      </div>
                      <div className="venue-info-text">{venueDetails?.location || "N/A"}</div>
                    </div>
                    <div className="venue-info-item">
                      <div className="venue-info-heading">
                        <span>🕒</span> Opening Hours
                      </div>
                      <div className="venue-info-text">
                        {venueDetails?.openingTime} - {venueDetails?.closingTime}
                      </div>
                    </div>
                    <div className="venue-info-item">
                      <div className="venue-info-heading">
                        <span>💰</span> Price
                      </div>
                      <div className="venue-info-text">NPR {venueDetails?.price || "N/A"} / hour</div>
                    </div>
                  </div>

                  <h4 className="venue-section-heading">Amenities:</h4>
                  <ul>
                    {venueDetails?.amenities?.length > 0
                      ? venueDetails.amenities.map((amenity, idx) => (
                          <li key={idx}>✔ {amenity}</li>
                        ))
                      : <li>No amenities listed</li>
                    }
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="venue-booking-sidebar">
            <div className="venue-booking-card">
              <div className="venue-booking-header">
                <h3 className="venue-booking-title">Book this venue</h3>
                <p className="venue-booking-subtitle">Fill in the details below</p>
              </div>

              {success && (
                <div style={{
                  background: '#d4edda',
                  color: '#155724',
                  padding: '12px',
                  margin: '16px',
                  borderRadius: '4px',
                  border: '1px solid #c3e6cb'
                }}>
                  ✅ Booking submitted successfully! We'll contact you soon.
                </div>
              )}

              {error && (
                <div style={{
                  background: '#f8d7da',
                  color: '#721c24',
                  padding: '12px',
                  margin: '16px',
                  borderRadius: '4px',
                  border: '1px solid #f5c6cb'
                }}>
                  ❌ {error}
                </div>
              )}

              <form className="venue-booking-form" onSubmit={handleSubmit}>
                <div className="venue-form-group">
                  <label className="venue-form-label">Event Date *</label>
                  <input
                    type="date"
                    className={`venue-form-input ${formErrors.date ? 'venue-input-error' : ''}`}
                    value={formData.date}
                    onChange={e => handleInputChange('date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {formErrors.date && (
                    <div className="venue-form-error">{formErrors.date}</div>
                  )}
                </div>

                <div className="venue-form-group">
                  <label className="venue-form-label">Start Time *</label>
                  <select
                    className={`venue-form-input ${formErrors.startTime ? 'venue-input-error' : ''}`}
                    value={formData.startTime}
                    onChange={e => handleInputChange('startTime', e.target.value)}
                  >
                    <option value="">Select time</option>
                    {timeOptions.map(t => (
                      <option key={t} value={t} disabled={isTimeDisabled(t)}>
                        {t} {isTimeDisabled(t) ? ' (Unavailable)' : ''}
                      </option>
                    ))}
                  </select>
                  {formErrors.startTime && (
                    <div className="venue-form-error">{formErrors.startTime}</div>
                  )}
                </div>

                <div className="venue-form-group">
                  <label className="venue-form-label">Duration</label>
                  <select
                    className="venue-form-input"
                    value={formData.duration}
                    onChange={e => handleInputChange('duration', e.target.value)}
                  >
                    <option value="2">2 hours</option>
                    <option value="4">4 hours</option>
                    <option value="6">6 hours</option>
                    <option value="8">8 hours</option>
                    <option value="12">12 hours</option>
                  </select>
                </div>

                <div className="venue-form-group">
                  <label className="venue-form-label">Number of Guests *</label>
                  <input
                    type="number"
                    className={`venue-form-input ${formErrors.guests ? 'venue-input-error' : ''}`}
                    placeholder="Enter number of guests"
                    value={formData.guests}
                    onChange={e => handleInputChange('guests', e.target.value)}
                    min="1"
                    max="1000"
                  />
                  {formErrors.guests && (
                    <div className="venue-form-error">{formErrors.guests}</div>
                  )}
                </div>

                <div className="venue-form-group">
                  <label className="venue-form-label">Special Requests</label>
                  <textarea
                    className="venue-form-textarea"
                    placeholder="Any special requirements or requests..."
                    value={formData.specialRequests}
                    onChange={e => handleInputChange('specialRequests', e.target.value)}
                    rows="3"
                  />
                </div>

                <button
                  type="submit"
                  className="venue-continue-btn"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Booking Request'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VenueBooking;