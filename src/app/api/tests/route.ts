import { NextRequest, NextResponse } from 'next/server';
import { TestDefinition } from '@/lib/types';

// Загружаем тесты из файлов
async function loadTest(slug: string): Promise<TestDefinition | null> {
  try {
    if (slug === "love-psychology") {
      const testData = await import("../../../../public/tests/love-psychology.json");
      return testData.default as unknown as TestDefinition;
    }
    if (slug === "love-expressions") {
      const testData = await import("../../../../public/tests/love-expressions.json");
      return testData.default as unknown as TestDefinition;
    }
    return null;
  } catch (error) {
    console.error('Error loading test:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    
    if (!slug) {
      // Возвращаем список всех тестов
      const lovePsychology = await loadTest("love-psychology");
      const loveExpressions = await loadTest("love-expressions");
      
      const tests = [lovePsychology, loveExpressions].filter(Boolean);
      
      return NextResponse.json(tests);
    }
    
    // Возвращаем конкретный тест
    const test = await loadTest(slug);
    
    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }
    
    return NextResponse.json(test);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
