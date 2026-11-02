import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LogIn, AlertCircle } from 'lucide-react';
import { HubbieMascot } from '../components/common/HubbieMascot';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      const respData = err.response?.data;
      if (respData?.data && typeof respData.data === 'object' && Object.keys(respData.data).length > 0) {
        setError(Object.values(respData.data).join(' • '));
      } else {
        setError(respData?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <HubbieMascot
            size={68}
            message={language === 'vi' ? 'Chào bạn! Đăng nhập để khám phá 1.470+ việc làm thêm nhé!' : 'Welcome back! Log in to explore 1,470+ student jobs!'}
          />
          <h2 className="auth-title" style={{ marginTop: '1rem' }}>{t('auth.loginTitle')}</h2>
          <p className="auth-subtitle">{t('auth.loginSubtitle')}</p>
        </div>

        {error && (
          <div className="auth-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="auth-label">{t('auth.email')}</label>
            <input
              type="email"
              required
              placeholder="nhap-email@vanlanguni.vn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
            />
          </div>

          <div>
            <label className="auth-label">{t('auth.password')}</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontWeight: 700, marginTop: '0.5rem' }}
          >
            <LogIn size={18} /> {loading ? t('auth.loggingIn') : t('auth.loginBtn')}
          </button>
        </form>

        <div className="auth-footer">
          {t('auth.noAccount')}
          <Link to="/register">{t('auth.registerNow')}</Link>
        </div>
      </div>
    </div>
  );
};
