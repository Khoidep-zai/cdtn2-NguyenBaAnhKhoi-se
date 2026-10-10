import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { jobService } from '../../services/jobService';
import { Job } from '../../types';
import { 
  Briefcase, 
  Users, 
  CheckCircle2, 
  Clock, 
  PlusCircle, 
  ArrowRight, 
  Building2,
  Calendar,
  DollarSign,
  User as UserIcon
} from 'lucide-react';

export const EmployerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployerData = async () => {
      try {
        const data = await jobService.getMyPostedJobs();
        setJobs(data || []);
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    };
    fetchEmployerData();
  }, []);

  const totalJobs = jobs.length;
  const openJobs = jobs.filter(j => j.status === 'OPEN').length;
  const inProgressJobs = jobs.filter(j => j.status === 'IN_PROGRESS').length;
  const completedJobs = jobs.filter(j => j.status === 'COMPLETED').length;

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      {/* Employer Profile Header */}
      <div style={{
        background: 'var(--bg-card)',
        color: 'var(--text-main)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        padding: '2rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        boxShadow: 'var(--shadow-sm)'
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
            <Building2 size={32} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {user?.companyName || user?.fullName}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Người phụ trách: {user?.fullName} • {user?.email}
            </p>
            <div style={{ marginTop: '0.4rem', display: 'flex', gap: '0.5rem' }}>
              <span className="badge badge-featured">Nhà tuyển dụng xác thực</span>
              {user?.companyAddress && (
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
                  {user.companyAddress}
                </span>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/employer/profile" className="btn btn-secondary">
            <UserIcon size={18} /> Chỉnh sửa hồ sơ
          </Link>
          <Link to="/employer/post-job" className="btn btn-primary">
            <PlusCircle size={18} /> Đăng tin tuyển dụng
          </Link>
          <Link to="/employer/my-jobs" className="btn btn-secondary">
            <Briefcase size={18} /> Quản lý tin đăng
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
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
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Tổng tin đăng</span>
            <div style={{ padding: '0.5rem', background: 'var(--primary-light)', borderRadius: 'var(--radius-md)', color: 'var(--primary)' }}>
              <Briefcase size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>{totalJobs}</div>
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
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Đang mở tuyển (OPEN)</span>
            <div style={{ padding: '0.5rem', background: '#dcfce7', borderRadius: 'var(--radius-md)', color: '#166534' }}>
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#16a34a' }}>{openJobs}</div>
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
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Đang thực hiện</span>
            <div style={{ padding: '0.5rem', background: '#e0f2fe', borderRadius: 'var(--radius-md)', color: '#0369a1' }}>
              <Clock size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0284c7' }}>{inProgressJobs}</div>
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
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Đã hoàn thành</span>
            <div style={{ padding: '0.5rem', background: '#f3e8ff', borderRadius: 'var(--radius-md)', color: '#7e22ce' }}>
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#9333ea' }}>{completedJobs}</div>
        </div>
      </div>

      {/* Recent Posted Jobs Section */}
      <div style={{
        background: 'var(--bg-card)',
        color: 'var(--text-main)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        padding: '2rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Danh sách tin tuyển dụng gần đây</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Theo dõi các công việc và lượng hồ sơ sinh viên nộp vào</p>
          </div>
          <Link to="/employer/my-jobs" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>
            Xem toàn bộ <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>Đang tải tin tuyển dụng...</p>
        ) : jobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <Briefcase size={40} style={{ color: 'var(--text-muted)', opacity: 0.4, margin: '0 auto 0.75rem' }} />
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Bạn chưa đăng tin tuyển dụng nào.</p>
            <Link to="/employer/post-job" className="btn btn-primary">
              <PlusCircle size={16} /> Đăng tin đầu tiên
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {jobs.slice(0, 5).map(job => (
              <div
                key={job.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1.25rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  background: 'var(--bg-main)'
                }}
              >
                <div>
                  <Link
                    to={`/jobs/${job.id}`}
                    style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', textDecoration: 'none' }}
                  >
                    {job.title}
                  </Link>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.35rem', color: 'var(--text-muted)', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Calendar size={14} /> {new Date(job.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#16a34a', fontWeight: 600 }}>
                      <DollarSign size={14} /> {job.salaryAmount?.toLocaleString()} VNĐ
                    </span>
                    <span>Chỉ tiêu: {job.slotsAvailable} sinh viên</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <span className={`badge ${
                    job.status === 'OPEN' ? 'badge-open' :
                    job.status === 'IN_PROGRESS' ? 'badge-featured' :
                    job.status === 'COMPLETED' ? 'badge-parttime' : 'badge-freelance'
                  }`}>
                    {job.status}
                  </span>

                  <Link
                    to={`/employer/jobs/${job.id}/applicants`}
                    className="btn btn-primary"
                    style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
                  >
                    <Users size={16} /> Xem ứng viên
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
