package com.andrsteve.sennsfortress;

import com.andrsteve.sennsfortress.authentication.AuthProvider;
import com.andrsteve.sennsfortress.validation.ErrorResponse;
import com.andrsteve.sennsfortress.validation.exceptions.*;
import io.jsonwebtoken.security.SignatureException;
import org.junit.jupiter.api.Test;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MvcResult;

import static com.andrsteve.sennsfortress.TestConstants.TOKEN_FOR_MOCK_USER_ON_APRIL_5TH_2026;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@TestPropertySource(properties = "debug.allow-all-tokens=false")
public class MainControllerAuthValidationTest extends BaseValidationTest {

    @Test
    public void authenticateWithGoogle_missingBody_throws400Request() throws Exception {
        MvcResult mvcResult = mockMvc.perform(post("/api/auth/google"))
                .andExpect(status().isBadRequest())
                .andReturn();

        assertThat(errorResponse(mvcResult), is(ErrorResponse.builder()
                .error("Bad Request")
                .message("Request body is missing")
                .statusCode(400)
                .build()));
    }

    @Test
    public void authenticateWithGoogle_invalidJson_throws400Request() throws Exception {
        MvcResult mvcResult = mockMvc.perform(
                        post("/api/auth/google")
                                .contentType("application/json")
                                .content("{")
                )
                .andExpect(status().isBadRequest())
                .andReturn();

        assertThat(errorResponse(mvcResult), is(ErrorResponse.builder()
                .error("Bad Request")
                .message("Invalid JSON in request body")
                .statusCode(400)
                .build()));
    }


    @Test
    public void authenticateWithGoogle_missingToken_throws400Request() throws Exception {
        MvcResult mvcResult = mockMvc.perform(
                        post("/api/auth/google")
                                .contentType("application/json")
                                .content("{}")
                )
                .andExpect(status().isBadRequest())
                .andReturn();

        assertThat(errorResponse(mvcResult), is(ErrorResponse.builder()
                .error("Bad Request")
                .message("token: field must be provided")
                .statusCode(400)
                .build()));
    }

    @Test
    public void authenticateWithGoogle_emptyToken_throws400Request() throws Exception {
        MvcResult mvcResult = mockMvc.perform(
                        post("/api/auth/google")
                                .contentType("application/json")
                                .content("{ \"token\": \"\"}")
                )
                .andExpect(status().isBadRequest())
                .andReturn();

        assertThat(errorResponse(mvcResult), is(ErrorResponse.builder()
                .error("Bad Request")
                .message("token: field must be provided")
                .statusCode(400)
                .build()));
    }

    @Test
    public void authenticateWithGoogle_nullToken_throws400Request() throws Exception {
        MvcResult mvcResult = mockMvc.perform(
                        post("/api/auth/google")
                                .contentType("application/json")
                                .content("{ \"token\": null}")
                )
                .andExpect(status().isBadRequest())
                .andReturn();

        assertThat(errorResponse(mvcResult), is(ErrorResponse.builder()
                .error("Bad Request")
                .message("token: field must be provided")
                .statusCode(400)
                .build()));
    }

    @Test
    public void authenticateWithGoogle_whiteSpaceToken_throws400Request() throws Exception {
        MvcResult mvcResult = mockMvc.perform(
                        post("/api/auth/google")
                                .contentType("application/json")
                                .content("{ \"token\": \"  \"}")
                )
                .andExpect(status().isBadRequest())
                .andReturn();

        assertThat(errorResponse(mvcResult), is(ErrorResponse.builder()
                .error("Bad Request")
                .message("token: field must be provided")
                .statusCode(400)
                .build()));
    }

    @Test
    public void authenticateWithGoogle_authenticateServiceThrowsABadRequest_throws400Request() throws Exception {
        when(authenticationService.authenticate(AuthProvider.GOOGLE, "12345"))
                .thenThrow(new BadRequestException("Threw a bad request"));
        MvcResult mvcResult = mockMvc.perform(
                        post("/api/auth/google")
                                .contentType("application/json")
                                .content("{ \"token\": \"12345\"}")
                )
                .andExpect(status().isBadRequest())
                .andReturn();

        assertThat(errorResponse(mvcResult), is(ErrorResponse.builder()
                .error("Bad Request")
                .message("Threw a bad request")
                .statusCode(400)
                .build()));
    }

