package com.shopsphere.backend.service;

import com.shopsphere.backend.dto.PaymentResponse;

public interface PaymentService {

    PaymentResponse createPayment(Long orderId) throws Exception;

}