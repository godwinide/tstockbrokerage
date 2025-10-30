# Admin Setup Guide

## Problem: ERR_TOO_MANY_REDIRECTS

This error occurs when trying to access `/admin` because:
1. User is authenticated but `isAdmin` field is `false` or missing
2. The middleware keeps redirecting to `/admin/signin` → login → `/admin` → redirect loop

## Solution: Create/Update Admin User

### Option 1: Use the create-admin script (Recommended)

#### Update existing user to admin:
```bash
node create-admin.js your-email@example.com
```

#### Create new admin user:
```bash
node create-admin.js admin@example.com admin-password
```

### Option 2: Update via MongoDB Compass/Atlas

1. Open MongoDB Compass or Atlas
2. Connect to your database
3. Find the `users` collection
4. Find your user by email
5. Edit the document and set: `isAdmin: true`
6. Save the changes

### Option 3: Update via MongoDB Shell

```javascript
use your_database_name

// Update existing user
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { isAdmin: true } }
)

// Verify the update
db.users.findOne({ email: "your-email@example.com" })
```

## Testing Admin Access

After creating/updating the admin user:

1. **Clear browser cookies** (important!)
2. Go to `/admin/signin`
3. Login with admin credentials
4. You should be redirected to `/admin` dashboard

## Debugging

The `ensureAdmin` middleware now logs authentication status. Check your server logs for:

```
ensureAdmin check: {
  isAuthenticated: true/false,
  user: { email: '...', isAdmin: true/false }
}
```

### Common Issues:

**Issue 1: User authenticated but isAdmin is false**
```
ensureAdmin check: { isAuthenticated: true, user: { email: 'test@test.com', isAdmin: false } }
User is authenticated but not admin
```
**Solution**: Run `node create-admin.js test@test.com` to update the user

**Issue 2: User not authenticated**
```
ensureAdmin check: { isAuthenticated: false, user: null }
User is not authenticated
```
**Solution**: 
- Clear cookies
- Login again
- Check if sessions are persisting (verify MONGO_URI is set)

**Issue 3: isAdmin field doesn't exist**
```
ensureAdmin check: { isAuthenticated: true, user: { email: 'test@test.com', isAdmin: undefined } }
```
**Solution**: The user document is missing the `isAdmin` field. Run the create-admin script.

## Verifying Admin Status

After setup, verify in MongoDB that your user has:
```json
{
  "email": "admin@example.com",
  "isAdmin": true,
  ...
}
```

## Security Notes

1. **Change default password** immediately after first login
2. **Use strong passwords** for admin accounts
3. **Limit admin access** - don't make all users admin
4. **Monitor admin activity** - check logs regularly

## Next Steps

After admin access is working:
1. ✅ Test admin dashboard access
2. ✅ Test user management features
3. ✅ Test deposit/withdrawal approvals
4. ✅ Change admin password
5. ✅ Remove debug logging from production (config/auth.js lines 10-13, 19, 23)
