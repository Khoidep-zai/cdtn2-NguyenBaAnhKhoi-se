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
    private final com.nhom8.freelance.repositories.ApplicationRepository applicationRepository;
    private final com.nhom8.freelance.repositories.ReviewRepository reviewRepository;
    private final NotificationService notificationService;

    public Page<Job> searchJobs(String keyword, Long categoryId, String jobType, String workMode, String province, Boolean studentFriendly, Pageable pageable) {
        return searchJobs(keyword, categoryId, jobType, workMode, province, studentFriendly, null, pageable);
    }

    public Page<Job> searchJobs(String keyword, Long categoryId, String jobType, String workMode, String province, Boolean studentFriendly, String shiftType, Pageable pageable) {
        String cleanKeyword = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;
        String cleanProvince = (province != null && !province.trim().isEmpty() && !province.equalsIgnoreCase("ALL")) ? province.trim() : null;
        String cleanShiftType = (shiftType != null && !shiftType.trim().isEmpty() && !shiftType.equalsIgnoreCase("ALL")) ? shiftType.trim() : null;
        return jobRepository.searchJobs(cleanKeyword, categoryId, jobType, workMode, cleanProvince, studentFriendly, cleanShiftType, pageable);
    }

    public Page<Job> getPendingJobs(Pageable pageable) {
        return jobRepository.findByStatusOrderByCreatedAtDesc("PENDING_REVIEW", pageable);
    }

    @Transactional
    public Job reviewJob(Long jobId, String action, String rejectionReason, Long adminId) {
        Job job = getJobById(jobId);
        if ("APPROVE".equalsIgnoreCase(action)) {
            job.setStatus("OPEN");
            job.setRejectionReason(null);
            notificationService.createNotification(
                    job.getEmployer().getId(),
                    "Tin tuyển dụng đã được duyệt",
                    "Tin tuyển dụng '" + job.getTitle() + "' đã được Ban quản trị phê duyệt và đăng công khai trên sàn.",
                    "JOB_APPROVED",
                    job.getId()
            );
        } else if ("REJECT".equalsIgnoreCase(action)) {
            job.setStatus("REJECTED");
            job.setRejectionReason(rejectionReason != null ? rejectionReason.trim() : "Không đạt tiêu chuẩn kiểm duyệt");
            notificationService.createNotification(
                    job.getEmployer().getId(),
                    "Tin tuyển dụng bị từ chối",
                    "Tin tuyển dụng '" + job.getTitle() + "' bị từ chối duyệt. Lý do: " + job.getRejectionReason(),
                    "JOB_REJECTED",
                    job.getId()
            );
        } else {
            throw new com.nhom8.freelance.exceptions.BadRequestException("Hành động duyệt không hợp lệ. Chỉ chấp nhận APPROVE hoặc REJECT");
        }
        return jobRepository.save(job);
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
                .province(request.getProvince())
                .salaryText(request.getSalaryText())
                .workingHours(request.getWorkingHours())
                .shiftType(request.getShiftType() != null && !request.getShiftType().trim().isEmpty() ? request.getShiftType() : "FLEXIBLE")
                .benefits(request.getBenefits())
                .studentFriendly(request.getStudentFriendly() != null ? request.getStudentFriendly() : true)
                .salaryType(request.getSalaryType())
                .salaryAmount(request.getSalaryAmount())
                .slotsAvailable(request.getSlotsAvailable() != null ? request.getSlotsAvailable() : 1)
                .status("PENDING_REVIEW")
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

    @Transactional
    public Job updateJobStatus(Long jobId, String status, Long requesterId,
                               java.util.Collection<? extends org.springframework.security.core.GrantedAuthority> authorities) {
        Job job = getJobById(jobId);
        boolean isAdmin = authorities != null && authorities.stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin && (requesterId == null || !job.getEmployer().getId().equals(requesterId))) {
            throw new com.nhom8.freelance.exceptions.BadRequestException("Bạn không có quyền cập nhật trạng thái công việc này");
        }
        job.setStatus(status);
        return jobRepository.save(job);
    }

    @Transactional
    public void deleteJob(Long id) {
        Job job = getJobById(id);
        var apps = applicationRepository.findByJobId(id);
        if (apps != null && !apps.isEmpty()) {
            applicationRepository.deleteAll(apps);
        }
        var reviews = reviewRepository.findByJobId(id);
        if (reviews != null && !reviews.isEmpty()) {
            reviewRepository.deleteAll(reviews);
        }
        jobRepository.delete(job);
    }
}
