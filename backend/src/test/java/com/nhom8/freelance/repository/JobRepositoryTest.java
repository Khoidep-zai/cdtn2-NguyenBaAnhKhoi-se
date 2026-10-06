package com.nhom8.freelance.repository;

import com.nhom8.freelance.models.Job;
import com.nhom8.freelance.repositories.JobRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("JobRepository Unit Tests")
class JobRepositoryTest {

    @Mock
    private JobRepository jobRepository;

    @Test
    @DisplayName("findByEmployerId trả về danh sách công việc của employer")
    void findByEmployerId_ReturnsJobs() {
        Job job1 = Job.builder().id(1L).title("Job 1").build();
        Job job2 = Job.builder().id(2L).title("Job 2").build();

        when(jobRepository.findByEmployerId(10L)).thenReturn(List.of(job1, job2));

        List<Job> jobs = jobRepository.findByEmployerId(10L);

        assertNotNull(jobs);
        assertEquals(2, jobs.size());
        assertEquals("Job 1", jobs.get(0).getTitle());
        verify(jobRepository).findByEmployerId(10L);
    }

    @Test
    @DisplayName("findByStatus trả về danh sách phân trang theo status")
    void findByStatus_ReturnsPagedJobs() {
        Job job = Job.builder().id(1L).title("Job 1").status("OPEN").build();
        PageRequest pageRequest = PageRequest.of(0, 5);
        Page<Job> page = new PageImpl<>(List.of(job));

        when(jobRepository.findByStatus("OPEN", pageRequest)).thenReturn(page);

        Page<Job> result = jobRepository.findByStatus("OPEN", pageRequest);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(jobRepository).findByStatus("OPEN", pageRequest);
    }
}
