package com.shopsphere.backend.serviceImpl;

import com.shopsphere.backend.dto.LoginRequest;
import com.shopsphere.backend.dto.LoginResponse;
import com.shopsphere.backend.security.CustomUserDetails;
import com.shopsphere.backend.security.JwtUtil;
import com.shopsphere.backend.service.AuthService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;


    @Override
    public LoginResponse login(LoginRequest loginRequest) {

        System.out.println("Login method called");

        try {

            // Authenticate user
            Authentication authentication =
                    authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(
                                    loginRequest.getEmail(),
                                    loginRequest.getPassword()
                            )
                    );

            System.out.println("Authentication Success");


            // Get authenticated user details
            SecurityContextHolder
                    .getContext()
                    .setAuthentication(authentication);

            CustomUserDetails userDetails =
                    (CustomUserDetails) authentication.getPrincipal();


            // Get User ID
            Long userId = userDetails.getUserId();


            // Generate JWT token
            String token =
                    jwtUtil.generateToken(loginRequest.getEmail());


            // Return token + userId
            return new LoginResponse(token, userId);

        } catch (Exception e) {

            System.out.println("Authentication Failed");

            e.printStackTrace();

            throw e;
        }
    }
}