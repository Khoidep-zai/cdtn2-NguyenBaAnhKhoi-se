import { apiClient } from './apiClient';
import { StudentProfile, ApiResponse } from '../types';

export const studentProfileService = {
  async getMyProfile(): Promise<StudentProfile> {
    const res = await apiClient.get<ApiResponse<StudentProfile>>('/student-profile/me');
    return res.data.data;
  },

  async getPublicProfile(studentId: number): Promise<StudentProfile> {
    const res = await apiClient.get<ApiResponse<StudentProfile>>(`/student-profile/${studentId}`);
    return res.data.data;
  },

  async updateMyProfile(data: Partial<StudentProfile>): Promise<StudentProfile> {
    const res = await apiClient.put<ApiResponse<StudentProfile>>('/student-profile/me', data);
    return res.data.data;
  }
};
