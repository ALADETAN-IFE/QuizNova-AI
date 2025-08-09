import GoogleProvider from 'next-auth/providers/google'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import { NextAuthOptions } from 'next-auth'
import { sendWelcomeEmail } from '@/lib/email'

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id?: string | null;
      _id: string | null;
      email: string | null;
      username: string | null;
      name?: string | null;
      image: string | null;
      googleId: string | null;
      plan: string | null;
    }
  }

  interface User {
    _id?: string;
    plan?: string;
  }

  interface JWT {
    _id?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  // url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          await connectToDatabase()

          const username = user.email?.split('@')[0] || user.name
          // Check if user exists
          const existingUser = await User.findOne({ $or: [{ email: user.email }, { username }] })

          
          if (existingUser) {
            // If user exists and has a password, they need to use manual login
            if (existingUser.password) {
              // console.log("User exists with password, requires manual login")
              return Promise.reject(new Error("EMAIL_EXISTS_WITH_PASSWORD"));
            }
            
            // Otherwise, just sign in with Google
            // console.log("Existing user:", existingUser)
            user._id = existingUser._id.toString()
            return true
          }
    
          // Create new user
          const newUser = await User.create({
            email: user.email,
            username,
            name: user.name,
            image: user.image,
            googleId: user.id,
            plan: 'basic' // Set default plan
          })

          if (!newUser) {
            console.error('Failed to create user')
            return false
          }
          
          await newUser.save()

          // console.log("New user created:", newUser)
          // Store MongoDB _id in the id field that exists on User type
          user._id = newUser._id.toString()
          user.plan = newUser.plan

          // Send welcome email after successful creation
          if (newUser && user.email) {
            await sendWelcomeEmail(user.email!, username!)
              .then(() => console.log(`Welcome email sent to ${user.email}`))
              .catch(err => console.error("Email error:", err))
          }
    
          return true


          // return { msg: "true", message: "Registration Successful", user: newUser}
          return true
        } catch (error) {
          console.error('Error during Google sign in:', error)
          return false
        }
      }
      return true
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
        session.user._id = (token._id as string) || token.sub;
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
        token._id = user._id as string; // Explicit type assertion
      }
      return token
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: "jwt",
  },
}