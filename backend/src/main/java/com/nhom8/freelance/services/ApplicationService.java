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

        if (job.getDeadline() != null && job.getDeadline().isBefore(java.time.LocalDateTime.now())) {
            throw new BadRequestException("Công việc này đã hết hạn nộp hồ sơ!");
        }

        if (job.getEmployer().getId().equals(studentId)) {
            throw new BadRequestException("Bạn không thể tự ứng tuyển vào công việc do chính mình đăng!");
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

    public List<Application> getApplicationsByJobSecure(Long jobId, Long requesterId, java.util.Collection<? extends org.springframework.security.core.GrantedAuthority> authorities) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Công việc không tồn tại"));

        boolean isAdmin = authorities != null && authorities.stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin && (requesterId == null || !job.getEmployer().getId().equals(requesterId))) {
            throw new BadRequestException("Bạn không có quyền xem danh sách ứng viên của công việc này");
        }
        return applicationRepository.findByJobId(jobId);
    }

    @Transactional
    public Application cancelApplication(Long applicationId, Long studentId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn ứng tuyển"));

        if (!application.getStudent().getId().equals(studentId)) {
            throw new BadRequestException("Bạn không thể hủy đơn ứng tuyển của người khác!");
        }

        if (!"PENDING".equalsIgnoreCase(application.getStatus())) {
            throw new BadRequestException("Chỉ có thể hủy đơn ứng tuyển khi hồ sơ ở trạng thái Chờ duyệt (PENDING)!");
        }

        application.setStatus("CANCELLED");
        return applicationRepository.save(application);
    }

    @Transactional
    public Application updateApplicationStatus(Long applicationId, String status, String rejectionReason) {
        return updateApplicationStatus(applicationId, status, rejectionReason, null, null);
    }

    @Transactional
    public Application updateApplicationStatus(Long applicationId, String status, String rejectionReason,
                                               Long requesterId, java.util.Collection<? extends org.springframework.security.core.GrantedAuthority> authorities) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn ứng tuyển"));

        // Admin có thể update bất kỳ đơn nào; Employer chỉ update đơn thuộc job của mình
        boolean isAdmin = authorities != null && authorities.stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin && requesterId != null) {
            Long jobEmployerId = application.getJob().getEmployer().getId();
            if (!jobEmployerId.equals(requesterId)) {
                throw new BadRequestException("Bạn không có quyền xét duyệt đơn ứng tuyển này");
            }
        }

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

