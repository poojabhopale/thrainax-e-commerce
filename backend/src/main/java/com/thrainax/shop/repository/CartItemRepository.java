package com.thrainax.shop.repository;

import com.thrainax.shop.model.CartItem;
import com.thrainax.shop.model.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
  List<CartItem> findByUserOrderByIdAsc(UserAccount user);
  Optional<CartItem> findByUserAndProductId(UserAccount user, Long productId);
  void deleteByUser(UserAccount user);
}
