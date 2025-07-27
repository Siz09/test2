package com.event.controller.Admin;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.event.dto.VenueDTO;
import com.event.model.Partner;
import com.event.model.Venue;
import com.event.repository.PartnerRepo;
import com.event.repository.UserRepo;
import com.event.repository.VenueRepo;

import org.springframework.ui.Model;

@RequestMapping("/venues")
@RestController
public class VenueController {
	
	
	@Autowired
	private VenueRepo venueRepo;
	
	@Autowired
	private PartnerRepo partnerRepo;
	
	
	@Autowired
	private UserRepo userRepo;
	
	@GetMapping
    public List<VenueDTO> getVenues(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            String email = authentication.getName();
            boolean isPartner = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_PARTNER"));

            if (isPartner) {
                Partner partner = partnerRepo.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Partner not found"));
                return venueRepo.findByPartner(partner).stream()
                    .map(VenueDTO::fromVenue)
                    .peek(dto -> dto.setPartnerId(partner.getUser_id())) // set partnerId manually
                    .collect(Collectors.toList());
            }
        }
        return venueRepo.findAll().stream()
            .map(VenueDTO::fromVenue)
            .peek(dto -> {
                // Set partnerId from Venue's partner if present
                Partner partner = venueRepo.findById(dto.getVenue_id())
                        .map(Venue::getPartner)
                        .orElse(null);
                if (partner != null) {
                    dto.setPartnerId(partner.getUser_id());
                }
            })
            .collect(Collectors.toList());
    }

    @PostMapping("/new")
    public Venue saveVenue(@RequestBody Venue venue, Authentication authentication) {
        String email = authentication.getName();
        Partner partner = partnerRepo.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Partner not found"));
        venue.setPartner(partner);
        partner.getVenues().add(venue);
        return venueRepo.save(venue);
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public Venue addVenueByAdmin(@RequestBody VenueDTO request) {
        Partner partner = partnerRepo.findById(request.getPartnerId())
            .orElseThrow(() -> new RuntimeException("Partner not found"));
        Venue venue = new Venue();
        venue.setVenueName(request.getVenueName());
        venue.setLocation(request.getLocation());
        venue.setMapLocationUrl(request.getMapLocationUrl());
        venue.setPrice(request.getPrice());
        venue.setMinBookingHours(request.getMinBookingHours());
        venue.setCapacity(request.getCapacity());
        venue.setOpeningTime(request.getOpeningTime());
        venue.setClosingTime(request.getClosingTime());
        venue.setDescription(request.getDescription());
        venue.setAmenities(request.getAmenities());
        venue.setStatus(request.getStatus());
        venue.setImageUrl(request.getImageUrl());
        venue.setPartner(partner);
        partner.getVenues().add(venue);
        return venueRepo.save(venue);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteVenue(@PathVariable Long id) {
        venueRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<VenueDTO> getVenue(@PathVariable Long id) {
        return venueRepo.findById(id)
            .map(venue -> {
                VenueDTO dto = VenueDTO.fromVenue(venue);
                dto.setPartnerId(venue.getPartner() != null ? venue.getPartner().getUser_id() : null);
                return ResponseEntity.ok(dto);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<VenueDTO> updateVenue(
        @PathVariable Long id,
        @RequestBody VenueDTO payload
    ) {
        return venueRepo.findById(id)
            .map(existing -> {
                existing.setVenueName(payload.getVenueName());
                existing.setLocation(payload.getLocation());
                existing.setMapLocationUrl(payload.getMapLocationUrl());
                existing.setPrice(payload.getPrice());
                existing.setMinBookingHours(payload.getMinBookingHours());
                existing.setCapacity(payload.getCapacity());
                existing.setOpeningTime(payload.getOpeningTime());
                existing.setClosingTime(payload.getClosingTime());
                existing.setDescription(payload.getDescription());
                existing.setAmenities(payload.getAmenities());
                existing.setStatus(payload.getStatus());
                existing.setImageUrl(payload.getImageUrl());

                Venue saved = venueRepo.save(existing);
                VenueDTO dto = VenueDTO.fromVenue(saved);
                dto.setPartnerId(saved.getPartner() != null ? saved.getPartner().getUser_id() : null);
                return ResponseEntity.ok(dto);
            })
            .orElse(ResponseEntity.notFound().build());
    }
}