import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import { createToken, setAuthCookie } from '@/utils/auth'
import mongoose from 'mongoose'

export const config = {
  runtime: 'nodejs', // Force Node.js runtime
}

export async function POST(req: Request) {
  try {
    // Connect to database with error handling
    try {
      await connectToDatabase()
    } catch (dbError) {
      console.error('Database connection error:', dbError)
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 503 }
      )
    }

    const { username, email, password } = await req.json()

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] })
    if (existingUser) {
      return NextResponse.json(
        { error: existingUser.email === email ? 'Email already registered' : 'Username already taken' },
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
  } catch (error: unknown) {
    console.error('Registration error:', error)
    
    // Handle specific mongoose validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.message },
        { status: 400 }
      )
    }

    // Handle mongoose duplicate key errors
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      return NextResponse.json(
        { error: 'Username or email already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Internal Server Error', details: process.env.NODE_ENV === 'development' ? String(error) : undefined },
      { status: 500 }
    )
  }
} 