import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import { createToken, setAuthCookie } from '@/utils/auth'
// import { sendWelcomeEmail } from '@/lib/email'

export const config = {
  runtime: "nodejs", // Force Node.js runtime
}

export async function POST(req: Request) {
  await connectToDatabase()
  try {
    const { identifier, password } = await req.json()

    // Validate input
    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Find user by email or username
    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { username: identifier }
      ]
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      )
    }

    // console.log("user", user)

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Incorrect password' },
        { status: 401 }
      )
    }

    // sendWelcomeEmail(user.email, user.username).catch(error => {
    //       console.error('Failed to send welcome email:', error)
    // })
    // Create and set JWT token
    const token = await createToken(user._id, user.username)
    await setAuthCookie(token)

    // Return user data (excluding password)
    return NextResponse.json({
      message: 'Login Successful',
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        plan: user.plan,
        isAdmin: user.isAdmin == true ? true: undefined
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', msg: error },
      { status: 500 }
    )
  }
} 