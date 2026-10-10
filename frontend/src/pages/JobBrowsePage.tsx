import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Sparkles, MapPin, RotateCcw, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { JobCard } from '../components/jobs/JobCard';
import { Job, Category } from '../types';
import { jobService } from '../services/jobService';
import { useLanguage } from '../context/LanguageContext';

const DEFAULT_CATEGORIES: Category[] = [
  { id: 1, name: 'Lập trình & CNTT', slug: 'lap-trinh-cntt' },
  { id: 2, name: 'Thiết kế đồ họa & Video', slug: 'thiet-ke-do-hoa-video' },
  { id: 3, name: 'Gia sư & Dạy kèm', slug: 'gia-su-day-kem' },
  { id: 4, name: 'Phục vụ & Pha chế (F&B)', slug: 'phuc-vu-pha-che-fb' },
  { id: 5, name: 'Bán hàng & Thu ngân', slug: 'ban-hang-thu-ngan' },
  { id: 6, name: 'Viết lách & Biên dịch', slug: 'viet-lach-bien-dich' },
  { id: 7, name: 'Marketing & Truyền thông', slug: 'marketing-truyen-thong' },
  { id: 8, name: 'Hành chính & Nhập liệu', slug: 'hanh-chinh-nhap-lieu' },
  { id: 9, name: 'Chăm sóc khách hàng & Telesale', slug: 'cham-soc-khach-hang-telesale' },
  { id: 10, name: 'Giao hàng & Vận hành kho', slug: 'giao-hang-van-hanh-kho' },
  { id: 11, name: 'Sự kiện & PG/PB', slug: 'su-kien-pg-pb' },
  { id: 12, name: 'Nghiên cứu & Khảo sát thị trường', slug: 'nghien-cuu-khao-sat-thi-truong' },
  { id: 13, name: 'Kế toán & Tài chính', slug: 'ke-toan-tai-chinh' },
  { id: 14, name: 'Nhân sự & Tuyển dụng', slug: 'nhan-su-tuyen-dung' },
  { id: 15, name: 'Pháp lý & Hành chính công', slug: 'phap-ly-hanh-chinh-cong' },
  { id: 16, name: 'Việc làm thời vụ & Khác', slug: 'viec-lam-thoi-vu-khac' },
];

const POPULAR_PROVINCES = [
  'Hà Nội',
  'Hồ Chí Minh',
  'Đà Nẵng',
  'Cần Thơ',
  'Bình Dương',
  'Đồng Nai',
  'Hải Phòng',
  'Khánh Hòa',
  'Bà Rịa - Vũng Tàu',
  'Thừa Thiên Huế',
  'Quảng Ninh',
  'Bắc Ninh',
  'Lâm Đồng',
];

