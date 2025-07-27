"use client"

import { useState, useEffect } from "react"
import "../../styles/Header.css"
import { useUserSession } from "../../context/UserSessionContext";



// SVG Icons (keeping all existing icons)
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
)

const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
  </svg>
)

const ProfileMenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
)

const LogoutMenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16,17 21,12 16,7"></polyline>
    <line x1="21" x2="9" y1="12" y2="12"></line>
  </svg>
)

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
)

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="4" x2="20" y1="12" y2="12"></line>
    <line x1="4" x2="20" y1="6" y2="6"></line>
    <line x1="4" x2="20" y1="18" y2="18"></line>
  </svg>
)

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6 6 18"></path>
    <path d="m6 6 12 12"></path>
  </svg>
)

const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
)

const ServiceIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
  </svg>
)

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12,6 12,12 16,14"></polyline>
  </svg>
)

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6 6 18"></path>
    <path d="m6 6 12 12"></path>
  </svg>
)

// Sample data
const sampleNotifications = [
  {
    id: 1,
    text: "Your booking for Grand Ballroom has been confirmed",
    time: "Just now",
    color: "green",
  },
  {
    id: 2,
    text: "Payment of NPR 30,000 has been processed successfully",
    time: "1 min ago",
    color: "blue",
  },
]

const globalSearchData = {
  venues: [
    {
      id: 1,
      title: "Grand Ballroom",
      description: "Large venue for 500+ guests",
      location: "Downtown",
      price: "NPR 50,000/day",
    },
    {
      id: 2,
      title: "Conference Room A",
      description: "Meeting room for up to 20 people",
      location: "Business District",
      price: "NPR 5,000/day",
    },
  ],
  services: [
    {
      id: 1,
      title: "Wedding Planning",
      description: "Complete wedding coordination",
      category: "Wedding",
      price: "NPR 15,000",
    },
    {
      id: 2,
      title: "Catering Service",
      description: "Full meal service for events",
      category: "Food",
      price: "NPR 800/person",
    },
  ],
}

