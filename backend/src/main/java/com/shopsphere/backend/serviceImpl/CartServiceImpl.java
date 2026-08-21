package com.shopsphere.backend.serviceImpl;

import com.shopsphere.backend.entity.Cart;
import com.shopsphere.backend.entity.CartItem;
import com.shopsphere.backend.entity.Product;
import com.shopsphere.backend.entity.User;
import com.shopsphere.backend.repository.CartItemRepository;
import com.shopsphere.backend.repository.CartRepository;
import com.shopsphere.backend.repository.ProductRepository;
import com.shopsphere.backend.repository.UserRepository;
import com.shopsphere.backend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Override
    public Cart addToCart(Long userId, Long productId, Integer quantity) {

        // Find User
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Find Product
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Find Cart
        Cart cart = cartRepository.findByUser(user)
                .orElse(null);

        // Create Cart if not exists
        if (cart == null) {
            cart = new Cart();
            cart.setUser(user);
            cart.setTotalPrice(0.0);
            cart = cartRepository.save(cart);
        }

        // Create CartItem
        CartItem cartItem = new CartItem();
        cartItem.setCart(cart);
        cartItem.setProduct(product);
        cartItem.setQuantity(quantity);

        // Save CartItem
        cartItemRepository.save(cartItem);

        // Add item to Cart
        cart.getCartItems().add(cartItem);

        // Update Total Price
        cart.setTotalPrice(
                cart.getTotalPrice() + (product.getPrice() * quantity)
        );

        // Save Cart
        return cartRepository.save(cart);
    }

    @Override
    public Cart getCartByUser(Long userId) {

        // Find User
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Find Cart
        return cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
    }

    @Override
public Cart updateCartItem(Long cartItemId, Integer quantity) {

    CartItem cartItem = cartItemRepository.findById(cartItemId)
            .orElseThrow(() -> new RuntimeException("Cart Item not found"));

    cartItem.setQuantity(quantity);
    cartItemRepository.save(cartItem);

    Cart cart = cartItem.getCart();

    double total = 0.0;

    for (CartItem item : cart.getCartItems()) {
        total += item.getProduct().getPrice() * item.getQuantity();
    }

    cart.setTotalPrice(total);

    return cartRepository.save(cart);
}

@Override
public Cart removeCartItem(Long cartItemId) {

    // Find Cart Item
    CartItem cartItem = cartItemRepository.findById(cartItemId)
            .orElseThrow(() -> new RuntimeException("Cart Item not found"));

    Cart cart = cartItem.getCart();

    // Remove from List
    cart.getCartItems().remove(cartItem);

    // Delete from Database
    cartItemRepository.delete(cartItem);

    // Recalculate Total
    double total = 0.0;

    for (CartItem item : cart.getCartItems()) {
        total += item.getProduct().getPrice() * item.getQuantity();
    }

    cart.setTotalPrice(total);

    return cartRepository.save(cart);
}

@Override
public Cart clearCart(Long userId) {

    // Find User
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

    // Find Cart
    Cart cart = cartRepository.findByUser(user)
            .orElseThrow(() -> new RuntimeException("Cart not found"));

    // Delete all Cart Items
    cartItemRepository.deleteAll(cart.getCartItems());

    // Clear List
    cart.getCartItems().clear();

    // Reset Total Price
    cart.setTotalPrice(0.0);

    return cartRepository.save(cart);
}

}