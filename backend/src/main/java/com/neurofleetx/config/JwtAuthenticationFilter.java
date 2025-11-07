package com.neurofleetx.config;

import com.neurofleetx.util.JwtUtil;
import com.neurofleetx.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        // Skip authentication for login and register endpoints
        String requestURI = request.getRequestURI();
        if (isPublicEndpoint(requestURI)) {
            chain.doFilter(request, response);
            return;
        }

        final String requestTokenHeader = request.getHeader("Authorization");

        // Check if Authorization header is missing
        if (requestTokenHeader == null || requestTokenHeader.trim().isEmpty()) {
            // For protected endpoints without token, let Spring Security handle it
            chain.doFilter(request, response);
            return;
        }

        // Check if token starts with "Bearer "
        if (!requestTokenHeader.startsWith("Bearer ")) {
            logger.warn("JWT Token does not begin with Bearer String");
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid Authorization header format");
            return;
        }

        String username = null;
        String jwtToken = requestTokenHeader.substring(7);

        // Extract username from token
        try {
            username = jwtUtil.extractUsername(jwtToken);
        } catch (Exception e) {
            logger.error("Unable to extract username from JWT Token", e);
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid JWT Token");
            return;
        }

        // Validate token only if username was extracted
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = this.userService.loadUserByUsername(username);

                // Validate token
                if (jwtUtil.validateToken(jwtToken, userDetails.getUsername())) {
                    UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = 
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    // After setting the Authentication in the context, we specify that the current user is authenticated
                    SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
                } else {
                    logger.warn("JWT Token is invalid");
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid JWT Token");
                    return;
                }
            } catch (Exception e) {
                logger.error("Unable to authenticate user", e);
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unable to authenticate user");
                return;
            }
        }
        
        chain.doFilter(request, response);
    }
    
    private boolean isPublicEndpoint(String requestURI) {
        return requestURI.equals("/api/auth/login") || 
               requestURI.equals("/api/auth/signin") || // Added signin endpoint
               requestURI.equals("/api/auth/register") ||
               requestURI.equals("/") || 
               requestURI.equals("/health") ||
               requestURI.equals("/api/users/register") ||
               requestURI.startsWith("/api/vehicles/");
    }
}