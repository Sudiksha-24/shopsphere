package com.shopsphere.backend.controller;

import com.shopsphere.backend.dto.UserDTO;
import com.shopsphere.backend.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;


    // =========================================
    // REGISTER USER
    // =========================================

    @PostMapping
    public ResponseEntity<UserDTO> registerUser(
            @RequestBody UserDTO userDTO) {

        UserDTO savedUser =
                userService.registerUser(userDTO);

        return new ResponseEntity<>(
                savedUser,
                HttpStatus.CREATED
        );
    }


    // =========================================
    // GET ALL USERS
    // =========================================

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {

        return ResponseEntity.ok(
                userService.getAllUsers()
        );
    }


    // =========================================
    // GET USER BY ID
    // =========================================

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                userService.getUserById(id)
        );
    }


    // =========================================
    // UPDATE USER
    // =========================================

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable Long id,
            @RequestBody UserDTO userDTO) {

        return ResponseEntity.ok(
                userService.updateUser(
                        id,
                        userDTO
                )
        );
    }


    // =========================================
    // DELETE USER
    // =========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(
            @PathVariable Long id) {

        userService.deleteUser(id);

        return ResponseEntity.ok(
                "User deleted successfully"
        );
    }
}