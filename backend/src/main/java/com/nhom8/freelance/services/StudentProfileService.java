package com.nhom8.freelance.services;

import com.nhom8.freelance.dto.StudentProfileDTO;
import com.nhom8.freelance.dto.WorkHistoryDTO;
import com.nhom8.freelance.exceptions.BadRequestException;
import com.nhom8.freelance.exceptions.ResourceNotFoundException;
import com.nhom8.freelance.models.StudentProfile;
import com.nhom8.freelance.models.User;
import com.nhom8.freelance.repositories.ApplicationRepository;
import com.nhom8.freelance.repositories.StudentProfileRepository;
import com.nhom8.freelance.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class StudentProfileService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final ApplicationRepository applicationRepository;
    private final WorkHistoryService workHistoryService;

    private static final Pattern PHONE_PATTERN = Pattern.compile("^(0[3|5|7|8|9])[0-9]{8}$");

    public StudentProfileDTO getStudentProfile(Long studentId, Long currentUserId) {
        User user = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với ID: " + studentId));

        StudentProfile sp = studentProfileRepository.findByUserId(studentId).orElse(null);

        // Kiểm tra quyền xem thông tin cá nhân riêng tư
        boolean isOwner = (currentUserId != null && currentUserId.equals(studentId));
        boolean isAcceptedEmployer = false;

        if (!isOwner && currentUserId != null) {
            // Kiểm tra xem NTD hiện tại có đơn ứng tuyển ACCEPTED nào của sinh viên này không
            isAcceptedEmployer = applicationRepository.findByStudentId(studentId).stream()
                    .anyMatch(a -> a.getJob() != null 
                            && a.getJob().getEmployer() != null 
                            && a.getJob().getEmployer().getId().equals(currentUserId)
                            && "ACCEPTED".equalsIgnoreCase(a.getStatus()));
        }

        boolean canViewPrivate = isOwner || isAcceptedEmployer;

        // Masking thông tin nếu không có quyền xem private
        String displayPhone = user.getPhone();
        String displayEmail = user.getEmail();

        if (!canViewPrivate) {
            displayPhone = maskPhone(displayPhone);
            displayEmail = maskEmail(displayEmail);
        }

        // Lấy danh sách lịch sử công việc đã xác thực
        List<WorkHistoryDTO> histories = workHistoryService.getWorkHistoryForStudent(studentId, currentUserId);

        StudentProfileDTO dto = StudentProfileDTO.builder()
                .id(sp != null ? sp.getId() : null)
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(displayEmail)
                .phone(displayPhone)
                .avatarUrl(user.getAvatarUrl())
                .cvUrl(user.getCvUrl())
                .bio(user.getBio())
                .university(user.getUniversity())
                .major(user.getMajor())
                .skills(user.getSkills())
                .careerObjective(sp != null ? sp.getCareerObjective() : null)
                .educationLevel(sp != null ? sp.getEducationLevel() : null)
                .gpa(sp != null ? sp.getGpa() : null)
                .languages(sp != null ? sp.getLanguages() : null)
                .workExperiences(sp != null ? sp.getWorkExperiences() : null)
                .portfolioProjects(sp != null ? sp.getPortfolioProjects() : null)
                .certificates(sp != null ? sp.getCertificates() : null)
                .availableSchedule(sp != null ? sp.getAvailableSchedule() : null)
                .verifiedWorkHistories(histories)
                .isOwnerOrAcceptedEmployer(canViewPrivate)
                .build();

        dto.setCompletionPercentage(calculateCompletionPercentage(dto));

        return dto;
    }

    @Transactional
    public StudentProfileDTO updateStudentProfile(Long studentId, Long currentUserId, StudentProfileDTO dto) {
        if (!currentUserId.equals(studentId)) {
            throw new BadRequestException("Bạn chỉ có quyền cập nhật hồ sơ của chính mình");
        }

        User user = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại"));

        // Validation dữ liệu
        if (dto.getFullName() != null) {
            String cleanName = dto.getFullName().trim();
            if (cleanName.length() < 2 || cleanName.length() > 100) {
                throw new BadRequestException("Họ và tên phải từ 2 đến 100 ký tự");
            }
            user.setFullName(cleanName);
        }

        if (dto.getPhone() != null && !dto.getPhone().trim().isEmpty()) {
            String cleanPhone = dto.getPhone().trim();
            if (!PHONE_PATTERN.matcher(cleanPhone).matches()) {
                throw new BadRequestException("Số điện thoại không hợp lệ (Ví dụ hợp lệ: 0901234567)");
            }
            user.setPhone(cleanPhone);
        }

        if (dto.getBio() != null) user.setBio(dto.getBio());
        if (dto.getUniversity() != null) user.setUniversity(dto.getUniversity());
        if (dto.getMajor() != null) user.setMajor(dto.getMajor());
        if (dto.getSkills() != null) user.setSkills(dto.getSkills());
        if (dto.getAvatarUrl() != null) user.setAvatarUrl(dto.getAvatarUrl());
        if (dto.getCvUrl() != null) user.setCvUrl(dto.getCvUrl());

        userRepository.save(user);

        // Lưu / cập nhật bảng student_profiles
        StudentProfile sp = studentProfileRepository.findByUserId(studentId)
                .orElseGet(() -> StudentProfile.builder().user(user).build());

        sp.setCareerObjective(dto.getCareerObjective());
        sp.setEducationLevel(dto.getEducationLevel());
        sp.setGpa(dto.getGpa());
        sp.setLanguages(dto.getLanguages());
        sp.setWorkExperiences(dto.getWorkExperiences());
        sp.setPortfolioProjects(dto.getPortfolioProjects());
        sp.setCertificates(dto.getCertificates());
        sp.setAvailableSchedule(dto.getAvailableSchedule());

        studentProfileRepository.save(sp);

        return getStudentProfile(studentId, currentUserId);
    }

    private int calculateCompletionPercentage(StudentProfileDTO p) {
        int filled = 0;
        int total = 12;

        if (p.getFullName() != null && !p.getFullName().trim().isEmpty()) filled++;
        if (p.getBio() != null && !p.getBio().trim().isEmpty()) filled++;
        if (p.getCareerObjective() != null && !p.getCareerObjective().trim().isEmpty()) filled++;
        if (p.getEducationLevel() != null && !p.getEducationLevel().trim().isEmpty()) filled++;
        if (p.getUniversity() != null && !p.getUniversity().trim().isEmpty()) filled++;
        if (p.getSkills() != null && !p.getSkills().trim().isEmpty()) filled++;
        if (p.getLanguages() != null && !p.getLanguages().trim().isEmpty() && !p.getLanguages().equals("[]")) filled++;
        if (p.getWorkExperiences() != null && !p.getWorkExperiences().trim().isEmpty() && !p.getWorkExperiences().equals("[]")) filled++;
        if (p.getVerifiedWorkHistories() != null && !p.getVerifiedWorkHistories().isEmpty()) filled++;
        if (p.getPortfolioProjects() != null && !p.getPortfolioProjects().trim().isEmpty() && !p.getPortfolioProjects().equals("[]")) filled++;
        if (p.getCertificates() != null && !p.getCertificates().trim().isEmpty() && !p.getCertificates().equals("[]")) filled++;
        if (p.getAvailableSchedule() != null && !p.getAvailableSchedule().trim().isEmpty() && !p.getAvailableSchedule().equals("{}")) filled++;

        return Math.min(100, Math.round((float) filled * 100 / total));
    }

    private String maskPhone(String phone) {
        if (phone == null || phone.trim().isEmpty()) return "Chưa cập nhật";
        String clean = phone.trim();
        if (clean.length() <= 6) return clean.replaceAll(".", "*");
        return clean.substring(0, 3) + "****" + clean.substring(clean.length() - 3);
    }

    private String maskEmail(String email) {
        if (email == null || email.trim().isEmpty()) return "Chưa cập nhật";
        int atIndex = email.indexOf('@');
        if (atIndex <= 1) return "***" + email.substring(atIndex);
        return email.substring(0, 1) + "***" + email.substring(atIndex);
    }
}
