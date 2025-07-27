package com.event.controller;


import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.event.dto.UserAddDTO;
import com.event.model.Partner;
import com.event.model.User;

import com.event.repository.UserRepo;

@RestController
@RequestMapping("/profile/")
public class UserController {

	@Autowired private UserRepo userRepo;
	
	
	@GetMapping("/{userId}")
	public ResponseEntity<UserAddDTO> getProfile(Authentication authentication) {
	  String email = authentication.getName();
	  Optional<User> userOpt = userRepo.findByEmail(email);

	  return userOpt.map(user -> {
	    UserAddDTO dto = new UserAddDTO();
	    dto.setUser_id(user.getUser_id());
	    dto.setFullname(user.getFullname());
	    dto.setEmail(user.getEmail());
	    dto.setPhoneNumber(user.getPhoneNumber());
	    dto.setRole(user.getRole());
	    if (user instanceof Partner) {
	      Partner p = (Partner) user;
	      dto.setCompany(p.getCompany());
	      dto.setPanCard(p.getPanCard());
	      dto.setBusinessTranscripts(p.getBusinessTranscripts());
	    }
	    return ResponseEntity.ok(dto);
	  }).orElseGet(() -> ResponseEntity.notFound().build());
	}

}
