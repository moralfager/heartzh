/**
 * Unit tests для cleanup cron
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Mock Prisma
const mockPrisma = {
  session: {
    findMany: jest.fn(),
    deleteMany: jest.fn(),
    count: jest.fn(),
  },
  result: {
    count: jest.fn(),
  },
};

jest.mock('../prisma', () => ({
  prisma: mockPrisma,
}));

import {
  cleanupExpiredSessions,
  cleanupAllExpiredSessions,
  getCleanupStats,
} from '../cleanup-cron';

describe('Cleanup Cron', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('cleanupExpiredSessions', () => {
    it('should delete expired sessions and return stats', async () => {
      const expiredDate = new Date(Date.now() - 1000);

      mockPrisma.session.findMany.mockResolvedValue([
        { id: 'session_1' },
        { id: 'session_2' },
      ]);

      mockPrisma.result.count.mockResolvedValue(5);

      mockPrisma.session.deleteMany.mockResolvedValue({
        count: 2,
      });

      const stats = await cleanupExpiredSessions();

      expect(stats.sessionsDeleted).toBe(2);
      expect(stats.resultsDeleted).toBe(5);
      expect(stats.executionTime).toBeGreaterThanOrEqual(0);
      expect(mockPrisma.session.deleteMany).toHaveBeenCalledTimes(1);
    });

    it('should return zero stats if no expired sessions', async () => {
      mockPrisma.session.findMany.mockResolvedValue([]);

      const stats = await cleanupExpiredSessions();

      expect(stats.sessionsDeleted).toBe(0);
      expect(stats.resultsDeleted).toBe(0);
      expect(mockPrisma.session.deleteMany).not.toHaveBeenCalled();
    });

    it('should handle batch size limit', async () => {
      const sessions = Array.from({ length: 100 }, (_, i) => ({
        id: `session_${i}`,
      }));

      mockPrisma.session.findMany.mockResolvedValue(sessions);
      mockPrisma.result.count.mockResolvedValue(300);
      mockPrisma.session.deleteMany.mockResolvedValue({ count: 100 });

      const stats = await cleanupExpiredSessions();

      expect(stats.sessionsDeleted).toBe(100);
      expect(stats.resultsDeleted).toBe(300);
    });

    it('should throw error on database failure', async () => {
      mockPrisma.session.findMany.mockRejectedValue(
        new Error('Database error')
      );

      await expect(cleanupExpiredSessions()).rejects.toThrow('Database error');
    });
  });

  describe('getCleanupStats', () => {
    it('should return stats without deleting', async () => {
      mockPrisma.session.count.mockResolvedValue(10);
      mockPrisma.session.findMany.mockResolvedValue([
        { id: 'session_1' },
        { id: 'session_2' },
      ]);
      mockPrisma.result.count.mockResolvedValue(25);

      const stats = await getCleanupStats();

      expect(stats.expiredSessions).toBe(10);
      expect(stats.expiredResults).toBe(25);
      expect(mockPrisma.session.deleteMany).not.toHaveBeenCalled();
    });

    it('should return zero if no expired data', async () => {
      mockPrisma.session.count.mockResolvedValue(0);
      mockPrisma.session.findMany.mockResolvedValue([]);
      mockPrisma.result.count.mockResolvedValue(0);

      const stats = await getCleanupStats();

      expect(stats.expiredSessions).toBe(0);
      expect(stats.expiredResults).toBe(0);
    });
  });
});

