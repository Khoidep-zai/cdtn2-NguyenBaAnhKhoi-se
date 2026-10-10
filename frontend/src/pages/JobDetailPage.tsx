import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Badge } from '../components/common/Badge';
import { Building, MapPin, DollarSign, Calendar, CheckCircle2, ArrowLeft, Send, AlertCircle } from 'lucide-react';
import { jobService } from '../services/jobService';
import { Job } from '../types';

const FALLBACK_JOBS: Record<number, Job> = {
  1: {
    id: 1,
    title: 'Tuyển nhân viên Barista & Phục vụ ca tối',
    description: 'Pha chế đồ uống theo công thức tiêu chuẩn của quán, phục vụ khách hàng chu đáo, kiểm tra nguyên vật liệu và dọn dẹp quầy ca tối từ 17h00 - 22h00 các ngày trong tuần. Môi trường làm việc năng động, thân thiện, đồng nghiệp nhiệt tình hỗ trợ sinh viên năm nhất, năm hai.',
    requirements: '- Nam/Nữ từ 18 tuổi trở lên, là sinh viên các trường ĐH/CĐ.\n- Trung thực, đúng giờ, có trách nhiệm với công việc.\n- Không yêu cầu kinh nghiệm, sẽ được đào tạo pha chế bài bản trong tuần đầu tiên.',
    jobType: 'PART_TIME',
    workMode: 'ONSITE',
    location: 'Quận Bình Thạnh, TP.HCM',
    salaryType: 'HOURLY',
    salaryAmount: 28000,
    slotsAvailable: 3,
    status: 'OPEN',
    deadline: '2026-10-25',
    createdAt: '2026-10-02',
    category: { id: 4, name: 'Phục vụ & Bán hàng', slug: 'phuc-vu' },
    employer: { id: 2, fullName: 'Nguyễn Thị Tuyết', companyName: 'The Coffee House Bình Thạnh' }
  },
  2: {
    id: 2,
    title: 'Lập trình Landing Page giới thiệu sản phẩm bằng React',
    description: 'Xây dựng trang đích quảng bá sản phẩm mới dựa trên bản thiết kế Figma có sẵn. Yêu cầu responsive chuẩn máy tính và điện thoại. Hỗ trợ sinh viên làm đồ án.',
    requirements: '- Có kiến thức tốt về HTML, CSS, JavaScript và React.\n- Đảm bảo viết mã nguồn sạch sẽ, dễ bảo trì.\n- Tinh thần trách nhiệm cao, bàn giao đúng deadline.',
    jobType: 'FREELANCE',
    workMode: 'REMOTE',
    location: 'Toàn quốc',
    salaryType: 'FIXED_PROJECT',
    salaryAmount: 2500000,
    slotsAvailable: 1,
    status: 'OPEN',
    deadline: '2026-10-30',
    createdAt: '2026-10-02',
    category: { id: 1, name: 'Lập trình & CNTT', slug: 'cntt' },
    employer: { id: 3, fullName: 'Trần Văn Minh', companyName: 'Innovate Studio' }
  },
  3: {
    id: 3,
    title: 'Thiết kế bộ ấn phẩm Banner & Poster sự kiện',
    description: 'Thiết kế 5 poster và 10 ảnh định dạng vuông đăng Facebook/Instagram phục vụ tuần lễ giao lưu âm nhạc sinh viên. Yêu cầu biết sử dụng Photoshop/Canva.',
    requirements: '- Sử dụng thành thạo Photoshop, Illustrator hoặc Canva Pro.\n- Thẩm mỹ tốt, màu sắc tươi sáng trẻ trung cho sinh viên.\n- Chấp nhận chỉnh sửa nhỏ 1-2 lần theo góp ý.',
    jobType: 'FREELANCE',
    workMode: 'REMOTE',
    location: 'Toàn quốc',
    salaryType: 'FIXED_PROJECT',
    salaryAmount: 1500000,
    slotsAvailable: 1,
    status: 'OPEN',
    deadline: '2026-10-20',
    createdAt: '2026-10-02',
    category: { id: 2, name: 'Thiết kế đồ họa', slug: 'thiet-ke' },
    employer: { id: 3, fullName: 'Trần Văn Minh', companyName: 'Innovate Studio' }
  },
  4: {
    id: 4,
    title: 'Gia sư dạy kèm môn Tiếng Anh giao tiếp lớp 7',
    description: 'Kèm cặp ngữ pháp và rèn luyện kỹ năng nghe nói cơ bản cho học sinh lớp 7. 3 buổi/tuần, mỗi buổi 1.5 giờ. Học phí thanh toán vào cuối tháng.',
    requirements: '- Sinh viên chuyên ngành Sư phạm Anh, Ngôn ngữ Anh hoặc có chứng chỉ IELTS 6.5+.\n- Kiên nhẫn, yêu thích giảng dạy và hỗ trợ các em học sinh.',
    jobType: 'PART_TIME',
    workMode: 'HYBRID',
    location: 'Quận Gò Vấp, TP.HCM',
    salaryType: 'HOURLY',
    salaryAmount: 120000,
    slotsAvailable: 1,
    status: 'OPEN',
    deadline: '2026-10-31',
    createdAt: '2026-10-02',
    category: { id: 3, name: 'Gia sư & Dạy kèm', slug: 'gia-su' },
    employer: { id: 2, fullName: 'Nguyễn Thị Tuyết', companyName: 'Gia đình chị Tuyết' }
  }
};

