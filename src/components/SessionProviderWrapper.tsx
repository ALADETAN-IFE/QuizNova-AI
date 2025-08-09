'use client'

import { SessionProvider } from 'next-auth/react'

export const SessionProviderWrapper = ({   children,
}: {
  children: React.ReactNode
}) => {
  return (
    <SessionProvider
      baseUrl={process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')}
      basePath="/api/auth"
    >
      {children}
    </SessionProvider>
  )
}
