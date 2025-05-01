import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

export async function verifyAuth() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return {
        error: true,
        message: 'Unauthorized - No token',
        status: 401
      };
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
    return {
      error: false,
      decoded
    };
  } catch (error) {
    console.log(error)
    return {
      error: true,
      message: 'Unauthorized - Invalid token',
      status: 401
    };
  }
} 