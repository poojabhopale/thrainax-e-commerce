package com.thrainax.shop.controller;

import com.thrainax.shop.dto.Dtos.*;
import com.thrainax.shop.security.CurrentUser;
import com.thrainax.shop.service.AuthService;
import com.thrainax.shop.service.Mapper;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final AuthService authService;
  private final CurrentUser currentUser;

  public AuthController(AuthService authService, CurrentUser currentUser) {
    this.authService = authService;
    this.currentUser = currentUser;
  }

  @PostMapping("/register")
  public AuthResponse register(@Valid @RequestBody RegisterRequest req) {
    return authService.register(req);
  }

  @PostMapping("/login")
  public AuthResponse login(@Valid @RequestBody LoginRequest req) {
    return authService.login(req);
  }

  @GetMapping("/me")
  public UserResponse me() {
    return Mapper.user(currentUser.require());
  }
}
