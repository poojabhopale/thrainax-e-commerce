package com.thrainax.shop.controller;

import com.thrainax.shop.model.Product;
import com.thrainax.shop.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

  private final ProductService productService;

  public ProductController(ProductService productService) {
    this.productService = productService;
  }

  @GetMapping
  public List<Product> list() {
    return productService.findAll();
  }

  @GetMapping("/{id}")
  public Product get(@PathVariable Long id) {
    return productService.findById(id);
  }
}
