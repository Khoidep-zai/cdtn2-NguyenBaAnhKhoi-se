package com.nhom8.freelance.controllers;

import com.nhom8.freelance.dto.ApiResponse;
import com.nhom8.freelance.dto.request.ReportCreateRequest;
import com.nhom8.freelance.models.Report;
import com.nhom8.freelance.security.UserPrincipal;
import com.nhom8.freelance.services.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
@Tag(name = "Báo cáo vi phạm (Reports)", description = "Các API gửi phản ánh tin tuyển dụng lừa đảo hoặc vi phạm")
public class ReportController {

    private final ReportService reportService;

    @PostMapping
    @Operation(summary = "Người dùng gửi báo cáo tin tuyển dụng vi phạm")
    public ResponseEntity<ApiResponse<Report>> submitReport(
            @Valid @RequestBody ReportCreateRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        Report report = reportService.createReport(currentUser.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Gửi báo cáo vi phạm thành công. Ban quản trị sẽ xác minh trong vòng 24h.", report));
    }
}

