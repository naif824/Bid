# MojoAuth OAuth Setup Complete! ✨

## ✅ What's Configured

Your auction platform now uses **MojoAuth OAuth 2.0 / OpenID Connect** for passwordless authentication!

### OIDC Endpoints Configured:
- **Authorization**: `https://watch-ws-540698.auth.mojoauth.com/oauth/authorize`
- **Token**: `https://watch-ws-540698.auth.mojoauth.com/oauth2/token`
- **UserInfo**: `https://watch-ws-540698.auth.mojoauth.com/oauth/userinfo`
- **JWKS**: `https://watch-ws-540698.auth.mojoauth.com/.well-known/jwks.json`
- **Logout**: `https://watch-ws-540698.auth.mojoauth.com/oauth/logout`

### Credentials:
- **Client ID**: `2f0b08a8-bdc2-4cb5-95a4-89b93743d357`
- **Client Secret**: `d465poo8nq8s7137vgvg.EuwzYtsA9Xc7Kdt9fPubB9`

## 🔧 MojoAuth Dashboard Setup Required

**IMPORTANT**: Add this redirect URI in your MojoAuth dashboard:

1. Go to [MojoAuth Dashboard](https://mojoauth.com/dashboard)
2. Navigate to **Settings** → **Redirect URIs**
3. Add:
   ```
   https://watch.ws/api/auth/callback/mojoauth
   ```

## 🎯 How It Works Now

### User Flow:
1. User visits **https://watch.ws**
2. Clicks "Sign In"
3. Clicks "Sign In with MojoAuth"
4. Enters email on MojoAuth page
5. Receives email with "Verify Your Email" button
6. **Clicks button → Automatically signed in!** ✨

### What Happens Behind the Scenes:
1. NextAuth initiates OAuth flow
2. MojoAuth sends magic link email
3. User clicks link in email
4. MojoAuth redirects back to your app with auth code
5. NextAuth exchanges code for tokens
6. User is signed in and synced to PostgreSQL

## 📁 Files Modified

### Updated:
- `lib/auth.ts` - Now uses MojoAuth OAuth provider
- `app/auth/signin/page.tsx` - Simple OAuth sign-in button
- `.env` - OAuth credentials configured

### Removed (no longer needed):
- Custom magic link API routes
- Manual email verification

## 🧪 Testing

1. Visit **https://watch.ws**
2. Click "Sign In"
3. Click "Sign In with MojoAuth"
4. Enter your email
5. Check inbox for email with "Verify Your Email" button
6. Click button → You're signed in! 🎉

## 🔐 Security Features

- OAuth 2.0 / OpenID Connect standard
- Secure token exchange
- JWT session tokens
- HttpOnly cookies
- HTTPS only
- No passwords stored

## 📊 Database

Users are automatically created in PostgreSQL when they first sign in:

```sql
users {
  id: string (from OAuth sub claim)
  email: string (unique)
  name: string
  password: string (empty for OAuth users)
  createdAt: datetime
}
```

## 🚀 Live Now

**https://watch.ws** - OAuth authentication active!

## ⚠️ Important Next Steps

1. **Add redirect URI** in MojoAuth dashboard:
   ```
   https://watch.ws/api/auth/callback/mojoauth
   ```

2. **Test the flow** with your email

3. **Customize email template** in MojoAuth dashboard (optional)

## 🆘 Troubleshooting

**"Redirect URI mismatch" error?**
- Verify you added `https://watch.ws/api/auth/callback/mojoauth` in MojoAuth dashboard

**Email not received?**
- Check spam folder
- Verify email is valid
- Check MojoAuth dashboard logs

**"Invalid client" error?**
- Verify CLIENT_ID and CLIENT_SECRET in `.env`
- Restart app: `pm2 restart auction`

## 📚 Resources

- [MojoAuth Dashboard](https://mojoauth.com/dashboard)
- [NextAuth.js Docs](https://next-auth.js.org/)
- [OAuth 2.0 Spec](https://oauth.net/2/)

---

**Your auction platform is now fully passwordless with OAuth!** 🎊
