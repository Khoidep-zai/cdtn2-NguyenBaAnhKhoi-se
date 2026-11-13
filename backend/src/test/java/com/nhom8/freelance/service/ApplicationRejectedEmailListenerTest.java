package com.nhom8.freelance.service;

import com.nhom8.freelance.services.ApplicationRejectedEmailListener;
import com.nhom8.freelance.services.ApplicationRejectedEvent;
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
@DisplayName("ApplicationRejectedEmailListener Unit Tests")
class ApplicationRejectedEmailListenerTest {

    @Mock
    private EmailService emailService;

    @InjectMocks
    private ApplicationRejectedEmailListener listener;

    @Test
    @DisplayName("Xử lý event từ chối hồ sơ và gửi email thành công")
    void onApplicationRejected_Success() throws Exception {
        ApplicationRejectedEvent event = new ApplicationRejectedEvent(
                101L,
                "student@test.com",
                "Nguyễn Văn B",
                "Frontend Dev",
                "FPT Software",
                "Hết hạn tuyển dụng"
        );

        listener.onApplicationRejected(event);

        verify(emailService, times(1)).sendApplicationRejectedEmail(
                "student@test.com",
                "Nguyễn Văn B",
                "Frontend Dev",
                "FPT Software",
                "Hết hạn tuyển dụng"
        );
    }

    @Test
    @DisplayName("Bắt lỗi và ghi log khi gửi email từ chối thất bại - Không làm crash chương trình")
    void onApplicationRejected_Failure_HandledGracefully() throws Exception {
        ApplicationRejectedEvent event = new ApplicationRejectedEvent(
                101L,
                "student@test.com",
                "Nguyễn Văn B",
                "Frontend Dev",
                "FPT Software",
                "Hết hạn tuyển dụng"
        );

        doThrow(new MessagingException("SMTP Connection timed out"))
                .when(emailService)
                .sendApplicationRejectedEmail(anyString(), anyString(), anyString(), anyString(), anyString());

        assertDoesNotThrow(() -> listener.onApplicationRejected(event));

        verify(emailService, times(1)).sendApplicationRejectedEmail(anyString(), anyString(), anyString(), anyString(), anyString());
    }
}

