import React, { useState, useEffect, useRef } from 'react';
import { Bell, BellRing, Clock, CheckCheck, Inbox } from 'lucide-react';
import { notificationService, NotificationItem } from '../../services/notificationService';

export const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const items = await notificationService.getMyNotifications();
      setNotifications(items || []);
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count || 0);
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // 30s poll
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // Ignore
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      // Ignore
    }
  };

  const filteredNotifications = activeTab === 'unread'
    ? notifications.filter((n) => !n.isRead)
    : notifications;

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      {/* Redesigned Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="nav-notification-trigger"
        style={{
          position: 'relative',
          width: '40px',
          height: '40px',
          borderRadius: 'var(--radius-full)',
          background: isOpen ? 'var(--primary-light)' : 'var(--bg-card)',
          border: `1.5px solid ${isOpen ? 'var(--primary)' : 'var(--border-color)'}`,
          color: isOpen ? 'var(--primary)' : 'var(--text-main)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: isOpen
            ? '0 0 16px -2px rgba(67, 56, 202, 0.35)'
            : isHovered
            ? 'var(--shadow-md)'
            : 'var(--shadow-sm)',
          transform: isHovered && !isOpen ? 'translateY(-2px)' : 'none',
        }}
        aria-label="Thông báo"
        aria-expanded={isOpen}
      >
        <span
          className="notification-icon-wrapper"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            transformOrigin: 'top center',
            animation: isHovered ? 'bellChime 0.6s ease-in-out' : 'none',
          }}
        >
          {unreadCount > 0 ? (
            <BellRing size={20} color={isOpen ? 'var(--primary)' : 'var(--text-main)'} />
          ) : (
            <Bell size={20} color={isOpen ? 'var(--primary)' : 'var(--text-main)'} />
          )}
        </span>

        {/* Pulsating Glowing Badge */}
        {unreadCount > 0 && (
          <span
            className="notification-unread-badge"
            style={{
              position: 'absolute',
              top: '-3px',
              right: '-3px',
              minWidth: '19px',
              height: '19px',
              padding: '0 4px',
              borderRadius: '999px',
              background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
              color: '#ffffff',
              fontSize: '0.68rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(239, 68, 68, 0.45)',
              border: '2px solid var(--bg-card)',
              animation: 'badgePulseGlow 2s infinite',
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Modern Glassmorphic Notification Dropdown */}
      {isOpen && (
        <div
          className="notification-dropdown-panel"
          style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 12px)',
            width: '360px',
            maxWidth: 'calc(100vw - 2rem)',
            background: 'var(--bg-card)',
            color: 'var(--text-main)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.22), 0 0 0 1px var(--border-color)',
            border: '1px solid var(--border-color)',
            zIndex: 1000,
            overflow: 'hidden',
            backdropFilter: 'blur(20px)',
            animation: 'dropdownSpring 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
            transformOrigin: 'top right',
          }}
        >
          {/* Top Decorative Gradient Line */}
          <div
            style={{
              height: '3px',
              width: '100%',
              background: 'linear-gradient(90deg, var(--primary) 0%, #06b6d4 50%, #f59e0b 100%)',
            }}
          />

          {/* Header */}
          <div
            style={{
              padding: '0.9rem 1.15rem',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--bg-card-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'var(--primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)',
                }}
              >
                <Bell size={15} />
              </div>
              <div>
                <strong style={{ fontSize: '0.92rem', color: 'var(--text-main)' }}>
                  Thông báo
                </strong>
                {unreadCount > 0 && (
                  <span
                    style={{
                      marginLeft: '0.45rem',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: 'var(--danger)',
                      background: 'rgba(239, 68, 68, 0.12)',
                      padding: '0.15rem 0.45rem',
                      borderRadius: 'var(--radius-full)',
                    }}
                  >
                    {unreadCount} mới
                  </span>
                )}
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.76rem',
                  color: 'var(--primary)',
                  fontWeight: 700,
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.25rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'background 0.2s',
                }}
                className="btn-mark-all-read"
                title="Đánh dấu tất cả là đã đọc"
              >
                <CheckCheck size={14} /> Đã đọc hết
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid var(--border-color)',
              background: 'var(--bg-card)',
              padding: '0.35rem 0.75rem',
              gap: '0.4rem',
            }}
          >
            <button
              onClick={() => setActiveTab('all')}
              style={{
                flex: 1,
                padding: '0.35rem 0.6rem',
                fontSize: '0.78rem',
                fontWeight: activeTab === 'all' ? 700 : 500,
                color: activeTab === 'all' ? 'var(--primary)' : 'var(--text-muted)',
                background: activeTab === 'all' ? 'var(--primary-light)' : 'transparent',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Tất cả ({notifications.length})
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              style={{
                flex: 1,
                padding: '0.35rem 0.6rem',
                fontSize: '0.78rem',
                fontWeight: activeTab === 'unread' ? 700 : 500,
                color: activeTab === 'unread' ? 'var(--primary)' : 'var(--text-muted)',
                background: activeTab === 'unread' ? 'var(--primary-light)' : 'transparent',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Chưa đọc ({unreadCount})
            </button>
          </div>

          {/* Notification List Body */}
          <div style={{ maxHeight: '360px', overflowY: 'auto' }} className="notification-scroll-body">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.isRead && handleMarkAsRead(n.id)}
                  style={{
                    padding: '0.85rem 1.15rem',
                    borderBottom: '1px solid var(--border-color)',
                    background: n.isRead ? 'transparent' : 'rgba(67, 56, 202, 0.05)',
                    borderLeft: n.isRead ? '3px solid transparent' : '3px solid var(--primary)',
                    cursor: n.isRead ? 'default' : 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  className="notification-item-row"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem', gap: '0.5rem' }}>
                    <div
                      style={{
                        fontWeight: n.isRead ? 600 : 700,
                        fontSize: '0.86rem',
                        color: n.isRead ? 'var(--text-main)' : 'var(--primary)',
                        lineHeight: 1.35,
                      }}
                    >
                      {n.title}
                    </div>
                    {!n.isRead && (
                      <span
                        style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          background: 'var(--primary)',
                          boxShadow: '0 0 6px var(--primary)',
                          flexShrink: 0,
                          marginTop: '4px',
                        }}
                      />
                    )}
                  </div>
                  <div style={{ fontSize: '0.81rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                    {n.message}
                  </div>
                  <div
                    style={{
                      fontSize: '0.72rem',
                      color: 'var(--text-light)',
                      marginTop: '0.45rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Clock size={12} />
                    <span>
                      {n.createdAt
                        ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
                          ' · ' +
                          new Date(n.createdAt).toLocaleDateString([], { day: '2-digit', month: '2-digit' })
                        : 'Vừa xong'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div
                style={{
                  padding: '2.5rem 1.5rem',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.65rem',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'var(--bg-card-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-light)',
                  }}
                >
                  <Inbox size={24} />
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                  {activeTab === 'unread' ? 'Không có tin chưa đọc' : 'Chưa có thông báo nào'}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', maxWidth: '240px' }}>
                  Các thông báo về trạng thái ứng tuyển và tin tuyển dụng mới sẽ hiển thị tại đây.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
