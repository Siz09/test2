import { useEffect, useRef, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const useWebSocketNotifications = (userId, onNotificationReceived) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const clientRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    if (!userId) {
      console.log('No userId provided, skipping WebSocket connection');
      return;
    }

    // Clean up existing connection
    if (clientRef.current) {
      clientRef.current.deactivate();
    }

    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      connectHeaders: {
        // Add JWT token if available
        Authorization: `Bearer ${localStorage.getItem('jwtToken') || ''}`,
      },
      debug: (str) => {
        console.log('STOMP Debug:', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = (frame) => {
      console.log('Connected to WebSocket:', frame);
      setIsConnected(true);
      setConnectionError(null);
      reconnectAttempts.current = 0;

      // Subscribe to user-specific notifications
      client.subscribe(`/topic/notifications/${userId}`, (message) => {
        try {
          const notification = JSON.parse(message.body);
          console.log('Received notification:', notification);
          
          if (onNotificationReceived) {
            onNotificationReceived(notification);
          }
        } catch (error) {
          console.error('Error parsing notification:', error);
        }
      });

      // Subscribe to broadcast notifications
      client.subscribe('/topic/notifications/all', (message) => {
        try {
          const notification = JSON.parse(message.body);
          console.log('Received broadcast notification:', notification);
          
          if (onNotificationReceived) {
            onNotificationReceived(notification);
          }
        } catch (error) {
          console.error('Error parsing broadcast notification:', error);
        }
      });
    };

    client.onStompError = (frame) => {
      console.error('Broker reported error:', frame.headers['message']);
      console.error('Additional details:', frame.body);
      setConnectionError('Connection error occurred');
      setIsConnected(false);
    };

    client.onWebSocketError = (error) => {
      console.error('WebSocket error:', error);
      setConnectionError('WebSocket connection failed');
      setIsConnected(false);
    };

    client.onDisconnect = () => {
      console.log('Disconnected from WebSocket');
      setIsConnected(false);
      
      // Attempt to reconnect if not manually disconnected
      if (reconnectAttempts.current < maxReconnectAttempts) {
        reconnectAttempts.current++;
        console.log(`Attempting to reconnect... (${reconnectAttempts.current}/${maxReconnectAttempts})`);
        
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 5000 * reconnectAttempts.current); // Exponential backoff
      } else {
        setConnectionError('Failed to reconnect after multiple attempts');
      }
    };

    clientRef.current = client;
    client.activate();
  }, [userId, onNotificationReceived]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (clientRef.current) {
      clientRef.current.deactivate();
      clientRef.current = null;
    }
    
    setIsConnected(false);
    setConnectionError(null);
    reconnectAttempts.current = 0;
  }, []);

  const sendMessage = useCallback((destination, message) => {
    if (clientRef.current && isConnected) {
      clientRef.current.publish({
        destination,
        body: JSON.stringify(message),
      });
    } else {
      console.warn('Cannot send message: WebSocket not connected');
    }
  }, [isConnected]);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    connectionError,
    connect,
    disconnect,
    sendMessage,
  };
};

export default useWebSocketNotifications;