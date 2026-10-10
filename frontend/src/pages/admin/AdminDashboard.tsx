import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService, AdminStats } from '../../services/adminService';
import { 
  Shield, 
  Users, 
  Briefcase, 
  FileText, 
  Star, 
  ArrowRight, 
  UserCheck, 
  AlertTriangle,
  Activity,
  User as UserIcon
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getStats();
        setStats(data);
      } catch {
        // Fallback for demo
        setStats({
          totalUsers: 8,
          totalJobs: 12,
          totalApplications: 15,
          totalReviews: 6
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '1050px' }}>
      {/* Admin Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '2.5rem 2rem',
        color: 'white',
        marginBottom: '2.5rem',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Shield size={32} color="#a5b4fc" />
          </div>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(99, 102, 241, 0.3)', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.4rem', color: '#c7d2fe' }}>
              <Activity size={12} /> HỆ THỐNG QUẢN TRỊ ADMIN
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>Trung tâm điều hành nền tảng</h1>
            <p style={{ color: '#c7d2fe', fontSize: '0.9rem', margin: '0.35rem 0 0' }}>
              Chuyên đề tốt nghiệp 2 - Nhóm 8 • Nền tảng tuyển dụng sinh viên Freelance & Part-time
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/admin/profile" className="btn btn-secondary">
            <UserIcon size={16} /> Hồ sơ quản trị viên
          </Link>
          <Link to="/admin/users" className="btn btn-secondary">
            <Users size={16} /> Quản lý người dùng
          </Link>
          <Link to="/admin/jobs" className="btn btn-secondary">
            <Briefcase size={16} /> Quản lý việc làm
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2.5rem'
      }}>
        <div style={{
          background: 'var(--bg-card)',
          color: 'var(--text-main)',
          padding: '1.5rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Tổng người dùng</span>
            <div style={{ padding: '0.5rem', background: 'var(--primary-light)', borderRadius: 'var(--radius-md)', color: 'var(--primary)' }}>
              <Users size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {loading ? '...' : stats?.totalUsers}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            Sinh viên & Nhà tuyển dụng
          </div>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          color: 'var(--text-main)',
          padding: '1.5rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Tổng việc làm</span>
            <div style={{ padding: '0.5rem', background: '#dcfce7', borderRadius: 'var(--radius-md)', color: '#166534' }}>
              <Briefcase size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#16a34a' }}>
            {loading ? '...' : stats?.totalJobs}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            Part-time & Freelance
          </div>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          color: 'var(--text-main)',
          padding: '1.5rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Hồ sơ ứng tuyển</span>
            <div style={{ padding: '0.5rem', background: '#e0f2fe', borderRadius: 'var(--radius-md)', color: '#0369a1' }}>
              <FileText size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0284c7' }}>
            {loading ? '...' : stats?.totalApplications}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            Đơn CV đã được nộp
          </div>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          color: 'var(--text-main)',
          padding: '1.5rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Đánh giá & Review</span>
            <div style={{ padding: '0.5rem', background: '#fef3c7', borderRadius: 'var(--radius-md)', color: '#b45309' }}>
              <Star size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#d97706' }}>
            {loading ? '...' : stats?.totalReviews}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            Đánh giá 2 chiều uy tín
          </div>
        </div>
      </div>

      {/* Feature Navigation Modules */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <div style={{
          background: 'var(--bg-card)',
          color: 'var(--text-main)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          padding: '2rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.65rem', background: 'var(--primary-light)', borderRadius: 'var(--radius-md)', color: 'var(--primary)' }}>
              <UserCheck size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Quản lý người dùng</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Phân quyền, kích hoạt và khóa tài khoản</p>
            </div>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            Theo dõi toàn bộ danh sách tài khoản thuộc các nhóm quyền Sinh viên (ROLE_STUDENT), Nhà tuyển dụng (ROLE_EMPLOYER) và Quản trị viên (ROLE_ADMIN).
          </p>
          <Link to="/admin/users" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
            Truy cập quản lý người dùng <ArrowRight size={16} />
          </Link>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          color: 'var(--text-main)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          padding: '2rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.65rem', background: '#fee2e2', borderRadius: 'var(--radius-md)', color: '#b91c1c' }}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Kiểm duyệt việc làm</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Kiểm soát nội dung và bài đăng vi phạm</p>
            </div>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            Kiểm tra các tin tuyển dụng trên hệ thống, xóa bỏ các tin vi phạm quy chuẩn cộng đồng hoặc tin rác lừa đảo sinh viên.
          </p>
          <Link to="/admin/jobs" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
            Truy cập quản lý việc làm <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};
