import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { UserPlus, AlertCircle } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [role, setRole] = useState<'ROLE_STUDENT' | 'ROLE_EMPLOYER'>('ROLE_STUDENT');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [university, setUniversity] = useState('Trường ĐH Văn Lang');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Mật khẩu phải có tối thiểu 6 ký tự!');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await register({
        email,
        password,
        fullName,
        phone,
        role,
        university: role === 'ROLE_STUDENT' ? university : undefined,
        companyName: role === 'ROLE_EMPLOYER' ? companyName : undefined,
      });
      navigate('/dashboard');
    } catch (err: any) {
      const respData = err.response?.data;
      if (respData?.data && typeof respData.data === 'object' && Object.keys(respData.data).length > 0) {
        setError(Object.values(respData.data).join(' • '));
      } else {
        setError(respData?.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">{t('auth.registerTitle')}</h2>
          <p className="auth-subtitle">{t('auth.registerSubtitle')}</p>
        </div>

        {error && (
          <div className="auth-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div>
            <label className="auth-label">{t('auth.roleLabel')}</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setRole('ROLE_STUDENT')}
                className={`auth-role-btn ${role === 'ROLE_STUDENT' ? 'active' : ''}`}
              >
                🎓 {t('auth.roleStudent')}
              </button>
              <button
                type="button"
                onClick={() => setRole('ROLE_EMPLOYER')}
                className={`auth-role-btn ${role === 'ROLE_EMPLOYER' ? 'active' : ''}`}
              >
                🏢 {t('auth.roleEmployer')}
              </button>
            </div>
          </div>

          <div>
            <label className="auth-label">{t('auth.fullName')}</label>
            <input
              type="text"
              required
              placeholder="Nguyễn Văn A"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="auth-input"
            />
          </div>

          <div>
            <label className="auth-label">{t('auth.phone')}</label>
            <input
              type="tel"
              placeholder="0912345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="auth-input"
            />
          </div>

          <div>
            <label className="auth-label">{t('auth.email')}</label>
            <input
              type="email"
              required
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
            />
          </div>

          <div>
            <label className="auth-label">{t('auth.passwordMin')}</label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
            />
          </div>

          {role === 'ROLE_STUDENT' ? (
            <div>
              <label className="auth-label">{t('auth.university')}</label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="auth-input"
              />
            </div>
          ) : (
            <div>
              <label className="auth-label">{t('auth.companyName')}</label>
              <input
                type="text"
                required
                placeholder="The Coffee House, Studio Media..."
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="auth-input"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontWeight: 700, marginTop: '0.5rem' }}
          >
            <UserPlus size={18} /> {loading ? t('auth.registering') : t('auth.registerBtn')}
          </button>
        </form>

        <div className="auth-footer">
          {t('auth.hasAccount')}
          <Link to="/login">{t('auth.loginNow')}</Link>
        </div>
      </div>
    </div>
  );
};
