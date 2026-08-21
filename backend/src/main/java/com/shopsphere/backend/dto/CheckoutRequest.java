package com.shopsphere.backend.dto;

import lombok.Data;

@Data
public class CheckoutRequest {

    private Long userId;
    private Long addressId;
}