package com.shopsphere.backend.serviceImpl;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;

import com.shopsphere.backend.dto.PaymentRequest;
import com.shopsphere.backend.dto.PaymentResponse;

import com.shopsphere.backend.entity.Payment;

import com.shopsphere.backend.repository.OrderRepository;
import com.shopsphere.backend.repository.PaymentRepository;

import com.shopsphere.backend.service.CartService;
import com.shopsphere.backend.service.OrderService;
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

    @Autowired
    private OrderService orderService;

    @Autowired
    private CartService cartService;

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;


    // =========================================
    // CREATE RAZORPAY PAYMENT
    // =========================================

    @Override
    public PaymentResponse createPayment(
            Long orderId)
            throws Exception {

        com.shopsphere.backend.entity.Order dbOrder =
                orderRepository.findById(orderId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Order not found"
                                )
                        );


        // =====================================
        // CHECK ORDER PAYMENT STATUS
        // =====================================

        if (!"PENDING".equals(
                dbOrder.getPaymentStatus())) {

            throw new RuntimeException(
                    "Order is not pending for payment"
            );
        }


        // =====================================
        // CREATE RAZORPAY ORDER
        // =====================================

        JSONObject options =
                new JSONObject();

        options.put(
                "amount",
                (int) (
                        dbOrder.getTotalPrice() * 100
                )
        );

        options.put(
                "currency",
                "INR"
        );

        options.put(
                "receipt",
                "receipt_" + dbOrder.getId()
        );


        Order razorpayOrder =
                razorpayClient
                        .orders
                        .create(options);


        // =====================================
        // SAVE PAYMENT
        // =====================================

        Payment payment =
                new Payment();

        payment.setOrder(dbOrder);

        payment.setAmount(
                dbOrder.getTotalPrice()
        );

        payment.setPaymentStatus(
                "PENDING"
        );

        payment.setPaymentDate(
                LocalDateTime.now()
        );

        payment.setRazorpayOrderId(
                razorpayOrder.get("id")
        );


        paymentRepository.save(
                payment
        );


        // =====================================
        // RESPONSE
        // =====================================

        return new PaymentResponse(
                razorpayOrder.get("id"),
                keyId,
                dbOrder.getTotalPrice()
        );
    }


    // =========================================
    // VERIFY PAYMENT
    // =========================================

    @Override
    public boolean verifyPayment(
            PaymentRequest request)
            throws Exception {


        // =====================================
        // VALIDATE INPUT
        // =====================================

        if (request.getOrderId() == null) {

            throw new RuntimeException(
                    "Order ID is required"
            );
        }


        if (request.getRazorpayPaymentId() == null ||
                request.getRazorpayPaymentId().isBlank()) {

            throw new RuntimeException(
                    "Razorpay payment ID is required"
            );
        }


        if (request.getRazorpayOrderId() == null ||
                request.getRazorpayOrderId().isBlank()) {

            throw new RuntimeException(
                    "Razorpay order ID is required"
            );
        }


        if (request.getRazorpaySignature() == null ||
                request.getRazorpaySignature().isBlank()) {

            throw new RuntimeException(
                    "Razorpay signature is required"
            );
        }


        // =====================================
        // FIND SHOPSPHERE ORDER
        // =====================================

        com.shopsphere.backend.entity.Order dbOrder =
                orderRepository.findById(
                        request.getOrderId()
                )
                .orElseThrow(
                        () -> new RuntimeException(
                                "Order not found"
                        )
                );


        // =====================================
        // FIND PAYMENT
        // =====================================

        Payment payment =
                paymentRepository
                        .findByRazorpayOrderId(
                                request.getRazorpayOrderId()
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Payment record not found"
                                )
                        );


        // =====================================
        // CHECK PAYMENT BELONGS TO ORDER
        // =====================================

        if (payment.getOrder() == null ||
                !payment.getOrder()
                        .getId()
                        .equals(dbOrder.getId())) {

            throw new RuntimeException(
                    "Payment does not belong to this order"
            );
        }


        // =====================================
        // CHECK RAZORPAY ORDER ID
        // =====================================

        if (!payment.getRazorpayOrderId()
                .equals(request.getRazorpayOrderId())) {

            throw new RuntimeException(
                    "Invalid Razorpay order ID"
            );
        }


        // =====================================
        // VERIFY RAZORPAY SIGNATURE
        // =====================================

        JSONObject options =
                new JSONObject();

        options.put(
                "razorpay_order_id",
                payment.getRazorpayOrderId()
        );

        options.put(
                "razorpay_payment_id",
                request.getRazorpayPaymentId()
        );

        options.put(
                "razorpay_signature",
                request.getRazorpaySignature()
        );


        boolean verified =
                Utils.verifyPaymentSignature(
                        options,
                        keySecret
                );


        // =====================================
        // PAYMENT FAILED
        // =====================================

        if (!verified) {

            payment.setPaymentStatus(
                    "FAILED"
            );

            paymentRepository.save(
                    payment
            );


            orderService.failOrderPayment(
                    dbOrder.getId()
            );


            // IMPORTANT:
            // Do NOT clear cart when payment fails.

            return false;
        }


        // =====================================
        // PAYMENT SUCCESS
        // =====================================

        payment.setRazorpayPaymentId(
                request.getRazorpayPaymentId()
        );

        payment.setPaymentStatus(
                "SUCCESS"
        );

        payment.setPaymentDate(
                LocalDateTime.now()
        );


        paymentRepository.save(
                payment
        );


        // =====================================
        // COMPLETE SHOPSPHERE ORDER
        // =====================================

        orderService.completeOrderAfterPayment(
                dbOrder.getId()
        );


        // =====================================
        // CLEAR USER CART
        // =====================================

        cartService.clearCart(
                dbOrder.getUser().getId()
        );


        // =====================================
        // PAYMENT SUCCESS
        // =====================================

        return true;
    }
}