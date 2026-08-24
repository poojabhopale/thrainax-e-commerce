package com.thrainax.shop.controller;

import com.thrainax.shop.dto.Dtos.OrderResponse;
import com.thrainax.shop.dto.Dtos.PlaceOrderRequest;
import com.thrainax.shop.security.CurrentUser;
import com.thrainax.shop.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

  private final OrderService orderService;
  private final CurrentUser currentUser;

  public OrderController(OrderService orderService, CurrentUser currentUser) {
    this.orderService = orderService;
    this.currentUser = currentUser;
  }

  @PostMapping
  public OrderResponse place(@Valid @RequestBody PlaceOrderRequest req) {
    return orderService.place(currentUser.require(), req);
  }

  @GetMapping
  public List<OrderResponse> myOrders() {
    return orderService.myOrders(currentUser.require());
  }

  @GetMapping("/{id}")
  public OrderResponse get(@PathVariable Long id) {
    return orderService.findForUser(currentUser.require(), id);
  }
}
