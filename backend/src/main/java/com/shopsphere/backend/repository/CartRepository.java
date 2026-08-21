package com.shopsphere.backend.repository;

import com.shopsphere.backend.entity.Cart;
import com.shopsphere.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

    Optional<Cart> findByUser(User user);


    // Fetch Cart + CartItems together
    @Query("""
        SELECT DISTINCT c
        FROM Cart c
        LEFT JOIN FETCH c.cartItems ci
        LEFT JOIN FETCH ci.product
        WHERE c.user = :user
    """)
    Optional<Cart> findByUserWithItems(
            @Param("user") User user
    );
}