package com.nhom8.freelance.repositories;

import com.nhom8.freelance.models.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByRevieweeId(Long revieweeId);
    List<Review> findByJobId(Long jobId);
    boolean existsByJobIdAndReviewerId(Long jobId, Long reviewerId);
    Optional<Review> findByJobIdAndReviewerId(Long jobId, Long reviewerId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.reviewee.id = :userId")
    Double getAverageRatingForUser(@Param("userId") Long userId);
}
