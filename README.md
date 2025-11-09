# ⏰ watch.ws - Private Auction Platform

A modern, full-stack private auction platform for friends and family. Built with Next.js 16, PostgreSQL, Prisma, and Clerk authentication. Features real-time bidding, user profiles, admin panel, and beautiful amber-themed UI.

**Live:** https://watch.ws  
**Version:** 1.3.0

## ✨ Features

### User Features
✅ **Clerk Authentication** - Secure sign-up and sign-in with email verification  
✅ **User Profiles** - View your listings, bids, and activity stats  
✅ **Real-time Bidding** - Live updates across all devices using Server-Sent Events (SSE)  
✅ **Private Listings** - Share auction links privately with friends and family  
✅ **Image Upload** - Multiple images with thumbnails  
✅ **Responsive UI** - Modern amber-themed design with shadcn/ui and TailwindCSS  
✅ **Saudi Arabia Focus** - Pre-configured with Saudi cities  
✅ **Bid Status** - See if you're winning or outbid  

### Admin Features
✅ **Admin Panel** - Dedicated management dashboard at `/mgt`  
✅ **User Management** - View all users with activity stats  
✅ **Listing Management** - Hide/show or delete listings  
✅ **Platform Statistics** - Monitor users, listings, and bids  
✅ **JWT Authentication** - Separate admin authentication system

## 🛠️ Tech Stack

- **Framework**: Next.js 16.0 (App Router)
- **Database**: PostgreSQL 14+
- **ORM**: Prisma 6.0
- **Authentication**: Clerk (user) + JWT (admin)
- **UI**: React 19, shadcn/ui, Radix UI, TailwindCSS 4
- **Real-time**: Server-Sent Events (SSE)
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **Package Manager**: pnpm
- **Deployment**: Self-hosted with PM2

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher
- **pnpm** 8.x or higher
- **PostgreSQL** 14.x or higher

## Installation

### 1. Clone and Install Dependencies

```bash
cd /KRYPTO/Lab/Bid
pnpm install
```

### 2. Set Up PostgreSQL Database

Create a new PostgreSQL database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE auction_db;

# Exit psql
\q
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp env.example .env.local
```

Edit `.env.local` and update the values:

```env
# Database
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/auction_db?schema=public"

# Clerk Authentication (get from clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/auth/signin"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/auth/signin"

