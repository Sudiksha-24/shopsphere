package com.shopsphere.backend.service;

import com.shopsphere.backend.entity.Cart;

public interface CartService {

    Cart addToCart(Long userId, Long productId, Integer quantity);

    Cart getCartByUser(Long userId);

    Cart updateCartItem(Long cartItemId, Integer quantity);

    Cart removeCartItem(Long cartItemId);

     Cart clearCart(Long userId);

}