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
    @DisplayName("Ném IllegalArgumentException khi email người nhận rỗng (Accepted)")
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

    @Test
    @DisplayName("Gửi email từ chối ứng viên thành công kèm lý do")
    void sendApplicationRejectedEmail_Success() throws Exception {
        MimeMessage mimeMessage = new MimeMessage(Session.getInstance(new Properties()));
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        assertDoesNotThrow(() ->
                emailService.sendApplicationRejectedEmail(
                        "student@test.com",
                        "Nguyễn Văn B",
                        "Frontend React Developer",
                        "Tiki Corp",
                        "Ưu tiên ứng viên có kinh nghiệm Next.js"
                )
        );

        verify(mailSender, times(1)).createMimeMessage();
        verify(mailSender, times(1)).send(any(MimeMessage.class));
        assertEquals("Thông báo kết quả ứng tuyển – FreelanceHub", mimeMessage.getSubject());
    }

    @Test
    @DisplayName("Ném IllegalArgumentException khi email người nhận rỗng (Rejected)")
    void sendApplicationRejectedEmail_EmptyRecipient_ThrowsException() {
        assertThrows(IllegalArgumentException.class, () ->
                emailService.sendApplicationRejectedEmail(
                        "   ",
                        "Nguyễn Văn B",
                        "Frontend React Developer",
                        "Tiki Corp",
                        "Chưa phù hợp"
                )
        );

        verify(mailSender, never()).send(any(MimeMessage.class));
    }

    @Test
    @DisplayName("Gửi email thông báo cho nhà tuyển dụng khi vị trí tuyển đủ số lượng")
    void sendJobSlotsFilledEmail_Success() throws Exception {
        MimeMessage mimeMessage = new MimeMessage(Session.getInstance(new Properties()));
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        assertDoesNotThrow(() ->
                emailService.sendJobSlotsFilledEmail(
                        "hr@fpt.com",
                        "FPT Software HR",
                        "Thực tập sinh Java Spring",
                        5
                )
        );

        verify(mailSender, times(1)).createMimeMessage();
        verify(mailSender, times(1)).send(any(MimeMessage.class));
        assertTrue(mimeMessage.getSubject().contains("Thực tập sinh Java Spring"));
    }

    @Test
    @DisplayName("Ném IllegalArgumentException khi email nhà tuyển dụng rỗng")
    void sendJobSlotsFilledEmail_EmptyRecipient_ThrowsException() {
        assertThrows(IllegalArgumentException.class, () ->
                emailService.sendJobSlotsFilledEmail(
                        null,
                        "FPT Software HR",
                        "Thực tập sinh Java Spring",
                        5
                )
        );

        verify(mailSender, never()).send(any(MimeMessage.class));
    }

    @Test
    @DisplayName("Gửi email mã OTP xác thực đăng ký tài khoản thành công")
    void sendRegistrationOtpEmail_Success() throws Exception {
        MimeMessage mimeMessage = new MimeMessage(Session.getInstance(new Properties()));
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        assertDoesNotThrow(() ->
                emailService.sendRegistrationOtpEmail(
                        "newuser@vanlanguni.vn",
                        "Trần Văn C",
                        "682914"
                )
        );

        verify(mailSender, times(1)).createMimeMessage();
        verify(mailSender, times(1)).send(any(MimeMessage.class));
        assertEquals("Mã xác nhận đăng ký tài khoản FreelanceHub", mimeMessage.getSubject());
    }

    @Test
    @DisplayName("Ném IllegalArgumentException khi email đăng ký rỗng")
    void sendRegistrationOtpEmail_EmptyRecipient_ThrowsException() {
        assertThrows(IllegalArgumentException.class, () ->
                emailService.sendRegistrationOtpEmail(
                        "",
                        "Trần Văn C",
                        "682914"
                )
        );

        verify(mailSender, never()).send(any(MimeMessage.class));
    }

    @Test
    @DisplayName("Gửi email mã OTP đặt lại mật khẩu thành công")
    void sendPasswordResetOtpEmail_Success() throws Exception {
        MimeMessage mimeMessage = new MimeMessage(Session.getInstance(new Properties()));
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        assertDoesNotThrow(() ->
                emailService.sendPasswordResetOtpEmail(
                        "student@vanlanguni.vn",
                        "Lê Thị D",
                        "918234"
                )
        );

        verify(mailSender, times(1)).createMimeMessage();
        verify(mailSender, times(1)).send(any(MimeMessage.class));
        assertEquals("Mã xác thực đặt lại mật khẩu FreelanceHub", mimeMessage.getSubject());
    }

    @Test
    @DisplayName("Ném IllegalArgumentException khi email đặt lại mật khẩu rỗng")
    void sendPasswordResetOtpEmail_EmptyRecipient_ThrowsException() {
        assertThrows(IllegalArgumentException.class, () ->
                emailService.sendPasswordResetOtpEmail(
                        null,
                        "Lê Thị D",
                        "918234"
                )
        );

        verify(mailSender, never()).send(any(MimeMessage.class));
    }
}
