package com.nhom8.freelance.service;

import com.nhom8.freelance.exceptions.BadRequestException;
import com.nhom8.freelance.models.Job;
import com.nhom8.freelance.models.Review;
import com.nhom8.freelance.models.User;
import com.nhom8.freelance.repositories.JobRepository;
import com.nhom8.freelance.repositories.ReviewRepository;
import com.nhom8.freelance.repositories.UserRepository;
import com.nhom8.freelance.services.NotificationService;
import com.nhom8.freelance.services.ReviewService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ReviewService Unit Tests")
class ReviewServiceTest {

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private JobRepository jobRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private ReviewService reviewService;

    private User student;
    private User employer;
    private Job job;
    private Review review;

    @BeforeEach
    void setUp() {
        student = User.builder().id(2L).email("student@test.com").fullName("Student Test").build();
        employer = User.builder().id(1L).email("employer@test.com").fullName("Employer Test").build();

        job = Job.builder().id(10L).title("Lập trình Web").status("COMPLETED").build();

        review = Review.builder()
                .id(1L)
                .job(job)
                .reviewer(student)
                .reviewee(employer)
                .rating(5)
                .comment("Tuyệt vời")
                .build();
    }

    @Test
    @DisplayName("Tạo đánh giá thành công khi dữ liệu hợp lệ")
    void createReview_Success() {
        when(userRepository.findById(2L)).thenReturn(Optional.of(student));
        when(jobRepository.findById(10L)).thenReturn(Optional.of(job));
        when(userRepository.findById(1L)).thenReturn(Optional.of(employer));
        when(reviewRepository.existsByJobIdAndReviewerId(10L, 2L)).thenReturn(false);
        when(reviewRepository.save(any(Review.class))).thenReturn(review);

        Review result = reviewService.createReview(2L, 10L, 1L, 5, "Tuyệt vời");

        assertNotNull(result);
        assertEquals(5, result.getRating());
        verify(reviewRepository).save(any(Review.class));
        verify(notificationService).createNotification(eq(1L), anyString(), anyString(), eq("REVIEW"), anyLong());
    }

    @Test
    @DisplayName("Ném BadRequestException khi tự đánh giá chính mình")
    void createReview_SelfReview_ThrowsException() {
        assertThrows(BadRequestException.class, () ->
                reviewService.createReview(1L, 10L, 1L, 5, "Tự khen")
        );
    }

    @Test
    @DisplayName("Ném BadRequestException khi số sao không hợp lệ (ngoài khoảng 1-5)")
    void createReview_InvalidRating_ThrowsException() {
        assertThrows(BadRequestException.class, () ->
                reviewService.createReview(2L, 10L, 1L, 6, "Quá 5 sao")
        );

        assertThrows(BadRequestException.class, () ->
                reviewService.createReview(2L, 10L, 1L, 0, "Dưới 1 sao")
        );
    }

    @Test
    @DisplayName("Ném BadRequestException khi đã đánh giá công việc này rồi")
    void createReview_AlreadyReviewed_ThrowsException() {
        when(userRepository.findById(2L)).thenReturn(Optional.of(student));
        when(jobRepository.findById(10L)).thenReturn(Optional.of(job));
        when(userRepository.findById(1L)).thenReturn(Optional.of(employer));
        when(reviewRepository.existsByJobIdAndReviewerId(10L, 2L)).thenReturn(true);

        assertThrows(BadRequestException.class, () ->
                reviewService.createReview(2L, 10L, 1L, 5, "Đánh giá lại")
        );
    }
}
