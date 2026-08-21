package com.shopsphere.backend.dto;

import lombok.Data;

@Data
public class CartItemResponseDTO {

    private Long productId;
    private String productName;
    private Integer quantity;
    private Double price;
}