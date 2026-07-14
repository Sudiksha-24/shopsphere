package com.shopsphere.backend.service;

import com.shopsphere.backend.dto.LoginRequest;
import com.shopsphere.backend.dto.LoginResponse;

public interface AuthService {

    LoginResponse login(LoginRequest loginRequest);

}