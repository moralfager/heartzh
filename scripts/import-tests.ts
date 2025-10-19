#!/usr/bin/env tsx
/**
 * CLI Script: Import Tests from JSON
 * 
 * Usage:
 *   npm run import-tests
 *   npm run import-tests -- --force
 *   npm run import-tests -- --file path/to/test.json
 */

import { importTestsFromFile, importTest } from '../src/lib/test-importer';
import path from 'path';

// ============================================================================
// CLI ARGUMENTS
// ============================================================================

const args = process.argv.slice(2);
const forceUpdate = args.includes('--force');
const fileIndex = args.indexOf('--file');
const customFile = fileIndex !== -1 ? args[fileIndex + 1] : null;

// ============================================================================
// DEFAULT TEST FILES
// ============================================================================

const DEFAULT_TEST_FILES = [
  'public/tests/love-psychology.json',
  'public/tests/love-expressions.json',
];

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  console.log('🚀 Starting test import...');
  console.log('');

  if (forceUpdate) {
    console.log('⚠️  Force update enabled - will reimport all tests');
    console.log('');
  }

  const filesToImport = customFile
    ? [customFile]
    : DEFAULT_TEST_FILES;

  let totalImported = 0;
  let totalSkipped = 0;
  let totalFailed = 0;

  for (const file of filesToImport) {
    const fullPath = path.resolve(process.cwd(), file);

    console.log(`📄 Importing: ${file}`);

    try {
      const results = await importTestsFromFile(fullPath, { forceUpdate });

      for (const result of results) {
        if (result.success) {
          if (result.action === 'created') {
            console.log(`  ✅ Created: ${result.message}`);
            totalImported++;
          } else if (result.action === 'updated') {
            console.log(`  ✅ Updated: ${result.message}`);
            totalImported++;
          } else {
            console.log(`  ⏭️  Skipped: ${result.message}`);
            totalSkipped++;
          }
        } else {
          console.log(`  ❌ Failed: ${result.message}`);
          if (result.errors) {
            result.errors.forEach((error) => {
              console.log(`     - ${error}`);
            });
          }
          totalFailed++;
        }
      }
    } catch (error) {
      console.log(`  ❌ Error reading file: ${error}`);
      totalFailed++;
    }

    console.log('');
  }

  console.log('📊 Import Summary:');
  console.log(`  ✅ Imported: ${totalImported}`);
  console.log(`  ⏭️  Skipped:  ${totalSkipped}`);
  console.log(`  ❌ Failed:   ${totalFailed}`);
  console.log('');

  if (totalFailed > 0) {
    console.log('⚠️  Some imports failed. Check errors above.');
    process.exit(1);
  } else {
    console.log('✨ All tests imported successfully!');
    process.exit(0);
  }
}

// Run
main().catch((error) => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});

