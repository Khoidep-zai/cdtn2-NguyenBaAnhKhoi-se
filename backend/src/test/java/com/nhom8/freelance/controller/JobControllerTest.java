package com.nhom8.freelance.controller;

import com.nhom8.freelance.controllers.JobController;
import com.nhom8.freelance.dto.ApiResponse;
import com.nhom8.freelance.dto.request.JobCreateRequest;
import com.nhom8.freelance.models.Job;
import com.nhom8.freelance.security.UserPrincipal;
import com.nhom8.freelance.services.JobService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("JobController Unit Tests")
class JobControllerTest {

    @Mock
    private JobService jobService;

    @InjectMocks
    private JobController jobController;

    private Job job;
    private UserPrincipal userPrincipal;

    @BeforeEach
    void setUp() {
        job = Job.builder()
                .id(1L)
                .title("Tuyển nhân viên part-time")
                .description("Phục vụ ca tối")
                .salaryAmount(BigDecimal.valueOf(30000))
                .status("OPEN")
                .build();

        userPrincipal = new UserPrincipal(1L, "emp@test.com", "pass", "Employer Test", java.util.Collections.emptyList());
    }

    @Test
    @DisplayName("Tìm kiếm tin trả về HTTP 200 và danh sách tin")
    void searchJobs_Success() {
        Page<Job> page = new PageImpl<>(List.of(job));
        when(jobService.searchJobs(any(), any(), any(), any(), any(Pageable.class))).thenReturn(page);

        ResponseEntity<ApiResponse<Page<Job>>> response = jobController.searchJobs(null, null, null, null, 0, 10);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertEquals(1, response.getBody().getData().getTotalElements());
    }

    @Test
    @DisplayName("Xem chi tiết việc làm theo ID")
    void getJobById_Success() {
        when(jobService.getJobById(1L)).thenReturn(job);

        ResponseEntity<ApiResponse<Job>> response = jobController.getJobById(1L);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertEquals("Tuyển nhân viên part-time", response.getBody().getData().getTitle());
    }

    @Test
    @DisplayName("Đăng tin việc làm mới")
    void createJob_Success() {
        JobCreateRequest req = new JobCreateRequest();
        req.setTitle("Tuyển nhân viên part-time");

        when(jobService.createJob(eq(1L), any(JobCreateRequest.class))).thenReturn(job);

        ResponseEntity<ApiResponse<Job>> response = jobController.createJob(userPrincipal, req);

        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertEquals("Tuyển nhân viên part-time", response.getBody().getData().getTitle());
    }
}
