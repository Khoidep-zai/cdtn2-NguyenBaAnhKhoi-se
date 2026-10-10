package com.nhom8.freelance.services;

import com.nhom8.freelance.exceptions.BadRequestException;
import com.nhom8.freelance.exceptions.ResourceNotFoundException;
import com.nhom8.freelance.models.Job;
import com.nhom8.freelance.models.Review;
import com.nhom8.freelance.models.User;
import com.nhom8.freelance.repositories.ApplicationRepository;
import com.nhom8.freelance.repositories.JobRepository;
import com.nhom8.freelance.repositories.ReviewRepository;
import com.nhom8.freelance.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;
    private final NotificationService notificationService;

    @Transactional
    public Review createReview(Long reviewerId, Long jobId, Long revieweeId, Integer rating, String comment) {
        if (rating == null || rating < 1 || rating > 5) {
            throw new BadRequestException("Điểm đánh giá phải từ 1 đến 5 sao!");
        }

        if (reviewerId.equals(revieweeId)) {
            throw new BadRequestException("Bạn không thể tự đánh giá chính mình!");
        }

        User reviewer = userRepository.findById(reviewerId)
                .orElseThrow(() -> new ResourceNotFoundException("Người đánh giá không tồn tại"));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Công việc không tồn tại"));

        User reviewee = userRepository.findById(revieweeId)
                .orElseThrow(() -> new ResourceNotFoundException("Người được đánh giá không tồn tại"));

        if (!"COMPLETED".equalsIgnoreCase(job.getStatus())) {
            throw new BadRequestException("Chỉ có thể đánh giá sau khi công việc đã ở trạng thái HOÀN THÀNH (COMPLETED)!");
        }

        if (reviewRepository.existsByJobIdAndReviewerId(jobId, reviewerId)) {
            throw new BadRequestException("Bạn đã gửi đánh giá cho công việc này rồi!");
        }

        // Kiểm tra tính hợp lệ của hai bên tham gia công việc
        boolean isEmployer = job.getEmployer() != null && reviewerId.equals(job.getEmployer().getId());
        if (isEmployer) {
            // NTD đánh giá sinh viên: sinh viên phải có đơn được ACCEPTED trong job này
            boolean isAcceptedApplicant = applicationRepository.existsByJobIdAndStudentIdAndStatus(jobId, revieweeId, "ACCEPTED");
            if (!isAcceptedApplicant) {
                throw new BadRequestException("Chỉ có thể đánh giá sinh viên đã được chấp nhận làm việc cho công việc này!");
            }
        } else {
            // Sinh viên đánh giá NTD: sinh viên phải là người được ACCEPTED và reviewee phải là NTD
            boolean isAcceptedApplicant = applicationRepository.existsByJobIdAndStudentIdAndStatus(jobId, reviewerId, "ACCEPTED");
            if (!isAcceptedApplicant) {
                throw new BadRequestException("Chỉ sinh viên đã được duyệt làm công việc này mới có quyền đánh giá!");
            }
            if (job.getEmployer() != null && !revieweeId.equals(job.getEmployer().getId())) {
                throw new BadRequestException("Sinh viên chỉ có thể đánh giá nhà tuyển dụng của công việc này!");
            }
        }

        Review review = Review.builder()
                .job(job)
                .reviewer(reviewer)
                .reviewee(reviewee)
                .rating(rating)
                .comment(comment)
                .build();

        Review savedReview = reviewRepository.save(review);

        // Notify reviewee
        notificationService.createNotification(
                revieweeId,
                "Bạn nhận được đánh giá mới",
                reviewer.getFullName() + " đã gửi đánh giá " + rating + " sao cho bạn về công việc '" + job.getTitle() + "'.",
                "REVIEW",
                jobId
        );

        return savedReview;
    }

    public boolean hasUserReviewed(Long jobId, Long userId) {
        return reviewRepository.existsByJobIdAndReviewerId(jobId, userId);
    }

    public List<Review> getReviewsByJob(Long jobId) {
        return reviewRepository.findByJobId(jobId);
    }

    public List<Review> getReviewsByUser(Long userId) {
        return reviewRepository.findByRevieweeId(userId);
    }

    public Double getAverageRating(Long userId) {
        Double avg = reviewRepository.getAverageRatingForUser(userId);
        return avg != null ? Math.round(avg * 10.0) / 10.0 : 5.0;
    }
}
