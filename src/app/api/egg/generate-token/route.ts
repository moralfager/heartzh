import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRATION } from '@/app/egg/_lib/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { progress } = body;

    if (!progress) {
      return NextResponse.json(
        { error: 'Missing progress data' },
        { status: 400 }
      );
    }

    // Generate JWT token with progress data
    const token = jwt.sign(
      {
        progress,
        createdAt: Date.now(),
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );

    // Generate resume URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const resumeUrl = `${baseUrl}/egg/resume?token=${token}`;

    return NextResponse.json({
      token,
      resumeUrl,
      expiresIn: JWT_EXPIRATION,
    });
  } catch (error) {
    console.error('Error generating token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

