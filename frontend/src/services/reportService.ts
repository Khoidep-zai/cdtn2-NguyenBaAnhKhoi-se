import { apiClient } from './apiClient';
import { ApiResponse, Report } from '../types';

export interface ReportCreatePayload {
  jobId: number;
  reason: string;
  description?: string;
}

export interface ReportResolvePayload {
  action: 'DISMISS' | 'RESOLVE_BAN_JOB' | 'RESOLVE_BAN_EMPLOYER';
  resolutionNotes?: string;
}

export const reportService = {
  async submitReport(payload: ReportCreatePayload): Promise<Report> {
    const res = await apiClient.post<ApiResponse<Report>>('/reports', payload);
    return res.data.data;
  },

  async getReports(status?: string, page: number = 0, size: number = 20): Promise<{ content: Report[]; totalPages: number; totalElements: number }> {
    const statusParam = status && status !== 'ALL' ? `&status=${status}` : '';
    const res = await apiClient.get<ApiResponse<any>>(`/admin/reports?page=${page}&size=${size}${statusParam}`);
    return res.data.data;
  },

  async resolveReport(id: number, payload: ReportResolvePayload): Promise<Report> {
    const res = await apiClient.patch<ApiResponse<Report>>(`/admin/reports/${id}/resolve`, payload);
    return res.data.data;
  }
};

