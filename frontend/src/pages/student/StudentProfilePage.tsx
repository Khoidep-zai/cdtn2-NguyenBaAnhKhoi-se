import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { reviewService, Review } from '../../services/reviewService';
import { StarRating } from '../../components/review/StarRating';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  GraduationCap, 
  BookOpen, 
  Award, 
  FileText, 
  Star, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  MapPin,
  Shield,
  Briefcase
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [university, setUniversity] = useState(user?.university || '');
  const [major, setMajor] = useState(user?.major || '');
  const [skills, setSkills] = useState(user?.skills || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [cvUrl, setCvUrl] = useState(user?.cvUrl || '');
  const [companyName, setCompanyName] = useState(user?.companyName || '');
  const [companyAddress, setCompanyAddress] = useState(user?.companyAddress || '');

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Reviews from employers (for students)
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState<number>(0);
  const [loadingReviews, setLoadingReviews] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setPhone(user.phone || '');
      setUniversity(user.university || '');
      setMajor(user.major || '');
      setSkills(user.skills || '');
      setBio(user.bio || '');
      setCvUrl(user.cvUrl || '');
      setCompanyName(user.companyName || '');
      setCompanyAddress(user.companyAddress || '');

      // Load user reviews if student
      if (user.role === 'ROLE_STUDENT') {
        setLoadingReviews(true);
        Promise.all([
          reviewService.getReviewsForUser(user.id).catch(() => []),
          reviewService.getUserRating(user.id).catch(() => 0)
        ]).then(([revs, rating]) => {
          setReviews(revs || []);
          setAvgRating(rating || 0);
        }).finally(() => {
          setLoadingReviews(false);
        });
      }
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const updatePayload: Record<string, string> = {
        fullName,
        phone,
        bio,
      };

      if (user?.role === 'ROLE_STUDENT') {
        updatePayload.university = university;
        updatePayload.major = major;
        updatePayload.skills = skills;
        updatePayload.cvUrl = cvUrl;
      } else if (user?.role === 'ROLE_EMPLOYER') {
        updatePayload.companyName = companyName;
        updatePayload.companyAddress = companyAddress;
      }

      await userService.updateProfile(updatePayload);
      updateUser(updatePayload);
      setSuccessMsg('Cập nhật hồ sơ thành công!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật hồ sơ');
    } finally {
      setSaving(false);
    }
  };

  const getPageTitle = () => {
    if (user?.role === 'ROLE_ADMIN') return 'Hồ sơ Quản trị viên';
    if (user?.role === 'ROLE_EMPLOYER') return 'Hồ sơ Nhà tuyển dụng / Doanh nghiệp';
    return 'Hồ sơ sinh viên';
  };

  const getPageSubtitle = () => {
    if (user?.role === 'ROLE_ADMIN') return 'Quản lý thông tin quản trị viên và giám sát vận hành nền tảng FreelanceHub.';
    if (user?.role === 'ROLE_EMPLOYER') return 'Cập nhật thông tin công ty, địa chỉ trụ sở và người đại diện tuyển dụng.';
    return 'Quản lý thông tin cá nhân, học vấn và xem đánh giá từ nhà tuyển dụng.';
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 0.95rem',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md)',
    background: 'var(--bg-card-subtle)',
    color: 'var(--text-main)',
    outline: 'none',
    fontSize: '0.925rem'
  };

  const inputWithIconStyle: React.CSSProperties = {
    ...inputStyle,
    paddingLeft: '2.5rem'
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: 600,
    marginBottom: '0.4rem',
    color: 'var(--text-main)'
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '960px' }}>
      {/* Page Title */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
          {getPageTitle()}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          {getPageSubtitle()}
        </p>
      </div>

      {successMsg && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          color: '#10b981',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          marginBottom: '1.75rem',
          fontWeight: 600
        }}>
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          color: '#ef4444',
          border: '1px solid rgba(239, 68, 68, 0.35)',
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          marginBottom: '1.75rem',
          fontWeight: 600
        }}>
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Profile Edit Form Card */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          padding: '2.25rem',
          boxShadow: 'var(--shadow-sm)',
          color: 'var(--text-main)'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
            {user?.role === 'ROLE_EMPLOYER' ? (
              <><Building2 size={22} color="var(--primary)" /> Thông tin doanh nghiệp</>
            ) : user?.role === 'ROLE_ADMIN' ? (
              <><Shield size={22} color="#ef4444" /> Thông tin ban quản trị</>
            ) : (
              <><UserIcon size={22} color="var(--primary)" /> Thông tin cá nhân</>
            )}
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Employer: Company Name */}
            {user?.role === 'ROLE_EMPLOYER' && (
              <div>
                <label style={labelStyle}>Tên Doanh nghiệp / Tổ chức</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    value={companyName}
                    placeholder="Công ty Cổ phần Công nghệ..."
                    onChange={(e) => setCompanyName(e.target.value)}
                    style={inputWithIconStyle}
                  />
                  <Building2 size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label style={labelStyle}>
                {user?.role === 'ROLE_EMPLOYER' ? 'Người đại diện tuyển dụng' : 'Họ và tên'}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={inputWithIconStyle}
                />
                <UserIcon size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            {/* Email (Readonly) */}
            <div>
              <label style={labelStyle}>Email (Tài khoản định danh)</label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.75rem 0.95rem',
                background: 'var(--bg-main)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-muted)',
                fontSize: '0.925rem'
              }}>
                <Mail size={16} />
                <span>{user?.email}</span>
                <span style={{ marginLeft: 'auto', fontSize: '0.75rem', background: 'var(--bg-card-subtle)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                  Không thể thay đổi
                </span>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label style={labelStyle}>Số điện thoại liên hệ</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="tel"
                  value={phone}
                  placeholder="0987xxxxxx"
                  onChange={(e) => setPhone(e.target.value)}
                  style={inputWithIconStyle}
                />
                <Phone size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            {/* Employer: Company Address */}
            {user?.role === 'ROLE_EMPLOYER' && (
              <div>
                <label style={labelStyle}>Địa chỉ trụ sở / Văn phòng</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={companyAddress}
                    placeholder="Số 69/68 Đặng Thùy Trâm, P.13, Q.Bình Thạnh, TP.HCM"
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    style={inputWithIconStyle}
                  />
                  <MapPin size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
              </div>
            )}

            {/* Student: University & Major */}
            {user?.role === 'ROLE_STUDENT' && (
              <>
                <div>
                  <label style={labelStyle}>Trường Đại học</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={university}
                      placeholder="Trường Đại học Văn Lang"
                      onChange={(e) => setUniversity(e.target.value)}
                      style={inputWithIconStyle}
                    />
                    <GraduationCap size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Chuyên ngành</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={major}
                      placeholder="Công nghệ Thông tin / Kỹ thuật Phần mềm..."
                      onChange={(e) => setMajor(e.target.value)}
                      style={inputWithIconStyle}
                    />
                    <BookOpen size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Kỹ năng chuyên môn</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={skills}
                      placeholder="React, Java Spring Boot, Figma, Content Writing..."
                      onChange={(e) => setSkills(e.target.value)}
                      style={inputWithIconStyle}
                    />
                    <Award size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.25rem', display: 'block' }}>
                    Phân tách các kỹ năng bằng dấu phẩy
                  </small>
                </div>
              </>
            )}

            {/* Bio */}
            <div>
              <label style={labelStyle}>
                {user?.role === 'ROLE_EMPLOYER' ? 'Giới thiệu về Doanh nghiệp' : user?.role === 'ROLE_ADMIN' ? 'Ghi chú / Chức vụ Quản trị' : 'Giới thiệu bản thân (Bio)'}
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder={
                  user?.role === 'ROLE_EMPLOYER'
                    ? 'Giới thiệu môi trường làm việc, văn hóa doanh nghiệp và cơ hội phát triển...'
                    : 'Mô tả kinh nghiệm, điểm mạnh và định hướng nghề nghiệp...'
                }
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                  minHeight: '80px'
                }}
              />
            </div>

            {/* Student: CV Link */}
            {user?.role === 'ROLE_STUDENT' && (
              <div>
                <label style={labelStyle}>Liên kết CV / Hồ sơ năng lực (Link PDF, Google Drive, Portfolio)</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="url"
                    value={cvUrl}
                    placeholder="https://drive.google.com/... hoặc https://my-portfolio.dev"
                    onChange={(e) => setCvUrl(e.target.value)}
                    style={inputWithIconStyle}
                  />
                  <FileText size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.25rem', display: 'block' }}>
                  CV này sẽ được tự động điền khi bạn nộp đơn ứng tuyển các việc làm.
                </small>
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
              style={{
                marginTop: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.85rem',
                fontWeight: 700
              }}
            >
              <Save size={18} /> {saving ? 'Đang lưu...' : 'Lưu thông tin hồ sơ'}
            </button>
          </form>
        </div>

        {/* Sidebar Cards based on role */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {user?.role === 'ROLE_STUDENT' ? (
            <>
              {/* Rating Summary Card */}
              <div style={{
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                padding: '2rem',
                textAlign: 'center',
                boxShadow: 'var(--shadow-sm)',
                color: 'var(--text-main)'
              }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
                  Độ uy tín & Đánh giá
                </h3>

                <div style={{ fontSize: '3rem', fontWeight: 800, color: '#f59e0b', lineHeight: 1, marginBottom: '0.5rem' }}>
                  {avgRating > 0 ? avgRating.toFixed(1) : '5.0'}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
                  <StarRating rating={avgRating > 0 ? Math.round(avgRating) : 5} size={22} />
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  {reviews.length > 0 ? `Dựa trên ${reviews.length} đánh giá từ Nhà tuyển dụng` : 'Chưa có đánh giá nào (Mặc định 5.0 ⭐)'}
                </p>
              </div>

              {/* Reviews List */}
              <div style={{
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-sm)',
                color: 'var(--text-main)',
                flex: 1
              }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)' }}>
                  <Star size={18} color="#f59e0b" /> Nhận xét gần đây ({reviews.length})
                </h3>

                {loadingReviews ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Đang tải đánh giá...</p>
                ) : reviews.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
                    <FileText size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.4 }} />
                    <p style={{ fontSize: '0.88rem' }}>Khi hoàn thành công việc, nhận xét của nhà tuyển dụng sẽ xuất hiện tại đây.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '380px', overflowY: 'auto' }}>
                    {reviews.map((rev) => (
                      <div key={rev.id} style={{
                        padding: '0.85rem',
                        background: 'var(--bg-card-subtle)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-main)' }}>{rev.reviewer?.fullName || 'Nhà tuyển dụng'}</span>
                          <StarRating rating={rev.rating} size={14} />
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: '0.3rem 0' }}>{rev.comment}</p>
                        <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                          {new Date(rev.createdAt).toLocaleDateString('vi-VN')}
                        </small>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : user?.role === 'ROLE_EMPLOYER' ? (
            <>
              {/* Employer Verification & Quick Actions */}
              <div style={{
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                padding: '2rem',
                boxShadow: 'var(--shadow-sm)',
                color: 'var(--text-main)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)'
                  }}>
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      Doanh nghiệp xác thực
                    </h3>
                    <span className="badge badge-featured">Verified Employer</span>
                  </div>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Hồ sơ doanh nghiệp rõ ràng, đầy đủ địa chỉ sẽ tăng 85% tỷ lệ sinh viên ứng tuyển công việc của bạn.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <Link to="/employer/post-job" className="btn btn-primary" style={{ justifyContent: 'center' }}>
                    <Briefcase size={16} /> Đăng việc làm mới
                  </Link>
                  <Link to="/employer/my-jobs" className="btn btn-secondary" style={{ justifyContent: 'center' }}>
                    <FileText size={16} /> Quản lý tin tuyển dụng
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Admin System Privileges Card */}
              <div style={{
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                padding: '2rem',
                boxShadow: 'var(--shadow-sm)',
                color: 'var(--text-main)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(239, 68, 68, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ef4444'
                  }}>
                    <Shield size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      Quản trị viên Hệ thống
                    </h3>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ef4444', textTransform: 'uppercase' }}>
                      SUPER ADMIN • FULL ACCESS
                    </span>
                  </div>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Tài khoản có toàn quyền quản lý tài khoản người dùng, duyệt công việc và giám sát các giao dịch hợp tác việc làm sinh viên.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <Link to="/admin/dashboard" className="btn btn-primary" style={{ justifyContent: 'center' }}>
                    <Shield size={16} /> Bảng điều khiển Quản trị
                  </Link>
                  <Link to="/admin/users" className="btn btn-secondary" style={{ justifyContent: 'center' }}>
                    <UserIcon size={16} /> Quản lý người dùng
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const ProfilePage = StudentProfilePage;
