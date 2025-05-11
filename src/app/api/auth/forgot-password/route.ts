import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import { sendPasswordResetEmail } from '@/lib/email'

export const config = {
  runtime: "nodejs", // Force Node.js runtime
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Connect to database
    await connectToDatabase()
    
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() })
    
    // For security reasons, don't reveal if a user was found or not
    if (!user) {
      // Still return success to prevent email enumeration attacks
      return NextResponse.json({ message: 'If your email is in our system, you will receive a reset link' })
    }

    // Generate a random token
    const resetToken = crypto.randomBytes(32).toString('hex')
    
    // Set an expiry time - 1 hour from now
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000)

    // Save the token to the user
    user.resetToken = resetToken
    user.resetTokenExpiry = resetTokenExpiry
    await user.save()

    // Send the password reset email
    const emailSent = await sendPasswordResetEmail(email, resetToken)

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send reset email' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'If your email is in our system, you will receive a reset link' })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 