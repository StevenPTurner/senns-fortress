package com.andrsteve.sennsfortress.authentication.providers;

import com.andrsteve.sennsfortress.validation.exceptions.UnauthorizedException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.jwk.source.JWKSourceBuilder;
import com.nimbusds.jose.proc.BadJOSEException;
import com.nimbusds.jose.proc.JWSVerificationKeySelector;
import com.nimbusds.jose.proc.SecurityContext;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.nimbusds.jwt.proc.DefaultJWTProcessor;
import lombok.Setter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.MalformedURLException;
import java.net.URI;
import java.net.URL;
import java.text.ParseException;

@Component
public class GoogleAuthProvider {
    private static final Logger log = LoggerFactory.getLogger(GoogleAuthProvider.class);
    private final String clientId;
    @Setter
    private DefaultJWTProcessor<SecurityContext> keyProcessor;

    public GoogleAuthProvider(@Value("${google.client-id}") String clientId) throws MalformedURLException {
        this.clientId = clientId;
        keyProcessor = createKeyProcessor();
    }

    public AuthProviderData validateToken(String token) throws UnauthorizedException {
        JWTClaimsSet claimsSet = validateTokenWithGoogle(token);

        if (!claimsSet.getAudience().contains(clientId)) {
            log.warn("Token was rejected, it is not for this application");
            throw new UnauthorizedException("Failed to authorize user");
        }

        try {
            return AuthProviderData.builder()
                    .id(claimsSet.getSubject())
                    .name(claimsSet.getStringClaim("name"))
                    .email(claimsSet.getStringClaim("email"))
                    .build();
        } catch (ParseException e) {
            log.error("Failed to parse claims from token", e);
            throw new UnauthorizedException("Failed to authorize user");
        }
    }

    private JWTClaimsSet validateTokenWithGoogle(String token) throws UnauthorizedException {
        try {
            SignedJWT jwt = SignedJWT.parse(token);
            return keyProcessor.process(jwt, null);
        } catch (ParseException | BadJOSEException e) {
            log.warn("Token was rejected", e);
            throw new UnauthorizedException("Failed to authorize user");
        } catch (Exception e) {
            log.error("Unexpected error trying to authorize with google", e);
            throw new UnauthorizedException("Failed to authorize user");
        }
    }

    private DefaultJWTProcessor<SecurityContext> createKeyProcessor() throws MalformedURLException {
        URL googleAuthUrl = URI.create("https://www.googleapis.com/oauth2/v3/certs").toURL();
        JWKSource<SecurityContext> jwkSource = JWKSourceBuilder.create(googleAuthUrl)
                .retrying(true)
                .cache(true)
                .build();
        JWSVerificationKeySelector<SecurityContext> keySelector =
                new JWSVerificationKeySelector<>(JWSAlgorithm.RS256, jwkSource);
        DefaultJWTProcessor<SecurityContext> keyProcessor = new DefaultJWTProcessor<>();
        keyProcessor.setJWSKeySelector(keySelector);
        return keyProcessor;
    }
}
