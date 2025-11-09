# Auction Platform - Version 1.2

**Release Date:** November 9, 2025  
**Backup Location:** `/KRYPTO/Lab/Bid-v1.2-backup.tar.gz` (5.9MB)

## New in Version 1.2

### Combined Profile Setup
- ✅ Username and phone number on single form
- ✅ Streamlined onboarding flow
- ✅ No redirect between pages

### Phone Number Integration
- ✅ Saudi phone number collection (+966)
- ✅ Automatic zero removal from input
- ✅ Validates 9-10 digit numbers
- ✅ Stored in Clerk public metadata
- ✅ Stored in database with each listing

### WhatsApp Contact
- ✅ "Contact Seller on WhatsApp" button on listings
- ✅ Direct link: `https://wa.me/966xxxxxxxxx`
- ✅ Opens in new tab
- ✅ Only shows for valid phone numbers

### Bug Fixes
- ✅ Fixed bid history real-time updates
- ✅ Fixed "Item not found" flash on page load
- ✅ Added loading states
- ✅ Fixed redirect loops in profile setup
- ✅ Improved error logging

## Features (Complete)

### Authentication
- Passwordless magic link (Clerk)
- Custom username with @ prefix
- Phone number collection
- Direct Clerk REST API integration
- Custom UI (no Clerk components)

### Auction System
- Create listings with multiple images
- Real-time bidding
- Instant bid history updates
- Countdown timers
- City-based listings
- Image galleries with thumbnails
- WhatsApp seller contact

### Database Schema
```prisma
Item {
  id, title, description
  imageUrl, images[], thumbnails[]
  city, startingPrice, currentPrice
  sellerName, sellerPhone
  createdAt, endsAt, userId
}

Bid {
  id, itemId, bidderName
  amount, createdAt, userId
}
```

## Tech Stack
- Next.js 16 (App Router)
- Clerk Authentication (REST API)
- Prisma ORM + PostgreSQL
- TypeScript
- Tailwind CSS + shadcn/ui

## Environment Variables
```
CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
DATABASE_URL
NEXT_PUBLIC_APP_URL=https://watch.ws
```

## Restore Instructions
```bash
cd /KRYPTO/Lab
tar -xzf Bid-v1.2-backup.tar.gz
cd Bid
pnpm install
pnpm build
pm2 restart auction
```

## Changes from v1.1
- Combined username + phone into single form
- Added WhatsApp contact button
- Fixed real-time bid updates
- Fixed loading states
- Improved error handling
- Added detailed API logging
