package com.neurofleetx.controller;

import com.neurofleetx.model.User;
import com.neurofleetx.service.UserService;
import com.neurofleetx.util.JwtUtil;
import com.neurofleetx.payload.request.LoginRequest;
import com.neurofleetx.payload.response.JwtResponse;
import com.neurofleetx.payload.response.MessageResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

@RestController
@CrossOrigin(origins = {"http://localhost:5506", "http://localhost:3000", "http://localhost:5173"})
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/")
    public ResponseEntity<String> home() {
        return ResponseEntity.ok("Welcome to NeuroFleetX Backend API! Documentation will be available at /swagger-ui.html");
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("Attempting to authenticate user: " + loginRequest.getUsername());
            
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );
            
            // Note: We don't set the authentication in SecurityContextHolder for login requests
            // This prevents interference with our JwtAuthenticationFilter
            System.out.println("Authentication successful for user: " + loginRequest.getUsername());
            
            // Find user to get role
            Optional<User> userOptional = userService.findByUsername(loginRequest.getUsername());
            
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                System.out.println("User found in database: " + user.getUsername() + " with role: " + user.getRole());
                
                // If role is not provided in login request, use the role from the database
                String role = loginRequest.getRole();
                if (role == null || role.isEmpty()) {
                    role = user.getRole();
                }
                
                // Check if the user has the selected role (case-insensitive comparison)
                if (user.getRole().equalsIgnoreCase(role)) {
                    System.out.println("Role validation passed: " + role);
                    // Generate JWT token
                    String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
                    System.out.println("JWT token generated successfully");
                    
                    // Return success response with token
                    return ResponseEntity.ok(new JwtResponse(token, user.getId(), user.getUsername(), user.getRole()));
                } else {
                    // Role mismatch
                    System.out.println("Role mismatch. User role: " + user.getRole() + ", Requested role: " + role);
                    return ResponseEntity.badRequest().body(new MessageResponse("User does not have the selected role!"));
                }
            }
            
            System.out.println("User not found in database: " + loginRequest.getUsername());
            return ResponseEntity.badRequest().body(new MessageResponse("User not found!"));
        } catch (Exception e) {
            System.err.println("Authentication failed for user: " + loginRequest.getUsername());
            e.printStackTrace(); // Log the error for debugging
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid username or password!"));
        }
    }

    // Added signin endpoint that does the same as login
    @PostMapping("/signin")
    public ResponseEntity<?> signinUser(@RequestBody LoginRequest loginRequest) {
        return authenticateUser(loginRequest);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody com.neurofleetx.payload.request.SignupRequest signUpRequest) {
        System.out.println("Registering user: " + signUpRequest.getUsername());
        
        // Check if username is already taken
        if (userService.existsByUsername(signUpRequest.getUsername())) {
            System.out.println("Username already taken: " + signUpRequest.getUsername());
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
        }

        // Check if email is already in use
        if (userService.existsByEmail(signUpRequest.getEmail())) {
            System.out.println("Email already in use: " + signUpRequest.getEmail());
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword())); // Encode password
        System.out.println("Encoded password: " + user.getPassword());
        user.setFirstName(signUpRequest.getFirstName());
        user.setLastName(signUpRequest.getLastName());
        user.setPhoneNumber(signUpRequest.getPhoneNumber());
        user.setRole(signUpRequest.getRole());

        userService.saveUser(user);
        System.out.println("User registered successfully: " + user.getUsername());

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @GetMapping("/test-auth")
    public ResponseEntity<?> testAuth(@RequestParam String username, @RequestParam String password) {
        try {
            // Try to authenticate user
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
            );
            
            // If we get here, authentication was successful
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Authentication successful",
                "principal", authentication.getPrincipal()
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                "success", false,
                "message", "Authentication failed: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/test-encode")
    public ResponseEntity<?> testEncode() {
        String rawPassword = "password123";
        String encodedPassword = passwordEncoder.encode(rawPassword);
        Map<String, String> response = new HashMap<>();
        response.put("rawPassword", rawPassword);
        response.put("encodedPassword", encodedPassword);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Backend is running!");
    }
}