package com.thrainax.shop.security;

import com.thrainax.shop.model.UserAccount;
import com.thrainax.shop.service.ApiException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class CurrentUser {
  public UserAccount require() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null || !(auth.getPrincipal() instanceof UserAccount user)) {
      throw ApiException.unauthorized("Unauthorized. Please sign in again.");
    }
    return user;
  }
}
