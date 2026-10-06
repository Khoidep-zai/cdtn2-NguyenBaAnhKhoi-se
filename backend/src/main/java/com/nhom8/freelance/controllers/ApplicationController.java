package com.nhom8.freelance.controllers;

import com.nhom8.freelance.dto.ApiResponse;
import com.nhom8.freelance.models.Application;
import com.nhom8.freelance.security.UserPrincipal;
import com.nhom8.freelance.services.ApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/applications")
@RequiredArgsConstructor
@Tag(name = "Ứng tuyển (Applications)", description = "Các API nộp hồ sơ, duyệt hồ sơ và theo dõi kết quả")
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Sinh viên nộp đơn ứng tuyển (kèm jobId trong body)")
    public ResponseEntity<ApiResponse<Application>> applyJob(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody Map<String, Object> payload
    ) {
        Long jobId = Long.valueOf(payload.get("jobId").toString());
        String coverLetter = (String) payload.get("coverLetter");
        String cvUrl = (String) payload.get("cvUrl");
        Application application = applicationService.applyJob(currentUser.getId(), jobId, coverLetter, cvUrl);
        return ResponseEntity.ok(ApiResponse.ok("Nộp đơn ứng tuyển thành công!", application));
    }

    @PostMapping("/jobs/{jobId}/apply")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Sinh viên nộp đơn ứng tuyển vào công việc theo URL param")
    public ResponseEntity<ApiResponse<Application>> applyJobByPath(
            @PathVariable Long jobId,
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody Map<String, String> payload
    ) {
        String coverLetter = payload.get("coverLetter");
        String cvUrl = payload.get("cvUrl");
        Application application = applicationService.applyJob(currentUser.getId(), jobId, coverLetter, cvUrl);
        return ResponseEntity.ok(ApiResponse.ok("Nộp đơn ứng tuyển thành công!", application));
    }

    @GetMapping("/my-applications")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Sinh viên xem lịch sử các công việc đã ứng tuyển")
    public ResponseEntity<ApiResponse<List<Application>>> getMyApplications(
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        List<Application> applications = applicationService.getApplicationsByStudent(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.ok("Lấy lịch sử ứng tuyển thành công", applications));
    }

    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasAnyRole('EMPLOYER', 'ADMIN')")
    @Operation(summary = "Nhà tuyển dụng xem danh sách ứng viên của tin đăng")
    public ResponseEntity<ApiResponse<List<Application>>> getJobApplications(
            @PathVariable Long jobId
    ) {
        List<Application> applications = applicationService.getApplicationsByJob(jobId);
        return ResponseEntity.ok(ApiResponse.ok("Lấy danh sách ứng viên thành công", applications));
    }

    @PatchMapping("/{applicationId}/status")
    @PreAuthorize("hasAnyRole('EMPLOYER', 'ADMIN')")
    @Operation(summary = "Nhà tuyển dụng xét duyệt ứng viên (Chấp nhận hoặc Từ chối)")
    public ResponseEntity<ApiResponse<Application>> updateStatus(
            @PathVariable Long applicationId,
            @RequestBody Map<String, String> payload
    ) {
        String status = payload.get("status"); // ACCEPTED, REJECTED
        String reason = payload.get("rejectionReason");
        Application application = applicationService.updateApplicationStatus(applicationId, status, reason);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật trạng thái xét duyệt thành công", application));
    }
}
