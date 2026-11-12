import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LogIn, AlertCircle, Fingerprint } from 'lucide-react';
import { HubbieMascot } from '../components/common/HubbieMascot';
import { ForgotPasswordModal } from '../components/common/ForgotPasswordModal';
import { passkeyService } from '../services/passkeyService';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const { login, loginWithAuthResponse } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');

  const handlePasskeyLogin = async () => {
    if (!email.trim()) {
      setError(language === 'vi' ? 'Vui lòng nhập Email để đăng nhập bằng Passkey' : 'Please enter your email to login with Passkey');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const authRes = await passkeyService.loginWithPasskey(email.trim());
      loginWithAuthResponse(authRes);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Đăng nhập bằng Passkey không thành công');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      if (redirect && redirect.startsWith('/')) {
        navigate(redirect, { replace: true });
      } else {
        navigate('/dashboard');
      }
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

        {successMsg && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(16, 185, 129, 0.1)',
              color: '#059669',
              fontSize: '0.875rem',
              marginBottom: '1rem',
            }}
          >
            <span>{successMsg}</span>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label className="auth-label" style={{ margin: 0 }}>{t('auth.password')}</label>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                {language === 'vi' ? 'Quên mật khẩu?' : 'Forgot password?'}
              </button>
            </div>
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

          {/* Passkey / WebAuthn passwordless login button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0.25rem 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{language === 'vi' ? 'HOẶC' : 'OR'}</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={handlePasskeyLogin}
            className="btn btn-secondary"
            style={{
              width: '100%',
              padding: '0.8rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              border: '1px solid var(--border-color)'
            }}
          >
            <Fingerprint size={18} color="var(--primary)" />
            <span>{language === 'vi' ? 'Đăng nhập bằng Passkey (Face ID / Vân tay)' : 'Sign in with Passkey'}</span>
          </button>
        </form>

        <div className="auth-footer">
          {t('auth.noAccount')}
          <Link to={redirect ? `/register?redirect=${encodeURIComponent(redirect)}` : '/register'}>
            {t('auth.registerNow')}
          </Link>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        onSuccess={() => {
          setSuccessMsg(
            language === 'vi'
              ? 'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới.'
              : 'Password reset successful! You can now log in with your new password.'
          );
        }}
      />
    </div>
  );
};
