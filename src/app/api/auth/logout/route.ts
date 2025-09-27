import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/next-auth'

export async function POST() {
  try {
    // Get the server session
    const session = await getServerSession(authOptions)
    
    const cookieStore = await cookies()
    
    // Clear NextAuth session cookies
    cookieStore.delete('next-auth.session-token')
    cookieStore.delete('next-auth.session-token.0')
    cookieStore.delete('next-auth.session-token.1')
    cookieStore.delete('next-auth.callback-url')
    cookieStore.delete('next-auth.csrf-token')
    
    // Clear custom auth token if it exists
    cookieStore.delete('auth-token')
    
    // Clear any other application cookies (you can add more as needed)
    // cookieStore.delete('other-cookie-name')
    
    return NextResponse.json({ message: 'Logged out successfully' })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    )
  }
} 