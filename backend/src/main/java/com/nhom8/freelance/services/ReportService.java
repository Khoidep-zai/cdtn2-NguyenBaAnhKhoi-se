package com.nhom8.freelance.services;

import com.nhom8.freelance.dto.request.ReportCreateRequest;
import com.nhom8.freelance.dto.request.ReportResolveRequest;
import com.nhom8.freelance.exceptions.BadRequestException;
import com.nhom8.freelance.exceptions.ResourceNotFoundException;
import com.nhom8.freelance.models.Job;
import com.nhom8.freelance.models.Report;
import com.nhom8.freelance.models.User;
import com.nhom8.freelance.repositories.JobRepository;
import com.nhom8.freelance.repositories.ReportRepository;
import com.nhom8.freelance.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final NotificationService notificationService;

    @Transactional
    public Report createReport(Long reporterId, ReportCreateRequest request) {
        User reporter = userRepository.findById(reporterId)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại"));

        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Công việc không tồn tại"));

        Optional<Report> existing = reportRepository.findByReporterIdAndJobIdAndStatus(reporterId, request.getJobId(), "PENDING");
        if (existing.isPresent()) {
            throw new BadRequestException("Bạn đã gửi một báo cáo đang chờ xử lý cho công việc này.");
        }

        Report report = Report.builder()
                .reporter(reporter)
                .job(job)
                .reason(request.getReason())
                .description(request.getDescription())
                .status("PENDING")
                .build();

        return reportRepository.save(report);
    }

    public Page<Report> getReports(String status, Pageable pageable) {
        if (status != null && !status.trim().isEmpty() && !status.equalsIgnoreCase("ALL")) {
            return reportRepository.findByStatusOrderByCreatedAtDesc(status.toUpperCase(), pageable);
        }
        return reportRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    @Transactional
    public Report resolveReport(Long reportId, ReportResolveRequest request, Long adminId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy báo cáo với ID: " + reportId));

        User admin = userRepository.findById(adminId).orElse(null);

        String action = request.getAction().toUpperCase();
        Job job = report.getJob();

        if ("DISMISS".equals(action)) {
            report.setStatus("DISMISSED");
        } else if ("RESOLVE_BAN_JOB".equals(action)) {
            report.setStatus("RESOLVED");
            job.setStatus("CLOSED");
            jobRepository.save(job);
            notificationService.createNotification(
                    job.getEmployer().getId(),
                    "Tin việc làm đã bị gỡ bỏ do vi phạm",
                    "Tin tuyển dụng '" + job.getTitle() + "' đã bị gỡ bỏ sau khi Ban quản trị xác minh phản ánh vi phạm.",
                    "JOB_REMOVED",
                    job.getId()
            );
        } else if ("RESOLVE_BAN_EMPLOYER".equals(action)) {
            report.setStatus("RESOLVED");
            job.setStatus("CLOSED");
            jobRepository.save(job);
            User employer = job.getEmployer();
            employer.setIsActive(false);
            userRepository.save(employer);
            // Close all employer's other jobs
            var otherJobs = jobRepository.findByEmployerId(employer.getId());
            for (Job j : otherJobs) {
                j.setStatus("CLOSED");
                jobRepository.save(j);
            }
        } else {
            throw new BadRequestException("Hành động xử lý không hợp lệ: " + action);
        }

        report.setResolvedBy(admin);
        report.setResolutionNotes(request.getResolutionNotes());
        report.setResolvedAt(LocalDateTime.now());

        return reportRepository.save(report);
    }
}

