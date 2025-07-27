package com.event.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.event.dto.NotificationDTO;

@Service
public class NotificationService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * Send notification to a specific user
     */
    public void sendNotificationToUser(Long userId, String message, String type) {
        NotificationDTO notification = new NotificationDTO(userId, message, type);
        
        // Send to specific user topic
        messagingTemplate.convertAndSend(
            "/topic/notifications/" + userId, 
            notification
        );
        
        System.out.println("Notification sent to user " + userId + ": " + message);
    }

    /**
     * Send notification to all users (broadcast)
     */
    public void sendNotificationToAll(String message, String type) {
        NotificationDTO notification = new NotificationDTO(null, message, type);
        
        // Send to general topic
        messagingTemplate.convertAndSend("/topic/notifications/all", notification);
        
        System.out.println("Broadcast notification sent: " + message);
    }

    /**
     * Send booking confirmation notification
     */
    public void sendBookingConfirmation(Long userId, String venueName, String bookingDate) {
        String message = String.format("Your booking for %s on %s has been confirmed!", venueName, bookingDate);
        sendNotificationToUser(userId, message, "success");
    }

    /**
     * Send payment success notification
     */
    public void sendPaymentSuccess(Long userId, String amount, String bookingReference) {
        String message = String.format("Payment of %s has been processed successfully for booking %s", amount, bookingReference);
        sendNotificationToUser(userId, message, "success");
    }

    /**
     * Send booking reminder notification
     */
    public void sendBookingReminder(Long userId, String venueName, String eventDate) {
        String message = String.format("Reminder: Your event at %s is scheduled for %s", venueName, eventDate);
        sendNotificationToUser(userId, message, "warning");
    }

    /**
     * Send venue approval notification to partner
     */
    public void sendVenueApproval(Long partnerId, String venueName) {
        String message = String.format("Your venue '%s' has been approved and is now live!", venueName);
        sendNotificationToUser(partnerId, message, "success");
    }
}