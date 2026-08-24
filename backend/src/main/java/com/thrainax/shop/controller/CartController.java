package com.thrainax.shop.controller;

import com.thrainax.shop.dto.Dtos.*;
import com.thrainax.shop.security.CurrentUser;
import com.thrainax.shop.service.CartService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

  private final CartService cartService;
  private final CurrentUser currentUser;

  public CartController(CartService cartService, CurrentUser currentUser) {
    this.cartService = cartService;
    this.currentUser = currentUser;
  }

  @GetMapping
  public List<CartItemResponse> list() {
    return cartService.list(currentUser.require());
  }

  @PostMapping("/items")
  public List<CartItemResponse> add(@Valid @RequestBody AddCartItemRequest req) {
    int qty = req.quantity() == null ? 1 : req.quantity();
    return cartService.add(currentUser.require(), req.productId(), qty);
  }

  @PutMapping("/items/{itemId}")
  public List<CartItemResponse> update(
      @PathVariable Long itemId, @Valid @RequestBody UpdateCartItemRequest req) {
    return cartService.updateQuantity(currentUser.require(), itemId, req.quantity());
  }

  @DeleteMapping("/items/{itemId}")
  public List<CartItemResponse> remove(@PathVariable Long itemId) {
    return cartService.remove(currentUser.require(), itemId);
  }
}
