package com.shopsphere.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

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

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {


        // =========================
        // GET AUTHORIZATION HEADER
        // =========================

        String authHeader =
                request.getHeader("Authorization");


        System.out.println(
                "JWT FILTER → "
                        + request.getMethod()
                        + " "
                        + request.getRequestURI()
        );


        System.out.println(
                "AUTH HEADER → "
                        + authHeader
        );


        // No token
        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            System.out.println(
                    "JWT FILTER → No Bearer token"
            );

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }


        // =========================
        // EXTRACT TOKEN
        // =========================

        String token =
                authHeader.substring(7);


        try {

            // =========================
            // EXTRACT USERNAME
            // =========================

            String email =
                    jwtUtil.extractUsername(token);


            System.out.println(
                    "JWT EMAIL → "
                            + email
            );


            if (email != null &&
                    SecurityContextHolder
                            .getContext()
                            .getAuthentication() == null) {


                // =========================
                // LOAD USER
                // =========================

                UserDetails userDetails =
                        userDetailsService
                                .loadUserByUsername(
                                        email
                                );


                System.out.println(
                        "JWT USER → "
                                + userDetails
                                        .getUsername()
                );


                System.out.println(
                        "JWT AUTHORITIES → "
                                + userDetails
                                        .getAuthorities()
                );


                // =========================
                // VALIDATE TOKEN
                // =========================

                boolean valid =
                        jwtUtil.validateToken(
                                token,
                                userDetails
                                        .getUsername()
                        );


                System.out.println(
                        "JWT VALID → "
                                + valid
                );


                if (valid) {


                    // =========================
                    // CREATE AUTHENTICATION
                    // =========================

                    UsernamePasswordAuthenticationToken
                            authenticationToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails
                                            .getAuthorities()
                            );


                    authenticationToken.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request)
                    );


                    // =========================
                    // SET SECURITY CONTEXT
                    // =========================

                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(
                                    authenticationToken
                            );


                    System.out.println(
                            "JWT AUTHENTICATION SUCCESS"
                    );

                } else {

                    System.out.println(
                            "JWT TOKEN INVALID"
                    );
                }
            }


        } catch (Exception e) {

            System.out.println(
                    "JWT AUTHENTICATION ERROR"
            );

            e.printStackTrace();
        }


        // =========================
        // CONTINUE REQUEST
        // =========================

        filterChain.doFilter(
                request,
                response
        );
    }
}