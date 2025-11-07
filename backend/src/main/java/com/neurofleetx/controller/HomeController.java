package com.neurofleetx.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "Welcome to NeuroFleetX Backend API! The application is running successfully.";
    }
    
    @GetMapping("/health")
    public String health() {
        return "OK";
    }
}