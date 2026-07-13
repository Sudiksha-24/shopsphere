package com.shopsphere.backend.serviceImpl;

import com.shopsphere.backend.dto.ProductDTO;
import com.shopsphere.backend.entity.Product;
import com.shopsphere.backend.exception.ResourceNotFoundException;
import com.shopsphere.backend.repository.ProductRepository;
import com.shopsphere.backend.service.ProductService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public ProductDTO saveProduct(ProductDTO productDTO) {

        Product product = modelMapper.map(productDTO, Product.class);

        Product savedProduct = productRepository.save(product);

        return modelMapper.map(savedProduct, ProductDTO.class);
    }

    @Override
    public Product updateProduct(Long id, Product product) {

        Product existingProduct = productRepository.findById(id).orElse(null);

        if (existingProduct == null) {
            return null;
        }

        existingProduct.setTitle(product.getTitle());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setQuantity(product.getQuantity());
        existingProduct.setImageUrl(product.getImageUrl());
        existingProduct.setBrand(product.getBrand());
        existingProduct.setCategory(product.getCategory());

        Product updatedProduct = productRepository.save(existingProduct);

        return updatedProduct;
    }

    @Override
    public List<ProductDTO> getAllProducts() {

        List<Product> products = productRepository.findAll();

        List<ProductDTO> productDTOList = new ArrayList<>();

        for (Product product : products) {
            productDTOList.add(modelMapper.map(product, ProductDTO.class));
        }

        return productDTOList;
    }

    @Override
    public ProductDTO getProductById(Long id) {

        Product product = productRepository.findById(id).orElse(null);
if(product==null){
    throw new ResourceNotFoundException("Product not found with id : " + id);
}

        return modelMapper.map(product, ProductDTO.class);
    }

    @Override
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}