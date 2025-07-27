package com.event.dto;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonFormat;

public class NotificationDTO {
    private Long id;
    private Long userId;
    private String message;
    private String type; // success, warning, error, info
    private boolean read;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timestamp;

    // Constructors
    public NotificationDTO() {
        this.timestamp = LocalDateTime.now();
        this.read = false;
    }

    public NotificationDTO(Long userId, String message, String type) {
        this();
        this.userId = userId;
        this.message = message;
        this.type = type;
    }

    public NotificationDTO(Long id, Long userId, String message, String type, boolean read, LocalDateTime timestamp) {
        this.id = id;
        this.userId = userId;
        this.message = message;
        this.type = type;
        this.read = read;
        this.timestamp = timestamp;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}