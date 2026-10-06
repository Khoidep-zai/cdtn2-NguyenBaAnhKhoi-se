import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { Job, Application } from '../../types';
import { ReviewModal } from '../../components/review/ReviewModal';
import { 
  Users, 
  ArrowLeft, 
  FileText, 
  Mail, 
  Phone, 
  GraduationCap, 
  BookOpen,
  CheckCircle2, 
  XCircle, 
  Star, 
  Clock, 
  ExternalLink,
  AlertCircle
} from 'lucide-react';

export const ApplicantsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const jobId = Number(id);

  const [job, setJob] = useState<Job | null>(null);
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  // Reject modal state
  const [rejectModalApp, setRejectModalApp] = useState<Application | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewTarget, setReviewTarget] = useState<{
    studentId: number;
    studentName: string;
  } | null>(null);

  const fetchData = async () => {
    if (!jobId) return;
    setLoading(true);
    try {
      const [jobData, appData] = await Promise.all([
        jobService.getJobById(jobId).catch(() => null),
        jobService.getApplicantsForJob(jobId).catch(() => [])
      ]);
      setJob(jobData);
      setApplicants(appData || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [jobId]);

  const handleAccept = async (applicationId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn chấp nhận ứng viên này?')) return;
    setProcessingId(applicationId);
    try {
      const updated = await jobService.updateApplicationStatus(applicationId, 'ACCEPTED');
      setApplicants(prev => prev.map(a => a.id === applicationId ? { ...a, status: updated.status } : a));
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Có lỗi xảy ra khi duyệt ứng viên');
    } finally {
      setProcessingId(null);
    }
  };

  const handleOpenReject = (app: Application) => {
    setRejectModalApp(app);
    setRejectionReason('');
  };

  const handleConfirmReject = async () => {
    if (!rejectModalApp) return;
    setProcessingId(rejectModalApp.id);
    try {
      const updated = await jobService.updateApplicationStatus(rejectModalApp.id, 'REJECTED', rejectionReason);
      setApplicants(prev => prev.map(a => a.id === rejectModalApp.id ? { ...a, status: updated.status, rejectionReason } : a));
      setRejectModalApp(null);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Có lỗi xảy ra khi từ chối ứng viên');
    } finally {
      setProcessingId(null);
    }
  };

  const handleOpenReview = (app: Application) => {
    const student = app.student;
    if (!student) return;
    setReviewTarget({
      studentId: student.id,
      studentName: student.fullName
    });
    setReviewModalOpen(true);
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '1000px' }}>
      {/* Back button */}
      <Link
        to="/employer/my-jobs"
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
        <ArrowLeft size={16} /> Quay lại danh sách tin đăng
      </Link>

      {/* Header */}
      <div style={{
        background: 'white',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        padding: '1.75rem',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              Ứng viên cho: {job?.title || `Công việc #${jobId}`}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Tổng số ứng viên đã nộp: <strong>{applicants.length}</strong> • Chỉ tiêu: <strong>{job?.slotsAvailable || 1}</strong>
            </p>
          </div>
          {job && (
            <span className={`badge ${
              job.status === 'OPEN' ? 'badge-open' :
              job.status === 'IN_PROGRESS' ? 'badge-featured' :
              job.status === 'COMPLETED' ? 'badge-parttime' : 'badge-freelance'
            }`}>
              {job.status}
            </span>
          )}
        </div>
      </div>

      {/* Applicant list */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>Đang tải danh sách ứng viên...</p>
      ) : applicants.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)'
        }}>
          <Users size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Chưa có ứng viên nào</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Chưa có sinh viên nào nộp hồ sơ vào bài đăng này. Hãy kiểm tra lại sau!
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {applicants.map(app => {
            const student = app.student;
            return (
              <div
                key={app.id}
                style={{
                  background: 'white',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-color)',
                  padding: '1.5rem',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                      {student?.fullName || `Ứng viên #${app.studentId || app.id}`}
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {student?.email && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Mail size={14} /> {student.email}
                        </span>
                      )}
                      {student?.phone && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Phone size={14} /> {student.phone}
                        </span>
                      )}
                      {student?.university && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <GraduationCap size={14} /> {student.university}
                        </span>
                      )}
                      {student?.major && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <BookOpen size={14} /> {student.major}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      background: app.status === 'ACCEPTED' ? '#dcfce7' : app.status === 'REJECTED' ? '#fee2e2' : '#fef3c7',
                      color: app.status === 'ACCEPTED' ? '#166534' : app.status === 'REJECTED' ? '#991b1b' : '#92400e'
                    }}>
                      {app.status === 'ACCEPTED' && <CheckCircle2 size={14} />}
                      {app.status === 'REJECTED' && <XCircle size={14} />}
                      {app.status === 'PENDING' && <Clock size={14} />}
                      {app.status === 'ACCEPTED' ? 'Đã chấp nhận' : app.status === 'REJECTED' ? 'Đã từ chối' : 'Chờ xét duyệt'}
                    </span>
                  </div>
                </div>

                {/* Skills */}
                {student?.skills && (
                  <div style={{ marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                      Kỹ năng chuyên môn:
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {student.skills.split(',').map((skill, idx) => (
                        <span
                          key={idx}
                          style={{
                            background: 'var(--bg-main)',
                            border: '1px solid var(--border-color)',
                            padding: '0.2rem 0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.8rem',
                            color: 'var(--text-main)'
                          }}
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cover letter */}
                {app.coverLetter && (
                  <div style={{
                    background: 'var(--bg-main)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem 1rem',
                    fontSize: '0.88rem',
                    marginBottom: '1rem'
                  }}>
                    <strong style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                      Thư ứng tuyển:
                    </strong>
                    {app.coverLetter}
                  </div>
                )}

                {/* Rejection reason display if rejected */}
                {app.status === 'REJECTED' && app.rejectionReason && (
                  <div style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 1rem',
                    color: '#991b1b',
                    fontSize: '0.85rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <AlertCircle size={16} />
                    <span><strong>Lý do từ chối:</strong> {app.rejectionReason}</span>
                  </div>
                )}

                {/* Action buttons toolbar */}
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
                    {app.cvUrl ? (
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
                        <FileText size={15} /> Xem CV / Resume <ExternalLink size={13} />
                      </a>
                    ) : (
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Không có file CV đính kèm</span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {app.status !== 'ACCEPTED' && app.status !== 'REJECTED' && (
                      <>
                        <button
                          onClick={() => handleAccept(app.id)}
                          disabled={processingId === app.id}
                          className="btn btn-primary"
                          style={{
                            background: '#16a34a',
                            borderColor: '#16a34a',
                            padding: '0.4rem 0.85rem',
                            fontSize: '0.85rem'
                          }}
                        >
                          <CheckCircle2 size={15} /> Nhận ứng viên
                        </button>
                        <button
                          onClick={() => handleOpenReject(app)}
                          disabled={processingId === app.id}
                          className="btn btn-secondary"
                          style={{
                            color: '#b91c1c',
                            borderColor: '#fca5a5',
                            padding: '0.4rem 0.85rem',
                            fontSize: '0.85rem'
                          }}
                        >
                          <XCircle size={15} /> Từ chối
                        </button>
                      </>
                    )}

                    {app.status === 'ACCEPTED' && student && (
                      <button
                        onClick={() => handleOpenReview(app)}
                        className="btn btn-secondary"
                        style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
                      >
                        <Star size={15} color="#eab308" /> Đánh giá sinh viên
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalApp && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            maxWidth: '460px',
            width: '100%',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: '#991b1b' }}>
              Từ chối đơn ứng tuyển
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1rem' }}>
              Nhập lý do từ chối để sinh viên nắm được thông tin phản hồi từ bạn:
            </p>

            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Ví dụ: Kỹ năng chưa phù hợp với yêu cầu hiện tại của dự án..."
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem',
                marginBottom: '1.25rem',
                outline: 'none',
                resize: 'vertical'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setRejectModalApp(null)}
                className="btn btn-secondary"
                disabled={processingId !== null}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="btn btn-primary"
                style={{ background: '#b91c1c', borderColor: '#b91c1c' }}
                disabled={processingId !== null}
              >
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewTarget && job && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => {
            setReviewModalOpen(false);
            setReviewTarget(null);
          }}
          jobId={job.id}
          revieweeId={reviewTarget.studentId}
          revieweeName={reviewTarget.studentName}
          jobTitle={job.title}
          onSuccess={() => {
            alert('Cảm ơn bạn đã gửi đánh giá sinh viên!');
          }}
        />
      )}
    </div>
  );
};
