import { apiClient } from './apiClient';
import { WorkHistory, ApiResponse } from '../types';

export interface MarkCompletedData {
  startDate: string;
  endDate?: string;
  rating?: number;
  feedback?: string;
  description?: string;
}

export interface ConfirmCompletedData {
  confirmed?: boolean;
  isDispute?: boolean;
  feedback?: string;
  disputeReason?: string;
}

export const workHistoryService = {
  async markCompleted(applicationId: number, data: MarkCompletedData): Promise<WorkHistory> {
    const res = await apiClient.post<ApiResponse<WorkHistory>>(
      `/work-history/applications/${applicationId}/mark-completed`,
      data
    );
    return res.data.data;
  },

  async confirmCompleted(applicationId: number, data: ConfirmCompletedData): Promise<WorkHistory> {
    const res = await apiClient.post<ApiResponse<WorkHistory>>(
      `/work-history/applications/${applicationId}/confirm-completed`,
      data
    );
    return res.data.data;
  },

  async getStudentWorkHistory(studentId: number): Promise<WorkHistory[]> {
    const res = await apiClient.get<ApiResponse<WorkHistory[]>>(
      `/work-history/student/${studentId}`
    );
    return res.data.data || [];
  },

  async getByApplicationId(applicationId: number): Promise<WorkHistory | null> {
    try {
      const res = await apiClient.get<ApiResponse<WorkHistory>>(
        `/work-history/applications/${applicationId}`
      );
      return res.data.data || null;
    } catch {
      return null;
    }
  }
};
