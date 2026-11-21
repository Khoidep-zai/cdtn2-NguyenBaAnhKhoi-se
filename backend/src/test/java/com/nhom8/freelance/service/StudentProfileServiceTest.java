package com.nhom8.freelance.service;

import com.nhom8.freelance.dto.StudentProfileDTO;
import com.nhom8.freelance.exceptions.BadRequestException;
import com.nhom8.freelance.models.StudentProfile;
import com.nhom8.freelance.models.User;
import com.nhom8.freelance.repositories.ApplicationRepository;
import com.nhom8.freelance.repositories.StudentProfileRepository;
import com.nhom8.freelance.repositories.UserRepository;
import com.nhom8.freelance.services.StudentProfileService;
import com.nhom8.freelance.services.WorkHistoryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StudentProfileServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private StudentProfileRepository studentProfileRepository;

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private WorkHistoryService workHistoryService;

    @InjectMocks
    private StudentProfileService studentProfileService;

    private User student;
    private StudentProfile profile;

    @BeforeEach
    void setUp() {
        student = User.builder()
                .id(4L)
                .fullName("Phạm Công Tài")
                .email("tai@vanlanguni.vn")
                .phone("0934567890")
                .university("Đại học Văn Lang")
                .major("CNTT")
                .skills("Java, Spring Boot, React")
                .bio("Sinh viên năm cuối")
                .build();

        profile = StudentProfile.builder()
                .id(1L)
                .user(student)
                .careerObjective("Trở thành Backend Engineer")
                .educationLevel("Đại học")
                .gpa("3.6")
                .languages("[{\"language\":\"Tiếng Anh\",\"level\":\"IELTS 6.5\"}]")
                .build();
    }

    @Test
    @DisplayName("Sinh viên xem hồ sơ của chính mình -> Thông tin liên hệ đầy đủ không bị che")
    void getStudentProfile_Owner_Unmasked() {
        when(userRepository.findById(4L)).thenReturn(Optional.of(student));
        when(studentProfileRepository.findByUserId(4L)).thenReturn(Optional.of(profile));
        when(workHistoryService.getWorkHistoryForStudent(4L, 4L)).thenReturn(Collections.emptyList());

        StudentProfileDTO res = studentProfileService.getStudentProfile(4L, 4L);

        assertNotNull(res);
        assertEquals("0934567890", res.getPhone());
        assertEquals("tai@vanlanguni.vn", res.getEmail());
        assertTrue(res.getIsOwnerOrAcceptedEmployer());
    }

    @Test
    @DisplayName("Người lạ xem hồ sơ sinh viên -> Số điện thoại và Email được làm mờ (Masked)")
    void getStudentProfile_PublicViewer_Masked() {
        when(userRepository.findById(4L)).thenReturn(Optional.of(student));
        when(studentProfileRepository.findByUserId(4L)).thenReturn(Optional.of(profile));
        when(applicationRepository.findByStudentId(4L)).thenReturn(Collections.emptyList());
        when(workHistoryService.getWorkHistoryForStudent(4L, 999L)).thenReturn(Collections.emptyList());

        StudentProfileDTO res = studentProfileService.getStudentProfile(4L, 999L);

        assertNotNull(res);
        assertTrue(res.getPhone().contains("****"));
        assertTrue(res.getEmail().contains("***"));
        assertFalse(res.getIsOwnerOrAcceptedEmployer());
    }

    @Test
    @DisplayName("Cập nhật số điện thoại sai định dạng ném BadRequestException")
    void updateStudentProfile_InvalidPhone_ThrowsException() {
        when(userRepository.findById(4L)).thenReturn(Optional.of(student));
        StudentProfileDTO dto = new StudentProfileDTO();
        dto.setPhone("123456"); // Sai format VN

        assertThrows(BadRequestException.class, () ->
                studentProfileService.updateStudentProfile(4L, 4L, dto)
        );
    }
}