# Admin Panel
ADMIN_JWT_SECRET="your-secure-admin-secret-change-in-production"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Important**: 
- Replace `your_password` with your PostgreSQL password
- Sign up at [clerk.com](https://clerk.com) and get your API keys
- Generate a secure `ADMIN_JWT_SECRET` using: `openssl rand -base64 32`

### 4. Initialize Database

Run Prisma migrations to create database tables:

```bash
# Generate Prisma Client
pnpm db:generate

# Push schema to database
pnpm db:push
```

### 5. Create Uploads Directory

```bash
mkdir -p public/uploads
```

## Running the Application

### Development Mode

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

### Production Build

```bash
pnpm build
pnpm start
```

## Database Management

### Prisma Studio

View and edit your database with Prisma Studio:

```bash
pnpm db:studio
```

Access at `http://localhost:5555`

### Database Migrations

Create a new migration:

```bash
pnpm db:migrate
```

### Reset Database

```bash
npx prisma migrate reset
```

## Project Structure

```
/KRYPTO/Lab/Bid/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/  # NextAuth endpoints
│   │   ├── items/               # Item CRUD operations
│   │   ├── upload/              # Image upload
│   │   └── realtime/            # SSE for real-time updates
│   ├── auth/signin/             # Authentication pages
│   ├── create/                  # Create auction listing
│   ├── item/[id]/               # Item detail page
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── bid-form.tsx             # Bid placement form
│   ├── bid-history.tsx          # Bid history display
│   ├── create-item-form.tsx     # Item creation form
│   ├── item-card.tsx            # Item card component
│   └── live-item-view.tsx       # Real-time item view
├── lib/
│   ├── auth.ts                  # NextAuth configuration
│   ├── prisma.ts                # Prisma client
│   ├── storage.ts               # API client functions
│   ├── types.ts                 # TypeScript types
│   └── utils.ts                 # Utility functions
├── prisma/
│   └── schema.prisma            # Database schema
├── public/
│   └── uploads/                 # Uploaded images
├── types/
│   └── next-auth.d.ts           # NextAuth type extensions
├── .env                         # Environment variables (create this)
├── env.example                  # Environment template
├── package.json                 # Dependencies
└── README.md                    # This file
```

## 📡 API Endpoints

### User Authentication (Clerk)
- Handled by Clerk SDK
- `/auth/signin` - Sign in page
- `/auth/complete-profile` - Set username

### Items
- `GET /api/items` - Get all active items
- `POST /api/items` - Create new item (requires auth)
- `GET /api/items/[id]` - Get single item
- `GET /api/items/[id]/bids` - Get bids for item
- `POST /api/items/[id]/bids` - Place bid (requires auth)

### User Profile
- `GET /api/users/[userId]/listings` - Get user's listings
- `GET /api/users/[userId]/bids` - Get user's bids

### Admin (JWT Auth)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/users` - Get all users with stats
- `GET /api/admin/items` - Get all items with bids
- `POST /api/admin/items/[itemId]/toggle-hidden` - Hide/show listing
- `DELETE /api/admin/items/[itemId]` - Delete listing

### Upload
- `POST /api/upload` - Upload image (requires auth)

### Real-time
- `GET /api/realtime` - SSE endpoint for live updates

## 👤 User Pages

- `/` - Homepage (informative landing page)
- `/profile` - User profile with listings and bids
- `/create` - Create new auction listing
- `/[id]` - Item detail page with bidding

## 🔐 Admin Panel

Access the admin panel at `/mgt`:

**Default Credentials:**
- Username: `admin`
- Password: `admin`

**⚠️ Important:** Change these credentials in production!

**Features:**
- View all users with activity stats
- View all listings with bid history
- Hide/show listings
- Delete listings
- Platform statistics dashboard

## Features Explained

### Authentication

Users must sign up/sign in to:
- Create auction listings
- Place bids
- Upload images

Passwords are hashed using bcrypt before storage.

### Real-time Updates

The platform uses Server-Sent Events (SSE) for real-time bidding:
- All connected clients receive instant updates when bids are placed
- No page refresh needed
- Automatic reconnection on disconnect

### Image Storage

Images are stored on the local filesystem:
- Uploaded to `public/uploads/`
- Accessible via `/uploads/[filename]`
- Maximum file size: 5MB
- Supported formats: All image types

### Database Schema

**Users Table**
- id, name, email, password (hashed), timestamps

**Items Table**
- id, title, description, imageUrl, city, startingPrice, currentPrice, sellerName, endsAt, userId, timestamps

**Bids Table**
- id, amount, bidderName, itemId, userId, timestamps

## Development

### Adding New Dependencies

```bash
pnpm add package-name
pnpm add -D package-name  # Dev dependency
```

### Modifying Database Schema

1. Edit `prisma/schema.prisma`
2. Run `pnpm db:push` or `pnpm db:migrate`
3. Regenerate Prisma Client: `pnpm db:generate`

### Environment Variables

Never commit `.env` files. Always use `env.example` as a template.

## Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql
```

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Prisma Client Not Generated

```bash
pnpm db:generate
```

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## Security Considerations

- ✅ Passwords are hashed with bcrypt
- ✅ JWT tokens for session management
- ✅ CSRF protection via NextAuth
- ✅ File upload validation (type and size)
- ✅ SQL injection prevention via Prisma
- ⚠️ Add rate limiting in production
- ⚠️ Use HTTPS in production
- ⚠️ Set secure cookie options in production

## Production Deployment

### Environment Variables

Update for production:

```env
DATABASE_URL="postgresql://user:password@production-host:5432/auction_db"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="strong-random-secret"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

### Build and Deploy

```bash
pnpm build
pnpm start
```

### Recommended Hosting

- **Database**: Railway, Supabase, or any PostgreSQL host
- **Application**: Vercel, Railway, or any Node.js host
- **Images**: Consider using cloud storage (S3, Cloudinary) for production

## License

MIT

## Support

For issues or questions, please create an issue in the repository.
