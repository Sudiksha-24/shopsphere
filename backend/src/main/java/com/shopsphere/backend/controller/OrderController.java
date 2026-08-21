package com.shopsphere.backend.controller;

import com.shopsphere.backend.dto.OrderRequest;
import com.shopsphere.backend.dto.OrderStatusRequest;
import com.shopsphere.backend.entity.Order;
import com.shopsphere.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/place")
    public Order placeOrder(@RequestBody OrderRequest request) {
        return orderService.placeOrder(request.getUserId());
    }

    @GetMapping("/user/{userId}")
    public List<Order> getOrdersByUser(@PathVariable Long userId) {
        return orderService.getOrdersByUser(userId);
    }

    @GetMapping("/{orderId}")
    public Order getOrderById(@PathVariable Long orderId) {
        return orderService.getOrderById(orderId);
    }

    @PutMapping("/cancel/{orderId}")
    public Order cancelOrder(@PathVariable Long orderId) {
        return orderService.cancelOrder(orderId);
    }

    @GetMapping
public List<Order> getAllOrders() {
    return orderService.getAllOrders();
}

@PutMapping("/status")
public Order updateOrderStatus(@RequestBody OrderStatusRequest request) {

    return orderService.updateOrderStatus(
            request.getOrderId(),
            request.getStatus()
    );
}

}