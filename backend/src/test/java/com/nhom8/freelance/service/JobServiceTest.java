package com.nhom8.freelance.service;

import com.nhom8.freelance.dto.request.JobCreateRequest;
import com.nhom8.freelance.exceptions.ResourceNotFoundException;
import com.nhom8.freelance.models.Category;
import com.nhom8.freelance.models.Job;
import com.nhom8.freelance.models.User;
import com.nhom8.freelance.repositories.CategoryRepository;
import com.nhom8.freelance.repositories.JobRepository;
import com.nhom8.freelance.repositories.UserRepository;
import com.nhom8.freelance.services.JobService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("JobService Unit Tests")
class JobServiceTest {

    @Mock
    private JobRepository jobRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private JobService jobService;

    private User employer;
    private Category category;
    private Job sampleJob;

    @BeforeEach
    void setUp() {
        employer = User.builder()
                .id(1L)
                .email("employer@test.com")
                .fullName("Employer Test")
                .build();

        category = Category.builder()
                .id(1L)
                .name("IT")
                .slug("it")
                .build();

        sampleJob = Job.builder()
                .id(10L)
                .employer(employer)
                .category(category)
                .title("Lập trình Web")
                .description("Phát triển frontend với React")
                .salaryType("FIXED_PROJECT")
                .salaryAmount(BigDecimal.valueOf(2000000))
                .status("OPEN")
                .build();
    }

    @Test
    @DisplayName("Tạo tin tuyển dụng thành công khi thông tin hợp lệ")
    void createJob_Success() {
        JobCreateRequest request = new JobCreateRequest();
        request.setTitle("Lập trình Web");
        request.setDescription("Phát triển frontend với React");
        request.setCategoryId(1L);
        request.setJobType("FREELANCE");
        request.setWorkMode("REMOTE");
        request.setSalaryType("FIXED_PROJECT");
        request.setSalaryAmount(BigDecimal.valueOf(2000000));

        when(userRepository.findById(1L)).thenReturn(Optional.of(employer));
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(jobRepository.save(any(Job.class))).thenReturn(sampleJob);

        Job created = jobService.createJob(1L, request);

        assertNotNull(created);
        assertEquals("Lập trình Web", created.getTitle());
        assertEquals("OPEN", created.getStatus());
        verify(jobRepository, times(1)).save(any(Job.class));
    }

    @Test
    @DisplayName("Ném ResourceNotFoundException khi employer không tồn tại")
    void createJob_EmployerNotFound_ThrowsException() {
        JobCreateRequest request = new JobCreateRequest();
        request.setTitle("Test Job");
        request.setCategoryId(1L);

        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> jobService.createJob(99L, request));
        verify(jobRepository, never()).save(any(Job.class));
    }

    @Test
    @DisplayName("Tìm kiếm tin việc làm trả về danh sách có phân trang")
    void searchJobs_ReturnsPagedJobs() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Job> jobPage = new PageImpl<>(List.of(sampleJob));

        when(jobRepository.searchJobs(eq("Web"), eq(1L), eq("FREELANCE"), eq("REMOTE"), eq(pageable))).thenReturn(jobPage);

        Page<Job> result = jobService.searchJobs("Web", 1L, "FREELANCE", "REMOTE", pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("Lập trình Web", result.getContent().get(0).getTitle());
    }

    @Test
    @DisplayName("Cập nhật trạng thái công việc thành công")
    void updateJobStatus_Success() {
        when(jobRepository.findById(10L)).thenReturn(Optional.of(sampleJob));
        when(jobRepository.save(any(Job.class))).thenReturn(sampleJob);

        Job updated = jobService.updateJobStatus(10L, "COMPLETED");

        assertNotNull(updated);
        assertEquals("COMPLETED", sampleJob.getStatus());
        verify(jobRepository).save(sampleJob);
    }
}