const INITIAL_FALLBACK_JOBS: Job[] = [
  {
    id: 1,
    title: 'Tuyển nhân viên Barista & Phục vụ ca tối',
    description: 'Pha chế đồ uống theo công thức, phục vụ khách hàng, dọn dẹp quầy ca tối từ 17h00 - 22h00 các ngày trong tuần. Môi trường trẻ trung, linh hoạt thời gian theo lịch học.',
    requirements: 'Nhanh nhẹn, trung thực, ưu tiên sinh viên các trường ĐH/CĐ lân cận.',
    jobType: 'PART_TIME',
    workMode: 'ONSITE',
    location: 'Bình Thạnh, TP.HCM',
    province: 'Hồ Chí Minh',
    salaryType: 'HOURLY',
    salaryAmount: 28000,
    salaryText: '28.000 - 32.000 đ/giờ',
    workingHours: 'Ca 18h - 22h (Linh hoạt theo lịch học)',
    benefits: 'Hỗ trợ ăn uống giữa ca, thưởng lễ tết, môi trường thân thiện',
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
    requirements: 'Hiểu biết tốt về HTML, CSS, ReactJS. Bàn giao đúng hẹn.',
    jobType: 'FREELANCE',
    workMode: 'REMOTE',
    location: 'Toàn quốc',
    province: 'Toàn quốc',
    salaryType: 'FIXED_PROJECT',
    salaryAmount: 2500000,
    salaryText: '2.500.000 đ / dự án',
    workingHours: 'Làm việc tự do online',
    benefits: 'Review code chuyên sâu, mentor 1:1, hỗ trợ dấu thực tập',
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
    requirements: 'Yêu thích sáng tạo nội dung, bắt trend nhanh, biết dùng CapCut/Canva.',
    jobType: 'INTERNSHIP',
    workMode: 'HYBRID',
    location: 'Cầu Giấy, Hà Nội',
    province: 'Hà Nội',
    salaryType: 'MONTHLY',
    salaryAmount: 4000000,
    salaryText: '3 - 5 triệu/tháng + Thưởng view',
    workingHours: 'Bán thời gian 20h/tuần',
    benefits: 'Được đóng dấu mộc thực tập tốt nghiệp, cơ hội lên chính thức',
    studentFriendly: true,
    slotsAvailable: 2,
    status: 'OPEN',
    createdAt: '2026-10-02',
    category: { id: 7, name: 'Marketing & Truyền thông', slug: 'marketing' },
    employer: { id: 4, fullName: 'Media Group Hà Nội', companyName: 'Media Group Hà Nội' }
  }
];

