# Auction Platform - Version 1.1

**Release Date:** November 9, 2025  
**Backup Location:** `/KRYPTO/Lab/Bid-v1.1-backup.tar.gz` (3.6MB)

## Features

### Authentication (Clerk)
- ✅ Passwordless magic link authentication
- ✅ Custom username creation flow
- ✅ Direct Clerk REST API integration
- ✅ Custom user dropdown (no Clerk UI components)
- ✅ Session management

### Auction System
- ✅ Create listings with images
- ✅ Real-time bidding
- ✅ Bid history with instant updates
- ✅ Countdown timers
- ✅ City-based listings
- ✅ Image galleries with thumbnails

### User Experience
- ✅ @ prefix for all usernames
- ✅ Loading states (no flash of errors)
- ✅ Real-time updates without page refresh
- ✅ Responsive design
- ✅ Clean, minimal UI

## Tech Stack
- Next.js 16 (App Router)
- Clerk Authentication (REST API)
- Prisma ORM
- PostgreSQL
- TypeScript
- Tailwind CSS
- shadcn/ui components

## Key Files
- `/app/auth/` - Custom authentication pages
- `/app/api/auth/` - Username management APIs (direct Clerk API)
- `/components/site-header.tsx` - Custom user dropdown
- `/middleware.ts` - Route protection
- `/prisma/schema.prisma` - Database schema (no User model, Clerk manages users)

## Database Schema
- `items` - Auction listings (userId as string, no FK)
- `bids` - Bid records (userId as string, no FK)
- No User table (managed by Clerk)

## Environment Variables
- `CLERK_PUBLISHABLE_KEY` - Production key
- `CLERK_SECRET_KEY` - Production key
- `DATABASE_URL` - PostgreSQL connection
- `NEXT_PUBLIC_APP_URL` - https://watch.ws

## Notes
- All usernames stored and displayed with @ prefix
- Real-time updates via custom events
- No Clerk UI components (full control over design)
- Username availability check via direct API
