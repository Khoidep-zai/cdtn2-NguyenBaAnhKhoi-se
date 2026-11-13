import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { Briefcase, User as UserIcon, LogOut, PlusCircle, Shield, FileText, Sun, Moon, Globe, Menu, X } from 'lucide-react';
import { NotificationBell } from '../notification/NotificationBell';
import { AnchorTooltip } from './AnchorTooltip';
import { PrefetchLink } from './PrefetchLink';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile menu on page transition
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const getDashboardPath = () => {
    if (user?.role === 'ROLE_STUDENT') return '/student/dashboard';
    if (user?.role === 'ROLE_EMPLOYER') return '/employer/dashboard';
    return '/admin/dashboard';
  };

  return (
    <header className="navbar">
      <div className="container nav-container">
        <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
          <Briefcase size={26} color="var(--primary)" />
          <span>FreelanceHub</span>
          <span className="brand-badge">Nhóm 8</span>
        </Link>

        {/* Desktop Navigation with PrefetchLink */}
        <nav className="nav-menu desktop-nav">
          <PrefetchLink to="/" className="nav-link">{t('nav.home')}</PrefetchLink>
          <PrefetchLink to="/jobs" className="nav-link">{t('nav.jobs')}</PrefetchLink>

          {isAuthenticated ? (
            <>
              {user?.role === 'ROLE_STUDENT' && (
                <>
                  <PrefetchLink to="/student/applications" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <FileText size={16} /> {t('nav.applications')}
                  </PrefetchLink>
                  <PrefetchLink to="/student/profile" className="nav-link">{t('nav.profile')}</PrefetchLink>
                </>
              )}

              {user?.role === 'ROLE_EMPLOYER' && (
                <>
                  <PrefetchLink to="/employer/my-jobs" className="nav-link">{t('nav.myJobs')}</PrefetchLink>
                  <PrefetchLink to="/employer/profile" className="nav-link">{t('nav.profile')}</PrefetchLink>
                  <PrefetchLink to="/employer/post-job" className="btn btn-primary" style={{ padding: '0.45rem 1rem' }}>
                    <PlusCircle size={18} /> {t('nav.postJob')}
                  </PrefetchLink>
                </>
              )}

              {user?.role === 'ROLE_ADMIN' && (
                <>
                  <PrefetchLink to="/admin/profile" className="nav-link">{t('nav.profile')}</PrefetchLink>
                  <PrefetchLink to="/admin/dashboard" className="btn-admin-badge" title="Khu vực Quản trị hệ thống">
                    <Shield size={15} /> {t('nav.admin')}
                  </PrefetchLink>
                </>
              )}

              <NotificationBell />

              <PrefetchLink
                to={getDashboardPath()}
                className="nav-link nav-user-profile"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <UserIcon size={18} />
                <span className="nav-user-name">{user?.fullName}</span>
              </PrefetchLink>

              <button onClick={handleLogout} className="btn btn-secondary nav-btn-logout" style={{ padding: '0.45rem 0.85rem' }}>
                <LogOut size={16} /> {t('nav.logout')}
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
              <PrefetchLink to="/login" className="nav-btn-secondary">{t('nav.login')}</PrefetchLink>
              <PrefetchLink to="/register" className="nav-btn-primary">{t('nav.register')}</PrefetchLink>
            </div>
          )}

          {/* Quick controls: Language Switcher & Dark/Light Mode Switcher with AnchorTooltip */}
          <div className="nav-controls">
            <AnchorTooltip content={language === 'vi' ? t('lang.toEnglish') : t('lang.toVietnamese')}>
              <button
                onClick={toggleLanguage}
                className="control-btn"
                aria-label="Toggle language"
              >
                <Globe size={15} color="var(--primary)" />
                <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>
                  {language.toUpperCase()}
                </span>
              </button>
            </AnchorTooltip>

            <AnchorTooltip content={theme === 'light' ? t('theme.toDark') : t('theme.toLight')}>
              <button
                onClick={toggleTheme}
                className="control-btn"
                aria-label="Toggle dark mode"
                style={{ width: '36px', height: '36px', padding: 0 }}
              >
                {theme === 'dark' ? (
                  <Sun size={17} color="#fbbf24" style={{ transition: 'transform 0.3s ease' }} />
                ) : (
                  <Moon size={17} color="#4f46e5" style={{ transition: 'transform 0.3s ease' }} />
                )}
              </button>
            </AnchorTooltip>
          </div>
        </nav>

        {/* Mobile controls & toggle button */}
        <div className="mobile-controls">
          <button
            onClick={toggleTheme}
            className="control-btn"
            aria-label="Toggle dark mode"
            style={{ width: '34px', height: '34px', padding: 0 }}
          >
            {theme === 'dark' ? <Sun size={16} color="#fbbf24" /> : <Moon size={16} color="#4f46e5" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="control-btn nav-hamburger"
            aria-label="Toggle navigation menu"
            style={{ width: '38px', height: '38px', padding: 0 }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer">
          <div className="container mobile-menu-content">
            <Link to="/" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
              {t('nav.home')}
            </Link>
            <Link to="/jobs" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
              {t('nav.jobs')}
            </Link>

            {isAuthenticated ? (
              <>
                {user?.role === 'ROLE_STUDENT' && (
                  <>
                    <Link to="/student/applications" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                      <FileText size={16} /> {t('nav.applications')}
                    </Link>
                    <Link to="/student/profile" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                      {t('nav.profile')}
                    </Link>
                  </>
                )}

                {user?.role === 'ROLE_EMPLOYER' && (
                  <>
                    <Link to="/employer/my-jobs" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                      {t('nav.myJobs')}
                    </Link>
                    <Link to="/employer/profile" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                      {t('nav.profile')}
                    </Link>
                    <Link to="/employer/post-job" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)}>
                      <PlusCircle size={18} /> {t('nav.postJob')}
                    </Link>
                  </>
                )}

                {user?.role === 'ROLE_ADMIN' && (
                  <Link to="/admin/dashboard" className="btn-admin-badge" style={{ justifyContent: 'center' }} onClick={() => setMobileMenuOpen(false)}>
                    <Shield size={16} /> {t('nav.admin')}
                  </Link>
                )}

                <div className="mobile-user-row">
                  <Link to={getDashboardPath()} className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                    <UserIcon size={18} /> <span>{user?.fullName}</span>
                  </Link>
                  <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.45rem 0.85rem' }}>
                    <LogOut size={16} /> {t('nav.logout')}
                  </button>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.5rem' }}>
                <Link to="/login" className="btn btn-secondary" onClick={() => setMobileMenuOpen(false)}>
                  {t('nav.login')}
                </Link>
                <Link to="/register" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)}>
                  {t('nav.register')}
                </Link>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Ngôn ngữ:</span>
              <button onClick={toggleLanguage} className="control-btn">
                <Globe size={15} color="var(--primary)" />
                <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>{language.toUpperCase()}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
