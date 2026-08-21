package com.shopsphere.backend.serviceImpl;

import com.shopsphere.backend.entity.Address;
import com.shopsphere.backend.entity.Order;
import com.shopsphere.backend.repository.AddressRepository;
import com.shopsphere.backend.service.CheckoutService;
import com.shopsphere.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CheckoutServiceImpl implements CheckoutService {

    @Autowired
    private OrderService orderService;

    @Autowired
    private AddressRepository addressRepository;

    @Override
    public Order checkout(Long userId, Long addressId) {

        // Check Address
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        // Place Order
        Order order = orderService.placeOrder(userId);

        // पुढच्या step मध्ये Order मध्ये Address save करू
        return order;
    }
}