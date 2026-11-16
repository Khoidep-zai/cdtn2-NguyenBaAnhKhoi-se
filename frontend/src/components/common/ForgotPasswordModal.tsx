import React, { useState, useEffect, useRef } from 'react';
import { X, KeyRound, CheckCircle2, AlertCircle, Mail, RotateCw } from 'lucide-react';
import { authService } from '../../services/authService';
import { useLanguage } from '../../context/LanguageContext';
import { PasswordInput } from './PasswordInput';
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
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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

  const handleRequestToken = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await authService.forgotPassword(email.trim());
      setMessage(
        language === 'vi'
          ? `Mã xác thực OTP gồm 6 chữ số đã được gửi đến email ${email.trim()}. Vui lòng kiểm tra hộp thư đến (hoặc hòm thư rác/spam) và nhập mã bên dưới.`
          : `A 6-digit verification code has been sent to ${email.trim()}. Please check your email inbox (including spam) and enter the code below.`
      );
      setToken('');
      setStep('RESET');
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          (language === 'vi'
            ? 'Có lỗi xảy ra khi gửi yêu cầu. Vui lòng kiểm tra lại email hoặc thử lại sau.'
            : 'An error occurred. Please check your email or try again later.')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email.trim() || resending) return;
    setError('');
    setMessage('');
    setResending(true);

    try {
      await authService.forgotPassword(email.trim());
      setMessage(
        language === 'vi'
          ? `Mã OTP mới đã được gửi lại thành công đến email ${email.trim()}. Vui lòng kiểm tra hộp thư.`
          : `A new OTP code has been resent to ${email.trim()}. Please check your inbox.`
      );
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          (language === 'vi' ? 'Không thể gửi lại mã OTP lúc này.' : 'Could not resend OTP code right now.')
      );
    } finally {
      setResending(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!token.trim()) {
      setError(
        language === 'vi'
          ? 'Vui lòng nhập mã xác thực OTP gồm 6 chữ số từ email'
          : 'Please enter the 6-digit OTP code from your email'
      );
      return;
    }

    if (newPassword.length < 6) {
      setError(
        language === 'vi' ? 'Mật khẩu mới phải có ít nhất 6 ký tự' : 'Password must be at least 6 characters'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(language === 'vi' ? 'Xác nhận mật khẩu không khớp' : 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(token.trim(), newPassword);
      setMessage(
        language === 'vi'
          ? 'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới.'
          : 'Password reset successful! You can now log in with your new password.'
      );
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 1500);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          (language === 'vi' ? 'Mã xác thực OTP không chính xác hoặc đã hết hạn.' : 'Invalid or expired OTP token.')
      );
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

      {/* Header */}
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
            ? 'Nhập địa chỉ email đăng ký tài khoản để nhận mã xác thực OTP đặt lại mật khẩu.'
            : 'Enter your registered email address to receive a password reset OTP code.'
          : language === 'vi'
          ? 'Nhập mã xác thực OTP nhận được từ email và đặt mật khẩu mới của bạn.'
          : 'Enter the verification OTP received in your email and set your new password.'}
      </p>

      {/* Error Banner */}
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
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {/* Success Notification */}
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
          <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
          <span>{message}</span>
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
              placeholder="nhap-email@vanlanguni.vn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              autoFocus
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-secondary"
              style={{ padding: '0.65rem 1.25rem' }}
            >
              {language === 'vi' ? 'Đóng' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ padding: '0.65rem 1.25rem' }}
            >
              {loading
                ? language === 'vi'
                  ? 'Đang gửi...'
                  : 'Sending...'
                : language === 'vi'
                ? 'Gửi mã xác thực OTP'
                : 'Send Verification OTP'}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Email Delivery Instruction Banner */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.65rem',
              padding: '0.75rem 0.9rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              fontSize: '0.825rem',
              color: 'var(--text-main)',
              lineHeight: 1.5,
            }}
          >
            <Mail size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
            <div>
              {language === 'vi' ? (
                <>
                  Hệ thống đã gửi thư chứa <strong>mã OTP gồm 6 chữ số</strong> đến hộp thư: <strong>{email}</strong>. Vui lòng mở email để lấy mã (kiểm tra cả mục Spam nếu chưa thấy).
                </>
              ) : (
                <>
                  A <strong>6-digit OTP code</strong> has been sent to your email: <strong>{email}</strong>. Please check your inbox or spam folder.
                </>
              )}
            </div>
          </div>

          {/* OTP Token Input */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              {language === 'vi' ? 'Mã xác thực OTP (6 chữ số từ email)' : '6-digit OTP Verification Code'}
            </label>
            <input
              type="text"
              required
              maxLength={8}
              placeholder={language === 'vi' ? 'Nhập mã 6 chữ số (VD: 849171)' : 'Enter 6-digit code (e.g. 849171)'}
              value={token}
              onChange={(e) => setToken(e.target.value.trim())}
              className="auth-input"
              style={{
                letterSpacing: '2px',
                fontWeight: 600,
                fontSize: '1rem',
              }}
              autoFocus
            />
          </div>

          {/* New Password */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              {language === 'vi' ? 'Mật khẩu mới' : 'New Password'}
            </label>
            <PasswordInput
              required
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              {language === 'vi' ? 'Xác nhận mật khẩu mới' : 'Confirm New Password'}
            </label>
            <PasswordInput
              required
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          {/* Actions & Resend */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resending}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontSize: '0.825rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.25rem 0',
                textDecoration: 'underline',
              }}
            >
              <RotateCw size={13} className={resending ? 'spin' : ''} />
              <span>{resending ? (language === 'vi' ? 'Đang gửi lại...' : 'Resending...') : (language === 'vi' ? 'Gửi lại mã OTP' : 'Resend OTP')}</span>
            </button>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setStep('REQUEST')}
                className="btn btn-secondary"
                style={{ padding: '0.65rem 1.25rem' }}
              >
                {language === 'vi' ? 'Quay lại' : 'Back'}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ padding: '0.65rem 1.25rem' }}
              >
                {loading
                  ? language === 'vi'
                    ? 'Đang xử lý...'
                    : 'Processing...'
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
