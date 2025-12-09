# 🚀 RESTART INSTRUCTIONS

## The server needs to be restarted to use local MongoDB!

### Step 1: Stop Current Server
In the terminal running `npm run dev` in the `server` folder:
- Press `Ctrl + C` to stop the server

### Step 2: Restart Server
```bash
cd server
npm run dev
```

Wait for: `MongoDB Connected` and `Server running on port 5000`

### Step 3: Seed Database (New Terminal)
```bash
cd server
node seed.js
```

Wait for: `SEED DATA SUMMARY` with all counts

### Step 4: Test Login
Go to http://localhost:5173/login

**Credentials**:
- Email: `admin@waitwise.com`
- Password: `password123`

OR

- Email: `john@example.com`
- Password: `password123`

### Step 5: Check Features
✅ Forgot password link visible on login page
✅ WaitWise hero banner on home page
✅ All features working

---

## What Changed:
1. ✅ Switched to local MongoDB (no internet needed)
2. ✅ Added forgot password link to login page
3. ✅ Added WaitWise info banner to home page
4. ✅ Fixed seed script with lat/lng fields

## If MongoDB Not Installed:
Download from: https://www.mongodb.com/try/download/community

Or use MongoDB Compass (GUI): https://www.mongodb.com/try/download/compass
