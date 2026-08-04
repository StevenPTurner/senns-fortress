package com.andrsteve.sennsfortress.authentication;

import com.andrsteve.sennsfortress.security.JWTProcessorDecoder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.oauth2.jwt.Jwt;

import java.time.Clock;
import java.util.Base64;
import java.util.Date;

import static com.andrsteve.sennsfortress.TestConstants.*;
import static com.andrsteve.sennsfortress.authentication.TestJWTDecoder.testGenerateToken;
import static java.time.Instant.parse;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertThrows;

class JWTProcessorDecoderTest {
    private Clock clock;
    private JWTProcessor jwtProcessor;
    private JWTProcessorDecoder endpointDecoder;

    @BeforeEach
    public void setUp() {
        clock = Clock.fixed(parse(APRIL_5TH_2026), UTC);
        jwtProcessor = new JWTProcessor(SECRET_KEY, clock);
        endpointDecoder = new JWTProcessorDecoder(jwtProcessor, false);
    }

    @Test
    public void decode_decodesTokenSuccessfully() {
        String token = testGenerateToken(clock.instant(), SECRET_KEY, parse("2026-04-06T00:00:00Z"));

        Jwt jwt = endpointDecoder.decode(token);

        assertThat(jwt.getSubject(), is("12345"));
        assertThat(jwt.getClaim("email"), is("user12345@main.com"));
        assertThat(jwt.getClaim("name"), is("user12345"));
        assertThat(jwt.getIssuedAt(), is(parse("2026-04-05T00:00:00Z")));
        assertThat(jwt.getExpiresAt(), is(parse("2026-04-06T00:00:00Z")));
    }

    @Test
    public void decodeToken_expiredToken_throwsBadCredentialsException() {
        String token = testGenerateToken(clock.instant(), SECRET_KEY, parse("2026-04-04T00:00:00Z"));

        BadCredentialsException exception = assertThrows(BadCredentialsException.class, () ->
                endpointDecoder.decode(token)
        );

        assertThat(exception.getMessage(), is("Failed to authorize user"));
    }

    @Test
    public void decodeToken_tokenEncodedWithDifferentSecret_throwsBadCredentialsException() {
        String key = Base64.getEncoder().encodeToString("different-secret-key-111111111111".getBytes());
        String token = testGenerateToken(clock.instant(), key, parse("2026-04-06T00:00:00Z"));

        BadCredentialsException exception = assertThrows(BadCredentialsException.class, () ->
                endpointDecoder.decode(token)
        );

        assertThat(exception.getMessage(), is("Failed to authorize user"));
    }

    @Test
    public void decodeToken_badToken_throwsBadCredentialsException() {
        BadCredentialsException exception = assertThrows(BadCredentialsException.class, () ->
                endpointDecoder.decode("bad-token")
        );

        assertThat(exception.getMessage(), is("Failed to authorize user"));
    }

    @Test
    public void decodeToken_missingIssuedAtClaim_throwsBadCredentialsException() {
        String token = Jwts.builder()
                .subject("12345")
                .claim("email", "user12345@main.com")
                .expiration(Date.from(parse("2026-04-06T00:00:00Z")))
                .signWith(Keys.hmacShaKeyFor(Decoders.BASE64.decode(SECRET_KEY)))
                .compact();

        BadCredentialsException exception = assertThrows(BadCredentialsException.class, () ->
                endpointDecoder.decode(token)
        );

        assertThat(exception.getMessage(), is("Failed to authorize user"));
    }

    @Test
    public void decodeToken_missingExpiredAtClaim_throwsBadCredentialsException() {
        String token = Jwts.builder()
                .subject("12345")
                .claim("email", "user12345@main.com")
                .issuedAt(Date.from(parse("2026-04-05T00:00:00Z")))
                .signWith(Keys.hmacShaKeyFor(Decoders.BASE64.decode(SECRET_KEY)))
                .compact();

        BadCredentialsException exception = assertThrows(BadCredentialsException.class, () ->
                endpointDecoder.decode(token)
        );

        assertThat(exception.getMessage(), is("Failed to authorize user"));
    }

    @Test
    public void decodeToken_unexpectedException_throwsBadCredentialsException() {
        String token = Jwts.builder()
                .subject("12345")
                .claim("email", 12345)
                .signWith(Keys.hmacShaKeyFor(Decoders.BASE64.decode(SECRET_KEY)))
                .compact();

        BadCredentialsException exception = assertThrows(BadCredentialsException.class, () ->
                endpointDecoder.decode(token)
        );

        assertThat(exception.getMessage(), is("Failed to authorize user"));
    }

    @Test
    public void decodeToken_allowAllTokensEnabled_skipsTokenValidation() {
        endpointDecoder = new JWTProcessorDecoder(jwtProcessor, true);
        String token = testGenerateToken(clock.instant(), SECRET_KEY, parse("2026-04-06T00:00:00Z"));

        Jwt debugToken = endpointDecoder.decode(token);

        assertThat(debugToken.getSubject(), is("12345"));
        assertThat(debugToken.getClaim("debug"), is(true));
        assertThat(debugToken.getClaim("name"), is("DebugToken"));
        assertThat(debugToken.getClaim("email"), is("user12345@main.com"));
    }
}