package com.shopsphere.backend.service;

import com.shopsphere.backend.entity.Wishlist;

import java.util.List;

public interface WishlistService {

    Wishlist addToWishlist(Long userId, Long productId);

    List<Wishlist> getUserWishlist(Long userId);

    void removeFromWishlist(Long userId, Long productId);

    boolean isInWishlist(Long userId, Long productId);
}