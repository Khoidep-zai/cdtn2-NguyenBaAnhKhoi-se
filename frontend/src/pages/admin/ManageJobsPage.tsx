import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { adminService } from '../../services/adminService';
import { Job } from '../../types';
import { 
  ArrowLeft, 
  Search, 
  Trash2, 
  ExternalLink, 
  RefreshCw 
} from 'lucide-react';

export const ManageJobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await jobService.getJobs({ size: 100 });
      setJobs(res.content || []);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (jobId: number) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa tin việc làm #${jobId}? Hành động này không thể hoàn tác.`)) {
      return;
    }
    setDeletingId(jobId);
    try {
      await adminService.deleteJob(jobId);
      setJobs(prev => prev.filter(j => j.id !== jobId));
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Có lỗi xảy ra khi xóa tin việc làm');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredJobs = jobs.filter(j => {
    const matchesSearch = 
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (j.employer?.companyName || j.employer?.fullName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || j.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '1100px' }}>
      <Link
        to="/admin/dashboard"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: 'var(--text-muted)',
          textDecoration: 'none',
          marginBottom: '1.5rem',
          fontWeight: 600,
          fontSize: '0.9rem'
        }}
      >
        <ArrowLeft size={16} /> Quay lại bảng điều khiển Admin
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
            Kiểm duyệt & Quản lý việc làm
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Kiểm tra toàn bộ tin tuyển dụng, loại bỏ tin sai phạm hoặc lừa đảo sinh viên.
          </p>
        </div>
        <button onClick={fetchJobs} className="btn btn-secondary" style={{ padding: '0.45rem 0.85rem' }}>
          <RefreshCw size={15} /> Làm mới
        </button>
      </div>

      {/* Search and Filters */}
      <div style={{
        background: 'var(--bg-card)',
        color: 'var(--text-main)',
        padding: '1.25rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        marginBottom: '1.5rem',
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        alignItems: 'center',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Tìm theo tiêu đề hoặc nhà tuyển dụng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 0.85rem 0.6rem 2.25rem',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              outline: 'none',
              fontSize: '0.9rem'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Trạng thái:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '0.6rem 0.85rem',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              outline: 'none',
              background: 'var(--bg-card-subtle)',
              color: 'var(--text-main)'
            }}
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="OPEN">OPEN (Đang mở)</option>
            <option value="IN_PROGRESS">IN_PROGRESS (Đang làm)</option>
            <option value="COMPLETED">COMPLETED (Hoàn thành)</option>
            <option value="CLOSED">CLOSED (Đóng tin)</option>
          </select>
        </div>
      </div>

      {/* Jobs Table */}
      <div style={{
        background: 'var(--bg-card)',
        color: 'var(--text-main)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)'
      }}>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>Đang tải danh sách việc làm...</p>
        ) : filteredJobs.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>Không tìm thấy việc làm phù hợp.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.85rem 1rem' }}>ID</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Tiêu đề việc làm</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Nhà tuyển dụng</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Mức lương</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Trạng thái</th>
                  <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map(job => (
                  <tr key={job.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>#{job.id}</td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{job.title}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {job.category?.name} • {job.jobType}
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 600 }}>{job.employer?.companyName || job.employer?.fullName}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{job.employer?.fullName}</div>
                    </td>
                    <td style={{ padding: '1rem', color: '#16a34a', fontWeight: 600 }}>
                      {job.salaryAmount?.toLocaleString()} VNĐ
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span className={`badge ${
                        job.status === 'OPEN' ? 'badge-open' :
                        job.status === 'IN_PROGRESS' ? 'badge-featured' :
                        job.status === 'COMPLETED' ? 'badge-parttime' : 'badge-freelance'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <Link
                          to={`/jobs/${job.id}`}
                          className="btn btn-secondary"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                        >
                          <ExternalLink size={14} /> Xem
                        </Link>
                        <button
                          onClick={() => handleDelete(job.id)}
                          disabled={deletingId === job.id}
                          className="btn btn-secondary"
                          style={{
                            padding: '0.35rem 0.65rem',
                            fontSize: '0.8rem',
                            color: '#b91c1c',
                            borderColor: '#fca5a5'
                          }}
                        >
                          <Trash2 size={14} /> Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
