package com.shopsphere.backend.controller;

import com.shopsphere.backend.dto.CartRequest;
import com.shopsphere.backend.dto.CartUpdateRequest;
import com.shopsphere.backend.entity.Cart;
import com.shopsphere.backend.service.CartService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;


    @PostMapping("/add")
    public Cart addToCart(
            @RequestBody CartRequest request) {

        System.out.println("========== ADD TO CART ==========");
        System.out.println("User ID: " + request.getUserId());
        System.out.println("Product ID: " + request.getProductId());
        System.out.println("Quantity: " + request.getQuantity());

        return cartService.addToCart(
                request.getUserId(),
                request.getProductId(),
                request.getQuantity()
        );
    }


    @GetMapping("/{userId}")
    public Cart getCart(
            @PathVariable Long userId) {

        return cartService.getCartByUser(userId);
    }


    @PutMapping("/update")
    public Cart updateCart(
            @RequestBody CartUpdateRequest request) {

        return cartService.updateCartItem(
                request.getCartItemId(),
                request.getQuantity()
        );
    }


    @DeleteMapping("/{cartItemId}")
    public Cart removeCartItem(
            @PathVariable Long cartItemId) {

        return cartService.removeCartItem(
                cartItemId
        );
    }


    @DeleteMapping("/clear/{userId}")
    public Cart clearCart(
            @PathVariable Long userId) {

        return cartService.clearCart(
                userId
        );
    }
}