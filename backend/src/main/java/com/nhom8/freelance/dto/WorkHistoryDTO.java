package com.nhom8.freelance.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkHistoryDTO {
    private Long id;
    private Long applicationId;
    private Long jobId;
    private Long studentId;
    private Long employerId;

    // Snapshot thông tin công việc & nhà tuyển dụng
    private String jobTitle;
    private String employerName;
    private String companyName;
    private String companyAddress;
    private String employerEmail;
    private String jobType;
    private String workMode;
    private String description;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;

    private String completionStatus; // PENDING_STUDENT_CONFIRM, COMPLETED, DISPUTED
    private Integer employerRating;
    private String employerFeedback;
    private String studentFeedback;

    private LocalDateTime employerCompletedAt;
    private LocalDateTime studentConfirmedAt;
    private LocalDateTime createdAt;
}
