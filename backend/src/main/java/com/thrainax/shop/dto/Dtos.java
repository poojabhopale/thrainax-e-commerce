package com.thrainax.shop.dto;

import com.thrainax.shop.model.OrderStatus;
import com.thrainax.shop.model.Role;
import jakarta.validation.constraints.*;

import java.util.List;

/** Request/response payloads mirroring the frontend REST contract (src/lib/api.ts). */
public final class Dtos {
  private Dtos() {}

  public record RegisterRequest(
      @NotBlank String name,
      @NotBlank @Email String email,
      @NotBlank @Size(min = 6) String password) {}

  public record LoginRequest(@NotBlank @Email String email, @NotBlank String password) {}

  public record UserResponse(Long id, String name, String email, Role role) {}

  public record AuthResponse(String token, UserResponse user) {}

  public record ProductRequest(
      @NotBlank String name,
      String description,
      @NotBlank String category,
      @NotNull @Min(0) Long price,
      @NotNull @Min(0) Integer stock) {}

  public record CartItemResponse(
      Long id, Long productId, String name, Long price, Integer quantity, String imageColor, Integer stock) {}

  public record AddCartItemRequest(@NotNull Long productId, @Min(1) Integer quantity) {}

  public record UpdateCartItemRequest(@NotNull @Min(1) Integer quantity) {}

  public record PlaceOrderRequest(@NotBlank String address, @NotBlank String phone) {}

  public record OrderItemResponse(Long productId, String name, Long price, Integer quantity) {}

  public record OrderResponse(
      Long id,
      Long userId,
      String customerName,
      String address,
      String phone,
      Long total,
      OrderStatus status,
      String createdAt,
      List<OrderItemResponse> items) {}

  public record UpdateOrderStatusRequest(@NotNull OrderStatus status) {}

  public record ErrorResponse(String message) {}
}
