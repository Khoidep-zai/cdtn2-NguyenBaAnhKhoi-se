package com.nhom8.freelance.service;

import com.nhom8.freelance.exceptions.BadRequestException;
import com.nhom8.freelance.exceptions.ResourceNotFoundException;
import com.nhom8.freelance.models.Application;
import com.nhom8.freelance.models.Job;
import com.nhom8.freelance.models.User;
import com.nhom8.freelance.repositories.ApplicationRepository;
import com.nhom8.freelance.repositories.JobRepository;
import com.nhom8.freelance.repositories.UserRepository;
import com.nhom8.freelance.services.ApplicationAcceptedEvent;
import com.nhom8.freelance.services.ApplicationRejectedEvent;
import com.nhom8.freelance.services.JobSlotsFilledEvent;
import com.nhom8.freelance.services.ApplicationService;
import com.nhom8.freelance.services.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

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

    @Mock
    private ApplicationEventPublisher eventPublisher;

    @InjectMocks
    private ApplicationService applicationService;

    private User student;
    private User employer;
    private Job job;
    private Application application;

    @BeforeEach
    void setUp() {
        student = User.builder().id(2L).email("student@test.com").fullName("Student Test").build();
        employer = User.builder().id(1L).email("employer@test.com").fullName("Employer Test").companyName("Công ty ABC").build();

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
    @DisplayName("Nộp đơn ứng tuyển thành công - Không gửi email chúc mừng")
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
        verify(eventPublisher, never()).publishEvent(any());
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

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                applicationService.applyJob(2L, 10L, "Cover letter", "cv_url")
        );
        assertEquals("Công việc này hiện không còn nhận hồ sơ", ex.getMessage());
    }

    @Test
    @DisplayName("Ném BadRequestException khi công việc đã hết hạn nộp hồ sơ (deadline quá khứ)")
    void applyJob_JobDeadlineExpired_ThrowsException() {
        job.setStatus("OPEN");
        job.setDeadline(java.time.LocalDateTime.now().minusDays(2));
        when(applicationRepository.existsByJobIdAndStudentId(10L, 2L)).thenReturn(false);
        when(jobRepository.findById(10L)).thenReturn(Optional.of(job));

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                applicationService.applyJob(2L, 10L, "Cover letter", "cv_url")
        );
        assertEquals("Công việc này đã hết hạn nộp hồ sơ!", ex.getMessage());
        verify(applicationRepository, never()).save(any(Application.class));
    }

    @Test
    @DisplayName("Nộp đơn ứng tuyển thành công khi công việc còn hạn nộp hồ sơ (deadline tương lai)")
    void applyJob_JobDeadlineValid_Success() {
        job.setStatus("OPEN");
        job.setDeadline(java.time.LocalDateTime.now().plusDays(5));
        when(applicationRepository.existsByJobIdAndStudentId(10L, 2L)).thenReturn(false);
        when(jobRepository.findById(10L)).thenReturn(Optional.of(job));
        when(userRepository.findById(2L)).thenReturn(Optional.of(student));
        when(applicationRepository.save(any(Application.class))).thenReturn(application);

        Application result = applicationService.applyJob(2L, 10L, "Cover letter", "cv_url");

        assertNotNull(result);
        assertEquals("PENDING", result.getStatus());
        verify(applicationRepository).save(any(Application.class));
    }

    @Test
    @DisplayName("Cập nhật trạng thái duyệt ứng viên thành ACCEPTED - Phát sinh sự kiện gửi email")
    void updateApplicationStatus_Accepted() {
        when(applicationRepository.findById(100L)).thenReturn(Optional.of(application));
        when(applicationRepository.save(any(Application.class))).thenReturn(application);

        Application updated = applicationService.updateApplicationStatus(100L, "ACCEPTED", null);

        assertNotNull(updated);
        assertEquals("ACCEPTED", application.getStatus());
        verify(notificationService).createNotification(eq(2L), anyString(), anyString(), eq("APPLICATION_STATUS"), anyLong());

        ArgumentCaptor<ApplicationAcceptedEvent> eventCaptor = ArgumentCaptor.forClass(ApplicationAcceptedEvent.class);
        verify(eventPublisher, times(1)).publishEvent(eventCaptor.capture());
        ApplicationAcceptedEvent event = eventCaptor.getValue();
        assertEquals(100L, event.applicationId());
        assertEquals("student@test.com", event.recipientEmail());
        assertEquals("Student Test", event.studentName());
        assertEquals("Lập trình Web", event.jobTitle());
        assertEquals("Công ty ABC", event.employerName());
    }

    @Test
    @DisplayName("Nhà tuyển dụng từ chối ứng viên (REJECTED) - Phát sinh sự kiện gửi email từ chối")
    void updateApplicationStatus_Rejected_PublishesRejectionEvent() {
        when(applicationRepository.findById(100L)).thenReturn(Optional.of(application));
        when(applicationRepository.save(any(Application.class))).thenReturn(application);

        Application updated = applicationService.updateApplicationStatus(100L, "REJECTED", "Không đủ kinh nghiệm");

        assertNotNull(updated);
        assertEquals("REJECTED", application.getStatus());
        verify(notificationService).createNotification(eq(2L), anyString(), anyString(), eq("APPLICATION_STATUS"), anyLong());

        ArgumentCaptor<ApplicationRejectedEvent> eventCaptor = ArgumentCaptor.forClass(ApplicationRejectedEvent.class);
        verify(eventPublisher, times(1)).publishEvent(eventCaptor.capture());
        ApplicationRejectedEvent event = eventCaptor.getValue();
        assertEquals(100L, event.applicationId());
        assertEquals("student@test.com", event.recipientEmail());
        assertEquals("Student Test", event.studentName());
        assertEquals("Lập trình Web", event.jobTitle());
        assertEquals("Công ty ABC", event.employerName());
        assertEquals("Không đủ kinh nghiệm", event.rejectionReason());
    }

    @Test
    @DisplayName("Duyệt ứng viên đủ chỉ tiêu slotsAvailable - Phát sinh sự kiện thông báo nhà tuyển dụng đã đủ người")
    void updateApplicationStatus_Accepted_WhenSlotsFilled_PublishesJobSlotsFilledEvent() {
        when(applicationRepository.findById(100L)).thenReturn(Optional.of(application));
        when(applicationRepository.save(any(Application.class))).thenReturn(application);
        // Job slotsAvailable = 1, countByJobIdAndStatus = 1 -> Đã đủ người
        when(applicationRepository.countByJobIdAndStatus(eq(10L), eq("ACCEPTED"))).thenReturn(1L);

        Application updated = applicationService.updateApplicationStatus(100L, "ACCEPTED", null);

        assertNotNull(updated);
        assertEquals("ACCEPTED", application.getStatus());

        ArgumentCaptor<Object> eventCaptor = ArgumentCaptor.forClass(Object.class);
        verify(eventPublisher, times(2)).publishEvent(eventCaptor.capture());

        var publishedEvents = eventCaptor.getAllValues();
        assertTrue(publishedEvents.stream().anyMatch(e -> e instanceof ApplicationAcceptedEvent));
        assertTrue(publishedEvents.stream().anyMatch(e -> e instanceof JobSlotsFilledEvent));

        JobSlotsFilledEvent filledEvent = (JobSlotsFilledEvent) publishedEvents.stream()
                .filter(e -> e instanceof JobSlotsFilledEvent)
                .findFirst()
                .orElse(null);
        assertNotNull(filledEvent);
        assertEquals(10L, filledEvent.jobId());
        assertEquals("employer@test.com", filledEvent.employerEmail());
        assertEquals("Công ty ABC", filledEvent.employerName());
        assertEquals("Lập trình Web", filledEvent.jobTitle());
        assertEquals(1, filledEvent.filledCount());
    }

    @Test
    @DisplayName("Nhấn chấp nhận lại khi hồ sơ đã ACCEPTED - Không gửi email trùng lặp")
    void updateApplicationStatus_AlreadyAccepted_DoesNotPublishDuplicateEvent() {
        application.setStatus("ACCEPTED");
        when(applicationRepository.findById(100L)).thenReturn(Optional.of(application));
        when(applicationRepository.save(any(Application.class))).thenReturn(application);

        Application updated = applicationService.updateApplicationStatus(100L, "ACCEPTED", null);

        assertNotNull(updated);
        verify(eventPublisher, never()).publishEvent(any());
    }
}
