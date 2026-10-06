package com.nhom8.freelance.controllers;

import com.nhom8.freelance.dto.ApiResponse;
import com.nhom8.freelance.models.User;
import com.nhom8.freelance.security.UserPrincipal;
import com.nhom8.freelance.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Tag(name = "Người dùng (Users)", description = "Các API xem và cập nhật thông tin hồ sơ người dùng")
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    @Operation(summary = "Xem thông tin hồ sơ người dùng theo ID")
    public ResponseEntity<ApiResponse<User>> getUserProfile(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.ok("Lấy thông tin người dùng thành công", user));
    }

    @PutMapping("/profile")
    @Operation(summary = "Cập nhật thông tin hồ sơ của người dùng hiện tại")
    public ResponseEntity<ApiResponse<User>> updateProfile(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody Map<String, String> payload
    ) {
        User updated = userService.updateProfile(currentUser.getId(), payload);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật hồ sơ thành công", updated));
    }
}
