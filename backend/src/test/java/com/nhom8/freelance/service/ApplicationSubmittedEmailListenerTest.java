package com.nhom8.freelance.service;

import com.nhom8.freelance.services.ApplicationSubmittedEmailListener;
import com.nhom8.freelance.services.ApplicationSubmittedEvent;
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
@DisplayName("ApplicationSubmittedEmailListener Unit Tests")
class ApplicationSubmittedEmailListenerTest {

    @Mock
    private EmailService emailService;

    @InjectMocks
    private ApplicationSubmittedEmailListener listener;

    @Test
    @DisplayName("Xử lý event sinh viên nộp hồ sơ và gửi email biên nhận thành công")
    void onApplicationSubmitted_Success() throws Exception {
        ApplicationSubmittedEvent event = new ApplicationSubmittedEvent(
                100L,
                10L,
                "student@test.com",
                "Nguyễn Văn A",
                "Lập trình React",
                "Công ty FPT"
        );

        listener.onApplicationSubmitted(event);

        verify(emailService, times(1)).sendApplicationSubmittedEmailToStudent(
                "student@test.com",
                "Nguyễn Văn A",
                "Lập trình React",
                "Công ty FPT"
        );
    }

    @Test
    @DisplayName("Bắt lỗi và ghi log khi gửi email biên nhận thất bại - Không gây vỡ luồng")
    void onApplicationSubmitted_Failure_HandledGracefully() throws Exception {
        ApplicationSubmittedEvent event = new ApplicationSubmittedEvent(
                100L,
                10L,
                "student@test.com",
                "Nguyễn Văn A",
                "Lập trình React",
                "Công ty FPT"
        );

        doThrow(new MessagingException("SMTP Connection Timeout"))
                .when(emailService)
                .sendApplicationSubmittedEmailToStudent(any(), any(), any(), any());

        assertDoesNotThrow(() -> listener.onApplicationSubmitted(event));
    }
}
