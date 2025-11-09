# Test Create Item

## What to Test

1. Go to http://localhost:3000
2. Click "Sign In" (top right)
3. Sign up with:
   - Name: Test User
   - Email: test@test.com
   - Password: test123
4. Click "List Item"
5. Fill in form:
   - Title: Test Item
   - Description: Test description
   - City: Select "Riyadh"
   - Starting Price: 100
   - Your Name: Test User
   - Duration: 24 hours
6. Upload an image (optional)
7. Click "Create Listing"

## Expected Behavior

- Should create item successfully
- Should redirect to item page
- Item should be visible in database

## Debug Info

Check server console for:
```
Received body: { ... }
```

This will show exactly what fields are being sent.

## Common Issues

1. **Unauthorized** - User not signed in
2. **Missing required fields** - Check console log to see which fields are missing
3. **Image upload fails** - Check file size < 5MB

## Manual API Test

```bash
# Get session first
curl http://localhost:3000/api/auth/session

# Then create item (replace with your session cookie)
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN" \
  -d '{
    "title": "Test Item",
    "description": "Test",
    "city": "Riyadh",
    "startingPrice": "100",
    "duration": "24"
  }'
```
