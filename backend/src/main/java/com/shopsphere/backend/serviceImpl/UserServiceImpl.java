package com.shopsphere.backend.serviceImpl;

import com.shopsphere.backend.dto.UserDTO;
import com.shopsphere.backend.entity.User;
import com.shopsphere.backend.exception.ResourceNotFoundException;
import com.shopsphere.backend.repository.UserRepository;
import com.shopsphere.backend.service.UserService;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;


    // =========================================
    // REGISTER USER
    // =========================================

    @Override
    public UserDTO registerUser(UserDTO userDTO) {

        if (userRepository.existsByEmail(userDTO.getEmail())) {

            throw new RuntimeException(
                    "Email already exists"
            );
        }

        User user =
                modelMapper.map(
                        userDTO,
                        User.class
                );

        user.setPassword(
                passwordEncoder.encode(
                        user.getPassword()
                )
        );

        User savedUser =
                userRepository.save(user);

        return modelMapper.map(
                savedUser,
                UserDTO.class
        );
    }


    // =========================================
    // GET ALL USERS
    // =========================================

    @Override
    public List<UserDTO> getAllUsers() {

        List<User> users =
                userRepository.findAll();

        List<UserDTO> userDTOList =
                new ArrayList<>();

        for (User user : users) {

            userDTOList.add(
                    modelMapper.map(
                            user,
                            UserDTO.class
                    )
            );
        }

        return userDTOList;
    }


    // =========================================
    // GET USER BY ID
    // =========================================

    @Override
    public UserDTO getUserById(Long id) {

        User user =
                userRepository.findById(id)
                        .orElse(null);

        if (user == null) {

            throw new ResourceNotFoundException(
                    "User not found with id : " + id
            );
        }

        return modelMapper.map(
                user,
                UserDTO.class
        );
    }


    // =========================================
    // UPDATE USER
    // =========================================

    @Override
    public UserDTO updateUser(
            Long id,
            UserDTO userDTO
    ) {

        User user =
                userRepository.findById(id)
                        .orElse(null);

        if (user == null) {

            throw new ResourceNotFoundException(
                    "User not found with id : " + id
            );
        }


        // Update Name

        if (userDTO.getName() != null &&
                !userDTO.getName().trim().isEmpty()) {

            user.setName(
                    userDTO.getName()
            );
        }


        // Update Email

        if (userDTO.getEmail() != null &&
                !userDTO.getEmail().trim().isEmpty()) {

            if (!user.getEmail()
                    .equals(userDTO.getEmail())
                    &&
                    userRepository.existsByEmail(
                            userDTO.getEmail()
                    )) {

                throw new RuntimeException(
                        "Email already exists"
                );
            }

            user.setEmail(
                    userDTO.getEmail()
            );
        }


        // Update Password
        // Only if user sends a new password

        if (userDTO.getPassword() != null &&
                !userDTO.getPassword()
                        .trim()
                        .isEmpty()) {

            user.setPassword(
                    passwordEncoder.encode(
                            userDTO.getPassword()
                    )
            );
        }


        User updatedUser =
                userRepository.save(user);


        return modelMapper.map(
                updatedUser,
                UserDTO.class
        );
    }


    // =========================================
    // DELETE USER
    // =========================================

    @Override
    public void deleteUser(Long id) {

        User user =
                userRepository.findById(id)
                        .orElse(null);

        if (user == null) {

            throw new ResourceNotFoundException(
                    "User not found with id : " + id
            );
        }

        userRepository.deleteById(id);
    }
}