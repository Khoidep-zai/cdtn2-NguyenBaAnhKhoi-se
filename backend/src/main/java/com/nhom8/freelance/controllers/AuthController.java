package com.nhom8.freelance.controllers;

import com.nhom8.freelance.dto.ApiResponse;
import com.nhom8.freelance.dto.request.LoginRequest;
import com.nhom8.freelance.dto.request.RegisterRequest;
import com.nhom8.freelance.dto.response.JwtAuthResponse;
import com.nhom8.freelance.services.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Xác thực (Authentication)", description = "Các API đăng ký, đăng nhập và phân quyền JWT")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Đăng ký tài khoản mới (Sinh viên hoặc Nhà tuyển dụng)")
    public ResponseEntity<ApiResponse<JwtAuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        JwtAuthResponse response = authService.register(request);
        return ResponseEntity.ok(ApiResponse.ok("Đăng ký tài khoản thành công!", response));
    }

    @PostMapping("/login")
    @Operation(summary = "Đăng nhập và nhận mã JWT Token")
    public ResponseEntity<ApiResponse<JwtAuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        JwtAuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Đăng nhập thành công!", response));
    }

    @GetMapping("/me")
    @Operation(summary = "Lấy thông tin tài khoản đang đăng nhập")
    public ResponseEntity<ApiResponse<com.nhom8.freelance.models.User>> getCurrentUser(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.nhom8.freelance.security.UserPrincipal currentUser
    ) {
        com.nhom8.freelance.models.User user = authService.getCurrentUser(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.ok("Lấy thông tin thành công", user));
    }
}
