package com.nhom8.freelance.service;

import com.nhom8.freelance.exceptions.BadRequestException;
import com.nhom8.freelance.exceptions.ResourceNotFoundException;
import com.nhom8.freelance.models.Application;
import com.nhom8.freelance.models.Job;
import com.nhom8.freelance.models.User;
import com.nhom8.freelance.repositories.ApplicationRepository;
import com.nhom8.freelance.repositories.JobRepository;
import com.nhom8.freelance.repositories.UserRepository;
import com.nhom8.freelance.services.ApplicationService;
import com.nhom8.freelance.services.NotificationService;
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
@DisplayName("ApplicationService Unit Tests")
class ApplicationServiceTest {

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private JobRepository jobRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private ApplicationService applicationService;

    private User student;
    private User employer;
    private Job job;
    private Application application;

    @BeforeEach
    void setUp() {
        student = User.builder().id(2L).email("student@test.com").fullName("Student Test").build();
        employer = User.builder().id(1L).email("employer@test.com").fullName("Employer Test").build();

        job = Job.builder()
                .id(10L)
                .title("Lập trình Web")
                .employer(employer)
                .status("OPEN")
                .build();

        application = Application.builder()
                .id(100L)
                .job(job)
                .student(student)
                .status("PENDING")
                .build();
    }

    @Test
    @DisplayName("Nộp đơn ứng tuyển thành công")
    void applyJob_Success() {
        when(applicationRepository.existsByJobIdAndStudentId(10L, 2L)).thenReturn(false);
        when(jobRepository.findById(10L)).thenReturn(Optional.of(job));
        when(userRepository.findById(2L)).thenReturn(Optional.of(student));
        when(applicationRepository.save(any(Application.class))).thenReturn(application);

        Application result = applicationService.applyJob(2L, 10L, "Cover letter", "cv_url");

        assertNotNull(result);
        assertEquals("PENDING", result.getStatus());
        verify(applicationRepository).save(any(Application.class));
        verify(notificationService).createNotification(eq(1L), anyString(), anyString(), eq("NEW_APPLICATION"), anyLong());
    }

    @Test
    @DisplayName("Ném BadRequestException khi sinh viên đã nộp đơn cho công việc trước đó")
    void applyJob_AlreadyApplied_ThrowsException() {
        when(applicationRepository.existsByJobIdAndStudentId(10L, 2L)).thenReturn(true);

        assertThrows(BadRequestException.class, () ->
                applicationService.applyJob(2L, 10L, "Cover letter", "cv_url")
        );
        verify(applicationRepository, never()).save(any(Application.class));
    }

    @Test
    @DisplayName("Ném BadRequestException khi công việc đã đóng hoặc không OPEN")
    void applyJob_JobNotOpen_ThrowsException() {
        job.setStatus("CLOSED");
        when(applicationRepository.existsByJobIdAndStudentId(10L, 2L)).thenReturn(false);
        when(jobRepository.findById(10L)).thenReturn(Optional.of(job));

        assertThrows(BadRequestException.class, () ->
                applicationService.applyJob(2L, 10L, "Cover letter", "cv_url")
        );
    }

    @Test
    @DisplayName("Cập nhật trạng thái duyệt ứng viên thành ACCEPTED")
    void updateApplicationStatus_Accepted() {
        when(applicationRepository.findById(100L)).thenReturn(Optional.of(application));
        when(applicationRepository.save(any(Application.class))).thenReturn(application);

        Application updated = applicationService.updateApplicationStatus(100L, "ACCEPTED", null);

        assertNotNull(updated);
        assertEquals("ACCEPTED", application.getStatus());
        verify(notificationService).createNotification(eq(2L), anyString(), anyString(), eq("APPLICATION_STATUS"), anyLong());
    }
}
