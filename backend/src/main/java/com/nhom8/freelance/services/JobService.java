package com.nhom8.freelance.services;

import com.nhom8.freelance.dto.JobShiftDTO;
import com.nhom8.freelance.dto.request.JobCreateRequest;
import com.nhom8.freelance.exceptions.BadRequestException;
import com.nhom8.freelance.exceptions.ResourceNotFoundException;
import com.nhom8.freelance.models.Category;
import com.nhom8.freelance.models.Job;
import com.nhom8.freelance.models.JobShift;
import com.nhom8.freelance.models.User;
import com.nhom8.freelance.repositories.CategoryRepository;
import com.nhom8.freelance.repositories.JobRepository;
import com.nhom8.freelance.repositories.JobShiftRepository;
import com.nhom8.freelance.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final JobShiftRepository jobShiftRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final com.nhom8.freelance.repositories.ApplicationRepository applicationRepository;
    private final com.nhom8.freelance.repositories.ReviewRepository reviewRepository;
    private final NotificationService notificationService;

    public Page<Job> searchJobs(String keyword, Long categoryId, String jobType, String workMode, String province, Boolean studentFriendly, Pageable pageable) {
        return searchJobs(keyword, categoryId, jobType, workMode, province, studentFriendly, null, null, null, null, pageable);
    }

    public Page<Job> searchJobs(String keyword, Long categoryId, String jobType, String workMode, String province, Boolean studentFriendly, String shiftType, Pageable pageable) {
        String cleanKeyword = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;
        String cleanProvince = (province != null && !province.trim().isEmpty() && !province.equalsIgnoreCase("ALL")) ? province.trim() : null;
        String cleanShiftType = (shiftType != null && !shiftType.trim().isEmpty() && !shiftType.equalsIgnoreCase("ALL")) ? shiftType.trim() : null;
        return jobRepository.searchJobs(cleanKeyword, categoryId, jobType, workMode, cleanProvince, studentFriendly, cleanShiftType, pageable);
    }

    public Page<Job> searchJobs(String keyword, Long categoryId, String jobType, String workMode,
                                String province, Boolean studentFriendly, String shiftType,
                                List<Integer> daysOfWeek, String startTime, String endTime,
                                Pageable pageable) {
        String cleanKeyword = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;
        String cleanProvince = (province != null && !province.trim().isEmpty() && !province.equalsIgnoreCase("ALL")) ? province.trim() : null;
        String cleanShiftType = (shiftType != null && !shiftType.trim().isEmpty() && !shiftType.equalsIgnoreCase("ALL")) ? shiftType.trim() : null;

        int hasDaysFilter = (daysOfWeek != null && !daysOfWeek.isEmpty() && new java.util.HashSet<>(daysOfWeek).size() < 7) ? 1 : 0;
        List<Integer> safeDays = (hasDaysFilter == 1) ? daysOfWeek : List.of(-1);

        String cleanStart = (startTime != null && !startTime.trim().isEmpty()) ? startTime.trim() : null;
        String cleanEnd = (endTime != null && !endTime.trim().isEmpty()) ? endTime.trim() : null;
        int hasTimeFilter = (cleanStart != null && cleanEnd != null) ? 1 : 0;

        // Nếu có lọc theo thứ hoặc khung giờ cụ thể: Gọi searchJobsAdvanced (chỉ trả về việc có ca thực tế trong job_shifts)
        if (hasDaysFilter == 1 || hasTimeFilter == 1) {
            return jobRepository.searchJobsAdvanced(
                    cleanKeyword, categoryId, jobType, workMode, cleanProvince, studentFriendly,
                    hasDaysFilter, safeDays, hasTimeFilter, cleanStart, cleanEnd, pageable
            );
        }

        // Nếu tìm kiếm thông thường (hoặc chỉ lọc shiftType chung): Gọi searchJobs (100% việc cũ và mới hiển thị đủ)
        return jobRepository.searchJobs(
                cleanKeyword, categoryId, jobType, workMode, cleanProvince, studentFriendly, cleanShiftType, pageable
        );
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
            throw new BadRequestException("Hành động duyệt không hợp lệ. Chỉ chấp nhận APPROVE hoặc REJECT");
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

        Job saved = jobRepository.save(job);

        // Lưu danh sách ca làm việc nếu có
        if (request.getShifts() != null && !request.getShifts().isEmpty()) {
            for (JobShiftDTO shiftDto : request.getShifts()) {
                if (shiftDto.getDayOfWeek() != null) {
                    JobShift js = JobShift.builder()
                            .job(saved)
                            .dayOfWeek(shiftDto.getDayOfWeek())
                            .shiftName(shiftDto.getShiftName() != null ? shiftDto.getShiftName() : "Ca làm việc")
                            .startTime(shiftDto.getStartTime())
                            .endTime(shiftDto.getEndTime())
                            .isFlexible(Boolean.TRUE.equals(shiftDto.getIsFlexible()))
                            .sessionsPerWeek(shiftDto.getSessionsPerWeek() != null ? shiftDto.getSessionsPerWeek() : 1)
                            .build();
                    jobShiftRepository.save(js);
                }
            }
        }

        return saved;
    }

    @Transactional
    public Job updateJob(Long jobId, Long employerId, JobCreateRequest request) {
        Job job = getJobById(jobId);
        if (!job.getEmployer().getId().equals(employerId)) {
            throw new BadRequestException("Bạn không có quyền chỉnh sửa tin tuyển dụng này");
        }

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Danh mục không tồn tại"));
            job.setCategory(category);
        }

        if (request.getTitle() != null) job.setTitle(request.getTitle());
        if (request.getDescription() != null) job.setDescription(request.getDescription());
        if (request.getRequirements() != null) job.setRequirements(request.getRequirements());
        if (request.getJobType() != null) job.setJobType(request.getJobType());
        if (request.getWorkMode() != null) job.setWorkMode(request.getWorkMode());
        if (request.getLocation() != null) job.setLocation(request.getLocation());
        if (request.getProvince() != null) job.setProvince(request.getProvince());
        if (request.getSalaryText() != null) job.setSalaryText(request.getSalaryText());
        if (request.getWorkingHours() != null) job.setWorkingHours(request.getWorkingHours());
        if (request.getShiftType() != null) job.setShiftType(request.getShiftType());
        if (request.getBenefits() != null) job.setBenefits(request.getBenefits());
        if (request.getStudentFriendly() != null) job.setStudentFriendly(request.getStudentFriendly());
        if (request.getSalaryType() != null) job.setSalaryType(request.getSalaryType());
        if (request.getSalaryAmount() != null) job.setSalaryAmount(request.getSalaryAmount());
        if (request.getSlotsAvailable() != null) job.setSlotsAvailable(request.getSlotsAvailable());
        if (request.getDeadline() != null) job.setDeadline(request.getDeadline());

        Job saved = jobRepository.save(job);

        // Quy tắc: Nếu request.getShifts() != null thì mới cập nhật lịch làm. Nếu null thì giữ nguyên lịch cũ!
        if (request.getShifts() != null) {
            jobShiftRepository.deleteByJobId(jobId);
            for (JobShiftDTO shiftDto : request.getShifts()) {
                if (shiftDto.getDayOfWeek() != null) {
                    JobShift js = JobShift.builder()
                            .job(saved)
                            .dayOfWeek(shiftDto.getDayOfWeek())
                            .shiftName(shiftDto.getShiftName() != null ? shiftDto.getShiftName() : "Ca làm việc")
                            .startTime(shiftDto.getStartTime())
                            .endTime(shiftDto.getEndTime())
                            .isFlexible(Boolean.TRUE.equals(shiftDto.getIsFlexible()))
                            .sessionsPerWeek(shiftDto.getSessionsPerWeek() != null ? shiftDto.getSessionsPerWeek() : 1)
                            .build();
                    jobShiftRepository.save(js);
                }
            }
        }

        return saved;
    }

    public List<JobShiftDTO> getJobShifts(Long jobId) {
        return jobShiftRepository.findByJobIdOrderByDayOfWeekAscStartTimeAsc(jobId)
                .stream()
                .map(js -> JobShiftDTO.builder()
                        .id(js.getId())
                        .dayOfWeek(js.getDayOfWeek())
                        .shiftName(js.getShiftName())
                        .startTime(js.getStartTime())
                        .endTime(js.getEndTime())
                        .isFlexible(js.getIsFlexible())
                        .sessionsPerWeek(js.getSessionsPerWeek())
                        .build())
                .collect(Collectors.toList());
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
            throw new BadRequestException("Bạn không có quyền cập nhật trạng thái công việc này");
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
