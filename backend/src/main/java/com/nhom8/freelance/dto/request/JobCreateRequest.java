package com.nhom8.freelance.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class JobCreateRequest {
    @NotNull(message = "Danh mục không được để trống")
    private Long categoryId;

    @NotBlank(message = "Tiêu đề công việc không được để trống")
    private String title;

    @NotBlank(message = "Mô tả công việc không được để trống")
    private String description;

    private String requirements;

    @NotBlank(message = "Loại hình công việc không được để trống")
    private String jobType; // PART_TIME, FREELANCE, INTERNSHIP

    private String workMode; // ONSITE, REMOTE, HYBRID
    private String location;
    private String province; // Tỉnh thành
    private String salaryText; // Hiển thị chi tiết lương
    private String workingHours; // Ca làm việc
    private String benefits; // Phúc lợi
    private Boolean studentFriendly = true; // Phù hợp sinh viên

    @NotBlank(message = "Hình thức thù lao không được để trống")
    private String salaryType; // HOURLY, FIXED_PROJECT, MONTHLY

    @NotNull(message = "Mức lương không được để trống")
    @Positive(message = "Mức lương phải lớn hơn 0")
    private BigDecimal salaryAmount;

    private Integer slotsAvailable = 1;
    private LocalDateTime deadline;
}
