package com.shopsphere.backend.serviceImpl;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.shopsphere.backend.dto.PaymentResponse;
import com.shopsphere.backend.entity.Payment;
import com.shopsphere.backend.repository.OrderRepository;
import com.shopsphere.backend.repository.PaymentRepository;
import com.shopsphere.backend.service.PaymentService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private RazorpayClient razorpayClient;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Value("${razorpay.key.id}")
    private String keyId;

    @Override
    public PaymentResponse createPayment(Long orderId) throws Exception {

        com.shopsphere.backend.entity.Order dbOrder =
                orderRepository.findById(orderId)
                        .orElseThrow(() -> new RuntimeException("Order not found"));

        JSONObject options = new JSONObject();

        options.put("amount", (int)(dbOrder.getTotalPrice() * 100));
        options.put("currency", "INR");
        options.put("receipt", "receipt_" + dbOrder.getId());

        Order razorpayOrder = razorpayClient.orders.create(options);

        Payment payment = new Payment();
        payment.setOrder(dbOrder);
        payment.setAmount(dbOrder.getTotalPrice());
        payment.setPaymentStatus("PENDING");
        payment.setPaymentDate(LocalDateTime.now());
        payment.setRazorpayOrderId(razorpayOrder.get("id"));

        paymentRepository.save(payment);

        return new PaymentResponse(
                razorpayOrder.get("id"),
                keyId,
                dbOrder.getTotalPrice()
        );
    }
}