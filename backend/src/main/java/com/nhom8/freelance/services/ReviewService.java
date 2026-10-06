package com.nhom8.freelance.services;

import com.nhom8.freelance.exceptions.BadRequestException;
import com.nhom8.freelance.exceptions.ResourceNotFoundException;
import com.nhom8.freelance.models.Job;
import com.nhom8.freelance.models.Review;
import com.nhom8.freelance.models.User;
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

        if (reviewRepository.existsByJobIdAndReviewerId(jobId, reviewerId)) {
            throw new BadRequestException("Bạn đã gửi đánh giá cho công việc này rồi!");
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
