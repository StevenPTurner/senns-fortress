package com.andrsteve.sennsfortress.authentication;

import com.andrsteve.sennsfortress.authentication.models.AuthMethod;
import com.andrsteve.sennsfortress.authentication.models.AuthResponse;
import com.andrsteve.sennsfortress.authentication.providers.GoogleAuthProvider;
import com.andrsteve.sennsfortress.user.User;
import com.andrsteve.sennsfortress.validation.exceptions.BadRequestException;
import com.andrsteve.sennsfortress.validation.exceptions.ForbiddenException;
import com.andrsteve.sennsfortress.validation.exceptions.UnauthorizedException;
import com.nimbusds.jose.proc.SecurityContext;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.nimbusds.jwt.proc.DefaultJWTProcessor;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;

import java.time.Clock;

import static com.andrsteve.sennsfortress.TestConstants.*;
import static com.andrsteve.sennsfortress.authentication.AuthProvider.GOOGLE;
import static com.andrsteve.sennsfortress.authentication.AuthProvider.UNKNOWN;
import static java.time.Instant.parse;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.when;
import static org.mockito.MockitoAnnotations.openMocks;

public class AuthenticationServiceTest {
    AuthenticationService authenticationService;
    GoogleAuthProvider googleAuthProvider;
    JWTProcessor jwtProcessor;
    AutoCloseable autoCloseable;
    @Mock
    DefaultJWTProcessor<SecurityContext> keyProcessor;
    @Mock
    AuthMethodRepository authMethodRepository;

    @BeforeEach
    public void setUp() throws Exception {
        autoCloseable = openMocks(this);
        googleAuthProvider = new GoogleAuthProvider(VALID_GOOGLE_CLIENT_ID);
        googleAuthProvider.setKeyProcessor(keyProcessor);
        Clock clock = Clock.fixed(parse(APRIL_5TH_2026), UTC);
        jwtProcessor = new JWTProcessor(SECRET_KEY, clock);
        authenticationService = new AuthenticationService(googleAuthProvider, authMethodRepository, jwtProcessor);
    }

    @AfterEach
    void tearDown() throws Exception {
        autoCloseable.close();
    }

    @Test
    public void authenticate_nullToken_throwsBadRequestException() {
        Exception exception = assertThrows(BadRequestException.class,
                () -> authenticationService.authenticate(GOOGLE, null)
        );

        assertThat(exception.getMessage(), is("400 BAD_REQUEST \"A token is required\""));
    }

    @Test
    public void authenticate_emptyToken_throwsBadRequestException() {
        Exception exception = assertThrows(BadRequestException.class,
                () -> authenticationService.authenticate(GOOGLE, "")
        );

        assertThat(exception.getMessage(), is("400 BAD_REQUEST \"A token is required\""));
    }

    @Test
    public void authenticate_tokenMadeOfSpaces_throwsBadRequestException() {
        Exception exception = assertThrows(BadRequestException.class,
                () -> authenticationService.authenticate(GOOGLE, " ")
        );

        assertThat(exception.getMessage(), is("400 BAD_REQUEST \"A token is required\""));
    }

    @Test
    public void authenticate_nullAuthMethod_throwsBadRequestException() {
        Exception exception = assertThrows(BadRequestException.class,
                () -> authenticationService.authenticate(null, VALID_GOOGLE_TOKEN)
        );

        assertThat(exception.getMessage(), is("400 BAD_REQUEST \"A provider is required\""));
    }

    @Test
    public void authenticate_unknownAuthMethod_throwsBadRequestException() {
        Exception exception = assertThrows(BadRequestException.class,
                () -> authenticationService.authenticate(UNKNOWN, VALID_GOOGLE_TOKEN)
        );

        assertThat(exception.getMessage(), is("400 BAD_REQUEST \"Provider 'UNKNOWN' not supported\""));
    }

    @Test
    public void authenticate_withGoogle_badToken_throwsUnauthorizedException() {
        Exception exception = assertThrows(UnauthorizedException.class,
                () -> authenticationService.authenticate(GOOGLE, "eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxMjM0In0")
        );

        assertThat(exception.getMessage(), is("401 UNAUTHORIZED \"Failed to authorize user\""));
    }

    @Test
    public void authenticate_authProviderDoesNotExist_throwsForbiddenException() throws Exception {
        when(keyProcessor.process(any(SignedJWT.class), isNull())).thenReturn(
                new JWTClaimsSet.Builder()
                        .audience(VALID_GOOGLE_CLIENT_ID)
                        .subject("12345")
                        .claim("name", "user12345")
                        .claim("email", "user12345@mock.com")
                        .build()
        );
        when(authMethodRepository.findByProviderAndProviderId(GOOGLE, "12345")).thenReturn(null);

        Exception exception = assertThrows(ForbiddenException.class,
                () -> authenticationService.authenticate(GOOGLE, VALID_GOOGLE_TOKEN)
        );

        assertThat(exception.getMessage(), is("403 FORBIDDEN \"User is not authorized\""));
    }

    @Test
    public void authenticate_userIsNotActive_throwsForbiddenException() throws Exception {
        when(keyProcessor.process(any(SignedJWT.class), isNull())).thenReturn(
                new JWTClaimsSet.Builder()
                        .audience(VALID_GOOGLE_CLIENT_ID)
                        .subject("12345")
                        .claim("name", "user12345")
                        .claim("email", "user12345@mock.com")
                        .build()
        );
        when(authMethodRepository.findByProviderAndProviderId(GOOGLE, "12345")).thenReturn(
                AuthMethod.builder()
                        .id(1)
                        .provider(GOOGLE)
                        .email("user12345@mock.com")
                        .providerId("12345")
                        .user(User.builder().active(false).build())
                        .build()
        );

        Exception exception = assertThrows(ForbiddenException.class,
                () -> authenticationService.authenticate(GOOGLE, VALID_GOOGLE_TOKEN)
        );

        assertThat(exception.getMessage(), is("403 FORBIDDEN \"User is not authorized\""));
    }

    @Test
    public void authenticate_withGoogle_createsTokenSuccessfully() throws Exception {
        when(keyProcessor.process(any(SignedJWT.class), isNull())).thenReturn(
                new JWTClaimsSet.Builder()
                        .audience(VALID_GOOGLE_CLIENT_ID)
                        .subject("12345")
                        .claim("name", "user12345")
                        .claim("email", "user12345@mock.com")
                        .build()
        );
        when(authMethodRepository.findByProviderAndProviderId(GOOGLE, "12345")).thenReturn(
                AuthMethod.builder()
                        .id(1)
                        .provider(GOOGLE)
                        .email("user12345@mock.com")
                        .providerId("12345")
                        .user(User.builder()
                                .id(56789)
                                .username("mockUser")
                                .email("user12345@mock.com")
                                .active(true)
                                .build()
                        )
                        .build()
        );

        AuthResponse actualResponse = authenticationService.authenticate(GOOGLE, VALID_GOOGLE_TOKEN);

        String expectedToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1Njc4OSIsImVtYWlsIjoidXNlcjEyMzQ1QG1vY2suY29tIiwibmFtZSI6Im1vY2tVc2VyIiwiaWF0IjoxNzc1MzQ3MjAwLCJpc3MiOiJzZW5uc2ZvcnRyZXNzIiwiZXhwIjoxNzc1NDMzNjAwfQ.jWxaiksNPiMnQGro0u9fXK8IBGZThmjMhmyHQmzHhbM";
        assertThat(actualResponse, is(AuthResponse.builder()
                .name("mockUser")
                .email("user12345@mock.com")
                .token(expectedToken)
                .build()));
    }
}