export type RoleType = 'ROLE_STUDENT' | 'ROLE_EMPLOYER' | 'ROLE_ADMIN';

export interface User {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  role: RoleType;
  university?: string;
  major?: string;
  companyName?: string;
  companyAddress?: string;
  skills?: string;
  avatarUrl?: string;
  bio?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
}

export interface Job {
  id: number;
  title: string;
  description: string;
  requirements?: string;
  jobType: 'PART_TIME' | 'FREELANCE' | 'INTERNSHIP';
  workMode: 'ONSITE' | 'REMOTE' | 'HYBRID';
  location?: string;
  province?: string;
  salaryType: 'HOURLY' | 'FIXED_PROJECT' | 'MONTHLY';
  salaryAmount: number;
  salaryText?: string;
  workingHours?: string;
  benefits?: string;
  studentFriendly?: boolean;
  slotsAvailable: number;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED';
  deadline?: string;
  createdAt: string;
  category: Category;
  employer: {
    id: number;
    fullName: string;
    companyName?: string;
    avatarUrl?: string;
  };
}

export interface Application {
  id: number;
  jobId?: number;
  studentId?: number;
  coverLetter?: string;
  cvUrl?: string;
  status: 'PENDING' | 'REVIEWING' | 'ACCEPTED' | 'REJECTED';
  rejectionReason?: string;
  appliedAt: string;
  job?: Job;
  student?: User;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  userId: number;
  email: string;
  fullName: string;
  role: RoleType;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}
