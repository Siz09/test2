package com.event.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
	@RequestMapping("/test")
	public class TestController {

	    @PostMapping
	    public ResponseEntity<String> test() {
	        return ResponseEntity.ok("CORS working!");
	    }
	}