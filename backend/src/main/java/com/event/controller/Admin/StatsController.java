package com.event.controller.Admin;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.event.model.Partner;
import com.event.repository.BookingRepo;
import com.event.repository.PartnerRepo;
import com.event.repository.UserRepo;
import com.event.repository.VenueRepo;

@RestController
@RequestMapping("/api")

public class StatsController {
	
	    @Autowired private UserRepo userRepo;
	    @Autowired private PartnerRepo partnerRepo;
	    @Autowired private VenueRepo venueRepo;
	    @Autowired private BookingRepo bookingRepo;

//	    @GetMapping
//	    public Map<String, Object> stats() {
//	        long users = userRepo.count();
//	        long partners = partnerRepo.count();
//	        long venues = venueRepo.count();
//	        long bookings = bookingRepo.count();
////	        Double revenue = bookingRepo.sumTotalAmount(); // implement this query
//
//	        return Map.of(
//	          "users", users,
//	          "partners", partners,
//	          "venues", venues,
//	          "bookings", bookings
////	          "revenue", revenue
//	        );
//	   
	    
	    @GetMapping("/stats")
	    public Map<String, Object> stats(Authentication authentication) {
	    	   boolean isAdmin = authentication.getAuthorities().stream()
	    	       .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

	    	   if (isAdmin) {
	    	       // Only count users with user_type in ('ADMIN', 'USER', 'PARTNER')
	    		   long users = userRepo.countByUserTypeIn(List.of("ADMIN", "USER", "PARTNER"));
	    	       long partners = partnerRepo.count();
	    	       long venues = venueRepo.count();
	    	       long bookings = bookingRepo.count();

	    	       return Map.of(
	    	           "users", users,
	    	           "partners", partners,
	    	           "venues", venues,
	    	           "bookings", bookings
	    	       );
	    	   } else {
	    	       String email = authentication.getName();
	    	       Partner partner = partnerRepo.findByEmail(email)
	    	           .orElseThrow(() -> new RuntimeException("Partner not found"));

	    	       long partnerVenues = venueRepo.countByPartner(partner);
	    	       long partnerBookings = bookingRepo.countByVenue_Partner(partner);

	    	       return Map.of(
	    	           "users", 0,
	    	           "partners", 0,
	    	           "venues", partnerVenues,
	    	           "bookings", partnerBookings
	    	       );
	    	   }
	    	}
}