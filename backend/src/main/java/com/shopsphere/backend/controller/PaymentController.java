package com.shopsphere.backend.controller;

import com.shopsphere.backend.dto.PaymentRequest;
import com.shopsphere.backend.dto.PaymentResponse;
import com.shopsphere.backend.service.PaymentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;


    // =========================================
    // CREATE RAZORPAY PAYMENT
    // =========================================

    @PostMapping("/create")
    public PaymentResponse createPayment(
            @RequestBody PaymentRequest request)
            throws Exception {

        return paymentService.createPayment(
                request.getOrderId()
        );
    }


    // =========================================
    // VERIFY PAYMENT
    // =========================================

    @PostMapping("/verify")
    public ResponseEntity<String> verifyPayment(
            @RequestBody PaymentRequest request)
            throws Exception {

        boolean verified =
                paymentService.verifyPayment(
                        request
                );


        if (verified) {

            return ResponseEntity.ok(
                    "Payment verified successfully"
            );

        }


        return ResponseEntity
                .badRequest()
                .body(
                        "Payment verification failed"
                );
    }
}