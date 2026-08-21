package com.shopsphere.backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class CartResponseDTO {

    private Long cartId;
    private Long userId;
    private String userName;
    private Double totalPrice;
    private List<CartItemResponseDTO> items;
}