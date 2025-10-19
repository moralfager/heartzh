# Prisma Database Schema

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/psychotest"

# Session Configuration
RESULT_TTL_HOURS=24
SESSION_COOKIE_NAME=hoz_sid
SESSION_COOKIE_SAMESITE=Lax
SESSION_COOKIE_SECURE=true

# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=psychotest2024

# Cleanup Cron
CLEANUP_CRON_SCHEDULE="0 * * * *"  # каждый час
```

## Database Structure

### 8 Tables:

1. **tests** - Тесты с версионированием
2. **questions** - Вопросы тестов
3. **answer_options** - Варианты ответов
4. **scales** - Шкалы результатов (O, C, E, A, N)
5. **rules** - Правила расчёта (threshold/formula/combo)
6. **sessions** - Временные сессии (TTL 24h)
7. **results** - Результаты тестов
8. **result_details** - Детали расчётов
9. **import_jobs** - История импортов (идемпотентность)

## Commands

### Development

```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name init_schema

# Apply migrations
npx prisma migrate deploy

# Open Prisma Studio
npx prisma studio

# Reset database (⚠️ deletes all data)
npx prisma migrate reset
```

### Production

```bash
# Apply migrations without prompts
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

## Migration Strategy

1. **Development:**
   - Use `npx prisma migrate dev` for creating migrations
   - Test migrations locally before deploying

2. **Production:**
   - Use `npx prisma migrate deploy` in CI/CD
   - Never use `migrate reset` in production

3. **Rollback:**
   - Create a new migration to revert changes
   - Never delete migration files

## Privacy Features

### Session Management:
- Each session gets unique `sessionId` (cuid)
- Sessions expire after 24 hours (`expiresAt`)
- Automatic cleanup via cron job

### Data Retention:
- Results are linked to sessions
- When session expires, results are deleted (CASCADE)
- No personal data stored (fully anonymous)

### Indexes:
- Fast session lookup: `@@index([expiresAt])`
- Fast result retrieval: `@@index([sessionId])`
- Performance optimized for TTL cleanup

## Schema Design Principles

1. **Normalization:** Tests, Questions, Options are normalized
2. **Versioning:** Tests support multiple versions for A/B testing
3. **Soft Deletes:** Use `published` flag instead of deleting tests
4. **Cascading:** Foreign keys with `onDelete: Cascade` for cleanup
5. **Indexing:** Strategic indexes for performance
6. **JSON Fields:** Flexible storage for weights, rules, summaries

## Security

- Never commit `.env` file
- Use strong passwords for DATABASE_URL
- Rotate admin credentials regularly
- Use SSL for database connections in production

