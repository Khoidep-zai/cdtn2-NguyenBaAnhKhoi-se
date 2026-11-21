import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { jobService } from '../../services/jobService';
import { workHistoryService } from '../../services/workHistoryService';
import { Application, WorkHistory } from '../../types';
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
  Briefcase,
  Award,
  ShieldCheck
} from 'lucide-react';

export const MyApplicationsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeMainTab, setActiveMainTab] = useState<'APPLICATIONS' | 'WORK_HISTORY'>('APPLICATIONS');
  const [applications, setApplications] = useState<Application[]>([]);
  const [workHistories, setWorkHistories] = useState<Record<number, WorkHistory>>({});
  const [studentWorkHistories, setStudentWorkHistories] = useState<WorkHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  // Student Confirm Modal state
  const [confirmModalApp, setConfirmModalApp] = useState<Application | null>(null);
  const [confirmModalWh, setConfirmModalWh] = useState<WorkHistory | null>(null);
  const [isDisputeMode, setIsDisputeMode] = useState(false);
  const [studentFeedbackText, setStudentFeedbackText] = useState('');
  const [submittingConfirm, setSubmittingConfirm] = useState(false);

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
      const apps = data || [];
      setApplications(apps);

      // Nạp thông tin work history cho các đơn đã ACCEPTED
      const acceptedApps = apps.filter(a => a.status === 'ACCEPTED');
      if (acceptedApps.length > 0) {
        const whResults = await Promise.all(
          acceptedApps.map(async a => {
            const wh = await workHistoryService.getByApplicationId(a.id);
            return { appId: a.id, wh };
          })
        );
        const whMap: Record<number, WorkHistory> = {};
        whResults.forEach(r => {
          if (r.wh) whMap[r.appId] = r.wh;
        });
        setWorkHistories(whMap);
      }
    } catch {
      // Handled silently
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    if (!user?.id) return;
    setLoadingHistory(true);
    try {
      const hist = await workHistoryService.getStudentWorkHistory(user.id);
      setStudentWorkHistories(hist || []);
    } catch {
      // Handled silently
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    fetchHistory();
  }, [user?.id]);

  const handleOpenStudentConfirm = (app: Application, wh: WorkHistory, isDispute: boolean) => {
    setConfirmModalApp(app);
    setConfirmModalWh(wh);
    setIsDisputeMode(isDispute);
    setStudentFeedbackText('');
  };

  const handleSubmitStudentConfirm = async () => {
    if (!confirmModalApp) return;
    if (isDisputeMode && !studentFeedbackText.trim()) {
      alert('Vui lòng nhập lý do khiếu nại để ban quản trị đối soát.');
      return;
    }
    setSubmittingConfirm(true);
    try {
      const updatedWh = await workHistoryService.confirmCompleted(confirmModalApp.id, {
        confirmed: !isDisputeMode,
        isDispute: isDisputeMode,
        feedback: !isDisputeMode ? studentFeedbackText.trim() : undefined,
        disputeReason: isDisputeMode ? studentFeedbackText.trim() : undefined
      });
      setWorkHistories(prev => ({ ...prev, [confirmModalApp.id]: updatedWh }));
      setConfirmModalApp(null);
      fetchHistory(); // Refresh work history tab
      alert(isDisputeMode 
        ? 'Đã ghi nhận khiếu nại của bạn về công việc này.'
        : 'Xác nhận hoàn thành thành công! Công việc đã được ghi nhận vào Hồ sơ năng lực của bạn.');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Có lỗi xảy ra khi xác nhận công việc');
    } finally {
      setSubmittingConfirm(false);
    }
  };

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
      case 'CANCELLED':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.35rem 0.75rem',
            background: '#f1f5f9',
            color: '#64748b',
            borderRadius: '9999px',
            fontSize: '0.82rem',
            fontWeight: 600
          }}>
            <XCircle size={14} /> Đã rút đơn
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

  const handleCancelApplication = async (applicationId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn rút đơn ứng tuyển này?')) return;
    try {
      await jobService.cancelApplication(applicationId);
      setApplications(prev => prev.map(a => a.id === applicationId ? { ...a, status: 'CANCELLED' } : a));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không thể hủy đơn ứng tuyển');
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
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          Đơn ứng tuyển & Lịch sử công việc
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Theo dõi trạng thái các công việc đã nộp hồ sơ và lịch sử kinh nghiệm thực tế đã được nhà tuyển dụng xác nhận.
        </p>
      </div>

      {/* Main Switcher: Đơn ứng tuyển VS Lịch sử công việc */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        borderBottom: '2px solid var(--border-color)',
        paddingBottom: '0.25rem'
      }}>
        <button
          onClick={() => setActiveMainTab('APPLICATIONS')}
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: activeMainTab === 'APPLICATIONS' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeMainTab === 'APPLICATIONS' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: 700,
            fontSize: '1.05rem',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '-2px',
            transition: 'all 0.15s ease'
          }}
        >
          <Briefcase size={18} /> Đơn ứng tuyển ({applications.length})
        </button>
        <button
          onClick={() => setActiveMainTab('WORK_HISTORY')}
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: activeMainTab === 'WORK_HISTORY' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeMainTab === 'WORK_HISTORY' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: 700,
            fontSize: '1.05rem',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '-2px',
            transition: 'all 0.15s ease'
          }}
        >
          <Award size={18} /> Lịch sử việc đã xác thực ({studentWorkHistories.length})
        </button>
      </div>

      {/* TAB 1: DANH SÁCH ĐƠN ỨNG TUYỂN */}
      {activeMainTab === 'APPLICATIONS' && (
        <>
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
              background: 'var(--bg-card)',
              color: 'var(--text-main)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <FileText size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Chưa có đơn ứng tuyển nào</h3>
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
                const wh = workHistories[app.id];

                return (
                  <div
                    key={app.id}
                    style={{
                      background: 'var(--bg-card)',
                      color: 'var(--text-main)',
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

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {getStatusBadge(app.status)}
                      </div>
                    </div>

                    {/* Banner thông báo xác nhận hoàn thành công việc từ NTD */}
                    {app.status === 'ACCEPTED' && wh && (
                      <div>
                        {wh.completionStatus === 'PENDING_STUDENT_CONFIRM' && (
                          <div style={{
                            background: '#fef3c7',
                            border: '1px solid #fde68a',
                            borderRadius: 'var(--radius-md)',
                            padding: '1rem 1.2rem',
                            color: '#92400e',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.6rem'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem' }}>
                              <Award size={20} color="#b45309" />
                              <span>Nhà tuyển dụng đã đánh dấu hoàn thành công việc & đánh giá bạn {wh.employerRating} ⭐!</span>
                            </div>
                            {wh.employerFeedback && (
                              <p style={{ margin: 0, fontSize: '0.88rem', fontStyle: 'italic', background: 'rgba(255,255,255,0.7)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                                "{wh.employerFeedback}"
                              </p>
                            )}
                            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                              <button
                                onClick={() => handleOpenStudentConfirm(app, wh, false)}
                                className="btn btn-primary"
                                style={{ background: '#16a34a', borderColor: '#16a34a', padding: '0.35rem 0.85rem', fontSize: '0.82rem' }}
                              >
                                <CheckCircle2 size={14} /> Xác nhận hoàn thành vào Hồ sơ
                              </button>
                              <button
                                onClick={() => handleOpenStudentConfirm(app, wh, true)}
                                className="btn btn-secondary"
                                style={{ color: '#b91c1c', borderColor: '#fca5a5', padding: '0.35rem 0.85rem', fontSize: '0.82rem' }}
                              >
                                <AlertCircle size={14} /> Gửi khiếu nại
                              </button>
                            </div>
                          </div>
                        )}

                        {wh.completionStatus === 'COMPLETED' && (
                          <div style={{
                            background: '#dcfce7',
                            border: '1px solid #bbf7d0',
                            borderRadius: 'var(--radius-md)',
                            padding: '0.75rem 1rem',
                            color: '#166534',
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            <ShieldCheck size={18} color="#16a34a" />
                            <span>
                              Công việc đã hoàn thành và được xác thực vào Hồ sơ năng lực của bạn ({wh.employerRating} ⭐).
                            </span>
                          </div>
                        )}

                        {wh.completionStatus === 'DISPUTED' && (
                          <div style={{
                            background: '#fee2e2',
                            border: '1px solid #fca5a5',
                            borderRadius: 'var(--radius-md)',
                            padding: '0.75rem 1rem',
                            color: '#991b1b',
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            <AlertCircle size={18} color="#dc2626" />
                            <span>
                              Bạn đã gửi khiếu nại về công việc này: <em>"{wh.studentFeedback}"</em>. Ban quản trị sẽ hỗ trợ đối soát.
                            </span>
                          </div>
                        )}
                      </div>
                    )}

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

                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        {app.status === 'PENDING' && (
                          <button
                            onClick={() => handleCancelApplication(app.id)}
                            className="btn btn-secondary"
                            style={{
                              padding: '0.4rem 0.85rem',
                              fontSize: '0.85rem',
                              color: '#b91c1c',
                              borderColor: '#fca5a5'
                            }}
                          >
                            <XCircle size={14} /> Rút đơn
                          </button>
                        )}

                        {app.status === 'ACCEPTED' && job?.status === 'COMPLETED' && (
                          <button
                            onClick={() => openReviewModal(app)}
                            className="btn btn-secondary"
                            style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
                          >
                            <Star size={15} color="#eab308" /> Đánh giá nhà tuyển dụng
                          </button>
                        )}

                        {app.status === 'ACCEPTED' && job?.status !== 'COMPLETED' && !wh && (
                          <span style={{
                            fontSize: '0.8rem',
                            color: 'var(--text-muted)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            padding: '0.35rem 0.6rem',
                            background: 'var(--bg-main)',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-color)'
                          }}>
                            <Clock size={13} /> Chờ NTD xác nhận hoàn thành
                          </span>
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
        </>
      )}

      {/* TAB 2: LỊCH SỬ CÔNG VIỆC ĐÃ TÍCH LŨY */}
      {activeMainTab === 'WORK_HISTORY' && (
        <div>
          {loadingHistory ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
              Đang tải lịch sử công việc...
            </div>
          ) : studentWorkHistories.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              background: 'var(--bg-card)',
              color: 'var(--text-main)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <Award size={48} color="var(--primary)" style={{ margin: '0 auto 1rem', opacity: 0.6 }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                Chưa có lịch sử công việc nào được xác thực
              </h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem', maxWidth: '520px', margin: '0 auto 1.5rem' }}>
                Khi bạn hoàn thành công việc và được Nhà tuyển dụng đánh dấu hoàn thành, kinh nghiệm thực tế kèm đánh giá sao sẽ tự động được lưu snapshot vĩnh viễn tại đây và hiển thị trên Hồ sơ năng lực của bạn!
              </p>
              <button onClick={() => setActiveMainTab('APPLICATIONS')} className="btn btn-primary">
                Xem các đơn ứng tuyển hiện tại
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {studentWorkHistories.map((wh) => (
                <div
                  key={wh.id}
                  style={{
                    background: 'var(--bg-card)',
                    color: 'var(--text-main)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-color)',
                    padding: '1.5rem',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 0.25rem 0' }}>
                        {wh.jobTitle}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Building2 size={15} /> {wh.companyName || wh.employerName}
                        </span>
                        {wh.companyAddress && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <MapPin size={15} /> {wh.companyAddress}
                          </span>
                        )}
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Calendar size={15} /> {wh.startDate} {wh.endDate ? `→ ${wh.endDate}` : ''}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        padding: '0.35rem 0.75rem',
                        background: '#dcfce7',
                        color: '#166534',
                        borderRadius: '9999px',
                        fontSize: '0.8rem',
                        fontWeight: 600
                      }}>
                        <ShieldCheck size={14} /> Đã xác thực trên sàn
                      </span>
                    </div>
                  </div>

                  {/* Rating & Feedback */}
                  {wh.employerRating && (
                    <div style={{
                      background: 'var(--bg-main)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.85rem 1rem',
                      marginTop: '0.75rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                          Đánh giá từ NTD:
                        </span>
                        <div style={{ display: 'flex', gap: '0.15rem' }}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={15}
                              color={s <= (wh.employerRating || 0) ? '#eab308' : '#cbd5e1'}
                              fill={s <= (wh.employerRating || 0) ? '#eab308' : 'none'}
                            />
                          ))}
                        </div>
                      </div>
                      {wh.employerFeedback && (
                        <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-main)', fontStyle: 'italic' }}>
                          "{wh.employerFeedback}"
                        </p>
                      )}
                    </div>
                  )}

                  {wh.description && (
                    <p style={{ marginTop: '0.75rem', marginBottom: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <strong>Kết quả công việc:</strong> {wh.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Student Confirm / Dispute Modal */}
      {confirmModalApp && confirmModalWh && (
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
            background: 'var(--bg-card)',
            color: 'var(--text-main)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            maxWidth: '500px',
            width: '100%',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              marginBottom: '0.5rem',
              color: isDisputeMode ? '#dc2626' : '#16a34a',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              {isDisputeMode ? <AlertCircle size={22} /> : <CheckCircle2 size={22} />}
              {isDisputeMode ? 'Gửi khiếu nại công việc' : 'Xác nhận hoàn thành công việc'}
            </h3>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.2rem', lineHeight: 1.5 }}>
              {isDisputeMode
                ? 'Nếu thời gian làm việc, mức thù lao hoặc công việc thực tế không đúng thỏa thuận ban đầu, hãy ghi rõ lý do để ban quản trị tiếp nhận giải quyết.'
                : `Xác nhận bạn đã hoàn thành công việc "${confirmModalApp.job?.title || 'Công việc'}". Đánh giá ${confirmModalWh.employerRating} ⭐ từ nhà tuyển dụng sẽ được ghi nhận vĩnh viễn vào Hồ sơ năng lực của bạn.`}
            </p>

            <div style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                {isDisputeMode ? 'Lý do khiếu nại chi tiết *' : 'Lời nhắn / Lời cảm ơn gửi Nhà tuyển dụng (tùy chọn):'}
              </label>
              <textarea
                rows={4}
                className="form-control"
                value={studentFeedbackText}
                onChange={(e) => setStudentFeedbackText(e.target.value)}
                placeholder={isDisputeMode ? 'Mô tả rõ vấn đề phát sinh...' : 'Cảm ơn công ty đã tạo cơ hội trải nghiệm việc làm rất hữu ích...'}
                style={{ width: '100%', padding: '0.65rem', fontSize: '0.88rem', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setConfirmModalApp(null)}
                className="btn btn-secondary"
                disabled={submittingConfirm}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSubmitStudentConfirm}
                className="btn btn-primary"
                style={{
                  background: isDisputeMode ? '#dc2626' : '#16a34a',
                  borderColor: isDisputeMode ? '#dc2626' : '#16a34a'
                }}
                disabled={submittingConfirm}
              >
                {submittingConfirm ? 'Đang gửi...' : (isDisputeMode ? 'Xác nhận khiếu nại' : 'Xác nhận hoàn thành')}
              </button>
            </div>
          </div>
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
