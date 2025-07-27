package com.event.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.web.bind.annotation.*;

import com.event.dto.NotificationDTO;
import com.event.service.NotificationService;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    /**
     * REST endpoint to send notification (for testing or admin use)
     */
    @PostMapping("/send")
    public ResponseEntity<String> sendNotification(@RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.valueOf(request.get("userId").toString());
            String message = request.get("message").toString();
            String type = request.getOrDefault("type", "info").toString();

            notificationService.sendNotificationToUser(userId, message, type);
            
            return ResponseEntity.ok("Notification sent successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to send notification: " + e.getMessage());
        }
    }

    /**
     * REST endpoint to broadcast notification to all users
     */
    @PostMapping("/broadcast")
    public ResponseEntity<String> broadcastNotification(@RequestBody Map<String, Object> request) {
        try {
            String message = request.get("message").toString();
            String type = request.getOrDefault("type", "info").toString();

            notificationService.sendNotificationToAll(message, type);
            
            return ResponseEntity.ok("Broadcast notification sent successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to broadcast notification: " + e.getMessage());
        }
    }

    /**
     * WebSocket message mapping for client-sent messages
     */
    @MessageMapping("/notification")
    public void handleNotification(@Payload NotificationDTO notification, SimpMessageHeaderAccessor headerAccessor) {
        // Handle incoming WebSocket messages from clients if needed
        System.out.println("Received notification from client: " + notification.getMessage());
    }
}