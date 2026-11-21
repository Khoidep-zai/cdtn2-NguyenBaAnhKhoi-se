import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { jobService } from '../services/jobService';
import { useAuth } from '../context/AuthContext';
import { Category } from '../types';

export const PostJobPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('1');
  const [categories, setCategories] = useState<Category[]>([]);
  const [jobType, setJobType] = useState('PART_TIME');
  const [workMode, setWorkMode] = useState('ONSITE');
  const [location, setLocation] = useState('');
  const [province, setProvince] = useState('Hồ Chí Minh');
  const [provinces, setProvinces] = useState<string[]>([]);
  const [salaryType, setSalaryType] = useState('HOURLY');
  const [salaryAmount, setSalaryAmount] = useState('');
  const [salaryText, setSalaryText] = useState('');
  const [workingHours, setWorkingHours] = useState('');
  const [shiftType, setShiftType] = useState('FLEXIBLE');
  const [benefits, setBenefits] = useState('');
  const [studentFriendly, setStudentFriendly] = useState(true);
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [slotsAvailable, setSlotsAvailable] = useState('1');
  const [deadline, setDeadline] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Cấu hình ca làm việc chi tiết
  const [shifts, setShifts] = useState<Array<{
    dayOfWeek: number;
    shiftName: string;
    startTime: string;
    endTime: string;
    isFlexible: boolean;
  }>>([]);
  const [shiftDay, setShiftDay] = useState<number>(1);
  const [shiftNameInput, setShiftNameInput] = useState<string>('Ca sáng');
  const [shiftStartInput, setShiftStartInput] = useState<string>('08:00');
  const [shiftEndInput, setShiftEndInput] = useState<string>('12:00');
  const [shiftFlexibleInput, setShiftFlexibleInput] = useState<boolean>(false);

  const handleAddShift = () => {
    setShifts([
      ...shifts,
      {
        dayOfWeek: shiftDay,
        shiftName: shiftNameInput,
        startTime: shiftStartInput,
        endTime: shiftEndInput,
        isFlexible: shiftFlexibleInput
      }
    ]);
  };

  const handleRemoveShift = (idx: number) => {
    setShifts(shifts.filter((_, i) => i !== idx));
  };

  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories and provinces dynamically
    jobService.getCategories()
      .then(cats => {
        if (cats && cats.length > 0) {
          setCategories(cats);
          setCategoryId(String(cats[0].id));
        }
      })
      .catch(() => {});

    jobService.getProvinces()
      .then(provs => {
        if (provs && provs.length > 0) {
          setProvinces(provs);
          if (provs.includes('Hồ Chí Minh')) {
            setProvince('Hồ Chí Minh');
          } else {
            setProvince(provs[0]);
          }
        }
      })
      .catch(() => {});
  }, []);

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
        province,
        salaryType,
        salaryAmount: Number(salaryAmount),
        salaryText: salaryText || undefined,
        workingHours: workingHours || undefined,
        shiftType,
        benefits: benefits || undefined,
        studentFriendly,
        description,
        requirements,
        slotsAvailable: Number(slotsAvailable),
        deadline: deadline ? `${deadline}T23:59:59` : undefined,
        shifts: shifts.length > 0 ? shifts : undefined,
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
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '850px' }}>
      <div style={{ background: 'var(--bg-card)', color: 'var(--text-main)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', padding: '2.5rem', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>Đăng tin tuyển dụng mới</h1>
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
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-card-subtle)', color: 'var(--text-main)' }}
              >
                {categories.length > 0 ? (
                  categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))
                ) : (
                  <>
                    <option value="1">Lập trình & CNTT</option>
                    <option value="2">Thiết kế đồ họa</option>
                    <option value="3">Gia sư & Dạy kèm</option>
                    <option value="4">Phục vụ & Bán hàng</option>
                    <option value="5">Content & Dịch thuật</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem' }}>Hình thức làm việc</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-card-subtle)', color: 'var(--text-main)' }}
              >
                <option value="PART_TIME">Việc làm Part-time</option>
                <option value="FREELANCE">Dự án Freelance</option>
                <option value="INTERNSHIP">Thực tập sinh (Internship)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem' }}>Chế độ làm việc</label>
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-card-subtle)', color: 'var(--text-main)' }}
              >
                <option value="ONSITE">Làm tại chỗ (Onsite)</option>
                <option value="REMOTE">Làm việc từ xa (Remote)</option>
                <option value="HYBRID">Kết hợp (Hybrid)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem' }}>Tỉnh / Thành phố</label>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-card-subtle)', color: 'var(--text-main)' }}
              >
                {provinces.length > 0 ? (
                  provinces.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))
                ) : (
                  <>
                    <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                    <option value="Cần Thơ">Cần Thơ</option>
                    <option value="Bình Dương">Bình Dương</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem' }}>Địa chỉ cụ thể (Quận / Đường)</label>
              <input
                type="text"
                placeholder="VD: Quận 1, Bình Thạnh..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem' }}>Hình thức thù lao</label>
              <select
                value={salaryType}
                onChange={(e) => setSalaryType(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-card-subtle)', color: 'var(--text-main)' }}
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
                placeholder="VD: 30000 hoặc 5000000"
                value={salaryAmount}
                onChange={(e) => setSalaryAmount(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem' }}>Mô tả mức lương hiển thị</label>
              <input
                type="text"
                placeholder="VD: 25.000đ - 35.000đ/giờ, Thỏa thuận"
                value={salaryText}
                onChange={(e) => setSalaryText(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem' }}>Nhóm ca làm việc</label>
              <select
                value={shiftType}
                onChange={(e) => setShiftType(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-card-subtle)', color: 'var(--text-main)' }}
              >
                <option value="FLEXIBLE">Linh hoạt theo lịch học</option>
                <option value="MORNING">Ca sáng (Sáng)</option>
                <option value="AFTERNOON">Ca chiều (Chiều)</option>
                <option value="EVENING">Ca tối (Tối)</option>
                <option value="WEEKEND">Cuối tuần (Thứ 7 & CN)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem' }}>Chi tiết giờ làm</label>
              <input
                type="text"
                placeholder="VD: 18h-22h, 4 tiếng/ngày"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem' }}>Quyền lợi & Phúc lợi</label>
              <input
                type="text"
                placeholder="VD: Bao ăn giữa ca, Thưởng chuyên cần"
                value={benefits}
                onChange={(e) => setBenefits(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
              />
            </div>
          </div>

          {/* CẤU HÌNH LỊCH CA LÀM VIỆC CHI TIẾT */}
          <div style={{ padding: '1.25rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                  📅 Cấu hình ca làm việc chi tiết theo Thứ (Hỗ trợ nhiều ca & ca qua đêm)
                </label>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Giúp sinh viên tìm việc dễ dàng theo thứ và khung giờ rảnh của họ
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>Thứ làm việc</label>
                <select
                  value={shiftDay}
                  onChange={e => setShiftDay(Number(e.target.value))}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                >
                  <option value={1}>Thứ 2</option>
                  <option value={2}>Thứ 3</option>
                  <option value={3}>Thứ 4</option>
                  <option value={4}>Thứ 5</option>
                  <option value={5}>Thứ 6</option>
                  <option value={6}>Thứ 7</option>
                  <option value={7}>Chủ nhật</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>Tên ca</label>
                <input
                  type="text"
                  value={shiftNameInput}
                  onChange={e => setShiftNameInput(e.target.value)}
                  placeholder="Ca sáng / Ca tối..."
                  style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>Giờ bắt đầu</label>
                <input
                  type="time"
                  value={shiftStartInput}
                  onChange={e => setShiftStartInput(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>Giờ kết thúc</label>
                <input
                  type="time"
                  value={shiftEndInput}
                  onChange={e => setShiftEndInput(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={shiftFlexibleInput}
                  onChange={e => setShiftFlexibleInput(e.target.checked)}
                />
                Lịch linh hoạt (sinh viên có thể tự sắp xếp ca trong ngày này)
              </label>

              <button
                type="button"
                onClick={handleAddShift}
                className="btn btn-secondary btn-sm"
                style={{ fontWeight: 600 }}
              >
                + Thêm ca này vào lịch
              </button>
            </div>

            {/* Danh sách ca đã thêm xem trước */}
            {shifts.length > 0 && (
              <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px dashed var(--border-color)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-main)' }}>
                  Các ca đã cấu hình ({shifts.length}):
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {shifts.map((s, idx) => {
                    const dayLabels: Record<number, string> = { 1: 'T2', 2: 'T3', 3: 'T4', 4: 'T5', 5: 'T6', 6: 'T7', 7: 'CN' };
                    return (
                      <span
                        key={idx}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          background: 'var(--bg-card)',
                          padding: '0.3rem 0.6rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-color)',
                          fontSize: '0.78rem',
                          fontWeight: 600
                        }}
                      >
                        <strong>{dayLabels[s.dayOfWeek]}</strong>: {s.shiftName} ({s.startTime} - {s.endTime})
                        {s.isFlexible && <span style={{ color: '#16a34a' }}> [Linh hoạt]</span>}
                        <button
                          type="button"
                          onClick={() => handleRemoveShift(idx)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0, marginLeft: '0.25rem' }}
                        >
                          &times;
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.4rem' }}>Mô tả chi tiết công việc</label>
            <textarea
              required
              rows={4}
              placeholder="Nêu rõ nội dung công việc, trách nhiệm cụ thể..."
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0' }}>
            <input
              type="checkbox"
              id="studentFriendly"
              checked={studentFriendly}
              onChange={(e) => setStudentFriendly(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <label htmlFor="studentFriendly" style={{ fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
              🌟 Công việc ưu tiên & phù hợp cho sinh viên (Linh hoạt lịch thi, thời gian)
            </label>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0.85rem', marginTop: '0.5rem' }}>
            <PlusCircle size={18} /> {loading ? 'Đang đăng tin...' : 'Đăng tin tuyển dụng ngay'}
          </button>
        </form>
      </div>
    </div>
  );
};
