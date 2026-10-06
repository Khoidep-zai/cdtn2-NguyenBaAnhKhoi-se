import { apiClient } from './apiClient';
import { User, ApiResponse } from '../types';

export interface AdminStats {
  totalUsers: number;
  totalJobs: number;
  totalApplications: number;
  totalReviews: number;
}

export const adminService = {
  async getStats(): Promise<AdminStats> {
    const res = await apiClient.get<ApiResponse<AdminStats>>('/admin/stats');
    return res.data.data;
  },

  async getAllUsers(): Promise<User[]> {
    const res = await apiClient.get<ApiResponse<User[]>>('/admin/users');
    return res.data.data;
  },

  async toggleUserStatus(id: number): Promise<User> {
    const res = await apiClient.patch<ApiResponse<User>>(`/admin/users/${id}/toggle-status`);
    return res.data.data;
  },

  async deleteJob(id: number): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(`/admin/jobs/${id}`);
  }
};
