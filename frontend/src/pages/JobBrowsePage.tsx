import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Sparkles, MapPin, RotateCcw, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { JobCard } from '../components/jobs/JobCard';
import { Job, Category } from '../types';
import { jobService } from '../services/jobService';

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
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#ecfdf5', color: '#047857', padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          <Sparkles size={14} /> Dữ liệu việc làm thực tế VietJobs (1.450+ việc làm đã chuẩn hóa)
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
          Tìm kiếm việc làm part-time, thực tập & freelance
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '800px' }}>
          Tuyển chọn công việc bán thời gian, dự án freelance và thực tập sinh an toàn, minh bạch, phù hợp với lịch học sinh viên theo Nghị quyết 202/2025/QH15.
        </p>
      </div>

      {/* Main Filter Panel */}
      <div
        style={{
          background: 'white',
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
              placeholder="Nhập tên việc làm, kỹ năng, công ty (Barista, React, Marketing, Gia sư...)..."
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
            <Search size={16} /> Tìm kiếm
          </button>

          {(keyword || selectedType !== 'ALL' || selectedMode !== 'ALL' || selectedProvince !== 'ALL' || selectedCategory !== 'ALL' || studentOnly) && (
            <button
              onClick={handleResetFilters}
              className="btn btn-secondary"
              style={{ padding: '0.65rem 1rem', fontSize: '0.875rem' }}
              title="Đặt lại bộ lọc"
            >
              <RotateCcw size={15} /> Xóa bộ lọc
            </button>
          )}
        </div>

        {/* Dropdowns Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
          {/* Province Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
              Tỉnh / Thành phố
            </label>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                background: 'white',
                outline: 'none',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--text-main)',
              }}
            >
              <option value="ALL">📍 Tất cả tỉnh thành ({provinces.length})</option>
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
              Ngành nghề / Danh mục
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
              style={{
                width: '100%',
                padding: '0.6rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                background: 'white',
                outline: 'none',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--text-main)',
              }}
            >
              <option value="ALL">📁 Tất cả ngành nghề ({categories.length})</option>
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
              Hình thức công việc
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                background: 'white',
                outline: 'none',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--text-main)',
              }}
            >
              <option value="ALL">💼 Tất cả hình thức</option>
              <option value="PART_TIME">Việc làm Part-time</option>
              <option value="FREELANCE">Dự án Freelance</option>
              <option value="INTERNSHIP">Thực tập sinh (Internship)</option>
            </select>
          </div>

          {/* Work Mode Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
              Chế độ làm việc
            </label>
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                background: 'white',
                outline: 'none',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--text-main)',
              }}
            >
              <option value="ALL">🏢 Tất cả chế độ</option>
              <option value="ONSITE">Làm tại chỗ (Onsite)</option>
              <option value="REMOTE">Làm việc từ xa (Remote)</option>
              <option value="HYBRID">Linh hoạt kết hợp (Hybrid)</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Pills Row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginRight: '0.25rem' }}>
            Lọc nhanh:
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
              background: studentOnly ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : '#f1f5f9',
              color: studentOnly ? 'white' : 'var(--text-main)',
              border: studentOnly ? '1px solid #059669' : '1px solid #cbd5e1',
            }}
          >
            {studentOnly && <Check size={14} />}
            <Sparkles size={14} /> Phù hợp sinh viên
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
                  background: isSelected ? 'var(--primary)' : '#f8fafc',
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
          Tìm thấy <strong style={{ color: 'var(--text-main)', fontSize: '1.1rem' }}>{totalElements > 0 ? totalElements.toLocaleString('vi-VN') : jobs.length}</strong> công việc phù hợp
          {selectedProvince !== 'ALL' && <span> tại <strong>{selectedProvince}</strong></span>}
          {studentOnly && <span style={{ color: '#059669' }}> (dành cho sinh viên)</span>}
        </div>

        {totalPages > 1 && (
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Trang {currentPage + 1} / {totalPages}
          </div>
        )}
      </div>

      {/* Jobs Grid or Empty State */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          <div style={{ display: 'inline-block', width: '36px', height: '36px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: '1rem' }} />
          <div>Đang tải dữ liệu việc làm từ hệ thống...</div>
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
                <ChevronLeft size={16} /> Trang trước
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
                        background: currentPage === pageNum ? 'var(--primary)' : 'white',
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
                Trang sau <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem 1.5rem', background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <Filter size={44} color="var(--text-light)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Không tìm thấy công việc phù hợp</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Hãy thử xóa bớt bộ lọc hoặc tìm kiếm với từ khóa khác.</p>
          <button onClick={handleResetFilters} className="btn btn-primary">
            <RotateCcw size={16} /> Xóa tất cả bộ lọc
          </button>
        </div>
      )}
    </div>
  );
};
