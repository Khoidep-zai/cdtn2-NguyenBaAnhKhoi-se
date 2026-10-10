import React, { useState, useEffect, useRef } from 'react';
import { Bell, Clock } from 'lucide-react';
import { notificationService, NotificationItem } from '../../services/notificationService';

export const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
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

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'relative',
          padding: '0.5rem',
          borderRadius: 'var(--radius-full)',
          background: isOpen ? 'var(--primary-light)' : 'transparent',
          color: 'var(--text-main)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'var(--transition)'
        }}
        aria-label="Thông báo"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            background: 'var(--danger)',
            color: 'white',
            borderRadius: '999px',
            fontSize: '0.65rem',
            fontWeight: 800,
            padding: '2px 5px',
            lineHeight: 1
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          right: 0,
          top: '120%',
          width: '320px',
          background: 'var(--bg-card)',
          color: 'var(--text-main)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-color)',
          zIndex: 100,
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '0.75rem 1rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <strong style={{ fontSize: '0.9rem' }}>Thông báo ({unreadCount})</strong>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}
              >
                Đã đọc tất cả
              </button>
            )}
          </div>

          <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.isRead && handleMarkAsRead(n.id)}
                  style={{
                    padding: '0.75rem 1rem',
                    borderBottom: '1px solid var(--border-color)',
                    background: n.isRead ? 'transparent' : 'var(--primary-light)',
                    cursor: n.isRead ? 'default' : 'pointer',
                    transition: 'background 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{n.title}</div>
                    {!n.isRead && (
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }} />
                    )}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    {n.message}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Clock size={12} /> {n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Vừa xong'}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Chưa có thông báo nào
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
