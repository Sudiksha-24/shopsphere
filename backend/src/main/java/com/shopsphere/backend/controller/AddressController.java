package com.shopsphere.backend.controller;

import com.shopsphere.backend.entity.Address;
import com.shopsphere.backend.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/address")
@CrossOrigin(origins = "*")
public class AddressController {

    @Autowired
    private AddressService addressService;


    // =========================
    // ADD ADDRESS
    // =========================

    @PostMapping("/add")
    public Address addAddress(
            @RequestParam Long userId,
            @RequestBody Address address) {

        return addressService.addAddress(
                userId,
                address
        );
    }


    // =========================
    // GET USER ADDRESSES
    // =========================

    @GetMapping("/user/{userId}")
    public List<Address> getUserAddresses(
            @PathVariable Long userId) {

        return addressService.getUserAddresses(
                userId
        );
    }


    // =========================
    // UPDATE ADDRESS
    // =========================

    @PutMapping("/update/{addressId}")
    public Address updateAddress(
            @PathVariable Long addressId,
            @RequestBody Address address) {

        return addressService.updateAddress(
                addressId,
                address
        );
    }


    // =========================
    // DELETE ADDRESS
    // =========================

    @DeleteMapping("/delete/{addressId}")
    public String deleteAddress(
            @PathVariable Long addressId) {

        addressService.deleteAddress(
                addressId
        );

        return "Address deleted successfully";
    }
}