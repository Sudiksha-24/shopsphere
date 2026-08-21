package com.shopsphere.backend.security;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;


@Configuration
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;


    // =========================================
    // PASSWORD ENCODER
    // =========================================

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    // =========================================
    // AUTHENTICATION PROVIDER
    // =========================================

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider();

        provider.setUserDetailsService(
                customUserDetailsService
        );

        provider.setPasswordEncoder(
                passwordEncoder()
        );

        return provider;
    }


    // =========================================
    // AUTHENTICATION MANAGER
    // =========================================

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();
    }


    // =========================================
    // CORS
    // =========================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                Arrays.asList(
                        "http://localhost:5173"
                )
        );

        configuration.setAllowedMethods(
                Arrays.asList(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                Arrays.asList("*")
        );

        configuration.setAllowCredentials(false);


        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }


    // =========================================
    // SECURITY FILTER CHAIN
    // =========================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
                // CORS
                .cors(cors ->
                        cors.configurationSource(
                                corsConfigurationSource()
                        )
                )

                // CSRF
                .csrf(csrf ->
                        csrf.disable()
                )

                // SESSION
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                // AUTH PROVIDER
                .authenticationProvider(
                        authenticationProvider()
                )

                // =================================
                // AUTHORIZATION
                // =================================
                .authorizeHttpRequests(auth -> auth

                        // CORS OPTIONS
                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        ).permitAll()

                        // AUTH
                        .requestMatchers(
                                "/api/auth/**"
                        ).permitAll()

                        // PUBLIC PRODUCTS
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/products",
                                "/api/products/**"
                        ).permitAll()

                        // IMAGES
                        .requestMatchers(
                                "/images/**"
                        ).permitAll()

                        // CART
                        .requestMatchers(
                                "/api/cart/**"
                        ).authenticated()

                        // ADDRESS
                        .requestMatchers(
                                "/api/address/**"
                        ).authenticated()

                        // CHECKOUT
                        .requestMatchers(
                                "/api/checkout/**"
                        ).authenticated()

                        // USER ORDERS
                        .requestMatchers(
                                "/api/orders/user/**"
                        ).authenticated()

                        // SINGLE ORDER
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/orders/{orderId}"
                        ).authenticated()

                        // WISHLIST
                        .requestMatchers(
                                "/api/wishlist/**"
                        ).authenticated()

                        // PAYMENT
                        .requestMatchers(
                                "/api/payment/**"
                        ).authenticated()

                        // =================================
                        // ADMIN PRODUCT
                        // =================================

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/products"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/products/{id}"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/products/{id}"
                        ).hasRole("ADMIN")

                        // =================================
                        // ADMIN USERS
                        // =================================

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/users"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/users/{id}"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/users/{id}"
                        ).hasRole("ADMIN")

                        // =================================
                        // ADMIN ALL ORDERS
                        // =================================

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/orders"
                        ).hasRole("ADMIN")

                        // =================================
                        // ADMIN ORDER STATUS
                        // =================================

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/orders/status"
                        ).hasRole("ADMIN")

                        // EVERYTHING ELSE
                        .anyRequest().authenticated()
                )

                // =================================
                // JWT FILTER
                // =================================
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );


        return http.build();
    }
}