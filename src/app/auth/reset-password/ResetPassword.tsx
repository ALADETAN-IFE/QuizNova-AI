'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { Eye, EyeOff, Lock } from 'lucide-react'

export default function ResetPassword() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [tokenValid, setTokenValid] = useState<boolean | null>(null)
  const [tokenChecking, setTokenChecking] = useState(true)

  useEffect(() => {
    // Verify the token is valid on mount
    const verifyToken = async () => {
      if (!token) {
        setTokenValid(false)
        setTokenChecking(false)
        return
      }

      try {
        const response = await axios.post('/api/auth/verify-reset-token', { token })
        console.log(response)
        setTokenValid(true)
      } catch (error) {
        console.log(error)
        setTokenValid(false)
        setError('This password reset link is invalid or has expired')
      } finally {
        setTokenChecking(false)
      }
    }

    verifyToken()
  }, [token])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    setLoading(true)

    try {
      const response = await axios.post('/api/auth/reset-password', {
        token,
        password
      })
      
      toast.success(response.data.message || 'Password has been reset successfully')
      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push('/auth/signin')
      }, 2000)
    } catch (error) {
      setError(
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : 'Something went wrong. Please try again.'
      )
      toast.error('Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  if (tokenChecking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cool-black px-4">
        <div className="w-full max-w-md p-8 space-y-8 text-center">
          <div className="w-12 h-12 border-4 border-t-transparent border-quantum-teal rounded-full animate-spin mx-auto"></div>
          <p className="text-cool-white">Verifying your reset link...</p>
        </div>
      </div>
    )
  }

  if (tokenValid === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cool-black px-4">
        <div className="w-full max-w-md space-y-8 bg-cool-black/50 p-8 rounded-2xl border border-cool-white/10 backdrop-blur-sm">
          <div className="text-center">
            <h1 className="text-3xl font-bold gradient-text mb-2">Invalid Link</h1>
            <p className="text-cool-white/70">
              This password reset link is invalid or has expired.
            </p>
          </div>
          <div className="bg-starburst-orange/10 border border-starburst-orange/20 text-starburst-orange px-4 py-3 rounded-lg" role="alert">
            <span className="block text-sm">{error || 'Password reset link is invalid or has expired'}</span>
          </div>
          <div className="flex justify-center">
            <Link 
              href="/auth/forgot-password" 
              className="px-4 py-2 bg-quantum-teal text-cool-white rounded-lg font-medium hover:bg-quantum-teal/90 transition-colors"
            >
              Request a new link
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cool-black px-4">
      <div className="w-full max-w-md space-y-8 bg-cool-black/50 p-8 rounded-2xl border border-cool-white/10 backdrop-blur-sm">
        <div className="text-center">
          <h1 className="text-3xl font-bold gradient-text mb-2">Set New Password</h1>
          <p className="text-cool-white/70">
            Create a new secure password for your account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-starburst-orange/10 border border-starburst-orange/20 text-starburst-orange px-4 py-3 rounded-lg" role="alert">
              <span className="block text-sm">{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-cool-white/70 mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-cool-white/50 h-5 w-5" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-12 py-2 bg-white/5 border border-cool-white/10 rounded-lg text-cool-white placeholder-cool-white/50 focus:outline-none focus:ring-2 focus:ring-quantum-teal/50 focus:border-transparent transition-all"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cool-white/50 hover:text-cool-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-cool-white/70 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-cool-white/50 h-5 w-5" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-cool-white/10 rounded-lg text-cool-white placeholder-cool-white/50 focus:outline-none focus:ring-2 focus:ring-quantum-teal/50 focus:border-transparent transition-all"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-quantum-teal text-cool-white rounded-lg font-medium hover:bg-quantum-teal/90 focus:outline-none focus:ring-2 focus:ring-quantum-teal/50 focus:ring-offset-2 focus:ring-offset-cool-black disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
                <span>Resetting...</span>
              </div>
            ) : (
              'Reset Password'
            )}
          </button>

          <div className="text-center">
            <Link 
              href="/auth/signin" 
              className="text-quantum-teal hover:text-quantum-teal/80 text-sm font-medium transition-colors"
            >
              Back to Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
} 