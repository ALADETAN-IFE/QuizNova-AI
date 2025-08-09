import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/next-auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      // return NextResponse.json({ error: 'Not authenticated', message: 'No active session found' }, { status: 401 })
      // Return 200 with null user instead of 401 to avoid console errors
      // This is normal behavior for non-authenticated users
      return NextResponse.json({ 
        user: null, 
        authenticated: false, 
        message: 'No active session found' 
      }, { status: 200 })
    }
    // return NextResponse.json({ 
    //   user: session.user
    // })
    return NextResponse.json({ 
      user: {
        _id: session.user._id,
        email: session.user.email,
        username: session.user.email?.split('@')[0] || session.user.name?.replace(/\s+/g, ''),
        // name: session.user.name,
        image: session.user.image,
        googleId: session.user.id,
        plan: session.user.plan
      },
      authenticated: true
    })
  } catch (error) {
    console.error('Session error:', error)
    return NextResponse.json({ 
      error: 'Session error', 
      message: 'Failed to retrieve session' 
    }, { status: 500 })
  }
}