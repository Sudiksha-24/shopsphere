package com.shopsphere.backend.dto;

import lombok.Data;

@Data
public class PaymentRequest {

    private Long orderId;

    private String razorpayPaymentId;

    private String razorpayOrderId;

    private String razorpaySignature;
}