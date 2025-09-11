# Database Setup - Local PostgreSQL with Docker

## Prerequisites

1. **Install Docker Desktop** and make sure it's running
2. **Verify Docker is running:**
   ```bash
   docker --version
   docker compose --version
   ```

## Quick Setup

1. **Start PostgreSQL container:**
   ```bash
   docker compose up -d postgres
   ```

2. **Run database migrations:**
   ```bash
   npm run prisma:migrate
   ```

3. **Generate Prisma client:**
   ```bash
   npm run prisma:generate
   ```

4. **Verify connection:**
   ```bash
   npm run start:dev
   ```

## Database Connection Details

- **Host:** localhost
- **Port:** 5432
- **Database:** jjplus_db
- **Username:** postgres
- **Password:** postgres123

## Optional: Database Management UI

Start PgAdmin for database management:
```bash
docker compose up -d pgadmin
```

Access PgAdmin at: http://localhost:5050
- Email: admin@jjplus.com
- Password: admin123

## Useful Commands

```bash
# Start only PostgreSQL
docker compose up -d postgres

# Start PostgreSQL + PgAdmin
docker compose up -d

# Stop all containers
docker compose down

# View container logs
docker compose logs postgres

# Reset database (WARNING: This will delete all data)
docker compose down -v
rm -rf postgres-data/
docker compose up -d postgres
npm run prisma:migrate
```

## Troubleshooting

### Docker daemon not running
```
Error: Cannot connect to the Docker daemon
```
**Solution:** Start Docker Desktop application

### Port 5432 already in use
```
Error: port 5432 already allocated
```
**Solution:** Stop existing PostgreSQL service or change port in docker-compose.yml

### Connection refused
```
Error: Connection refused
```
**Solution:** Make sure PostgreSQL container is running:
```bash
docker compose ps
docker compose logs postgres
```

## Switching Back to Neon DB

To switch back to Neon DB, edit `.env`:

```env
# Comment out local DB
# DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/jjplus_db

# Uncomment Neon DB
DATABASE_URL=postgresql://neondb_owner:npg_9NkqXUpf2AIn@ep-square-cell-ab2trk0u-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```