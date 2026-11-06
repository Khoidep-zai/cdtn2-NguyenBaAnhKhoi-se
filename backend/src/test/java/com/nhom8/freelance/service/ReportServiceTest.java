package com.nhom8.freelance.service;

import com.nhom8.freelance.dto.request.ReportCreateRequest;
import com.nhom8.freelance.dto.request.ReportResolveRequest;
import com.nhom8.freelance.exceptions.BadRequestException;
import com.nhom8.freelance.models.Job;
import com.nhom8.freelance.models.Report;
import com.nhom8.freelance.models.User;
import com.nhom8.freelance.repositories.JobRepository;
import com.nhom8.freelance.repositories.ReportRepository;
import com.nhom8.freelance.repositories.UserRepository;
import com.nhom8.freelance.services.NotificationService;
import com.nhom8.freelance.services.ReportService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ReportService Unit Tests")
class ReportServiceTest {

    @Mock
    private ReportRepository reportRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private JobRepository jobRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private ReportService reportService;

    private User student;
    private User employer;
    private Job job;
    private Report sampleReport;

    @BeforeEach
    void setUp() {
        student = User.builder().id(2L).email("student@test.com").fullName("Student Test").build();
        employer = User.builder().id(3L).email("employer@test.com").fullName("Employer Test").build();
        job = Job.builder().id(100L).title("Việc part-time").employer(employer).status("OPEN").build();
        sampleReport = Report.builder()
                .id(1L)
                .reporter(student)
                .job(job)
                .reason("SCAM_DEPOSIT")
                .description("Yêu cầu đóng cọc 200k")
                .status("PENDING")
                .build();
    }

    @Test
    @DisplayName("Gửi báo cáo vi phạm thành công khi chưa có báo cáo trùng")
    void createReport_Success() {
        ReportCreateRequest request = ReportCreateRequest.builder()
                .jobId(100L)
                .reason("SCAM_DEPOSIT")
                .description("Yêu cầu đóng cọc 200k")
                .build();

        when(userRepository.findById(2L)).thenReturn(Optional.of(student));
        when(jobRepository.findById(100L)).thenReturn(Optional.of(job));
        when(reportRepository.findByReporterIdAndJobIdAndStatus(2L, 100L, "PENDING")).thenReturn(Optional.empty());
        when(reportRepository.save(any(Report.class))).thenReturn(sampleReport);

        Report result = reportService.createReport(2L, request);

        assertNotNull(result);
        assertEquals("PENDING", result.getStatus());
        assertEquals("SCAM_DEPOSIT", result.getReason());
        verify(reportRepository, times(1)).save(any(Report.class));
    }

    @Test
    @DisplayName("Ném BadRequestException khi sinh viên gửi báo cáo trùng lặp cho cùng một tin")
    void createReport_Duplicate_ThrowsBadRequest() {
        ReportCreateRequest request = ReportCreateRequest.builder()
                .jobId(100L)
                .reason("SCAM_DEPOSIT")
                .build();

        when(userRepository.findById(2L)).thenReturn(Optional.of(student));
        when(jobRepository.findById(100L)).thenReturn(Optional.of(job));
        when(reportRepository.findByReporterIdAndJobIdAndStatus(2L, 100L, "PENDING")).thenReturn(Optional.of(sampleReport));

        assertThrows(BadRequestException.class, () -> reportService.createReport(2L, request));
        verify(reportRepository, never()).save(any(Report.class));
    }

    @Test
    @DisplayName("Admin xử lý báo cáo vi phạm bằng cách gỡ bỏ tin việc làm")
    void resolveReport_BanJob_Success() {
        ReportResolveRequest request = ReportResolveRequest.builder()
                .action("RESOLVE_BAN_JOB")
                .resolutionNotes("Đã xác nhận dấu hiệu thu cọc")
                .build();

        User admin = User.builder().id(1L).fullName("Admin").build();

        when(reportRepository.findById(1L)).thenReturn(Optional.of(sampleReport));
        when(userRepository.findById(1L)).thenReturn(Optional.of(admin));
        when(reportRepository.save(any(Report.class))).thenReturn(sampleReport);

        Report resolved = reportService.resolveReport(1L, request, 1L);

        assertNotNull(resolved);
        assertEquals("RESOLVED", sampleReport.getStatus());
        assertEquals("CLOSED", job.getStatus());
        verify(jobRepository, times(1)).save(job);
        verify(notificationService, times(1)).createNotification(eq(3L), anyString(), anyString(), eq("JOB_REMOVED"), eq(100L));
    }

    @Test
    @DisplayName("Admin bác bỏ báo cáo vi phạm không có cơ sở")
    void resolveReport_Dismiss_Success() {
        ReportResolveRequest request = ReportResolveRequest.builder()
                .action("DISMISS")
                .resolutionNotes("Tin đăng bình thường")
                .build();

        when(reportRepository.findById(1L)).thenReturn(Optional.of(sampleReport));
        when(userRepository.findById(1L)).thenReturn(Optional.empty());
        when(reportRepository.save(any(Report.class))).thenReturn(sampleReport);

        Report resolved = reportService.resolveReport(1L, request, 1L);

        assertNotNull(resolved);
        assertEquals("DISMISSED", sampleReport.getStatus());
        assertEquals("OPEN", job.getStatus()); // Tin vẫn mở bình thường
    }
}

