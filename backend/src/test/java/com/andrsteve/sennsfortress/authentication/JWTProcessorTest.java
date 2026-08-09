package com.andrsteve.sennsfortress.authentication;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.Clock;
import java.util.Base64;

import static com.andrsteve.sennsfortress.TestConstants.*;
import static com.andrsteve.sennsfortress.authentication.TestJWTDecoder.testDecodeToken;
import static com.andrsteve.sennsfortress.authentication.TestJWTDecoder.testGenerateToken;
import static java.time.Instant.parse;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertThrows;

class JWTProcessorTest {
    private JWTProcessor processor;
    private Clock clock;

    @BeforeEach
    public void setUp() {
        clock = Clock.fixed(parse(APRIL_5TH_2026), UTC);
        processor = new JWTProcessor(SECRET_KEY, clock);
    }

    @Test
    public void generateToken_generatesCorrectToken() {
        String token = processor.generateToken(12345, "user12345", "user12345@main.com");
        Claims claims = testDecodeToken(clock.instant(), token, SECRET_KEY);

        assertThat(claims.getSubject(), is("12345"));
        assertThat(claims.get("name"), is("user12345"));
        assertThat(claims.get("email"), is("user12345@main.com"));
        assertThat(claims.getIssuer(), is("sennsfortress"));
        assertThat(claims.getIssuedAt().toInstant(), is(parse("2026-04-05T00:00:00Z")));
        assertThat(claims.getExpiration().toInstant(), is(parse("2026-04-06T00:00:00Z")));
    }

    @Test
    public void generateToken_decodeWithWrongSecret_throwsSignatureException() {
        String token = processor.generateToken(12345, "user12345", "user12345@main.com");

        SignatureException exception = assertThrows(SignatureException.class, () ->
                testDecodeToken(clock.instant(), token, "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
        );

        assertThat(exception.getMessage(), is(
                "JWT signature does not match locally computed signature. JWT validity cannot be asserted and should not be trusted."
        ));
    }

    @Test
    public void decodeToken_decodesTokenSuccessfully() {
        String token = testGenerateToken(clock.instant(), SECRET_KEY, parse("2026-04-06T00:00:00Z"));

        Claims claims = testDecodeToken(clock.instant(), token, SECRET_KEY);

        assertThat(claims.getSubject(), is("12345"));
        assertThat(claims.get("name"), is("user12345"));
        assertThat(claims.get("email"), is("user12345@main.com"));
        assertThat(claims.getIssuedAt().toInstant(), is(parse("2026-04-05T00:00:00Z")));
        assertThat(claims.getExpiration().toInstant(), is(parse("2026-04-06T00:00:00Z")));
    }

    @Test
    public void decodeToken_expiredToken_throwsExpiredJwtException() {
        String token = testGenerateToken(clock.instant(), SECRET_KEY, parse("2026-04-04T00:00:00Z"));

        ExpiredJwtException exception = assertThrows(ExpiredJwtException.class, () ->
                processor.decodeToken(token)
        );

        assertThat(exception.getMessage(), containsString("JWT expired"));
    }

    @Test
    public void decodeToken_differentSecret_throwsSignatureException() {
        String key = Base64.getEncoder().encodeToString("different-secret-key-111111111111".getBytes());
        String token = testGenerateToken(clock.instant(), key, parse("2026-04-05T00:00:00Z"));

        SignatureException exception = assertThrows(SignatureException.class, () ->
                processor.decodeToken(token)
        );

        assertThat(exception.getMessage(), is(
                "JWT signature does not match locally computed signature. JWT validity cannot be asserted and should not be trusted."
        ));
    }

    @Test
    public void decodeToken_badToken_throwsMalformedJwtException() {
        MalformedJwtException exception = assertThrows(MalformedJwtException.class, ()->
                processor.decodeToken("bad-token")
        );

        assertThat(exception.getMessage(), is (
                "Invalid compact JWT string: Compact JWSs must contain exactly 2 period characters, and compact JWEs must contain exactly 4.  Found: 0"
        ));
    }
}
