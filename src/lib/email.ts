"use server";

import nodemailer from "nodemailer";
// Professional transporter configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER!,
    pass: process.env.GMAIL_APP_PASSWORD!, // App password, not regular password
  },
  // Professional settings
  pool: true,
  maxConnections: 1,
  rateDelta: 20000, // 20s delay between emails
  headers: {
    "X-Application": "QuizNova AI",
    "List-Unsubscribe": `<mailto:unsubscribe@quiznova-ai.vercel.app?subject=Unsubscribe>`,
  },
  // tls: {
  //   rejectUnauthorized: false,
  // },
  secure: true
});

// Common email styles
const styles = {
  body: "margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;",
  outerPadding: "padding: 20px 0;",
  container: "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);",
  header: "background: #6D28D9; padding: 20px; text-align: center;",
  logoContainer: 'text-align: center; padding-bottom: 15px;',
  logo: 'max-width: 150px; height: auto;',
  title: "color: #ffffff; font-size: 24px; margin: 0; font-weight: 600;",
  content: "padding: 25px; background: #ffffff;",
  paragraph: "margin: 0 0 16px 0; font-size: 16px; line-height: 1.5; color: #333333;",
  warningBox: "margin: 0 0 20px 0; background-color: #f8f9fa; border-left: 4px solid #6D28D9;",
  warningBoxInner: "padding: 12px 15px;",
  warningText: "margin: 0; font-size: 14px; color: #6B7280; font-weight: 500;",
  button: "display: inline-block; padding: 12px 30px; background: #6D28D9; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px; margin: 10px 0 20px 0;",
  secondaryParagraph:"margin: 0; font-size: 14px; line-height: 1.5; color: #666666;",
  url: "margin: 10px 0 0 0; font-size: 14px; line-height: 1.5; word-break: break-all; color: #6D28D9;",
  securityMessage: "margin: 20px 0 0 0; font-size: 14px; line-height: 1.5; color: #6B7280;",
  footer: "padding: 20px; text-align: center; background-color: #f9fafb; border-top: 1px solid #e5e7eb;",
  footerText: "margin: 0 0 8px 0; font-size: 12px; color: #6B7280;",
  copyright: "margin: 0; font-size: 12px; color: #6B7280;",
};


const WelcomeStyles = {
  container: 'font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; color: #1f2937; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);',
  header: 'text-align: center; padding: 25px 0; background: linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%); border-radius: 8px 8px 0 0; margin-bottom: 20px;',
  logoContainer: 'text-align: center; padding-bottom: 10px;',
  logo: 'width: 100px; height: 100px; border-radius: 50%; object-fit: contain; border: 2px solid #ffffff; display: block; margin: 0 auto;',
  title: 'color: #ffffff; font-size: 28px; font-weight: 600; margin: 0;',
  content: 'padding: 20px; background-color: #ffffff; border-radius: 0 0 8px 8px;',
  paragraph: 'font-size: 16px; line-height: 1.6; margin-bottom: 20px;',
  sectionTitle: 'color: #4B5563; font-size: 20px; margin: 25px 0 15px; border-bottom: 2px solid #E5E7EB; padding-bottom: 5px;',
  list: 'list-style-type: none; padding: 0; margin: 20px 0;',
  listItem: 'padding: 12px 0; border-bottom: 1px solid #E5E7EB; display: flex; align-items: center;',
  listItemIcon: 'color: #8B5CF6; margin-right: 15px; font-size: 20px;',
  button: 'display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 500; margin: 20px 0; text-align: center; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);',
  image: 'max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 20px;',
  footer: 'text-align: center; padding: 25px; color: #6B7280; font-size: 14px; border-top: 1px solid #E5E7EB; margin-top: 20px;',
};

const hosted_Logo = "https://res.cloudinary.com/dserpv6p5/image/upload/v1747169597/quizNova_zte5zp.ico"

