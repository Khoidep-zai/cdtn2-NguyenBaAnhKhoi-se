package com.nhom8.freelance.controllers;

import com.nhom8.freelance.dto.ApiResponse;
import com.nhom8.freelance.dto.request.JobReviewRequest;
import com.nhom8.freelance.dto.request.ReportResolveRequest;
import com.nhom8.freelance.models.Job;
import com.nhom8.freelance.models.Report;
import com.nhom8.freelance.models.User;
import com.nhom8.freelance.repositories.ApplicationRepository;
import com.nhom8.freelance.repositories.JobRepository;
import com.nhom8.freelance.repositories.ReportRepository;
import com.nhom8.freelance.repositories.ReviewRepository;
import com.nhom8.freelance.repositories.UserRepository;
import com.nhom8.freelance.security.UserPrincipal;
import com.nhom8.freelance.services.JobService;
import com.nhom8.freelance.services.ReportService;
import com.nhom8.freelance.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    private final ReportRepository reportRepository;
    private final ReportService reportService;

    @GetMapping("/stats")
    @Operation(summary = "Lấy các chỉ số thống kê tổng quan của hệ thống")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalJobs", jobRepository.count());
        stats.put("totalApplications", applicationRepository.count());
        stats.put("totalReviews", reviewRepository.count());
        stats.put("pendingJobs", jobRepository.countByStatus("PENDING_REVIEW"));
        stats.put("totalReports", reportRepository.countByStatus("PENDING"));
        return ResponseEntity.ok(ApiResponse.ok("Lấy dữ liệu thống kê thành công", stats));
    }

    @GetMapping("/jobs/pending")
    @Operation(summary = "Lấy danh sách tin tuyển dụng chờ kiểm duyệt")
    public ResponseEntity<ApiResponse<Page<Job>>> getPendingJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Job> pendingJobs = jobService.getPendingJobs(pageable);
        return ResponseEntity.ok(ApiResponse.ok("Lấy danh sách tin chờ duyệt thành công", pendingJobs));
    }

    @PatchMapping("/jobs/{id}/review")
    @Operation(summary = "Quản trị viên phê duyệt hoặc từ chối tin tuyển dụng")
    public ResponseEntity<ApiResponse<Job>> reviewJob(
            @PathVariable Long id,
            @Valid @RequestBody JobReviewRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        Job job = jobService.reviewJob(id, request.getAction(), request.getRejectionReason(), currentUser.getId());
        String msg = "APPROVE".equalsIgnoreCase(request.getAction()) ? "Phê duyệt tin tuyển dụng thành công!" : "Đã từ chối tin tuyển dụng";
        return ResponseEntity.ok(ApiResponse.ok(msg, job));
    }

    @GetMapping("/reports")
    @Operation(summary = "Lấy danh sách các báo cáo phản ánh vi phạm")
    public ResponseEntity<ApiResponse<Page<Report>>> getReports(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Report> reports = reportService.getReports(status, pageable);
        return ResponseEntity.ok(ApiResponse.ok("Lấy danh sách báo cáo vi phạm thành công", reports));
    }

    @PatchMapping("/reports/{id}/resolve")
    @Operation(summary = "Quản trị viên xử lý báo cáo vi phạm")
    public ResponseEntity<ApiResponse<Report>> resolveReport(
            @PathVariable Long id,
            @Valid @RequestBody ReportResolveRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        Report report = reportService.resolveReport(id, request, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.ok("Xử lý báo cáo vi phạm thành công", report));
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
