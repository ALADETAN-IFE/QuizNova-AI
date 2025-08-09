'use client'

import { useSession, signIn } from 'next-auth/react'
import Image from 'next/image'
import { useState, useEffect } from 'react'
// import { useAuth } from '@/context/AuthContext'
import { toast } from 'react-hot-toast'
import { useAppStore } from "@/lib/store.zustand";
import { useRouter } from 'next/navigation'
// import axios from 'axios'

interface Session {
  id: string;
  username: string;
  image: string;
  email: string;
  plan: string;
  googleId: string;
}

export default function GoogleAuthButton() {
  const { setUser } = useAppStore();
  // const { googleSignIn } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter();
  const { data: session, status } = useSession()

  // console.log("session2:", session?.user, "status:", status)

  // Handle session changes
  useEffect(() => {
    const handleSession = async () => {
      if (status === 'authenticated' && session?.user) {
        try {
          const userSession: Session = {
            id: session.user._id!,
            username: session.user.username!,
            image: session.user.image!,
            email: session.user.email!,
            plan: session.user.plan!,
            googleId: session.user.id || session.user.googleId || ""
          }
          setUser(userSession)
          toast.success('Logged in with Google successfully')
          router.push('/')
        } catch (error) {
          console.error("Error processing session:", error)
        }
      }
    }
    
    handleSession()
  }, [status, session, setUser, router])

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      // console.log('Starting Google sign in...')
      const response = await signIn('google', { 
        // callbackUrl: '/',
        redirect: false
      })
      
      if (response?.error) {
        console.error("Google sign in error:", response.error)
        
        // Handle the specific error for existing user with password
        if (response.error === "EMAIL_EXISTS_WITH_PASSWORD") {
          toast.error("This email is already registered. Please use your password to login.");
          return;
        }
        
        throw new Error(response.error)
      }
      
      // We don't need to manually process the session here
      // The useEffect hook will handle it when NextAuth updates the session
      
    } catch (error) {
      console.error("Error signing in with Google:", error)
      toast.error("Google sign in failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleGoogleSignIn}
      disabled={isLoading || status === 'loading'}
      className="group flex items-center justify-center w-full gap-3 px-4 py-3 text-sm font-medium text-cool-white bg-white/5 border border-cool-white/10 rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-quantum-teal/50 focus:ring-offset-2 focus:ring-offset-cool-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
    >
      {isLoading || status === 'loading' ? (
        <div className="w-5 h-5 border-2 border-t-transparent border-cool-white rounded-full animate-spin" />
      ) : (
        <div className="relative w-5 h-5">
          <Image
            src="/google.svg"
            alt="Google logo"
            fill
            className="object-contain"
          />
        </div>
      )}
      <span className="group-hover:text-quantum-teal transition-colors duration-200">
        {isLoading || status === 'loading' ? 'Signing in...' : 'Continue with Google'}
      </span>
    </button>
  )
} 