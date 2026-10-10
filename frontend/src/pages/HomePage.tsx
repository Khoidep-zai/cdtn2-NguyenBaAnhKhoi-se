import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, TrendingUp, ShieldCheck, MapPin, Database, Award, ArrowRight } from 'lucide-react';
import { JobCard } from '../components/jobs/JobCard';
import { Job } from '../types';
import { jobService } from '../services/jobService';

const MOCK_FEATURED_JOBS: Job[] = [
  {
    id: 1,
    title: 'Tuyển nhân viên Barista & Phục vụ ca tối',
    description: 'Pha chế đồ uống theo công thức, phục vụ khách hàng, dọn dẹp quầy ca tối từ 17h00 - 22h00 các ngày trong tuần. Môi trường trẻ trung, linh hoạt thời gian theo lịch học.',
    jobType: 'PART_TIME',
    workMode: 'ONSITE',
    location: 'Bình Thạnh, TP.HCM',
    province: 'Hồ Chí Minh',
    salaryType: 'HOURLY',
    salaryAmount: 28000,
    salaryText: '28.000 - 32.000 đ/giờ',
    workingHours: 'Ca 18h - 22h (Linh hoạt)',
    studentFriendly: true,
    slotsAvailable: 3,
    status: 'OPEN',
    createdAt: '2026-10-02',
    category: { id: 4, name: 'Phục vụ & Pha chế (F&B)', slug: 'phuc-vu' },
    employer: { id: 2, fullName: 'Nguyễn Thị Tuyết', companyName: 'The Coffee House Bình Thạnh' }
  },
  {
    id: 2,
    title: 'Lập trình Landing Page giới thiệu sản phẩm bằng React',
    description: 'Xây dựng trang đích quảng bá sản phẩm mới dựa trên bản thiết kế Figma có sẵn. Yêu cầu responsive chuẩn máy tính và điện thoại. Hỗ trợ sinh viên làm đồ án.',
    jobType: 'FREELANCE',
    workMode: 'REMOTE',
    location: 'Toàn quốc',
    province: 'Toàn quốc',
    salaryType: 'FIXED_PROJECT',
    salaryAmount: 2500000,
    salaryText: '2.500.000 đ (trọn gói)',
    workingHours: 'Chủ động thời gian',
    studentFriendly: true,
    slotsAvailable: 1,
    status: 'OPEN',
    createdAt: '2026-10-02',
    category: { id: 1, name: 'Lập trình & CNTT', slug: 'cntt' },
    employer: { id: 3, fullName: 'Trần Văn Minh', companyName: 'Innovate Studio' }
  },
  {
    id: 3,
    title: 'Thực tập sinh Marketing & Sáng tạo nội dung TikTok',
    description: 'Lên kịch bản và quay dựng video ngắn theo xu hướng giới trẻ. Tham gia xây dựng kênh truyền thông cho nhãn hàng trẻ trung.',
    jobType: 'INTERNSHIP',
    workMode: 'HYBRID',
    location: 'Cầu Giấy, Hà Nội',
    province: 'Hà Nội',
    salaryType: 'MONTHLY',
    salaryAmount: 4000000,
    salaryText: '3.000.000 - 5.000.000 đ/tháng',
    workingHours: 'Bán thời gian 20h/tuần',
    studentFriendly: true,
    slotsAvailable: 2,
    status: 'OPEN',
    createdAt: '2026-10-02',
    category: { id: 7, name: 'Marketing & Truyền thông', slug: 'marketing' },
    employer: { id: 4, fullName: 'Media Group Hà Nội', companyName: 'Media Group Hà Nội' }
  }
];

const QUICK_PROVINCES = [
  'Hà Nội',
  'Hồ Chí Minh',
  'Đà Nẵng',
  'Cần Thơ',
  'Bình Dương',
  'Đồng Nai',
];

const POPULAR_CATEGORIES = [
  { id: 1, name: 'Lập trình & CNTT', icon: '💻' },
  { id: 2, name: 'Thiết kế & Video', icon: '🎨' },
  { id: 3, name: 'Gia sư & Dạy kèm', icon: '📚' },
  { id: 4, name: 'Phục vụ & Pha chế', icon: '☕' },
  { id: 7, name: 'Marketing & Media', icon: '📱' },
  { id: 5, name: 'Bán hàng & Thu ngân', icon: '🛒' },
];

