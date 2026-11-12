package com.nhom8.freelance.service;

import com.nhom8.freelance.dto.passkey.*;
import com.nhom8.freelance.dto.response.JwtAuthResponse;
import com.nhom8.freelance.exceptions.BadRequestException;
import com.nhom8.freelance.models.Role;
import com.nhom8.freelance.models.User;
import com.nhom8.freelance.repositories.UserRepository;
import com.nhom8.freelance.security.JwtTokenProvider;
import com.nhom8.freelance.services.PasskeyService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("PasskeyService Unit Tests")
class PasskeyServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @InjectMocks
    private PasskeyService passkeyService;

    private User mockUser;

    @BeforeEach
    void setUp() {
        Role studentRole = Role.builder().id(1L).name("ROLE_STUDENT").build();
        mockUser = User.builder()
                .id(10L)
                .email("student@test.com")
                .fullName("Nguyễn Văn Sinh Viên")
                .isActive(true)
                .role(studentRole)
                .build();
    }

    @Test
    @DisplayName("generateRegisterOptions - Success")
    void generateRegisterOptions_Success() {
        when(userRepository.findByEmail("student@test.com")).thenReturn(Optional.of(mockUser));

        PasskeyRegisterOptionsResponse response = passkeyService.generateRegisterOptions("student@test.com");

        assertNotNull(response);
        assertNotNull(response.getChallenge());
        assertEquals("FreelanceHub Nhóm 8", response.getRp().getName());
        assertEquals("10", response.getUser().getId());
        assertEquals("student@test.com", response.getUser().getName());
    }

    @Test
    @DisplayName("generateRegisterOptions - User Not Found")
    void generateRegisterOptions_UserNotFound() {
        when(userRepository.findByEmail("unknown@test.com")).thenReturn(Optional.empty());

        assertThrows(BadRequestException.class, () ->
                passkeyService.generateRegisterOptions("unknown@test.com"));
    }

    @Test
    @DisplayName("registerPasskey - Success")
    void registerPasskey_Success() {
        when(userRepository.findByEmail("student@test.com")).thenReturn(Optional.of(mockUser));

        PasskeyRegisterRequest req = PasskeyRegisterRequest.builder()
                .email("student@test.com")
                .credentialId("mock-credential-id-12345")
                .rawId("mock-raw-id")
                .build();

        boolean result = passkeyService.registerPasskey(req);
        assertTrue(result);
    }

    @Test
    @DisplayName("generateLoginOptions - Success")
    void generateLoginOptions_Success() {
        when(userRepository.findByEmail("student@test.com")).thenReturn(Optional.of(mockUser));

        PasskeyLoginOptionsResponse response = passkeyService.generateLoginOptions("student@test.com");

        assertNotNull(response);
        assertNotNull(response.getChallenge());
        assertEquals("localhost", response.getRpId());
    }

    @Test
    @DisplayName("generateLoginOptions - Inactive Account Throws Exception")
    void generateLoginOptions_InactiveAccount() {
        mockUser.setIsActive(false);
        when(userRepository.findByEmail("student@test.com")).thenReturn(Optional.of(mockUser));

        assertThrows(BadRequestException.class, () ->
                passkeyService.generateLoginOptions("student@test.com"));
    }

    @Test
    @DisplayName("verifyPasskeyLogin - Success")
    void verifyPasskeyLogin_Success() {
        when(userRepository.findByEmail("student@test.com")).thenReturn(Optional.of(mockUser));
        when(jwtTokenProvider.generateToken(any(Authentication.class))).thenReturn("mock.jwt.token");

        PasskeyVerifyRequest req = PasskeyVerifyRequest.builder()
                .email("student@test.com")
                .credentialId("mock-credential-id-12345")
                .clientDataJSON("mock-json")
                .signature("mock-sig")
                .build();

        JwtAuthResponse response = passkeyService.verifyPasskeyLogin(req);

        assertNotNull(response);
        assertEquals("mock.jwt.token", response.getAccessToken());
        assertEquals("student@test.com", response.getEmail());
        assertEquals("ROLE_STUDENT", response.getRole());
    }
}

