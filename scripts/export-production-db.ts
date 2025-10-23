import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function exportDatabase() {
  try {
    console.log('🔍 Exporting database...');

    // Fetch all data
    const tests = await prisma.test.findMany({
      include: {
        questions: {
          include: {
            options: true,
          },
          orderBy: { order: 'asc' },
        },
        scales: true,
        rules: {
          orderBy: { priority: 'asc' },
        },
        defaultResult: true,
      },
    });

    console.log(`✅ Found ${tests.length} tests`);

    // Generate SQL INSERT statements
    const sqlStatements: string[] = [];

    sqlStatements.push('-- Production Database Export');
    sqlStatements.push('-- Generated: ' + new Date().toISOString());
    sqlStatements.push('');
    sqlStatements.push('SET FOREIGN_KEY_CHECKS=0;');
    sqlStatements.push('');

    // Export tests
    for (const test of tests) {
      console.log(`📝 Exporting test: ${test.title}`);

      // Insert test
      sqlStatements.push(
        `INSERT INTO tests (id, slug, title, description, rating, published, version, result_mode, created_at, updated_at) VALUES (` +
          `'${test.id}', '${test.slug}', ${escapeString(test.title)}, ${escapeString(test.description)}, ` +
          `${test.rating}, ${test.published ? 1 : 0}, ${test.version}, '${test.resultMode}', ` +
          `'${test.createdAt.toISOString()}', '${test.updatedAt.toISOString()}');`
      );

      // Insert default result if exists
      if (test.defaultResult) {
        const dr = test.defaultResult;
        const createdAt = dr.createdAt ? dr.createdAt.toISOString() : new Date().toISOString();
        const updatedAt = dr.updatedAt ? dr.updatedAt.toISOString() : new Date().toISOString();
        sqlStatements.push(
          `INSERT INTO default_results (id, test_id, title, description, recommendations, created_at, updated_at) VALUES (` +
            `'${dr.id}', '${dr.testId}', ${escapeString(dr.title)}, ${escapeString(dr.description)}, ` +
            `${escapeString(JSON.stringify(dr.recommendations))}, ` +
            `'${createdAt}', '${updatedAt}');`
        );
      }

      // Insert questions
      for (const question of test.questions) {
        const qCreatedAt = question.createdAt ? question.createdAt.toISOString() : new Date().toISOString();
        const qUpdatedAt = question.updatedAt ? question.updatedAt.toISOString() : new Date().toISOString();
        sqlStatements.push(
          `INSERT INTO questions (id, test_id, text, type, \`order\`, created_at, updated_at) VALUES (` +
            `'${question.id}', '${question.testId}', ${escapeString(question.text)}, '${question.type}', ` +
            `${question.order}, '${qCreatedAt}', '${qUpdatedAt}');`
        );

        // Insert options
        for (const option of question.options) {
          const oCreatedAt = option.createdAt ? option.createdAt.toISOString() : new Date().toISOString();
          const oUpdatedAt = option.updatedAt ? option.updatedAt.toISOString() : new Date().toISOString();
          sqlStatements.push(
            `INSERT INTO answer_options (id, question_id, text, value, weights, created_at, updated_at) VALUES (` +
              `'${option.id}', '${option.questionId}', ${escapeString(option.text)}, ${option.value}, ` +
              `${escapeString(JSON.stringify(option.weights))}, ` +
              `'${oCreatedAt}', '${oUpdatedAt}');`
          );
        }
      }

      // Insert scales
      for (const scale of test.scales) {
        const sCreatedAt = scale.createdAt ? scale.createdAt.toISOString() : new Date().toISOString();
        const sUpdatedAt = scale.updatedAt ? scale.updatedAt.toISOString() : new Date().toISOString();
        sqlStatements.push(
          `INSERT INTO scales (id, test_id, \`key\`, name, min, max, bands, created_at, updated_at) VALUES (` +
            `'${scale.id}', '${scale.testId}', '${scale.key}', ${escapeString(scale.name)}, ` +
            `${scale.min}, ${scale.max}, ${escapeString(JSON.stringify(scale.bands))}, ` +
            `'${sCreatedAt}', '${sUpdatedAt}');`
        );
      }

      // Insert rules
      for (const rule of test.rules) {
        const rCreatedAt = rule.createdAt ? rule.createdAt.toISOString() : new Date().toISOString();
        const rUpdatedAt = rule.updatedAt ? rule.updatedAt.toISOString() : new Date().toISOString();
        sqlStatements.push(
          `INSERT INTO rules (id, test_id, kind, priority, payload, created_at, updated_at) VALUES (` +
            `'${rule.id}', '${rule.testId}', '${rule.kind}', ${rule.priority}, ` +
            `${escapeString(JSON.stringify(rule.payload))}, ` +
            `'${rCreatedAt}', '${rUpdatedAt}');`
        );
      }

      sqlStatements.push('');
    }

    sqlStatements.push('SET FOREIGN_KEY_CHECKS=1;');
    sqlStatements.push('');

    // Write to file
    const outputPath = path.join(process.cwd(), 'database', 'production-seed.sql');
    fs.writeFileSync(outputPath, sqlStatements.join('\n'), 'utf-8');

    console.log(`✅ Database exported to: ${outputPath}`);
    console.log(`📊 Total statements: ${sqlStatements.length}`);
  } catch (error) {
    console.error('❌ Error exporting database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

function escapeString(value: string | null | undefined): string {
  if (value === null || value === undefined) {
    return 'NULL';
  }
  // Escape single quotes and backslashes
  const escaped = value.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r');
  return `'${escaped}'`;
}

exportDatabase();

