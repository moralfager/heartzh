import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import QRCode from 'qrcode';
import { JWT_SECRET } from '@/app/egg/_lib/constants';

export async function GET(request: NextRequest) {
  try {
    // Generate unlock token for Chapter 2
    const token = jwt.sign(
      {
        chapterId: 'ch2',
        purpose: 'unlock',
        createdAt: Date.now(),
      },
      JWT_SECRET,
      { expiresIn: '90d' } // Long expiration for physical QR codes
    );

    // Generate unlock URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const unlockUrl = `${baseUrl}/egg/unlock?token=${token}`;

    // Check if we should return QR code image or just URL
    const format = request.nextUrl.searchParams.get('format');

    if (format === 'image') {
      // Generate QR code as PNG
      const qrBuffer = await QRCode.toBuffer(unlockUrl, {
        errorCorrectionLevel: 'H',
        type: 'png',
        width: 512,
        margin: 2,
        color: {
          dark: '#2B2B2B', // ink
          light: '#FFF7F1', // glow
        },
      });

      // Convert Buffer to Uint8Array for NextResponse
      const qrCode = new Uint8Array(qrBuffer);

      return new Response(qrCode, {
        headers: {
          'Content-Type': 'image/png',
          'Content-Disposition': 'inline; filename="heart-of-zha-unlock.png"',
        },
      });
    }

    // Return URL and token
    return NextResponse.json({
      token,
      unlockUrl,
      expiresIn: '90d',
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

