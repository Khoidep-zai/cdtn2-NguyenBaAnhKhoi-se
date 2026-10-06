package com.nhom8.freelance.controller;

import com.nhom8.freelance.controllers.AuthController;
import com.nhom8.freelance.dto.ApiResponse;
import com.nhom8.freelance.dto.request.LoginRequest;
import com.nhom8.freelance.dto.request.RegisterRequest;
import com.nhom8.freelance.dto.response.JwtAuthResponse;
import com.nhom8.freelance.models.User;
import com.nhom8.freelance.security.UserPrincipal;
import com.nhom8.freelance.services.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthController Unit Tests")
class AuthControllerTest {

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    private JwtAuthResponse jwtResponse;

    @BeforeEach
    void setUp() {
        jwtResponse = JwtAuthResponse.builder()
                .accessToken("mock-jwt-token")
                .tokenType("Bearer")
                .userId(1L)
                .email("test@vanlanguni.vn")
                .fullName("Test User")
                .role("ROLE_STUDENT")
                .build();
    }

    @Test
    @DisplayName("Đăng nhập thành công trả về HTTP 200 và accessToken")
    void login_Success() {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@vanlanguni.vn");
        request.setPassword("Password123@");

        when(authService.login(any(LoginRequest.class))).thenReturn(jwtResponse);

        ResponseEntity<ApiResponse<JwtAuthResponse>> response = authController.login(request);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isSuccess());
        assertEquals("mock-jwt-token", response.getBody().getData().getAccessToken());
        verify(authService).login(request);
    }

    @Test
    @DisplayName("Đăng ký tài khoản thành công trả về HTTP 200 và token")
    void register_Success() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("newuser@vanlanguni.vn");
        request.setPassword("Password123@");
        request.setFullName("New User");
        request.setRole("ROLE_STUDENT");

        when(authService.register(any(RegisterRequest.class))).thenReturn(jwtResponse);

        ResponseEntity<ApiResponse<JwtAuthResponse>> response = authController.register(request);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isSuccess());
        assertEquals("mock-jwt-token", response.getBody().getData().getAccessToken());
        verify(authService).register(request);
    }

    @Test
    @DisplayName("Lấy thông tin tài khoản hiện tại trả về User")
    void getCurrentUser_Success() {
        UserPrincipal principal = new UserPrincipal(1L, "test@vanlanguni.vn", "pass", "Test User", java.util.Collections.emptyList());
        User user = User.builder().id(1L).email("test@vanlanguni.vn").fullName("Test User").build();

        when(authService.getCurrentUser(1L)).thenReturn(user);

        ResponseEntity<ApiResponse<User>> response = authController.getCurrentUser(principal);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertEquals("test@vanlanguni.vn", response.getBody().getData().getEmail());
        verify(authService).getCurrentUser(1L);
    }
}
