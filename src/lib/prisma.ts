import { PrismaClient } from '@prisma/client';

// Создаём Prisma Client с расширенным логированием
const createPrismaClient = () => {
  const baseClient = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

  // Используем Client Extensions для обработки переподключения
  const client = baseClient.$extends({
    query: {
      async $allOperations({ operation, model, args, query }) {
        const maxRetries = 3;
        let lastError: any;
        
        for (let attempt = 0; attempt < maxRetries; attempt++) {
          try {
            return await query(args);
          } catch (error: any) {
            lastError = error;
            
            // P1017 - Server has closed the connection
            // P1001 - Can't reach database server
            if ((error.code === 'P1017' || error.code === 'P1001') && attempt < maxRetries - 1) {
              console.warn(`[Prisma] Connection lost (${error.code}), retrying ${model}.${operation}... (attempt ${attempt + 1}/${maxRetries})`);
              
              // Disconnect and reconnect
              try {
                await baseClient.$disconnect();
                console.log(`[Prisma] Disconnected, waiting ${attempt + 1}s before reconnect...`);
                await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
                await baseClient.$connect();
                console.log(`[Prisma] Reconnected successfully`);
              } catch (reconnectError) {
                console.error(`[Prisma] Reconnect failed:`, reconnectError);
              }
              
              continue;
            }
            
            throw error;
          }
        }
        
        throw lastError;
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

// Graceful shutdown
if (typeof window === 'undefined') {
  const shutdown = async () => {
    await prisma.$disconnect();
  };
  
  process.on('beforeExit', shutdown);
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}