export const JobBrowsePage: React.FC = () => {
  const { t, language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialKeyword = searchParams.get('keyword') || '';
  const initialProvince = searchParams.get('province') || 'ALL';
  const initialCategory = searchParams.get('category') || 'ALL';

  const [keyword, setKeyword] = useState(initialKeyword);
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedMode, setSelectedMode] = useState('ALL');
  const [selectedProvince, setSelectedProvince] = useState(initialProvince);
  const [selectedCategory, setSelectedCategory] = useState<number | 'ALL'>(initialCategory === 'ALL' ? 'ALL' : Number(initialCategory));
  const [studentOnly, setStudentOnly] = useState(false);

  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [provinces, setProvinces] = useState<string[]>(POPULAR_PROVINCES);

  const [jobs, setJobs] = useState<Job[]>(INITIAL_FALLBACK_JOBS);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize] = useState<number>(18);
  const [loading, setLoading] = useState(false);

  // Fetch categories and provinces once
  useEffect(() => {
    let isMounted = true;
    const fetchMetadata = async () => {
      try {
        const [cats, provs] = await Promise.allSettled([
          jobService.getCategories(),
          jobService.getProvinces(),
        ]);
        if (isMounted) {
          if (cats.status === 'fulfilled' && cats.value && cats.value.length > 0) {
            setCategories(cats.value);
          }
          if (provs.status === 'fulfilled' && provs.value && provs.value.length > 0) {
            // merge with popular provinces to keep distinct clean list
            const combined = Array.from(new Set([...provs.value, ...POPULAR_PROVINCES]));
            setProvinces(combined);
          }
        }
      } catch {
        // use defaults
      }
    };
    fetchMetadata();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch jobs
  const fetchJobs = useCallback(async (page: number = 0) => {
    setLoading(true);
    try {
      const res = await jobService.getJobs({
        keyword: keyword.trim() || undefined,
        jobType: selectedType !== 'ALL' ? selectedType : undefined,
        workMode: selectedMode !== 'ALL' ? selectedMode : undefined,
        province: selectedProvince !== 'ALL' ? selectedProvince : undefined,
        categoryId: selectedCategory !== 'ALL' ? Number(selectedCategory) : undefined,
        studentFriendly: studentOnly ? true : undefined,
        page,
        size: pageSize,
      });

      if (res && res.content) {
        setJobs(res.content);
        setTotalElements(res.totalElements || res.content.length);
        setTotalPages(res.totalPages || Math.ceil((res.totalElements || res.content.length) / pageSize) || 1);
        setCurrentPage(page);
      }
    } catch {
      // Local fallback filter
      const filtered = INITIAL_FALLBACK_JOBS.filter((job) => {
        const matchK = !keyword || job.title.toLowerCase().includes(keyword.toLowerCase()) || job.description.toLowerCase().includes(keyword.toLowerCase());
        const matchT = selectedType === 'ALL' || job.jobType === selectedType;
        const matchM = selectedMode === 'ALL' || job.workMode === selectedMode;
        const matchP = selectedProvince === 'ALL' || job.province === selectedProvince;
        const matchS = !studentOnly || job.studentFriendly;
        return matchK && matchT && matchM && matchP && matchS;
      });
      setJobs(filtered);
      setTotalElements(filtered.length);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [keyword, selectedType, selectedMode, selectedProvince, selectedCategory, studentOnly, pageSize]);

  useEffect(() => {
    fetchJobs(0);
  }, [fetchJobs]);

  const handleResetFilters = () => {
    setKeyword('');
    setSelectedType('ALL');
    setSelectedMode('ALL');
    setSelectedProvince('ALL');
    setSelectedCategory('ALL');
    setStudentOnly(false);
    setSearchParams({});
  };

  const handleQuickProvince = (prov: string) => {
    if (selectedProvince === prov) {
      setSelectedProvince('ALL');
    } else {
      setSelectedProvince(prov);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      {/* Header section */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.75rem', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
          <Sparkles size={14} /> {t('browse.headerBadge')}
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
          {t('browse.title')}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '800px', lineHeight: 1.6 }}>
          {t('browse.desc')}
        </p>
      </div>

      {/* Main Filter Panel */}
      <div
        style={{
          background: 'var(--bg-card)',
          padding: '1.5rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '2rem',
        }}
      >
        {/* Search Row */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <div
            style={{
              flex: '1 1 360px',
              display: 'flex',
              alignItems: 'center',
              background: 'var(--bg-main)',
              borderRadius: 'var(--radius-md)',
              padding: '0.65rem 1rem',
              border: '1px solid var(--border-color)',
            }}
          >
            <Search size={18} color="var(--text-muted)" />
            <input
              type="text"
              placeholder={t('browse.searchPlaceholder')}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                marginLeft: '0.65rem',
                width: '100%',
                fontSize: '0.95rem',
                color: 'var(--text-main)',
              }}
            />
          </div>

          <button
            onClick={() => fetchJobs(0)}
            className="btn btn-primary"
            style={{ padding: '0.65rem 1.5rem', fontWeight: 700 }}
          >
            <Search size={16} /> {t('browse.searchBtn')}
          </button>

          {(keyword || selectedType !== 'ALL' || selectedMode !== 'ALL' || selectedProvince !== 'ALL' || selectedCategory !== 'ALL' || studentOnly) && (
            <button
              onClick={handleResetFilters}
              className="btn btn-secondary"
              style={{ padding: '0.65rem 1rem', fontSize: '0.875rem' }}
              title={t('browse.clearFilters')}
            >
              <RotateCcw size={15} /> {t('browse.clearFilters')}
            </button>
          )}
        </div>

        {/* Dropdowns Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
          {/* Province Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
              {t('browse.provinceLabel')}
            </label>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-card)',
                outline: 'none',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--text-main)',
              }}
            >
              <option value="ALL">{t('browse.allProvinces')} ({provinces.length})</option>
              {provinces.map((prov) => (
                <option key={prov} value={prov}>
                  {prov}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
              {t('browse.categoryLabel')}
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
              style={{
                width: '100%',
                padding: '0.6rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-card)',
                outline: 'none',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--text-main)',
              }}
            >
              <option value="ALL">{t('browse.allCategories')} ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Job Type Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
              {t('browse.typeLabel')}
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-card)',
                outline: 'none',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--text-main)',
              }}
            >
              <option value="ALL">{t('browse.allTypes')}</option>
              <option value="PART_TIME">{t('browse.partTime')}</option>
              <option value="FREELANCE">{t('browse.freelance')}</option>
              <option value="INTERNSHIP">{t('browse.internship')}</option>
            </select>
          </div>

          {/* Work Mode Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
              {t('browse.modeLabel')}
            </label>
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-card)',
                outline: 'none',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--text-main)',
              }}
            >
              <option value="ALL">{t('browse.allModes')}</option>
              <option value="ONSITE">{t('browse.onsite')}</option>
              <option value="REMOTE">{t('browse.remote')}</option>
              <option value="HYBRID">{t('browse.hybrid')}</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Pills Row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginRight: '0.25rem' }}>
            {t('browse.quickFilter')}
          </span>

          {/* Student Friendly Pill */}
          <button
            onClick={() => setStudentOnly(!studentOnly)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'var(--transition)',
              background: studentOnly ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'var(--bg-card-subtle)',
              color: studentOnly ? 'white' : 'var(--text-main)',
              border: studentOnly ? '1px solid #059669' : '1px solid var(--border-color)',
            }}
          >
            {studentOnly && <Check size={14} />}
            <Sparkles size={14} /> {t('browse.studentFriendly')}
          </button>

          {/* Popular Province Pills */}
          {['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Bình Dương', 'Cần Thơ'].map((p) => {
            const isSelected = selectedProvince === p;
            return (
              <button
                key={p}
                onClick={() => handleQuickProvince(p)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: '0.4rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  background: isSelected ? 'var(--primary)' : 'var(--bg-card-subtle)',
                  color: isSelected ? 'white' : 'var(--text-muted)',
                  border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                }}
              >
                <MapPin size={12} /> {p}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          {t('browse.found')} <strong style={{ color: 'var(--text-main)', fontSize: '1.1rem' }}>{totalElements > 0 ? totalElements.toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US') : jobs.length}</strong> {t('browse.matchingJobs')}
          {selectedProvince !== 'ALL' && <span> {t('browse.in')} <strong>{selectedProvince}</strong></span>}
          {studentOnly && <span style={{ color: '#059669' }}> {t('browse.forStudents')}</span>}
        </div>

        {totalPages > 1 && (
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            {t('browse.page')} {currentPage + 1} / {totalPages}
          </div>
        )}
      </div>

      {/* Jobs Grid or Empty State */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          <div style={{ display: 'inline-block', width: '36px', height: '36px', border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: '1rem' }} />
          <div>{t('browse.loading')}</div>
        </div>
      ) : jobs.length > 0 ? (
        <>
          <div className="job-grid">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '3rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => fetchJobs(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 0.85rem', opacity: currentPage === 0 ? 0.5 : 1 }}
              >
                <ChevronLeft size={16} /> {t('browse.prevPage')}
              </button>

              <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                  let pageNum = idx;
                  if (totalPages > 5 && currentPage > 2) {
                    pageNum = Math.min(totalPages - 5, currentPage - 2) + idx;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => fetchJobs(pageNum)}
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid',
                        borderColor: currentPage === pageNum ? 'var(--primary)' : 'var(--border-color)',
                        background: currentPage === pageNum ? 'var(--primary)' : 'var(--bg-card)',
                        color: currentPage === pageNum ? 'white' : 'var(--text-main)',
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                      }}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => fetchJobs(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage >= totalPages - 1}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 0.85rem', opacity: currentPage >= totalPages - 1 ? 0.5 : 1 }}
              >
                {t('browse.nextPage')} <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem 1.5rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <Filter size={44} color="var(--text-light)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>{t('browse.noJobsTitle')}</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{t('browse.noJobsDesc')}</p>
          <button onClick={handleResetFilters} className="btn btn-primary">
            <RotateCcw size={16} /> {t('browse.resetAll')}
          </button>
        </div>
      )}
    </div>
  );
};
