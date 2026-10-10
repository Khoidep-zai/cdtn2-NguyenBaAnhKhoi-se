package com.nhom8.freelance.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employer_id", nullable = false)
    private User employer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String requirements;

    @Column(nullable = false, length = 50)
    private String jobType; // PART_TIME, FREELANCE, INTERNSHIP

    @Column(length = 50)
    @Builder.Default
    private String workMode = "ONSITE"; // ONSITE, REMOTE, HYBRID

    private String location;

    @Column(length = 100)
    private String province; // Tỉnh thành (chuẩn hóa 34 tỉnh)

    @Column(length = 100)
    private String salaryText; // Lương hiển thị chi tiết (VD: 5.0 - 8.0 triệu, 28.000đ/giờ)

    @Column(length = 255)
    private String workingHours; // Ca làm việc (VD: Ca tối 17h-22h, Linh hoạt)

    @Column(columnDefinition = "TEXT")
    private String benefits; // Phúc lợi

    @Builder.Default
    private Boolean studentFriendly = true; // Dành riêng / thân thiện sinh viên

    @Column(nullable = false, length = 50)
    private String salaryType; // HOURLY, FIXED_PROJECT, MONTHLY

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal salaryAmount;

    @Builder.Default
    private Integer slotsAvailable = 1;

    @Column(length = 50)
    @Builder.Default
    private String status = "OPEN"; // OPEN, IN_PROGRESS, COMPLETED, CLOSED

    private LocalDateTime deadline;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
