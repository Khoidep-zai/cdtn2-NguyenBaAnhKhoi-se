package com.nhom8.freelance.service;

import com.nhom8.freelance.dto.request.LoginRequest;
import com.nhom8.freelance.dto.response.JwtAuthResponse;
import com.nhom8.freelance.exceptions.BadRequestException;
import com.nhom8.freelance.models.Role;
import com.nhom8.freelance.models.User;
import com.nhom8.freelance.repositories.RoleRepository;
import com.nhom8.freelance.repositories.UserRepository;
import com.nhom8.freelance.security.JwtTokenProvider;
import com.nhom8.freelance.services.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService Unit Tests")
class AuthServiceTest {

    public static final String VALID_HASH = "$2a$10$C1hSAVkq0Gi9/oHZyvY6E.lYxnQiF1/kM9xzSIdWcadOqurdRD9tC";

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    @InjectMocks
    private AuthService authService;

    @Test
    @DisplayName("Kiểm tra mã băm BCrypt chuẩn khớp với Password123@")
    void testPasswordMatchesSeedHash() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        assertTrue(encoder.matches("Password123@", VALID_HASH), "Hash should match Password123@");
    }

    @Test
    @DisplayName("Đăng nhập thất bại khi email không tồn tại")
    void login_ThrowsBadRequestException_WhenEmailNotFound() {
        LoginRequest req = new LoginRequest();
        req.setEmail("notfound@freelancehub.vn");
        req.setPassword("Password123@");

        when(userRepository.findByEmail("notfound@freelancehub.vn")).thenReturn(Optional.empty());

        BadRequestException ex = assertThrows(BadRequestException.class, () -> authService.login(req));
        assertEquals("Người dùng không tồn tại", ex.getMessage());
    }

    @Test
    @DisplayName("Đăng nhập thất bại khi tài khoản bị vô hiệu hóa")
    void login_ThrowsBadRequestException_WhenUserInactive() {
        LoginRequest req = new LoginRequest();
        req.setEmail("locked@freelancehub.vn");
        req.setPassword("Password123@");

        User user = User.builder()
                .id(99L)
                .email("locked@freelancehub.vn")
                .isActive(false)
                .build();

        when(userRepository.findByEmail("locked@freelancehub.vn")).thenReturn(Optional.of(user));

        BadRequestException ex = assertThrows(BadRequestException.class, () -> authService.login(req));
        assertTrue(ex.getMessage().contains("khóa hoặc vô hiệu hóa"));
    }

    @Test
    @DisplayName("Đăng nhập ném BadCredentialsException khi sai mật khẩu")
    void login_ThrowsBadCredentialsException_WhenPasswordWrong() {
        LoginRequest req = new LoginRequest();
        req.setEmail("admin@freelancehub.vn");
        req.setPassword("WrongPassword@");

        User user = User.builder()
                .id(1L)
                .email("admin@freelancehub.vn")
                .isActive(true)
                .build();

        when(userRepository.findByEmail("admin@freelancehub.vn")).thenReturn(Optional.of(user));
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        assertThrows(BadCredentialsException.class, () -> authService.login(req));
    }

    @Test
    @DisplayName("Đăng nhập thành công trả về JWT Token và thông tin người dùng")
    void login_Success() {
        LoginRequest req = new LoginRequest();
        req.setEmail("admin@freelancehub.vn");
        req.setPassword("Password123@");

        Role role = Role.builder().name("ROLE_ADMIN").build();
        User user = User.builder()
                .id(1L)
                .email("admin@freelancehub.vn")
                .fullName("Quản Trị Viên")
                .role(role)
                .isActive(true)
                .build();

        Authentication auth = mock(Authentication.class);

        when(userRepository.findByEmail("admin@freelancehub.vn")).thenReturn(Optional.of(user));
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(tokenProvider.generateToken(auth)).thenReturn("mocked.jwt.token");

        JwtAuthResponse resp = authService.login(req);

        assertNotNull(resp);
        assertEquals("mocked.jwt.token", resp.getAccessToken());
        assertEquals("Bearer", resp.getTokenType());
        assertEquals("admin@freelancehub.vn", resp.getEmail());
        assertEquals("ROLE_ADMIN", resp.getRole());
    }
}
