import { apiClient } from './apiClient';
import { User, ApiResponse } from '../types';

export const userService = {
  async getUserProfile(id: number): Promise<User> {
    const res = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return res.data.data;
  },

  async updateProfile(profileData: Partial<User>): Promise<User> {
    const res = await apiClient.put<ApiResponse<User>>('/users/profile', profileData);
    return res.data.data;
  }
};
