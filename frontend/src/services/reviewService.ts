import { apiClient } from './apiClient';
import { ApiResponse } from '../types';

export interface Review {
  id: number;
  jobId: number;
  rating: number;
  comment: string;
  reviewer: {
    id: number;
    fullName: string;
    avatarUrl?: string;
  };
  reviewee: {
    id: number;
    fullName: string;
  };
  createdAt: string;
}

export const reviewService = {
  async createReview(jobId: number, revieweeId: number, rating: number, comment: string): Promise<Review> {
    const res = await apiClient.post<ApiResponse<Review>>('/reviews', {
      jobId,
      revieweeId,
      rating,
      comment
    });
    return res.data.data;
  },

  async getReviewsForJob(jobId: number): Promise<Review[]> {
    const res = await apiClient.get<ApiResponse<Review[]>>(`/reviews/job/${jobId}`);
    return res.data.data;
  },

  async getReviewsForUser(userId: number): Promise<Review[]> {
    const res = await apiClient.get<ApiResponse<Review[]>>(`/reviews/user/${userId}`);
    return res.data.data;
  },

  async getUserRating(userId: number): Promise<number> {
    const res = await apiClient.get<ApiResponse<number>>(`/reviews/user/${userId}/rating`);
    return res.data.data;
  }
};
