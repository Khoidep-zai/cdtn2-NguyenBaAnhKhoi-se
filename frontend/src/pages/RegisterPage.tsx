import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '3rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
      <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '2.5rem', width: '100%', maxWidth: '480px', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Tạo tài khoản mới</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Tham gia hệ sinh thái việc làm sinh viên Nhóm 8</p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.875rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem' }}>Bạn là:</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setRole('ROLE_STUDENT')}
                className={`btn ${role === 'ROLE_STUDENT' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.65rem' }}
              >
                Sinh viên tìm việc
              </button>
              <button
                type="button"
                onClick={() => setRole('ROLE_EMPLOYER')}
                className={`btn ${role === 'ROLE_EMPLOYER' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.65rem' }}
              >
                Nhà tuyển dụng
              </button>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem' }}>Họ và tên</label>
            <input
              type="text"
              required
              placeholder="Nguyễn Văn A"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem' }}>Số điện thoại</label>
            <input
              type="tel"
              placeholder="0912345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem' }}>Email</label>
            <input
              type="email"
              required
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem' }}>Mật khẩu (tối thiểu 6 ký tự)</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}
            />
          </div>

          {role === 'ROLE_STUDENT' ? (
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem' }}>Trường Đại học</label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}
              />
            </div>
          ) : (
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem' }}>Tên Công ty / Cửa hàng</label>
              <input
                type="text"
                required
                placeholder="The Coffee House, Studio Media..."
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}
              />
            </div>
          )}

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}>
            <UserPlus size={18} /> {loading ? 'Đang tạo tài khoản...' : 'Hoàn tất đăng ký'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Đã có tài khoản? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
};
