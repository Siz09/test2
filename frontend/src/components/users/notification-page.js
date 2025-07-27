"use client"

import { useState, useEffect } from "react"
import { notificationService } from "../../services/api"
import "../../styles/notification-page.css"
import { useNotifications } from "../notifications/NotificationProvider"

const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Use real-time notifications from context
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    clearAllNotifications,
    isConnected,
    connectionError 
  } = useNotifications();

  useEffect(() => {
    setLoading(false);
    if (connectionError) {
      setError("WebSocket connection failed. Some notifications may not be real-time.");
    }
  }, [connectionError]);

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "unread") return !notification.read
    if (activeTab === "read") return notification.read
    return true // 'all' tab
  })

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  if (loading) {
    return (
      <div className="notifications-container">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '300px',
          fontSize: '18px',
          color: '#666'
        }}>
          Loading notifications...
        </div>
      </div>
    )
  }

  return (
    <div className="notifications-container">
      {/* Error Message */}
      {(error || connectionError) && (
        <div style={{
          background: '#fff3cd',
          color: '#856404',
          padding: '12px',
          marginBottom: '20px',
          borderRadius: '4px',
          border: '1px solid #ffeaa7'
        }}>
          ⚠️ {error || connectionError}
        </div>
      )}

      {/* Connection Status */}
      {!isConnected && (
        <div style={{
          background: '#fef3c7',
          color: '#92400e',
          padding: '8px',
          marginBottom: '16px',
          borderRadius: '4px',
          border: '1px solid #fbbf24',
          fontSize: '14px',
          textAlign: 'center'
        }}>
          🔄 Connecting to real-time notifications...
        </div>
      )}

      {/* Header */}
      <div className="header">
        <h1 className="title">Notifications</h1>
        <div className="header-buttons">
          <button onClick={markAllAsRead} disabled={unreadCount === 0} className="mark-all-btn">
            Mark all as read
          </button>
          <button onClick={clearAllNotifications} disabled={notifications.length === 0} className="clear-all-btn">
            Clear all
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button onClick={() => setActiveTab("all")} className={`tab-button ${activeTab === "all" ? "active" : ""}`}>
          All notifications
          {notifications.length > 0 && <span className="tab-count gray">{notifications.length}</span>}
          }
        </button>
        <button
          onClick={() => setActiveTab("unread")}
          className={`tab-button ${activeTab === "unread" ? "active" : ""}`}
        >
          Unread
          {unreadCount > 0 && <span className="tab-count red">{unreadCount}</span>}
          }
        </button>
        <button onClick={() => setActiveTab("read")} className={`tab-button ${activeTab === "read" ? "active" : ""}`}>
          Read
          {notifications.filter((n) => n.read).length > 0 && (
            <span className="tab-count gray">{notifications.filter((n) => n.read).length}</span>
          )}
        </button>
      </div>

      {/* Notifications Card */}
      <div className="notifications-card">
        <div className="card-header">
          <h2 className="card-title">Your Notifications</h2>
          <p className="card-subtitle">Stay updated with important notices</p>
        </div>
        <div className="card-content">
          {filteredNotifications.length === 0 ? (
            <div className="empty-state">
              <p>No notifications to show</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`notification-item ${!notification.read ? "unread" : "read"}`}
              >
                <div className={`notification-dot ${notification.type === 'success' ? 'success' : notification.type === 'warning' ? 'warning' : 'success'}`} />
                <div className="notification-content">
                  <div className="notification-text-container">
                    <p className="notification-text">{notification.message}</p>
                    {!notification.read && <div className="unread-indicator" />}
                  </div>
                  <p className="notification-time">
                    {notification.timestamp 
                      ? new Date(notification.timestamp).toLocaleString()
                      : 'Just now'
                    }
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default NotificationsPage