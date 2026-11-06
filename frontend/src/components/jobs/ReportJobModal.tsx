import React, { useState } from 'react';
import { Flag, X, AlertCircle, CheckCircle } from 'lucide-react';
import { reportService } from '../../services/reportService';

interface ReportJobModalProps {
  jobId: number;
  jobTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const REASONS = [
  { value: 'SCAM_DEPOSIT', label: 'Yêu cầu đặt cọc / nộp phí giữ chỗ, mua đồng phục trái phép' },
  { value: 'FALSE_INFO', label: 'Thông tin công ty, địa chỉ hoặc mức lương sai sự thật' },
  { value: 'INAPPROPRIATE', label: 'Dấu hiệu đa cấp biến tướng, công việc mờ ám' },
  { value: 'OTHER', label: 'Lý do khác' }
];

export const ReportJobModal: React.FC<ReportJobModalProps> = ({
  jobId,
  jobTitle,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [reason, setReason] = useState('SCAM_DEPOSIT');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await reportService.submitReport({
        jobId,
        reason,
        description: description.trim()
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Có lỗi xảy ra khi gửi báo cáo vi phạm.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem'
      }}
    >
      <div
        style={{
          background: 'var(--bg-card)',
          color: 'var(--text-main)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          maxWidth: '520px',
          width: '100%',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-color)',
          position: 'relative'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', color: '#dc2626' }}>
          <Flag size={22} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Báo cáo tin việc làm vi phạm</h3>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Bạn đang báo cáo: <strong>{jobTitle}</strong>
        </p>

        {success ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <CheckCircle size={44} color="#16a34a" style={{ margin: '0 auto 1rem', display: 'block' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#16a34a', marginBottom: '0.5rem' }}>
              Gửi báo cáo thành công!
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Cảm ơn bạn đã chung tay bảo vệ cộng đồng sinh viên. Ban quản trị sẽ rà soát và xử lý trong vòng 24 giờ.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid #fca5a5',
                color: '#b91c1c',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                marginBottom: '1rem'
              }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                Lý do báo cáo:
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {REASONS.map(r => (
                  <label
                    key={r.value}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      color: 'var(--text-main)'
                    }}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={r.value}
                      checked={reason === r.value}
                      onChange={() => setReason(r.value)}
                    />
                    <span>{r.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Mô tả chi tiết bằng chứng (tùy chọn):
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="VD: Người liên hệ yêu cầu chuyển 200.000đ tiền cọc hồ sơ qua Zalo..."
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  outline: 'none',
                  fontSize: '0.85rem',
                  background: 'var(--bg-card-subtle)',
                  color: 'var(--text-main)'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
                disabled={loading}
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ background: '#dc2626', borderColor: '#dc2626' }}
              >
                {loading ? 'Đang gửi...' : 'Gửi báo cáo'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

