import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import { sendPasswordResetEmail } from '@/lib/email'

export const config = {
  runtime: "nodejs", // Force Node.js runtime
}

export async function POST(req: Request) {
  await connectToDatabase()
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json(
        { error: 'No user found with this email' },
        { status: 404 }
      )
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = Date.now() + 3600000 // 1 hour

    // Save reset token to user
    user.resetToken = resetToken
    user.resetTokenExpiry = resetTokenExpiry
    await user.save()

    // Send password reset email
    const emailSent = await sendPasswordResetEmail(email, resetToken)
    if (!emailSent) {
      return NextResponse.json(
        { error: 'Error sending reset email' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Password reset email sent'
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 