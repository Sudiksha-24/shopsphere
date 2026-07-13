package com.shopsphere.backend.service;

import com.shopsphere.backend.dto.UserDTO;

import java.util.List;

public interface UserService {

    UserDTO registerUser(UserDTO userDTO);

    List<UserDTO> getAllUsers();

    UserDTO getUserById(Long id);

    void deleteUser(Long id);
}