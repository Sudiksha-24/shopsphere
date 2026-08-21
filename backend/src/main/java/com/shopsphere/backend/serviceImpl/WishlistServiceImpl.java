package com.shopsphere.backend.serviceImpl;

import com.shopsphere.backend.entity.Product;
import com.shopsphere.backend.entity.User;
import com.shopsphere.backend.entity.Wishlist;
import com.shopsphere.backend.repository.ProductRepository;
import com.shopsphere.backend.repository.UserRepository;
import com.shopsphere.backend.repository.WishlistRepository;
import com.shopsphere.backend.service.WishlistService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WishlistServiceImpl implements WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;


    // =====================================
    // ADD TO WISHLIST
    // =====================================

    @Override
    public Wishlist addToWishlist(
            Long userId,
            Long productId
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "User not found"
                        )
                );


        Product product = productRepository.findById(productId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Product not found"
                        )
                );


        // Check already exists

        if (wishlistRepository
                .findByUserAndProduct(user, product)
                .isPresent()) {

            throw new RuntimeException(
                    "Product already in wishlist"
            );
        }


        // Create Wishlist

        Wishlist wishlist = new Wishlist();

        wishlist.setUser(user);

        wishlist.setProduct(product);


        return wishlistRepository.save(wishlist);
    }


    // =====================================
    // GET USER WISHLIST
    // =====================================

    @Override
    public List<Wishlist> getUserWishlist(
            Long userId
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "User not found"
                        )
                );


        return wishlistRepository.findByUser(user);
    }


    // =====================================
    // REMOVE FROM WISHLIST
    // =====================================

    @Override
    public void removeFromWishlist(
            Long userId,
            Long productId
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "User not found"
                        )
                );


        Product product = productRepository.findById(productId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Product not found"
                        )
                );


        Wishlist wishlist =
                wishlistRepository
                        .findByUserAndProduct(
                                user,
                                product
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Product not found in wishlist"
                                )
                        );


        wishlistRepository.delete(wishlist);
    }


    // =====================================
    // CHECK WISHLIST
    // =====================================

    @Override
    public boolean isInWishlist(
            Long userId,
            Long productId
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "User not found"
                        )
                );


        Product product = productRepository.findById(productId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Product not found"
                        )
                );


        return wishlistRepository
                .findByUserAndProduct(
                        user,
                        product
                )
                .isPresent();
    }
}