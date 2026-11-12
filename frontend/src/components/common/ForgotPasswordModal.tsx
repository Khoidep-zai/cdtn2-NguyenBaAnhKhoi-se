import React, { useState, useEffect, useRef } from 'react';
import { X, KeyRound, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { authService } from '../../services/authService';
import { useLanguage } from '../../context/LanguageContext';
import './ModernDialog.css';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { language } = useLanguage();
  const [step, setStep] = useState<'REQUEST' | 'RESET'>('REQUEST');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [devTokenNotice, setDevTokenNotice] = useState<string | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  const handleRequestToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await authService.forgotPassword(email.trim());
      setMessage(
        language === 'vi'
          ? 'Nếu email tồn tại trong hệ thống, mã xác thực đặt lại mật khẩu đã được tạo. Vui lòng nhập mã và mật khẩu mới bên dưới.'
          : 'If your email is registered, a password reset token has been generated. Please enter your token and new password.'
      );
      if (res?.resetTokenPreview) {
        setToken(res.resetTokenPreview);
        setDevTokenNotice(res.resetTokenPreview);
      }
      setStep('RESET');
    } catch (err: any) {
      setError(err.response?.data?.message || (language === 'vi' ? 'Có lỗi xảy ra, vui lòng thử lại sau.' : 'An error occurred. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword.length < 6) {
      setError(language === 'vi' ? 'Mật khẩu mới phải có ít nhất 6 ký tự' : 'Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(language === 'vi' ? 'Xác nhận mật khẩu không khớp' : 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(token.trim(), newPassword);
      setMessage(language === 'vi' ? 'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay.' : 'Password reset successful! You can now log in.');
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || (language === 'vi' ? 'Mã xác thực không hợp lệ hoặc đã hết hạn.' : 'Invalid or expired token.'));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('REQUEST');
    setEmail('');
    setToken('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setMessage('');
    setDevTokenNotice(null);
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      className="modern-dialog"
      onCancel={(e) => {
        e.preventDefault();
        handleClose();
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) {
          handleClose();
        }
      }}
    >
      <button
        type="button"
        className="modern-dialog-close-btn"
        onClick={handleClose}
        aria-label="Đóng"
      >
        <X size={20} />
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
        <div
          style={{
            padding: '0.5rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(59, 130, 246, 0.1)',
            color: 'var(--primary)',
          }}
        >
          <KeyRound size={22} />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
          {language === 'vi' ? 'Quên mật khẩu' : 'Forgot Password'}
        </h3>
      </div>

      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
        {step === 'REQUEST'
          ? language === 'vi'
            ? 'Nhập địa chỉ email đăng ký tài khoản để nhận mã xác thực đặt lại mật khẩu.'
            : 'Enter your registered email to receive a password reset token.'
          : language === 'vi'
          ? 'Nhập mã token xác thực và mật khẩu mới của bạn.'
          : 'Enter the verification token and your new password.'}
      </p>

      {error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444',
            fontSize: '0.85rem',
            marginBottom: '1rem',
          }}
        >
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {message && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(16, 185, 129, 0.1)',
            color: '#059669',
            fontSize: '0.85rem',
            marginBottom: '1rem',
          }}
        >
          <CheckCircle2 size={16} />
          <span>{message}</span>
        </div>
      )}

      {devTokenNotice && (
        <div
          style={{
            padding: '0.65rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px dashed #d97706',
            fontSize: '0.8rem',
            color: 'var(--text-main)',
            marginBottom: '1rem',
          }}
        >
          <div style={{ fontWeight: 600, color: '#d97706', marginBottom: '0.2rem' }}>
            <ShieldCheck size={14} style={{ display: 'inline', marginRight: '4px' }} />
            {language === 'vi' ? 'Mã xác thực thử nghiệm (Dev preview):' : 'Test Reset Token:'}
          </div>
          <code style={{ wordBreak: 'break-all', fontSize: '0.78rem', color: 'var(--text-main)' }}>{devTokenNotice}</code>
        </div>
      )}

      {step === 'REQUEST' ? (
        <form onSubmit={handleRequestToken} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Email
            </label>
            <input
              type="email"
              required
              placeholder="sinhvien@vanlanguni.vn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-main)',
                color: 'var(--text-main)',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-secondary"
              style={{ padding: '0.65rem 1.25rem' }}
            >
              {language === 'vi' ? 'Hủy' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ padding: '0.65rem 1.5rem', fontWeight: 600 }}
            >
              {loading
                ? language === 'vi'
                  ? 'Đang gửi...'
                  : 'Sending...'
                : language === 'vi'
                ? 'Gửi yêu cầu'
                : 'Send Request'}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              {language === 'vi' ? 'Mã xác thực (Token)' : 'Reset Token'}
            </label>
            <input
              type="text"
              required
              placeholder="VD: 9f8b4c2a-..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-main)',
                color: 'var(--text-main)',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              {language === 'vi' ? 'Mật khẩu mới' : 'New Password'}
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-main)',
                color: 'var(--text-main)',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              {language === 'vi' ? 'Xác nhận mật khẩu mới' : 'Confirm New Password'}
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-main)',
                color: 'var(--text-main)',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setStep('REQUEST')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              {language === 'vi' ? 'Gửi lại mã' : 'Request another token'}
            </button>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={handleClose}
                className="btn btn-secondary"
                style={{ padding: '0.65rem 1.25rem' }}
              >
                {language === 'vi' ? 'Đóng' : 'Close'}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ padding: '0.65rem 1.5rem', fontWeight: 600 }}
              >
                {loading
                  ? language === 'vi'
                    ? 'Đang lưu...'
                    : 'Saving...'
                  : language === 'vi'
                  ? 'Đặt lại mật khẩu'
                  : 'Reset Password'}
              </button>
            </div>
          </div>
        </form>
      )}
    </dialog>
  );
};
