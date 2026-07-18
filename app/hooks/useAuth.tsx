'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types/auth';

// Clean, type-safe UUID fallback that protects Next.js SSR without 'as any'
const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  
  // Fallback high-entropy UUID v4 generator
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  guestLogin: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('auth-user');
      if (stored) setUser(JSON.parse(stored));
    } catch (error) {
      console.error('Auth hydration error', error);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const normalizedEmail = email.toLowerCase().trim();

      // 1. Built-in global master demo account fallback
      if (normalizedEmail === 'demo@example.com' && password === 'password') {
        const demoUser: User = {
          id: 'demo-master-user',
          name: 'Demo Master',
          email: normalizedEmail,
          createdAt: new Date().toISOString(),
        };
        setUser(demoUser);
        localStorage.setItem('auth-user', JSON.stringify(demoUser));
        return true;
      }

      // 2. Scan localized browser collection for user accounts
      const users = JSON.parse(localStorage.getItem('auth-users') || '[]');
      const found = users.find(
        (u: User & { password: string }) => 
          u.email.toLowerCase().trim() === normalizedEmail && u.password === password
      );

      if (found) {
        const { password: _, ...safeUser } = found;
        setUser(safeUser);
        localStorage.setItem('auth-user', JSON.stringify(safeUser));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const normalizedEmail = email.toLowerCase().trim();
      const users = JSON.parse(localStorage.getItem('auth-users') || '[]');
      
      // Prevent duplicate account matching
      if (
        normalizedEmail === 'demo@example.com' || 
        users.some((u: User) => u.email.toLowerCase().trim() === normalizedEmail)
      ) {
        return false;
      }

      const newUser = {
        id: generateUUID(),
        name,
        email: normalizedEmail,
        password,
        createdAt: new Date().toISOString(),
      };
      
      users.push(newUser);
      localStorage.setItem('auth-users', JSON.stringify(users));

      const { password: _, ...safeUser } = newUser;
      setUser(safeUser);
      localStorage.setItem('auth-user', JSON.stringify(safeUser));
      return true;
    } catch {
      return false;
    }
  }, []);

  const guestLogin = useCallback(() => {
    const guest: User = {
      id: 'guest-' + generateUUID(),
      name: 'Guest User',
      email: 'guest@pipeline.app',
      createdAt: new Date().toISOString(),
    };
    setUser(guest);
    localStorage.setItem('auth-user', JSON.stringify(guest));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('auth-user');
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, register, guestLogin, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}