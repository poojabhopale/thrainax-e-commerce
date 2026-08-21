package com.thrainax.shop.repository;

import com.thrainax.shop.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
  List<Product> findByCategoryIgnoreCase(String category);
  List<Product> findByNameContainingIgnoreCase(String name);
}
