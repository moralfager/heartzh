/**
 * Session Management для временных результатов тестов
 * 
 * Функционал:
 * - Генерация secure sessionId (cuid)
 * - Cookie-based сессии с TTL 24 часа
 * - HttpOnly, Secure, SameSite защита
 * - Автоматическая валидация TTL
 */

import { cookies } from 'next/headers';
import { prisma } from './prisma';

// ============================================================================
// CONFIGURATION
// ============================================================================

const SESSION_CONFIG = {
  cookieName: process.env.SESSION_COOKIE_NAME || 'hoz_sid',
  ttlHours: parseInt(process.env.RESULT_TTL_HOURS || '24', 10),
  sameSite: (process.env.SESSION_COOKIE_SAMESITE || 'lax') as 'strict' | 'lax' | 'none',
  secure: process.env.SESSION_COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production',
} as const;

// ============================================================================
// TYPES
// ============================================================================

export interface Session {
  id: string;
  createdAt: Date;
  expiresAt: Date;
  isExpired: boolean;
}

// ============================================================================
// SESSION GENERATION
// ============================================================================

/**
 * Генерирует новую сессию в БД с TTL
 */
async function createSessionInDB(): Promise<Session> {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_CONFIG.ttlHours * 60 * 60 * 1000);

  const session = await prisma.session.create({
    data: {
      expiresAt,
    },
  });

  return {
    id: session.id,
    createdAt: session.createdAt,
    expiresAt: session.expiresAt,
    isExpired: false,
  };
}

/**
 * Проверяет валидность сессии (не истекла ли)
 */
async function validateSessionInDB(sessionId: string): Promise<Session | null> {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
  });

  if (!session) {
    return null;
  }

  const now = new Date();
  const isExpired = session.expiresAt < now;

  return {
    id: session.id,
    createdAt: session.createdAt,
    expiresAt: session.expiresAt,
    isExpired,
  };
}

// ============================================================================
// COOKIE MANAGEMENT
// ============================================================================

/**
 * Получает sessionId из cookie
 */
async function getSessionIdFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_CONFIG.cookieName);
  return cookie?.value || null;
}

/**
 * Устанавливает sessionId в cookie
 */
async function setSessionCookie(sessionId: string, expiresAt: Date): Promise<void> {
  const cookieStore = await cookies();
  
  cookieStore.set(SESSION_CONFIG.cookieName, sessionId, {
    httpOnly: true,
    secure: SESSION_CONFIG.secure,
    sameSite: SESSION_CONFIG.sameSite,
    expires: expiresAt,
    path: '/',
  });
}

/**
 * Удаляет cookie сессии
 */
async function deleteSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_CONFIG.cookieName);
}

// ============================================================================
// PUBLIC API
// ============================================================================

/**
 * Получает текущую сессию из cookie
 * Если сессии нет или она истекла, возвращает null
 */
export async function getSession(): Promise<Session | null> {
  const sessionId = await getSessionIdFromCookie();
  
  if (!sessionId) {
    return null;
  }

  const session = await validateSessionInDB(sessionId);
  
  if (!session || session.isExpired) {
    // Удаляем невалидную cookie
    await deleteSessionCookie();
    return null;
  }

  return session;
}

/**
 * Получает существующую сессию или создает новую
 */
export async function getOrCreateSession(): Promise<Session> {
  const existingSession = await getSession();
  
  if (existingSession && !existingSession.isExpired) {
    return existingSession;
  }

  // Создаем новую сессию
  const newSession = await createSessionInDB();
  await setSessionCookie(newSession.id, newSession.expiresAt);
  
  return newSession;
}

/**
 * Создает новую сессию (принудительно)
 */
export async function createSession(): Promise<Session> {
  const session = await createSessionInDB();
  await setSessionCookie(session.id, session.expiresAt);
  return session;
}

/**
 * Удаляет текущую сессию
 */
export async function deleteSession(): Promise<void> {
  const sessionId = await getSessionIdFromCookie();
  
  if (sessionId) {
    // Удаляем из БД (каскадное удаление результатов)
    await prisma.session.delete({
      where: { id: sessionId },
    }).catch(() => {
      // Игнорируем ошибки (сессия уже удалена или не существует)
    });
    
    // Удаляем cookie
    await deleteSessionCookie();
  }
}

/**
 * Проверяет, есть ли активная сессия
 */
export async function hasActiveSession(): Promise<boolean> {
  const session = await getSession();
  return session !== null && !session.isExpired;
}

/**
 * Получает время до истечения сессии (в миллисекундах)
 */
export async function getSessionTimeRemaining(): Promise<number | null> {
  const session = await getSession();
  
  if (!session || session.isExpired) {
    return null;
  }

  return session.expiresAt.getTime() - Date.now();
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Форматирует оставшееся время в человеко-читаемый формат
 */
export function formatTimeRemaining(milliseconds: number): string {
  const hours = Math.floor(milliseconds / (60 * 60 * 1000));
  const minutes = Math.floor((milliseconds % (60 * 60 * 1000)) / (60 * 1000));
  
  if (hours > 0) {
    return `${hours}ч ${minutes}м`;
  }
  
  return `${minutes}м`;
}

/**
 * Экспортируем конфигурацию для тестов и debug
 */
export const sessionConfig = SESSION_CONFIG;

