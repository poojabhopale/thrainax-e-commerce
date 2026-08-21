package com.thrainax.shop.service;

import com.thrainax.shop.dto.Dtos.*;
import com.thrainax.shop.model.Role;
import com.thrainax.shop.model.UserAccount;
import com.thrainax.shop.repository.UserRepository;
import com.thrainax.shop.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;

  public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
  }

  @Transactional
  public AuthResponse register(RegisterRequest req) {
    if (userRepository.existsByEmailIgnoreCase(req.email())) {
      throw ApiException.badRequest("An account with that email already exists.");
    }
    UserAccount user = new UserAccount();
    user.setName(req.name());
    user.setEmail(req.email());
    user.setPassword(passwordEncoder.encode(req.password()));
    user.setRole(Role.USER);
    userRepository.save(user);
    return token(user);
  }

  @Transactional(readOnly = true)
  public AuthResponse login(LoginRequest req) {
    UserAccount user =
        userRepository
            .findByEmailIgnoreCase(req.email())
            .filter(u -> passwordEncoder.matches(req.password(), u.getPassword()))
            .orElseThrow(() -> ApiException.badRequest("Invalid email or password."));
    return token(user);
  }

  private AuthResponse token(UserAccount user) {
    String jwt = jwtService.generateToken(user.getId(), user.getEmail(), user.getRole().name());
    return new AuthResponse(jwt, Mapper.user(user));
  }
}
