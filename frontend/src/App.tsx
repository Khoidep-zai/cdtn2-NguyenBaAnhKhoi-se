import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MainLayout } from './layouts/MainLayout';
import { ProtectedRoute } from './routes/ProtectedRoute';

// Public pages
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { JobBrowsePage } from './pages/JobBrowsePage';
import { JobDetailPage } from './pages/JobDetailPage';

// Student pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { MyApplicationsPage } from './pages/student/MyApplicationsPage';
import { StudentProfilePage } from './pages/student/StudentProfilePage';

// Employer pages
import { EmployerDashboard } from './pages/employer/EmployerDashboard';
import { MyJobsPage } from './pages/employer/MyJobsPage';
import { PostJobPage } from './pages/PostJobPage';
import { ApplicantsPage } from './pages/employer/ApplicantsPage';

// Admin pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManageUsersPage } from './pages/admin/ManageUsersPage';
import { ManageJobsPage } from './pages/admin/ManageJobsPage';

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
    <AuthProvider>
      <BrowserRouter>
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

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
