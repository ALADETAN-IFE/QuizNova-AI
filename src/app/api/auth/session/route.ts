import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/next-auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
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
      googleId: session.user.googleId,
      plan: session.user.plan
    }
  })
}