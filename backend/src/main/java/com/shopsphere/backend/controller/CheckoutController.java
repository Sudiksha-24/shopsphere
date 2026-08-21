package com.shopsphere.backend.controller;

import com.shopsphere.backend.dto.CheckoutRequest;
import com.shopsphere.backend.entity.Order;
import com.shopsphere.backend.service.CheckoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/checkout")
@CrossOrigin(origins = "*")
public class CheckoutController {

    @Autowired
    private CheckoutService checkoutService;

    @PostMapping
    public Order checkout(@RequestBody CheckoutRequest request) {

        return checkoutService.checkout(
                request.getUserId(),
                request.getAddressId()
        );
    }
}