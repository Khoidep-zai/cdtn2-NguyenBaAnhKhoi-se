import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthResponse } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedUser = authService.getCurrentUser();
    if (savedUser && token) {
      setUser(savedUser);
    }
    setLoading(false);
  }, [token]);

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

  const login = async (data: any) => {
    const res = await authService.login(data);
    handleAuthSuccess(res);
  };

  const register = async (data: any) => {
    const res = await authService.register(data);
    handleAuthSuccess(res);
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
        logout,
        isAuthenticated: !!token,
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
