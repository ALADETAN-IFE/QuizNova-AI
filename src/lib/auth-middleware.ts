import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export async function verifyAuth() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value ;

    if (!token) {
      return {
        error: true,
        message: 'Unauthorized - No token',
        status: 401
      };
    }

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
  } catch (error) {
    console.log(error);
    return {
      error: true,
      message: 'Unauthorized - Invalid token',
      status: 401
    };
  }
}