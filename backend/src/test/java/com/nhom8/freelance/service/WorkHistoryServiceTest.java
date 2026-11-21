package com.nhom8.freelance.service;

import com.nhom8.freelance.dto.WorkHistoryDTO;
import com.nhom8.freelance.dto.request.ConfirmCompletedRequest;
import com.nhom8.freelance.dto.request.MarkCompletedRequest;
import com.nhom8.freelance.exceptions.BadRequestException;
import com.nhom8.freelance.models.Application;
import com.nhom8.freelance.models.Job;
import com.nhom8.freelance.models.User;
import com.nhom8.freelance.models.WorkHistory;
import com.nhom8.freelance.repositories.ApplicationRepository;
import com.nhom8.freelance.repositories.WorkHistoryRepository;
import com.nhom8.freelance.services.NotificationService;
import com.nhom8.freelance.services.WorkHistoryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WorkHistoryServiceTest {

    @Mock
    private WorkHistoryRepository workHistoryRepository;

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private WorkHistoryService workHistoryService;

    private User employer;
    private User student;
    private Job job;
    private Application application;

    @BeforeEach
    void setUp() {
        employer = User.builder().id(2L).fullName("NTD Tuyết").companyName("The Coffee House").email("recruiter@thecoffee.vn").build();
        student = User.builder().id(4L).fullName("Phạm Công Tài").email("tai@vanlanguni.vn").phone("0934567890").build();
        job = Job.builder().id(10L).title("Barista Ca Tối").employer(employer).jobType("PART_TIME").workMode("ONSITE").build();
        application = Application.builder().id(100L).job(job).student(student).status("ACCEPTED").build();
    }

    @Test
    @DisplayName("NTD đánh dấu hoàn thành thành công -> PENDING_STUDENT_CONFIRM")
    void markCompletedByEmployer_Success() {
        when(applicationRepository.findById(100L)).thenReturn(Optional.of(application));
        when(workHistoryRepository.existsByApplicationId(100L)).thenReturn(false);
        when(workHistoryRepository.save(any(WorkHistory.class))).thenAnswer(i -> {
            WorkHistory wh = i.getArgument(0);
            wh.setId(1L);
            return wh;
        });

        MarkCompletedRequest req = new MarkCompletedRequest();
        req.setStartDate(LocalDate.of(2026, 10, 1));
        req.setEndDate(LocalDate.of(2026, 11, 1));
        req.setRating(5);
        req.setFeedback("Làm việc rất chăm chỉ");

        WorkHistoryDTO result = workHistoryService.markCompletedByEmployer(100L, 2L, req);

        assertNotNull(result);
        assertEquals("PENDING_STUDENT_CONFIRM", result.getCompletionStatus());
        assertEquals("The Coffee House", result.getCompanyName());
        assertEquals(5, result.getEmployerRating());
        verify(notificationService, times(1)).createNotification(eq(4L), anyString(), anyString(), anyString(), any());
    }

    @Test
    @DisplayName("NTD đánh dấu hoàn thành thất bại nếu ngày kết thúc trước ngày bắt đầu")
    void markCompletedByEmployer_EndDateBeforeStartDate_ThrowsException() {
        when(applicationRepository.findById(100L)).thenReturn(Optional.of(application));
        when(workHistoryRepository.existsByApplicationId(100L)).thenReturn(false);

        MarkCompletedRequest req = new MarkCompletedRequest();
        req.setStartDate(LocalDate.of(2026, 11, 1));
        req.setEndDate(LocalDate.of(2026, 10, 1)); // Lỗi logic ngày

        assertThrows(BadRequestException.class, () ->
                workHistoryService.markCompletedByEmployer(100L, 2L, req)
        );
    }

    @Test
    @DisplayName("NTD đánh dấu hoàn thành thất bại nếu đơn chưa ACCEPTED")
    void markCompletedByEmployer_NotAccepted_ThrowsException() {
        application.setStatus("PENDING");
        when(applicationRepository.findById(100L)).thenReturn(Optional.of(application));

        MarkCompletedRequest req = new MarkCompletedRequest();
        req.setStartDate(LocalDate.of(2026, 10, 1));

        assertThrows(BadRequestException.class, () ->
                workHistoryService.markCompletedByEmployer(100L, 2L, req)
        );
    }

    @Test
    @DisplayName("Sinh viên xác nhận hoàn thành -> COMPLETED")
    void confirmCompletedByStudent_Success() {
        WorkHistory wh = WorkHistory.builder()
                .id(1L)
                .application(application)
                .job(job)
                .student(student)
                .employer(employer)
                .jobTitle("Barista Ca Tối")
                .completionStatus("PENDING_STUDENT_CONFIRM")
                .build();

        when(workHistoryRepository.findByApplicationId(100L)).thenReturn(Optional.of(wh));
        when(workHistoryRepository.save(any(WorkHistory.class))).thenAnswer(i -> i.getArgument(0));

        ConfirmCompletedRequest req = new ConfirmCompletedRequest();
        req.setConfirmed(true);
        req.setFeedback("Em cảm ơn công ty nhiều ạ!");

        WorkHistoryDTO result = workHistoryService.confirmCompletedByStudent(100L, 4L, req);

        assertNotNull(result);
        assertEquals("COMPLETED", result.getCompletionStatus());
        assertNotNull(result.getStudentConfirmedAt());
        verify(notificationService, times(1)).createNotification(eq(2L), anyString(), anyString(), anyString(), any());
    }

    @Test
    @DisplayName("Sinh viên gửi khiếu nại -> DISPUTED")
    void confirmCompletedByStudent_Dispute() {
        WorkHistory wh = WorkHistory.builder()
                .id(1L)
                .application(application)
                .job(job)
                .student(student)
                .employer(employer)
                .jobTitle("Barista Ca Tối")
                .completionStatus("PENDING_STUDENT_CONFIRM")
                .build();

        when(workHistoryRepository.findByApplicationId(100L)).thenReturn(Optional.of(wh));
        when(workHistoryRepository.save(any(WorkHistory.class))).thenAnswer(i -> i.getArgument(0));

        ConfirmCompletedRequest req = new ConfirmCompletedRequest();
        req.setIsDispute(true);
        req.setDisputeReason("Em làm 2 tháng chứ không phải 1 tháng");

        WorkHistoryDTO result = workHistoryService.confirmCompletedByStudent(100L, 4L, req);

        assertNotNull(result);
        assertEquals("DISPUTED", result.getCompletionStatus());
        assertEquals("Em làm 2 tháng chứ không phải 1 tháng", result.getStudentFeedback());
    }

    @Test
    @DisplayName("Chặn người dùng khác xác nhận thay sinh viên")
    void confirmCompletedByStudent_WrongStudent_ThrowsException() {
        WorkHistory wh = WorkHistory.builder()
                .id(1L)
                .application(application)
                .job(job)
                .student(student) // id = 4L
                .completionStatus("PENDING_STUDENT_CONFIRM")
                .build();

        when(workHistoryRepository.findByApplicationId(100L)).thenReturn(Optional.of(wh));

        ConfirmCompletedRequest req = new ConfirmCompletedRequest();
        req.setConfirmed(true);

        assertThrows(BadRequestException.class, () ->
                workHistoryService.confirmCompletedByStudent(100L, 999L, req) // id = 999L
        );
    }
}
