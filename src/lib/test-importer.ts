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
// VALIDATION SCHEMAS
// ============================================================================

const AnswerOptionSchema = z.object({
  text: z.string(),
  value: z.number(),
  weights: z.record(z.number()).optional(),
});

const QuestionSchema = z.object({
  text: z.string(),
  type: z.enum(['single', 'multi', 'scale', 'likert']),
  options: z.array(AnswerOptionSchema),
});

const ScaleSchema = z.object({
  key: z.string(),
  name: z.string(),
  min: z.number(),
  max: z.number(),
  bands: z
    .array(
      z.object({
        to: z.number(),
        label: z.string(),
      })
    )
    .optional(),
});

const RuleSchema = z.object({
  kind: z.enum(['threshold', 'combo', 'formula']),
  payload: z.record(z.any()),
});

const TestJSONSchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string().optional(),
  questions: z.array(QuestionSchema),
  scales: z.array(ScaleSchema),
  rules: z.array(RuleSchema).optional(),
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
  const externalId = options.externalId || testData.slug;

  try {
    // Валидация
    const validation = TestJSONSchema.safeParse(testData);

    if (!validation.success) {
      return {
        success: false,
        action: 'skipped',
        message: 'Validation failed',
        errors: validation.error.errors.map((e) => `${e.path}: ${e.message}`),
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
      where: { slug: validatedData.slug },
      orderBy: { version: 'desc' },
    });

    const newVersion = existingTest ? existingTest.version + 1 : 1;

    // Создание теста
    const test = await prisma.test.create({
      data: {
        slug: validatedData.slug,
        title: validatedData.title,
        description: validatedData.description,
        version: newVersion,
        published: true,
        questions: {
          create: validatedData.questions.map((q, index) => ({
            order: index + 1,
            text: q.text,
            type: q.type,
            options: {
              create: q.options.map((opt) => ({
                text: opt.text,
                value: opt.value,
                weights: opt.weights || {},
              })),
            },
          })),
        },
        scales: {
          create: validatedData.scales.map((scale) => ({
            key: scale.key,
            name: scale.name,
            min: scale.min,
            max: scale.max,
            bands: scale.bands || [],
          })),
        },
        rules: validatedData.rules
          ? {
              create: validatedData.rules.map((rule) => ({
                kind: rule.kind,
                payload: rule.payload,
              })),
            }
          : undefined,
      },
    });

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
      externalId: testData.slug,
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

