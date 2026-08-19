package com.thrainax.shop.model;

import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class Product {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String name;

  @Column(length = 1000)
  private String description;

  @Column(nullable = false)
  private String category;

  @Column(nullable = false)
  private Long price;

  @Column(nullable = false)
  private Integer stock;

  @Column(name = "image_color")
  private String imageColor = "#1e3a5f";

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public String getName() { return name; }
  public void setName(String name) { this.name = name; }
  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }
  public String getCategory() { return category; }
  public void setCategory(String category) { this.category = category; }
  public Long getPrice() { return price; }
  public void setPrice(Long price) { this.price = price; }
  public Integer getStock() { return stock; }
  public void setStock(Integer stock) { this.stock = stock; }
  public String getImageColor() { return imageColor; }
  public void setImageColor(String imageColor) { this.imageColor = imageColor; }
}
