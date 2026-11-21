package com.nhom8.freelance.services;

import com.nhom8.freelance.dto.WorkHistoryDTO;
import com.nhom8.freelance.dto.request.ConfirmCompletedRequest;
import com.nhom8.freelance.dto.request.MarkCompletedRequest;
import com.nhom8.freelance.exceptions.BadRequestException;
import com.nhom8.freelance.exceptions.ResourceNotFoundException;
import com.nhom8.freelance.models.Application;
import com.nhom8.freelance.models.Job;
import com.nhom8.freelance.models.User;
import com.nhom8.freelance.models.WorkHistory;
import com.nhom8.freelance.repositories.ApplicationRepository;
import com.nhom8.freelance.repositories.WorkHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkHistoryService {

    private final WorkHistoryRepository workHistoryRepository;
    private final ApplicationRepository applicationRepository;
    private final NotificationService notificationService;

    @Transactional
    public WorkHistoryDTO markCompletedByEmployer(Long applicationId, Long currentUserId, MarkCompletedRequest request) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn ứng tuyển"));

        // Kiểm tra phân quyền: Chỉ chủ sở hữu tin tuyển dụng
        if (!application.getJob().getEmployer().getId().equals(currentUserId)) {
            throw new BadRequestException("Bạn không có quyền xác nhận hoàn thành cho công việc này");
        }

        // Kiểm tra trạng thái: Phải là ACCEPTED
        if (!"ACCEPTED".equalsIgnoreCase(application.getStatus())) {
            throw new BadRequestException("Chỉ đơn ứng tuyển đã được duyệt nhận việc (ACCEPTED) mới có thể xác nhận hoàn thành");
        }

        // Chống xác nhận trùng lặp
        if (workHistoryRepository.existsByApplicationId(applicationId)) {
            throw new BadRequestException("Đơn ứng tuyển này đã được tạo quy trình hoàn thành trước đó");
        }

        // Validation ngày tháng: end_date >= start_date
        if (request.getStartDate() == null) {
            throw new BadRequestException("Ngày bắt đầu không được để trống");
        }
        if (request.getEndDate() != null && request.getEndDate().isBefore(request.getStartDate())) {
            throw new BadRequestException("Ngày kết thúc không được trước ngày bắt đầu");
        }

        // Validation rating: 1 - 5 sao
        if (request.getRating() != null && (request.getRating() < 1 || request.getRating() > 5)) {
            throw new BadRequestException("Đánh giá phải từ 1 đến 5 sao");
        }

        Job job = application.getJob();
        User employer = job.getEmployer();
        User student = application.getStudent();

        // Snapshot Pattern: Lưu bản chụp dữ liệu tĩnh bảo vệ vĩnh viễn kinh nghiệm sinh viên
        WorkHistory workHistory = WorkHistory.builder()
                .application(application)
                .job(job)
                .student(student)
                .employer(employer)
                .jobTitle(job.getTitle())
                .employerName(employer.getFullName())
                .companyName(employer.getCompanyName() != null ? employer.getCompanyName() : job.getTitle())
                .companyAddress(employer.getCompanyAddress() != null ? employer.getCompanyAddress() : job.getLocation())
                .employerEmail(employer.getEmail())
                .jobType(job.getJobType())
                .workMode(job.getWorkMode() != null ? job.getWorkMode() : "ONSITE")
                .description(request.getDescription() != null ? request.getDescription() : job.getDescription())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate() != null ? request.getEndDate() : LocalDate.now())
                .completionStatus("PENDING_STUDENT_CONFIRM")
                .employerRating(request.getRating())
                .employerFeedback(request.getFeedback())
                .employerCompletedAt(LocalDateTime.now())
                .build();

        WorkHistory saved = workHistoryRepository.save(workHistory);

        // Gửi thông báo đến sinh viên
        notificationService.createNotification(
                student.getId(),
                "Xác nhận hoàn thành công việc",
                "Nhà tuyển dụng " + employer.getFullName() + " đã xác nhận hoàn thành công việc '" + job.getTitle() + "'. Vui lòng kiểm tra và xác nhận để ghi nhận vào Hồ sơ của bạn.",
                "WORK_COMPLETED_PENDING",
                saved.getId()
        );

        return mapToDTO(saved);
    }

    @Transactional
    public WorkHistoryDTO confirmCompletedByStudent(Long applicationId, Long currentUserId, ConfirmCompletedRequest request) {
        WorkHistory workHistory = workHistoryRepository.findByApplicationId(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Chưa có yêu cầu hoàn thành cho đơn ứng tuyển này"));

        // Kiểm tra phân quyền: Chỉ sinh viên sở hữu đơn
        if (!workHistory.getStudent().getId().equals(currentUserId)) {
            throw new BadRequestException("Bạn không có quyền thao tác trên lịch sử này");
        }

        // Chống thao tác đè nếu đã hoàn thành
        if ("COMPLETED".equalsIgnoreCase(workHistory.getCompletionStatus())) {
            throw new BadRequestException("Công việc này đã được xác nhận hoàn thành thành công trước đó");
        }

        if (Boolean.TRUE.equals(request.getIsDispute())) {
            // Trường hợp có tranh chấp / khiếu nại
            workHistory.setCompletionStatus("DISPUTED");
            workHistory.setStudentFeedback(request.getDisputeReason() != null ? request.getDisputeReason() : request.getFeedback());

            WorkHistory saved = workHistoryRepository.save(workHistory);

            if (workHistory.getEmployer() != null) {
                notificationService.createNotification(
                        workHistory.getEmployer().getId(),
                        "Khiếu nại về hoàn thành công việc",
                        "Sinh viên " + workHistory.getStudent().getFullName() + " đã gửi khiếu nại cho công việc '" + workHistory.getJobTitle() + "': " + workHistory.getStudentFeedback(),
                        "WORK_DISPUTED",
                        saved.getId()
                );
            }

            return mapToDTO(saved);
        } else {
            // Sinh viên đồng ý xác nhận hoàn thành
            workHistory.setCompletionStatus("COMPLETED");
            workHistory.setStudentFeedback(request.getFeedback());
            workHistory.setStudentConfirmedAt(LocalDateTime.now());

            WorkHistory saved = workHistoryRepository.save(workHistory);

            if (workHistory.getEmployer() != null) {
                notificationService.createNotification(
                        workHistory.getEmployer().getId(),
                        "Sinh viên đã xác nhận hoàn thành",
                        "Sinh viên " + workHistory.getStudent().getFullName() + " đã xác nhận hoàn thành công việc '" + workHistory.getJobTitle() + "'. Công việc đã được ghi nhận vào Hồ sơ.",
                        "WORK_COMPLETED",
                        saved.getId()
                );
            }

            return mapToDTO(saved);
        }
    }

    public List<WorkHistoryDTO> getWorkHistoryForStudent(Long studentId, Long currentUserId) {
        // Nếu là chính sinh viên đó: Xem được toàn bộ trạng thái (kể cả PENDING, DISPUTED)
        if (currentUserId != null && currentUserId.equals(studentId)) {
            return workHistoryRepository.findByStudentIdOrderByCreatedAtDesc(studentId)
                    .stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());
        }

        // Nếu là người khác hoặc NTD xem công khai: CHỈ xem được các công việc đã COMPLETED
        return workHistoryRepository.findByStudentIdAndCompletionStatusOrderByCreatedAtDesc(studentId, "COMPLETED")
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public WorkHistoryDTO getWorkHistoryByApplicationId(Long applicationId, Long currentUserId) {
        WorkHistory wh = workHistoryRepository.findByApplicationId(applicationId)
                .orElse(null);
        if (wh == null) return null;

        // Kiểm tra quyền: chỉ sinh viên hoặc NTD liên quan hoặc Admin
        Long studentId = wh.getStudent().getId();
        Long employerId = (wh.getEmployer() != null) ? wh.getEmployer().getId() : null;

        if (currentUserId != null && (currentUserId.equals(studentId) || (employerId != null && currentUserId.equals(employerId)))) {
            return mapToDTO(wh);
        }

        if ("COMPLETED".equals(wh.getCompletionStatus())) {
            return mapToDTO(wh);
        }

        throw new BadRequestException("Bạn không có quyền xem thông tin này");
    }

    public WorkHistoryDTO mapToDTO(WorkHistory wh) {
        if (wh == null) return null;
        return WorkHistoryDTO.builder()
                .id(wh.getId())
                .applicationId(wh.getApplication() != null ? wh.getApplication().getId() : null)
                .jobId(wh.getJob() != null ? wh.getJob().getId() : null)
                .studentId(wh.getStudent() != null ? wh.getStudent().getId() : null)
                .employerId(wh.getEmployer() != null ? wh.getEmployer().getId() : null)
                .jobTitle(wh.getJobTitle())
                .employerName(wh.getEmployerName())
                .companyName(wh.getCompanyName())
                .companyAddress(wh.getCompanyAddress())
                .employerEmail(wh.getEmployerEmail())
                .jobType(wh.getJobType())
                .workMode(wh.getWorkMode())
                .description(wh.getDescription())
                .startDate(wh.getStartDate())
                .endDate(wh.getEndDate())
                .completionStatus(wh.getCompletionStatus())
                .employerRating(wh.getEmployerRating())
                .employerFeedback(wh.getEmployerFeedback())
                .studentFeedback(wh.getStudentFeedback())
                .employerCompletedAt(wh.getEmployerCompletedAt())
                .studentConfirmedAt(wh.getStudentConfirmedAt())
                .createdAt(wh.getCreatedAt())
                .build();
    }
}
