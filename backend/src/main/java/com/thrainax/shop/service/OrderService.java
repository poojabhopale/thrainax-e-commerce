package com.thrainax.shop.service;

import com.thrainax.shop.dto.Dtos.OrderResponse;
import com.thrainax.shop.dto.Dtos.PlaceOrderRequest;
import com.thrainax.shop.model.*;
import com.thrainax.shop.repository.OrderRepository;
import com.thrainax.shop.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrderService {

  private final OrderRepository orderRepository;
  private final ProductRepository productRepository;
  private final CartService cartService;

  public OrderService(OrderRepository orderRepository, ProductRepository productRepository, CartService cartService) {
    this.orderRepository = orderRepository;
    this.productRepository = productRepository;
    this.cartService = cartService;
  }

  @Transactional
  public OrderResponse place(UserAccount user, PlaceOrderRequest req) {
    List<CartItem> items = cartService.entities(user);
    if (items.isEmpty()) throw ApiException.badRequest("Your cart is empty.");

    for (CartItem item : items) {
      Product product = item.getProduct();
      if (product.getStock() < item.getQuantity()) {
        throw ApiException.badRequest("Insufficient stock for " + product.getName() + ".");
      }
    }

    Order order = new Order();
    order.setUser(user);
    order.setCustomerName(user.getName());
    order.setAddress(req.address());
    order.setPhone(req.phone());
    order.setStatus(OrderStatus.PLACED);

    long total = 0;
    for (CartItem item : items) {
      Product product = item.getProduct();
      product.setStock(product.getStock() - item.getQuantity());
      productRepository.save(product);

      OrderItem line = new OrderItem();
      line.setOrder(order);
      line.setProductId(product.getId());
      line.setName(product.getName());
      line.setPrice(product.getPrice());
      line.setQuantity(item.getQuantity());
      order.getItems().add(line);
      total += product.getPrice() * item.getQuantity();
    }
    order.setTotal(total);
    orderRepository.save(order);
    cartService.clear(user);
    return Mapper.order(order);
  }

  @Transactional(readOnly = true)
  public List<OrderResponse> myOrders(UserAccount user) {
    return orderRepository.findByUserOrderByCreatedAtDesc(user).stream().map(Mapper::order).toList();
  }

  @Transactional(readOnly = true)
  public List<OrderResponse> allOrders() {
    return orderRepository.findAllByOrderByCreatedAtDesc().stream().map(Mapper::order).toList();
  }

  @Transactional(readOnly = true)
  public OrderResponse findForUser(UserAccount user, Long id) {
    Order order = orderRepository.findById(id).orElseThrow(() -> ApiException.notFound("Order not found."));
    boolean owner = order.getUser().getId().equals(user.getId());
    if (!owner && user.getRole() != Role.ADMIN) throw ApiException.notFound("Order not found.");
    return Mapper.order(order);
  }

  @Transactional
  public OrderResponse updateStatus(Long id, OrderStatus status) {
    Order order = orderRepository.findById(id).orElseThrow(() -> ApiException.notFound("Order not found."));
    order.setStatus(status);
    orderRepository.save(order);
    return Mapper.order(order);
  }
}
