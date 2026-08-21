package com.shopsphere.backend.controller;

import com.shopsphere.backend.entity.Wishlist;
import com.shopsphere.backend.service.WishlistService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "*")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;


    // =====================================
    // ADD TO WISHLIST
    // =====================================

    @PostMapping("/add")
    public ResponseEntity<Wishlist> addToWishlist(
            @RequestParam Long userId,
            @RequestParam Long productId
    ) {

        Wishlist wishlist =
                wishlistService.addToWishlist(
                        userId,
                        productId
                );

        return ResponseEntity.ok(wishlist);
    }


    // =====================================
    // GET USER WISHLIST
    // =====================================

    @GetMapping("/{userId}")
    public ResponseEntity<List<Wishlist>> getUserWishlist(
            @PathVariable Long userId
    ) {

        return ResponseEntity.ok(
                wishlistService.getUserWishlist(userId)
        );
    }


    // =====================================
    // REMOVE FROM WISHLIST
    // =====================================

    @DeleteMapping("/remove")
    public ResponseEntity<String> removeFromWishlist(
            @RequestParam Long userId,
            @RequestParam Long productId
    ) {

        wishlistService.removeFromWishlist(
                userId,
                productId
        );

        return ResponseEntity.ok(
                "Product removed from wishlist"
        );
    }


    // =====================================
    // CHECK WISHLIST
    // =====================================

    @GetMapping("/check")
    public ResponseEntity<Boolean> isInWishlist(
            @RequestParam Long userId,
            @RequestParam Long productId
    ) {

        return ResponseEntity.ok(
                wishlistService.isInWishlist(
                        userId,
                        productId
                )
        );
    }
}