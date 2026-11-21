package com.nhom8.freelance.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "student_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class StudentProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User user;

    @Column(columnDefinition = "TEXT")
    private String careerObjective;

    @Column(length = 100)
    private String educationLevel;

    @Column(length = 20)
    private String gpa;

    @Column(columnDefinition = "LONGTEXT")
    private String languages; // JSON array: [{"language": "Tiếng Anh", "level": "IELTS 6.5"}]

    @Column(columnDefinition = "LONGTEXT")
    private String workExperiences; // JSON array: [{"company": "...", "position": "...", "startDate": "...", "endDate": "...", "description": "..."}]

    @Column(columnDefinition = "LONGTEXT")
    private String portfolioProjects; // JSON array: [{"title": "...", "link": "...", "description": "...", "technologies": "..."}]

    @Column(columnDefinition = "LONGTEXT")
    private String certificates; // JSON array: [{"name": "...", "issuer": "...", "year": "...", "url": "..."}]

    @Column(columnDefinition = "LONGTEXT")
    private String availableSchedule; // JSON object: {"1": ["MORNING"], "2": ["EVENING"]}

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
