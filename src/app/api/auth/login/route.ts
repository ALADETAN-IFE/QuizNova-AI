import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import { createToken, setAuthCookie } from '@/utils/auth'

export const config = {
  runtime: "nodejs", // Force Node.js runtime
}

export async function POST(req: Request) {
  await connectToDatabase()
  try {
    const { email, password } = await req.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Incorrect password' },
        { status: 401 }
      )
    }

    // Create and set JWT token
    const token = createToken(user._id, user.username)
    await setAuthCookie(token)

    // Return user data (excluding password)
    return NextResponse.json({
      message: 'Login Successful',
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 