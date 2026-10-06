import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { User, RoleType } from '../../types';
import { 
  ArrowLeft, 
  Search, 
  Ban, 
  RefreshCw 
} from 'lucide-react';

export const ManageUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllUsers();
      setUsers(data || []);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId: number) => {
    setTogglingId(userId);
    try {
      await adminService.toggleUserStatus(userId);
      await fetchUsers();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Có lỗi xảy ra khi đổi trạng thái người dùng');
    } finally {
      setTogglingId(null);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: RoleType) => {
    switch (role) {
      case 'ROLE_ADMIN':
        return <span style={{ background: '#fee2e2', color: '#991b1b', padding: '0.25rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>Admin</span>;
      case 'ROLE_EMPLOYER':
        return <span style={{ background: '#dbeafe', color: '#1e40af', padding: '0.25rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>Nhà tuyển dụng</span>;
      default:
        return <span style={{ background: '#dcfce7', color: '#166534', padding: '0.25rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>Sinh viên</span>;
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '1100px' }}>
      <Link
        to="/admin/dashboard"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: 'var(--text-muted)',
          textDecoration: 'none',
          marginBottom: '1.5rem',
          fontWeight: 600,
          fontSize: '0.9rem'
        }}
      >
        <ArrowLeft size={16} /> Quay lại bảng điều khiển Admin
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
            Quản lý người dùng hệ thống
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Xem danh sách, phân quyền và khóa/mở khóa tài khoản thành viên.
          </p>
        </div>
        <button onClick={fetchUsers} className="btn btn-secondary" style={{ padding: '0.45rem 0.85rem' }}>
          <RefreshCw size={15} /> Làm mới
        </button>
      </div>

      {/* Search and Filters */}
      <div style={{
        background: 'white',
        padding: '1.25rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        marginBottom: '1.5rem',
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        alignItems: 'center',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 0.85rem 0.6rem 2.25rem',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              outline: 'none',
              fontSize: '0.9rem'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Vai trò:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{
              padding: '0.6rem 0.85rem',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              outline: 'none',
              background: 'white'
            }}
          >
            <option value="ALL">Tất cả vai trò</option>
            <option value="ROLE_STUDENT">Sinh viên</option>
            <option value="ROLE_EMPLOYER">Nhà tuyển dụng</option>
            <option value="ROLE_ADMIN">Quản trị viên</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div style={{
        background: 'white',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)'
      }}>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>Đang tải người dùng...</p>
        ) : filteredUsers.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>Không tìm thấy người dùng phù hợp.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.85rem 1rem' }}>ID</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Người dùng</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Vai trò</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Thông tin phụ</th>
                  <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>#{u.id}</td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{u.fullName}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{u.email}</div>
                    </td>
                    <td style={{ padding: '1rem' }}>{getRoleBadge(u.role)}</td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {u.role === 'ROLE_EMPLOYER' ? (
                        <span>{u.companyName || 'Chưa cập nhật công ty'}</span>
                      ) : (
                        <span>{u.university || 'ĐH Văn Lang'} {u.major ? `• ${u.major}` : ''}</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      {u.role !== 'ROLE_ADMIN' && (
                        <button
                          onClick={() => handleToggleStatus(u.id)}
                          disabled={togglingId === u.id}
                          className="btn btn-secondary"
                          style={{
                            padding: '0.35rem 0.65rem',
                            fontSize: '0.8rem',
                            color: '#b91c1c',
                            borderColor: '#fca5a5'
                          }}
                        >
                          <Ban size={14} /> Khóa / Mở
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
