# Quick Fix Guide - Login Not Working

## Problem
Login/Signup not working with test credentials.

## Root Cause
Database needs to be reseeded after code changes.

## Solution

### Step 1: Restart Backend Server
The `.env` file was updated, so restart the backend:

```bash
# Stop the current server (Ctrl+C in the terminal)
# Then restart:
cd server
npm run dev
```

### Step 2: Reseed Database
```bash
# In a new terminal
cd server
node seed.js
```

Wait for the message: "SEED DATA SUMMARY"

### Step 3: Test Login
Use these credentials:

**Super Admin**:
- Email: `admin@waitwise.com`
- Password: `password123`

**Department Admin**:
- Email: `sarah@hospital.com`
- Password: `password123`

**Regular User**:
- Email: `john@example.com`
- Password: `password123`

## If Still Not Working

### Check 1: Backend Running
Make sure you see: `Server running on port 5000`

### Check 2: MongoDB Connected
Look for: `MongoDB Connected`

### Check 3: Frontend API URL
Open browser console (F12) and check for errors.

### Check 4: CORS
If you see CORS errors, the backend might not be running.

## Alternative: Use Local MongoDB

If MongoDB Atlas is having issues, switch to local:

```env
# In server/.env
MONGO_URI=mongodb://localhost:27017/waitwise
```

Then install and run MongoDB locally.

## Vercel Deployment

**No need to redeploy to Vercel** - this is a local development issue.

Once login works locally, then you can deploy.
