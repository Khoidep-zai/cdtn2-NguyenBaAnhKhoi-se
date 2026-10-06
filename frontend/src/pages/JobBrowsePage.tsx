import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { JobCard } from '../components/jobs/JobCard';
import { Job } from '../types';
import { jobService } from '../services/jobService';

const INITIAL_JOBS: Job[] = [
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
    title: 'Thiết kế bộ ấn phẩm Banner & Poster sự kiện âm nhạc',
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
  },
  {
    id: 4,
    title: 'Gia sư dạy kèm môn Tiếng Anh giao tiếp lớp 7',
    description: 'Kèm cặp ngữ pháp và rèn luyện kỹ năng nghe nói cơ bản cho học sinh lớp 7. 3 buổi/tuần, mỗi buổi 1.5 giờ. Học phí thanh toán vào cuối tháng.',
    jobType: 'PART_TIME',
    workMode: 'HYBRID',
    location: 'Quận Gò Vấp, TP.HCM',
    salaryType: 'HOURLY',
    salaryAmount: 120000,
    slotsAvailable: 1,
    status: 'OPEN',
    createdAt: '2026-10-02',
    category: { id: 3, name: 'Gia sư & Dạy kèm', slug: 'gia-su' },
    employer: { id: 2, fullName: 'Nguyễn Thị Tuyết', companyName: 'Gia đình chị Tuyết' }
  }
];

export const JobBrowsePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialKeyword = searchParams.get('keyword') || '';

  const [keyword, setKeyword] = useState(initialKeyword);
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedMode, setSelectedMode] = useState('ALL');
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);

  useEffect(() => {
    let isMounted = true;
    const fetchJobs = async () => {
      try {
        const res = await jobService.getJobs({
          keyword: keyword || undefined,
          jobType: selectedType !== 'ALL' ? selectedType : undefined,
          workMode: selectedMode !== 'ALL' ? selectedMode : undefined,
        });
        if (isMounted && res && res.content && res.content.length > 0) {
          setJobs(res.content);
        }
      } catch {
        // Fallback to local INITIAL_JOBS when backend is unreachable
      }
    };
    fetchJobs();
    return () => {
      isMounted = false;
    };
  }, [keyword, selectedType, selectedMode]);

  const filteredJobs = jobs.filter((job) => {
    const matchKeyword = job.title.toLowerCase().includes(keyword.toLowerCase()) ||
                         job.description.toLowerCase().includes(keyword.toLowerCase());
    const matchType = selectedType === 'ALL' || job.jobType === selectedType;
    const matchMode = selectedMode === 'ALL' || job.workMode === selectedMode;
    return matchKeyword && matchType && matchMode;
  });

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Tìm kiếm việc làm part-time & freelance</h1>
        <p style={{ color: 'var(--text-muted)' }}>Khám phá hơn 100+ vị trí việc làm linh hoạt phù hợp với lịch học</p>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ background: 'white', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        <div style={{ flex: '1 1 300px', display: 'flex', alignItems: 'center', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', padding: '0.5rem 0.85rem' }}>
          <Search size={18} color="var(--text-light)" />
          <input
            type="text"
            placeholder="Tìm theo tên việc làm, kỹ năng..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', marginLeft: '0.5rem', width: '100%' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            style={{ padding: '0.65rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'white', outline: 'none', fontWeight: 600, color: 'var(--text-main)' }}
          >
            <option value="ALL">Tất cả hình thức</option>
            <option value="PART_TIME">Việc làm Part-time</option>
            <option value="FREELANCE">Dự án Freelance</option>
          </select>

          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
            style={{ padding: '0.65rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'white', outline: 'none', fontWeight: 600, color: 'var(--text-main)' }}
          >
            <option value="ALL">Tất cả địa điểm</option>
            <option value="ONSITE">Làm tại chỗ (Onsite)</option>
            <option value="REMOTE">Làm việc từ xa (Remote)</option>
            <option value="HYBRID">Kết hợp (Hybrid)</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ fontWeight: 600, color: 'var(--text-muted)' }}>
          Tìm thấy <strong style={{ color: 'var(--text-main)' }}>{filteredJobs.length}</strong> công việc phù hợp
        </div>
      </div>

      {filteredJobs.length > 0 ? (
        <div className="job-grid">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem 0', background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <Filter size={40} color="var(--text-light)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Không tìm thấy công việc nào</h3>
          <p style={{ color: 'var(--text-muted)' }}>Hãy thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh lại bộ lọc.</p>
        </div>
      )}
    </div>
  );
};
