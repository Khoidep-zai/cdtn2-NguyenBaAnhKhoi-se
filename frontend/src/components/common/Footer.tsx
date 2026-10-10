import React from 'react';
import { Briefcase, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container" style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>
          <Briefcase size={20} /> FreelanceHub — Marketplace việc làm sinh viên
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Đồ án môn học: <strong>Chuyên đề tốt nghiệp 2</strong> (261_71ITGR40303_04) — Khoa Công nghệ Thông tin, Trường Đại học Văn Lang.
        </p>
        <p style={{ color: 'var(--text-light)', fontSize: '0.825rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
          Thực hiện bởi <strong>Nhóm 8: Nguyễn Tấn Tài (PM), Nguyễn Bá Anh Khôi (BA), Hoàng Bảo Long (Tester)</strong> <Heart size={14} color="#ef4444" fill="#ef4444" />
        </p>
      </div>
    </footer>
  );
};
