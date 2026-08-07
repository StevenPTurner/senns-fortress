package com.andrsteve.sennsfortress.security;

import com.andrsteve.sennsfortress.authentication.JWTProcessor;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;

@Component
public class JWTProcessorDecoder implements JwtDecoder {
    private static final Logger log = LoggerFactory.getLogger(JWTProcessorDecoder.class);
    private final JWTProcessor jwtProcessor;
    private final Boolean allowAllTokens;

    public JWTProcessorDecoder(JWTProcessor jwtProcessor, @Value("${debug.allow-all-tokens:false}") boolean allowAllTokens) {
        this.jwtProcessor = jwtProcessor;
        this.allowAllTokens = allowAllTokens;
    }

    @Override
    public Jwt decode(String token) throws BadCredentialsException {
        try {
            if (allowAllTokens) {
                log.debug("SKIPPING TOKEN DECODE: Allow all tokens enabled");
                return generateFakeToken(token);
            }

            Claims claims = jwtProcessor.decodeToken(token);
            String email = claims.get("email", String.class);

            if (claims.getIssuedAt() == null) {
                log.warn("Token rejected for {}, issuedAt missing", email);
                throw new BadCredentialsException("Failed to authorize user");
            }

            if (claims.getExpiration() == null) {
                log.warn("Token rejected for {}, expiration missing", email);
                throw new BadCredentialsException("Failed to authorize user");
            }

            return Jwt.withTokenValue(token)
                    .header("alg", "HS256")
                    .claims(c -> c.putAll(claims))
                    .issuedAt(claims.getIssuedAt().toInstant())
                    .expiresAt(claims.getExpiration().toInstant())
                    .build();
        } catch (SignatureException | ExpiredJwtException | MalformedJwtException e) {
            log.warn("Token failed to decode for: ", e);
            throw new BadCredentialsException("Failed to authorize user");
        } catch (Exception e) {
            log.error("Unexpected error: ", e);
            throw new BadCredentialsException("Failed to authorize user");
        }
    }

    private Jwt generateFakeToken(String token) {
        Instant now = Instant.now();
        return Jwt.withTokenValue(token)
                .header("alg", "none")
                .subject("12345")
                .claim("debug", true)
                .claim("name", "DebugToken")
                .claim("email", "user12345@main.com")
                .issuedAt(now)
                .expiresAt(now.plus(Duration.ofHours(1)))
                .build();
    }
}