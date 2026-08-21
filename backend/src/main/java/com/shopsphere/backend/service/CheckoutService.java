package com.shopsphere.backend.service;

import com.shopsphere.backend.entity.Order;

public interface CheckoutService {

    Order checkout(Long userId, Long addressId);

}