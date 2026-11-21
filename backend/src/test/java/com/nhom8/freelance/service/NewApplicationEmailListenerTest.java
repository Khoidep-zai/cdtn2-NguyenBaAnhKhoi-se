package com.nhom8.freelance.service;

import com.nhom8.freelance.services.EmailService;
import com.nhom8.freelance.services.NewApplicationEmailListener;
import com.nhom8.freelance.services.NewApplicationEvent;
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
@DisplayName("NewApplicationEmailListener Unit Tests")
class NewApplicationEmailListenerTest {

    @Mock
    private EmailService emailService;

    @InjectMocks
    private NewApplicationEmailListener listener;

    @Test
    @DisplayName("Xử lý event ứng viên mới và gửi email thông báo cho nhà tuyển dụng thành công")
    void onNewApplication_Success() throws Exception {
        NewApplicationEvent event = new NewApplicationEvent(
                100L,
                10L,
                "employer@test.com",
                "Công ty ABC",
                "Nguyễn Văn A",
                "student@test.com",
                "Backend Java Dev",
                "Đại học Bách Khoa",
                "Công nghệ thông tin"
        );

        listener.onNewApplication(event);

        verify(emailService, times(1)).sendNewApplicationEmailToEmployer(
                "employer@test.com",
                "Công ty ABC",
                "Nguyễn Văn A",
                "student@test.com",
                "Backend Java Dev",
                "Đại học Bách Khoa",
                "Công nghệ thông tin"
        );
    }

    @Test
    @DisplayName("Bắt lỗi và ghi log khi gửi email thông báo ứng viên mới thất bại - Không gây vỡ luồng")
    void onNewApplication_Failure_HandledGracefully() throws Exception {
        NewApplicationEvent event = new NewApplicationEvent(
                100L,
                10L,
                "employer@test.com",
                "Công ty ABC",
                "Nguyễn Văn A",
                "student@test.com",
                "Backend Java Dev",
                "Đại học Bách Khoa",
                "Công nghệ thông tin"
        );

        doThrow(new MessagingException("SMTP Host Unreachable"))
                .when(emailService)
                .sendNewApplicationEmailToEmployer(any(), any(), any(), any(), any(), any(), any());

        assertDoesNotThrow(() -> listener.onNewApplication(event));
    }
}
