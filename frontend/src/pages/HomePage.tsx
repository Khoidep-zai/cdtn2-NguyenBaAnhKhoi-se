import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, TrendingUp, ShieldCheck, MapPin, Database, ArrowRight, Briefcase, Layers, Flame } from 'lucide-react';
import { JobCard } from '../components/jobs/JobCard';
import { HubbieMascot } from '../components/common/HubbieMascot';
import { Job, Category } from '../types';
import { jobService } from '../services/jobService';
import { useLanguage } from '../context/LanguageContext';
import { cleanMojibake } from '../utils/textUtils';

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
    category: { id: 2, name: 'Phục vụ, Nhà hàng & Khách sạn', slug: 'phuc-vu-nha-hang' },
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
    category: { id: 1, name: 'Lập trình & CNTT', slug: 'lap-trinh-cntt' },
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
    category: { id: 7, name: 'Marketing, Truyền thông & Content', slug: 'marketing-content' },
    employer: { id: 4, fullName: 'Media Group Hà Nội', companyName: 'Media Group Hà Nội' }
  }
];

const INITIAL_CATEGORIES: Category[] = [
  { id: 1, name: 'Lập trình & CNTT', slug: 'lap-trinh-cntt', icon: 'code' },
  { id: 2, name: 'Phục vụ, Nhà hàng & Khách sạn', slug: 'phuc-vu-nha-hang', icon: 'coffee' },
  { id: 3, name: 'Gia sư & Dạy kèm', slug: 'gia-su-day-kem', icon: 'book-open' },
  { id: 4, name: 'Bán hàng & Chăm sóc khách hàng', slug: 'ban-hang-cskh', icon: 'shopping-bag' },
  { id: 5, name: 'Kỹ thuật, Điện & Viễn thông', slug: 'ky-thuat-dien-tu', icon: 'cpu' },
  { id: 6, name: 'Logistics, Giao hàng & Kho vận', slug: 'logistics-kho-van', icon: 'truck' },
  { id: 7, name: 'Marketing, Truyền thông & Content', slug: 'marketing-content', icon: 'feather' },
  { id: 8, name: 'Dịch thuật & Biên dịch', slug: 'dich-thuat', icon: 'globe' },
  { id: 9, name: 'Hành chính & Nhân sự', slug: 'hanh-chinh-nhan-su', icon: 'users' },
  { id: 10, name: 'Lao động & Việc làm khác', slug: 'viec-lam-khac', icon: 'briefcase' },
  { id: 11, name: 'Môi trường & Năng lượng', slug: 'moi-truong-nang-luong', icon: 'leaf' },
  { id: 12, name: 'Lao động phổ thông & Đóng gói', slug: 'lao-dong-pho-thong', icon: 'tool' },
  { id: 13, name: 'Thiết kế đồ họa & Media', slug: 'thiet-ke-do-hoa', icon: 'palette' },
  { id: 14, name: 'Tài chính & Kế toán', slug: 'tai-chinh-ke-toan', icon: 'pie-chart' },
  { id: 15, name: 'Kiến trúc & Xây dựng', slug: 'kien-truc-xay-dung', icon: 'home' },
  { id: 16, name: 'Y tế, Dược & Sức khỏe', slug: 'y-te-suc-khoe', icon: 'activity' }
];

const QUICK_PROVINCES = [
  'Hà Nội',
  'Hồ Chí Minh',
  'Đà Nẵng',
  'Cần Thơ',
  'Bình Dương',
  'Đồng Nai',
];

const getCategoryIcon = (icon?: string, slug?: string, id?: number) => {
  const key = (icon || slug || '').toLowerCase();
  if (key.includes('code') || key.includes('lap-trinh') || id === 1) return '💻';
  if (key.includes('coffee') || key.includes('phuc-vu') || id === 2) return '☕';
  if (key.includes('book') || key.includes('gia-su') || id === 3) return '📚';
  if (key.includes('shopping') || key.includes('ban-hang') || id === 4) return '🛒';
  if (key.includes('cpu') || key.includes('ky-thuat') || id === 5) return '⚡';
  if (key.includes('truck') || key.includes('logistics') || id === 6) return '🚚';
  if (key.includes('feather') || key.includes('marketing') || id === 7) return '📱';
  if (key.includes('globe') || key.includes('dich-thuat') || id === 8) return '🌐';
  if (key.includes('user') || key.includes('hanh-chinh') || id === 9) return '👥';
  if (key.includes('leaf') || key.includes('moi-truong') || id === 11) return '🌱';
  if (key.includes('tool') || key.includes('lao-dong-pho-thong') || id === 12) return '📦';
  if (key.includes('palette') || key.includes('thiet-ke') || id === 13) return '🎨';
  if (key.includes('pie') || key.includes('tai-chinh') || id === 14) return '📊';
  if (key.includes('home') || key.includes('kien-truc') || id === 15) return '🏗️';
  if (key.includes('activity') || key.includes('y-te') || id === 16) return '💊';
  return '💼';
};