export const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const { t, language } = useLanguage();

  const jobId = Number(id) || 1;
  const [job, setJob] = useState<Job>(FALLBACK_JOBS[jobId] || FALLBACK_JOBS[1]);
  const [applied, setApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [cvUrl, setCvUrl] = useState(user?.cvUrl || '');
  const [showModal, setShowModal] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState('');

  useEffect(() => {
    if (user?.cvUrl) {
      setCvUrl(user.cvUrl);
    }
  }, [user]);

  useEffect(() => {
    let isMounted = true;
    const fetchDetail = async () => {
      try {
        const data = await jobService.getJobById(jobId);
        if (isMounted && data) {
          setJob(data);
        }
      } catch {
        if (isMounted && FALLBACK_JOBS[jobId]) {
          setJob(FALLBACK_JOBS[jobId]);
        }
      }
    };
    fetchDetail();
    return () => {
      isMounted = false;
    };
  }, [jobId]);

  const formatSalary = (amount: number, type: string) => {
    const formatted = new Intl.NumberFormat(language === 'vi' ? 'vi-VN' : 'en-US').format(amount) + ' đ';
    if (type === 'HOURLY') return `${formatted}${language === 'vi' ? '/giờ' : '/hr'}`;
    if (type === 'FIXED_PROJECT') return `${formatted}${language === 'vi' ? ' (trọn gói)' : ' (fixed)'}`;
    return `${formatted}${language === 'vi' ? '/tháng' : '/mo'}`;
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplying(true);
    setApplyError('');
    try {
      await jobService.applyJob(job.id, coverLetter, cvUrl);
      setApplied(true);
      setShowModal(false);
    } catch (err: any) {
      setApplyError(err?.response?.data?.message || 'Có lỗi xảy ra khi nộp hồ sơ. Vui lòng thử lại!');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '900px' }}>
      <Link to="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontWeight: 600 }}>
        <ArrowLeft size={16} /> {t('job.back')}
      </Link>

      <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', padding: '2.5rem', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem' }}>
              <Badge type={job.jobType} label={job.jobType === 'PART_TIME' ? t('browse.partTime') : job.jobType === 'INTERNSHIP' ? t('browse.internship') : t('browse.freelance')} />
              <Badge type={job.status} label={job.status === 'OPEN' ? t('job.open') : job.status} />
              {job.studentFriendly && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '0.25rem 0.65rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                  }}
                >
                  ✨ {t('job.forStudentsBadge')}
                </span>
              )}
              {job.category?.name && (
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#10b981',
                    background: 'rgba(16, 185, 129, 0.1)',
                    padding: '0.25rem 0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                  }}
                >
                  📁 {job.category.name}
                </span>
              )}
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)', lineHeight: 1.3 }}>{job.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '1rem' }}>
              <Building size={18} />
              <span style={{ fontWeight: 600 }}>{job.employer?.companyName || job.employer?.fullName || 'Nhà tuyển dụng xác minh'}</span>
            </div>
          </div>

          <div>
            {applied ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', fontWeight: 700 }}>
                <CheckCircle2 size={20} /> {t('job.applied')}
              </div>
            ) : isAuthenticated ? (
              user?.role === 'ROLE_STUDENT' ? (
                <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ padding: '0.85rem 1.75rem' }}>
                  <Send size={18} /> {t('job.applyNow')}
                </button>
              ) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontStyle: 'italic' }}>
                  {t('job.employerNotice')}
                </div>
              )
            ) : (
              <Link to="/login" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem' }}>
                {t('job.loginToApply')}
              </Link>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', background: 'var(--bg-card-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', border: '1px solid var(--border-color)' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('job.salary')}</div>
            <div style={{ fontWeight: 700, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem', fontSize: '1.05rem' }}>
              <DollarSign size={18} /> {job.salaryText || formatSalary(job.salaryAmount, job.salaryType)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('job.location')}</div>
            <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
              <MapPin size={18} color="var(--primary)" /> {job.province ? `${job.province} - ${job.location || 'Tại chỗ'}` : (job.location || 'Toàn quốc (Remote)')}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('job.workingHours')}</div>
            <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
              <Calendar size={18} /> {job.workingHours || 'Linh hoạt theo lịch học'}
            </div>
          </div>
        </div>

        {job.benefits && (
          <div style={{ marginBottom: '2rem', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {t('job.benefits')}
            </h3>
            <p style={{ lineHeight: 1.7, color: 'var(--text-main)', whiteSpace: 'pre-line' }}>{job.benefits}</p>
          </div>
        )}

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>{t('job.description')}</h3>
          <p style={{ lineHeight: 1.7, color: 'var(--text-main)', whiteSpace: 'pre-line' }}>{job.description}</p>
        </div>

        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>{t('job.requirements')}</h3>
          <p style={{ lineHeight: 1.7, color: 'var(--text-main)', whiteSpace: 'pre-line' }}>{job.requirements || 'Không yêu cầu kinh nghiệm trước, sẽ được hướng dẫn khi nhận việc.'}</p>
        </div>
      </div>

      {/* Modal Apply */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '2rem', width: '100%', maxWidth: '500px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-main)' }}>{t('job.applyModalTitle')}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              {t('job.applyModalIntro')} <strong>{job.employer?.companyName || job.employer?.fullName}</strong>.
            </p>

            {applyError && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                <AlertCircle size={16} />
                <span>{applyError}</span>
              </div>
            )}

            <form onSubmit={handleApply}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-main)' }}>
                  {language === 'vi' ? 'Thư giới thiệu / Lời nhắn' : 'Cover Letter / Introduction'}
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder={t('job.coverLetterPlaceholder')}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-main)' }}>
                  {language === 'vi' ? 'Liên kết CV / Portfolio (Google Drive / PDF online)' : 'Online CV / Portfolio Link'}
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/..."
                  value={cvUrl}
                  onChange={(e) => setCvUrl(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-main)', outline: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">{t('job.cancel')}</button>
                <button type="submit" disabled={applying} className="btn btn-primary">
                  {applying ? t('job.submitting') : t('job.submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
