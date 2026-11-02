package com.nhom8.freelance.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApplicationRequest {

    @NotNull(message = "ID công việc không được để trống")
    private Long jobId;

    private String coverLetter;

    private String cvUrl;
}