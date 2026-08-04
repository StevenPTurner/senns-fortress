package com.andrsteve.sennsfortress.authentication;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.Clock;
import java.time.Instant;
import java.util.Date;

import static java.time.temporal.ChronoUnit.DAYS;

@Component
public class JWTProcessor {
    private final SecretKey key;
    private final Clock clock;

    public JWTProcessor(@Value("${jwt.secret}") String jwtSecret, Clock clock) {
        this.clock = clock;
        key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    public String generateToken(Integer id, String username, String email) {
        Instant now = clock.instant();
        Instant expiry = now.plus(1, DAYS);

        return Jwts.builder()
                .subject(id.toString())
                .claim("email", email)
                .claim("name", username)
                .issuedAt(Date.from(now))
                .issuer("sennsfortress")
                .expiration(Date.from(expiry))
                .signWith(key)
                .compact();
    }

    public Claims decodeToken(String token) {
        return Jwts.parser()
                .clock(() -> Date.from(clock.instant()))
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}