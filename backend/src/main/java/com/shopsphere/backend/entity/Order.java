package com.shopsphere.backend.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // =========================================
    // USER
    // =========================================

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;


    // =========================================
    // ORDER ITEMS
    // =========================================

    @OneToMany(
            mappedBy = "order",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @JsonManagedReference
    private List<OrderItem> orderItems =
            new ArrayList<>();


    // =========================================
    // ORDER PRICE
    // =========================================

    private Double totalPrice;


    // =========================================
    // ORDER STATUS
    // =========================================
    // PLACED
    // PROCESSING
    // SHIPPED
    // DELIVERED
    // CANCELLED

    private String status;


    // =========================================
    // PAYMENT STATUS
    // =========================================
    // PENDING
    // SUCCESS
    // FAILED

    private String paymentStatus;


    // =========================================
    // ORDER DATE
    // =========================================

    private LocalDateTime orderDate;
}