import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthResponse } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: any) => Promise<void>;
  updateUser: (data: Partial<User>) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Kiểm tra token hợp lệ và chưa expired khi app khởi động
    if (authService.isAuthenticated()) {
      const savedUser = authService.getCurrentUser();
      const savedToken = authService.getToken();
      if (savedUser && savedToken) {
        setUser(savedUser);
        setToken(savedToken);
      }
    } else {
      // Token không hợp lệ hoặc expired - đảm bảo state sạch
      setUser(null);
      setToken(null);
    }
    setLoading(false);
  }, []);

  const handleAuthSuccess = (res: AuthResponse) => {
    localStorage.setItem('token', res.accessToken);
    const userInfo: User = {
      id: res.userId,
      email: res.email,
      fullName: res.fullName,
      role: res.role,
    };
    localStorage.setItem('user', JSON.stringify(userInfo));
    setToken(res.accessToken);
    setUser(userInfo);
  };

  const login = async (data: { email: string; password: string }) => {
    const res = await authService.login(data);
    handleAuthSuccess(res);
  };

  const register = async (data: any) => {
    const res = await authService.register(data);
    handleAuthSuccess(res);
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        updateUser,
        logout,
        // isAuthenticated dựa trên cả token state VÀ user state
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
