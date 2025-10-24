import { PrismaClient } from '@prisma/client';

// Создаём Prisma Client с правильной конфигурацией для MySQL production
const createPrismaClient = () => {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

  return client;
};

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Инициализация и keep-alive только на сервере
if (typeof window === 'undefined') {
  // Явное подключение при старте приложения
  prisma.$connect()
    .then(() => {
      console.log('[Prisma] Successfully connected to database');
    })
    .catch((error) => {
      console.error('[Prisma] Failed to connect to database:', error);
    });

  // Пингуем БД каждые 5 минут для поддержания соединения
  const keepAliveInterval = setInterval(async () => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log('[Prisma] Keep-alive ping successful');
    } catch (error) {
      console.error('[Prisma] Keep-alive ping failed:', error);
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
