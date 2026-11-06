package com.nhom8.freelance.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportResolveRequest {

    @NotBlank(message = "Hành động xử lý không được để trống")
    @Pattern(regexp = "DISMISS|RESOLVE_BAN_JOB|RESOLVE_BAN_EMPLOYER", message = "Hành động chỉ chấp nhận DISMISS, RESOLVE_BAN_JOB hoặc RESOLVE_BAN_EMPLOYER")
    private String action;

    private String resolutionNotes;
}

