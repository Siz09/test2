import React, { useState, useEffect } from "react";
import { MapPin, Calendar, Eye, Download, X } from "lucide-react";
import { bookingService } from "../../services/api";
import Header from "./Header";
import "../../styles/UserViewBooking.css";

export default function UserViewBookings() {
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await bookingService.getUserBookings();
        setBookings(response);
      } catch (err) {
        setError("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "confirmed":
        return "status-badge confirmed";
      case "pending":
        return "status-badge pending";
      case "cancelled":
        return "status-badge cancelled";
      default:
        return "status-badge";
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeStr) => {
    const time = new Date(`1970-01-01T${timeStr}`);
    return time.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const filteredBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.date);
    const now = new Date();

    if (statusFilter && booking.status !== statusFilter) return false;

    if (dateFilter === "upcoming" && bookingDate <= now) return false;
    if (dateFilter === "past" && bookingDate > now) return false;
    if (dateFilter === "this-month") {
      if (
        bookingDate.getMonth() !== now.getMonth() ||
        bookingDate.getFullYear() !== now.getFullYear()
      ) {
        return false;
      }
    }

    return true;
  });

  if (error) {
    return (
      <div className="page-container">
        <Header />
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Header />

      <h1>My Bookings</h1>
      <p>Track and manage your venue reservations</p>

      <div className="filter-bar">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
          <option value="">All Dates</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
          <option value="this-month">This Month</option>
        </select>
      </div>

      {loading ? (
        <p>Loading bookings...</p>
      ) : filteredBookings.length === 0 ? (
        <div className="empty-state">
          <Calendar size={48} />
          <h3>No bookings found</h3>
          <p>Try adjusting filters or book a new venue</p>
          <button onClick={() => { setStatusFilter(""); setDateFilter(""); }}>
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="bookings-grid">
          {filteredBookings.map((booking) => (
            <div className="booking-card" key={booking.id}>
              <div className="booking-header">
                <div>
                  <h2>{booking.venueName}</h2>
                  {booking.location && (
                    <div className="location">
                      <MapPin size={16} />
                      <span>{booking.location}</span>
                    </div>
                  )}
                </div>
                <span className={getStatusBadgeClass(booking.status)}>{booking.status}</span>
              </div>

              <div className="booking-details">
                <div><strong>Date:</strong> {formatDate(booking.date)}</div>
                <div><strong>Time:</strong> {formatTime(booking.startTime)}</div>
                <div><strong>Duration:</strong> {booking.duration} hrs</div>
                <div><strong>Guests:</strong> {booking.guests}</div>
              </div>

              <div className="booking-actions">
                <button onClick={() => console.log("View", booking.id)}>
                  <Eye size={16} /> View
                </button>
                {booking.status === "pending" ? (
                  <button className="cancel" onClick={() => console.log("Cancel", booking.id)}>
                    <X size={16} /> Cancel
                  </button>
                ) : (
                  <button onClick={() => console.log("Download", booking.id)}>
                    <Download size={16} /> Download
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
