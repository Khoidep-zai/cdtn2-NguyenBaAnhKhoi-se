package com.nhom8.freelance.service;

import com.nhom8.freelance.services.JobSlotsFilledEmailListener;
import com.nhom8.freelance.services.JobSlotsFilledEvent;
import com.nhom8.freelance.services.EmailService;
import jakarta.mail.MessagingException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("JobSlotsFilledEmailListener Unit Tests")
class JobSlotsFilledEmailListenerTest {

    @Mock
    private EmailService emailService;

    @InjectMocks
    private JobSlotsFilledEmailListener listener;

    @Test
    @DisplayName("Xử lý event vị trí tuyển dụng đã đủ người và gửi email cho nhà tuyển dụng thành công")
    void onJobSlotsFilled_Success() throws Exception {
        JobSlotsFilledEvent event = new JobSlotsFilledEvent(
                10L,
                "employer@test.com",
                "FPT Telecom",
                "Lập trình viên Java",
                3
        );

        listener.onJobSlotsFilled(event);

        verify(emailService, times(1)).sendJobSlotsFilledEmail(
                "employer@test.com",
                "FPT Telecom",
                "Lập trình viên Java",
                3
        );
    }

    @Test
    @DisplayName("Bắt lỗi và ghi log khi gửi email thông báo đủ người thất bại - Không làm crash chương trình")
    void onJobSlotsFilled_Failure_HandledGracefully() throws Exception {
        JobSlotsFilledEvent event = new JobSlotsFilledEvent(
                10L,
                "employer@test.com",
                "FPT Telecom",
                "Lập trình viên Java",
                3
        );

        doThrow(new MessagingException("SMTP Connection timed out"))
                .when(emailService)
                .sendJobSlotsFilledEmail(anyString(), anyString(), anyString(), anyInt());

        assertDoesNotThrow(() -> listener.onJobSlotsFilled(event));

        verify(emailService, times(1)).sendJobSlotsFilledEmail(anyString(), anyString(), anyString(), anyInt());
    }
}

