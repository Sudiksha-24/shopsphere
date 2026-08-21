package com.shopsphere.backend.dto;

import lombok.Data;

@Data
public class CartUpdateRequest {

    private Long cartItemId;

    private Integer quantity;
}