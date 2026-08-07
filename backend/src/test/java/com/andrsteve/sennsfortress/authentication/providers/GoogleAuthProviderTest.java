package com.andrsteve.sennsfortress.authentication.providers;

import com.andrsteve.sennsfortress.validation.exceptions.UnauthorizedException;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.proc.BadJOSEException;
import com.nimbusds.jose.proc.SecurityContext;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.nimbusds.jwt.proc.DefaultJWTProcessor;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;

import static com.andrsteve.sennsfortress.TestConstants.VALID_GOOGLE_CLIENT_ID;
import static com.andrsteve.sennsfortress.TestConstants.VALID_GOOGLE_TOKEN;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.MockitoAnnotations.openMocks;

public class GoogleAuthProviderTest {
    GoogleAuthProvider googleAuthProvider;
    AutoCloseable autoCloseable;
    @Mock
    DefaultJWTProcessor<SecurityContext> mockKeyProcessor;

    @BeforeEach
    public void setUp() throws Exception {
        autoCloseable = openMocks(this);
        googleAuthProvider = new GoogleAuthProvider(VALID_GOOGLE_CLIENT_ID);
        googleAuthProvider.setKeyProcessor(mockKeyProcessor);
    }

    @AfterEach
    public void tearDown() throws Exception {
        autoCloseable.close();
    }

    @Test
    public void validateToken_tokenFormatIsInvalid_throwsUnauthorizedException() {
        String invalidToken = "eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxMjM0In0";

        Exception exception = assertThrows(UnauthorizedException.class,
                () -> googleAuthProvider.validateToken(invalidToken)
        );

        assertThat(exception.getMessage(), is("401 UNAUTHORIZED \"Failed to authorize user\""));
    }

    @Test
    public void validateToken_tokenIsUnauthorized_throwsUnauthorizedException() throws Exception {
        Mockito.when(mockKeyProcessor.process(any(SignedJWT.class), isNull())).thenThrow(new BadJOSEException("unauthorized"));

        Exception exception = assertThrows(UnauthorizedException.class,
                () -> googleAuthProvider.validateToken(VALID_GOOGLE_TOKEN)
        );

        assertThat(exception.getMessage(), is("401 UNAUTHORIZED \"Failed to authorize user\""));
    }

    @Test
    public void validateToken_unexpectedError_throwsUnauthorizedException() throws Exception {
        Mockito.when(mockKeyProcessor.process(any(SignedJWT.class), isNull())).thenThrow(new JOSEException());

        Exception exception = assertThrows(UnauthorizedException.class,
                () -> googleAuthProvider.validateToken(VALID_GOOGLE_TOKEN)
        );

        assertThat(exception.getMessage(), is("401 UNAUTHORIZED \"Failed to authorize user\""));
    }

    @Test
    public void validateToken_tokenNotForOurClient_throwsUnauthorizedException() throws Exception {
        Mockito.when(mockKeyProcessor.process(any(SignedJWT.class), isNull())).thenReturn(
                new JWTClaimsSet.Builder()
                        .audience("differentClientId")
                        .build()
        );

        Exception exception = assertThrows(UnauthorizedException.class,
                () -> googleAuthProvider.validateToken(VALID_GOOGLE_TOKEN)
        );

        assertThat(exception.getMessage(), is("401 UNAUTHORIZED \"Failed to authorize user\""));
    }

    @Test
    public void validateToken_nameIsNotAString_throwsUnauthorizedException() throws Exception {
        Mockito.when(mockKeyProcessor.process(any(SignedJWT.class), isNull())).thenReturn(
                new JWTClaimsSet.Builder()
                        .audience(VALID_GOOGLE_CLIENT_ID)
                        .subject("12345")
                        .claim("name", 1)
                        .claim("email", "user12345@mock.com")
                        .build()
        );

        Exception exception = assertThrows(UnauthorizedException.class,
                () -> googleAuthProvider.validateToken(VALID_GOOGLE_TOKEN)
        );

        assertThat(exception.getMessage(), is("401 UNAUTHORIZED \"Failed to authorize user\""));
    }

    @Test
    public void validateToken_emailIsNotAString_throwsUnauthorizedException() throws Exception {
        Mockito.when(mockKeyProcessor.process(any(SignedJWT.class), isNull())).thenReturn(
                new JWTClaimsSet.Builder()
                        .audience(VALID_GOOGLE_CLIENT_ID)
                        .subject("12345")
                        .claim("name", "user12345")
                        .claim("email", 1)
                        .build()
        );

        Exception exception = assertThrows(UnauthorizedException.class,
                () -> googleAuthProvider.validateToken(VALID_GOOGLE_TOKEN)
        );

        assertThat(exception.getMessage(), is("401 UNAUTHORIZED \"Failed to authorize user\""));
    }

    @Test
    public void validateToken_validToken_createsAuthProviderData() throws Exception {
        Mockito.when(mockKeyProcessor.process(any(SignedJWT.class), isNull())).thenReturn(
                new JWTClaimsSet.Builder()
                        .audience(VALID_GOOGLE_CLIENT_ID)
                        .subject("12345")
                        .claim("name", "user12345")
                        .claim("email", "user12345@mock.com")
                        .build()
        );

        AuthProviderData actualData = googleAuthProvider.validateToken(VALID_GOOGLE_TOKEN);

        assertThat(actualData, is(AuthProviderData.builder()
                .id("12345")
                .email("user12345@mock.com")
                .name("user12345")
                .build()));
    }
}