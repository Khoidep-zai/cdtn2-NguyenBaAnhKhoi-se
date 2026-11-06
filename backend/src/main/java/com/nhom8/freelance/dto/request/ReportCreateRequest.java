package com.nhom8.freelance.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportCreateRequest {

    @NotNull(message = "ID công việc không được để trống")
    private Long jobId;

    @NotBlank(message = "Lý do báo cáo không được để trống")
    private String reason; // SCAM_DEPOSIT, FALSE_INFO, INAPPROPRIATE, OTHER

    private String description;
}

