'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const errorMessages: { [key: string]: string } = {
    Configuration: 'There is a problem with the server configuration.',
    AccessDenied: 'You do not have permission to sign in.',
    Verification: 'The verification link may have expired or already been used.',
    Default: 'An error occurred during authentication.',
    EMAIL_EXISTS_WITH_PASSWORD: "Please login manually"
  }

  const errorMessage = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cool-black px-4">
      <div className="w-full max-w-md space-y-8 bg-cool-black/50 p-8 rounded-2xl border border-cool-white/10 backdrop-blur-sm">
        <div className="text-center">
          <h1 className="text-4xl font-bold gradient-text mb-2">Authentication Error</h1>
          <p className="text-cool-white/70">{errorMessage}</p>
        </div>

        <div className="text-center">
          <Link 
            href="/auth/signin" 
            className="text-quantum-teal hover:text-quantum-teal/80 text-sm font-medium transition-colors"
          >
            Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
} 