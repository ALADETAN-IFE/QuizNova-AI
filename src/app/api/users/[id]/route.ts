import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'

export async function PATCH(req: Request) {
  try {
    // Get the ID from the last segment of the URL
    const id = req.url.split('/').pop() || '';
    
    // Get the username from the request body
    const { username } = await req.json()

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      )
    }

    await connectToDatabase()

    // Check if username is already taken
    const existingUser = await User.findOne({ username, _id: { $ne: id } })
    if (existingUser) {
      return NextResponse.json(
        { error: 'Username is already taken' },
        { status: 400 }
      )
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username },
      { new: true, select: 'username' }
    )

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
} 

// export async function GET(req: Request) {
//   try {
//     // Get the ID from the last segment of the URL
//     const id = req.url.split('/').pop() || '';
    

//     await connectToDatabase()

//     // Check if user exists
//     const existingUser = await User.findById(id)
//     if (!existingUser) {
//       return NextResponse.json(
//         { error: 'User not found' },
//         { status: 404 }
//       )
//     }

//     await User.findByIdAndDelete(id)

//     return NextResponse.json(
//       { message: `${existingUser.username} with ID: ${existingUser._id} has been deleted` },
//       { status: 200 }
//     )
//   } catch(error){
//     console.error('Error updating user:', error)
//     return NextResponse.json(
//       { error: 'Failed to delete user', msg: error },
//       { status: 500 }
//     )
//   }
// }