'use server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import axios from 'axios'

interface DecodedToken {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

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

// export const isTokenExpired = (token: string): boolean => {
//   try {
//     const decoded: { exp: number } = jwtDecode(token); 
//     const currentTime = Math.floor(Date.now() / 1000);
//     return decoded.exp < currentTime;
//   } catch (error) {
//     console.error('Error decoding token:', error);
//     return true; // Treat as expired if decoding fails
//   }
// };


export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('auth-token')?.value || null
}

export const verifyToken = async (): Promise<true | string> => {
  if (!secret) throw new Error('JWT secret is not configured')

  try {
    const token = await getAuthToken()
    if (!token) return 'No token found'

    const decoded = jwt.verify(token, secret) as DecodedToken
    const currentTime = Math.floor(Date.now() / 1000)
    if (decoded.exp < currentTime) {
      return 'Token is expired, please login again'
    }

    return true
  } catch (error) {
    console.error('JWT verify error:', error)
    return 'Invalid token'
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