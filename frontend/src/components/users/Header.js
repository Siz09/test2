"use client";

import { useState, useEffect } from "react";
import "../../styles/Header.css";
import { useUserSession } from "../../context/UserSessionContext";
import useWebSocketNotifications from "../../hooks/useWebSocketNotifications";
import { useNotifications } from "../../context/NotificationContext";
import { BellIcon, UserIcon, ProfileMenuIcon, LogoutMenuIcon, CloseIcon, MenuIcon } from "../common/Icons";


// SVG icons remain the same as your original code...

export default function Header({ hasNotifications = true }) {
  const { user: sessionUser, isUserLoggedIn, logout, loading } = useUserSession();
  const { notifications, addNotification, markAllAsRead, markAsRead, unreadCount } = useNotifications();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Connect WebSocket when user is logged in
  useWebSocketNotifications((newNotification) => {
    addNotification(newNotification);
  }, isUserLoggedIn);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownOpen && !event.target.closest(".profile-container")) {
        setProfileDropdownOpen(false);
      }
      if (notificationDropdownOpen && !event.target.closest(".notification-container")) {
        setNotificationDropdownOpen(false);
      }
      if (searchDropdownOpen && !event.target.closest(".global-search-wrapper")) {
        setSearchDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileDropdownOpen, notificationDropdownOpen, searchDropdownOpen]);

  if (loading) return null;

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = async () => {
    try {
      logout();
      setProfileDropdownOpen(false);
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleNavigation = (path) => {
    window.location.href = path;
    setIsMobileMenuOpen(false);
  };

  // ✅ Mark single notification as read
  const handleNotificationClick = (id) => {
    markAsRead(id);
    console.log("Notification clicked:", id);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img
          src={require("../../images/logo.png")}
          alt="Coordina Logo"
          className="logo-icon"
          onClick={() => handleNavigation("/home")}
          style={{ cursor: "pointer", width: 100, height: 100 }}
        />
      </div>

      <div className="navbar-center">
        <span className="nav-link" onClick={() => handleNavigation("/home")}>Home</span>
        <span className="nav-link" onClick={() => handleNavigation("/venues")}>Venue</span>
        <span className="nav-link" onClick={() => handleNavigation("/about")}>About</span>
        <span className="nav-link" onClick={() => handleNavigation("/contact")}>Contact Us</span>
      </div>

      <div className="navbar-right">
        {/* Notifications */}
        {isUserLoggedIn ? (
          <div className="user-actions">
            <div className="notification-container">
              <button
                className="notification-icon"
                onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
              >
                <BellIcon />
                {unreadCount > 0 && <div className="notification-badge">{unreadCount}</div>}
              </button>

              {/* ✅ Notification Dropdown */}
              <div className={`notification-dropdown ${notificationDropdownOpen ? "active" : ""}`}>
                <div className="notification-header">
                  <h3 className="notification-title">Notifications</h3>
                  <button className="mark-all-read" onClick={markAllAsRead}>
                    Mark all as read
                  </button>
                </div>

                <div className="notification-list">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`notification-item ${!notification.read ? "unread" : ""}`}
                        onClick={() => handleNotificationClick(notification.id)}
                      >
                        <div className={`notification-dot ${notification.type}`}></div>
                        <div className="notification-content">
                          <p className="notification-text">{notification.message}</p>
                          <p className="notification-time">{notification.timestamp}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-notifications">No new notifications</div>
                  )}
                </div>

                <div className="notification-footer">
                  <button className="view-all-button" onClick={() => handleNavigation("/notifications")}>
                    View all notifications
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Dropdown */}
            <div className="profile-container">
              <button className="profile-icon" onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}>
                <UserIcon />
              </button>
              <div className={`profile-dropdown ${profileDropdownOpen ? "active" : ""}`}>
                <button className="dropdown-item" onClick={() => handleNavigation("/profile")}>
                  <ProfileMenuIcon /> Profile
                </button>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item" onClick={handleLogout}>
                  <LogoutMenuIcon /> Logout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button className="sign-in-button" onClick={() => handleNavigation("/login")}>Sign In</button>
        )}

        <button className="mobile-menu-button" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
    </nav>
  );
}
