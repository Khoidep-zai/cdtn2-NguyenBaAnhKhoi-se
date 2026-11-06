import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reportService } from '../../services/reportService';
import { Report } from '../../types';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  ShieldAlert, 
  RefreshCw,
  ExternalLink,
  Ban
} from 'lucide-react';

const REASON_LABELS: Record<string, string> = {
  SCAM_DEPOSIT: 'Thu tiền cọc / phí giữ chân trái phép',
  FALSE_INFO: 'Thông tin sai sự thật / lừa dối',
  INAPPROPRIATE: 'Đa cấp biến tướng / quấy rối',
  OTHER: 'Lý do khác'
};

export const ManageReportsPage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await reportService.getReports(statusFilter);
      setReports(data.content || []);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [statusFilter]);

  const handleResolve = async (
    reportId: number, 
    action: 'DISMISS' | 'RESOLVE_BAN_JOB' | 'RESOLVE_BAN_EMPLOYER',
    confirmMsg: string
  ) => {
    if (!window.confirm(confirmMsg)) return;

    setProcessingId(reportId);
    try {
      await reportService.resolveReport(reportId, {
        action,
        resolutionNotes: `Admin đã thực hiện: ${action}`
      });
      fetchReports();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Có lỗi xảy ra khi xử lý phản ánh');
    } finally {
      setProcessingId(null);
    }
  };

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
            Quản lý Báo cáo & Phản ánh Vi phạm
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Tiếp nhận báo cáo lừa đảo, điều tra và bảo vệ an toàn cho sinh viên.
          </p>
        </div>
        <button onClick={fetchReports} className="btn btn-secondary" style={{ padding: '0.45rem 0.85rem' }}>
          <RefreshCw size={15} /> Làm mới
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        {[
          { key: 'PENDING', label: 'Chờ xử lý' },
          { key: 'RESOLVED', label: 'Đã giải quyết' },
          { key: 'DISMISSED', label: 'Đã bác bỏ' },
          { key: 'ALL', label: 'Tất cả' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: statusFilter === tab.key ? 'var(--primary-color)' : 'transparent',
              color: statusFilter === tab.key ? '#fff' : 'var(--text-muted)',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.88rem'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reports Table */}
      <div style={{
        background: 'var(--bg-card)',
        color: 'var(--text-main)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)'
      }}>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>Đang tải danh sách báo cáo...</p>
        ) : reports.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
            <CheckCircle size={44} color="#16a34a" style={{ margin: '0 auto 1rem', display: 'block' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Không có báo cáo nào ở mục này!</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Hệ thống không ghi nhận phản ánh vi phạm nào chưa xử lý.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.85rem 1rem' }}>ID</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Tin việc làm</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Người báo cáo</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Lý do & Bằng chứng</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Trạng thái</th>
                  <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {reports.map(r => (
                  <tr key={r.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>#{r.id}</td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{r.job?.title}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        NTD: {r.job?.employer?.companyName || r.job?.employer?.fullName}
                      </div>
                      {r.job && (
                        <Link
                          to={`/jobs/${r.job.id}`}
                          target="_blank"
                          style={{ fontSize: '0.78rem', color: 'var(--primary-color)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.25rem' }}
                        >
                          <ExternalLink size={12} /> Xem tin
                        </Link>
                      )}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 600 }}>{r.reporter?.fullName}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{r.reporter?.email}</div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.2rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#dc2626',
                        marginBottom: '0.35rem'
                      }}>
                        {REASON_LABELS[r.reason] || r.reason}
                      </span>
                      {r.description && (
                        <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-main)', fontStyle: 'italic' }}>
                          "{r.description}"
                        </p>
                      )}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span className={`badge ${
                        r.status === 'PENDING' ? 'badge-freelance' :
                        r.status === 'RESOLVED' ? 'badge-open' : 'badge-closed'
                      }`}>
                        {r.status === 'PENDING' ? '⏳ Chờ xử lý' :
                         r.status === 'RESOLVED' ? '✓ Đã xử lý' : 'Bác bỏ'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      {r.status === 'PENDING' ? (
                        <div style={{ display: 'inline-flex', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => handleResolve(r.id, 'RESOLVE_BAN_JOB', `Bạn có chắc muốn gỡ bỏ tin tuyển dụng #${r.job?.id}?`)}
                            disabled={processingId === r.id}
                            className="btn btn-primary"
                            style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem', background: '#dc2626', borderColor: '#dc2626' }}
                          >
                            <ShieldAlert size={13} /> Gỡ tin
                          </button>
                          <button
                            onClick={() => handleResolve(r.id, 'RESOLVE_BAN_EMPLOYER', `Bạn có chắc muốn KHÓA vĩnh viễn tài khoản nhà tuyển dụng này?`)}
                            disabled={processingId === r.id}
                            className="btn btn-secondary"
                            style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem', color: '#b91c1c', borderColor: '#fca5a5' }}
                          >
                            <Ban size={13} /> Khóa NTD
                          </button>
                          <button
                            onClick={() => handleResolve(r.id, 'DISMISS', `Bác bỏ báo cáo này nếu không có dấu hiệu vi phạm?`)}
                            disabled={processingId === r.id}
                            className="btn btn-secondary"
                            style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }}
                          >
                            <XCircle size={13} /> Bác bỏ
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {r.resolutionNotes || 'Đã hoàn tất'}
                        </span>
                      )}
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
