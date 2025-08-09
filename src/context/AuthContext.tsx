'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import axios from 'axios'
import { useRouter, usePathname } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { useAppStore } from "@/lib/store.zustand";
import { verifyToken } from '@/utils/auth'
import { useSession } from 'next-auth/react'
// import { getServerSession } from 'next-auth'
// import { authOptions } from '@/lib/next-auth'

interface User {
  id: string;
  username: string;
  email: string;
}

interface Session {
  id: string;
  username: string;
  image: string;
  email: string;
  plan: string;
  googleId: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  // googleSignIn: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, setUser } = useAppStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { status, data: session } = useSession()
  
  useEffect(() => {
    const checkAuth = async () => {
      if (user) {
        // const session = await getServerSession(authOptions);
        if (status === "loading") return;
        if (!user && session?.user) {
          const userSession: Session = {
            id: session.user._id!,
            username: session.user.username!,
            image: session.user.image!,
            email: session.user.email!,
            plan: session.user.plan! || "basic",
            googleId: session.user.id || session.user.googleId || ""
        }
        setUser(userSession)
        };

        setLoading(false);
        // console.log("checking auth...")
        
        if (!session) {
          // // console.log("verify token")
          // const result = await verifyToken()
          // // console.log("result", result)
          // if (result !== true) {
          //   toast.error(result)
          //   setUser(null)
          //   router.push('/auth/signin')
          // Only verify token if we're on a protected route
          const protectedRoutes = ['/progress', '/profile']
          if (protectedRoutes.includes(pathname)) {
            const result = await verifyToken()
            if (result !== true) {
              // Don't show error toast for expected auth failures
              setUser(null)
              router.push('/auth/signin')
            }
          } else {
            // For public routes, just ensure user is null
            setUser(null)
          }
        }
      } else {
        setLoading(false);
      }

      if (!user && ['/progress', '/profile'].includes(pathname)) {
        router.push('/auth/signin');
      }
    };

    checkAuth();
  }, [user, session, status, pathname]);

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
      router.push('/quiz');
    } catch (error) {
      console.error('Registration error:', error);
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        throw error.response.data.error;
      }
      throw 'Registration failed. Please try again.';
    }
  };


  // useEffect(() => {
  //    // if (status === "authenticated") {
  //     //   setUser(session?.user)
  //     // }
  //   if (status == "authenticated") {
  //     // googleSignIn()
  //   }
  // }, [pathname])

  const logout = async () => {
    try {
      setUser(null);
      const res = await axios.post('/api/auth/logout');
      toast.success(res.data.message)
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Still proceed with logout even if API call fails
      router.push('/');
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    // googleSignIn,
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