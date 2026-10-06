import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { jobService } from '../../services/jobService';
import { Application } from '../../types';
import { FileText, CheckCircle2, Clock, Briefcase, User as UserIcon } from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const data = await jobService.getMyApplications();
        setApplications(data || []);
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const acceptedCount = applications.filter(a => a.status === 'ACCEPTED').length;
  const pendingCount = applications.filter(a => a.status === 'PENDING').length;

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      {/* Profile Header */}
      <div style={{
        background: 'white',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        padding: '2rem',
        marginBottom: '2rem',
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
            background: 'var(--primary-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)',
            fontWeight: 800,
            fontSize: '1.5rem'
          }}>
            {user?.fullName?.charAt(0) || 'S'}
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{user?.fullName}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user?.university || 'Trường Đại học Văn Lang'} • {user?.major || 'Sinh viên'}</p>
            <div style={{ marginTop: '0.4rem', display: 'flex', gap: '0.5rem' }}>
              <span className="badge badge-open">Sinh viên</span>
              {user?.skills && (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
                  Kỹ năng: {user.skills}
                </span>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/student/profile" className="btn btn-secondary">
            <UserIcon size={16} /> Chỉnh sửa hồ sơ
          </Link>
          <Link to="/jobs" className="btn btn-primary">
            <Briefcase size={16} /> Tìm việc mới
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Tổng đơn đã nộp</span>
            <FileText size={20} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{applications.length}</div>
        </div>

        <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Đã được nhận việc</span>
            <CheckCircle2 size={20} color="var(--success)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>{acceptedCount}</div>
        </div>

        <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Đang chờ phản hồi</span>
            <Clock size={20} color="var(--warning)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--warning)' }}>{pendingCount}</div>
        </div>
      </div>

      {/* Recent Applications Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Đơn ứng tuyển gần đây</h2>
        <Link to="/student/applications" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>
          Xem tất cả ({applications.length}) →
        </Link>
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Đang tải dữ liệu...</div>
        ) : applications.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)' }}>
              <tr>
                <th style={{ padding: '1rem' }}>Công việc</th>
                <th style={{ padding: '1rem' }}>Nhà tuyển dụng</th>
                <th style={{ padding: '1rem' }}>Ngày nộp</th>
                <th style={{ padding: '1rem' }}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {applications.slice(0, 5).map((app) => (
                <tr key={app.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>{app.job?.title || `Công việc #${app.jobId}`}</td>
                  <td style={{ padding: '1rem' }}>{app.job?.employer?.companyName || app.job?.employer?.fullName || 'Doanh nghiệp'}</td>
                  <td style={{ padding: '1rem' }}>{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('vi-VN') : 'Mới đây'}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      background: app.status === 'ACCEPTED' ? '#dcfce7' : app.status === 'REJECTED' ? '#fee2e2' : '#fef3c7',
                      color: app.status === 'ACCEPTED' ? '#15803d' : app.status === 'REJECTED' ? '#b91c1c' : '#b45309',
                      padding: '0.25rem 0.6rem',
                      borderRadius: '999px',
                      fontWeight: 700,
                      fontSize: '0.75rem'
                    }}>
                      {app.status === 'ACCEPTED' ? 'ĐÃ TRÚNG TUYỂN' : app.status === 'REJECTED' ? 'TỪ CHỐI' : 'ĐANG CHỜ DUYỆT'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p>Bạn chưa nộp đơn ứng tuyển nào.</p>
            <Link to="/jobs" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Khám phá việc làm ngay
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
