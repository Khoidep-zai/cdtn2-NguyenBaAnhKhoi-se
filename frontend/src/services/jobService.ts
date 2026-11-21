import { apiClient } from './apiClient';
import { Job, Application, JobShift, ApiResponse } from '../types';

export interface SearchJobsParams {
  keyword?: string;
  categoryId?: number;
  jobType?: string;
  workMode?: string;
  status?: string;
  province?: string;
  studentFriendly?: boolean;
  shiftType?: string;
  daysOfWeek?: number[];
  startTime?: string;
  endTime?: string;
  page?: number;
  size?: number;
}

export const jobService = {
  async getJobs(params?: SearchJobsParams): Promise<{ content: Job[]; totalElements: number; totalPages: number }> {
    // Nếu có daysOfWeek dạng mảng, truyền params serializer hoặc tham số comma-separated
    const queryParams: any = { ...params };
    if (params?.daysOfWeek && params.daysOfWeek.length > 0) {
      queryParams.daysOfWeek = params.daysOfWeek.join(',');
    }
    const res = await apiClient.get<ApiResponse<any>>('/jobs', { params: queryParams });
    return res.data.data;
  },

  async getProvinces(): Promise<string[]> {
    const res = await apiClient.get<ApiResponse<string[]>>('/jobs/provinces');
    return res.data.data || [];
  },

  async getJobById(id: number): Promise<Job> {
    const res = await apiClient.get<ApiResponse<Job>>(`/jobs/${id}`);
    return res.data.data;
  },

  async getJobShifts(jobId: number): Promise<JobShift[]> {
    try {
      const res = await apiClient.get<ApiResponse<JobShift[]>>(`/jobs/${jobId}/shifts`);
      return res.data.data || [];
    } catch {
      return [];
    }
  },

  async createJob(jobData: any): Promise<Job> {
    const res = await apiClient.post<ApiResponse<Job>>('/jobs', jobData);
    return res.data.data;
  },

  async updateJob(jobId: number, jobData: any): Promise<Job> {
    const res = await apiClient.put<ApiResponse<Job>>(`/jobs/${jobId}`, jobData);
    return res.data.data;
  },

  async updateJobStatus(jobId: number, status: string): Promise<Job> {
    const res = await apiClient.patch<ApiResponse<Job>>(`/jobs/${jobId}/status`, null, {
        params: { status }
    });
    return res.data.data;
  },

  async applyJob(jobId: number, coverLetter: string, cvUrl?: string): Promise<Application> {
    const res = await apiClient.post<ApiResponse<Application>>('/applications', {
      jobId,
      coverLetter,
      cvUrl,
    });
    return res.data.data;
  },

  async getMyApplications(): Promise<Application[]> {
    const res = await apiClient.get<ApiResponse<Application[]>>('/applications/my-applications');
    return res.data.data;
  },

  async cancelApplication(applicationId: number): Promise<Application> {
    const res = await apiClient.patch<ApiResponse<Application>>(`/applications/${applicationId}/cancel`);
    return res.data.data;
  },

  async getMyPostedJobs(): Promise<Job[]> {
    const res = await apiClient.get<ApiResponse<Job[]>>('/jobs/my-jobs');
    return res.data.data;
  },

  async getApplicantsForJob(jobId: number): Promise<Application[]> {
    const res = await apiClient.get<ApiResponse<Application[]>>(`/applications/job/${jobId}`);
    return res.data.data;
  },

  async updateApplicationStatus(applicationId: number, status: string, rejectionReason?: string): Promise<Application> {
    const res = await apiClient.patch<ApiResponse<Application>>(`/applications/${applicationId}/status`, {
      status,
      rejectionReason
    });
    return res.data.data;
  },

  async getCategories(): Promise<any[]> {
    const res = await apiClient.get<ApiResponse<any[]>>('/categories');
    return res.data.data;
  }
};
