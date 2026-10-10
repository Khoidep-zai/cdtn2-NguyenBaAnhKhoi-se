import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { Briefcase, User as UserIcon, LogOut, PlusCircle, Shield, FileText, Sun, Moon, Globe } from 'lucide-react';
import { NotificationBell } from '../notification/NotificationBell';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container nav-container">
        <Link to="/" className="brand-logo">
          <Briefcase size={26} color="var(--primary)" />
          <span>FreelanceHub</span>
          <span className="brand-badge">Nhóm 8</span>
        </Link>

        <nav className="nav-menu">
          <Link to="/" className="nav-link">{t('nav.home')}</Link>
          <Link to="/jobs" className="nav-link">{t('nav.jobs')}</Link>

          {isAuthenticated ? (
            <>
              {user?.role === 'ROLE_STUDENT' && (
                <>
                  <Link to="/student/applications" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <FileText size={16} /> {t('nav.applications')}
                  </Link>
                  <Link to="/student/profile" className="nav-link">{t('nav.profile')}</Link>
                </>
              )}

              {user?.role === 'ROLE_EMPLOYER' && (
                <>
                  <Link to="/employer/my-jobs" className="nav-link">{t('nav.myJobs')}</Link>
                  <Link to="/employer/profile" className="nav-link">{t('nav.profile')}</Link>
                  <Link to="/employer/post-job" className="btn btn-primary" style={{ padding: '0.45rem 1rem' }}>
                    <PlusCircle size={18} /> {t('nav.postJob')}
                  </Link>
                </>
              )}

              {user?.role === 'ROLE_ADMIN' && (
                <>
                  <Link to="/admin/profile" className="nav-link">{t('nav.profile')}</Link>
                  <Link to="/admin/dashboard" className="btn btn-secondary" style={{ padding: '0.45rem 0.85rem', color: '#ef4444' }}>
                    <Shield size={16} /> {t('nav.admin')}
                  </Link>
                </>
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
                <LogOut size={16} /> {t('nav.logout')}
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Link to="/login" className="btn btn-secondary">{t('nav.login')}</Link>
              <Link to="/register" className="btn btn-primary">{t('nav.register')}</Link>
            </div>
          )}

          {/* Quick controls: Language Switcher & Dark/Light Mode Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '0.75rem', marginLeft: '0.25rem' }}>
            {/* Language Switcher Button */}
            <button
              onClick={toggleLanguage}
              className="control-btn"
              title={language === 'vi' ? t('lang.toEnglish') : t('lang.toVietnamese')}
              aria-label="Toggle language"
            >
              <Globe size={15} color="var(--primary)" />
              <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>
                {language.toUpperCase()}
              </span>
            </button>

            {/* Dark / Light Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className="control-btn"
              title={theme === 'light' ? t('theme.toDark') : t('theme.toLight')}
              aria-label="Toggle dark mode"
              style={{ width: '36px', height: '36px', padding: 0 }}
            >
              {theme === 'dark' ? (
                <Sun size={17} color="#fbbf24" style={{ transition: 'transform 0.3s ease' }} />
              ) : (
                <Moon size={17} color="#4f46e5" style={{ transition: 'transform 0.3s ease' }} />
              )}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};
