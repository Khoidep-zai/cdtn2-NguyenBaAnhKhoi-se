package com.nhom8.freelance.controllers;

import com.nhom8.freelance.dto.ApiResponse;
import com.nhom8.freelance.dto.request.JobCreateRequest;
import com.nhom8.freelance.models.Job;
import com.nhom8.freelance.security.UserPrincipal;
import com.nhom8.freelance.services.JobService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/jobs")
@RequiredArgsConstructor
@Tag(name = "Việc làm (Jobs)", description = "Các API tìm kiếm, lọc, đăng bài và quản lý tin tuyển dụng")
public class JobController {

    private final JobService jobService;

    @GetMapping
    @Operation(summary = "Tìm kiếm và lọc tin việc làm đa tiêu chí")
    public ResponseEntity<ApiResponse<Page<Job>>> searchJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String jobType,
            @RequestParam(required = false) String workMode,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Job> jobs = jobService.searchJobs(keyword, categoryId, jobType, workMode, pageable);
        return ResponseEntity.ok(ApiResponse.ok("Lấy danh sách việc làm thành công", jobs));
    }

    @GetMapping("/my-jobs")
    @PreAuthorize("hasAnyRole('EMPLOYER', 'ADMIN')")
    @Operation(summary = "Lấy danh sách tin tuyển dụng do NTD hiện tại đăng")
    public ResponseEntity<ApiResponse<List<Job>>> getMyJobs(@AuthenticationPrincipal UserPrincipal currentUser) {
        List<Job> jobs = jobService.getJobsByEmployer(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.ok("Lấy danh sách tin của bạn thành công", jobs));
    }

    @GetMapping("/{id:[0-9]+}")
    @Operation(summary = "Xem chi tiết một tin tuyển dụng")
    public ResponseEntity<ApiResponse<Job>> getJobById(@PathVariable Long id) {
        Job job = jobService.getJobById(id);
        return ResponseEntity.ok(ApiResponse.ok("Lấy chi tiết việc làm thành công", job));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('EMPLOYER', 'ADMIN')")
    @Operation(summary = "Nhà tuyển dụng đăng tin việc làm mới")
    public ResponseEntity<ApiResponse<Job>> createJob(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody JobCreateRequest request
    ) {
        Job job = jobService.createJob(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Đăng tin tuyển dụng thành công!", job));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('EMPLOYER', 'ADMIN')")
    @Operation(summary = "Cập nhật trạng thái vòng đời công việc")
    public ResponseEntity<ApiResponse<Job>> updateStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {
        Job job = jobService.updateJobStatus(id, status);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật trạng thái công việc thành công", job));
    }
}
