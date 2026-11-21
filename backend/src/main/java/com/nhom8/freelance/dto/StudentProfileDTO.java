package com.nhom8.freelance.dto;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProfileDTO {
    // 1. Thông tin cá nhân & Liên hệ
    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    private String phone;
    private String avatarUrl;
    private String cvUrl;

    // 2. Giới thiệu bản thân
    private String bio;

    // 3. Mục tiêu nghề nghiệp
    private String careerObjective;

    // 4. Trình độ học vấn
    private String educationLevel;

    // 5. Trường học, chuyên ngành & GPA
    private String university;
    private String major;
    private String gpa;

    // 6. Kỹ năng chuyên môn
    private String skills;

    // 7. Ngoại ngữ (JSON string: [{"language": "Tiếng Anh", "level": "IELTS 6.5"}])
    private String languages;

    // 8. Kinh nghiệm làm việc (JSON string: [{"company": "...", "position": "...", "startDate": "...", "endDate": "...", "description": "..."}])
    private String workExperiences;

    // 9. Lịch sử công việc đã hoàn thành (Xác thực 2 chiều từ work_histories)
    private List<WorkHistoryDTO> verifiedWorkHistories;

    // 10. Dự án cá nhân & Portfolio (JSON string: [{"title": "...", "link": "...", "description": "...", "technologies": "..."}])
    private String portfolioProjects;

    // 11. Chứng chỉ (JSON string: [{"name": "...", "issuer": "...", "year": "...", "url": "..."}])
    private String certificates;

    // 12. Lịch rảnh có thể làm việc (JSON string: {"1": ["MORNING"], "2": ["EVENING"]})
    private String availableSchedule;

    // Tỷ lệ hoàn thiện hồ sơ (0 - 100%)
    private Integer completionPercentage;

    // Cờ đánh dấu quyền xem (true nếu là chính chủ hoặc NTD đã nhận việc)
    private Boolean isOwnerOrAcceptedEmployer;
}
