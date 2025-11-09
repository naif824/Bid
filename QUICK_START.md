# Quick Start Guide

## Installation (Automated)

```bash
./install.sh
```

## Installation (Manual)

```bash
# 1. Install dependencies
pnpm install

# 2. Create .env file
cp env.example .env
# Edit .env and update DATABASE_URL and NEXTAUTH_SECRET

# 3. Create uploads directory
mkdir -p public/uploads

# 4. Generate Prisma Client
pnpm db:generate

# 5. Push schema to database
pnpm db:push

# 6. Start development server
pnpm dev
```

## Database Setup

```sql
-- Connect to PostgreSQL
sudo -u postgres psql

-- Create database
CREATE DATABASE auction_db;

-- Create user (optional)
CREATE USER auction_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE auction_db TO auction_user;

-- Exit
\q
```

## Environment Variables

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/auction_db?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Common Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm db:generate      # Generate Prisma Client
pnpm db:push          # Push schema to DB
pnpm db:migrate       # Create migration
pnpm db:studio        # Open Prisma Studio
```

## First Steps

1. Visit `http://localhost:3000`
2. Click "Sign Up" to create an account
3. Sign in with your credentials
4. Click "List Item" to create an auction
5. Upload an image and fill in details
6. Submit and view your listing
7. Place a bid to test real-time updates

## Troubleshooting

**Can't connect to database?**
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql
```

**Module not found?**
```bash
# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**Prisma errors?**
```bash
# Regenerate Prisma Client
pnpm db:generate
```

## Project Structure

```
app/
├── api/              # Backend API routes
├── auth/signin/      # Authentication page
├── create/           # Create auction page
├── item/[id]/        # Item detail page
└── page.tsx          # Home page

lib/
├── auth.ts           # NextAuth config
├── prisma.ts         # Database client
├── storage.ts        # API client
└── types.ts          # TypeScript types

prisma/
└── schema.prisma     # Database schema
```

## Features

✅ User authentication (sign up/sign in)
✅ Create auction listings
✅ Upload images (max 5MB)
✅ Place bids on items
✅ Real-time bid updates
✅ Bid history
✅ Auction expiration
✅ PostgreSQL database
✅ Secure password hashing

## API Endpoints

```
POST   /api/auth/signin          # Sign in
GET    /api/items                # List items
POST   /api/items                # Create item (auth)
GET    /api/items/[id]           # Get item
GET    /api/items/[id]/bids      # Get bids
POST   /api/items/[id]/bids      # Place bid (auth)
POST   /api/upload               # Upload image (auth)
GET    /api/realtime             # SSE stream
```

## Tech Stack

- **Framework**: Next.js 16
- **Database**: PostgreSQL + Prisma
- **Auth**: NextAuth.js
- **UI**: React 19 + shadcn/ui + TailwindCSS
- **Real-time**: Server-Sent Events

## Documentation

- `README.md` - Full documentation
- `SETUP.md` - Detailed setup guide
- `CHANGES.md` - Changelog
- `FILES_CREATED.md` - File listing

## Support

For issues, check the troubleshooting section in `README.md`
