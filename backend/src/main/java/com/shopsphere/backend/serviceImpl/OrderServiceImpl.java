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
import org.springframework.transaction.annotation.Transactional;

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
    // OLD PLACE ORDER
    // =====================================================

    @Override
    @Transactional
    public Order placeOrder(Long userId) {

        User user =
                userRepository.findById(userId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found"
                                )
                        );


        Cart cart =
                cartRepository
                        .findByUserWithItems(user)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Cart not found"
                                )
                        );


        if (cart.getCartItems() == null ||
                cart.getCartItems().isEmpty()) {

            throw new RuntimeException(
                    "Cart is empty"
            );
        }


        Order order = new Order();

        order.setUser(user);

        order.setStatus("PLACED");

        order.setPaymentStatus("SUCCESS");

        order.setOrderDate(
                LocalDateTime.now()
        );

        order.setTotalPrice(
                cart.getTotalPrice()
        );


        order =
                orderRepository.save(order);


        for (CartItem cartItem :
                cart.getCartItems()) {


            Product product =
                    cartItem.getProduct();


            if (product == null) {

                throw new RuntimeException(
                        "Product not found in cart"
                );

            }


            if (product.getQuantity() <
                    cartItem.getQuantity()) {

                throw new RuntimeException(
                        product.getTitle()
                                + " is out of stock"
                );

            }


            // Reduce stock

            product.setQuantity(
                    product.getQuantity()
                            - cartItem.getQuantity()
            );

            productRepository.save(product);


            // Create order item

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


            orderItemRepository.save(
                    orderItem
            );


            order.getOrderItems()
                    .add(orderItem);

        }


        // Clear cart

        cartItemRepository.deleteAll(
                cart.getCartItems()
        );

        cart.getCartItems().clear();

        cart.setTotalPrice(0.0);

        cartRepository.save(cart);


        return orderRepository.save(order);
    }


    // =====================================================
    // CREATE PENDING ORDER
    // =====================================================

    @Override
    @Transactional
    public Order createPendingOrder(Long userId) {

        User user =
                userRepository.findById(userId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found"
                                )
                        );


        Cart cart =
                cartRepository
                        .findByUserWithItems(user)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Cart not found"
                                )
                        );


        // Check cart

        if (cart.getCartItems() == null ||
                cart.getCartItems().isEmpty()) {

            throw new RuntimeException(
                    "Cart is empty"
            );

        }


        // Check stock BEFORE creating order

        for (CartItem cartItem :
                cart.getCartItems()) {

            Product product =
                    cartItem.getProduct();


            if (product == null) {

                throw new RuntimeException(
                        "Product not found in cart"
                );

            }


            if (product.getQuantity() <
                    cartItem.getQuantity()) {

                throw new RuntimeException(
                        product.getTitle()
                                + " is out of stock"
                );

            }

        }


        // =========================================
        // CREATE ORDER
        // =========================================

        Order order = new Order();

        order.setUser(user);

        order.setStatus("PENDING");

        order.setPaymentStatus("PENDING");

        order.setOrderDate(
                LocalDateTime.now()
        );

        order.setTotalPrice(
                cart.getTotalPrice()
        );


        order =
                orderRepository.save(order);


        // =========================================
        // COPY CART ITEMS
        // =========================================

        for (CartItem cartItem :
                cart.getCartItems()) {

            Product product =
                    cartItem.getProduct();


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


            orderItemRepository.save(
                    orderItem
            );


            order.getOrderItems()
                    .add(orderItem);

        }


        return orderRepository.save(order);
    }


    // =====================================================
    // COMPLETE ORDER AFTER PAYMENT
    // =====================================================

    @Override
    @Transactional
    public Order completeOrderAfterPayment(
            Long orderId) {

        Order order =
                orderRepository.findById(orderId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Order not found"
                                )
                        );


        // Already completed

        if ("SUCCESS".equals(
                order.getPaymentStatus())) {

            return order;

        }


        // =========================================
        // REDUCE STOCK
        // =========================================

        for (OrderItem orderItem :
                order.getOrderItems()) {

            Product product =
                    orderItem.getProduct();


            if (product == null) {

                throw new RuntimeException(
                        "Product not found in order"
                );

            }


            if (product.getQuantity() <
                    orderItem.getQuantity()) {

                throw new RuntimeException(
                        product.getTitle()
                                + " is out of stock"
                );

            }


            product.setQuantity(
                    product.getQuantity()
                            - orderItem.getQuantity()
            );


            productRepository.save(
                    product
            );

        }


        // =========================================
        // PAYMENT SUCCESS
        // =========================================

        order.setPaymentStatus(
                "SUCCESS"
        );


        order.setStatus(
                "PLACED"
        );


        return orderRepository.save(order);
    }


    // =====================================================
    // PAYMENT FAILED
    // =====================================================

    @Override
    @Transactional
    public Order failOrderPayment(
            Long orderId) {

        Order order =
                orderRepository.findById(orderId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Order not found"
                                )
                        );


        order.setPaymentStatus(
                "FAILED"
        );


        order.setStatus(
                "PAYMENT_FAILED"
        );


        return orderRepository.save(order);
    }


    // =====================================================
    // GET USER ORDERS
    // =====================================================

    @Override
    public List<Order> getOrdersByUser(
            Long userId) {

        User user =
                userRepository.findById(userId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found"
                                )
                        );


        return orderRepository.findByUser(user);
    }


    // =====================================================
    // GET ORDER BY ID
    // =====================================================

    @Override
    public Order getOrderById(
            Long orderId) {

        return orderRepository.findById(orderId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Order not found"
                        )
                );
    }


    // =====================================================
    // CANCEL ORDER
    // =====================================================

    @Override
    @Transactional
    public Order cancelOrder(
            Long orderId) {

        Order order =
                orderRepository.findById(orderId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Order not found"
                                )
                        );


        if ("CANCELLED".equals(
                order.getStatus())) {

            throw new RuntimeException(
                    "Order already cancelled"
            );

        }


        // =========================================
        // RESTORE STOCK ONLY IF PAYMENT SUCCESS
        // =========================================

        if ("SUCCESS".equals(
                order.getPaymentStatus())) {

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

        }


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

        Order order =
                orderRepository.findById(orderId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Order not found"
                                )
                        );


        order.setStatus(status);


        return orderRepository.save(order);
    }
}