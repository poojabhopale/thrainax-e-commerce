package com.thrainax.shop.service;

import com.thrainax.shop.dto.Dtos.CartItemResponse;
import com.thrainax.shop.model.CartItem;
import com.thrainax.shop.model.Product;
import com.thrainax.shop.model.UserAccount;
import com.thrainax.shop.repository.CartItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CartService {

  private final CartItemRepository cartItemRepository;
  private final ProductService productService;

  public CartService(CartItemRepository cartItemRepository, ProductService productService) {
    this.cartItemRepository = cartItemRepository;
    this.productService = productService;
  }

  @Transactional(readOnly = true)
  public List<CartItemResponse> list(UserAccount user) {
    return Mapper.cartItems(cartItemRepository.findByUserOrderByIdAsc(user));
  }

  @Transactional
  public List<CartItemResponse> add(UserAccount user, Long productId, int quantity) {
    Product product = productService.findById(productId);
    CartItem item =
        cartItemRepository
            .findByUserAndProductId(user, productId)
            .orElseGet(
                () -> {
                  CartItem fresh = new CartItem();
                  fresh.setUser(user);
                  fresh.setProduct(product);
                  fresh.setQuantity(0);
                  return fresh;
                });
    int next = item.getQuantity() + Math.max(1, quantity);
    if (next > product.getStock()) {
      throw ApiException.badRequest("Only " + product.getStock() + " unit(s) in stock.");
    }
    item.setQuantity(next);
    cartItemRepository.save(item);
    return list(user);
  }

  @Transactional
  public List<CartItemResponse> updateQuantity(UserAccount user, Long itemId, int quantity) {
    CartItem item = owned(user, itemId);
    if (quantity > item.getProduct().getStock()) {
      throw ApiException.badRequest("Only " + item.getProduct().getStock() + " unit(s) in stock.");
    }
    item.setQuantity(Math.max(1, quantity));
    cartItemRepository.save(item);
    return list(user);
  }

  @Transactional
  public List<CartItemResponse> remove(UserAccount user, Long itemId) {
    cartItemRepository.delete(owned(user, itemId));
    return list(user);
  }

  @Transactional
  public void clear(UserAccount user) {
    cartItemRepository.deleteByUser(user);
  }

  @Transactional(readOnly = true)
  public List<CartItem> entities(UserAccount user) {
    return cartItemRepository.findByUserOrderByIdAsc(user);
  }

  private CartItem owned(UserAccount user, Long itemId) {
    CartItem item =
        cartItemRepository.findById(itemId).orElseThrow(() -> ApiException.notFound("Cart item not found."));
    if (!item.getUser().getId().equals(user.getId())) {
      throw ApiException.notFound("Cart item not found.");
    }
    return item;
  }
}
