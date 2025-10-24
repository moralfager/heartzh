import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@/app/egg/_lib/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { valid: false, error: 'Token not provided' },
        { status: 400 }
      );
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      chapterId: string;
      purpose: string;
    };

    if (decoded.purpose !== 'unlock') {
      return NextResponse.json(
        { valid: false, error: 'Invalid token purpose' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      chapterId: decoded.chapterId,
    });
  } catch (error) {
    console.error('Error verifying unlock token:', error);
    return NextResponse.json(
      { valid: false, error: 'Invalid or expired token' },
      { status: 400 }
    );
  }
}

