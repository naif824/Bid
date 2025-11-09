# Quick Setup Guide

## Step-by-Step Setup

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Setup PostgreSQL
```bash
# Install PostgreSQL (if not installed)
# Ubuntu/Debian:
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS:
brew install postgresql
brew services start postgresql

# Create database
sudo -u postgres psql
CREATE DATABASE auction_db;
CREATE USER auction_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE auction_db TO auction_user;
\q
```

### 3. Configure Environment
```bash
cp env.example .env
```

Edit `.env`:
```env
DATABASE_URL="postgresql://auction_user:your_password@localhost:5432/auction_db?schema=public"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Initialize Database
```bash
pnpm db:generate
pnpm db:push
```

### 5. Create Upload Directory
```bash
mkdir -p public/uploads
```

### 6. Run Development Server
```bash
pnpm dev
```

Visit `http://localhost:3000`

## First Time Usage

1. Go to `http://localhost:3000`
2. Click "Sign Up" to create an account
3. Sign in with your credentials
4. Click "List Item" to create your first auction
5. Upload an image, fill in details, and submit
6. View your listing and place bids!

## Common Issues

**"Cannot connect to database"**
- Ensure PostgreSQL is running: `sudo systemctl status postgresql`
- Check DATABASE_URL in `.env`

**"Module not found"**
- Run `pnpm install` again
- Clear cache: `rm -rf .next node_modules && pnpm install`

**"Prisma Client not generated"**
- Run `pnpm db:generate`

## Scripts Reference

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm db:generate` - Generate Prisma Client
- `pnpm db:push` - Push schema to database
- `pnpm db:migrate` - Create migration
- `pnpm db:studio` - Open Prisma Studio
