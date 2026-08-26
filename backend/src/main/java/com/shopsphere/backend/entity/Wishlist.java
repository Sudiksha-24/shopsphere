package com.shopsphere.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(
    name = "wishlist",
    uniqueConstraints = {
        @UniqueConstraint(
            columnNames = {"user_id", "product_id"}
        )
    }
)
@Data
public class Wishlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // =========================
    // USER
    // =========================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "user_id",
        nullable = false
    )
    @JsonIgnore
    private User user;


    // =========================
    // PRODUCT
    // =========================

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(
        name = "product_id",
        nullable = false
    )
    @JsonIgnoreProperties({
        "hibernateLazyInitializer",
        "handler"
    })
    private Product product;
}