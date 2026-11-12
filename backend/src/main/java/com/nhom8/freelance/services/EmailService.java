package com.nhom8.freelance.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String senderEmail;

    public void sendApplicationAcceptedEmail(
            String recipientEmail,
            String studentName,
            String jobTitle,
            String employerName
    ) throws MessagingException {
        if (recipientEmail == null || recipientEmail.isBlank()) {
            throw new IllegalArgumentException("Recipient email must not be empty");
        }

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        String from = (senderEmail != null && !senderEmail.isBlank())
                ? senderEmail
                : "no-reply@freelancehub.vn";

        helper.setFrom(from);
        helper.setTo(recipientEmail);
        helper.setSubject("Chúc mừng! Đơn ứng tuyển của bạn đã được chấp nhận – FreelanceHub.");

        String safeStudentName = studentName != null ? studentName : "bạn";
        String safeJobTitle = jobTitle != null ? jobTitle : "";
        String safeEmployerName = employerName != null ? employerName : "Nhà tuyển dụng";

        String plainText = String.format(
                "Xin chào %s,\n\n" +
                "Chúc mừng bạn!\n\n" +
                "Đơn ứng tuyển của bạn cho vị trí %s đã được nhà tuyển dụng %s chấp nhận.\n\n" +
                "Đây là một bước tiến quan trọng trong quá trình tìm kiếm cơ hội việc làm của bạn.\n\n" +
                "Vui lòng đăng nhập vào FreelanceHub để theo dõi thông tin và trao đổi các bước tiếp theo với nhà tuyển dụng.\n\n" +
                "Chúc bạn thành công!\n\n" +
                "Trân trọng,\n" +
                "FreelanceHub Team.",
                safeStudentName, safeJobTitle, safeEmployerName
        );

        String htmlContent = String.format("""
            <!DOCTYPE html>
            <html lang="vi">
            <head>
              <meta charset="UTF-8">
            </head>
            <body style="font-family: Arial, sans-serif; color: #334155; line-height: 1.6; background-color: #f8fafc; padding: 24px;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 32px; border-radius: 8px; border: 1px solid #e2e8f0;">
                <h2 style="color: #2563eb; margin-top: 0;">FreelanceHub</h2>
                <p>Xin chào <strong>%s</strong>,</p>
                <p>Chúc mừng bạn!</p>
                <p>Đơn ứng tuyển của bạn cho vị trí <strong>%s</strong> đã được nhà tuyển dụng <strong>%s</strong> chấp nhận.</p>
                <p>Đây là một bước tiến quan trọng trong quá trình tìm kiếm cơ hội việc làm của bạn.</p>
                <p>Vui lòng đăng nhập vào FreelanceHub để theo dõi thông tin và trao đổi các bước tiếp theo với nhà tuyển dụng.</p>
                <p>Chúc bạn thành công!</p>
                <p style="margin-top: 24px;">Trân trọng,<br><strong>FreelanceHub Team.</strong></p>
              </div>
            </body>
            </html>
            """,
                escapeHtml(safeStudentName),
                escapeHtml(safeJobTitle),
                escapeHtml(safeEmployerName)
        );

        helper.setText(plainText, htmlContent);
        mailSender.send(message);
    }

    private String escapeHtml(String value) {
        if (value == null) return "";
        return value.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
