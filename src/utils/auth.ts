import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import axios from 'axios'

// Ensure JWT_SECRET is available in production
const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET environment variable is required in production')
}

// Fallback for development only
const secret = JWT_SECRET || (process.env.NODE_ENV === 'development' ? 'dev-secret-key' : '')

export function createToken(userId: string, username: string): string {
  if (!secret) {
    throw new Error('JWT secret is not configured')
  }
  
  return jwt.sign(
    { userId, username },
    secret,
    { expiresIn: '7d' }
  )
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('auth-token')?.value || null
}

export function verifyToken(token: string) {
  if (!secret) {
    throw new Error('JWT secret is not configured')
  }
  
  try {
    return jwt.verify(token, secret)
  } catch (error) {
    return null
  }
}

export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('auth-token')
}

export async function login(email: string, password: string) {
  try {
    const response = await axios.post('/api/auth/login', { email, password })
    return response.data
  } catch {
    throw new Error('Login failed')
  }
} 