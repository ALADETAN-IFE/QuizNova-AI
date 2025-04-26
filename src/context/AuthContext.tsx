'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { useAppStore } from "@/lib/store.zustand";

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, setUser } = useAppStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    if (user) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password,
      });
      toast.success(response.data.message)
      setUser(response.data.user);
      router.push('/quiz');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/register', {
        username,
        email,
        password,
      });
      toast.success(response.data.message)
      setUser(response.data.user);
      // router.push('/quiz');
    } catch (error) {
      console.error('Registration error:', error);
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Registration failed. Please try again.');
    }
  };

  const logout = () => {
    setUser(null);
    router.push('/');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 