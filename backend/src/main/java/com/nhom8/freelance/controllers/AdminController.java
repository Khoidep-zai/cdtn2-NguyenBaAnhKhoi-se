package com.nhom8.freelance.controllers;

import com.nhom8.freelance.dto.ApiResponse;
import com.nhom8.freelance.models.User;
import com.nhom8.freelance.repositories.ApplicationRepository;
import com.nhom8.freelance.repositories.JobRepository;
import com.nhom8.freelance.repositories.ReviewRepository;
import com.nhom8.freelance.repositories.UserRepository;
import com.nhom8.freelance.services.JobService;
import com.nhom8.freelance.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Quản trị hệ thống (Admin)", description = "Các API thống kê, kiểm duyệt và quản lý toàn bộ hệ thống")
public class AdminController {

    private final UserService userService;
    private final JobService jobService;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final ReviewRepository reviewRepository;

    @GetMapping("/stats")
    @Operation(summary = "Lấy các chỉ số thống kê tổng quan của hệ thống")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalJobs", jobRepository.count());
        stats.put("totalApplications", applicationRepository.count());
        stats.put("totalReviews", reviewRepository.count());
        return ResponseEntity.ok(ApiResponse.ok("Lấy dữ liệu thống kê thành công", stats));
    }

    @GetMapping("/users")
    @Operation(summary = "Lấy danh sách tất cả người dùng trong hệ thống")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.ok("Lấy danh sách người dùng thành công", users));
    }

    @PatchMapping("/users/{id}/toggle-status")
    @Operation(summary = "Khóa hoặc mở khóa tài khoản người dùng")
    public ResponseEntity<ApiResponse<User>> toggleUserStatus(@PathVariable Long id) {
        User updated = userService.toggleUserActive(id);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật trạng thái người dùng thành công", updated));
    }

    @DeleteMapping("/jobs/{id}")
    @Operation(summary = "Quản trị viên gỡ bỏ tin tuyển dụng")
    public ResponseEntity<ApiResponse<Void>> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.ok(ApiResponse.ok("Đã xóa tin tuyển dụng", null));
    }
}
