import React from 'react';
import { ShieldAlert, Flag } from 'lucide-react';

interface ScamWarningBannerProps {
  onReportClick?: () => void;
}

export const ScamWarningBanner: React.FC<ScamWarningBannerProps> = ({ onReportClick }) => {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(239, 68, 68, 0.05) 100%)',
        border: '1px solid rgba(245, 158, 11, 0.35)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem 1.5rem',
        margin: '1.5rem 0',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flex: 1, minWidth: '260px' }}>
          <div
            style={{
              background: '#fef3c7',
              color: '#d97706',
              borderRadius: '50%',
              padding: '0.4rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '0.1rem'
            }}
          >
            <ShieldAlert size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              Khuyến cáo an toàn cho sinh viên tìm việc part-time
            </h4>
            <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              <li>
                <strong style={{ color: 'var(--text-main)' }}>Tuyệt đối không đóng phí:</strong> Không chuyển tiền đặt cọc giữ chỗ, phí mua đồng phục hoặc phí đào tạo.
              </li>
              <li>
                <strong style={{ color: 'var(--text-main)' }}>Bảo vệ giấy tờ cá nhân:</strong> Không giao bản gốc CCCD/CMND hoặc thẻ sinh viên cho bất kỳ đơn vị nào.
              </li>
              <li>
                Cảnh giác trước các lời mời gọi "việc nhẹ lương cao bất thường" hoặc yêu cầu nhận hàng gia công tại nhà đóng tiền thế chân.
              </li>
            </ul>
          </div>
        </div>

        {onReportClick && (
          <button
            onClick={onReportClick}
            className="btn btn-secondary"
            style={{
              padding: '0.4rem 0.85rem',
              fontSize: '0.82rem',
              color: '#dc2626',
              borderColor: 'rgba(239, 68, 68, 0.3)',
              background: 'rgba(239, 68, 68, 0.05)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              whiteSpace: 'nowrap',
              alignSelf: 'center'
            }}
          >
            <Flag size={14} /> Báo cáo tin này
          </button>
        )}
      </div>
    </div>
  );
};
