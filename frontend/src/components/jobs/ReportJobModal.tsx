import React, { useState, useEffect, useRef } from 'react';
import { Flag, X, AlertCircle, CheckCircle } from 'lucide-react';
import { reportService } from '../../services/reportService';
import '../common/ModernDialog.css';

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
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [reason, setReason] = useState('SCAM_DEPOSIT');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

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
    <dialog
      ref={dialogRef}
      className="modern-dialog"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) {
          onClose();
        }
      }}
    >
      <button
        type="button"
        className="modern-dialog-close-btn"
        onClick={onClose}
        aria-label="Đóng"
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

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Lý do báo cáo vi phạm <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {REASONS.map(r => (
                <label
                  key={r.value}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.6rem',
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: reason === r.value ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                    background: reason === r.value ? 'var(--primary-light)' : 'transparent',
                    transition: 'all 0.2s'
                  }}
                >
                  <input
                    type="radio"
                    name="reportReason"
                    value={r.value}
                    checked={reason === r.value}
                    onChange={(e) => setReason(e.target.value)}
                    style={{ marginTop: '0.2rem' }}
                  />
                  <span>{r.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              Mô tả chi tiết bằng chứng <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Vui lòng cung cấp chi tiết (tin nhắn yêu cầu chuyển khoản, địa điểm không chính xác...)"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.88rem',
                outline: 'none',
                background: 'var(--bg-main)',
                color: 'var(--text-main)',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn"
              disabled={loading || !description.trim()}
              style={{
                background: '#dc2626',
                color: '#ffffff',
                border: 'none',
                opacity: loading || !description.trim() ? 0.6 : 1
              }}
            >
              {loading ? 'Đang gửi...' : 'Gửi báo cáo'}
            </button>
          </div>
        </form>
      )}
    </dialog>
  );
};
