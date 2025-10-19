/**
 * Unit tests для session management
 * 
 * Тестируем:
 * - Создание сессий
 * - Валидацию TTL
 * - Cookie management
 * - Edge cases
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Mock Prisma
const mockPrisma = {
  session: {
    create: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
  },
};

// Mock Next.js cookies
const mockCookies = {
  get: jest.fn(),
  set: jest.fn(),
  delete: jest.fn(),
};

jest.mock('../prisma', () => ({
  prisma: mockPrisma,
}));

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => mockCookies),
}));

// Import after mocks
import {
  getSession,
  getOrCreateSession,
  createSession,
  deleteSession,
  hasActiveSession,
  getSessionTimeRemaining,
  formatTimeRemaining,
} from '../session';

describe('Session Management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createSession', () => {
    it('should create a new session in database', async () => {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      mockPrisma.session.create.mockResolvedValue({
        id: 'session_123',
        createdAt: now,
        expiresAt,
      });

      const session = await createSession();

      expect(session.id).toBe('session_123');
      expect(session.isExpired).toBe(false);
      expect(mockPrisma.session.create).toHaveBeenCalledTimes(1);
      expect(mockCookies.set).toHaveBeenCalledTimes(1);
    });

    it('should set cookie with correct options', async () => {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      mockPrisma.session.create.mockResolvedValue({
        id: 'session_123',
        createdAt: now,
        expiresAt,
      });

      await createSession();

      expect(mockCookies.set).toHaveBeenCalledWith(
        'hoz_sid',
        'session_123',
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
        })
      );
    });
  });

  describe('getSession', () => {
    it('should return null if no cookie exists', async () => {
      mockCookies.get.mockReturnValue(null);

      const session = await getSession();

      expect(session).toBeNull();
    });

    it('should return null if session not in database', async () => {
      mockCookies.get.mockReturnValue({ value: 'session_123' });
      mockPrisma.session.findUnique.mockResolvedValue(null);

      const session = await getSession();

      expect(session).toBeNull();
      expect(mockCookies.delete).toHaveBeenCalledTimes(1);
    });

    it('should return session if valid', async () => {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      mockCookies.get.mockReturnValue({ value: 'session_123' });
      mockPrisma.session.findUnique.mockResolvedValue({
        id: 'session_123',
        createdAt: now,
        expiresAt,
      });

      const session = await getSession();

      expect(session).not.toBeNull();
      expect(session?.id).toBe('session_123');
      expect(session?.isExpired).toBe(false);
    });

    it('should return null and delete cookie if session expired', async () => {
      const now = new Date();
      const expiresAt = new Date(now.getTime() - 1000); // expired

      mockCookies.get.mockReturnValue({ value: 'session_123' });
      mockPrisma.session.findUnique.mockResolvedValue({
        id: 'session_123',
        createdAt: now,
        expiresAt,
      });

      const session = await getSession();

      expect(session).toBeNull();
      expect(mockCookies.delete).toHaveBeenCalledTimes(1);
    });
  });

  describe('getOrCreateSession', () => {
    it('should return existing session if valid', async () => {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      mockCookies.get.mockReturnValue({ value: 'session_123' });
      mockPrisma.session.findUnique.mockResolvedValue({
        id: 'session_123',
        createdAt: now,
        expiresAt,
      });

      const session = await getOrCreateSession();

      expect(session.id).toBe('session_123');
      expect(mockPrisma.session.create).not.toHaveBeenCalled();
    });

    it('should create new session if none exists', async () => {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      mockCookies.get.mockReturnValue(null);
      mockPrisma.session.create.mockResolvedValue({
        id: 'session_new',
        createdAt: now,
        expiresAt,
      });

      const session = await getOrCreateSession();

      expect(session.id).toBe('session_new');
      expect(mockPrisma.session.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteSession', () => {
    it('should delete session from database and cookie', async () => {
      mockCookies.get.mockReturnValue({ value: 'session_123' });
      mockPrisma.session.delete.mockResolvedValue({});

      await deleteSession();

      expect(mockPrisma.session.delete).toHaveBeenCalledWith({
        where: { id: 'session_123' },
      });
      expect(mockCookies.delete).toHaveBeenCalledTimes(1);
    });

    it('should handle missing session gracefully', async () => {
      mockCookies.get.mockReturnValue(null);

      await deleteSession();

      expect(mockPrisma.session.delete).not.toHaveBeenCalled();
    });

    it('should ignore database errors', async () => {
      mockCookies.get.mockReturnValue({ value: 'session_123' });
      mockPrisma.session.delete.mockRejectedValue(new Error('Not found'));

      await expect(deleteSession()).resolves.not.toThrow();
      expect(mockCookies.delete).toHaveBeenCalledTimes(1);
    });
  });

  describe('hasActiveSession', () => {
    it('should return true if session exists and not expired', async () => {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      mockCookies.get.mockReturnValue({ value: 'session_123' });
      mockPrisma.session.findUnique.mockResolvedValue({
        id: 'session_123',
        createdAt: now,
        expiresAt,
      });

      const hasSession = await hasActiveSession();

      expect(hasSession).toBe(true);
    });

    it('should return false if no session', async () => {
      mockCookies.get.mockReturnValue(null);

      const hasSession = await hasActiveSession();

      expect(hasSession).toBe(false);
    });
  });

  describe('getSessionTimeRemaining', () => {
    it('should return time remaining in milliseconds', async () => {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours

      mockCookies.get.mockReturnValue({ value: 'session_123' });
      mockPrisma.session.findUnique.mockResolvedValue({
        id: 'session_123',
        createdAt: now,
        expiresAt,
      });

      const timeRemaining = await getSessionTimeRemaining();

      expect(timeRemaining).toBeGreaterThan(0);
      expect(timeRemaining).toBeLessThanOrEqual(2 * 60 * 60 * 1000);
    });

    it('should return null if no session', async () => {
      mockCookies.get.mockReturnValue(null);

      const timeRemaining = await getSessionTimeRemaining();

      expect(timeRemaining).toBeNull();
    });
  });

  describe('formatTimeRemaining', () => {
    it('should format hours and minutes', () => {
      const milliseconds = 2 * 60 * 60 * 1000 + 30 * 60 * 1000; // 2h 30m
      const formatted = formatTimeRemaining(milliseconds);

      expect(formatted).toBe('2ч 30м');
    });

    it('should format minutes only', () => {
      const milliseconds = 45 * 60 * 1000; // 45m
      const formatted = formatTimeRemaining(milliseconds);

      expect(formatted).toBe('45м');
    });
  });
});

