import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { venueService, imageService } from '../../services/api';
import Header from '../users/Header';
import Footer from '../users/Footer';
import '../../styles/UserViewVenue.css';

const UserViewVenue = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [venueImage, setVenueImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVenueDetails = async () => {
      if (!id) {
        setError('Invalid venue ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch venue details
        const venueData = await venueService.getVenue(id);
        setVenue(venueData);

        // Fetch venue image
        try {
          const imageBlob = await imageService.getImage(id);
          const imageUrl = URL.createObjectURL(imageBlob);
          setVenueImage(imageUrl);
        } catch (imgError) {
          console.warn('Could not load venue image:', imgError);
          // Use fallback image if image fetch fails
          setVenueImage('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80');
        }

      } catch (error) {
        console.error('Error fetching venue details:', error);
        if (error.response?.status === 404) {
          setError('Venue not found');
        } else if (error.response?.status === 401) {
          setError('Please log in to view venue details');
        } else {
          setError('Failed to load venue details. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVenueDetails();

    // Cleanup function to revoke blob URL
    return () => {
      if (venueImage && venueImage.startsWith('blob:')) {
        URL.revokeObjectURL(venueImage);
      }
    };
  }, [id]);

  const handleBookVenue = () => {
    navigate('/venue-booking', { state: { venueId: id, venueName: venue?.venueName } });
  };

  const handleBackToVenues = () => {
    navigate('/venues');
  };

  if (loading) {
    return (
      <div className="user-view-venue-page">
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading venue details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-view-venue-page">
        <Header />
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Oops! Something went wrong</h2>
          <p className="error-message">{error}</p>
          <div className="error-actions">
            <button onClick={handleBackToVenues} className="back-button">
              ← Back to Venues
            </button>
            <button onClick={() => window.location.reload()} className="retry-button">
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="user-view-venue-page">
        <Header />
        <div className="error-container">
          <div className="error-icon">🏢</div>
          <h2>Venue Not Found</h2>
          <p className="error-message">The venue you're looking for doesn't exist or has been removed.</p>
          <button onClick={handleBackToVenues} className="back-button">
            ← Back to Venues
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="user-view-venue-page">
      <Header />
      
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb-container">
        <div className="breadcrumb">
          <Link to="/home" className="breadcrumb-link">Home</Link>
          <span className="breadcrumb-separator">›</span>
          <Link to="/venues" className="breadcrumb-link">Venues</Link>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">{venue.venueName}</span>
        </div>
      </div>

      <div className="venue-detail-container">
        {/* Hero Section */}
        <div className="venue-hero">
          <div className="venue-image-container">
            <img
              src={venueImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'}
              alt={venue.venueName}
              className="venue-hero-image"
            />
            <div className="venue-hero-overlay">
              <div className="venue-hero-content">
                <h1 className="venue-title">{venue.venueName}</h1>
                <div className="venue-location">
                  <span className="location-icon">📍</span>
                  {venue.location}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="venue-content">
          <div className="venue-main-info">
            {/* Quick Stats */}
            <div className="venue-stats">
              <div className="stat-item">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <div className="stat-label">Capacity</div>
                  <div className="stat-value">{venue.capacity} guests</div>
                </div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon">💰</div>
                <div className="stat-content">
                  <div className="stat-label">Price</div>
                  <div className="stat-value">NPR {venue.price}/hour</div>
                </div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon">⭐</div>
                <div className="stat-content">
                  <div className="stat-label">Rating</div>
                  <div className="stat-value">4.8/5</div>
                </div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon">📅</div>
                <div className="stat-content">
                  <div className="stat-label">Status</div>
                  <div className="stat-value">{venue.status || 'Available'}</div>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="venue-description">
              <h2>About This Venue</h2>
              <p>
                {venue.description || 
                `${venue.venueName} is a premium venue located in ${venue.location}. 
                Perfect for weddings, corporate events, and special celebrations. 
                With a capacity of ${venue.capacity} guests, this venue offers 
                modern amenities and elegant décor to make your event memorable.`}
              </p>
            </div>

            {/* Features Section */}
            <div className="venue-features">
              <h2>Features & Amenities</h2>
              <div className="features-grid">
                <div className="feature-item">
                  <span className="feature-icon">🅿️</span>
                  <span>Free Parking</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📶</span>
                  <span>WiFi Available</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">❄️</span>
                  <span>Air Conditioning</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🎵</span>
                  <span>Sound System</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">💡</span>
                  <span>Professional Lighting</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🍽️</span>
                  <span>Catering Available</span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="venue-contact">
              <h2>Contact Information</h2>
              <div className="contact-details">
                <div className="contact-item">
                  <span className="contact-icon">📧</span>
                  <span>info@{venue.venueName?.toLowerCase().replace(/\s+/g, '')}.com</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">📞</span>
                  <span>+977-1-4567890</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">🌐</span>
                  <span>www.{venue.venueName?.toLowerCase().replace(/\s+/g, '')}.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="venue-sidebar">
            <div className="booking-card">
              <div className="booking-header">
                <h3>Book This Venue</h3>
                <div className="price-display">
                  <span className="price">NPR {venue.price}</span>
                  <span className="price-unit">/hour</span>
                </div>
              </div>
              
              <div className="booking-content">
                <p className="booking-description">
                  Ready to book this amazing venue for your event?
                </p>
                
                <button onClick={handleBookVenue} className="book-now-button">
                  Book Now
                </button>
                
                <div className="booking-note">
                  <small>* Final pricing may vary based on event requirements</small>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              <button onClick={handleBackToVenues} className="action-button secondary">
                ← Back to Venues
              </button>
              <button onClick={() => window.print()} className="action-button secondary">
                🖨️ Print Details
              </button>
              <button onClick={() => navigator.share && navigator.share({
                title: venue.venueName,
                text: `Check out ${venue.venueName} - ${venue.location}`,
                url: window.location.href
              })} className="action-button secondary">
                📤 Share
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UserViewVenue;