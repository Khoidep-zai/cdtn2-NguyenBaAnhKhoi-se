import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { Application } from '../../types';
import { ReviewModal } from '../../components/review/ReviewModal';
import { 
  FileText, 
  Building2, 
  Calendar, 
  DollarSign, 
  MapPin, 
  Star, 
  ExternalLink, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Briefcase
} from 'lucide-react';

export const MyApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewTarget, setReviewTarget] = useState<{
    jobId: number;
    employerId: number;
    employerName: string;
    jobTitle: string;
  } | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await jobService.getMyApplications();
      setApplications(data || []);
    } catch {
      // Handled silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const filteredApps = applications.filter((app) => {
    if (selectedFilter === 'ALL') return true;
    return app.status === selectedFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.35rem 0.75rem',
            background: '#dcfce7',
            color: '#166534',
            borderRadius: '9999px',
            fontSize: '0.82rem',
            fontWeight: 600
          }}>
            <CheckCircle2 size={14} /> Được nhận
          </span>
        );
      case 'REJECTED':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.35rem 0.75rem',
            background: '#fee2e2',
            color: '#991b1b',
            borderRadius: '9999px',
            fontSize: '0.82rem',
            fontWeight: 600
          }}>
            <XCircle size={14} /> Từ chối
          </span>
        );
      case 'REVIEWING':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.35rem 0.75rem',
            background: '#e0f2fe',
            color: '#075985',
            borderRadius: '9999px',
            fontSize: '0.82rem',
            fontWeight: 600
          }}>
            <Clock size={14} /> Đang xem xét
          </span>
        );
      default:
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.35rem 0.75rem',
            background: '#fef3c7',
            color: '#92400e',
            borderRadius: '9999px',
            fontSize: '0.82rem',
            fontWeight: 600
          }}>
            <Clock size={14} /> Chờ duyệt
          </span>
        );
    }
  };

  const openReviewModal = (app: Application) => {
    if (!app.job || !app.job.employer) return;
    setReviewTarget({
      jobId: app.job.id,
      employerId: app.job.employer.id,
      employerName: app.job.employer.companyName || app.job.employer.fullName,
      jobTitle: app.job.title
    });
    setReviewModalOpen(true);
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '1000px' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          Đơn ứng tuyển của tôi
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Theo dõi trạng thái các công việc part-time & freelance bạn đã nộp hồ sơ.
        </p>
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
          { key: 'ALL', label: 'Tất cả', count: applications.length },
          { key: 'PENDING', label: 'Chờ duyệt', count: applications.filter(a => a.status === 'PENDING').length },
          { key: 'REVIEWING', label: 'Đang xem xét', count: applications.filter(a => a.status === 'REVIEWING').length },
          { key: 'ACCEPTED', label: 'Được nhận', count: applications.filter(a => a.status === 'ACCEPTED').length },
          { key: 'REJECTED', label: 'Từ chối', count: applications.filter(a => a.status === 'REJECTED').length },
        ].map((tab) => (
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

      {/* Application List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          Đang tải danh sách đơn ứng tuyển...
        </div>
      ) : filteredApps.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)'
        }}>
          <FileText size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Chưa có đơn ứng tuyển nào</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {selectedFilter === 'ALL'
              ? 'Bạn chưa nộp hồ sơ vào công việc nào. Hãy khám phá cơ hội việc làm ngay hôm nay!'
              : `Không có đơn ứng tuyển nào ở trạng thái "${selectedFilter}".`}
          </p>
          <Link to="/jobs" className="btn btn-primary">
            <Briefcase size={16} /> Tìm việc làm ngay
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredApps.map((app) => {
            const job = app.job;
            const jobId = job?.id || app.jobId;
            return (
              <div
                key={app.id}
                style={{
                  background: 'white',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-color)',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'box-shadow 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <Link
                      to={`/jobs/${jobId}`}
                      style={{
                        fontSize: '1.15rem',
                        fontWeight: 700,
                        color: 'var(--text-main)',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      {job?.title || `Công việc #${jobId}`}
                      <ExternalLink size={16} color="var(--primary)" />
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.4rem', flexWrap: 'wrap', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Building2 size={15} /> {job?.employer?.companyName || job?.employer?.fullName || 'Nhà tuyển dụng'}
                      </span>
                      {job?.location && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <MapPin size={15} /> {job.location}
                        </span>
                      )}
                      {job?.salaryAmount && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#16a34a', fontWeight: 600 }}>
                          <DollarSign size={15} /> {job.salaryAmount.toLocaleString()} VNĐ
                        </span>
                      )}
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Calendar size={15} /> Nộp ngày: {new Date(app.appliedAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>

                  <div>
                    {getStatusBadge(app.status)}
                  </div>
                </div>

                {/* Cover letter or info */}
                {app.coverLetter && (
                  <div style={{
                    background: 'var(--bg-main)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem 1rem',
                    fontSize: '0.88rem',
                    color: 'var(--text-main)'
                  }}>
                    <strong style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                      Thư ứng tuyển:
                    </strong>
                    {app.coverLetter}
                  </div>
                )}

                {/* Rejection Reason Alert */}
                {app.status === 'REJECTED' && app.rejectionReason && (
                  <div style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
                    color: '#991b1b',
                    fontSize: '0.88rem'
                  }}>
                    <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong>Lý do từ chối:</strong> {app.rejectionReason}
                    </div>
                  </div>
                )}

                {/* Action Toolbar */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--border-color)',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}>
                  <div>
                    {app.cvUrl && (
                      <a
                        href={app.cvUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          fontSize: '0.85rem',
                          color: 'var(--primary)',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          fontWeight: 600
                        }}
                      >
                        <FileText size={15} /> Xem CV đã nộp
                      </a>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {app.status === 'ACCEPTED' && (
                      <button
                        onClick={() => openReviewModal(app)}
                        className="btn btn-secondary"
                        style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
                      >
                        <Star size={15} color="#eab308" /> Đánh giá nhà tuyển dụng
                      </button>
                    )}
                    <Link
                      to={`/jobs/${jobId}`}
                      className="btn btn-secondary"
                      style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
                    >
                      Chi tiết bài đăng
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      {reviewTarget && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => {
            setReviewModalOpen(false);
            setReviewTarget(null);
          }}
          jobId={reviewTarget.jobId}
          revieweeId={reviewTarget.employerId}
          revieweeName={reviewTarget.employerName}
          jobTitle={reviewTarget.jobTitle}
          onSuccess={() => {
            alert('Cảm ơn bạn đã gửi đánh giá!');
          }}
        />
      )}
    </div>
  );
};
