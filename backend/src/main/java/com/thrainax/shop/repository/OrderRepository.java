package com.thrainax.shop.repository;

import com.thrainax.shop.model.Order;
import com.thrainax.shop.model.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
  List<Order> findByUserOrderByCreatedAtDesc(UserAccount user);
  List<Order> findAllByOrderByCreatedAtDesc();
}
