package com.nhom8.freelance.repository;

import com.nhom8.freelance.models.Category;
import com.nhom8.freelance.models.Job;
import com.nhom8.freelance.models.JobShift;
import com.nhom8.freelance.models.User;
import com.nhom8.freelance.repositories.CategoryRepository;
import com.nhom8.freelance.repositories.JobRepository;
import com.nhom8.freelance.repositories.JobShiftRepository;
import com.nhom8.freelance.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
class JobShiftIntegrationTest {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private JobShiftRepository jobShiftRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private com.nhom8.freelance.repositories.RoleRepository roleRepository;

    private Job jobMultiShift;
    private Job jobOvernight;
    private Job jobOldWithoutShifts;

    @BeforeEach
    void setUp() {
        var role = roleRepository.save(com.nhom8.freelance.models.Role.builder().name("ROLE_EMPLOYER").build());

        User employer = userRepository.save(User.builder()
                .email("employer.test.shifts@vanlang.vn")
                .passwordHash("hash")
                .fullName("NTD Test Ca")
                .role(role)
                .build());

        Category category = categoryRepository.save(Category.builder().name("F&B").slug("fb").build());

        // 1. Job mới có nhiều ca trong Thứ 2: Sáng (08:00 - 12:00) và Tối (18:00 - 22:00)
        jobMultiShift = jobRepository.save(Job.builder()
                .employer(employer)
                .category(category)
                .title("Nhân viên phục vụ F&B đa ca")
                .description("Phục vụ ca sáng hoặc tối")
                .jobType("PART_TIME")
                .workMode("ONSITE")
                .province("Hồ Chí Minh")
                .salaryType("HOURLY")
                .salaryAmount(BigDecimal.valueOf(30000))
                .status("OPEN")
                .shiftType("FLEXIBLE")
                .build());

        jobShiftRepository.save(JobShift.builder()
                .job(jobMultiShift)
                .dayOfWeek(1) // Thứ 2
                .shiftName("Ca sáng")
                .startTime(LocalTime.of(8, 0))
                .endTime(LocalTime.of(12, 0))
                .build());

        jobShiftRepository.save(JobShift.builder()
                .job(jobMultiShift)
                .dayOfWeek(1) // Thứ 2
                .shiftName("Ca tối")
                .startTime(LocalTime.of(18, 0))
                .endTime(LocalTime.of(22, 0))
                .build());

        // 2. Job có ca qua đêm (22:00 - 02:00 hôm sau) vào Thứ 6
        jobOvernight = jobRepository.save(Job.builder()
                .employer(employer)
                .category(category)
                .title("Nhân viên kho ca đêm xuyên đêm")
                .description("Làm việc từ 22h đêm đến 2h sáng")
                .jobType("PART_TIME")
                .workMode("ONSITE")
                .province("Hồ Chí Minh")
                .salaryType("HOURLY")
                .salaryAmount(BigDecimal.valueOf(45000))
                .status("OPEN")
                .shiftType("EVENING")
                .build());

        jobShiftRepository.save(JobShift.builder()
                .job(jobOvernight)
                .dayOfWeek(5) // Thứ 6
                .shiftName("Ca qua đêm")
                .startTime(LocalTime.of(22, 0))
                .endTime(LocalTime.of(2, 0))
                .build());

        // 3. Job kiểu cũ (KHÔNG có bản ghi trong job_shifts)
        jobOldWithoutShifts = jobRepository.save(Job.builder()
                .employer(employer)
                .category(category)
                .title("Việc làm cũ chưa cấu hình ca")
                .description("Dữ liệu cũ trước migration")
                .jobType("PART_TIME")
                .workMode("ONSITE")
                .province("Hồ Chí Minh")
                .salaryType("HOURLY")
                .salaryAmount(BigDecimal.valueOf(25000))
                .status("OPEN")
                .shiftType("MORNING")
                .build());
    }

    @Test
    @DisplayName("Lọc Thứ 2 + Giờ sáng (09:00 - 11:00) -> Khớp jobMultiShift, không trả về job cũ")
    void search_MorningShift_Matches() {
        Page<Job> res = jobRepository.searchJobsAdvanced(
                null, null, null, null, null, null,
                1, List.of(1), 1, "09:00:00", "11:00:00",
                PageRequest.of(0, 10)
        );

        assertTrue(res.getContent().stream().anyMatch(j -> j.getId().equals(jobMultiShift.getId())));
        assertFalse(res.getContent().stream().anyMatch(j -> j.getId().equals(jobOldWithoutShifts.getId())));
    }

    @Test
    @DisplayName("Lọc Thứ 2 + Giờ chiều (14:00 - 16:00) -> Không khớp job nào vì không có ca chiều")
    void search_AfternoonShift_NoMatch() {
        Page<Job> res = jobRepository.searchJobsAdvanced(
                null, null, null, null, null, null,
                1, List.of(1), 1, "14:00:00", "16:00:00",
                PageRequest.of(0, 10)
        );

        assertFalse(res.getContent().stream().anyMatch(j -> j.getId().equals(jobMultiShift.getId())));
    }

    @Test
    @DisplayName("Lọc ca qua đêm: Thứ 6 + Khung giờ 23:00 - 01:00 -> Khớp ca qua đêm (22h - 02h)")
    void search_OvernightShift_OverlappingMidnight_Matches() {
        Page<Job> res = jobRepository.searchJobsAdvanced(
                null, null, null, null, null, null,
                1, List.of(5), 1, "23:00:00", "01:00:00",
                PageRequest.of(0, 10)
        );

        assertTrue(res.getContent().stream().anyMatch(j -> j.getId().equals(jobOvernight.getId())));
    }

    @Test
    @DisplayName("Tìm kiếm thông thường không lọc lịch -> Job cũ và mới hiển thị đầy đủ")
    void search_NoScheduleFilter_ReturnsAll() {
        Page<Job> res = jobRepository.searchJobs(
                null, null, null, null, null, null, null,
                PageRequest.of(0, 50)
        );

        assertTrue(res.getContent().stream().anyMatch(j -> j.getId().equals(jobOldWithoutShifts.getId())));
        assertTrue(res.getContent().stream().anyMatch(j -> j.getId().equals(jobMultiShift.getId())));
        assertTrue(res.getContent().stream().anyMatch(j -> j.getId().equals(jobOvernight.getId())));
    }
}
