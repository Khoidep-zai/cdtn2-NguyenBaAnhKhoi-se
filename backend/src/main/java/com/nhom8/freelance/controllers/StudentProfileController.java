package com.nhom8.freelance.controllers;

import com.nhom8.freelance.dto.ApiResponse;
import com.nhom8.freelance.dto.StudentProfileDTO;
import com.nhom8.freelance.security.UserPrincipal;
import com.nhom8.freelance.services.StudentProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/student-profile")
@RequiredArgsConstructor
@Tag(name = "Hồ sơ sinh viên chuyên nghiệp (Student Profile)", description = "Quản lý 12 khu vực thông tin hồ sơ sinh viên")
public class StudentProfileController {

    private final StudentProfileService studentProfileService;

    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Lấy hồ sơ 12 khu vực của sinh viên đang đăng nhập")
    public ResponseEntity<ApiResponse<StudentProfileDTO>> getMyProfile(
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        StudentProfileDTO profile = studentProfileService.getStudentProfile(currentUser.getId(), currentUser.getId());
        return ResponseEntity.ok(ApiResponse.ok("Lấy hồ sơ cá nhân thành công", profile));
    }

    @GetMapping("/{studentId}")
    @Operation(summary = "Xem hồ sơ công khai của sinh viên (NTD hoặc người dùng khác)")
    public ResponseEntity<ApiResponse<StudentProfileDTO>> getPublicProfile(
            @PathVariable Long studentId,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        Long currentUserId = (currentUser != null) ? currentUser.getId() : null;
        StudentProfileDTO profile = studentProfileService.getStudentProfile(studentId, currentUserId);
        return ResponseEntity.ok(ApiResponse.ok("Lấy hồ sơ sinh viên thành công", profile));
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Cập nhật thông tin hồ sơ 12 khu vực của sinh viên")
    public ResponseEntity<ApiResponse<StudentProfileDTO>> updateMyProfile(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody StudentProfileDTO dto
    ) {
        StudentProfileDTO updated = studentProfileService.updateStudentProfile(currentUser.getId(), currentUser.getId(), dto);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật hồ sơ thành công", updated));
    }
}
