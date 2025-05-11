'use server';

import nodemailer from 'nodemailer';

// Professional transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER!,
    pass: process.env.GMAIL_APP_PASSWORD!, // App password, not regular password
  },
  // Professional settings
  pool: true,
  maxConnections: 1,
  rateDelta: 20000, // 20s delay between emails
  headers: {
    'X-Application': 'QuizNova AI',
    'List-Unsubscribe': `<mailto:unsubscribe@quiznova-ai.vercel.app?subject=Unsubscribe>`
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Common email styles
const styles = {
  container: 'font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; color: #1f2937;',
  header: 'text-align: center; padding: 20px 0; background: linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%); border-radius: 8px 8px 0 0; margin-bottom: 20px;',
  title: 'color: #ffffff; font-size: 24px; font-weight: 600; margin: 0; padding: 0 20px;',
  content: 'padding: 20px; background-color: #ffffff; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);',
  button: 'display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 500; margin: 20px 0; text-align: center;',
  footer: 'text-align: center; padding: 20px; color: #6B7280; font-size: 14px; border-top: 1px solid #E5E7EB; margin-top: 20px;',
  list: 'list-style-type: none; padding: 0; margin: 20px 0;',
  listItem: 'padding: 10px 0; border-bottom: 1px solid #E5E7EB; display: flex; align-items: center;',
  listItemIcon: 'color: #8B5CF6; margin-right: 10px; font-size: 18px;'
};

export async function sendWelcomeEmail(userEmail: string, userName: string) {
  try {
    const mailOptions = {
      from: `"QuizNova AI" <no-reply@quiznova-ai.vercel.app>`, // Professional sender
      replyTo: '"Support Team" <support@quiznova-ai.vercel.app>', // For replies
      to: userEmail,
      subject: 'Welcome to QuizNova! 🎉',
      html: `
        <div style="${styles.container}">
          <div style="${styles.header}">
            <h1 style="${styles.title}">Welcome to QuizNova! 🎉</h1>
          </div>
          <div style="${styles.content}">
            <p style="font-size: 16px; line-height: 1.6;">Hi ${userName},</p>
            <p style="font-size: 16px; line-height: 1.6;">Thank you for joining QuizNova! We're excited to have you as part of our community of knowledge seekers and quiz enthusiasts.</p>
            
            <h2 style="color: #4B5563; font-size: 20px; margin: 25px 0 15px;">What You Can Do:</h2>
            <ul style="${styles.list}">
              <li style="${styles.listItem}">
                <span style="${styles.listItemIcon}">📝</span>
                Create and share engaging quizzes with our AI-powered tools
              </li>
              <li style="${styles.listItem}">
                <span style="${styles.listItemIcon}">🎯</span>
                Test your knowledge across various topics and track your progress
              </li>
              <li style="${styles.listItem}">
                <span style="${styles.listItemIcon}">📊</span>
                Get detailed analytics and insights on your performance
              </li>
              <li style="${styles.listItem}">
                <span style="${styles.listItemIcon}">🤝</span>
                Connect with other learners and share your knowledge
              </li>
            </ul>

            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/quiz" 
                 style="${styles.button}">
                Start Your Learning Journey
              </a>
            </div>

            <p style="font-size: 16px; line-height: 1.6;">If you have any questions or need assistance, our support team is always here to help!</p>
          </div>
          <div style="${styles.footer}">
            <p>Best regards,<br>The QuizNova Team</p>
            <p style="font-size: 12px; margin-top: 10px;">
              © ${new Date().getFullYear()} QuizNova AI. All rights reserved.
            </p>
          </div>
        </div>
      `,
       // Professional headers
       headers: {
        'X-Priority': '3',
        'X-Mailer': 'QuizNovaAI'
      }
    };

    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully to:', userEmail);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    // Don't throw the error as email sending should not block the signup process
  }
}

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;
  
  try {
    await transporter.sendMail({
      from: `"QuizNova AI" <no-reply@quiznova-ai.vercel.app>`,
      to: email,
      subject: 'Reset Your Password',
      html: `
        <div style="${styles.container}">
          <div style="${styles.header}">
            <h1 style="${styles.title}">Password Reset Request 🔐</h1>
          </div>
          <div style="${styles.content}">
            <p style="font-size: 16px; line-height: 1.6;">We received a request to reset your password for your QuizNova AI account.</p>
            
            <div style="background-color: #F3F4F6; padding: 20px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0; color: #4B5563;">For security reasons, this password reset link will expire in 1 hour.</p>
            </div>

            <div style="text-align: center;">
              <a href="${resetUrl}" 
                 style="${styles.button}">
                Reset Your Password
              </a>
            </div>

            <p style="font-size: 16px; line-height: 1.6; color: #6B7280;">
              If you didn't request this password reset, you can safely ignore this email. 
              Your account security is important to us.
            </p>
          </div>
          <div style="${styles.footer}">
            <p>Best regards,<br>The QuizNova Security Team</p>
            <p style="font-size: 12px; margin-top: 10px;">
              © ${new Date().getFullYear()} QuizNova AI. All rights reserved.
            </p>
          </div>
        </div>
      `,
      headers: {
        'X-Priority': '1',
        'X-Mailer': 'QuizNovaAI'
      }
    });
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
} 