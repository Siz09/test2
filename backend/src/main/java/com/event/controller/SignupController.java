package com.event.controller;

import java.time.LocalDateTime;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import com.event.repository.UserRepo;
import com.event.configuration.JwtUtil;
import com.event.dto.LoginRequest;
import com.event.dto.SignupRequest;
import com.event.model.Admin;
import com.event.model.Attendee;
import com.event.model.Partner;
import com.event.model.User;


@RestController
@RequestMapping("/auth") 
public class SignupController {
	
	@Autowired
	private UserRepo uRepo;
	
	@Autowired
	private JwtUtil jwtUtil;
	
	 @Autowired
	 private BCryptPasswordEncoder passwordEncoder;
	

	@PostMapping("signup")
	public ResponseEntity<?> register(@RequestBody @Validated SignupRequest signupRequest) {
	    try {
	        User user;
	        switch (signupRequest.getRole().toUpperCase()) {
	            case "ADMIN": 
	                user = new Admin();
	                break;
	            case "PARTNER":
	                user = new Partner();
	                break;
	            case "ATTENDEE":
	                user = new Attendee();
	                break;
	            default:
	                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid role");
	        }

	        user.setEmail(signupRequest.getEmail());
	        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
	        user.setRole(signupRequest.getRole());
	        user.setPhoneNumber(signupRequest.getPhoneNumber());
	        user.setFullname(signupRequest.getFullname());
	        user.setBusinessTranscripts(signupRequest.getBusinessTranscripts());
	        user.setPanCard(signupRequest.getPanCard());
	        user.setCompany(signupRequest.getCompany());
	        user.setJoinDate(LocalDateTime.now()); 
	        user.setStatus(signupRequest.getStatus());
	      
	        if (uRepo.findByEmail(user.getEmail()).isPresent()) {
	            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already registered");
	        }
	        
	        uRepo.save(user);
	        return ResponseEntity.ok("User registered successfully");
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Registration failed");
	    }
	}

	
	@PostMapping("login")
	public ResponseEntity<?> login(@RequestBody @Validated LoginRequest loginRequest) {
	    try {
	        User existingUser = uRepo.findByEmail(loginRequest.getEmail())
	                                .orElse(null);

	        if (existingUser == null || 
	            !passwordEncoder.matches(loginRequest.getPassword(), existingUser.getPassword())) {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
	                                 .body("Invalid username or password");
	        }

	        String role = existingUser.getRole();
	        String token = jwtUtil.generateToken(existingUser.getEmail(), role, existingUser.getUser_id());
	        String redirectUrl;

	        switch (role.toLowerCase()) {
	            case "admin"    -> redirectUrl = "/admin/dashboard";
	            case "partner"  -> redirectUrl = "/partner/dashboard";
	            case "attendee" -> redirectUrl = "/home";
	            default -> {
	                return ResponseEntity.status(HttpStatus.FORBIDDEN)
	                                     .body("Unknown role");
	            }
	        }

	        return ResponseEntity.ok(Map.of(
	            "message",  "Login successful",
	            "token",    token,
	            "role",     role,
	            "redirect", redirectUrl
	        ));
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                             .body("Login failed");
	    }
	}

	

	
	
	
	
	
	
}
