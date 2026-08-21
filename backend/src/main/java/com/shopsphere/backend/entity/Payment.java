package com.shopsphere.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ShopSphere Order
    @OneToOne
    @JoinColumn(name = "order_id")
    private Order order;

    // Razorpay Order ID
    @Column(unique = true)
    private String razorpayOrderId;

    // Razorpay Payment ID
    private String razorpayPaymentId;

    // SUCCESS / FAILED / PENDING
    private String paymentStatus;

    private Double amount;

    private LocalDateTime paymentDate;
}