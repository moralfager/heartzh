/**
 * Admin API: Clear All Results
 * DELETE /api/admin/results/clear
 * 
 * Удаляет все результаты тестов и сессии из базы данных
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE() {
  try {
    console.log('🗑️ Admin: Clearing all results and sessions...');

    // Удаляем все результаты (детали удалятся автоматически через onDelete: Cascade)
    const deletedResults = await prisma.result.deleteMany({});
    
    // Удаляем все сессии
    const deletedSessions = await prisma.session.deleteMany({});

    console.log(`✅ Deleted ${deletedResults.count} results and ${deletedSessions.count} sessions`);

    return NextResponse.json({
      success: true,
      message: 'All results and sessions cleared successfully',
      deleted: {
        results: deletedResults.count,
        sessions: deletedSessions.count,
      },
    });
  } catch (error) {
    console.error('❌ Error clearing results:', error);
    return NextResponse.json(
      {
        error: 'Failed to clear results',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}


