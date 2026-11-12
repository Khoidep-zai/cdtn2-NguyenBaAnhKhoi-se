package com.nhom8.freelance.service;

import com.nhom8.freelance.services.EmailService;
import jakarta.mail.Session;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Properties;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("EmailService Unit Tests")
class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private EmailService emailService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(emailService, "senderEmail", "support@freelancehub.vn");
    }

    @Test
    @DisplayName("Gửi email chúc mừng chấp nhận ứng viên thành công")
    void sendApplicationAcceptedEmail_Success() throws Exception {
        MimeMessage mimeMessage = new MimeMessage(Session.getInstance(new Properties()));
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        assertDoesNotThrow(() ->
                emailService.sendApplicationAcceptedEmail(
                        "student@test.com",
                        "Nguyễn Văn A",
                        "Java Backend Developer",
                        "FPT Software"
                )
        );

        verify(mailSender, times(1)).createMimeMessage();
        verify(mailSender, times(1)).send(any(MimeMessage.class));
        assertEquals("Chúc mừng! Đơn ứng tuyển của bạn đã được chấp nhận – FreelanceHub.", mimeMessage.getSubject());
    }

    @Test
    @DisplayName("Ném IllegalArgumentException khi email người nhận rỗng")
    void sendApplicationAcceptedEmail_EmptyRecipient_ThrowsException() {
        assertThrows(IllegalArgumentException.class, () ->
                emailService.sendApplicationAcceptedEmail(
                        "",
                        "Nguyễn Văn A",
                        "Java Backend Developer",
                        "FPT Software"
                )
        );

        verify(mailSender, never()).send(any(MimeMessage.class));
    }
}
