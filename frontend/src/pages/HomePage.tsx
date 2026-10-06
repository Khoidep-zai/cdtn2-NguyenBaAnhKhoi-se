import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, CheckCircle2, TrendingUp, ShieldCheck } from 'lucide-react';
import { JobCard } from '../components/jobs/JobCard';
import { Job } from '../types';

const MOCK_FEATURED_JOBS: Job[] = [
  {
    id: 1,
    title: 'Tuyển nhân viên Barista & Phục vụ ca tối',
    description: 'Pha chế đồ uống theo công thức, phục vụ khách hàng, dọn dẹp quầy ca tối từ 17h00 - 22h00 các ngày trong tuần. Môi trường trẻ trung, linh hoạt thời gian theo lịch học.',
    jobType: 'PART_TIME',
    workMode: 'ONSITE',
    location: 'Bình Thạnh, TP.HCM',
    salaryType: 'HOURLY',
    salaryAmount: 28000,
    slotsAvailable: 3,
    status: 'OPEN',
    createdAt: '2026-10-02',
    category: { id: 4, name: 'Phục vụ & Bán hàng', slug: 'phuc-vu' },
    employer: { id: 2, fullName: 'Nguyễn Thị Tuyết', companyName: 'The Coffee House Bình Thạnh' }
  },
  {
    id: 2,
    title: 'Lập trình Landing Page giới thiệu sản phẩm bằng React',
    description: 'Xây dựng trang đích quảng bá sản phẩm mới dựa trên bản thiết kế Figma có sẵn. Yêu cầu responsive chuẩn máy tính và điện thoại. Hỗ trợ sinh viên làm đồ án.',
    jobType: 'FREELANCE',
    workMode: 'REMOTE',
    location: 'Toàn quốc',
    salaryType: 'FIXED_PROJECT',
    salaryAmount: 2500000,
    slotsAvailable: 1,
    status: 'OPEN',
    createdAt: '2026-10-02',
    category: { id: 1, name: 'Lập trình & CNTT', slug: 'cntt' },
    employer: { id: 3, fullName: 'Trần Văn Minh', companyName: 'Innovate Studio' }
  },
  {
    id: 3,
    title: 'Thiết kế bộ ấn phẩm Banner & Poster sự kiện',
    description: 'Thiết kế 5 poster và 10 ảnh định dạng vuông đăng Facebook/Instagram phục vụ tuần lễ giao lưu âm nhạc sinh viên. Yêu cầu biết sử dụng Photoshop/Canva.',
    jobType: 'FREELANCE',
    workMode: 'REMOTE',
    location: 'Toàn quốc',
    salaryType: 'FIXED_PROJECT',
    salaryAmount: 1500000,
    slotsAvailable: 1,
    status: 'OPEN',
    createdAt: '2026-10-02',
    category: { id: 2, name: 'Thiết kế đồ họa', slug: 'thiet-ke' },
    employer: { id: 3, fullName: 'Trần Văn Minh', companyName: 'Innovate Studio' }
  }
];

export const HomePage: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/jobs?keyword=${encodeURIComponent(keyword)}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'white', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)', marginBottom: '1.25rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>
            <Sparkles size={16} /> Nền tảng việc làm Part-time & Freelance Uy tín Sinh viên
          </div>
          <h1 className="hero-title">
            Tìm việc làm thêm an toàn, <br />
            <span className="hero-gradient">Bứt phá kỹ năng & Thu nhập</span>
          </h1>
          <p className="hero-desc">
            Kết nối sinh viên với các nhà tuyển dụng và dự án freelance ngắn hạn đã được xác minh. Không lo lừa đảo, minh bạch thù lao, tích lũy điểm uy tín.
          </p>

          <form onSubmit={handleSearch} className="search-box">
            <Search size={22} color="var(--text-light)" style={{ marginLeft: '0.5rem' }} />
            <input
              type="text"
              placeholder="Nhập vị trí công việc, kỹ năng (ví dụ: Barista, Lập trình React, Gia sư, Content...)"
              className="search-input"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem' }}>
              Tìm kiếm việc làm
            </button>
          </form>
        </div>
      </section>

      {/* Trust Highlights */}
      <section style={{ background: 'white', borderBottom: '1px solid var(--border-color)', padding: '2.5rem 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ background: '#dcfce7', padding: '0.75rem', borderRadius: 'var(--radius-md)', color: '#16a34a' }}>
              <ShieldCheck size={28} />
            </div>
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>100% Tin tuyển dụng xác minh</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Bảo vệ sinh viên khỏi các bẫy cọc tiền, tin tuyển dụng ảo.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ background: '#e0e7ff', padding: '0.75rem', borderRadius: 'var(--radius-md)', color: '#4f46e5' }}>
              <TrendingUp size={28} />
            </div>
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Đánh giá 2 chiều minh bạch</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Xây dựng hồ sơ uy tín thực tế cho cả sinh viên và nhà tuyển dụng.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ background: '#fef3c7', padding: '0.75rem', borderRadius: 'var(--radius-md)', color: '#d97706' }}>
              <CheckCircle2 size={28} />
            </div>
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Linh hoạt giờ học</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Lọc nhanh theo ca làm việc, hỗ trợ làm việc Remote / Onsite.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>Việc làm nổi bật mới nhất</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Các cơ hội part-time và dự án freelance đang tuyển ứng viên gấp</p>
            </div>
            <button onClick={() => navigate('/jobs')} className="btn btn-secondary">
              Xem tất cả việc làm →
            </button>
          </div>

          <div className="job-grid">
            {MOCK_FEATURED_JOBS.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
