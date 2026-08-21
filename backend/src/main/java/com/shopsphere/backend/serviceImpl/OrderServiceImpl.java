package com.shopsphere.backend.serviceImpl;

import com.shopsphere.backend.entity.Cart;
import com.shopsphere.backend.entity.CartItem;
import com.shopsphere.backend.entity.Order;
import com.shopsphere.backend.entity.OrderItem;
import com.shopsphere.backend.entity.Product;
import com.shopsphere.backend.entity.User;

import com.shopsphere.backend.repository.CartItemRepository;
import com.shopsphere.backend.repository.CartRepository;
import com.shopsphere.backend.repository.OrderItemRepository;
import com.shopsphere.backend.repository.OrderRepository;
import com.shopsphere.backend.repository.ProductRepository;
import com.shopsphere.backend.repository.UserRepository;

import com.shopsphere.backend.service.OrderService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;


    // =====================================================
    // PLACE ORDER
    // =====================================================

    @Override
    public Order placeOrder(Long userId) {

        // -----------------------------------------
        // Find User
        // -----------------------------------------

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );


        // -----------------------------------------
        // Find Cart WITH Cart Items
        // -----------------------------------------

        Cart cart = cartRepository
                .findByUserWithItems(user)
                .orElseThrow(() ->
                        new RuntimeException("Cart not found")
                );


        // -----------------------------------------
        // Check Empty Cart
        // -----------------------------------------

        if (cart.getCartItems() == null ||
                cart.getCartItems().isEmpty()) {

            throw new RuntimeException(
                    "Cart is empty"
            );
        }


        // -----------------------------------------
        // Create Order
        // -----------------------------------------

        Order order = new Order();

        order.setUser(user);

        order.setStatus("PLACED");

        order.setOrderDate(
                LocalDateTime.now()
        );

        order.setTotalPrice(
                cart.getTotalPrice()
        );


        // -----------------------------------------
        // Save Order First
        // -----------------------------------------

        order = orderRepository.save(order);


        // -----------------------------------------
        // Copy Cart Items → Order Items
        // -----------------------------------------

        for (CartItem cartItem :
                cart.getCartItems()) {


            Product product =
                    cartItem.getProduct();


            // -----------------------------------------
            // Product Check
            // -----------------------------------------

            if (product == null) {

                throw new RuntimeException(
                        "Product not found in cart"
                );
            }


            // -----------------------------------------
            // Stock Check
            // -----------------------------------------

            if (product.getQuantity() <
                    cartItem.getQuantity()) {

                throw new RuntimeException(
                        product.getTitle()
                                + " is out of stock"
                );
            }


            // -----------------------------------------
            // Reduce Product Stock
            // -----------------------------------------

            product.setQuantity(
                    product.getQuantity()
                            - cartItem.getQuantity()
            );

            productRepository.save(product);


            // -----------------------------------------
            // Create Order Item
            // -----------------------------------------

            OrderItem orderItem =
                    new OrderItem();

            orderItem.setOrder(order);

            orderItem.setProduct(product);

            orderItem.setQuantity(
                    cartItem.getQuantity()
            );

            orderItem.setPrice(
                    product.getPrice()
            );


            // -----------------------------------------
            // Save Order Item
            // -----------------------------------------

            orderItemRepository.save(
                    orderItem
            );


            // Add to Order List

            order.getOrderItems()
                    .add(orderItem);
        }


        // -----------------------------------------
        // Clear Cart
        // -----------------------------------------

        cartItemRepository.deleteAll(
                cart.getCartItems()
        );

        cart.getCartItems().clear();

        cart.setTotalPrice(0.0);


        // -----------------------------------------
        // Save Empty Cart
        // -----------------------------------------

        cartRepository.save(cart);


        // -----------------------------------------
        // Return Order
        // -----------------------------------------

        return orderRepository.save(order);
    }


    // =====================================================
    // GET USER ORDERS
    // =====================================================

    @Override
    public List<Order> getOrdersByUser(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        return orderRepository.findByUser(user);
    }


    // =====================================================
    // GET ORDER BY ID
    // =====================================================

    @Override
    public Order getOrderById(Long orderId) {

        return orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order not found"
                        )
                );
    }


    // =====================================================
    // CANCEL ORDER
    // =====================================================

    @Override
    public Order cancelOrder(Long orderId) {

        // Find Order

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order not found"
                        )
                );


        // Already Cancelled

        if ("CANCELLED".equals(
                order.getStatus())) {

            throw new RuntimeException(
                    "Order already cancelled"
            );
        }


        // -----------------------------------------
        // Restore Product Stock
        // -----------------------------------------

        for (OrderItem item :
                order.getOrderItems()) {

            Product product =
                    item.getProduct();


            product.setQuantity(
                    product.getQuantity()
                            + item.getQuantity()
            );


            productRepository.save(
                    product
            );
        }


        // -----------------------------------------
        // Update Order Status
        // -----------------------------------------

        order.setStatus(
                "CANCELLED"
        );


        return orderRepository.save(order);
    }


    // =====================================================
    // GET ALL ORDERS
    // =====================================================

    @Override
    public List<Order> getAllOrders() {

        return orderRepository.findAll();
    }


    // =====================================================
    // UPDATE ORDER STATUS
    // =====================================================

    @Override
    public Order updateOrderStatus(
            Long orderId,
            String status) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order not found"
                        )
                );


        order.setStatus(status);


        return orderRepository.save(order);
    }

}