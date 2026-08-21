package com.thrainax.shop.service;

import com.thrainax.shop.dto.Dtos.ProductRequest;
import com.thrainax.shop.model.Product;
import com.thrainax.shop.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductService {

  private static final String[] COLORS = {
    "#0f766e", "#1e3a5f", "#b45309", "#7c2d12", "#155e75", "#3f6212"
  };

  private final ProductRepository productRepository;

  public ProductService(ProductRepository productRepository) {
    this.productRepository = productRepository;
  }

  @Transactional(readOnly = true)
  public List<Product> findAll() {
    return productRepository.findAll();
  }

  @Transactional(readOnly = true)
  public Product findById(Long id) {
    return productRepository.findById(id).orElseThrow(() -> ApiException.notFound("Product not found."));
  }

  @Transactional
  public Product create(ProductRequest req) {
    Product product = new Product();
    apply(product, req);
    product.setImageColor(COLORS[(int) (productRepository.count() % COLORS.length)]);
    return productRepository.save(product);
  }

  @Transactional
  public Product update(Long id, ProductRequest req) {
    Product product = findById(id);
    apply(product, req);
    return productRepository.save(product);
  }

  @Transactional
  public void delete(Long id) {
    Product product = findById(id);
    productRepository.delete(product);
  }

  private void apply(Product product, ProductRequest req) {
    product.setName(req.name());
    product.setDescription(req.description());
    product.setCategory(req.category());
    product.setPrice(req.price());
    product.setStock(req.stock());
  }
}
