import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import { createToken, setAuthCookie } from '@/utils/auth'
import { sendWelcomeEmail } from '@/utils/mail'

export const config = {
  runtime: 'nodejs', // Force Node.js runtime
}

export async function POST(req: Request) {
  await connectToDatabase()
  try {
    const { username, email, password } = await req.json()

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] })
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    })

    // Create and set JWT token
    const token = createToken(user._id, user.username)
    await setAuthCookie(token)

    // Return user data (excluding password)
    return NextResponse.json({
      message: 'Registration Successful',
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 