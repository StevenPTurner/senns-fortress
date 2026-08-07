package com.andrsteve.sennsfortress;

import com.andrsteve.sennsfortress.authentication.AuthenticationService;
import com.andrsteve.sennsfortress.authentication.JWTProcessor;
import com.andrsteve.sennsfortress.listsite.ListSiteRepository;
import com.andrsteve.sennsfortress.quizsite.QuizSiteRepository;
import com.andrsteve.sennsfortress.security.ErrorAuthenticationEntrypoint;
import com.andrsteve.sennsfortress.security.JWTProcessorDecoder;
import com.andrsteve.sennsfortress.security.SecurityConfig;
import com.andrsteve.sennsfortress.validation.ErrorResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import static com.andrsteve.sennsfortress.TestConstants.TOKEN_FOR_MOCK_USER_ON_APRIL_5TH_2026;


@SuppressWarnings("unused")
@WebMvcTest(MainController.class)
@Import({SecurityConfig.class, JWTProcessorDecoder.class, ErrorAuthenticationEntrypoint.class})
public class BaseValidationTest {
    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @MockitoBean
    AuthenticationService authenticationService;

    @MockitoBean
    ListSiteRepository listSiteRepository;

    @MockitoBean
    QuizSiteRepository quizSiteRepository;

    @MockitoBean
    JWTProcessor jwtProcessor;

    public String authToken() {
        return "Bearer " + TOKEN_FOR_MOCK_USER_ON_APRIL_5TH_2026;
    }

    public ErrorResponse errorResponse(MvcResult result) throws Exception {
        return objectMapper.readValue(
                result.getResponse().getContentAsString(),
                new TypeReference<>() {
                }
        );
    }

    protected MockHttpServletRequestBuilder request(MockHttpServletRequestBuilder builder) {
        return builder.header("Authorization", authToken());
    }
}