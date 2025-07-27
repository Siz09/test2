import React, { useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export default function WebSocketTest() {
  const userId = localStorage.getItem('userId'); // Get from localStorage

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      debug: (str) => console.log('STOMP:', str),
      onConnect: (frame) => {
        console.log('✅ Connected:', frame);

        // Global notifications
        client.subscribe('/topic/notifications/all', (msg) => {
          console.log('📢 Broadcast message:', msg.body);
        });

        // User-specific notifications if logged in
        if (userId) {
          client.subscribe(`/topic/notifications/${userId}`, (msg) => {
            console.log(`👤 Message for user ${userId}:`, msg.body);
          });
        }
      },
      onWebSocketError: (error) => console.error('❌ WebSocket error:', error),
      onStompError: (frame) => console.error('❌ STOMP error:', frame.headers['message']),
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [userId]);

  return <div>WebSocket test running... Check console.</div>;
}
