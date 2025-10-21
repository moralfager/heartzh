/**
 * Test Importer: JSON → Database
 * 
 * Идемпотентный импорт тестов из JSON файлов в БД
 * - Хэширование контента для проверки изменений
 * - Версионирование тестов
 * - Валидация через Zod
 */

import { prisma } from './prisma';
import { z } from 'zod';
import { createHash } from 'crypto';

// ============================================================================
// VALIDATION SCHEMAS (для реального формата)
// ============================================================================

// Схема для варианта ответа в реальном формате
const RealAnswerOptionSchema = z.object({
  id: z.string(),
  label: z.string(),
  domains: z.record(z.number()).optional(), // {"A_SECURE": 5}
});

// Схема для вопроса в реальном формате
const RealQuestionSchema = z.object({
  id: z.string(),
  block: z.number(),
  text: z.string(),
  scale: z.string(), // "likert", "choice", etc
  options: z.array(RealAnswerOptionSchema),
});

// Схема meta информации
const MetaSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  estMinutes: z.number().optional(),
  questionsCount: z.number().optional(),
  isPseudo: z.boolean().optional(),
  languages: z.array(z.string()).optional(),
  rating: z.number().optional(),
});

// Схема всего JSON файла (реальный формат)
const TestJSONSchema = z.object({
  meta: MetaSchema,
  questions: z.array(RealQuestionSchema),
});

// ============================================================================
// TYPES
// ============================================================================

export type TestJSON = z.infer<typeof TestJSONSchema>;

export interface ImportResult {
  success: boolean;
  testId?: string;
  version?: number;
  action: 'created' | 'updated' | 'skipped';
  message: string;
  errors?: string[];
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Генерирует хэш контента теста для идемпотентности
 */
function generateContentHash(testData: TestJSON): string {
  const content = JSON.stringify(testData, Object.keys(testData).sort());
  return createHash('sha256').update(content).digest('hex');
}

/**
 * Проверяет, был ли этот контент уже импортирован
 */
async function wasAlreadyImported(
  externalId: string,
  contentHash: string
): Promise<boolean> {
  const existing = await prisma.importJob.findFirst({
    where: {
      externalId,
      contentHash,
      status: 'applied',
    },
  });

  return existing !== null;
}

/**
 * Сохраняет факт импорта
 */
async function recordImport(
  externalId: string,
  contentHash: string,
  testId: string,
  status: 'applied' | 'skipped' | 'failed'
): Promise<void> {
  await prisma.importJob.create({
    data: {
      externalId,
      contentHash,
      testId,
      status,
    },
  });
}

// ============================================================================
// IMPORT LOGIC
// ============================================================================

/**
 * Импортирует тест из JSON в БД
 */
export async function importTest(
  testData: TestJSON,
  options: {
    externalId?: string;
    forceUpdate?: boolean;
  } = {}
): Promise<ImportResult> {
  const externalId = options.externalId || testData.meta.id;

  try {
    // Валидация
    const validation = TestJSONSchema.safeParse(testData);

    if (!validation.success) {
      return {
        success: false,
        action: 'skipped',
        message: 'Validation failed',
        errors: validation.error.errors.map((e) => `${e.path.join(',')}: ${e.message}`),
      };
    }

    const validatedData = validation.data;
    const contentHash = generateContentHash(validatedData);

    // Проверка идемпотентности
    if (!options.forceUpdate) {
      const alreadyImported = await wasAlreadyImported(externalId, contentHash);

      if (alreadyImported) {
        return {
          success: true,
          action: 'skipped',
          message: 'Test already imported with same content',
        };
      }
    }

    // Поиск существующего теста
    const existingTest = await prisma.test.findFirst({
      where: { slug: validatedData.meta.slug },
      orderBy: { version: 'desc' },
    });

    const newVersion = existingTest ? existingTest.version + 1 : 1;

    // Создание теста
    const test = await prisma.test.create({
      data: {
        slug: validatedData.meta.slug,
        title: validatedData.meta.title,
        description: validatedData.meta.subtitle,
        version: newVersion,
        published: true,
        questions: {
          create: validatedData.questions.map((q, index) => ({
            order: index + 1,
            text: q.text,
            type: q.scale === 'likert' ? 'scale' : 'single', // конвертируем типы
            options: {
              create: q.options.map((opt, optIndex) => ({
                text: opt.label,
                value: optIndex + 1, // нумеруем от 1
                weights: opt.domains || {},
              })),
            },
          })),
        },
        // Пропускаем scales и rules пока, они будут генерироваться позже
      },
    });

    // Для обратной совместимости с DSL: создаём шкалы из domains
    // Это будет реализовано позже в Milestone 4

    // Запись импорта
    await recordImport(externalId, contentHash, test.id, 'applied');

    return {
      success: true,
      testId: test.id,
      version: test.version,
      action: existingTest ? 'updated' : 'created',
      message: `Test ${existingTest ? 'updated' : 'created'} successfully (version ${newVersion})`,
    };
  } catch (error) {
    console.error('[IMPORTER] Error:', error);

    // Запись неудачного импорта
    try {
      await recordImport(
        externalId,
        generateContentHash(testData),
        '',
        'failed'
      );
    } catch (recordError) {
      // Игнорируем ошибки записи
    }

    return {
      success: false,
      action: 'skipped',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Импортирует несколько тестов из массива
 */
export async function importTests(
  tests: TestJSON[],
  options: {
    forceUpdate?: boolean;
  } = {}
): Promise<ImportResult[]> {
  const results: ImportResult[] = [];

  for (const testData of tests) {
    const result = await importTest(testData, {
      externalId: testData.meta?.slug,
      forceUpdate: options.forceUpdate,
    });

    results.push(result);
  }

  return results;
}

/**
 * Импортирует тесты из JSON файла
 */
export async function importTestsFromFile(
  filePath: string,
  options: {
    forceUpdate?: boolean;
  } = {}
): Promise<ImportResult[]> {
  const fs = await import('fs/promises');
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const data = JSON.parse(fileContent);

  // Поддержка как одного теста, так и массива
  const tests = Array.isArray(data) ? data : [data];

  return importTests(tests, options);
}


