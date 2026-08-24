package com.thrainax.shop.config;

import com.thrainax.shop.model.Product;
import com.thrainax.shop.model.Role;
import com.thrainax.shop.model.UserAccount;
import com.thrainax.shop.repository.ProductRepository;
import com.thrainax.shop.repository.UserRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

/** Seeds the demo admin/user accounts and the catalogue used by the React preview. */
@Configuration
public class DataSeeder {

  private static final String[] COLORS = {
    "#0f766e", "#1e3a5f", "#b45309", "#7c2d12", "#155e75", "#3f6212"
  };

  private static final Object[][] PRODUCTS = {
    {"Aurora Wireless Headphones", "Audio", "Active noise cancelling over-ear headphones with 40h battery life.", 8999L, 24},
    {"Nimbus Mechanical Keyboard", "Peripherals", "Hot-swappable 75% keyboard with tactile switches and RGB.", 5499L, 40},
    {"Vector Ergonomic Mouse", "Peripherals", "Lightweight 26k DPI sensor mouse built for long sessions.", 2499L, 60},
    {"Helios 27\" 4K Monitor", "Displays", "IPS panel, 99% sRGB, USB-C power delivery for laptops.", 27999L, 12},
    {"Cobalt USB-C Hub", "Accessories", "8-in-1 hub with HDMI 4K60, ethernet and 100W passthrough.", 3299L, 75},
    {"Sentinel Laptop Backpack", "Accessories", "Water resistant 22L bag with padded 16-inch laptop sleeve.", 3799L, 35},
    {"Pulse Smart Fitness Band", "Wearables", "Heart-rate, SpO2 and sleep tracking with 10-day battery.", 2999L, 50},
    {"Orbit Bluetooth Speaker", "Audio", "360\u00b0 sound, IPX7 waterproof, 20h playtime.", 4499L, 28},
  };

  @Bean
  public ApplicationRunner seedData(
      UserRepository userRepository, ProductRepository productRepository, PasswordEncoder encoder) {
    return args -> {
      seedUser(userRepository, encoder, "Admin", "admin@thrainax.com", "admin123", Role.ADMIN);
      seedUser(userRepository, encoder, "Demo User", "user@thrainax.com", "user123", Role.USER);

      if (productRepository.count() == 0) {
        for (int i = 0; i < PRODUCTS.length; i++) {
          Object[] row = PRODUCTS[i];
          Product p = new Product();
          p.setName((String) row[0]);
          p.setCategory((String) row[1]);
          p.setDescription((String) row[2]);
          p.setPrice((Long) row[3]);
          p.setStock((Integer) row[4]);
          p.setImageColor(COLORS[i % COLORS.length]);
          productRepository.save(p);
        }
      }
    };
  }

  private void seedUser(
      UserRepository repo, PasswordEncoder encoder, String name, String email, String password, Role role) {
    if (repo.existsByEmailIgnoreCase(email)) return;
    UserAccount user = new UserAccount();
    user.setName(name);
    user.setEmail(email);
    user.setPassword(encoder.encode(password));
    user.setRole(role);
    repo.save(user);
  }
}
