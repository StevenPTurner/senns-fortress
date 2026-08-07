package com.andrsteve.sennsfortress.authentication;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import java.time.Instant;
import java.util.Date;

public class TestJWTDecoder {

    public static Claims testDecodeToken(Instant now, String token, String secret) {
        return Jwts.parser()
                .clock(() -> Date.from(now))
                .verifyWith(Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret)))
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public static String testGenerateToken(Instant now, String secret, Instant expiry) {
        return Jwts.builder()
                .subject("12345")
                .claim("email", "user12345@main.com")
                .claim("name", "user12345")
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .signWith(Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret)))
                .compact();
    }
}