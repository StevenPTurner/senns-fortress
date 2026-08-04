package com.andrsteve.sennsfortress.authentication;

import com.andrsteve.sennsfortress.authentication.models.AuthMethod;
import org.springframework.data.repository.ListCrudRepository;

public interface AuthMethodRepository extends ListCrudRepository<AuthMethod, Integer> {
    AuthMethod findByProviderAndProviderId(AuthProvider authProvider, String providerId);
}
