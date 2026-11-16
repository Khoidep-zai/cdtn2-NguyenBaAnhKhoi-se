import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  containerClassName?: string;
  containerStyle?: React.CSSProperties;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  containerClassName = '',
  containerStyle,
  className = 'auth-input',
  style,
  placeholder = '••••••••',
  ...restProps
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { t } = useLanguage();

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowPassword((prev) => !prev);
    setIsAnimating(true);
  };

  return (
    <div className={`password-input-container ${containerClassName}`} style={containerStyle}>
      <input
        {...restProps}
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        className={className}
        style={style}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={handleToggle}
        className={`password-eye-btn ${showPassword ? 'is-visible' : ''}`}
        title={showPassword ? t('auth.hidePassword', 'Ẩn mật khẩu') : t('auth.showPassword', 'Hiện mật khẩu')}
        aria-label={showPassword ? t('auth.hidePassword', 'Ẩn mật khẩu') : t('auth.showPassword', 'Hiện mật khẩu')}
      >
        <span
          className={isAnimating ? 'password-eye-icon-animate' : ''}
          onAnimationEnd={() => setIsAnimating(false)}
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
        </span>
      </button>
    </div>
  );
};
