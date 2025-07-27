import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import useWebSocketNotifications from '../../hooks/useWebSocketNotifications';
import { useUserSession } from '../../context/UserSessionContext';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user, isUserLoggedIn } = useUserSession();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleNotificationReceived = useCallback((notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Show browser notification if permission granted
    if (Notification.permission === 'granted') {
      new Notification('New Notification', {
        body: notification.message,
        icon: '/favicon.ico',
        tag: `notification-${notification.id || Date.now()}`,
      });
    }

    // Optional: Play notification sound
    // const audio = new Audio('/notification-sound.mp3');
    // audio.play().catch(e => console.log('Could not play notification sound'));
  }, []);

  const userId = user?.user_id || user?.id;
  
  const { isConnected, connectionError, sendMessage } = useWebSocketNotifications(
    isUserLoggedIn ? userId : null,
    handleNotificationReceived
  );

  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  }, []);

  const clearNotification = useCallback((notificationId) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
    setUnreadCount(prev => {
      const notification = notifications.find(n => n.id === notificationId);
      return notification && !notification.read ? Math.max(0, prev - 1) : prev;
    });
  }, [notifications]);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const value = {
    notifications,
    unreadCount,
    isConnected,
    connectionError,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    sendMessage,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};