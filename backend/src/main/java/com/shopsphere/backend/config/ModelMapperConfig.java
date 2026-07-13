package com.shopsphere.backend.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        System.out.println("====== ModelMapper Bean Created ======");
        return new ModelMapper();
    }
}