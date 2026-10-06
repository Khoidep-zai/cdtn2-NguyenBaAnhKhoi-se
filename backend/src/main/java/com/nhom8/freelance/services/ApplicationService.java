package com.nhom8.freelance.services;

import com.nhom8.freelance.exceptions.BadRequestException;
import com.nhom8.freelance.exceptions.ResourceNotFoundException;
import com.nhom8.freelance.models.Application;
import com.nhom8.freelance.models.Job;
import com.nhom8.freelance.models.User;
import com.nhom8.freelance.repositories.ApplicationRepository;
import com.nhom8.freelance.repositories.JobRepository;
import com.nhom8.freelance.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public Application applyJob(Long studentId, Long jobId, String coverLetter, String cvUrl) {
        if (applicationRepository.existsByJobIdAndStudentId(jobId, studentId)) {
            throw new BadRequestException("Bạn đã ứng tuyển vào công việc này rồi!");
        }

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Công việc không tồn tại"));

        if (!"OPEN".equalsIgnoreCase(job.getStatus())) {
            throw new BadRequestException("Công việc này hiện không còn nhận hồ sơ");
        }

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thông tin sinh viên"));

        Application application = Application.builder()
                .job(job)
                .student(student)
                .coverLetter(coverLetter)
                .cvUrl(cvUrl)
                .status("PENDING")
                .build();

        Application saved = applicationRepository.save(application);

        // Notify employer
        notificationService.createNotification(
                job.getEmployer().getId(),
                "Có ứng viên mới",
                "Sinh viên " + student.getFullName() + " vừa nộp đơn ứng tuyển cho công việc '" + job.getTitle() + "'.",
                "NEW_APPLICATION",
                saved.getId()
        );

        return saved;
    }

    public List<Application> getApplicationsByStudent(Long studentId) {
        return applicationRepository.findByStudentId(studentId);
    }

    public List<Application> getApplicationsByJob(Long jobId) {
        return applicationRepository.findByJobId(jobId);
    }

    @Transactional
    public Application updateApplicationStatus(Long applicationId, String status, String rejectionReason) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn ứng tuyển"));

        application.setStatus(status);
        if (rejectionReason != null) {
            application.setRejectionReason(rejectionReason);
        }

        Application saved = applicationRepository.save(application);

        // Notify student
        String statusText = "ACCEPTED".equalsIgnoreCase(status) ? "đã được duyệt chấp nhận!" : "đã bị từ chối.";
        notificationService.createNotification(
                application.getStudent().getId(),
                "Cập nhật trạng thái ứng tuyển",
                "Đơn ứng tuyển của bạn cho công việc '" + application.getJob().getTitle() + "' " + statusText +
                        (rejectionReason != null ? " Lý do: " + rejectionReason : ""),
                "APPLICATION_STATUS",
                saved.getId()
        );

        return saved;
    }
}
