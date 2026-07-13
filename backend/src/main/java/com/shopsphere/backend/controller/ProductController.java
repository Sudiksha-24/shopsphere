package com.shopsphere.backend.controller;

import com.shopsphere.backend.dto.ProductDTO;
import com.shopsphere.backend.entity.Product;
import com.shopsphere.backend.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductService productService;

    // Save Product
    @PostMapping
    public ResponseEntity<ProductDTO> saveProduct(@Valid @RequestBody ProductDTO productDTO) {
        ProductDTO savedProduct = productService.saveProduct(productDTO);
        return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
    }

    // Get All Products
    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        List<ProductDTO> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    // Get Product By Id
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        ProductDTO product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    // Update Product
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id,
                                                 @RequestBody Product product) {

        Product updatedProduct = productService.updateProduct(id, product);
        return ResponseEntity.ok(updatedProduct);
    }

    // Delete Product
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {

        productService.deleteProduct(id);
        return ResponseEntity.ok("Product deleted successfully");
    }
}