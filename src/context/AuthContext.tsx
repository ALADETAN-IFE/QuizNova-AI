'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import axios from 'axios'
import { useRouter, usePathname } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { useAppStore } from "@/lib/store.zustand";
import { verifyToken } from '@/utils/auth'

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, setUser } = useAppStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is already logged in
    if (user) {
      setLoading(false);

      // check if the token is expired
      const result = await verifyToken()
      if (result !== true) {
        toast.error(result)
        setUser(null)
        router.push('/auth/signin')
      }
    } else {
      setLoading(false);
    }
    // Redirect to sign in if user is not logged in
    // if (!user && (pathname === '/progress' || pathname === '/profile')) {
    if (!user &&  ['/progress', '/profile'].includes(pathname)) {
      router.push('/auth/signin');
      return;
    }
  }, [user, pathname]);

  const login = async (identifier: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/login', {
        identifier,
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