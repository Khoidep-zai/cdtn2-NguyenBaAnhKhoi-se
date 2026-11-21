package com.nhom8.freelance.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "work_histories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class WorkHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id")
    @JsonIgnoreProperties({"job", "student", "hibernateLazyInitializer", "handler"})
    private Application application;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id")
    @JsonIgnoreProperties({"shifts", "employer", "category", "hibernateLazyInitializer", "handler"})
    private Job job;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employer_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User employer;

    // Snapshot chi tiết lúc hoàn thành công việc (Bảo vệ dữ liệu không bị mất)
    @Column(nullable = false)
    private String jobTitle;

    @Column(nullable = false, length = 150)
    private String employerName;

    @Column(length = 150)
    private String companyName;

    @Column(length = 255)
    private String companyAddress;

    @Column(length = 150)
    private String employerEmail;

    @Column(nullable = false, length = 50)
    private String jobType;

    @Column(nullable = false, length = 50)
    private String workMode;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private LocalDate startDate;

    private LocalDate endDate;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String completionStatus = "PENDING_STUDENT_CONFIRM"; // PENDING_STUDENT_CONFIRM, COMPLETED, DISPUTED

    private Integer employerRating; // 1 - 5

    @Column(columnDefinition = "TEXT")
    private String employerFeedback;

    @Column(columnDefinition = "TEXT")
    private String studentFeedback;

    @Column(nullable = false)
    private LocalDateTime employerCompletedAt;

    private LocalDateTime studentConfirmedAt;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
