package com.event.dto;

import java.time.LocalDateTime;

import com.event.model.Booking;

public class BookingDTO {
    private Long bookingId;
    private Long venueId;
    private Long attendeeId;
    private String venueName;
    private String partnerName;  // Company or partner name
    private String status;
    private LocalDateTime bookedTime;
    private Integer duration;
    private Integer guests;
    private String specialRequests;
    private String attendeeName;
    

    public BookingDTO(Long bookingId, Long venueId, Long attendeeId, String venueName, String partnerName, String status, LocalDateTime bookedTime,
                      Integer duration, Integer guests, String specialRequests, String attendeeName) {
        this.bookingId = bookingId;
        this.venueId = venueId;
        this.attendeeId = attendeeId;
        this.venueName = venueName;
        this.partnerName = partnerName;
        this.status = status;
        this.bookedTime = bookedTime;
        this.duration = duration;
        this.guests = guests;
        this.specialRequests = specialRequests;
        this.attendeeName = attendeeName;
    }

    public static BookingDTO fromBooking(Booking booking) {
        return new BookingDTO(
            booking.getBooking_Id(),
            booking.getVenue().getVenue_id(),
            booking.getAttendee().getUser_id(),
            booking.getVenue().getVenueName(),
            booking.getVenue().getPartner() != null ? booking.getVenue().getPartner().getFullname() : "Unknown",
            booking.getStatus(),
            booking.getBookedTime(),
            booking.getDuration(),
            booking.getGuests(),
            booking.getSpecialRequests(),
            booking.getAttendee().getFullname()
        );
    }

  


	    
	    
		public Long getBookingId() {
			return bookingId;
		}



		public void setBookingId(Long bookingId) {
			this.bookingId = bookingId;
		}



		public Long getAttendeeId() {
			return attendeeId;
		}



		public void setAttendeeId(Long attendeeId) {
			this.attendeeId = attendeeId;
		}



		public Long getVenueId() {
			return venueId;
		}
		public void setVenueId(Long venueId) {
			this.venueId = venueId;
		}
		public String getStatus() {
			return status;
		}
		public void setStatus(String status) {
			this.status = status;
		}
		public LocalDateTime getBookedTime() {
			return bookedTime;
		}
		public void setBookedTime(LocalDateTime bookedTime) {
			this.bookedTime = bookedTime;
		}
		public int getDuration() {
			return duration;
		}
		public void setDuration(int duration) {
			this.duration = duration;
		}
		public int getGuests() {
			return guests;
		}
		public void setGuests(int guests) {
			this.guests = guests;
		}
		public String getSpecialRequests() {
			return specialRequests;
		}
		public void setSpecialRequests(String specialRequests) {
			this.specialRequests = specialRequests;
		}



		public String getVenueName() {
			return venueName;
		}



		public void setVenueName(String venueName) {
			this.venueName = venueName;
		}



		public String getPartnerName() {
			return partnerName;
		}



		public void setPartnerName(String partnerName) {
			this.partnerName = partnerName;
		}



		public void setDuration(Integer duration) {
			this.duration = duration;
		}



		public void setGuests(Integer guests) {
			this.guests = guests;
		}



		public String getAttendeeName() {
			return attendeeName;
		}



		public void setAttendeeName(String attendeeName) {
			this.attendeeName = attendeeName;
		}
		
		

	    
}