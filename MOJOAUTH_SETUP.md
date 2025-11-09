# MojoAuth Magic Link Setup ✨

## ✅ What's Done

Your auction platform now uses **passwordless authentication** with MojoAuth magic links!

### Credentials Configured:
- **API Key**: `2f0b08a8-bdc2-4cb5-95a4-89b93743d357`
- **Secret**: `d465poo8nq8s7137vgvg.EuwzYtsA9Xc7Kdt9fPubB9`

## 🔧 MojoAuth Dashboard Setup

You need to whitelist your domain in the MojoAuth dashboard:

1. Go to [MojoAuth Dashboard](https://mojoauth.com/dashboard)
2. Navigate to **Settings** → **Allowed Origins**
3. Add these URLs:
   ```
   https://watch.ws
   https://www.watch.ws
   http://localhost:3000
   ```

## 🎯 How It Works

### User Flow:
1. User visits **https://watch.ws** and clicks "Sign In"
2. Enters their email address
3. Receives a magic link via email
4. Clicks the link → automatically signed in!

### No More:
- ❌ Passwords to remember
- ❌ Password resets
- ❌ Password security concerns

### Benefits:
- ✅ Passwordless authentication
- ✅ More secure (no password breaches)
- ✅ Better UX (one-click login)
- ✅ Automatic account creation

## 📁 Files Created/Modified

### New Files:
- `app/auth/signin/page.tsx` - Magic link sign-in UI
- `app/api/auth/mojoauth/send/route.ts` - Send magic link API
- `app/api/auth/mojoauth/verify/route.ts` - Verify magic link API

### Modified:
- `.env` - Added MojoAuth credentials
- `package.json` - Added `mojoauth-web-sdk` and `jose`

## 🧪 Testing

1. Visit **https://watch.ws**
2. Click "Sign In"
3. Enter your email
4. Check your inbox for the magic link
5. Click the link → You're in!

## 🔐 Security Features

- Magic links expire after 15 minutes
- One-time use only
- Secure JWT session tokens
- HttpOnly cookies
- HTTPS only in production

## 📊 Database

Users are automatically created in PostgreSQL when they first sign in with a magic link. No password field needed!

```sql
-- User table structure
users {
  id: string (unique)
  email: string (unique)
  name: string
  password: string (empty for magic link users)
  createdAt: datetime
}
```

## 🚀 Live Now

Your auction platform is live at:
- **https://watch.ws** - Passwordless authentication active!

## 📝 Next Steps

1. **Whitelist domains** in MojoAuth dashboard
2. **Test the flow** with your email
3. **Customize email template** in MojoAuth dashboard (optional)
4. **Monitor usage** in MojoAuth analytics

## 🆘 Troubleshooting

**Magic link not received?**
- Check spam folder
- Verify domain is whitelisted in MojoAuth
- Check MojoAuth dashboard logs

**"API key not configured" error?**
- Verify `.env` file has correct API key
- Restart the application: `pm2 restart auction`

**Link expired?**
- Links expire after 15 minutes
- Request a new magic link

## 📚 Documentation

- [MojoAuth Docs](https://mojoauth.com/docs)
- [API Reference](https://mojoauth.com/api-reference)
- [Dashboard](https://mojoauth.com/dashboard)

---

**Your auction platform is now passwordless!** 🎉
