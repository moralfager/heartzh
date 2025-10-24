import { PrismaClient } from '@prisma/client';

// Создаём Prisma Client с расширенным логированием и правильной конфигурацией для MySQL
const createPrismaClient = () => {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

  return client;
};

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Keep-alive механизм для MySQL
if (typeof window === 'undefined') {
  // Пингуем БД каждые 5 минут чтобы соединение не закрылось
  const keepAliveInterval = setInterval(async () => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log('[Prisma] Keep-alive ping successful');
    } catch (error) {
      console.error('[Prisma] Keep-alive ping failed:', error);
      // Пробуем переподключиться
      try {
        await prisma.$disconnect();
        await prisma.$connect();
        console.log('[Prisma] Reconnected after failed ping');
      } catch (reconnectError) {
        console.error('[Prisma] Reconnection failed:', reconnectError);
      }
    }
  }, 5 * 60 * 1000); // 5 минут

  // Graceful shutdown
  const shutdown = async () => {
    clearInterval(keepAliveInterval);
    await prisma.$disconnect();
    console.log('[Prisma] Disconnected gracefully');
  };
  
  process.on('beforeExit', shutdown);
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}
