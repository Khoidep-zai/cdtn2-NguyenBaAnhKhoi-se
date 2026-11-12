import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { MainLayout } from './layouts/MainLayout';
import { ProtectedRoute } from './routes/ProtectedRoute';

// Critical LCP Routes (Loaded directly)
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { JobBrowsePage } from './pages/JobBrowsePage';
import { JobDetailPage } from './pages/JobDetailPage';

// Lazy Loaded Routes (Code-split for LCP optimization)
const RegisterPage = lazy(() => import('./pages/RegisterPage').then(m => ({ default: m.RegisterPage })));
const StudentDashboard = lazy(() => import('./pages/student/StudentDashboard').then(m => ({ default: m.StudentDashboard })));
const MyApplicationsPage = lazy(() => import('./pages/student/MyApplicationsPage').then(m => ({ default: m.MyApplicationsPage })));
const StudentProfilePage = lazy(() => import('./pages/student/StudentProfilePage').then(m => ({ default: m.StudentProfilePage })));
const EmployerDashboard = lazy(() => import('./pages/employer/EmployerDashboard').then(m => ({ default: m.EmployerDashboard })));
const MyJobsPage = lazy(() => import('./pages/employer/MyJobsPage').then(m => ({ default: m.MyJobsPage })));
const PostJobPage = lazy(() => import('./pages/PostJobPage').then(m => ({ default: m.PostJobPage })));
const ApplicantsPage = lazy(() => import('./pages/employer/ApplicantsPage').then(m => ({ default: m.ApplicantsPage })));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const ManageUsersPage = lazy(() => import('./pages/admin/ManageUsersPage').then(m => ({ default: m.ManageUsersPage })));
const ManageJobsPage = lazy(() => import('./pages/admin/ManageJobsPage').then(m => ({ default: m.ManageJobsPage })));
const ManageReportsPage = lazy(() => import('./pages/admin/ManageReportsPage').then(m => ({ default: m.ManageReportsPage })));

// Loading Skeleton Placeholder for lazy routes
const PageLoadingFallback: React.FC = () => (
  <div style={{
    minHeight: '60vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-muted)'
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      border: '3px solid var(--border-color)',
      borderTopColor: 'var(--primary)',
      animation: 'spin 0.8s linear infinite'
    }} />
  </div>
);

// Auto redirect based on role
const DashboardDispatcher: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Đang tải...</div>;
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  if (user.role === 'ROLE_ADMIN') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'ROLE_EMPLOYER') return <Navigate to="/employer/dashboard" replace />;
  return <Navigate to="/student/dashboard" replace />;
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <Suspense fallback={<PageLoadingFallback />}>
              <Routes>
                <Route path="/" element={<MainLayout />}>
                  {/* Public Routes */}
                  <Route index element={<HomePage />} />
                  <Route path="jobs" element={<JobBrowsePage />} />
                  <Route path="jobs/:id" element={<JobDetailPage />} />
                  <Route path="login" element={<LoginPage />} />
                  <Route path="register" element={<RegisterPage />} />

                  {/* Smart Dashboard Dispatcher */}
                  <Route path="dashboard" element={<DashboardDispatcher />} />

                  {/* Student Protected Routes */}
                  <Route
                    path="student/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['ROLE_STUDENT']}>
                        <StudentDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="student/applications"
                    element={
                      <ProtectedRoute allowedRoles={['ROLE_STUDENT']}>
                        <MyApplicationsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="student/profile"
                    element={
                      <ProtectedRoute allowedRoles={['ROLE_STUDENT']}>
                        <StudentProfilePage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Employer Protected Routes */}
                  <Route
                    path="employer/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['ROLE_EMPLOYER']}>
                        <EmployerDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="employer/profile"
                    element={
                      <ProtectedRoute allowedRoles={['ROLE_EMPLOYER']}>
                        <StudentProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="employer/my-jobs"
                    element={
                      <ProtectedRoute allowedRoles={['ROLE_EMPLOYER']}>
                        <MyJobsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="employer/post-job"
                    element={
                      <ProtectedRoute allowedRoles={['ROLE_EMPLOYER']}>
                        <PostJobPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="post-job"
                    element={
                      <ProtectedRoute allowedRoles={['ROLE_EMPLOYER']}>
                        <PostJobPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="employer/jobs/:id/applicants"
                    element={
                      <ProtectedRoute allowedRoles={['ROLE_EMPLOYER']}>
                        <ApplicantsPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Protected Routes */}
                  <Route
                    path="admin/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="admin/profile"
                    element={
                      <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                        <StudentProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="admin/users"
                    element={
                      <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                        <ManageUsersPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="admin/jobs"
                    element={
                      <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                        <ManageJobsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="admin/reports"
                    element={
                      <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                        <ManageReportsPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Universal Profile Route */}
                  <Route
                    path="profile"
                    element={
                      <ProtectedRoute allowedRoles={['ROLE_STUDENT', 'ROLE_EMPLOYER', 'ROLE_ADMIN']}>
                        <StudentProfilePage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
