package com.shopsphere.backend.service;

import com.shopsphere.backend.entity.Order;
import java.util.List;

public interface OrderService {

    Order placeOrder(Long userId);

    List<Order> getOrdersByUser(Long userId);

    Order getOrderById(Long orderId);

    Order cancelOrder(Long orderId);

    List<Order> getAllOrders();

    Order updateOrderStatus(Long orderId, String status);
}