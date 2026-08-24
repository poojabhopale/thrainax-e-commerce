package com.thrainax.shop.controller;

import com.thrainax.shop.dto.Dtos.OrderResponse;
import com.thrainax.shop.dto.Dtos.ProductRequest;
import com.thrainax.shop.dto.Dtos.UpdateOrderStatusRequest;
import com.thrainax.shop.model.Product;
import com.thrainax.shop.service.OrderService;
import com.thrainax.shop.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

  private final ProductService productService;
  private final OrderService orderService;

  public AdminController(ProductService productService, OrderService orderService) {
    this.productService = productService;
    this.orderService = orderService;
  }

  @PostMapping("/products")
  public Product create(@Valid @RequestBody ProductRequest req) {
    return productService.create(req);
  }

  @PutMapping("/products/{id}")
  public Product update(@PathVariable Long id, @Valid @RequestBody ProductRequest req) {
    return productService.update(id, req);
  }

  @DeleteMapping("/products/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    productService.delete(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/orders")
  public List<OrderResponse> orders() {
    return orderService.allOrders();
  }

  @PutMapping("/orders/{id}/status")
  public OrderResponse updateStatus(
      @PathVariable Long id, @Valid @RequestBody UpdateOrderStatusRequest req) {
    return orderService.updateStatus(id, req.status());
  }
}
