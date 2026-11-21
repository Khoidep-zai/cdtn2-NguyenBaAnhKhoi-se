package com.nhom8.freelance.controllers;

import com.nhom8.freelance.dto.ApiResponse;
import com.nhom8.freelance.dto.WorkHistoryDTO;
import com.nhom8.freelance.dto.request.ConfirmCompletedRequest;
import com.nhom8.freelance.dto.request.MarkCompletedRequest;
import com.nhom8.freelance.security.UserPrincipal;
import com.nhom8.freelance.services.WorkHistoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/work-history")
@RequiredArgsConstructor
@Tag(name = "Lịch sử công việc (Work History)", description = "Quản lý và xác nhận lịch sử công việc 2 chiều")
public class WorkHistoryController {

    private final WorkHistoryService workHistoryService;

    @PostMapping("/applications/{applicationId}/mark-completed")
    @PreAuthorize("hasAnyRole('EMPLOYER', 'ADMIN')")
    @Operation(summary = "Nhà tuyển dụng xác nhận hoàn thành công việc thực tế")
    public ResponseEntity<ApiResponse<WorkHistoryDTO>> markCompleted(
            @PathVariable Long applicationId,
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody MarkCompletedRequest request
    ) {
        WorkHistoryDTO result = workHistoryService.markCompletedByEmployer(applicationId, currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Xác nhận hoàn thành công việc thành công. Đã gửi thông báo cho sinh viên.", result));
    }

    @PostMapping("/applications/{applicationId}/confirm-completed")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Sinh viên xác nhận hoàn thành công việc hoặc gửi khiếu nại")
    public ResponseEntity<ApiResponse<WorkHistoryDTO>> confirmCompleted(
            @PathVariable Long applicationId,
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody ConfirmCompletedRequest request
    ) {
        WorkHistoryDTO result = workHistoryService.confirmCompletedByStudent(applicationId, currentUser.getId(), request);
        String msg = Boolean.TRUE.equals(request.getIsDispute())
                ? "Đã ghi nhận khiếu nại của bạn về công việc này."
                : "Xác nhận hoàn thành thành công! Công việc đã được ghi nhận vào Hồ sơ của bạn.";
        return ResponseEntity.ok(ApiResponse.ok(msg, result));
    }

    @GetMapping("/student/{studentId}")
    @Operation(summary = "Lấy danh sách lịch sử công việc của sinh viên")
    public ResponseEntity<ApiResponse<List<WorkHistoryDTO>>> getStudentWorkHistory(
            @PathVariable Long studentId,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        Long currentUserId = (currentUser != null) ? currentUser.getId() : null;
        List<WorkHistoryDTO> list = workHistoryService.getWorkHistoryForStudent(studentId, currentUserId);
        return ResponseEntity.ok(ApiResponse.ok("Lấy lịch sử công việc thành công", list));
    }

    @GetMapping("/applications/{applicationId}")
    @Operation(summary = "Lấy thông tin xác nhận hoàn thành theo Application ID")
    public ResponseEntity<ApiResponse<WorkHistoryDTO>> getByApplicationId(
            @PathVariable Long applicationId,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        Long currentUserId = (currentUser != null) ? currentUser.getId() : null;
        WorkHistoryDTO dto = workHistoryService.getWorkHistoryByApplicationId(applicationId, currentUserId);
        return ResponseEntity.ok(ApiResponse.ok("Lấy thông tin hoàn thành thành công", dto));
    }
}
