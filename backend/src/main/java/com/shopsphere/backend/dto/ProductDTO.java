package com.shopsphere.backend.dto;

import lombok.Data;
@Data
public class ProductDTO {

    private Long id;

    private String title;

    private String description;

    private Double price;

    private Integer quantity;

    private String imageUrl;

    private String brand;

    private String category;
}