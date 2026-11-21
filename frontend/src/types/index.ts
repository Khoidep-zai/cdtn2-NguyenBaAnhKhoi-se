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
  cvUrl?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
}

export interface JobShift {
  id?: number;
  jobId?: number;
  dayOfWeek: number; // 1: Thứ 2, ..., 7: Chủ nhật
  shiftName?: string;
  startTime?: string; // "HH:mm"
  endTime?: string; // "HH:mm"
  isFlexible?: boolean;
  sessionsPerWeek?: number;
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
  shiftType?: 'MORNING' | 'AFTERNOON' | 'EVENING' | 'WEEKEND' | 'FLEXIBLE';
  benefits?: string;
  studentFriendly?: boolean;
  slotsAvailable: number;
  status: 'PENDING_REVIEW' | 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED' | 'REJECTED';
  rejectionReason?: string;
  deadline?: string;
  createdAt: string;
  category: Category;
  employer: {
    id: number;
    fullName: string;
    companyName?: string;
    avatarUrl?: string;
  };
  shifts?: JobShift[];
}

export interface Application {
  id: number;
  jobId?: number;
  studentId?: number;
  coverLetter?: string;
  cvUrl?: string;
  status: 'PENDING' | 'REVIEWING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
  rejectionReason?: string;
  appliedAt: string;
  job?: Job;
  student?: User;
}

export interface WorkHistory {
  id: number;
  applicationId?: number;
  jobId?: number;
  studentId: number;
  employerId?: number;
  jobTitle: string;
  employerName: string;
  companyName?: string;
  companyAddress?: string;
  employerEmail?: string;
  jobType: string;
  workMode: string;
  description?: string;
  startDate: string;
  endDate?: string;
  completionStatus: 'PENDING_STUDENT_CONFIRM' | 'COMPLETED' | 'DISPUTED';
  employerRating?: number;
  employerFeedback?: string;
  studentFeedback?: string;
  employerCompletedAt: string;
  studentConfirmedAt?: string;
  createdAt: string;
}

export interface LanguageItem {
  id?: string;
  language: string;
  level: string;
}

export interface WorkExperienceItem {
  id?: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
}

export interface PortfolioProjectItem {
  id?: string;
  title: string;
  link?: string;
  technologies?: string;
  description?: string;
}

export interface CertificateItem {
  id?: string;
  name: string;
  issuer: string;
  year?: string;
  url?: string;
}

export interface StudentProfile {
  id?: number;
  userId: number;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  cvUrl?: string;
  bio?: string;
  careerObjective?: string;
  educationLevel?: string;
  university?: string;
  major?: string;
  gpa?: string;
  skills?: string;
  languages?: string; // JSON Array: LanguageItem[]
  workExperiences?: string; // JSON Array: WorkExperienceItem[]
  portfolioProjects?: string; // JSON Array: PortfolioProjectItem[]
  certificates?: string; // JSON Array: CertificateItem[]
  availableSchedule?: string; // JSON Object: Record<number, string[]>
  verifiedWorkHistories?: WorkHistory[];
  completionPercentage?: number;
  isOwnerOrAcceptedEmployer?: boolean;
}

export interface Report {
  id: number;
  job: Job;
  reporter: User;
  reason: string;
  description?: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
  resolvedBy?: User;
  resolutionNotes?: string;
  createdAt: string;
  resolvedAt?: string;
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
