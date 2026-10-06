import { apiClient } from './apiClient';
import { ApiResponse } from '../types';

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: string;
  referenceId?: number;
  isRead: boolean;
  createdAt: string;
}

export const notificationService = {
  async getMyNotifications(): Promise<NotificationItem[]> {
    const res = await apiClient.get<ApiResponse<NotificationItem[]>>('/notifications');
    return res.data.data;
  },

  async markAsRead(id: number): Promise<NotificationItem> {
    const res = await apiClient.patch<ApiResponse<NotificationItem>>(`/notifications/${id}/read`);
    return res.data.data;
  },

  async markAllAsRead(): Promise<void> {
    await apiClient.patch<ApiResponse<void>>('/notifications/read-all');
  },

  async getUnreadCount(): Promise<number> {
    const res = await apiClient.get<ApiResponse<number>>('/notifications/unread-count');
    return res.data.data;
  }
};
