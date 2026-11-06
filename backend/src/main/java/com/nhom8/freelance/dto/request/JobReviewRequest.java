package com.nhom8.freelance.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobReviewRequest {

    @NotBlank(message = "Hành động duyệt không được để trống")
    @Pattern(regexp = "APPROVE|REJECT", message = "Hành động chỉ chấp nhận APPROVE hoặc REJECT")
    private String action;

    private String rejectionReason;
}

