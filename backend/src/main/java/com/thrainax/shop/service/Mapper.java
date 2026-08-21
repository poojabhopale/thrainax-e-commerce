package com.thrainax.shop.service;

import com.thrainax.shop.dto.Dtos.*;
import com.thrainax.shop.model.*;

import java.util.List;

/** Entity → DTO conversions. */
public final class Mapper {
  private Mapper() {}

  public static UserResponse user(UserAccount u) {
    return new UserResponse(u.getId(), u.getName(), u.getEmail(), u.getRole());
  }

  public static CartItemResponse cartItem(CartItem item) {
    Product p = item.getProduct();
    return new CartItemResponse(
        item.getId(), p.getId(), p.getName(), p.getPrice(), item.getQuantity(), p.getImageColor(), p.getStock());
  }

  public static List<CartItemResponse> cartItems(List<CartItem> items) {
    return items.stream().map(Mapper::cartItem).toList();
  }

  public static OrderResponse order(Order o) {
    List<OrderItemResponse> items =
        o.getItems().stream()
            .map(i -> new OrderItemResponse(i.getProductId(), i.getName(), i.getPrice(), i.getQuantity()))
            .toList();
    return new OrderResponse(
        o.getId(),
        o.getUser().getId(),
        o.getCustomerName(),
        o.getAddress(),
        o.getPhone(),
        o.getTotal(),
        o.getStatus(),
        o.getCreatedAt().toString(),
        items);
  }
}
