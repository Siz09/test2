package com.event.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.event.model.Partner;
import com.event.model.User;


@Repository
public interface PartnerRepo extends JpaRepository<Partner, Long> {

	  Optional<Partner> findByEmail(String email);	
	
	Optional<Partner> findById(Long id);

}

