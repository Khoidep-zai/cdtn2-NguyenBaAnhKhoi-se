package com.nhom8.freelance.controllers;

import com.nhom8.freelance.dto.ApiResponse;
import com.nhom8.freelance.models.Review;
import com.nhom8.freelance.security.UserPrincipal;
import com.nhom8.freelance.services.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
@Tag(name = "Đánh giá 2 chiều (Reviews)", description = "Các API đánh giá và xếp hạng sao sau khi hoàn thành công việc")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    @Operation(summary = "Gửi đánh giá và nhận xét (Sinh viên <-> NTD)")
    public ResponseEntity<ApiResponse<Review>> createReview(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody Map<String, Object> payload
    ) {
        Long jobId = Long.valueOf(payload.get("jobId").toString());
        Long revieweeId = Long.valueOf(payload.get("revieweeId").toString());
        Integer rating = Integer.valueOf(payload.get("rating").toString());
        String comment = (String) payload.get("comment");

        Review review = reviewService.createReview(currentUser.getId(), jobId, revieweeId, rating, comment);
        return ResponseEntity.ok(ApiResponse.ok("Gửi đánh giá thành công!", review));
    }

    @GetMapping("/job/{jobId}")
    @Operation(summary = "Lấy danh sách đánh giá của một công việc")
    public ResponseEntity<ApiResponse<List<Review>>> getReviewsByJob(@PathVariable Long jobId) {
        List<Review> reviews = reviewService.getReviewsByJob(jobId);
        return ResponseEntity.ok(ApiResponse.ok("Lấy danh sách đánh giá thành công", reviews));
    }

    @GetMapping("/job/{jobId}/has-reviewed")
    @Operation(summary = "Kiểm tra xem người dùng hiện tại đã đánh giá công việc này chưa")
    public ResponseEntity<ApiResponse<Boolean>> hasUserReviewed(
            @PathVariable Long jobId,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        boolean reviewed = currentUser != null && reviewService.hasUserReviewed(jobId, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.ok("Kiểm tra trạng thái đánh giá thành công", reviewed));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Lấy danh sách đánh giá của một người dùng")
    public ResponseEntity<ApiResponse<List<Review>>> getReviewsByUser(@PathVariable Long userId) {
        List<Review> reviews = reviewService.getReviewsByUser(userId);
        return ResponseEntity.ok(ApiResponse.ok("Lấy danh sách đánh giá người dùng thành công", reviews));
    }

    @GetMapping("/user/{userId}/rating")
    @Operation(summary = "Lấy điểm sao trung bình của một người dùng")
    public ResponseEntity<ApiResponse<Double>> getAverageRating(@PathVariable Long userId) {
        Double avg = reviewService.getAverageRating(userId);
        return ResponseEntity.ok(ApiResponse.ok("Lấy điểm đánh giá trung bình thành công", avg));
    }
}
