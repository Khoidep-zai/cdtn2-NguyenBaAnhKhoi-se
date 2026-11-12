package com.nhom8.freelance.controllers;

import com.nhom8.freelance.dto.ApiResponse;
import com.nhom8.freelance.dto.passkey.*;
import com.nhom8.freelance.dto.response.JwtAuthResponse;
import com.nhom8.freelance.services.PasskeyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth/passkey")
@RequiredArgsConstructor
@Tag(name = "Passkey Authentication", description = "WebAuthn / Passkey FIDO2 passwordless endpoints")
public class PasskeyController {

    private final PasskeyService passkeyService;

    @PostMapping("/register-options")
    @Operation(summary = "Generate registration challenge options for WebAuthn passkey")
    public ResponseEntity<ApiResponse<PasskeyRegisterOptionsResponse>> getRegisterOptions(
            @RequestBody Map<String, String> body) {
        String email = body.get("email");
        PasskeyRegisterOptionsResponse options = passkeyService.generateRegisterOptions(email);
        return ResponseEntity.ok(ApiResponse.ok("Tạo challenge đăng ký Passkey thành công", options));
    }

    @PostMapping("/register")
    @Operation(summary = "Finalize Passkey credential registration")
    public ResponseEntity<ApiResponse<Boolean>> registerPasskey(
            @Valid @RequestBody PasskeyRegisterRequest request) {
        boolean result = passkeyService.registerPasskey(request);
        return ResponseEntity.ok(ApiResponse.ok("Đăng ký Passkey thành công", result));
    }

    @PostMapping("/login-options")
    @Operation(summary = "Generate login challenge options for WebAuthn passkey")
    public ResponseEntity<ApiResponse<PasskeyLoginOptionsResponse>> getLoginOptions(
            @RequestBody Map<String, String> body) {
        String email = body.get("email");
        PasskeyLoginOptionsResponse options = passkeyService.generateLoginOptions(email);
        return ResponseEntity.ok(ApiResponse.ok("Tạo challenge đăng nhập Passkey thành công", options));
    }

    @PostMapping("/verify-login")
    @Operation(summary = "Verify WebAuthn passkey signature and issue JWT")
    public ResponseEntity<ApiResponse<JwtAuthResponse>> verifyPasskeyLogin(
            @Valid @RequestBody PasskeyVerifyRequest request) {
        JwtAuthResponse response = passkeyService.verifyPasskeyLogin(request);
        return ResponseEntity.ok(ApiResponse.ok("Đăng nhập bằng Passkey thành công!", response));
    }
}
