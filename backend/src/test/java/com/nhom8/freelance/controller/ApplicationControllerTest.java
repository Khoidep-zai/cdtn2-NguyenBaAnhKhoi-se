package com.nhom8.freelance.controller;

import com.nhom8.freelance.controllers.ApplicationController;
import com.nhom8.freelance.dto.ApiResponse;
import com.nhom8.freelance.models.Application;
import com.nhom8.freelance.security.UserPrincipal;
import com.nhom8.freelance.services.ApplicationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ApplicationController Unit Tests")
class ApplicationControllerTest {

    @Mock
    private ApplicationService applicationService;

    @InjectMocks
    private ApplicationController applicationController;

    private Application application;
    private UserPrincipal studentPrincipal;

    @BeforeEach
    void setUp() {
        application = Application.builder()
                .id(1L)
                .status("PENDING")
                .coverLetter("Xin chao")
                .build();

        studentPrincipal = new UserPrincipal(2L, "student@vanlanguni.vn", "pass", "Student Test", java.util.Collections.emptyList());
    }

    @Test
    @DisplayName("Nộp đơn ứng tuyển thành công")
    void applyJob_Success() {
        Map<String, Object> body = new HashMap<>();
        body.put("jobId", 10L);
        body.put("coverLetter", "Xin chao");
        body.put("cvUrl", "https://cv.pdf");

        when(applicationService.applyJob(eq(2L), eq(10L), eq("Xin chao"), eq("https://cv.pdf"))).thenReturn(application);

        ResponseEntity<ApiResponse<Application>> response = applicationController.applyJob(studentPrincipal, body);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertEquals("PENDING", response.getBody().getData().getStatus());
    }

    @Test
    @DisplayName("Sinh viên xem lịch sử ứng tuyển")
    void getMyApplications_Success() {
        when(applicationService.getApplicationsByStudent(2L)).thenReturn(List.of(application));

        ResponseEntity<ApiResponse<List<Application>>> response = applicationController.getMyApplications(studentPrincipal);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertEquals(1, response.getBody().getData().size());
    }

    @Test
    @DisplayName("Cập nhật trạng thái duyệt ứng viên")
    void updateStatus_Success() {
        Map<String, String> body = new HashMap<>();
        body.put("status", "ACCEPTED");

        when(applicationService.updateApplicationStatus(eq(1L), eq("ACCEPTED"), any())).thenReturn(application);

        ResponseEntity<ApiResponse<Application>> response = applicationController.updateStatus(1L, body);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
    }
}
