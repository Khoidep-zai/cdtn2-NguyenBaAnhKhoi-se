import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { jobService } from '../services/jobService';
import { useAuth } from '../context/AuthContext';

export const PostJobPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('1');
  const [jobType, setJobType] = useState('PART_TIME');
  const [workMode, setWorkMode] = useState('ONSITE');
  const [location, setLocation] = useState('');
  const [salaryType, setSalaryType] = useState('HOURLY');
  const [salaryAmount, setSalaryAmount] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [slotsAvailable, setSlotsAvailable] = useState('1');
  const [deadline, setDeadline] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || user?.role !== 'ROLE_EMPLOYER') {
      setError('Bạn cần đăng nhập với tài khoản Nhà tuyển dụng để đăng tin.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await jobService.createJob({
        title,
        categoryId: Number(categoryId),
        jobType,
        workMode,
        location,
        salaryType,
        salaryAmount: Number(salaryAmount),
        description,
        requirements,
        slotsAvailable: Number(slotsAvailable),
        deadline: deadline || undefined,
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng tin thất bại. Vui lòng kiểm tra lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '800px' }}>
      <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', padding: '2.5rem', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Đăng tin tuyển dụng mới</h1>
          <p style={{ color: 'var(--text-muted)' }}>Tiếp cận hàng nghìn sinh viên tài năng và nhiệt huyết</p>
        </div>

        {success && (
          <div style={{ background: '#dcfce7', border: '1px solid #bbf7d0', color: '#166534', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
            <CheckCircle2 size={20} /> Tin tuyển dụng đã được tạo thành công! Đang chuyển hướng về Dashboard...
          </div>
        )}

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
            <AlertCircle size={20} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem' }}>Tiêu đề công việc</label>
            <input
              type="text"
              required
              placeholder="VD: Tuyển Barista ca tối, Lập trình ReactJS..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem' }}>Ngành nghề / Danh mục</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'white' }}
              >
                <option value="1">Lập trình & CNTT</option>
                <option value="2">Thiết kế đồ họa</option>
                <option value="3">Gia sư & Dạy kèm</option>
                <option value="4">Phục vụ & Bán hàng</option>
                <option value="5">Content & Dịch thuật</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem' }}>Hình thức làm việc</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'white' }}
              >
                <option value="PART_TIME">Việc làm Part-time</option>
                <option value="FREELANCE">Dự án Freelance</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem' }}>Địa điểm / Chế độ làm</label>
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'white' }}
              >
                <option value="ONSITE">Làm tại chỗ (Onsite)</option>
                <option value="REMOTE">Làm việc từ xa (Remote)</option>
                <option value="HYBRID">Kết hợp (Hybrid)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem' }}>Khu vực (Quận / Huyện)</label>
              <input
                type="text"
                placeholder="VD: Bình Thạnh, Gò Vấp, hoặc Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem' }}>Hình thức chi trả</label>
              <select
                value={salaryType}
                onChange={(e) => setSalaryType(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'white' }}
              >
                <option value="HOURLY">Theo giờ (VNĐ/giờ)</option>
                <option value="FIXED_PROJECT">Trọn gói theo dự án</option>
                <option value="MONTHLY">Theo tháng</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem' }}>Mức thù lao (VNĐ)</label>
              <input
                type="number"
                required
                placeholder="VD: 30000 hoặc 2000000"
                value={salaryAmount}
                onChange={(e) => setSalaryAmount(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem' }}>Mô tả chi tiết công việc</label>
            <textarea
              required
              rows={4}
              placeholder="Nêu rõ nội dung công việc, thời gian các ca làm việc..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem' }}>Yêu cầu ứng viên</label>
            <textarea
              rows={3}
              placeholder="Yêu cầu về độ tuổi, kỹ năng, thái độ..."
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem' }}>Số lượng cần tuyển</label>
              <input
                type="number"
                min="1"
                required
                value={slotsAvailable}
                onChange={(e) => setSlotsAvailable(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem' }}>Hạn nộp hồ sơ</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0.85rem', marginTop: '0.5rem' }}>
            <PlusCircle size={18} /> {loading ? 'Đang đăng tin...' : 'Đăng tin tuyển dụng ngay'}
          </button>
        </form>
      </div>
    </div>
  );
};
