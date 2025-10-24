import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { CHAPTER_CODES } from '@/app/egg/_lib/constants';

// Rate limiting (simple in-memory, use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10; // requests per window
const RATE_WINDOW = 60000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { valid: false, error: 'Too many attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { chapterId, code } = body;

    if (!chapterId || !code) {
      return NextResponse.json(
        { valid: false, error: 'Missing chapterId or code' },
        { status: 400 }
      );
    }

    // Normalize code
    const normalizedCode = code.trim().toLowerCase();

    // Check code based on chapter
    let isValid = false;

    switch (chapterId) {
      case 'ch1':
        isValid = await bcrypt.compare(normalizedCode, CHAPTER_CODES.ch1);
        break;
      case 'ch3':
        // Accept 'взаимодоверие' instead of 'доверие'
        isValid = normalizedCode === 'взаимодоверие';
        break;
      case 'ch4':
        // Accept 'черный', 'чёрный', and 'black'
        isValid = normalizedCode === 'черный' || 
                  normalizedCode === 'чёрный' || 
                  normalizedCode === 'black';
        break;
      case 'ch5':
        // Accept both 'мандарин' and 'mandarin'
        isValid = normalizedCode === 'мандарин' || normalizedCode === 'mandarin';
        break;
      default:
        return NextResponse.json(
          { valid: false, error: 'Invalid chapter' },
          { status: 400 }
        );
    }

    return NextResponse.json({ valid: isValid });
  } catch (error) {
    console.error('Error checking code:', error);
    return NextResponse.json(
      { valid: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

