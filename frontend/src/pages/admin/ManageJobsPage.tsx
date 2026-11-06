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
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

export const ManageJobsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING'>('PENDING');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [pendingJobs, setPendingJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);

  // Reject modal state
  const [rejectingJob, setRejectingJob] = useState<Job | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const [allRes, pendingRes] = await Promise.all([
        jobService.getJobs({ size: 100 }),
        adminService.getPendingJobs(0, 50).catch(() => ({ content: [] }))
      ]);
      setJobs(allRes.content || []);
      setPendingJobs(pendingRes.content || []);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleApprove = async (jobId: number) => {
    setProcessingId(jobId);
    try {
      await adminService.reviewJob(jobId, 'APPROVE');
      setPendingJobs(prev => prev.filter(j => j.id !== jobId));
      fetchJobs();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Có lỗi xảy ra khi phê duyệt tin');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectingJob) return;
    if (!rejectionReason.trim()) {
      alert('Vui lòng nhập lý do từ chối duyệt');
      return;
    }
    setProcessingId(rejectingJob.id);
    try {
      await adminService.reviewJob(rejectingJob.id, 'REJECT', rejectionReason);
      setPendingJobs(prev => prev.filter(j => j.id !== rejectingJob.id));
      setRejectingJob(null);
      setRejectionReason('');
      fetchJobs();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Có lỗi xảy ra khi từ chối tin');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (jobId: number) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa tin việc làm #${jobId}? Hành động này không thể hoàn tác.`)) {
      return;
    }
    setDeletingId(jobId);
    try {
      await adminService.deleteJob(jobId);
      setJobs(prev => prev.filter(j => j.id !== jobId));
      setPendingJobs(prev => prev.filter(j => j.id !== jobId));
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
            Kiểm duyệt & Quản lý việc làm
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Kiểm duyệt tin đăng mới, loại bỏ tin sai phạm hoặc có dấu hiệu thu cọc lừa đảo sinh viên.
          </p>
        </div>
        <button onClick={fetchJobs} className="btn btn-secondary" style={{ padding: '0.45rem 0.85rem' }}>
          <RefreshCw size={15} /> Làm mới
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('PENDING')}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            background: activeTab === 'PENDING' ? 'var(--primary-color)' : 'transparent',
            color: activeTab === 'PENDING' ? '#fff' : 'var(--text-muted)',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem'
          }}
        >
          <Clock size={16} />
          Hàng chờ duyệt ({pendingJobs.length})
        </button>
        <button
          onClick={() => setActiveTab('ALL')}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            background: activeTab === 'ALL' ? 'var(--primary-color)' : 'transparent',
            color: activeTab === 'ALL' ? '#fff' : 'var(--text-muted)',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          Tất cả việc làm ({jobs.length})
        </button>
      </div>

      {activeTab === 'PENDING' ? (
        /* PENDING JOBS VIEW */
        <div style={{
          background: 'var(--bg-card)',
          color: 'var(--text-main)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)'
        }}>
          {loading ? (
            <p style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>Đang tải tin chờ duyệt...</p>
          ) : pendingJobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
              <CheckCircle size={48} color="#16a34a" style={{ margin: '0 auto 1rem', display: 'block' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Không có tin nào đang chờ duyệt!</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Tất cả tin tuyển dụng mới đều đã được kiểm duyệt an toàn.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.85rem 1rem' }}>ID</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Tiêu đề & Ca làm</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Nhà tuyển dụng</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Lương</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Thời điểm tạo</th>
                    <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Quyết định duyệt</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingJobs.map(job => (
                    <tr key={job.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>#{job.id}</td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>{job.title}</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          {job.category?.name} • Ca: <strong style={{ color: 'var(--primary-color)' }}>{job.shiftType || 'Linh hoạt'}</strong> ({job.workingHours || 'Chưa ghi chú'})
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>📍 {job.location || job.province}</div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 600 }}>{job.employer?.companyName || job.employer?.fullName}</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{job.employer?.fullName}</div>
                      </td>
                      <td style={{ padding: '1rem', color: '#16a34a', fontWeight: 600 }}>
                        {job.salaryText || `${job.salaryAmount?.toLocaleString()} VNĐ`}
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {job.createdAt ? new Date(job.createdAt).toLocaleDateString('vi-VN') : 'Mới tạo'}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <Link
                            to={`/jobs/${job.id}`}
                            className="btn btn-secondary"
                            style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                          >
                            <ExternalLink size={14} /> Chi tiết
                          </Link>
                          <button
                            onClick={() => handleApprove(job.id)}
                            disabled={processingId === job.id}
                            className="btn btn-primary"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', background: '#16a34a', borderColor: '#16a34a' }}
                          >
                            <CheckCircle size={14} /> Duyệt
                          </button>
                          <button
                            onClick={() => setRejectingJob(job)}
                            disabled={processingId === job.id}
                            className="btn btn-secondary"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', color: '#b91c1c', borderColor: '#fca5a5' }}
                          >
                            <XCircle size={14} /> Từ chối
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
      ) : (
        /* ALL JOBS VIEW */
        <>
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
                <option value="PENDING_REVIEW">PENDING_REVIEW (Chờ duyệt)</option>
                <option value="OPEN">OPEN (Đang mở)</option>
                <option value="IN_PROGRESS">IN_PROGRESS (Đang làm)</option>
                <option value="COMPLETED">COMPLETED (Hoàn thành)</option>
                <option value="CLOSED">CLOSED (Đóng tin)</option>
                <option value="REJECTED">REJECTED (Bị từ chối)</option>
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
                            job.status === 'PENDING_REVIEW' ? 'badge-freelance' :
                            job.status === 'IN_PROGRESS' ? 'badge-featured' :
                            job.status === 'COMPLETED' ? 'badge-parttime' : 'badge-closed'
                          }`}>
                            {job.status === 'PENDING_REVIEW' ? 'Chờ duyệt' : job.status}
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
        </>
      )}

      {/* Reject Modal */}
      {rejectingJob && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            background: 'var(--bg-card)',
            color: 'var(--text-main)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            maxWidth: '500px',
            width: '100%',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#b91c1c' }}>
              <AlertCircle size={22} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Từ chối phê duyệt tin việc làm</h3>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Tin: <strong>{rejectingJob.title}</strong>
            </p>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Lý do từ chối (gửi thông báo đến nhà tuyển dụng):
            </label>
            <textarea
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="VD: Tin tuyển dụng có dấu hiệu thu phí đặt cọc trái quy định; hoặc địa chỉ làm việc không rõ ràng..."
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                outline: 'none',
                fontSize: '0.9rem',
                marginBottom: '1.5rem',
                background: 'var(--bg-card-subtle)',
                color: 'var(--text-main)'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                onClick={() => setRejectingJob(null)}
                className="btn btn-secondary"
                disabled={processingId !== null}
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={processingId !== null}
                className="btn btn-primary"
                style={{ background: '#b91c1c', borderColor: '#b91c1c' }}
              >
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
