package com.andrsteve.sennsfortress;

import com.andrsteve.sennsfortress.authentication.AuthMethodRepository;
import com.andrsteve.sennsfortress.authentication.AuthenticationService;
import com.andrsteve.sennsfortress.authentication.JWTProcessor;
import com.andrsteve.sennsfortress.authentication.models.AuthMethod;
import com.andrsteve.sennsfortress.authentication.models.AuthRequest;
import com.andrsteve.sennsfortress.authentication.models.AuthResponse;
import com.andrsteve.sennsfortress.authentication.providers.GoogleAuthProvider;
import com.andrsteve.sennsfortress.listsite.ListSiteRepository;
import com.andrsteve.sennsfortress.quizsite.QuizSiteRepository;
import com.andrsteve.sennsfortress.user.User;
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
import static java.time.Instant.parse;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.*;
import static org.mockito.MockitoAnnotations.openMocks;

public class MainControllerTest {
    MainController mainController;
    AuthenticationService authenticationService;
    GoogleAuthProvider googleAuthProvider;
    Clock clock = Clock.fixed(parse(APRIL_5TH_2026), UTC);

    @Mock
    AuthMethodRepository authMethodRepository;

    @Mock
    ListSiteRepository listSiteRepository;

    @Mock
    QuizSiteRepository quizSiteRepository;

    @Mock
    DefaultJWTProcessor<SecurityContext> keyProcessor;
    AutoCloseable autoCloseable;

    @BeforeEach
    void setUp() throws Exception {
        autoCloseable = openMocks(this);
        googleAuthProvider = new GoogleAuthProvider(VALID_GOOGLE_CLIENT_ID);
        googleAuthProvider.setKeyProcessor(keyProcessor);
        authenticationService = new AuthenticationService(
                googleAuthProvider,
                authMethodRepository,
                new JWTProcessor(SECRET_KEY, clock)
        );
        mainController = new MainController(
                listSiteRepository,
                quizSiteRepository,
                authenticationService
        );
    }

    @AfterEach
    void tearDown() throws Exception {
        autoCloseable.close();
    }

    @Test
    public void healthEndpoint_returnsInfoMessage() {
        String result = mainController.health().getBody();

        assertThat(result, is("API is up and running!"));
    }

    @Test
    public void authenticateWithGoogle_authenticatesSuccessfully() throws Exception {
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

        AuthResponse actualAuthResponse = mainController.authenticateWithGoogle(
                AuthRequest.builder()
                        .token(VALID_GOOGLE_TOKEN)
                        .build()
        ).getBody();

        AuthResponse expectedAuthResponse = AuthResponse.builder()
                .name("mockUser")
                .email("user12345@mock.com")
                .token(TOKEN_FOR_MOCK_USER_ON_APRIL_5TH_2026)
                .build();
        assertThat(actualAuthResponse, is(expectedAuthResponse));
    }
}