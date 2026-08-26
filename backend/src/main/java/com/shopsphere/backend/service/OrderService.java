package com.shopsphere.backend.service;

import com.shopsphere.backend.entity.Order;

import java.util.List;

public interface OrderService {

    // =========================================
    // EXISTING ORDER
    // =========================================

    Order placeOrder(Long userId);


    // =========================================
    // PAYMENT FLOW
    // =========================================

    Order createPendingOrder(Long userId);

    Order completeOrderAfterPayment(Long orderId);

    Order failOrderPayment(Long orderId);


    // =========================================
    // GET ORDERS
    // =========================================

    List<Order> getOrdersByUser(Long userId);

    Order getOrderById(Long orderId);


    // =========================================
    // CANCEL ORDER
    // =========================================

    Order cancelOrder(Long orderId);


    // =========================================
    // ADMIN
    // =========================================

    List<Order> getAllOrders();

    Order updateOrderStatus(
            Long orderId,
            String status
    );
}