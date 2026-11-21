package com.nhom8.freelance.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobShiftDTO {
    private Long id;
    private Integer dayOfWeek; // 1: Thứ 2, 2: Thứ 3, ..., 7: Chủ nhật
    private String shiftName;

    @JsonFormat(pattern = "HH:mm[:ss]")
    private LocalTime startTime;

    @JsonFormat(pattern = "HH:mm[:ss]")
    private LocalTime endTime;

    private Boolean isFlexible;
    private Integer sessionsPerWeek;
}
