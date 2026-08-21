package com.shopsphere.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PaymentResponse {

    private String razorpayOrderId;
    private String key;
    private Double amount;
}