export const HomePage: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>(MOCK_FEATURED_JOBS);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchFeatured = async () => {
      try {
        const res = await jobService.getJobs({ size: 6 });
        if (isMounted && res && res.content && res.content.length > 0) {
          setFeaturedJobs(res.content);
        }
      } catch {
        // Fallback to mock
      }
    };
    fetchFeatured();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/jobs?keyword=${encodeURIComponent(keyword.trim())}`);
    } else {
      navigate('/jobs');
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'white',
              padding: '0.4rem 1rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-color)',
              marginBottom: '1.25rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: 'var(--primary)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <Sparkles size={16} /> 1.450+ Việc làm VietJobs chuẩn hóa theo Nghị quyết 202/2025/QH15
          </div>

          <h1 className="hero-title">
            Tìm việc làm thêm an toàn, <br />
            <span className="hero-gradient">Bứt phá kỹ năng & Thu nhập</span>
          </h1>

          <p className="hero-desc">
            Nền tảng kết nối sinh viên với các công việc part-time, dự án freelance và kỳ thực tập ngắn hạn.
            Xác minh độ uy tín, thanh toán minh bạch, linh hoạt theo lịch học trên cả hai nền tảng PostgreSQL & MySQL.
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
            <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontWeight: 700 }}>
              Tìm kiếm việc làm
            </button>
          </form>

          {/* Quick Province Links in Hero */}
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Tỉnh thành phổ biến:</span>
            {QUICK_PROVINCES.map((prov) => (
              <button
                key={prov}
                onClick={() => navigate(`/jobs?province=${encodeURIComponent(prov)}`)}
                style={{
                  background: 'white',
                  border: '1px solid var(--border-color)',
                  padding: '0.25rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                }}
              >
                <MapPin size={12} color="var(--primary)" /> {prov}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section style={{ background: 'white', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '2rem 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>1.450+</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.25rem' }}>Việc làm bán thời gian & Freelance</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#059669' }}>16</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.25rem' }}>Nhóm ngành nghề tiêu chuẩn</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#d97706' }}>34+</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.25rem' }}>Tỉnh/Thành phố toàn quốc</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#4f46e5' }}>MySQL & Postgres</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.25rem' }}>Hỗ trợ đồng bộ 2 CSDL cốt lõi</div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section style={{ padding: '3.5rem 0', background: 'var(--bg-main)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>Khám phá theo ngành nghề</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Chọn lĩnh vực phù hợp với chuyên ngành và sở thích của bạn</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
            {POPULAR_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                onClick={() => navigate(`/jobs?category=${cat.id}`)}
                style={{
                  background: 'white',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  padding: '1.25rem 1rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{cat.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>{cat.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Khám phá cơ hội →</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section style={{ padding: '4rem 0', background: 'white' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <Award size={16} /> Cơ hội việc làm tuyển chọn
              </div>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)' }}>Việc làm nổi bật mới nhất</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Các vị trí part-time, dự án freelance và thực tập sinh đang mở tuyển</p>
            </div>
            <button onClick={() => navigate('/jobs')} className="btn btn-primary" style={{ padding: '0.65rem 1.25rem' }}>
              Xem tất cả 1.450+ việc làm <ArrowRight size={16} />
            </button>
          </div>

          <div className="job-grid">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Highlights */}
      <section style={{ background: 'var(--bg-main)', borderTop: '1px solid var(--border-color)', padding: '3.5rem 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
            <div style={{ background: '#dcfce7', padding: '0.75rem', borderRadius: 'var(--radius-md)', color: '#16a34a', flexShrink: 0 }}>
              <ShieldCheck size={28} />
            </div>
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>100% Tin tuyển dụng xác minh</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Bảo vệ sinh viên khỏi các bẫy cọc tiền, tin tuyển dụng ảo và vi phạm luật lao động.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
            <div style={{ background: '#e0e7ff', padding: '0.75rem', borderRadius: 'var(--radius-md)', color: '#4f46e5', flexShrink: 0 }}>
              <TrendingUp size={28} />
            </div>
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Đánh giá 2 chiều minh bạch</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Xây dựng hồ sơ uy tín thực tế cho cả sinh viên và nhà tuyển dụng sau mỗi công việc.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
            <div style={{ background: '#fef3c7', padding: '0.75rem', borderRadius: 'var(--radius-md)', color: '#d97706', flexShrink: 0 }}>
              <Database size={28} />
            </div>
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Linh hoạt đa cơ sở dữ liệu</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Hệ thống hỗ trợ đồng bộ hoàn hảo trên cả PostgreSQL 18 và MySQL 8 với 1.450+ việc làm thực tế.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
