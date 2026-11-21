import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { studentProfileService } from '../../services/studentProfileService';
import { 
  StudentProfile, 
  WorkHistory, 
  LanguageItem, 
  WorkExperienceItem, 
  PortfolioProjectItem, 
  CertificateItem 
} from '../../types';
import { 
  User as UserIcon, 
  GraduationCap, 
  BookOpen, 
  Award, 
  FileText, 
  Star, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  Briefcase,
  Globe,
  Plus,
  Trash2,
  Clock,
  Target,
  ExternalLink,
  ShieldCheck,
  Percent,
  ArrowLeft
} from 'lucide-react';

const DAYS_OF_WEEK = [
  { id: 1, label: 'Thứ 2' },
  { id: 2, label: 'Thứ 3' },
  { id: 3, label: 'Thứ 4' },
  { id: 4, label: 'Thứ 5' },
  { id: 5, label: 'Thứ 6' },
  { id: 6, label: 'Thứ 7' },
  { id: 7, label: 'Chủ nhật' },
];

const SHIFT_TYPES = [
  { key: 'MORNING', label: 'Ca sáng (06:00 - 12:00)' },
  { key: 'AFTERNOON', label: 'Ca chiều (12:00 - 18:00)' },
  { key: 'EVENING', label: 'Ca tối (18:00 - 23:00)' },
];