export async function sendWelcomeEmail(userEmail: string, userName: string) {
  try {
    const mailOptions = {
      from: `"QuizNova AI" <no-reply@quiznova-ai.vercel.app>`, // Professional sender
      replyTo: '"Support Team" <support@quiznova-ai.vercel.app>', // For replies
      to: userEmail,
      subject: "Welcome to QuizNova! 🎉",
      html: `
      <!DOCTYPE html>
      <html>
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="${styles.body}">
      <div style="${WelcomeStyles.container}">
      <!-- Header with Round Logo -->
      <div style="${styles.header}">
      <div style="${WelcomeStyles.logoContainer}">
        <img src="${hosted_Logo}" alt="QuizNova-AI logo" style="${WelcomeStyles.logo}" />
      </div>
      <h1 style="${WelcomeStyles.title}">Welcome to QuizNova! 🎉</h1>
      </div>
      
      <div style="${WelcomeStyles.content}">
      <p style="${WelcomeStyles.paragraph}">Hi ${userName},</p>
      <p style="${WelcomeStyles.paragraph}">Thank you for joining QuizNova! We're excited to have you as part of our community.</p>
      
      <h2 style="${WelcomeStyles.sectionTitle}">What You Can Do:</h2>
      <ul style="${WelcomeStyles.list}">
        <li style="${WelcomeStyles.listItem}">
          <span style="${WelcomeStyles.listItemIcon}">📝</span>
          Create quizzes with AI tools
        </li>
        <li style="${WelcomeStyles.listItem}">
          <span style="${WelcomeStyles.listItemIcon}">🎯</span>
          Test knowledge & track progress
        </li>
        <li style="${WelcomeStyles.listItem}">
          <span style="${WelcomeStyles.listItemIcon}">📊</span>
          View performance analytics
        </li>
        <li style="${WelcomeStyles.listItem}">
          <span style="${WelcomeStyles.listItemIcon}">🤝</span>
          Connect with other learners
        </li>
      </ul>
      
      <div style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/quiz" style="${WelcomeStyles.button}">
          Start Your Journey
        </a>
      </div>
      
      <img src="https://yourdomain.com/images/welcome-banner.jpg" alt="" style="${WelcomeStyles.image}">
      
      <p style="${styles.paragraph}">Need help? Contact us at support@quiznova.ai</p>
      </div>
      
      <div style="${styles.footer}">
      <p>Best regards,<br>The QuizNova Team</p>
      <p style="${styles.copyright}">© ${new Date().getFullYear()} QuizNova AI</p>
      </div>
      </div>
      </body>
      </html>
      
      `,
      // fallback incase HTML fails
      text: `
      Welcome to QuizNova, ${userName}!
      
      Thank you for joining our community of knowledge seekers and quiz enthusiasts. Here's what you can do:
      
      • Create and share engaging quizzes with our AI-powered tools
      • Test your knowledge across various topics
      • Track your progress with detailed analytics
      • Connect with other learners
      
      Get started: ${process.env.NEXT_PUBLIC_APP_URL}/quiz
      
      Need help? Contact us at support@quiznova.ai
      
      Best regards,
      The QuizNova Team
      
      © ${new Date().getFullYear()} QuizNova AI. All rights reserved.
      `,
      // Professional headers
      headers: {
        "X-Priority": "3",
        "X-Mailer": "QuizNovaAI",
      },
    };
    
    await transporter.sendMail(mailOptions);
    console.log("Welcome email sent successfully to:", userEmail);
  } catch (error) {
    console.error("Error sending welcome email:", error);
    // Don't throw the error as email sending should not block the signup process
  }
}

export async function sendPasswordResetEmail( email: string, resetToken: string ) {
  const resetUrl = `${
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  }/auth/reset-password?token=${resetToken}`;
  
  try {
    await transporter.sendMail({
      from: `"QuizNova AI" <no-reply@quiznova-ai.vercel.app>`,
      to: email,
      subject: "Reset Your Password",
      html: `
      <!DOCTYPE html>
      <html>
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="${styles.body}">
      <!-- Outer Table (For Outlook) -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
      <td align="center" style="${styles.outerPadding}">
      <!-- Email Container -->
      <table width="600" cellpadding="0" cellspacing="0" style="${
        styles.container
      }">
        <!-- Header with Logo -->
        <tr>
          <td style="${styles.header}">
            <!-- Logo (Square/Rectangular version) -->
            <div style="${styles.logoContainer}">
              <img src="${hosted_Logo}" alt="QuizNova-AI logo" style="${styles.logo}" />
            </div>
            <h1 style="${styles.title}">Password Reset 🔐</h1>
          </td>
        </tr>
        <!-- Content -->
        <tr>
          <td style="${styles.content}">
            <p style="${
              styles.paragraph
            }">You recently requested to reset your password for your QuizNova account. Click the button below to proceed.</p>
            
            <!-- Warning Box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="${
              styles.warningBox
            }">
              <tr>
                <td style="${styles.warningBoxInner}">
                  <p style="${
                    styles.warningText
                  }">This link will expire in <strong>1 hour</strong>. If you didn't request this change, you can safely ignore this email.</p>
                </td>
              </tr>
            </table>
      
            <!-- Button -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center">
                  <a href="${resetUrl}" style="${
      styles.button
      }">Reset Password</a>
                </td>
              </tr>
            </table>
      
            <p style="${
              styles.secondaryParagraph
            }">If the button above doesn't work, copy and paste this link into your browser:</p>
            <p style="${styles.url}">${resetUrl}</p>
            
            <!-- Added Security Message -->
            <p style="${styles.securityMessage}">
              If you didn't request this password reset, you can safely ignore this email. 
              Your account security is important to us.
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="${styles.footer}">
            <p style="${styles.footerText}">QuizNova Security Team</p>
            <p style="${
              styles.copyright
            }">© ${new Date().getFullYear()} QuizNova AI. All rights reserved.</p>
          </td>
        </tr>
      </table>
      </td>
      </tr>
      </table>
      </body>
      </html>
      `,
      text: `
      QuizNova Password Reset
      
      We received a request to reset your password. Click the link below (expires in 1 hour):
      
      ${resetUrl}
      
      For security reasons:
      - Do not share this link with anyone
      - The link will expire after 60 minutes
      - If you didn't request this, please ignore this email
      
      Need help? Contact our support team at support@quiznova.ai
      
      © ${new Date().getFullYear()} QuizNova AI. All rights reserved.
      `,
      headers: {
        "X-Priority": "1",
        "X-Mailer": "QuizNovaAI",
      },
    });
    return true;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return false;
  }
}
