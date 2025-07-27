import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationToast = ({ notification, onClose, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastStyle = (type) => {
    const baseStyle = {
      padding: '16px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      maxWidth: '400px',
      margin: '8px',
    };

    switch (type) {
      case 'success':
        return {
          ...baseStyle,
          backgroundColor: '#f0fdf4',
          borderLeft: '4px solid #22c55e',
          color: '#15803d',
        };
      case 'warning':
        return {
          ...baseStyle,
          backgroundColor: '#fffbeb',
          borderLeft: '4px solid #f59e0b',
          color: '#92400e',
        };
      case 'error':
        return {
          ...baseStyle,
          backgroundColor: '#fef2f2',
          borderLeft: '4px solid #ef4444',
          color: '#dc2626',
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: '#f0f9ff',
          borderLeft: '4px solid #3b82f6',
          color: '#1e40af',
        };
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.8 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={getToastStyle(notification.type)}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <span style={{ fontSize: '20px', flexShrink: 0 }}>
              {getIcon(notification.type)}
            </span>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: '500', lineHeight: '1.4' }}>
                {notification.message}
              </p>
              {notification.timestamp && (
                <p style={{ 
                  margin: '4px 0 0 0', 
                  fontSize: '12px', 
                  opacity: 0.7,
                  fontWeight: '400'
                }}>
                  {new Date(notification.timestamp).toLocaleTimeString()}
                </p>
              )}
            </div>
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer',
                opacity: 0.7,
                padding: '0',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.opacity = '1';
                e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.opacity = '0.7';
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationToast;