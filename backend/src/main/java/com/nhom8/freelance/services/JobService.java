package com.nhom8.freelance.services;

import com.nhom8.freelance.dto.request.JobCreateRequest;
import com.nhom8.freelance.exceptions.ResourceNotFoundException;
import com.nhom8.freelance.models.Category;
import com.nhom8.freelance.models.Job;
import com.nhom8.freelance.models.User;
import com.nhom8.freelance.repositories.CategoryRepository;
import com.nhom8.freelance.repositories.JobRepository;
import com.nhom8.freelance.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public Page<Job> searchJobs(String keyword, Long categoryId, String jobType, String workMode, String province, Boolean studentFriendly, Pageable pageable) {
        String cleanKeyword = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;
        String cleanProvince = (province != null && !province.trim().isEmpty() && !province.equalsIgnoreCase("ALL")) ? province.trim() : null;
        return jobRepository.searchJobs(cleanKeyword, categoryId, jobType, workMode, cleanProvince, studentFriendly, pageable);
    }

    public List<String> getProvinces() {
        return jobRepository.findDistinctProvinces();
    }

    public Job getJobById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy công việc với ID: " + id));
    }

    public List<Job> getJobsByEmployer(Long employerId) {
        return jobRepository.findByEmployerId(employerId);
    }

    @Transactional
    public Job createJob(Long employerId, JobCreateRequest request) {
        User employer = userRepository.findById(employerId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhà tuyển dụng"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Danh mục không tồn tại"));

        Job job = Job.builder()
                .employer(employer)
                .category(category)
                .title(request.getTitle())
                .description(request.getDescription())
                .requirements(request.getRequirements())
                .jobType(request.getJobType())
                .workMode(request.getWorkMode() != null ? request.getWorkMode() : "ONSITE")
                .location(request.getLocation())
                .salaryType(request.getSalaryType())
                .salaryAmount(request.getSalaryAmount())
                .slotsAvailable(request.getSlotsAvailable() != null ? request.getSlotsAvailable() : 1)
                .status("OPEN")
                .deadline(request.getDeadline())
                .build();

        return jobRepository.save(job);
    }

    @Transactional
    public Job updateJobStatus(Long jobId, String status) {
        Job job = getJobById(jobId);
        job.setStatus(status);
        return jobRepository.save(job);
    }
}
