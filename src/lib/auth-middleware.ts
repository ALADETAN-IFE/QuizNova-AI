import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/next-auth'

interface DecodedToken {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export async function verifyAuth() {
  try {
    const session = await getServerSession(authOptions);
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token && !session?.user) {
      return {
        error: true,
        message: !token ? "Unauthorized - No token" : "Unauthorized",
        status: 401
      };
    }

    if (token) {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
      console.log('Decoded Token:', decoded); // Debugging log
      const currentTime = Math.floor(Date.now() / 1000);
      const isTokenExpired =  decoded.exp < currentTime;
      if (isTokenExpired) {
        return {
          error: true,
          message: `Token is expired (now: ${currentTime}, exp: ${decoded.exp}), please login again`,
          status: 401
        };
      }
      return {
        error: false,
        decoded
      };
    }

    if (session?.user) {
      return {
        error: false,
        decoded: {
          userId: session.user._id || '',
          email: session.user.email || '',
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + (7 * 24 * 3600), // 7 days from now
        }
      };
    }

    return {
      error: true,
      message: 'Unauthorized - No valid session or token',
      status: 401
    };

  } catch (error) {
    console.log(error);
    return {
      error: true,
      message: 'Unauthorized - Invalid token',
      status: 401
    };
  }
}