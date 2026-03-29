'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthUser {
  name: string;
  email: string;
  role: 'superadmin' | 'user';
  adminId: string;
}

interface AuthContextType {
  token: string | null;
  admin: AuthUser | null;
  login: (token: string, admin: AuthUser) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [admin, setAdmin] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('genforge-token');
    const savedAdmin = localStorage.getItem('genforge-admin');
    if (savedToken && savedAdmin) {
      setToken(savedToken);
      try {
        setAdmin(JSON.parse(savedAdmin));
      } catch (e) {
        localStorage.removeItem('genforge-admin');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, adminData: AuthUser) => {
    setToken(newToken);
    setAdmin(adminData);
    localStorage.setItem('genforge-token', newToken);
    localStorage.setItem('genforge-admin', JSON.stringify(adminData));
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem('genforge-token');
    localStorage.removeItem('genforge-admin');
  };

  return (
    <AuthContext.Provider value={{ token, admin, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
