import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, User as UserIcon, LogOut, PlusCircle, Shield, FileText } from 'lucide-react';
import { NotificationBell } from '../notification/NotificationBell';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container nav-container">
        <Link to="/" className="brand-logo">
          <Briefcase size={26} color="#4f46e5" />
          <span>FreelanceHub</span>
          <span className="brand-badge">Nhóm 8</span>
        </Link>

        <nav className="nav-menu">
          <Link to="/" className="nav-link">Trang chủ</Link>
          <Link to="/jobs" className="nav-link">Tìm việc làm</Link>

          {isAuthenticated ? (
            <>
              {user?.role === 'ROLE_STUDENT' && (
                <>
                  <Link to="/student/applications" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <FileText size={16} /> Đơn ứng tuyển
                  </Link>
                  <Link to="/student/profile" className="nav-link">Hồ sơ CV</Link>
                </>
              )}

              {user?.role === 'ROLE_EMPLOYER' && (
                <>
                  <Link to="/employer/my-jobs" className="nav-link">Quản lý tin</Link>
                  <Link to="/employer/post-job" className="btn btn-primary" style={{ padding: '0.45rem 1rem' }}>
                    <PlusCircle size={18} /> Đăng tin mới
                  </Link>
                </>
              )}

              {user?.role === 'ROLE_ADMIN' && (
                <Link to="/admin/dashboard" className="btn btn-secondary" style={{ padding: '0.45rem 0.85rem', color: '#b91c1c' }}>
                  <Shield size={16} /> Quản trị Admin
                </Link>
              )}

              <NotificationBell />

              <Link
                to={
                  user?.role === 'ROLE_STUDENT'
                    ? '/student/dashboard'
                    : user?.role === 'ROLE_EMPLOYER'
                    ? '/employer/dashboard'
                    : '/admin/dashboard'
                }
                className="nav-link"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <UserIcon size={18} />
                <span>{user?.fullName}</span>
              </Link>

              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.45rem 0.85rem' }}>
                <LogOut size={16} /> Đăng xuất
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <Link to="/login" className="btn btn-secondary">Đăng nhập</Link>
              <Link to="/register" className="btn btn-primary">Đăng ký</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};