export const HomePage: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>(MOCK_FEATURED_JOBS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [categoryCounts, setCategoryCounts] = useState<Record<number, number>>({});
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    // Fetch categories and live job counts
    const fetchCategoriesData = async () => {
      try {
        const catList = await jobService.getCategories();
        if (isMounted && catList && catList.length > 0) {
          setCategories(catList);
          // Fetch counts for each category
          const countPromises = catList.map(async (c: Category) => {
            try {
              const res = await jobService.getJobs({ categoryId: c.id, size: 1 });
              return { id: c.id, count: res?.totalElements ?? 0 };
            } catch {
              return { id: c.id, count: 0 };
            }
          });

          const results = await Promise.allSettled(countPromises);
          if (isMounted) {
            const countsMap: Record<number, number> = {};
            results.forEach((r) => {
              if (r.status === 'fulfilled' && r.value) {
                countsMap[r.value.id] = r.value.count;
              }
            });
            setCategoryCounts(countsMap);
          }
        }
      } catch {
        // Fallback to initial
      }
    };

    // Fetch featured/hot jobs (status OPEN, latest by created_at, deadline not expired)
    const fetchFeatured = async () => {
      try {
        const res = await jobService.getJobs({ size: 12 });
        if (isMounted && res && res.content && res.content.length > 0) {
          const now = new Date();
          const validJobs = res.content
            .filter((j) => j.status === 'OPEN' && (!j.deadline || new Date(j.deadline) >= now))
            .slice(0, 8);
          if (validJobs.length > 0) {
            setFeaturedJobs(validJobs);
          }
        }
      } catch {
        // Fallback to mock
      }
    };

    fetchCategoriesData();
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
          {/* Mascot Greeting */}
          <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'center' }}>
            <HubbieMascot
              size={68}
              message={
                language === 'vi'
                  ? 'Chào bạn! Cùng Ong Vàng tìm ngay việc làm thêm chuẩn uy tín nhé 🐝'
                  : 'Welcome! Let Hubbie help you find verified freelance & part-time jobs 🐝'
              }
            />
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'var(--bg-card)',
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
            <Sparkles size={16} /> {t('home.badge')}
          </div>

          <h1 className="hero-title">
            <span className="hero-title-part">{t('home.heroTitle1')} </span>
            <span className="hero-gradient">{t('home.heroTitle2')}</span>
          </h1>

          <p className="hero-desc">
            {t('home.heroDesc')}
          </p>

          <form onSubmit={handleSearch} className="search-box">
            <Search size={22} color="var(--text-light)" style={{ marginLeft: '0.5rem' }} />
            <input
              type="text"
              aria-label={t('home.searchPlaceholder')}
              placeholder={t('home.searchPlaceholder')}
              className="search-input"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button type="submit" className="btn btn-primary search-submit-btn" style={{ padding: '0.85rem 1.75rem', fontWeight: 700 }}>
              {t('home.searchBtn')}
            </button>
          </form>

          {/* Quick Province Links in Hero */}
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t('home.popularProvinces')}</span>
            {QUICK_PROVINCES.map((prov) => (
              <button
                key={prov}
                onClick={() => navigate(`/jobs?province=${encodeURIComponent(prov)}`)}
                className="quick-province-pill"
              >
                <MapPin size={12} color="var(--primary)" /> {prov}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '2rem 0' }}>
        <div className="container stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
          <div className="stat-item">
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>
              <Briefcase size={24} /> 1.470+
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.25rem' }}>{t('home.statJobs')}</div>
          </div>
          <div className="stat-item">
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontSize: '2rem', fontWeight: 800, color: '#059669' }}>
              <Layers size={24} /> 16
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.25rem' }}>{t('home.statCats')}</div>
          </div>
          <div className="stat-item">
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontSize: '2rem', fontWeight: 800, color: '#d97706' }}>
              <MapPin size={24} /> 34+
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.25rem' }}>{t('home.statProvs')}</div>
          </div>
          <div className="stat-item">
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontSize: '1.85rem', fontWeight: 800, color: 'var(--primary)' }}>
              <Database size={24} /> Multi-DB
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.25rem' }}>MySQL & PostgreSQL Core</div>
          </div>
        </div>
      </section>

      {/* Ngành Nghề Trọng Điểm / Key Industries */}
      <section style={{ padding: '3.5rem 0', background: 'var(--bg-main)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                color: 'var(--primary)',
                fontWeight: 700,
                fontSize: '0.85rem',
                marginBottom: '0.5rem',
                background: 'var(--primary-light)',
                padding: '0.25rem 0.75rem',
                borderRadius: 'var(--radius-full)',
              }}
            >
              <Layers size={15} /> {language === 'vi' ? 'NGÀNH NGHỀ TRỌNG ĐIỂM' : 'KEY INDUSTRIES'}
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              {t('home.catTitle')}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              {t('home.catDesc')}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {categories.map((cat) => {
              const count = categoryCounts[cat.id];
              return (
                <div
                  key={cat.id}
                  onClick={() => navigate(`/jobs?category=${cat.id}`)}
                  style={{
                    background: 'var(--bg-card)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-color)',
                    padding: '1.25rem 1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }}
                >
                  <div
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      background: 'rgba(67, 56, 202, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.6rem',
                      marginBottom: '0.75rem',
                    }}
                  >
                    {getCategoryIcon(cat.icon, cat.slug, cat.id)}
                  </div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      color: 'var(--text-main)',
                      lineHeight: 1.35,
                      minHeight: '2.6em',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {cleanMojibake(cat.name)}
                  </div>
                  <div
                    style={{
                      marginTop: '0.5rem',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: 'var(--primary)',
                      background: 'var(--primary-light)',
                      padding: '0.2rem 0.65rem',
                      borderRadius: 'var(--radius-full)',
                    }}
                  >
                    {count !== undefined ? `${count} việc làm` : 'Đang tải...'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Việc Làm Nổi Bật / Hot Jobs */}
      <section style={{ padding: '4rem 0', background: 'var(--bg-card)' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  color: '#dc2626',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  marginBottom: '0.35rem',
                  background: 'rgba(239, 68, 68, 0.1)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                }}
              >
                <Flame size={16} color="#dc2626" />
                {language === 'vi' ? 'VIỆC LÀM NỔI BẬT / HOT JOBS' : 'FEATURED & HOT JOBS'}
              </div>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem' }}>
                {t('home.featuredTitle')}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                {t('home.featuredDesc')}
              </p>
            </div>
            <button
              onClick={() => navigate('/jobs')}
              className="btn btn-primary"
              style={{ padding: '0.65rem 1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              {t('home.viewAll')} <ArrowRight size={16} />
            </button>
          </div>

          <div className="job-grid">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} isHot={true} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Highlights */}
      <section style={{ background: 'var(--bg-main)', borderTop: '1px solid var(--border-color)', padding: '3.5rem 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
            <div style={{ background: '#dcfce7', padding: '0.75rem', borderRadius: 'var(--radius-md)', color: '#16a34a', flexShrink: 0 }}>
              <ShieldCheck size={28} />
            </div>
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: '0.25rem', color: 'var(--text-main)' }}>{t('home.trust1Title')}</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('home.trust1Desc')}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
            <div style={{ background: '#e0e7ff', padding: '0.75rem', borderRadius: 'var(--radius-md)', color: '#4f46e5', flexShrink: 0 }}>
              <TrendingUp size={28} />
            </div>
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: '0.25rem', color: 'var(--text-main)' }}>{t('home.trust2Title')}</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('home.trust2Desc')}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
            <div style={{ background: '#fef3c7', padding: '0.75rem', borderRadius: 'var(--radius-md)', color: '#d97706', flexShrink: 0 }}>
              <Database size={28} />
            </div>
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: '0.25rem', color: 'var(--text-main)' }}>{t('home.trust3Title')}</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('home.trust3Desc')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
