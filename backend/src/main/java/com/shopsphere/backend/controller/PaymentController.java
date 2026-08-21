package com.shopsphere.backend.controller;

import com.shopsphere.backend.dto.PaymentRequest;
import com.shopsphere.backend.dto.PaymentResponse;
import com.shopsphere.backend.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create")
    public PaymentResponse createPayment(
            @RequestBody PaymentRequest request) throws Exception {

        return paymentService.createPayment(
                request.getOrderId()
        );
    }
}