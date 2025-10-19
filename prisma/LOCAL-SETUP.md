# Local Database Setup

## Option 1: Docker MySQL (Recommended)

### 1. Create `docker-compose.dev.yml`

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root_password
      MYSQL_DATABASE: psychotest_dev
      MYSQL_USER: psychotest
      MYSQL_PASSWORD: psychotest_password
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

### 2. Start MySQL

```bash
docker-compose -f docker-compose.dev.yml up -d
```

### 3. Update `.env`

```env
DATABASE_URL="mysql://psychotest:psychotest_password@localhost:3306/psychotest_dev"
```

### 4. Run Migrations

```bash
npx prisma migrate dev --name init_schema
```

### 5. Open Prisma Studio

```bash
npx prisma studio
```

---

## Option 2: Local MySQL Installation

### 1. Install MySQL

**Windows:**
- Download from https://dev.mysql.com/downloads/mysql/
- Install MySQL Server
- Set root password

**macOS:**
```bash
brew install mysql
brew services start mysql
```

**Linux:**
```bash
sudo apt-get install mysql-server
sudo systemctl start mysql
```

### 2. Create Database

```bash
mysql -u root -p

CREATE DATABASE psychotest_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'psychotest'@'localhost' IDENTIFIED BY 'psychotest_password';
GRANT ALL PRIVILEGES ON psychotest_dev.* TO 'psychotest'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Update `.env`

```env
DATABASE_URL="mysql://psychotest:psychotest_password@localhost:3306/psychotest_dev"
```

### 4. Run Migrations

```bash
npx prisma migrate dev --name init_schema
```

---

## Option 3: SQLite (Quick Testing)

For quick local testing without MySQL:

### 1. Update `prisma/schema.prisma`

```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

### 2. Run Migrations

```bash
npx prisma migrate dev --name init_schema
```

**⚠️ Note:** SQLite is for testing only. Production uses MySQL.

---

## Verify Setup

### 1. Check Connection

```bash
npx prisma db pull
```

### 2. Generate Client

```bash
npx prisma generate
```

### 3. Open Studio

```bash
npx prisma studio
```

Should open at http://localhost:5555

---

## Production Setup

On VPS (already configured):

```bash
# SSH to server
ssh ubuntu@85.202.192.68
sudo -i

# Navigate to project
cd /var/www/heartzh

# Update .env with production DATABASE_URL
nano .env

# Run migrations
npx prisma migrate deploy

# Generate client
npx prisma generate

# Restart application
docker-compose -f docker-compose.prod.yml restart psychotest
```

---

## Troubleshooting

### Connection Refused

```bash
# Check if MySQL is running
docker ps  # for Docker
# or
sudo systemctl status mysql  # for local MySQL
```

### Port Already in Use

```bash
# Check what's using port 3306
netstat -tlnp | grep 3306

# Stop conflicting service
docker stop <container_id>
# or
sudo systemctl stop mysql
```

### Migration Failed

```bash
# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Or manually drop tables and re-run
npx prisma migrate dev
```

---

## Next Steps

After database is set up:

1. ✅ Verify Prisma Studio works
2. ✅ Create test data
3. ✅ Move to Task 1.2 (Session management)

