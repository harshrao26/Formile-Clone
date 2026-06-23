'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthUser {
  name: string;
  email: string;
  role: 'superadmin' | 'user';
  adminId: string;
  subscriptionStatus?: string;
  expiryDate?: string;
  phone?: string;
}

interface AuthContextType {
  token: string | null;
  admin: AuthUser | null;
  login: (token: string, admin: AuthUser) => void;
  updateAdmin: (updatedData: Partial<AuthUser>) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [admin, setAdmin] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('zeeoffer-token');
    const savedAdmin = localStorage.getItem('zeeoffer-admin');
    if (savedToken && savedAdmin) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setToken(savedToken);
      try {
        setAdmin(JSON.parse(savedAdmin));
      } catch {
        localStorage.removeItem('zeeoffer-admin');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, adminData: AuthUser) => {
    setToken(newToken);
    setAdmin(adminData);
    localStorage.setItem('zeeoffer-token', newToken);
    localStorage.setItem('zeeoffer-admin', JSON.stringify(adminData));
  };

  const updateAdmin = (updatedData: Partial<AuthUser>) => {
    setAdmin((currentAdmin) => {
      if (!currentAdmin) return null;
      const newAdmin = { ...currentAdmin, ...updatedData };
      localStorage.setItem('zeeoffer-admin', JSON.stringify(newAdmin));
      return newAdmin;
    });
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem('zeeoffer-token');
    localStorage.removeItem('zeeoffer-admin');
  };

  return (
    <AuthContext.Provider value={{ token, admin, login, updateAdmin, logout, isLoading }}>
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
