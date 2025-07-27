import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import NotificationToast from './NotificationToast';
import { useNotifications } from './NotificationProvider';

const NotificationContainer = () => {
  const { notifications } = useNotifications();
  const [toastNotifications, setToastNotifications] = useState([]);

  useEffect(() => {
    // Show toast for new notifications
    const newNotifications = notifications.filter(
      notification => !toastNotifications.find(toast => toast.id === notification.id)
    );

    if (newNotifications.length > 0) {
      setToastNotifications(prev => [
        ...prev,
        ...newNotifications.map(notification => ({
          ...notification,
          toastId: `toast-${notification.id || Date.now()}-${Math.random()}`,
        }))
      ]);
    }
  }, [notifications, toastNotifications]);

  const removeToast = (toastId) => {
    setToastNotifications(prev => prev.filter(toast => toast.toastId !== toastId));
  };

  const containerStyle = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 9999,
    pointerEvents: 'none',
  };

  const toastWrapperStyle = {
    pointerEvents: 'auto',
  };

  return createPortal(
    <div style={containerStyle}>
      {toastNotifications.map((notification) => (
        <div key={notification.toastId} style={toastWrapperStyle}>
          <NotificationToast
            notification={notification}
            onClose={() => removeToast(notification.toastId)}
            duration={5000}
          />
        </div>
      ))}
    </div>,
    document.body
  );
};

export default NotificationContainer;