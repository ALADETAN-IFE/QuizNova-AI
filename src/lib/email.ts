import nodemailer from 'nodemailer';

// // Create reusable transporter
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

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

export async function sendWelcomeEmail(userEmail: string, userName: string) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Welcome to QuizNova! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #8B5CF6;">Welcome to QuizNova! 🎉</h1>
          <p>Hi ${userName},</p>
          <p>Thank you for joining QuizNova! We're excited to have you as part of our community.</p>
          <p>With QuizNova, you can:</p>
          <ul>
            <li>Create and share engaging quizzes</li>
            <li>Test your knowledge across various topics</li>
            <li>Track your progress and improve your skills</li>
          </ul>
          <p>Get started by exploring our quiz collection or creating your own quiz!</p>
          <div style="margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/quiz" 
               style="background-color: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
              Start Exploring
            </a>
          </div>
          <p>If you have any questions, feel free to reach out to our support team.</p>
          <p>Best regards,<br>The QuizNova Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully');
  } catch (error) {
    console.error('Error sending welcome email:', error);
    // Don't throw the error as email sending should not block the signup process
  }
} 