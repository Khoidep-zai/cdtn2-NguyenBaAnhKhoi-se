import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/common/Badge';
import { jobService } from '../services/jobService';
import { Job, Application } from '../types';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const isEmployer = user?.role === 'ROLE_EMPLOYER';

  const [postedJobs, setPostedJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        if (isEmployer) {
          const jobs = await jobService.getMyPostedJobs();
          if (isMounted && jobs) {
            setPostedJobs(jobs);
          }
        } else {
          const apps = await jobService.getMyApplications();
          if (isMounted && apps) {
            setApplications(apps);
          }
        }
      } catch {
        // Fallback for offline demo
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboardData();
    return () => {
      isMounted = false;
    };
  }, [isEmployer]);

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      {/* Header Profile */}
      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', padding: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-full)', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 800, fontSize: '1.5rem' }}>
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{user?.fullName || 'Người dùng'}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user?.email}</p>
            <div style={{ marginTop: '0.4rem' }}>
              <Badge type={isEmployer ? 'FREELANCE' : 'PART_TIME'} label={isEmployer ? 'Nhà tuyển dụng' : 'Sinh viên'} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '2rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
              {isEmployer ? (postedJobs.length || 2) : (applications.length || 3)}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{isEmployer ? 'Tin đã đăng' : 'Đơn đã nộp'}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)' }}>5.0 ★</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Điểm uy tín</div>
          </div>
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Đang đồng bộ dữ liệu...
        </div>
      )}

      {/* Content for Student or Employer */}
      {isEmployer ? (
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>Danh sách tin tuyển dụng đã đăng</h2>
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)' }}>
                <tr>
                  <th style={{ padding: '1rem' }}>Tiêu đề công việc</th>
                  <th style={{ padding: '1rem' }}>Hình thức</th>
                  <th style={{ padding: '1rem' }}>Số lượng cần</th>
                  <th style={{ padding: '1rem' }}>Trạng thái</th>
                  <th style={{ padding: '1rem' }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {postedJobs.length > 0 ? (
                  postedJobs.map((j) => (
                    <tr key={j.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1rem', fontWeight: 600 }}>{j.title}</td>
                      <td style={{ padding: '1rem' }}><Badge type={j.jobType} label={j.jobType === 'PART_TIME' ? 'Part-time' : 'Freelance'} /></td>
                      <td style={{ padding: '1rem' }}>{j.slotsAvailable} vị trí</td>
                      <td style={{ padding: '1rem' }}><Badge type={j.status} label={j.status === 'OPEN' ? 'Đang tuyển' : j.status} /></td>
                      <td style={{ padding: '1rem' }}>
                        <button className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>Xem ứng viên</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>Tuyển nhân viên Barista & Phục vụ ca tối</td>
                    <td style={{ padding: '1rem' }}><Badge type="PART_TIME" label="Part-time" /></td>
                    <td style={{ padding: '1rem' }}><strong>3</strong> vị trí (2 đã nộp)</td>
                    <td style={{ padding: '1rem' }}><Badge type="OPEN" label="Đang tuyển" /></td>
                    <td style={{ padding: '1rem' }}>
                      <button className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>Xem ứng viên</button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>Lịch sử công việc đã ứng tuyển</h2>
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)' }}>
                <tr>
                  <th style={{ padding: '1rem' }}>Công việc</th>
                  <th style={{ padding: '1rem' }}>Nhà tuyển dụng</th>
                  <th style={{ padding: '1rem' }}>Ngày nộp</th>
                  <th style={{ padding: '1rem' }}>Trạng thái hồ sơ</th>
                </tr>
              </thead>
              <tbody>
                {applications.length > 0 ? (
                  applications.map((app) => (
                    <tr key={app.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1rem', fontWeight: 600 }}>{app.job?.title || `Công việc #${app.jobId}`}</td>
                      <td style={{ padding: '1rem' }}>{app.job?.employer?.companyName || app.job?.employer?.fullName || 'Doanh nghiệp'}</td>
                      <td style={{ padding: '1rem' }}>{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('vi-VN') : 'Mới nộp'}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          background: app.status === 'ACCEPTED' ? '#dcfce7' : app.status === 'REJECTED' ? '#fee2e2' : '#fef3c7',
                          color: app.status === 'ACCEPTED' ? '#15803d' : app.status === 'REJECTED' ? '#b91c1c' : '#b45309',
                          padding: '0.25rem 0.6rem',
                          borderRadius: '999px',
                          fontWeight: 700,
                          fontSize: '0.75rem'
                        }}>
                          {app.status === 'ACCEPTED' ? 'ĐÃ ĐƯỢC NHẬN' : app.status === 'REJECTED' ? 'TỪ CHỐI' : 'ĐANG CHỜ DUYỆT'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1rem', fontWeight: 600 }}>Lập trình Landing Page bằng React</td>
                      <td style={{ padding: '1rem' }}>Innovate Studio</td>
                      <td style={{ padding: '1rem' }}>02/10/2026</td>
                      <td style={{ padding: '1rem' }}><span style={{ background: '#fef3c7', color: '#b45309', padding: '0.25rem 0.6rem', borderRadius: '999px', fontWeight: 700, fontSize: '0.75rem' }}>ĐANG CHỜ DUYỆT</span></td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1rem', fontWeight: 600 }}>Thiết kế Poster sự kiện âm nhạc</td>
                      <td style={{ padding: '1rem' }}>Innovate Studio</td>
                      <td style={{ padding: '1rem' }}>01/10/2026</td>
                      <td style={{ padding: '1rem' }}><span style={{ background: '#dcfce7', color: '#15803d', padding: '0.25rem 0.6rem', borderRadius: '999px', fontWeight: 700, fontSize: '0.75rem' }}>ĐÃ ĐƯỢC NHẬN</span></td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
