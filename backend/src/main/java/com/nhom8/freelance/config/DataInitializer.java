package com.nhom8.freelance.config;

import com.nhom8.freelance.models.*;
import com.nhom8.freelance.repositories.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final ReviewRepository reviewRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        log.info("Checking and initializing default graduation project demo data...");

        // 1. Roles
        Role adminRole = getOrCreateRole("ROLE_ADMIN", "Quản trị viên toàn quyền hệ thống");
        Role employerRole = getOrCreateRole("ROLE_EMPLOYER", "Nhà tuyển dụng / Doanh nghiệp");
        Role studentRole = getOrCreateRole("ROLE_STUDENT", "Sinh viên tìm việc");

        // 2. Categories
        Category catDev = getOrCreateCategory("Lập trình & CNTT", "lap-trinh-cntt", "code", "Lập trình web, app, fix bug, IT");
        Category catDesign = getOrCreateCategory("Thiết kế đồ họa & Media", "thiet-ke-do-hoa", "palette", "Thiết kế banner, logo, video, ảnh");
        Category catTutor = getOrCreateCategory("Gia sư & Dạy kèm", "gia-su-day-kem", "book-open", "Dạy kèm Toán, Lý, Hóa, Tiếng Anh");
        Category catService = getOrCreateCategory("Phục vụ & Bán hàng part-time", "phuc-vu-ban-hang", "coffee", "Barista, nhân viên bán hàng");
        Category catContent = getOrCreateCategory("Dịch thuật & Viết nội dung (Content)", "content-dich-thuat", "feather", "Viết bài SEO, fanpage, dịch thuật");

        // 3. Demo Users (Default password: Password123@)
        String defaultPasswordHash = passwordEncoder.encode("Password123@");

        User adminUser = getOrCreateUser(
                "admin@freelancehub.vn",
                defaultPasswordHash,
                "Quản Trị Viên Nhóm 8",
                "0901234567",
                adminRole,
                "Trường ĐH Văn Lang",
                "Khoa CNTT",
                "FreelanceHub System",
                "TP.HCM",
                "Quản trị viên hệ thống Chuyên đề tốt nghiệp 2",
                "Management, Spring Boot, React"
        );

        User employerCoffee = getOrCreateUser(
                "recruiter@thecoffee.vn",
                defaultPasswordHash,
                "Nguyễn Thị Tuyết (The Coffee House)",
                "0912345678",
                employerRole,
                null,
                null,
                "The Coffee House Bình Thạnh",
                "Bình Thạnh, TP.HCM",
                "Chuỗi cà phê chuyên tuyển nhân sự sinh viên theo ca linh hoạt",
                null
        );

        User employerTech = getOrCreateUser(
                "techlead@innovate.vn",
                defaultPasswordHash,
                "Trần Văn Minh (Innovate Studio)",
                "0923456789",
                employerRole,
                null,
                null,
                "Innovate Media & Tech",
                "Quận 1, TP.HCM",
                "Agency thiết kế website và sản xuất nội dung số",
                null
        );

        User studentKhoi = getOrCreateUser(
                "sinhvien.khoi@vanlanguni.vn",
                defaultPasswordHash,
                "Nguyễn Bá Anh Khôi",
                "0945678901",
                studentRole,
                "Trường Đại học Văn Lang",
                "Kỹ thuật phần mềm",
                null,
                null,
                "Sinh viên năm 4 chuyên ngành CNPM, có kinh nghiệm phân tích nghiệp vụ và ReactJS, Spring Boot",
                "React, Java, Spring Boot, Figma, Git"
        );

        User studentTai = getOrCreateUser(
                "sinhvien.tai@vanlanguni.vn",
                defaultPasswordHash,
                "Nguyễn Tấn Tài",
                "0934567890",
                studentRole,
                "Trường Đại học Văn Lang",
                "Công nghệ thông tin",
                null,
                null,
                "Sinh viên năm 4 đam mê Backend Java Spring Boot và cơ sở dữ liệu PostgreSQL",
                "Java, Spring Boot, PostgreSQL, Docker"
        );

        // 4. Sample Jobs
        if (jobRepository.count() == 0) {
            Job job1 = jobRepository.save(Job.builder()
                    .employer(employerCoffee)
                    .category(catService)
                    .title("Tuyển nhân viên Barista & Phục vụ ca tối")
                    .description("Pha chế đồ uống theo công thức, phục vụ khách hàng, dọn dẹp quầy ca tối từ 17h00 - 22h00 các ngày trong tuần.")
                    .requirements("Nhanh nhẹn, chăm chỉ, ưu tiên sinh viên năm 1, 2 có thể xoay ca theo lịch học.")
                    .jobType("PART_TIME")
                    .workMode("ONSITE")
                    .location("Quận Bình Thạnh, TP.HCM")
                    .salaryType("HOURLY")
                    .salaryAmount(new BigDecimal("28000.00"))
                    .slotsAvailable(3)
                    .status("OPEN")
                    .deadline(LocalDateTime.now().plusDays(14))
                    .build());

            Job job2 = jobRepository.save(Job.builder()
                    .employer(employerTech)
                    .category(catDev)
                    .title("Lập trình Landing Page giới thiệu sản phẩm bằng React")
                    .description("Xây dựng trang đích quảng bá sản phẩm mới dựa trên bản thiết kế Figma có sẵn. Yêu cầu responsive chuẩn máy tính và điện thoại.")
                    .requirements("Thành thạo HTML/CSS, ReactJS, biết sử dụng Git. Thời gian hoàn thành trong 1 tuần.")
                    .jobType("FREELANCE")
                    .workMode("REMOTE")
                    .location("Toàn quốc")
                    .salaryType("FIXED_PROJECT")
                    .salaryAmount(new BigDecimal("2500000.00"))
                    .slotsAvailable(1)
                    .status("OPEN")
                    .deadline(LocalDateTime.now().plusDays(7))
                    .build());

            Job job3 = jobRepository.save(Job.builder()
                    .employer(employerTech)
                    .category(catDesign)
                    .title("Thiết kế bộ ấn phẩm Banner & Poster sự kiện âm nhạc")
                    .description("Thiết kế 5 poster và 10 ảnh định dạng vuông đăng Facebook/Instagram phục vụ tuần lễ giao lưu âm nhạc sinh viên.")
                    .requirements("Biết sử dụng Photoshop, Illustrator hoặc Canva Pro. Thẩm mỹ hiện đại, trẻ trung.")
                    .jobType("FREELANCE")
                    .workMode("REMOTE")
                    .location("Toàn quốc")
                    .salaryType("FIXED_PROJECT")
                    .salaryAmount(new BigDecimal("1500000.00"))
                    .slotsAvailable(1)
                    .status("OPEN")
                    .deadline(LocalDateTime.now().plusDays(10))
                    .build());

            Job job4 = jobRepository.save(Job.builder()
                    .employer(employerCoffee)
                    .category(catTutor)
                    .title("Gia sư dạy kèm môn Tiếng Anh giao tiếp lớp 7")
                    .description("Kèm cặp ngữ pháp và rèn luyện kỹ năng nghe nói cơ bản cho học sinh lớp 7. 3 buổi/tuần, mỗi buổi 1.5 giờ.")
                    .requirements("Sinh viên có điểm IELTS từ 6.0 trở lên hoặc chuyên ngành Ngôn ngữ Anh.")
                    .jobType("PART_TIME")
                    .workMode("HYBRID")
                    .location("Quận Gò Vấp, TP.HCM")
                    .salaryType("HOURLY")
                    .salaryAmount(new BigDecimal("120000.00"))
                    .slotsAvailable(1)
                    .status("OPEN")
                    .deadline(LocalDateTime.now().plusDays(20))
                    .build());

            // 5. Sample Applications
            Application app1 = applicationRepository.save(Application.builder()
                    .job(job2)
                    .student(studentKhoi)
                    .coverLetter("Em có kinh nghiệm 1 năm làm việc với React và TypeScript, em tự tin hoàn thành trang Landing Page đúng tiến độ.")
                    .cvUrl("https://example.com/cv_khoi.pdf")
                    .status("ACCEPTED")
                    .build());

            Application app2 = applicationRepository.save(Application.builder()
                    .job(job1)
                    .student(studentTai)
                    .coverLetter("Em có thể làm ca tối từ 17h đến 22h, tính tình cẩn thận, mong được nhận vào vị trí Barista.")
                    .cvUrl("https://example.com/cv_tai.pdf")
                    .status("PENDING")
                    .build());

            // 6. Sample Reviews
            reviewRepository.save(Review.builder()
                    .job(job2)
                    .reviewer(employerTech)
                    .reviewee(studentKhoi)
                    .rating(5)
                    .comment("Sinh viên làm việc rất có trách nhiệm, code chuẩn TypeScript, giao bài đúng hạn và giao tiếp nhiệt tình!")
                    .build());

            reviewRepository.save(Review.builder()
                    .job(job2)
                    .reviewer(studentKhoi)
                    .reviewee(employerTech)
                    .rating(5)
                    .comment("Nhà tuyển dụng hướng dẫn chi tiết, thanh toán sòng phẳng và tạo điều kiện linh hoạt cho sinh viên.")
                    .build());

            // 7. Sample Notifications
            notificationRepository.save(Notification.builder()
                    .user(studentKhoi)
                    .title("Đơn ứng tuyển được chấp nhận!")
                    .message("Chúc mừng! Đơn ứng tuyển của bạn cho công việc 'Lập trình Landing Page' đã được Innovate Studio chấp nhận.")
                    .type("APPLICATION_STATUS")
                    .referenceId(app1.getId())
                    .isRead(false)
                    .build());

            notificationRepository.save(Notification.builder()
                    .user(employerCoffee)
                    .title("Có ứng viên mới nộp đơn")
                    .message("Sinh viên Nguyễn Tấn Tài vừa nộp đơn ứng tuyển cho vị trí 'Barista & Phục vụ ca tối'.")
                    .type("NEW_APPLICATION")
                    .referenceId(app2.getId())
                    .isRead(false)
                    .build());

            log.info("Initialized demo jobs, applications, reviews, and notifications successfully!");
        }

        log.info("Default seed data check completed. Ready!");
    }

    private Role getOrCreateRole(String name, String description) {
        return roleRepository.findByName(name).orElseGet(() ->
                roleRepository.save(Role.builder().name(name).description(description).build())
        );
    }

    private Category getOrCreateCategory(String name, String slug, String icon, String description) {
        return categoryRepository.findBySlug(slug).orElseGet(() ->
                categoryRepository.save(Category.builder()
                        .name(name)
                        .slug(slug)
                        .icon(icon)
                        .description(description)
                        .build())
        );
    }

    private User getOrCreateUser(String email, String passwordHash, String fullName, String phone,
                                 Role role, String university, String major, String companyName,
                                 String companyAddress, String bio, String skills) {
        return userRepository.findByEmail(email).orElseGet(() ->
                userRepository.save(User.builder()
                        .email(email)
                        .passwordHash(passwordHash)
                        .fullName(fullName)
                        .phone(phone)
                        .role(role)
                        .university(university)
                        .major(major)
                        .companyName(companyName)
                        .companyAddress(companyAddress)
                        .bio(bio)
                        .skills(skills)
                        .isActive(true)
                        .build())
        );
    }
}