    @Test
    public void authenticateWithGoogle_authenticateServiceThrowsUnauthorizedRequest_throws401Request() throws Exception {
        when(authenticationService.authenticate(AuthProvider.GOOGLE, "12345"))
                .thenThrow(new UnauthorizedException("Threw a unauthorized request"));
        MvcResult mvcResult = mockMvc.perform(
                        post("/api/auth/google")
                                .contentType("application/json")
                                .content("{ \"token\": \"12345\"}")
                )
                .andExpect(status().isUnauthorized())
                .andReturn();

        assertThat(errorResponse(mvcResult), is(ErrorResponse.builder()
                .error("Unauthorized")
                .message("Threw a unauthorized request")
                .statusCode(401)
                .build()));
    }

    @Test
    public void authenticateWithGoogle_authenticateServiceThrowsForbiddenRequest_throws403Request() throws Exception {
        when(authenticationService.authenticate(AuthProvider.GOOGLE, "12345"))
                .thenThrow(new ForbiddenException("Threw a forbidden request"));
        MvcResult mvcResult = mockMvc.perform(
                        post("/api/auth/google")
                                .contentType("application/json")
                                .content("{ \"token\": \"12345\"}")
                )
                .andExpect(status().isForbidden())
                .andReturn();

        assertThat(errorResponse(mvcResult), is(ErrorResponse.builder()
                .error("Forbidden")
                .message("Threw a forbidden request")
                .statusCode(403)
                .build()));
    }

    @Test
    public void securedEndPoint_noAuthentication_throws401Request() throws Exception {
        MvcResult mvcResult = mockMvc.perform(
                        get("/list/site")
                )
                .andExpect(status().isUnauthorized())
                .andReturn();

        assertThat(errorResponse(mvcResult), is(ErrorResponse.builder()
                .error("Unauthorized")
                .message("Full authentication is required to access this resource")
                .statusCode(401)
                .build()));
    }

    @Test
    public void securedEndPoint_noBearer_throws401Request() throws Exception {
        when(jwtProcessor.decodeToken(anyString()))
                .thenThrow(new SignatureException("Threw Signature Exception"));

        MvcResult mvcResult =  mockMvc.perform(
                        get("/list/site")
                                .header("Authorization", TOKEN_FOR_MOCK_USER_ON_APRIL_5TH_2026)
                )
                .andExpect(status().isUnauthorized())
                .andReturn();

        assertThat(errorResponse(mvcResult), is(ErrorResponse.builder()
                .error("Unauthorized")
                .message("Full authentication is required to access this resource")
                .statusCode(401)
                .build()));
    }

    @Test
    public void securedEndPoint_noToken_throws401Request() throws Exception {
        when(jwtProcessor.decodeToken(anyString()))
                .thenThrow(new SignatureException("Threw Signature Exception"));

        MvcResult mvcResult =  mockMvc.perform(
                        get("/list/site")
                                .header("Authorization", "Bearer")
                )
                .andExpect(status().isUnauthorized())
                .andReturn();

        assertThat(errorResponse(mvcResult), is(ErrorResponse.builder()
                .error("Unauthorized")
                .message("Bearer token is malformed")
                .statusCode(401)
                .build()));
    }

    @Test
    public void securedEndPoint_tokenFailsToDecode_throws401Request() throws Exception {
        when(jwtProcessor.decodeToken(anyString()))
                .thenThrow(new SignatureException("Threw Signature Exception"));

        MvcResult mvcResult =  mockMvc.perform(
                        get("/list/site")
                                .header("Authorization", "Bearer " + TOKEN_FOR_MOCK_USER_ON_APRIL_5TH_2026)
                )
                .andExpect(status().isUnauthorized())
                .andReturn();

        assertThat(errorResponse(mvcResult), is(ErrorResponse.builder()
                .error("Unauthorized")
                .message("Failed to authorize user")
                .statusCode(401)
                .build()));
    }
}
