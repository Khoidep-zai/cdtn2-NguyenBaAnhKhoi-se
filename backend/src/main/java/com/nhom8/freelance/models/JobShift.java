package com.nhom8.freelance.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "job_shifts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class JobShift {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Job job;

    @Column(nullable = false)
    private Integer dayOfWeek; // 1: Thứ 2, 2: Thứ 3, ..., 7: Chủ nhật

    @Column(length = 100)
    private String shiftName; // Ca sáng, Ca chiều, Ca tối, Ca linh hoạt...

    private LocalTime startTime;
    private LocalTime endTime;

    @Builder.Default
    private Boolean isFlexible = false;

    @Builder.Default
    private Integer sessionsPerWeek = 1;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
