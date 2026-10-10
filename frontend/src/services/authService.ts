import { apiClient } from './apiClient';
import { AuthResponse, ApiResponse, User } from '../types';

// Decode JWT payload để check expiry (không cần thư viện ngoài)
function isTokenExpired(token: string): boolean {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    const exp = payload.exp * 1000; // convert sang ms
    return Date.now() > exp;
  } catch {
    return true; // nếu không decode được, coi là expired
  }
}

export const authService = {
  async register(data: { email: string; password: string; fullName: string; phone?: string; role: string; university?: string; major?: string; companyName?: string }): Promise<AuthResponse> {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return res.data.data;
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const res = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return res.data.data;
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return null;
      return JSON.parse(userStr) as User;
    } catch {
      // localStorage bị corrupt - xóa đi để tránh crash
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return null;
    }
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    if (isTokenExpired(token)) {
      // Token hết hạn - tự động logout
      this.logout();
      return false;
    }
    return true;
  }
};
