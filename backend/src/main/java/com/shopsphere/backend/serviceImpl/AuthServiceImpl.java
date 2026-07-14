package com.shopsphere.backend.serviceImpl;

import com.shopsphere.backend.dto.LoginRequest;
import com.shopsphere.backend.dto.LoginResponse;
import com.shopsphere.backend.service.AuthService;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Override
    public LoginResponse login(LoginRequest loginRequest) {

        return null;
    }
}