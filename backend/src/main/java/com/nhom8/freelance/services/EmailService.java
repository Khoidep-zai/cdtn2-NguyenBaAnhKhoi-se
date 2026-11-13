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

    private String getFromAddress() {
        return (senderEmail != null && !senderEmail.isBlank())
                ? senderEmail
                : "no-reply@freelancehub.vn";
    }

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

        helper.setFrom(getFromAddress());
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

    public void sendApplicationRejectedEmail(
            String recipientEmail,
            String studentName,
            String jobTitle,
            String employerName,
            String rejectionReason
    ) throws MessagingException {
        if (recipientEmail == null || recipientEmail.isBlank()) {
            throw new IllegalArgumentException("Recipient email must not be empty");
        }

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(getFromAddress());
        helper.setTo(recipientEmail);
        helper.setSubject("Thông báo kết quả ứng tuyển – FreelanceHub");

        String safeStudentName = studentName != null ? studentName : "bạn";
        String safeJobTitle = jobTitle != null ? jobTitle : "";
        String safeEmployerName = employerName != null ? employerName : "Nhà tuyển dụng";
        String reasonText = (rejectionReason != null && !rejectionReason.isBlank())
                ? "\n\nLý do từ nhà tuyển dụng: " + rejectionReason
                : "";

        String plainText = String.format(
                "Xin chào %s,\n\n" +
                "Cảm ơn bạn đã quan tâm và ứng tuyển cho vị trí %s tại %s.\n\n" +
                "Sau khi xem xét kỹ lưỡng hồ sơ, nhà tuyển dụng rất tiếc phải thông báo hiện tại hồ sơ của bạn chưa phù hợp với vị trí này.%s\n\n" +
                "Thông tin của bạn đã được lưu trữ trong hệ thống và bạn hoàn toàn có thể ứng tuyển vào các cơ hội việc làm bán thời gian khác phù hợp hơn trên FreelanceHub.\n\n" +
                "Chúc bạn luôn vững tin và sớm tìm được công việc ưng ý!\n\n" +
                "Trân trọng,\n" +
                "FreelanceHub Team.",
                safeStudentName, safeJobTitle, safeEmployerName, reasonText
        );

        String htmlReason = (rejectionReason != null && !rejectionReason.isBlank())
                ? String.format("<div style=\"background-color: #f1f5f9; padding: 12px 16px; border-left: 4px solid #64748b; margin: 16px 0; border-radius: 4px;\">" +
                                "<strong>Lý do từ nhà tuyển dụng:</strong> %s</div>", escapeHtml(rejectionReason))
                : "";

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
                <p>Cảm ơn bạn đã quan tâm và nộp hồ sơ ứng tuyển vị trí <strong>%s</strong> tại <strong>%s</strong>.</p>
                <p>Sau khi xem xét kỹ lưỡng hồ sơ và đối chiếu yêu cầu công việc, nhà tuyển dụng rất tiếc phải thông báo hiện tại hồ sơ của bạn chưa phù hợp với đợt tuyển dụng này.</p>
                %s
                <p>Hồ sơ của bạn vẫn được lưu giữ trên hệ thống FreelanceHub. Đừng nản lòng, còn hàng trăm cơ hội việc làm bán thời gian hấp dẫn khác đang chờ đón bạn!</p>
                <p>Chúc bạn sớm tìm được công việc ưng ý và thành công trên con đường học tập, phát triển sự nghiệp.</p>
                <p style="margin-top: 24px;">Trân trọng,<br><strong>FreelanceHub Team.</strong></p>
              </div>
            </body>
            </html>
            """,
                escapeHtml(safeStudentName),
                escapeHtml(safeJobTitle),
                escapeHtml(safeEmployerName),
                htmlReason
        );

        helper.setText(plainText, htmlContent);
        mailSender.send(message);
    }

    public void sendJobSlotsFilledEmail(
            String employerEmail,
            String employerName,
            String jobTitle,
            int filledCount
    ) throws MessagingException {
        if (employerEmail == null || employerEmail.isBlank()) {
            throw new IllegalArgumentException("Recipient email must not be empty");
        }

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(getFromAddress());
        helper.setTo(employerEmail);
        helper.setSubject(String.format("Thông báo: Vị trí tuyển dụng \"%s\" đã đủ số lượng ứng viên – FreelanceHub", jobTitle));

        String safeEmployerName = employerName != null ? employerName : "Quý Nhà tuyển dụng";
        String safeJobTitle = jobTitle != null ? jobTitle : "";

        String plainText = String.format(
                "Xin chào %s,\n\n" +
                "FreelanceHub xin thông báo: Vị trí tuyển dụng \"%s\" của quý công ty đã chính thức đạt đủ số lượng ứng viên theo chỉ tiêu (%d ứng viên đã được chấp thuận).\n\n" +
                "Các ứng viên được chọn đã nhận được thư chúc mừng và đang sẵn sàng hợp tác. Quý nhà tuyển dụng vui lòng truy cập Bảng điều khiển (Dashboard) trên FreelanceHub để bắt đầu quản lý công việc và liên hệ trực tiếp với các ứng viên.\n\n" +
                "Cảm ơn quý đối tác đã tin tưởng đồng hành cùng FreelanceHub!\n\n" +
                "Trân trọng,\n" +
                "FreelanceHub Team.",
                safeEmployerName, safeJobTitle, filledCount
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
                <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 6px; padding: 16px; margin: 16px 0;">
                  <h3 style="color: #065f46; margin-top: 0; margin-bottom: 8px;">🎉 Vị trí đã tuyển đủ chỉ tiêu!</h3>
                  <p style="margin: 0; color: #047857;">Vị trí tuyển dụng <strong>%s</strong> của bạn đã nhận đủ <strong>%d ứng viên</strong> được duyệt chấp thuận.</p>
                </div>
                <p>Các ứng viên trúng tuyển đã nhận được thư thông báo tự động từ hệ thống. Quý nhà tuyển dụng có thể truy cập hệ thống ngay bây giờ để tiến hành trao đổi công việc và điều phối dự án.</p>
                <p>Cảm ơn quý nhà tuyển dụng đã luôn tin tưởng sử dụng dịch vụ kết nối việc làm sinh viên của FreelanceHub!</p>
                <p style="margin-top: 24px;">Trân trọng,<br><strong>FreelanceHub Team.</strong></p>
              </div>
            </body>
            </html>
            """,
                escapeHtml(safeEmployerName),
                escapeHtml(safeJobTitle),
                filledCount
        );

        helper.setText(plainText, htmlContent);
        mailSender.send(message);
    }

    public void sendRegistrationOtpEmail(
            String recipientEmail,
            String recipientName,
            String otpCode
    ) throws MessagingException {
        if (recipientEmail == null || recipientEmail.isBlank()) {
            throw new IllegalArgumentException("Recipient email must not be empty");
        }

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(getFromAddress());
        helper.setTo(recipientEmail);
        helper.setSubject("Mã xác nhận đăng ký tài khoản FreelanceHub");

        String safeName = recipientName != null ? recipientName : "Bạn";
        String safeOtp = otpCode != null ? otpCode : "";

        String plainText = String.format(
                "Xin chào %s,\n\n" +
                "Cảm ơn bạn đã đăng ký tài khoản tại Cổng kết nối việc làm sinh viên FreelanceHub.\n\n" +
                "Mã xác thực tài khoản của bạn là: %s\n\n" +
                "Mã này có hiệu lực trong vòng 15 phút. Vui lòng không chia sẻ mã xác thực này cho bất kỳ ai để bảo vệ tài khoản của bạn.\n\n" +
                "Trân trọng,\n" +
                "FreelanceHub Team.",
                safeName, safeOtp
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
                <p>Chào mừng bạn gia nhập Cổng kết nối việc làm thêm sinh viên <strong>FreelanceHub</strong>.</p>
                <p>Dưới đây là mã xác thực tài khoản của bạn:</p>
                <div style="background-color: #eff6ff; border: 2px dashed #3b82f6; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0;">
                  <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #1d4ed8;">%s</span>
                  <p style="margin: 8px 0 0 0; font-size: 13px; color: #64748b;">(Mã có hiệu lực trong vòng 15 phút)</p>
                </div>
                <p style="font-size: 14px; color: #ef4444;">⚠️ <em>Lưu ý: Không chia sẻ mã xác thực này với bất kỳ ai dưới mọi hình thức để bảo đảm an toàn thông tin tài khoản.</em></p>
                <p style="margin-top: 24px;">Trân trọng,<br><strong>FreelanceHub Team.</strong></p>
              </div>
            </body>
            </html>
            """,
                escapeHtml(safeName),
                escapeHtml(safeOtp)
        );

        helper.setText(plainText, htmlContent);
        mailSender.send(message);
    }

    public void sendPasswordResetOtpEmail(
            String recipientEmail,
            String recipientName,
            String resetTokenOrOtp
    ) throws MessagingException {
        if (recipientEmail == null || recipientEmail.isBlank()) {
            throw new IllegalArgumentException("Recipient email must not be empty");
        }

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(getFromAddress());
        helper.setTo(recipientEmail);
        helper.setSubject("Mã xác thực đặt lại mật khẩu FreelanceHub");

        String safeName = recipientName != null ? recipientName : "Bạn";
        String safeToken = resetTokenOrOtp != null ? resetTokenOrOtp : "";

        String plainText = String.format(
                "Xin chào %s,\n\n" +
                "Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản FreelanceHub của bạn.\n\n" +
                "Mã xác thực đặt lại mật khẩu của bạn là: %s\n\n" +
                "Mã này có hiệu lực trong vòng 15 phút. Nếu bạn không gửi yêu cầu này, vui lòng bỏ qua email và tài khoản của bạn vẫn được giữ an toàn.\n\n" +
                "Trân trọng,\n" +
                "FreelanceHub Team.",
                safeName, safeToken
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
                <p>Bạn (hoặc ai đó) vừa yêu cầu đặt lại mật khẩu cho tài khoản liên kết với địa chỉ email này trên <strong>FreelanceHub</strong>.</p>
                <p>Mã xác thực đặt lại mật khẩu của bạn:</p>
                <div style="background-color: #fef2f2; border: 2px dashed #ef4444; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0;">
                  <span style="font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #b91c1c; word-break: break-all;">%s</span>
                  <p style="margin: 8px 0 0 0; font-size: 13px; color: #7f1d1d;">(Mã có hiệu lực trong vòng 15 phút)</p>
                </div>
                <p style="font-size: 14px; color: #475569;">Vui lòng nhập mã này vào trang Đặt lại mật khẩu để hoàn tất việc cập nhật mật khẩu mới.</p>
                <p style="font-size: 13px; color: #94a3b8;">Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email hoặc liên hệ với ban quản trị nếu thấy nghi ngờ.</p>
                <p style="margin-top: 24px;">Trân trọng,<br><strong>FreelanceHub Team.</strong></p>
              </div>
            </body>
            </html>
            """,
                escapeHtml(safeName),
                escapeHtml(safeToken)
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
