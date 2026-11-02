package com.nhom8.freelance.exceptions;

import com.nhom8.freelance.dto.ApiResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("GlobalExceptionHandler Unit Tests")
class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    @DisplayName("handleBadCredentials trả về HTTP 401 và thông báo Mật khẩu không chính xác")
    void handleBadCredentials_Returns401() {
        BadCredentialsException ex = new BadCredentialsException("Bad credentials");
        ResponseEntity<ApiResponse<String>> response = handler.handleBadCredentials(ex);

        assertNotNull(response);
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertFalse(response.getBody().isSuccess());
        assertEquals("Mật khẩu không chính xác", response.getBody().getMessage());
    }

    @Test
    @DisplayName("handleAuthenticationException trả về HTTP 401")
    void handleAuthenticationException_Returns401() {
        AuthenticationException ex = new BadCredentialsException("Authentication failed");
        ResponseEntity<ApiResponse<String>> response = handler.handleAuthenticationException(ex);

        assertNotNull(response);
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertFalse(response.getBody().isSuccess());
        assertEquals("Xác thực thất bại. Vui lòng kiểm tra lại thông tin đăng nhập!", response.getBody().getMessage());
    }

    @Test
    @DisplayName("handleBadRequest trả về HTTP 400 và message chi tiết")
    void handleBadRequest_Returns400() {
        BadRequestException ex = new BadRequestException("Người dùng không tồn tại");
        ResponseEntity<ApiResponse<String>> response = handler.handleBadRequest(ex);

        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertFalse(response.getBody().isSuccess());
        assertEquals("Người dùng không tồn tại", response.getBody().getMessage());
    }
}
