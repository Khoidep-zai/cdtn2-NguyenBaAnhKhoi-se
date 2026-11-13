import React, { useState, useRef, useEffect } from 'react';
import { 
  Briefcase, 
  ShieldCheck, 
  Database, 
  ScrollText, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Mail, 
  Building2, 
  Users, 
  X,
  FileCheck2
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import './ModernDialog.css';

interface PolicyModalData {
  title: string;
  badge: string;
  content: string[];
}

export const Footer: React.FC = () => {
  const { t, language } = useLanguage();
  const [activePolicy, setActivePolicy] = useState<PolicyModalData | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (activePolicy) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [activePolicy]);

  const openPolicy = (type: 'terms' | 'privacy' | 'regulation' | 'complaint') => {
    if (language === 'vi') {
      switch (type) {
        case 'terms':
          setActivePolicy({
            title: 'Điều Khoản Dịch Vụ & Sử Dụng Hệ Thống',
            badge: 'Doanh nghiệp & Sinh viên',
            content: [
              '1. Phạm vi áp dụng: Áp dụng cho mọi người dùng gồm Sinh viên tìm việc, Nhà tuyển dụng đối tác và Quản trị viên hệ thống FreelanceHub.',
              '2. Tính minh bạch thông tin: Nhà tuyển dụng cam kết mọi tin tuyển dụng part-time / freelance đều nêu rõ mức lương, hình thức làm việc, địa điểm và quyền lợi sinh viên.',
              '3. Quyền lợi sinh viên: Sinh viên được bảo vệ tuyệt đối về thông tin cá nhân, có quyền từ chối các yêu cầu đặt cọc hoặc nạp tiền trái quy định pháp luật.',
              '4. Cam kết bảo mật: Mật khẩu được mã hóa chuẩn BCrypt một chiều; hỗ trợ xác thực không mật khẩu WebAuthn FIDO2 chuẩn quốc tế.'
            ]
          });
          break;
        case 'privacy':
          setActivePolicy({
            title: 'Chính Sách Bảo Mật Quyền Riêng Tư (Privacy Policy)',
            badge: 'Bảo mật tiêu chuẩn quốc tế',
            content: [
              '1. Thu thập dữ liệu: FreelanceHub chỉ thu thập thông tin cần thiết phục vụ hồ sơ ứng tuyển, gửi email thông báo trạng thái đơn và xác thực tài khoản.',
              '2. Mã hóa dữ liệu truyền tải: Toàn bộ đường truyền kết nối được mã hóa chuẩn SSL/TLS 256-bit giữa client và đám mây Neon PostgreSQL.',
              '3. Không chia sẻ dữ liệu thứ ba: Không mua bán hay chuyển giao hồ sơ CV của sinh viên cho bất kỳ bên thứ ba nào ngoài nhà tuyển dụng mà ứng viên nộp hồ sơ.',
              '4. Quyền chỉnh sửa và xóa tài khoản: Người dùng có quyền truy cập, cập nhật CV, đổi mật khẩu hoặc yêu cầu xóa dữ liệu cá nhân theo quy định.'
            ]
          });
          break;
        case 'regulation':
          setActivePolicy({
            title: 'Quy Chế Hoạt Động Sàn FreelanceHub',
            badge: 'Tuân thủ Nghị quyết 202/2025/QH15',
            content: [
              '1. Tiêu chuẩn tin đăng: Tất cả công việc đăng tải đều được phân loại theo 16 nhóm ngành tiêu chuẩn với mức lương minh bạch (theo giờ, theo dự án, theo tháng).',
              '2. Chống lừa đảo và tin rác: Hệ thống quét kiểm duyệt tự động các từ khóa nhạy cảm, cảnh báo việc làm rủi ro hoặc yêu cầu nộp lệ phí.',
              '3. Cơ chế đánh giá hai chiều: Sinh viên đánh giá sao và phản hồi nhà tuyển dụng sau khi hoàn thành công việc để nâng cao độ tin cậy cộng đồng.',
              '4. Xử lý vi phạm: Khóa tài khoản vĩnh viễn và gỡ bỏ toàn bộ bài đăng đối với các tài khoản có hành vi gian lận hoặc tuyển dụng sai sự thật.'
            ]
          });
          break;
        case 'complaint':
          setActivePolicy({
            title: 'Quy Trình Tiếp Nhận & Giải Quyết Khiếu Nại',
            badge: 'Hỗ trợ sinh viên 24/7',
            content: [
              '1. Tiếp nhận báo cáo: Sinh viên có thể bấm "Báo cáo tin đăng" ngay tại chi tiết công việc hoặc gửi phản ánh về support@freelancehub.vn.',
              '2. Thời gian phản hồi: Bộ phận Admin và Kiểm duyệt cam kết xử lý khiếu nại trong vòng 24 - 48 giờ làm việc.',
              '3. Bảo vệ quyền lợi ứng viên: Trong trường hợp nhà tuyển dụng chậm trả lương hoặc vi phạm cam kết, sàn sẽ tạm giữ tư cách hoạt động của doanh nghiệp và hỗ trợ sinh viên đối soát.',
              '4. Đường dây nóng: Hotline 1900 6868 (8:00 - 21:00 hàng ngày).'
            ]
          });
          break;
      }
    } else {
      switch (type) {
        case 'terms':
          setActivePolicy({
            title: 'Terms of Service & Platform Policy',
            badge: 'Enterprise & Student Terms',
            content: [
              '1. Scope: Applies to all users including students seeking part-time/freelance jobs, partner recruiters, and system administrators.',
              '2. Transparency: Employers must specify job requirements, working hours, exact salary, and work location with zero deceptive fees.',
              '3. Student Safety: Zero tolerance for scam job postings or recruitment fraud. Students are safeguarded against fraudulent deposits.',
              '4. Enterprise Security: End-to-end BCrypt password encryption and FIDO2 Passkey biometric authentication.'
            ]
          });
          break;
        case 'privacy':
          setActivePolicy({
            title: 'Privacy & Data Protection Policy',
            badge: 'International Security Standard',
            content: [
              '1. Data Collection: Only strictly necessary contact and CV credentials are collected to facilitate direct job applications.',
              '2. Network Encryption: 100% of API communications are secured with TLS 1.3 / SSL 256-bit encryption on Neon PostgreSQL.',
              '3. Zero Third-Party Selling: Candidate resumes are never shared or sold to unauthorized third parties.',
              '4. Data Ownership: Users retain complete control to update their profile or request data purging at any time.'
            ]
          });
          break;
        case 'regulation':
          setActivePolicy({
            title: 'Platform Operating Regulations',
            badge: 'Resolution 202/2025/QH15 Compliant',
            content: [
              '1. 16 Standardized Categories: Jobs are categorized strictly according to official occupational standards.',
              '2. Fraud Prevention: Automated scam heuristics detect suspicious postings and trigger real-time warning banners.',
              '3. Mutual Rating: Transparent two-way peer review between students and recruiters builds long-term institutional trust.',
              '4. Penalties: Immediate suspension and blacklisting for fraudulent accounts.'
            ]
          });
          break;
        case 'complaint':
          setActivePolicy({
            title: 'Dispute Resolution & Grievance Mechanism',
            badge: '24/7 Candidate Support',
            content: [
              '1. Reporting: Students can report suspicious jobs directly via the "Report Job" modal or via support@freelancehub.vn.',
              '2. Resolution SLA: Admin review and dispute investigation completed within 24 to 48 business hours.',
              '3. Candidate Safeguard: Immediate employer freeze upon confirmed wage withholding or labor guideline breaches.',
              '4. Direct Support Line: 1900 6868 (8:00 AM - 9:00 PM GMT+7).'
            ]
          });
          break;
      }
    }
  };

  return (
    <footer className="footer">
      <div className="container" style={{ textAlign: 'center' }}>
        {/* Brand Header */}
        <div className="footer-top-brand">
          <Briefcase size={22} />
          <span>{t('footer.brand')}</span>
        </div>

        {/* Academic Course Information */}
        <p className="footer-academic">
          {t('footer.course')}
        </p>

        {/* The Bottom Line Replaced as Requested */}
        <div className="footer-copyright-main">
          <span>&copy;2026FreelanceHub</span>
          <span style={{ opacity: 0.5, fontWeight: 400 }}>&bull;</span>
          <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>
            {language === 'vi' ? 'Nền tảng kết nối việc làm sinh viên chuẩn doanh nghiệp' : 'Enterprise-Grade Student Job Marketplace'}
          </span>
        </div>

        {/* Divider */}
        <hr className="footer-divider" />

        {/* Enterprise Trust & Technical Badges */}
        <div className="footer-enterprise-badges">
          <span className="footer-badge-pill">
            <ShieldCheck size={14} color="#10b981" />
            <span>{t('footer.security')}</span>
          </span>
          <span className="footer-badge-pill">
            <Database size={14} color="#6366f1" />
            <span>{t('footer.cloud')}</span>
          </span>
          <span className="footer-badge-pill">
            <ScrollText size={14} color="#f59e0b" />
            <span>{t('footer.resolution')}</span>
          </span>
          <span className="footer-badge-pill" style={{ borderColor: 'rgba(16, 185, 129, 0.4)' }}>
            <span className="footer-pulse-dot" />
            <span style={{ color: '#10b981', fontWeight: 600 }}>{t('footer.systemStatus')}</span>
          </span>
        </div>

        {/* Enterprise Quick Legal & Policy Links */}
        <div className="footer-nav-links">
          <button type="button" className="footer-btn-link" onClick={() => openPolicy('terms')}>
            <FileCheck2 size={14} />
            <span>{t('footer.terms')}</span>
          </button>
          <span style={{ color: 'var(--border-color)', userSelect: 'none' }}>|</span>
          <button type="button" className="footer-btn-link" onClick={() => openPolicy('privacy')}>
            <ShieldCheck size={14} />
            <span>{t('footer.privacy')}</span>
          </button>
          <span style={{ color: 'var(--border-color)', userSelect: 'none' }}>|</span>
          <button type="button" className="footer-btn-link" onClick={() => openPolicy('regulation')}>
            <Building2 size={14} />
            <span>{t('footer.operatingRegulation')}</span>
          </button>
          <span style={{ color: 'var(--border-color)', userSelect: 'none' }}>|</span>
          <button type="button" className="footer-btn-link" onClick={() => openPolicy('complaint')}>
            <CheckCircle2 size={14} />
            <span>{t('footer.dispute')}</span>
          </button>
        </div>

        {/* Enterprise Organization & Contact Info */}
        <div className="footer-enterprise-info">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
            <Building2 size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{t('footer.organization')}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
            <MapPin size={13} style={{ color: 'var(--text-light)', flexShrink: 0 }} />
            <span>{t('footer.address')}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.65rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <Phone size={13} style={{ color: 'var(--text-light)' }} />
              <span>Hotline: <strong>1900 6868</strong></span>
            </span>
            <span style={{ opacity: 0.4 }}>&bull;</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <Mail size={13} style={{ color: 'var(--text-light)' }} />
              <span>Email: <strong>support@freelancehub.vn</strong></span>
            </span>
          </div>

          <div style={{ fontSize: '0.775rem', color: 'var(--text-light)', opacity: 0.85, paddingTop: '0.25rem', borderTop: '1px dashed var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
              <Users size={13} />
              <span>{t('footer.team')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enterprise Policy HTML5 Dialog Modal */}
      <dialog ref={dialogRef} className="modern-dialog" style={{ maxWidth: '620px' }}>
        {activePolicy && (
          <div>
            <button 
              type="button" 
              className="modern-dialog-close-btn" 
              onClick={() => setActivePolicy(null)}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span className="footer-badge-pill" style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }}>
                {activePolicy.badge}
              </span>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.25rem', lineHeight: 1.35 }}>
              {activePolicy.title}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.75rem', maxHeight: '55vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
              {activePolicy.content.map((paragraph, idx) => (
                <div key={idx} style={{ 
                  background: 'var(--bg-card-subtle)', 
                  padding: '0.85rem 1rem', 
                  borderRadius: 'var(--radius-md, 8px)',
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                  color: 'var(--text-main)',
                  border: '1px solid var(--border-color)'
                }}>
                  {paragraph}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button 
                type="button" 
                className="btn btn-primary" 
                style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}
                onClick={() => setActivePolicy(null)}
              >
                {language === 'vi' ? 'Tôi đã hiểu & Đóng' : 'Understood & Close'}
              </button>
            </div>
          </div>
        )}
      </dialog>
    </footer>
  );
};