export const StudentProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const targetStudentId = id ? Number(id) : undefined;
  const isReadOnly = Boolean(targetStudentId && user && targetStudentId !== user.id);

  // Profile data
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // 12 Khu vực State
  // 1. Thông tin cá nhân
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [cvUrl, setCvUrl] = useState('');

  // 2. Bio
  const [bio, setBio] = useState('');

  // 3. Mục tiêu nghề nghiệp
  const [careerObjective, setCareerObjective] = useState('');

  // 4. Trình độ học vấn
  const [educationLevel, setEducationLevel] = useState('Đại học');

  // 5. Trường, Ngành & GPA
  const [university, setUniversity] = useState('');
  const [major, setMajor] = useState('');
  const [gpa, setGpa] = useState('');

  // 6. Kỹ năng
  const [skills, setSkills] = useState('');
  const [newSkill, setNewSkill] = useState('');

  // 7. Ngoại ngữ
  const [languages, setLanguages] = useState<LanguageItem[]>([]);
  const [newLang, setNewLang] = useState({ language: '', level: 'Giao tiếp tốt' });

  // 8. Kinh nghiệm làm việc
  const [workExperiences, setWorkExperiences] = useState<WorkExperienceItem[]>([]);
  const [newExp, setNewExp] = useState<WorkExperienceItem>({ company: '', position: '', startDate: '', endDate: '', description: '' });
  const [showAddExp, setShowAddExp] = useState(false);

  // 9. Lịch sử công việc hoàn thành
  const [verifiedHistories, setVerifiedHistories] = useState<WorkHistory[]>([]);

  // 10. Dự án cá nhân & Portfolio
  const [projects, setProjects] = useState<PortfolioProjectItem[]>([]);
  const [newProj, setNewProj] = useState<PortfolioProjectItem>({ title: '', link: '', technologies: '', description: '' });
  const [showAddProj, setShowAddProj] = useState(false);

  // 11. Chứng chỉ
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [newCert, setNewCert] = useState<CertificateItem>({ name: '', issuer: '', year: '', url: '' });
  const [showAddCert, setShowAddCert] = useState(false);

  // 12. Lịch rảnh có thể làm việc
  // Map: dayId (1-7) -> array of shift keys ['MORNING', 'AFTERNOON', 'EVENING']
  const [availableSchedule, setAvailableSchedule] = useState<Record<string, string[]>>({});

  const fetchProfileData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = (isReadOnly && targetStudentId)
        ? await studentProfileService.getPublicProfile(targetStudentId)
        : await studentProfileService.getMyProfile();
      setProfile(data);

      setFullName(data.fullName || '');
      setPhone(data.phone || '');
      setAvatarUrl(data.avatarUrl || '');
      setCvUrl(data.cvUrl || '');
      setBio(data.bio || '');
      setCareerObjective(data.careerObjective || '');
      setEducationLevel(data.educationLevel || 'Đại học');
      setUniversity(data.university || 'Trường Đại học Văn Lang');
      setMajor(data.major || '');
      setGpa(data.gpa || '');
      setSkills(data.skills || '');

      // Parse JSON arrays
      try {
        setLanguages(data.languages ? JSON.parse(data.languages) : []);
      } catch { setLanguages([]); }

      try {
        setWorkExperiences(data.workExperiences ? JSON.parse(data.workExperiences) : []);
      } catch { setWorkExperiences([]); }

      try {
        setProjects(data.portfolioProjects ? JSON.parse(data.portfolioProjects) : []);
      } catch { setProjects([]); }

      try {
        setCertificates(data.certificates ? JSON.parse(data.certificates) : []);
      } catch { setCertificates([]); }

      try {
        setAvailableSchedule(data.availableSchedule ? JSON.parse(data.availableSchedule) : {});
      } catch { setAvailableSchedule({}); }

      setVerifiedHistories(data.verifiedWorkHistories || []);
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || 'Không thể tải thông tin hồ sơ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [id, user?.id]);

  // Skill tag add/remove
  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    const currentList = skills ? skills.split(',').map(s => s.trim()).filter(Boolean) : [];
    if (!currentList.includes(newSkill.trim())) {
      currentList.push(newSkill.trim());
      setSkills(currentList.join(', '));
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const currentList = skills.split(',').map(s => s.trim()).filter(Boolean);
    const updated = currentList.filter(s => s !== skillToRemove);
    setSkills(updated.join(', '));
  };

  // Language add/remove
  const handleAddLang = () => {
    if (!newLang.language.trim()) return;
    setLanguages([...languages, { ...newLang, id: String(Date.now()) }]);
    setNewLang({ language: '', level: 'Giao tiếp tốt' });
  };

  const handleRemoveLang = (index: number) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  // Experience add/remove
  const handleAddExp = () => {
    if (!newExp.company.trim() || !newExp.position.trim()) return;
    setWorkExperiences([...workExperiences, { ...newExp, id: String(Date.now()) }]);
    setNewExp({ company: '', position: '', startDate: '', endDate: '', description: '' });
    setShowAddExp(false);
  };

  const handleRemoveExp = (index: number) => {
    setWorkExperiences(workExperiences.filter((_, i) => i !== index));
  };

  // Project add/remove
  const handleAddProj = () => {
    if (!newProj.title.trim()) return;
    setProjects([...projects, { ...newProj, id: String(Date.now()) }]);
    setNewProj({ title: '', link: '', technologies: '', description: '' });
    setShowAddProj(false);
  };

  const handleRemoveProj = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  // Certificate add/remove
  const handleAddCert = () => {
    if (!newCert.name.trim() || !newCert.issuer.trim()) return;
    setCertificates([...certificates, { ...newCert, id: String(Date.now()) }]);
    setNewCert({ name: '', issuer: '', year: '', url: '' });
    setShowAddCert(false);
  };

  const handleRemoveCert = (index: number) => {
    setCertificates(certificates.filter((_, i) => i !== index));
  };

  // Schedule toggle
  const toggleScheduleShift = (dayId: number, shiftKey: string) => {
    const key = String(dayId);
    const currentShifts = availableSchedule[key] || [];
    let updatedShifts: string[];
    if (currentShifts.includes(shiftKey)) {
      updatedShifts = currentShifts.filter(s => s !== shiftKey);
    } else {
      updatedShifts = [...currentShifts, shiftKey];
    }
    setAvailableSchedule({
      ...availableSchedule,
      [key]: updatedShifts
    });
  };

  // Save all profile
  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const payload: Partial<StudentProfile> = {
        fullName,
        phone,
        avatarUrl,
        cvUrl,
        bio,
        careerObjective,
        educationLevel,
        university,
        major,
        gpa,
        skills,
        languages: JSON.stringify(languages),
        workExperiences: JSON.stringify(workExperiences),
        portfolioProjects: JSON.stringify(projects),
        certificates: JSON.stringify(certificates),
        availableSchedule: JSON.stringify(availableSchedule)
      };

      const updated = await studentProfileService.updateMyProfile(payload);
      setProfile(updated);
      updateUser({ fullName, phone, avatarUrl, cvUrl, bio, university, major, skills });
      setSuccessMsg('Đã lưu toàn bộ thông tin Hồ sơ cá nhân thành công!');
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật hồ sơ');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto 1rem auto' }}></div>
        <p style={{ color: 'var(--text-muted)' }}>Đang tải thông tin hồ sơ sinh viên...</p>
      </div>
    );
  }

  const completionPct = profile?.completionPercentage || 0;

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: '1120px' }}>
      {/* Header bar with Completion % and Save button */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        padding: '1.5rem 2rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--primary-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)',
            fontWeight: 800,
            fontSize: '1.75rem',
            overflow: 'hidden',
            border: '2px solid var(--primary)'
          }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt={fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              fullName?.charAt(0) || 'S'
            )}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                {fullName || user?.fullName}
              </h1>
              <span className="badge badge-open" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <ShieldCheck size={14} /> Sinh viên
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              {university} • {major || 'Chưa cập nhật chuyên ngành'}
            </p>
          </div>
        </div>

        {/* Completion Progress Bar */}
        <div style={{ minWidth: '240px', flex: '1 1 240px', maxWidth: '340px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Percent size={14} color="var(--primary)" /> Độ hoàn thiện hồ sơ
            </span>
            <span style={{ fontWeight: 700, color: completionPct >= 80 ? '#16a34a' : 'var(--primary)' }}>
              {completionPct}%
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            background: 'var(--border-color)',
            borderRadius: '9999px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${completionPct}%`,
              height: '100%',
              background: completionPct >= 80 ? '#16a34a' : 'var(--primary)',
              borderRadius: '9999px',
              transition: 'width 0.5s ease-in-out'
            }} />
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            {completionPct < 80 ? 'Điền thêm thông tin để tăng 300% cơ hội trúng tuyển!' : 'Hồ sơ đã đạt tiêu chuẩn chuyên nghiệp!'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {isReadOnly ? (
            <button 
              type="button" 
              onClick={() => navigate(-1)}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}
            >
              <ArrowLeft size={18} /> Quay lại
            </button>
          ) : (
            <button 
              type="button" 
              onClick={() => handleSaveProfile()}
              disabled={saving}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.75rem', fontSize: '0.95rem' }}
            >
              <Save size={18} /> {saving ? 'Đang lưu...' : 'Lưu hồ sơ'}
            </button>
          )}
        </div>
      </div>

      {isReadOnly && (
        <div style={{
          background: 'var(--bg-main)',
          border: '1px solid var(--primary)',
          color: 'var(--text-main)',
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.92rem'
        }}>
          <ShieldCheck size={20} color="var(--primary)" />
          <span>
            Bạn đang xem <strong>Hồ sơ năng lực 12 khu vực</strong> của sinh viên <strong>{fullName || user?.fullName}</strong>. Dữ liệu đã được hệ thống xác thực.
          </span>
        </div>
      )}

      {successMsg && (
        <div style={{
          background: '#dcfce7',
          color: '#15803d',
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontWeight: 600
        }}>
          <CheckCircle2 size={20} /> {successMsg}
        </div>
      )}

      {errorMsg && (
        <div style={{
          background: '#fee2e2',
          color: '#b91c1c',
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontWeight: 600
        }}>
          <AlertCircle size={20} /> {errorMsg}
        </div>
      )}

      {/* Form sections */}
      <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        
        {/* KHU VỰC 1: ẢNH ĐẠI DIỆN VÀ THÔNG TIN LIÊN HỆ */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UserIcon size={20} color="var(--primary)" /> 1. Ảnh đại diện & Thông tin liên hệ
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            <div>
              <label className="form-label">Họ và tên *</label>
              <input 
                type="text" 
                className="form-control" 
                value={fullName} 
                onChange={e => setFullName(e.target.value)} 
                required 
                disabled={isReadOnly}
                placeholder="Ví dụ: Phạm Công Tài"
              />
            </div>
            <div>
              <label className="form-label">Email (Dùng đăng nhập & thông báo)</label>
              <input 
                type="email" 
                className="form-control" 
                value={profile?.email || user?.email || ''} 
                disabled 
                style={{ background: 'var(--bg-main)', cursor: 'not-allowed' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email được bảo vệ riêng tư</span>
            </div>
            <div>
              <label className="form-label">Số điện thoại *</label>
              <input 
                type="tel" 
                className="form-control" 
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
                disabled={isReadOnly}
                placeholder="Ví dụ: 0934567890" 
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Chỉ hiển thị cho NTD sau khi bạn trúng tuyển</span>
            </div>
            <div>
              <label className="form-label">Link ảnh đại diện (Avatar URL)</label>
              <input 
                type="url" 
                className="form-control" 
                value={avatarUrl} 
                onChange={e => setAvatarUrl(e.target.value)} 
                disabled={isReadOnly}
                placeholder="https://..."
              />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Link CV trực tuyến (Google Drive, Dropbox, PDF)</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="url" 
                  className="form-control" 
                  value={cvUrl} 
                  onChange={e => setCvUrl(e.target.value)} 
                  disabled={isReadOnly}
                  placeholder="https://drive.google.com/..." 
                />
                {cvUrl && (
                  <a href={cvUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ flexShrink: 0 }}>
                    <ExternalLink size={16} /> Xem CV
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* KHU VỰC 2: GIỚI THIỆU BẢN THÂN */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={20} color="var(--primary)" /> 2. Giới thiệu bản thân (Bio)
          </h2>
          <div>
            <label className="form-label">Mô tả ngắn gọn về bạn, điểm mạnh và tính cách làm việc</label>
            <textarea 
              className="form-control" 
              rows={3} 
              value={bio} 
              disabled={isReadOnly}
              onChange={e => setBio(e.target.value)} 
              placeholder="Ví dụ: Sinh viên năm 4 đam mê lập trình, chăm chỉ, nhanh nhẹn, hòa đồng và có trách nhiệm cao trong công việc..."
            />
          </div>
        </div>

        {/* KHU VỰC 3: MỤC TIÊU NGHỀ NGHIỆP */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target size={20} color="var(--primary)" /> 3. Mục tiêu nghề nghiệp
          </h2>
          <div>
            <label className="form-label">Định hướng phát triển ngắn hạn và dài hạn của bạn</label>
            <textarea 
              className="form-control" 
              rows={2} 
              value={careerObjective} 
              disabled={isReadOnly}
              onChange={e => setCareerObjective(e.target.value)} 
              placeholder="Ví dụ: Mong muốn tìm kiếm công việc part-time hoặc thực tập để áp dụng kiến thức thực tế, nâng cao kỹ năng mềm và hướng tới vị trí chính thức sau khi tốt nghiệp..."
            />
          </div>
        </div>

        {/* KHU VỰC 4 & 5: TRÌNH ĐỘ HỌC VẤN, TRƯỜNG HỌC, CHUYÊN NGÀNH & GPA */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <GraduationCap size={20} color="var(--primary)" /> 4 & 5. Học vấn, Chuyên ngành & GPA
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <div>
              <label className="form-label">Trình độ học vấn</label>
              <select 
                className="form-control" 
                value={educationLevel} 
                disabled={isReadOnly}
                onChange={e => setEducationLevel(e.target.value)}
              >
                <option value="Đại học">Đại học (Sinh viên)</option>
                <option value="Cao đẳng">Cao đẳng</option>
                <option value="Trung cấp">Trung cấp</option>
                <option value="Đã tốt nghiệp">Đã tốt nghiệp</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            <div>
              <label className="form-label">Trường học</label>
              <input 
                type="text" 
                className="form-control" 
                value={university} 
                disabled={isReadOnly}
                onChange={e => setUniversity(e.target.value)} 
                placeholder="Ví dụ: Trường Đại học Văn Lang"
              />
            </div>
            <div>
              <label className="form-label">Chuyên ngành</label>
              <input 
                type="text" 
                className="form-control" 
                value={major} 
                disabled={isReadOnly}
                onChange={e => setMajor(e.target.value)} 
                placeholder="Ví dụ: Công nghệ thông tin / Quản trị kinh doanh"
              />
            </div>
            <div>
              <label className="form-label">Điểm GPA tích lũy</label>
              <input 
                type="text" 
                className="form-control" 
                value={gpa} 
                disabled={isReadOnly}
                onChange={e => setGpa(e.target.value)} 
                placeholder="Ví dụ: 3.4/4.0 hoặc 8.2/10"
              />
            </div>
          </div>
        </div>

        {/* KHU VỰC 6: KỸ NĂNG CHUYÊN MÔN */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={20} color="var(--primary)" /> 6. Kỹ năng chuyên môn
          </h2>
          {!isReadOnly && (
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <input 
                type="text" 
                className="form-control" 
                value={newSkill} 
                onChange={e => setNewSkill(e.target.value)} 
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
                placeholder="Nhập kỹ năng rồi bấm Thêm (VD: React, Pha chế, Thu ngân, Giao tiếp...)"
                style={{ flex: 1, minWidth: '240px' }}
              />
              <button type="button" onClick={handleAddSkill} className="btn btn-secondary">
                <Plus size={16} /> Thêm kỹ năng
              </button>
            </div>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {skills ? skills.split(',').map(s => s.trim()).filter(Boolean).map((skill, idx) => (
              <span 
                key={idx}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.4rem 0.85rem',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  borderRadius: '9999px',
                  fontWeight: 600,
                  fontSize: '0.85rem'
                }}
              >
                {skill}
                {!isReadOnly && (
                  <button 
                    type="button" 
                    onClick={() => handleRemoveSkill(skill)}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: 0 }}
                  >
                    &times;
                  </button>
                )}
              </span>
            )) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Chưa có kỹ năng nào được thêm.</p>
            )}
          </div>
        </div>

        {/* KHU VỰC 7: NGOẠI NGỮ */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Globe size={20} color="var(--primary)" /> 7. Ngoại ngữ & Trình độ
          </h2>
          {!isReadOnly && (
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Ngôn ngữ (VD: Tiếng Anh, Tiếng Nhật)"
                value={newLang.language}
                onChange={e => setNewLang({ ...newLang, language: e.target.value })}
                style={{ flex: '1 1 200px' }}
              />
              <select 
                className="form-control"
                value={newLang.level}
                onChange={e => setNewLang({ ...newLang, level: e.target.value })}
                style={{ flex: '1 1 180px' }}
              >
                <option value="Cơ bản">Cơ bản (A1 - A2)</option>
                <option value="Giao tiếp tốt">Giao tiếp tốt (B1 - B2)</option>
                <option value="Thành thạo">Thành thạo / Chuyên nghiệp (C1 - C2)</option>
                <option value="Bản ngữ">Bản ngữ</option>
                <option value="IELTS 6.0+">IELTS 6.0+</option>
                <option value="IELTS 7.0+">IELTS 7.0+</option>
                <option value="TOEIC 700+">TOEIC 700+</option>
                <option value="JLPT N3/N2">JLPT N3/N2</option>
              </select>
              <button type="button" onClick={handleAddLang} className="btn btn-secondary">
                <Plus size={16} /> Thêm ngoại ngữ
              </button>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.75rem' }}>
            {languages.map((l, idx) => (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  background: 'var(--bg-main)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{l.language}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{l.level}</div>
                </div>
                {!isReadOnly && (
                  <button type="button" onClick={() => handleRemoveLang(idx)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
            {languages.length === 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Chưa có thông tin ngoại ngữ.</p>
            )}
          </div>
        </div>

        {/* KHU VỰC 8: KINH NGHIỆM LÀM VIỆC */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Briefcase size={20} color="var(--primary)" /> 8. Kinh nghiệm làm việc
            </h2>
            {!isReadOnly && (
              <button type="button" onClick={() => setShowAddExp(!showAddExp)} className="btn btn-secondary btn-sm">
                <Plus size={14} /> Thêm kinh nghiệm
              </button>
            )}
          </div>

          {!isReadOnly && showAddExp && (
            <div style={{ padding: '1.25rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label className="form-label">Tên công ty / Cửa hàng *</label>
                  <input type="text" className="form-control" value={newExp.company} onChange={e => setNewExp({ ...newExp, company: e.target.value })} placeholder="VD: The Coffee House" />
                </div>
                <div>
                  <label className="form-label">Vị trí / Chức danh *</label>
                  <input type="text" className="form-control" value={newExp.position} onChange={e => setNewExp({ ...newExp, position: e.target.value })} placeholder="VD: Nhân viên Barista ca tối" />
                </div>
                <div>
                  <label className="form-label">Bắt đầu</label>
                  <input type="month" className="form-control" value={newExp.startDate} onChange={e => setNewExp({ ...newExp, startDate: e.target.value })} />
                </div>
                <div>
                  <label className="form-label">Kết thúc</label>
                  <input type="month" className="form-control" value={newExp.endDate} onChange={e => setNewExp({ ...newExp, endDate: e.target.value })} />
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Mô tả công việc & Thành tích</label>
                <textarea rows={2} className="form-control" value={newExp.description} onChange={e => setNewExp({ ...newExp, description: e.target.value })} placeholder="Pha chế theo tiêu chuẩn, phục vụ khách hàng, kiểm kê ca..." />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowAddExp(false)} className="btn btn-secondary btn-sm">Hủy</button>
                <button type="button" onClick={handleAddExp} className="btn btn-primary btn-sm">Lưu kinh nghiệm này</button>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {workExperiences.map((exp, idx) => (
              <div key={idx} style={{ padding: '1.25rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', position: 'relative' }}>
                {!isReadOnly && (
                  <button type="button" onClick={() => handleRemoveExp(idx)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                    <Trash2 size={16} />
                  </button>
                )}
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}>{exp.position}</div>
                <div style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', marginTop: '0.2rem' }}>{exp.company}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                  {exp.startDate} - {exp.endDate || 'Hiện tại'}
                </div>
                {exp.description && (
                  <p style={{ color: 'var(--text-main)', fontSize: '0.88rem', marginTop: '0.5rem', whiteSpace: 'pre-line' }}>{exp.description}</p>
                )}
              </div>
            ))}
            {workExperiences.length === 0 && !showAddExp && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Chưa có kinh nghiệm làm việc nào được thêm.</p>
            )}
          </div>
        </div>

        {/* KHU VỰC 9: LỊCH SỬ CÔNG VIỆC ĐÃ HOÀN THÀNH (XÁC THỰC 2 CHIỀU) */}
        <div className="card" style={{ padding: '1.75rem', borderColor: 'rgba(22, 163, 74, 0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <ShieldCheck size={22} color="#16a34a" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
              9. Lịch sử công việc đã hoàn thành (Xác thực bởi FreelanceHub)
            </h2>
            <span style={{
              background: '#dcfce7',
              color: '#166534',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px'
            }}>
              {verifiedHistories.length} công việc
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            Các công việc được xác nhận hoàn thành 2 chiều bởi cả Bạn và Nhà tuyển dụng. Dữ liệu được bảo vệ vĩnh viễn trong hồ sơ.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {verifiedHistories.map((wh) => (
              <div 
                key={wh.id}
                style={{
                  padding: '1.25rem',
                  background: 'var(--bg-main)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  borderLeft: '4px solid #16a34a'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {wh.jobTitle}
                      <span title="Đã xác thực bởi FreelanceHub" style={{ color: '#16a34a', display: 'inline-flex' }}>
                        <CheckCircle2 size={16} />
                      </span>
                    </div>
                    <div style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', marginTop: '0.2rem' }}>
                      {wh.companyName || wh.employerName}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <span>Loại hình: {wh.jobType} ({wh.workMode})</span>
                      <span>Thời gian: {wh.startDate} đến {wh.endDate || 'Hoàn tất'}</span>
                    </div>
                  </div>

                  {wh.employerRating && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: '#fef3c7', padding: '0.35rem 0.75rem', borderRadius: '9999px', color: '#b45309', fontWeight: 700, fontSize: '0.85rem' }}>
                      <Star size={14} fill="#f59e0b" color="#f59e0b" /> {wh.employerRating}.0/5.0
                    </div>
                  )}
                </div>

                {wh.employerFeedback && (
                  <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border-color)', fontSize: '0.85rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Nhận xét từ NTD: </span>
                    <span style={{ color: 'var(--text-muted)' }}>"{wh.employerFeedback}"</span>
                  </div>
                )}
              </div>
            ))}

            {verifiedHistories.length === 0 && (
              <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                  Bạn chưa có công việc hoàn thành nào được xác thực. Hãy ứng tuyển việc làm và hoàn thành ca để tích lũy kinh nghiệm thực tế!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* KHU VỰC 10: DỰ ÁN CÁ NHÂN & PORTFOLIO */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={20} color="var(--primary)" /> 10. Dự án cá nhân & Portfolio
            </h2>
            {!isReadOnly && (
              <button type="button" onClick={() => setShowAddProj(!showAddProj)} className="btn btn-secondary btn-sm">
                <Plus size={14} /> Thêm dự án
              </button>
            )}
          </div>

          {!isReadOnly && showAddProj && (
            <div style={{ padding: '1.25rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label className="form-label">Tên dự án *</label>
                  <input type="text" className="form-control" value={newProj.title} onChange={e => setNewProj({ ...newProj, title: e.target.value })} placeholder="VD: Website đặt bàn nhà hàng" />
                </div>
                <div>
                  <label className="form-label">Link demo / GitHub</label>
                  <input type="url" className="form-control" value={newProj.link} onChange={e => setNewProj({ ...newProj, link: e.target.value })} placeholder="https://github.com/..." />
                </div>
                <div>
                  <label className="form-label">Công nghệ sử dụng</label>
                  <input type="text" className="form-control" value={newProj.technologies} onChange={e => setNewProj({ ...newProj, technologies: e.target.value })} placeholder="VD: React, Node.js, MySQL" />
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Mô tả dự án</label>
                <textarea rows={2} className="form-control" value={newProj.description} onChange={e => setNewProj({ ...newProj, description: e.target.value })} placeholder="Dự án cá nhân hỗ trợ quản lý đặt bàn trực tuyến..." />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowAddProj(false)} className="btn btn-secondary btn-sm">Hủy</button>
                <button type="button" onClick={handleAddProj} className="btn btn-primary btn-sm">Lưu dự án</button>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {projects.map((p, idx) => (
              <div key={idx} style={{ padding: '1.25rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', position: 'relative' }}>
                {!isReadOnly && (
                  <button type="button" onClick={() => handleRemoveProj(idx)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                    <Trash2 size={16} />
                  </button>
                )}
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)', paddingRight: '1.5rem' }}>{p.title}</div>
                {p.technologies && (
                  <div style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 600, marginTop: '0.25rem' }}>{p.technologies}</div>
                )}
                {p.description && (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>{p.description}</p>
                )}
                {p.link && (
                  <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', color: 'var(--primary)', marginTop: '0.5rem', fontWeight: 600 }}>
                    <ExternalLink size={13} /> Xem liên kết dự án
                  </a>
                )}
              </div>
            ))}
            {projects.length === 0 && !showAddProj && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Chưa có dự án nào được thêm.</p>
            )}
          </div>
        </div>

        {/* KHU VỰC 11: CHỨNG CHỈ */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={20} color="var(--primary)" /> 11. Chứng chỉ đạt được
            </h2>
            {!isReadOnly && (
              <button type="button" onClick={() => setShowAddCert(!showAddCert)} className="btn btn-secondary btn-sm">
                <Plus size={14} /> Thêm chứng chỉ
              </button>
            )}
          </div>

          {!isReadOnly && showAddCert && (
            <div style={{ padding: '1.25rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label className="form-label">Tên chứng chỉ *</label>
                  <input type="text" className="form-control" value={newCert.name} onChange={e => setNewCert({ ...newCert, name: e.target.value })} placeholder="VD: TOEIC 750 / Chứng chỉ Pha chế" />
                </div>
                <div>
                  <label className="form-label">Tổ chức cấp *</label>
                  <input type="text" className="form-control" value={newCert.issuer} onChange={e => setNewCert({ ...newCert, issuer: e.target.value })} placeholder="VD: IIG Vietnam / Vietblend" />
                </div>
                <div>
                  <label className="form-label">Năm cấp</label>
                  <input type="text" className="form-control" value={newCert.year} onChange={e => setNewCert({ ...newCert, year: e.target.value })} placeholder="VD: 2024" />
                </div>
                <div>
                  <label className="form-label">Link chứng chỉ</label>
                  <input type="url" className="form-control" value={newCert.url} onChange={e => setNewCert({ ...newCert, url: e.target.value })} placeholder="https://..." />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowAddCert(false)} className="btn btn-secondary btn-sm">Hủy</button>
                <button type="button" onClick={handleAddCert} className="btn btn-primary btn-sm">Lưu chứng chỉ</button>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {certificates.map((c, idx) => (
              <div key={idx} style={{ padding: '1rem 1.25rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', position: 'relative' }}>
                {!isReadOnly && (
                  <button type="button" onClick={() => handleRemoveCert(idx)} style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                    <Trash2 size={16} />
                  </button>
                )}
                <div style={{ fontWeight: 700, color: 'var(--text-main)', paddingRight: '1.5rem' }}>{c.name}</div>
                <div style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, marginTop: '0.2rem' }}>{c.issuer} ({c.year || 'N/A'})</div>
                {c.url && (
                  <a href={c.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--primary)', marginTop: '0.4rem' }}>
                    <ExternalLink size={12} /> Xem bản sao
                  </a>
                )}
              </div>
            ))}
            {certificates.length === 0 && !showAddCert && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Chưa có chứng chỉ nào được thêm.</p>
            )}
          </div>
        </div>

        {/* KHU VỰC 12: LỊCH RẢNH CÓ THỂ LÀM VIỆC (INTERACTIVE SCHEDULE MATRIX) */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={20} color="var(--primary)" /> 12. Lịch rảnh có thể làm việc trong tuần
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            {isReadOnly 
              ? 'Lịch rảnh có thể nhận ca làm việc của sinh viên trong tuần:' 
              : 'Chọn các thứ và buổi bạn có thể nhận ca. Hệ thống sẽ gợi ý các công việc có ca làm phù hợp với thời gian biểu của bạn.'}
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', minWidth: '550px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-main)' }}>
                  <th style={{ padding: '0.75rem', border: '1px solid var(--border-color)', textAlign: 'left', fontWeight: 700, color: 'var(--text-main)' }}>
                    Buổi trong ngày
                  </th>
                  {DAYS_OF_WEEK.map(d => (
                    <th key={d.id} style={{ padding: '0.75rem', border: '1px solid var(--border-color)', fontWeight: 700, color: 'var(--text-main)' }}>
                      {d.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SHIFT_TYPES.map(shift => (
                  <tr key={shift.key}>
                    <td style={{ padding: '0.75rem', border: '1px solid var(--border-color)', textAlign: 'left', fontWeight: 600, color: 'var(--text-main)', fontSize: '0.88rem' }}>
                      {shift.label}
                    </td>
                    {DAYS_OF_WEEK.map(d => {
                      const dayKey = String(d.id);
                      const isSelected = (availableSchedule[dayKey] || []).includes(shift.key);
                      return (
                        <td 
                          key={d.id} 
                          onClick={() => { if (!isReadOnly) toggleScheduleShift(d.id, shift.key); }}
                          style={{
                            padding: '0.75rem',
                            border: '1px solid var(--border-color)',
                            cursor: isReadOnly ? 'default' : 'pointer',
                            background: isSelected ? 'var(--primary-light)' : 'transparent',
                            color: isSelected ? 'var(--primary)' : 'var(--text-muted)',
                            fontWeight: isSelected ? 700 : 400,
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <input 
                            type="checkbox"
                            checked={isSelected}
                            disabled={isReadOnly}
                            onChange={() => {}} // handled by td onClick
                            style={{ cursor: isReadOnly ? 'default' : 'pointer', width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Save Bar */}
        {!isReadOnly && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button 
              type="submit" 
              disabled={saving}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 2.25rem', fontSize: '1rem', fontWeight: 700 }}
            >
              <Save size={20} /> {saving ? 'Đang lưu...' : 'Lưu toàn bộ hồ sơ'}
            </button>
          </div>
        )}

      </form>
    </div>
  );
};
