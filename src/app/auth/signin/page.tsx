'use client'

import { useState } from 'react'
// import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { Eye, EyeOff } from 'lucide-react'
import GoogleAuthButton from '@/components/auth/GoogleAuthButton'

export default function SignIn() {
  // const router = useRouter()
  const { login } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const identifier = formData.get('identifier') as string
    const password = formData.get('password') as string

    try {
      await login(identifier, password)
      // router.push('/')
    } catch (error) {
       // console.log("loginError", error)
      if (error instanceof Error && 'response' in error) {
        const serverError = error as { response?: { data?: { error?: string } } }
        setError(
          serverError.response?.data?.error == "Internal Server Error" ? "Something went wrong" : serverError.response?.data?.error || 'Something went wrong')
      } else {
        setError('Something went wrong')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cool-black px-4">
      <div className="w-full max-w-md space-y-8 bg-cool-black/50 p-8 rounded-2xl border border-cool-white/10 backdrop-blur-sm">
        <div className="text-center">
          <h1 className="text-4xl font-bold gradient-text mb-2">Welcome Back</h1>
          <p className="text-cool-white/70">Sign in to continue your learning journey</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-starburst-orange/10 border border-starburst-orange/20 text-starburst-orange px-4 py-3 rounded-lg" role="alert">
              <span className="block text-sm">{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-cool-white/70 mb-1">
                Email or Username
              </label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                required
                className="w-full px-4 py-2 bg-white/5 border border-cool-white/10 rounded-lg text-cool-white placeholder-cool-white/50 focus:outline-none focus:ring-2 focus:ring-quantum-teal/50 focus:border-transparent transition-all"
                placeholder="Enter your email or username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-cool-white/70 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-2 bg-white/5 border border-cool-white/10 rounded-lg text-cool-white placeholder-cool-white/50 focus:outline-none focus:ring-2 focus:ring-quantum-teal/50 focus:border-transparent transition-all pr-12"
                  placeholder="Enter your password"
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
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-quantum-teal text-cool-white rounded-lg font-medium hover:bg-quantum-teal/90 focus:outline-none focus:ring-2 focus:ring-quantum-teal/50 focus:ring-offset-2 focus:ring-offset-cool-black disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign in'
            )}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cool-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-cool-black/50 text-cool-white/50">Or continue with</span>
            </div>
          </div>

          <GoogleAuthButton />

          <div className="text-center">
            <Link 
              href="/auth/signup" 
              className="text-quantum-teal hover:text-quantum-teal/80 text-sm font-medium transition-colors"
            >
              Don&apos;t have an account? Sign up
            </Link>
          </div>
          <div className="flex justify-end mt-1">
            <Link 
              href="/auth/forgot-password" 
              className="text-quantum-teal hover:text-quantum-teal/80 text-xs font-medium transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
} 