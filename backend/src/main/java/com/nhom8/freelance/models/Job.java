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
