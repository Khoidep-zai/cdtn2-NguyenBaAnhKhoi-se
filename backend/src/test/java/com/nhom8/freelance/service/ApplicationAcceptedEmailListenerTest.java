package com.nhom8.freelance.service;

import com.nhom8.freelance.services.ApplicationAcceptedEmailListener;
import com.nhom8.freelance.services.ApplicationAcceptedEvent;
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
@DisplayName("ApplicationAcceptedEmailListener Unit Tests")
class ApplicationAcceptedEmailListenerTest {

    @Mock
    private EmailService emailService;

    @InjectMocks
    private ApplicationAcceptedEmailListener listener;

    @Test
    @DisplayName("Xử lý event chấp nhận hồ sơ và gửi email thành công")
    void onApplicationAccepted_Success() throws Exception {
        ApplicationAcceptedEvent event = new ApplicationAcceptedEvent(
                100L,
                "student@test.com",
                "Nguyễn Văn A",
                "Backend Dev",
                "ABC Corp"
        );

        listener.onApplicationAccepted(event);

        verify(emailService, times(1)).sendApplicationAcceptedEmail(
                "student@test.com",
                "Nguyễn Văn A",
                "Backend Dev",
                "ABC Corp"
        );
    }

    @Test
    @DisplayName("Bắt lỗi và ghi log khi gửi email thất bại - Không làm crash chương trình")
    void onApplicationAccepted_Failure_HandledGracefully() throws Exception {
        ApplicationAcceptedEvent event = new ApplicationAcceptedEvent(
                100L,
                "student@test.com",
                "Nguyễn Văn A",
                "Backend Dev",
                "ABC Corp"
        );

        doThrow(new MessagingException("SMTP Connection timed out"))
                .when(emailService)
                .sendApplicationAcceptedEmail(anyString(), anyString(), anyString(), anyString());

        assertDoesNotThrow(() -> listener.onApplicationAccepted(event));

        verify(emailService, times(1)).sendApplicationAcceptedEmail(anyString(), anyString(), anyString(), anyString());
    }
}
