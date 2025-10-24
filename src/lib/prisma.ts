import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Создаём Prisma Client с расширенным логированием и обработкой ошибок
const createPrismaClient = () => {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

  // Добавляем middleware для автоматического переподключения
  client.$use(async (params, next) => {
    const maxRetries = 3;
    let retries = 0;
    
    while (retries < maxRetries) {
      try {
        return await next(params);
      } catch (error: any) {
        // P1017 - Server has closed the connection
        // P1001 - Can't reach database server
        if ((error.code === 'P1017' || error.code === 'P1001') && retries < maxRetries - 1) {
          console.warn(`[Prisma] Connection lost (${error.code}), retrying... (attempt ${retries + 1}/${maxRetries})`);
          
          // Переподключаемся
          await client.$disconnect().catch(() => {});
          await new Promise(resolve => setTimeout(resolve, 1000 * (retries + 1))); // Exponential backoff
          
          retries++;
          continue;
        }
        throw error;
      }
    }
  });

  return client;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Graceful shutdown
if (typeof window === 'undefined') {
  const shutdown = async () => {
    await prisma.$disconnect();
  };
  
  process.on('beforeExit', shutdown);
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}
