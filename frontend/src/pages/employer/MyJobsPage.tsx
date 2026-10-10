import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { Job } from '../../types';
import { 
  Briefcase, 
  Users, 
  PlusCircle, 
  Calendar, 
  DollarSign, 
  MapPin, 
  ExternalLink,
  Clock
} from 'lucide-react';

export const MyJobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await jobService.getMyPostedJobs();
      setJobs(data || []);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleStatusChange = async (jobId: number, newStatus: string) => {
    setUpdatingId(jobId);
    try {
      const updated = await jobService.updateJobStatus(jobId, newStatus);
      setJobs(prev => prev.map(j => (j.id === jobId ? { ...j, status: updated.status } : j)));
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredJobs = jobs.filter(j => {
    if (selectedFilter === 'ALL') return true;
    return j.status === selectedFilter;
  });

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '1050px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            Quản lý tin tuyển dụng
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Theo dõi trạng thái các bài đăng, quản lý ứng viên và tiến độ công việc.
          </p>
        </div>
        <Link to="/employer/post-job" className="btn btn-primary">
          <PlusCircle size={18} /> Đăng việc mới
        </Link>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '0.75rem',
        overflowX: 'auto'
      }}>
        {[
          { key: 'ALL', label: 'Tất cả', count: jobs.length },
          { key: 'OPEN', label: 'Đang mở (OPEN)', count: jobs.filter(j => j.status === 'OPEN').length },
          { key: 'IN_PROGRESS', label: 'Đang tiến hành', count: jobs.filter(j => j.status === 'IN_PROGRESS').length },
          { key: 'COMPLETED', label: 'Đã hoàn thành', count: jobs.filter(j => j.status === 'COMPLETED').length },
          { key: 'CLOSED', label: 'Đã đóng', count: jobs.filter(j => j.status === 'CLOSED').length },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setSelectedFilter(tab.key)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: selectedFilter === tab.key ? 'var(--primary)' : 'transparent',
              color: selectedFilter === tab.key ? 'white' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.15s ease'
            }}
          >
            <span>{tab.label}</span>
            <span style={{
              background: selectedFilter === tab.key ? 'rgba(255,255,255,0.2)' : 'var(--bg-main)',
              padding: '0.1rem 0.45rem',
              borderRadius: '9999px',
              fontSize: '0.75rem'
            }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Job List */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>Đang tải danh sách bài đăng...</p>
      ) : filteredJobs.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          background: 'var(--bg-card)',
          color: 'var(--text-main)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <Briefcase size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Không tìm thấy tin đăng nào</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {selectedFilter === 'ALL'
              ? 'Bạn chưa đăng tin tuyển dụng nào. Hãy bắt đầu ngay hôm nay!'
              : `Chưa có bài đăng nào ở trạng thái "${selectedFilter}".`}
          </p>
          <Link to="/employer/post-job" className="btn btn-primary">
            <PlusCircle size={16} /> Đăng bài ngay
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredJobs.map(job => (
            <div
              key={job.id}
              style={{
                background: 'var(--bg-card)',
                color: 'var(--text-main)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <Link
                      to={`/jobs/${job.id}`}
                      style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', textDecoration: 'none' }}
                    >
                      {job.title}
                    </Link>
                    <span className={`badge ${
                      job.status === 'OPEN' ? 'badge-open' :
                      job.status === 'IN_PROGRESS' ? 'badge-featured' :
                      job.status === 'COMPLETED' ? 'badge-parttime' : 'badge-freelance'
                    }`}>
                      {job.status}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Calendar size={14} /> Ngày đăng: {new Date(job.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                    {job.deadline && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={14} /> Hạn chót: {new Date(job.deadline).toLocaleDateString('vi-VN')}
                      </span>
                    )}
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#16a34a', fontWeight: 600 }}>
                      <DollarSign size={14} /> {job.salaryAmount?.toLocaleString()} VNĐ ({job.salaryType})
                    </span>
                    {job.location && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <MapPin size={14} /> {job.location} ({job.workMode})
                      </span>
                    )}
                    <span>Số lượng: {job.slotsAvailable} chỉ tiêu</span>
                  </div>
                </div>

                {/* Status Switcher Select */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Trạng thái:</label>
                  <select
                    value={job.status}
                    disabled={updatingId === job.id}
                    onChange={(e) => handleStatusChange(job.id, e.target.value)}
                    style={{
                      padding: '0.4rem 0.65rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      background: 'var(--bg-card-subtle)',
                      color: 'var(--text-main)',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="OPEN">OPEN (Đang nhận CV)</option>
                    <option value="IN_PROGRESS">IN_PROGRESS (Đang làm)</option>
                    <option value="COMPLETED">COMPLETED (Hoàn thành)</option>
                    <option value="CLOSED">CLOSED (Đóng tin)</option>
                  </select>
                </div>
              </div>

              {/* Bottom Actions Toolbar */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--border-color)',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  Hình thức: <strong>{job.jobType}</strong> • Ngành: <strong>{job.category?.name || 'Khác'}</strong>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link
                    to={`/jobs/${job.id}`}
                    className="btn btn-secondary"
                    style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
                  >
                    <ExternalLink size={14} /> Xem bài đăng
                  </Link>
                  <Link
                    to={`/employer/jobs/${job.id}/applicants`}
                    className="btn btn-primary"
                    style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
                  >
                    <Users size={15} /> Quản lý ứng viên
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
