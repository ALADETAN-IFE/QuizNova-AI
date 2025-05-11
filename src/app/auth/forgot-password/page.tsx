'use client'

import { useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { Mail } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axios.post('/api/auth/forgot-password', { email })
      setSuccess(true)
      toast.success(response.data.message || 'Reset link sent to your email')
    } catch (error) {
      setError(
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : 'Something went wrong. Please try again.'
      )
      toast.error('Failed to send reset link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cool-black px-4">
      <div className="w-full max-w-md space-y-8 bg-cool-black/50 p-8 rounded-2xl border border-cool-white/10 backdrop-blur-sm">
        <div className="text-center">
          <h1 className="text-3xl font-bold gradient-text mb-2">Reset Password</h1>
          <p className="text-cool-white/70">
            Enter your email address and we&apos;ll send you a link to reset your password
          </p>
        </div>

        {success ? (
          <div className="mt-8 space-y-6">
            <div className="bg-quantum-teal/10 border border-quantum-teal/20 text-quantum-teal px-4 py-3 rounded-lg" role="alert">
              <span className="block text-sm font-medium mb-1">Reset Link Sent!</span>
              <span className="block text-sm">
                Check your email for instructions to reset your password. The link will expire in 1 hour.
              </span>
            </div>
            <div className="flex justify-center">
              <Link
                href="/auth/signin"
                className="text-quantum-teal hover:text-quantum-teal/80 text-sm font-medium transition-colors"
              >
                Return to sign in
              </Link>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-starburst-orange/10 border border-starburst-orange/20 text-starburst-orange px-4 py-3 rounded-lg" role="alert">
                <span className="block text-sm">{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-cool-white/70 mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-cool-white/50 h-5 w-5" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-cool-white/10 rounded-lg text-cool-white placeholder-cool-white/50 focus:outline-none focus:ring-2 focus:ring-quantum-teal/50 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                />
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
                  <span>Sending...</span>
                </div>
              ) : (
                'Send Reset Link'
              )}
            </button>

            <div className="text-center">
              <Link 
                href="/auth/signin" 
                className="text-quantum-teal hover:text-quantum-teal/80 text-sm font-medium transition-colors"
              >
                Remember your password? Sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
} 