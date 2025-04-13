import nodemailer from 'nodemailer'

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || 'user@example.com',
    pass: process.env.SMTP_PASS || 'password',
  },
  tls : {
    rejectUnauthorized: false,
  },
})

export async function sendWelcomeEmail(email: string) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"QuizNova AI" <noreply@quiznova.com>',
      to: email,
      subject: 'Welcome to QuizNova AI!',
      html: `
        <h1>Welcome to QuizNova AI!</h1>
        <p>Thank you for signing up. We're excited to have you on board!</p>
        <p>You can now create, take, and track quizzes with AI.</p>
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <p>Best regards,<br>The QuizNova AI Team</p>
      `,
    })
    return true
  } catch (error) {
    console.error('Error sending welcome email:', error)
    return false
  }
}

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`
  
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"QuizNova AI" <noreply@quiznova.com>',
      to: email,
      subject: 'Reset Your Password',
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested a password reset for your QuizNova AI account.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
        <p>Best regards,<br>The QuizNova AI Team</p>
      `,
    })
    return true
  } catch (error) {
    console.error('Error sending password reset email:', error)
    return false
  }
} 