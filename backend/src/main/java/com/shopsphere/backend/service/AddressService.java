package com.shopsphere.backend.service;

import com.shopsphere.backend.entity.Address;

import java.util.List;

public interface AddressService {

    Address addAddress(Long userId, Address address);

    List<Address> getUserAddresses(Long userId);

    Address updateAddress(Long addressId, Address address);

    void deleteAddress(Long addressId);
}