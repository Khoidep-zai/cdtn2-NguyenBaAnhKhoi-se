import { apiClient } from './apiClient';
import { Job, Application, ApiResponse } from '../types';

export interface SearchJobsParams {
  keyword?: string;
  categoryId?: number;
  jobType?: string;
  workMode?: string;
  status?: string;
  page?: number;
  size?: number;
}

export const jobService = {
  async getJobs(params?: SearchJobsParams): Promise<{ content: Job[]; totalElements: number }> {
    const res = await apiClient.get<ApiResponse<any>>('/jobs', { params });
    return res.data.data;
  },

  async getJobById(id: number): Promise<Job> {
    const res = await apiClient.get<ApiResponse<Job>>(`/jobs/${id}`);
    return res.data.data;
  },

  async createJob(jobData: any): Promise<Job> {
    const res = await apiClient.post<ApiResponse<Job>>('/jobs', jobData);
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
