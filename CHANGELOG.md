# Changelog

## [1.3.0] - 2025-11-09

### Hotfixes (Same Day)
- **Removed Vercel Analytics** - Not needed for self-hosted deployment
- **Fixed Profile API 401 Errors** - Next.js 16 params must be awaited
- **Fixed Profile Data Display** - Users now see all their listings/bids (including hidden)

### Added
- **User Profile System** (`/profile`)
  - View all listings with stats
  - View all bids with win/loss status
  - Dashboard with metrics (listings, bids, active auctions)
  - Tabbed interface

- **Admin Panel** (`/mgt`)
  - JWT authentication (admin/admin)
  - Dashboard with platform statistics
  - User management (view all users with stats)
  - Listing management (hide/show/delete)
  - Bid history viewing

- **New API Endpoints**
  - `POST /api/admin/login` - Admin authentication
  - `GET /api/admin/users` - Get all users
  - `GET /api/admin/items` - Get all items
  - `POST /api/admin/items/[itemId]/toggle-hidden` - Hide/show
  - `DELETE /api/admin/items/[itemId]` - Delete item
  - `GET /api/users/[userId]/listings` - User listings
  - `GET /api/users/[userId]/bids` - User bids

- **Database**
  - Added `hidden` field to items table
  - Migration: `20251109094448_add_hidden_field`

- **Design Updates**
  - New branding: ⏰ watch.ws
  - Amber/yellow color scheme
  - Gradient backgrounds
  - Float and pulse animations
  - Improved hover effects

### Fixed
- Profile page infinite loop (useCallback implementation)
- Admin dashboard redirect loop (middleware configuration)
- `x.filter is not a function` error (array validation)
- Zero data display in admin panel (middleware blocking APIs)
- Stats calculation timing issues

### Changed
- Middleware updated to allow admin routes
- Homepage now informative landing page (no public listings)
- Site header with new logo and amber buttons
- Item cards with amber gradients and better styling
- Improved error handling across all components

### Technical
- React hooks optimization (useCallback, proper dependencies)
- Better error handling with status code checking
- Array validation for API responses
- Comprehensive logging for debugging
- JWT token management for admin

---

## [1.2.0] - Previous Version
- Clerk authentication
- Item creation and bidding
- Real-time updates
- Image upload
- Phone number collection

---

## Version Summary

**v1.3:** User Profiles & Admin Panel  
**Status:** ✅ Production Ready  
**Files Changed:** 15+ new files, 10+ modified  
**Lines Added:** ~2,000+  
**Database Migrations:** 1  

**Live:** https://watch.ws
