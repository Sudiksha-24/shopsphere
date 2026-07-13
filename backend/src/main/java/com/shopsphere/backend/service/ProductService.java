package com.shopsphere.backend.service;

import com.shopsphere.backend.dto.ProductDTO;
import com.shopsphere.backend.entity.Product;

import java.util.List;

public interface ProductService {

    ProductDTO saveProduct(ProductDTO productDTO);

    Product updateProduct(Long id, Product product);

    List<ProductDTO> getAllProducts();

    ProductDTO getProductById(Long id);

    void deleteProduct(Long id);
}