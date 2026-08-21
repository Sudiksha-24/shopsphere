package com.shopsphere.backend.dto;

import lombok.Data;

@Data
public class OrderStatusRequest {

    private Long orderId;
    private String status;
}