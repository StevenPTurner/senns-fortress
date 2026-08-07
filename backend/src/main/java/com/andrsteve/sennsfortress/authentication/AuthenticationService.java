package com.andrsteve.sennsfortress.authentication;

import com.andrsteve.sennsfortress.authentication.models.AuthMethod;
import com.andrsteve.sennsfortress.authentication.models.AuthResponse;
import com.andrsteve.sennsfortress.authentication.providers.AuthProviderData;
import com.andrsteve.sennsfortress.authentication.providers.GoogleAuthProvider;
import com.andrsteve.sennsfortress.user.User;
import com.andrsteve.sennsfortress.validation.exceptions.BadRequestException;
import com.andrsteve.sennsfortress.validation.exceptions.ForbiddenException;
import com.andrsteve.sennsfortress.validation.exceptions.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import static com.andrsteve.sennsfortress.authentication.AuthProvider.GOOGLE;
import static org.springframework.util.StringUtils.hasText;


@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private static final Logger log = LoggerFactory.getLogger(AuthenticationService.class);

    private final GoogleAuthProvider googleAuthProvider;
    private final AuthMethodRepository authMethodRepository;
    private final JWTProcessor jwtProcessor;

    public AuthResponse authenticate(AuthProvider provider, String token) throws BadRequestException, UnauthorizedException, ForbiddenException {
        validateProviderAndToken(provider, token);
        AuthProviderData data = authenticateWithProvider(provider, token);
        AuthMethod authMethod = authMethodRepository.findByProviderAndProviderId(provider, data.getId());
        User user = validateUserIsAuthorised(authMethod);
        String jwt = jwtProcessor.generateToken(user.getId(), user.getUsername(), user.getEmail());
        return AuthResponse.builder()
                .name(user.getUsername())
                .email(user.getEmail())
                .token(jwt)
                .build();
    }

    private void validateProviderAndToken(AuthProvider provider, String token) {
        if (!hasText(token)) {
            throw new BadRequestException("A token is required");
        }

        if (provider == null) {
            throw new BadRequestException("A provider is required");
        }
    }

    private AuthProviderData authenticateWithProvider(AuthProvider provider, String token) {
        if (GOOGLE.equals(provider)) {
            return googleAuthProvider.validateToken(token);
        } else {
            throw new BadRequestException(String.format("Provider '%s' not supported", provider));
        }
    }

    private User validateUserIsAuthorised(AuthMethod authMethod) {
        if (authMethod == null) {
            log.warn("User forbidden: no auth method found");
            throw new ForbiddenException("User is not authorized");
        }

        if (!authMethod.getUser().isActive()) {
            log.warn("User forbidden: user is not active");
            throw new ForbiddenException("User is not authorized");
        }

        return authMethod.getUser();
    }
}
