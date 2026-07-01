package com.shopsphere.backend.service;

import com.shopsphere.backend.entity.Product;

import java.util.List;

public interface ProductService {

    Product saveProduct(Product product);

   Product updateProduct(Long id, Product product);

    List<Product> getAllProducts();

    Product getProductById(Long id);

    void deleteProduct(Long id);

}