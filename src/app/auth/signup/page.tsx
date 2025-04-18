'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { Eye, EyeOff } from 'lucide-react'

export default function SignUp() {
  const router = useRouter()
  const { register } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const username = formData.get('username') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      await register(username, email.toLowerCase(), password)
      router.push('/')
    } catch (error) {
      if (error instanceof Error && 'response' in error) {
        const serverError = error as { response?: { data?: { error?: string } } }
        setError(serverError.response?.data?.error || 'Something went wrong')
      } else {
        setError('Something went wrong')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cool-black px-4">
      <div className="w-full max-w-md space-y-8 bg-cool-black/50 p-8 rounded-2xl border border-cool-white/10">
        <div className="text-center">
          <h1 className="text-4xl font-bold gradient-text mb-2">Join QuizNova</h1>
          <p className="text-cool-white/70">Create an account to start your learning journey</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-starburst-orange/10 border border-starburst-orange/20 text-starburst-orange px-4 py-3 rounded-lg" role="alert">
              <span className="block text-sm">{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-cool-white/70 mb-1">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                autoComplete="username"
                // pattern="^[a-zA-Z0-9_-]{3,16}$"
                title="Username must be 3-16 characters and can only contain letters, numbers, underscores, and hyphens"
                className="w-full px-4 py-2 bg-white border border-cool-white/10 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-quantum-teal/50 focus:border-transparent transition-all"
                placeholder="Choose a username"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-cool-white/70 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full px-4 py-2 bg-white border border-cool-white/10 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-quantum-teal/50 focus:border-transparent transition-all"
                placeholder="Enter your email"
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
                  autoComplete="new-password"
                  minLength={8}
                  className="w-full px-4 py-2 bg-white border border-cool-white/10 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-quantum-teal/50 focus:border-transparent transition-all pr-12"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
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
                <span>Creating account...</span>
              </div>
            ) : (
              'Create account'
            )}
          </button>

          <div className="text-center">
            <Link 
              href="/auth/signin" 
              className="text-quantum-teal hover:text-quantum-teal/80 text-sm font-medium transition-colors"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
} 