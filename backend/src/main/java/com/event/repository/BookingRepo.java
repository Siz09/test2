package com.event.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.event.model.Booking;
import com.event.model.Partner;
import com.event.model.Venue;




@Repository
public interface BookingRepo extends JpaRepository<Booking, Long> {
	
	long countByVenue_Partner(Partner partner);
		
		Optional<Booking> findById(Long id);
		
		@Query("SELECT COUNT(b) FROM Booking b WHERE b.venue.venue_id = :venueId")
		long countBookingsByVenueId(@Param("venueId") Long venueId);

	}