export default function Header({ hasNotifications = true, isLoggedIn = false, user = null, onLogout }) {
  // Always call hooks at the top
  const { user: sessionUser, isUserLoggedIn, logout, loading } = useUserSession();

  // State management
  const [recentSearches, setRecentSearches] = useState(["Grand Ballroom", "Wedding Planning", "Conference Room"])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false)
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  
 

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownOpen && !event.target.closest(".profile-container")) {
        setProfileDropdownOpen(false)
      }
      if (notificationDropdownOpen && !event.target.closest(".notification-container")) {
        setNotificationDropdownOpen(false)
      }
      if (searchDropdownOpen && !event.target.closest(".global-search-wrapper")) {
        setSearchDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [profileDropdownOpen, notificationDropdownOpen, searchDropdownOpen])

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [isMobileMenuOpen])

  if (loading) return null; // Or a skeleton header if you want

  console.log("Header isLoggedIn:", isUserLoggedIn);
  // Event handlers
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleLogout = async () => {
  try {
    logout();               // <-- Call context logout method here
    setProfileDropdownOpen(false);
    window.location.href = "/login"; // Navigate to home or login
    console.log("Logged out successfully");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};


  const handleSignInClick = () => {
    // Replace with your navigation method
    window.location.href = "/login"
  }

  const handleNavigation = (path) => {
    // Replace with your navigation method
    window.location.href = path
    setIsMobileMenuOpen(false)
  }

  // Search functionality
  const handleGlobalSearch = (query, type = null) => {
    console.log("Global search:", query, type ? `in ${type}` : "")

    if (query && !recentSearches.includes(query)) {
      setRecentSearches((prev) => [query, ...prev.slice(0, 4)])
    }

    setSearchDropdownOpen(false)
    setSearchQuery("")

    if (type === "venues") {
      handleNavigation("/venues")
    } else {
      handleNavigation(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  const removeRecentSearch = (searchTerm) => {
    setRecentSearches((prev) => prev.filter((term) => term !== searchTerm))
  }

  const filterGlobalResults = (query) => {
    if (!query.trim()) return null

    const results = {}
    const searchLower = query.toLowerCase()

    const venueResults = globalSearchData.venues.filter(
      (item) =>
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.location.toLowerCase().includes(searchLower),
    )
    if (venueResults.length > 0) results.venues = venueResults.slice(0, 3)

    const serviceResults = globalSearchData.services.filter(
      (item) =>
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.category.toLowerCase().includes(searchLower),
    )
    if (serviceResults.length > 0) results.services = serviceResults.slice(0, 3)

    return Object.keys(results).length > 0 ? results : null
  }

  const renderSearchComponent = () => {
    const searchResults = filterGlobalResults(searchQuery)

    return (
      <div className="global-search-wrapper">
        <button className="search-trigger-btn" onClick={() => setSearchDropdownOpen(!searchDropdownOpen)}>
          <SearchIcon />
        </button>
        <div className={`search-results-panel ${searchDropdownOpen ? "active" : ""}`}>
          <div className="search-input-section">
            <input
              type="text"
              placeholder="Search venues, services..."
              className="search-field"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleGlobalSearch(searchQuery)}
              autoFocus
            />
          </div>

          <div className="search-results-content">
            {searchQuery ? (
              searchResults ? (
                <>
                  {searchResults.venues && (
                    <div className="search-category">
                      <h4 className="search-category-header">Venues</h4>
                      {searchResults.venues.map((venue) => (
                        <button
                          key={venue.id}
                          className="search-option"
                          onClick={() => handleGlobalSearch(venue.title, "venues")}
                        >
                          <MapPinIcon className="search-option-icon" />
                          <div className="search-option-details">
                            <p className="search-option-title">{venue.title}</p>
                            <p className="search-option-desc">{venue.description}</p>
                            <p className="search-option-meta">
                              {venue.location} • {venue.price}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {searchResults.services && (
                    <div className="search-category">
                      <h4 className="search-category-header">Services</h4>
                      {searchResults.services.map((service) => (
                        <button
                          key={service.id}
                          className="search-option"
                          onClick={() => handleGlobalSearch(service.title, "services")}
                        >
                          <ServiceIcon className="search-option-icon" />
                          <div className="search-option-details">
                            <p className="search-option-title">{service.title}</p>
                            <p className="search-option-desc">{service.description}</p>
                            <p className="search-option-meta">
                              {service.category} • {service.price}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="search-empty-state">No results found for "{searchQuery}"</div>
              )
            ) : (
              <>
                {recentSearches.length > 0 && (
                  <div className="search-category">
                    <h4 className="search-category-header">Recent Searches</h4>
                    {recentSearches.map((search, index) => (
                      <div key={index} className="search-option" onClick={() => handleGlobalSearch(search)}>
                        <div className="recent-search-entry">
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <ClockIcon className="search-option-icon" />
                            <span className="search-option-title">{search}</span>
                          </div>
                          <button
                            className="recent-search-delete"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeRecentSearch(search)
                            }}
                          >
                            <XIcon style={{ width: "12px", height: "12px" }} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="search-category">
                  <h4 className="search-category-header">Popular Venues</h4>
                  {globalSearchData.venues.map((venue) => (
                    <button
                      key={venue.id}
                      className="search-option"
                      onClick={() => handleGlobalSearch(venue.title, "venues")}
                    >
                      <MapPinIcon className="search-option-icon" />
                      <div className="search-option-details">
                        <p className="search-option-title">{venue.title}</p>
                        <p className="search-option-desc">{venue.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="search-actions-bar">
            <button className="search-view-all-btn" onClick={() => handleGlobalSearch(searchQuery || "all results")}>
              {searchQuery ? `See all results for "${searchQuery}"` : "View all categories"}
            </button>
          </div>
        </div>
      </div>
    )
  }

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
        <span className="nav-link" onClick={() => handleNavigation("/home")}>
          Home
        </span>
        <span className="nav-link" onClick={() => handleNavigation("/venues")}>
          Venue
        </span>
        <span className="nav-link" onClick={() => handleNavigation("/about")}>
          About
        </span>
        {/* <span className="nav-link" onClick={() => handleNavigation("/media")}>
          Media
        </span> */}
        <span className="nav-link" onClick={() => handleNavigation("/contact")}>
          Contact Us
        </span>
      </div>

      <div className="navbar-right">
        {renderSearchComponent()}

        {isUserLoggedIn ? (
          <div className="user-actions">
            <div className="notification-container">
              <button
                className="notification-icon"
                onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
              >
                <BellIcon />
                {hasNotifications && <div className="notification-badge"></div>}
              </button>
              <div className={`notification-dropdown ${notificationDropdownOpen ? "active" : ""}`}>
                <div className="notification-header">
                  <h3 className="notification-title">Notifications</h3>
                  <button className="mark-all-read" onClick={() => console.log("Mark all as read")}>
                    Mark all as read
                  </button>
                </div>
                <div className="notification-list">
                  {sampleNotifications.length > 0 ? (
                    sampleNotifications.map((notification) => (
                      <div key={notification.id} className="notification-item">
                        <div className={`notification-dot ${notification.color}`}></div>
                        <div className="notification-content">
                          <p className="notification-text">{notification.text}</p>
                          <p className="notification-time">{notification.time}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-notifications">No new notifications</div>
                  )}
                </div>
                <div className="notification-footer">
                  <button className="view-all-button" onClick={() => console.log("View all notifications")}>
                    View all notifications
                  </button>
                </div>
              </div>
            </div>
            <div className="profile-container">
              <button className="profile-icon" onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}>
                <UserIcon />
              </button>
              <div className={`profile-dropdown ${profileDropdownOpen ? "active" : ""}`}>
                <button className="dropdown-item" onClick={() => handleNavigation("/profile")}>
                  <ProfileMenuIcon />
                  Profile
                </button>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item" onClick={handleLogout}>
                  <LogoutMenuIcon />
                  Logout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button className="sign-in-button" onClick={handleSignInClick}>
            Sign In
          </button>
        )}

        <button className="mobile-menu-button" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Enhanced Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? "active" : ""}`}>
        <div className="mobile-menu-content">
          <div className="mobile-nav-links">
            <span className="mobile-nav-link" onClick={() => handleNavigation("/home")}>
              Home
            </span>
            <span className="mobile-nav-link" onClick={() => handleNavigation("/venues")}>
              Venue
            </span>
            <span className="mobile-nav-link" onClick={() => handleNavigation("/about")}>
              About
            </span>
            <span className="mobile-nav-link" onClick={() => handleNavigation("/media")}>
              Media
            </span>
            <span className="mobile-nav-link" onClick={() => handleNavigation("/contact")}>
              Contact Us
            </span>
          </div>

          <div className="mobile-nav-divider"></div>

          <div className="mobile-nav-actions">
            {isUserLoggedIn ? (
              <div className="mobile-user-actions">
                <div className="mobile-action-row">
                  <button
                    className="mobile-action-btn"
                    onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
                  >
                    <BellIcon />
                    <span>Notifications</span>
                    {hasNotifications && <div className="notification-badge"></div>}
                  </button>
                  <button className="mobile-action-btn" onClick={() => handleNavigation("/profile")}>
                    <UserIcon />
                    <span>Profile</span>
                  </button>
                </div>
                <button className="mobile-logout-btn" onClick={handleLogout}>
                  <LogoutMenuIcon />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button className="mobile-sign-in-button" onClick={handleSignInClick}>
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>}
    </nav>
  )
}
