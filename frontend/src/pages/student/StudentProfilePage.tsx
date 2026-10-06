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
  AlertCircle 
} from 'lucide-react';

export const StudentProfilePage: React.FC = () => {
  const { user } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [university, setUniversity] = useState(user?.university || '');
  const [major, setMajor] = useState(user?.major || '');
  const [skills, setSkills] = useState(user?.skills || '');
  const [bio, setBio] = useState(user?.bio || '');

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Reviews from employers
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

      // Load user reviews
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
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      await userService.updateProfile({
        fullName,
        phone,
        university,
        major,
        skills,
        bio
      });
      setSuccessMsg('Cập nhật hồ sơ thành công!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật hồ sơ');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '900px' }}>
      {/* Page Title */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          Hồ sơ sinh viên
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Quản lý thông tin cá nhân, học vấn và xem đánh giá từ nhà tuyển dụng.
        </p>
      </div>

      {successMsg && (
        <div style={{
          background: '#dcfce7',
          color: '#166534',
          border: '1px solid #bbf7d0',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1.5rem'
        }}>
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div style={{
          background: '#fee2e2',
          color: '#991b1b',
          border: '1px solid #fecaca',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1.5rem'
        }}>
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Profile Edit Form */}
        <div style={{
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          padding: '2rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UserIcon size={20} color="var(--primary)" /> Thông tin cá nhân
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-main)' }}>
                Họ và tên
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  outline: 'none',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-main)' }}>
                Email (Định danh)
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 0.85rem',
                background: 'var(--bg-main)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-muted)',
                fontSize: '0.9rem'
              }}>
                <Mail size={16} />
                <span>{user?.email}</span>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-main)' }}>
                Số điện thoại
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={phone}
                  placeholder="0987xxxxxx"
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem 0.65rem 2.25rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    outline: 'none',
                    fontSize: '0.9rem'
                  }}
                />
                <Phone size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-main)' }}>
                Trường Đại học
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={university}
                  placeholder="Trường Đại học Văn Lang"
                  onChange={(e) => setUniversity(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem 0.65rem 2.25rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    outline: 'none',
                    fontSize: '0.9rem'
                  }}
                />
                <GraduationCap size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-main)' }}>
                Chuyên ngành
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={major}
                  placeholder="Công nghệ Thông tin / Kỹ thuật Phần mềm..."
                  onChange={(e) => setMajor(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem 0.65rem 2.25rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    outline: 'none',
                    fontSize: '0.9rem'
                  }}
                />
                <BookOpen size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-main)' }}>
                Kỹ năng chuyên môn
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={skills}
                  placeholder="React, Java Spring Boot, Figma, Content Writing..."
                  onChange={(e) => setSkills(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem 0.65rem 2.25rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    outline: 'none',
                    fontSize: '0.9rem'
                  }}
                />
                <Award size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
              <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.25rem', display: 'block' }}>
                Phân tách các kỹ năng bằng dấu phẩy
              </small>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-main)' }}>
                Giới thiệu bản thân (Bio)
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Mô tả kinh nghiệm, điểm mạnh và định hướng nghề nghiệp..."
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  outline: 'none',
                  fontSize: '0.9rem',
                  resize: 'vertical'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
              style={{
                marginTop: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <Save size={16} /> {saving ? 'Đang lưu...' : 'Lưu thông tin hồ sơ'}
            </button>
          </form>
        </div>

        {/* Reputation & Ratings Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Rating Summary Card */}
          <div style={{
            background: 'white',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)'
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
            background: 'white',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-sm)',
            flex: 1
          }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
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
                    background: 'var(--bg-main)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{rev.reviewer?.fullName || 'Nhà tuyển dụng'}</span>
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
        </div>
      </div>
    </div>
  );
};
