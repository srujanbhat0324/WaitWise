# 🚀 WaitWise - Quick Setup Guide

## The Problem
Your MongoDB Atlas connection is failing. Here's how to fix it properly.

## Solution: Create a NEW MongoDB Atlas Cluster

### Step 1: Create Free MongoDB Atlas Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google/Email
3. Choose **FREE** M0 cluster
4. Select a cloud provider (AWS recommended)
5. Choose region closest to you
6. Click "Create Cluster"

### Step 2: Create Database User
1. In Atlas dashboard, click "Database Access"
2. Click "Add New Database User"
3. Username: `waitwise`
4. Password: `waitwise123` (or your own)
5. Database User Privileges: **Read and write to any database**
6. Click "Add User"

### Step 3: Allow Network Access
1. Click "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### Step 4: Get Connection String
1. Click "Database" (left sidebar)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Replace `<database>` with `waitwise`

Example:
```
mongodb+srv://waitwise:waitwise123@cluster0.xxxxx.mongodb.net/waitwise?retryWrites=true&w=majority
```

### Step 5: Update .env File
1. Open `server/.env`
2. Replace MONGO_URI with your connection string
3. Save the file

### Step 6: Restart Everything
```bash
# Stop all terminals (Ctrl+C)

# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Seed Database
cd server
node seed.js

# Terminal 3 - Frontend
cd client
npm run dev
```

### Step 7: Test Login
1. Go to: http://localhost:5173/login
2. Email: `admin@waitwise.com`
3. Password: `password123`

## If Still Not Working

### Option A: Use MongoDB Compass (GUI)
1. Download: https://www.mongodb.com/try/download/compass
2. Install and open
3. Paste your connection string
4. Connect
5. Create database: `waitwise`
6. Restart server and seed

### Option B: Use Local MongoDB
1. Download: https://www.mongodb.com/try/download/community
2. Install MongoDB locally
3. Update .env: `MONGO_URI=mongodb://localhost:27017/waitwise`
4. Restart and seed

## Security Features Already Implemented ✅

1. **Token Generation Protected**: Users MUST login to get queue tokens
2. **JWT Authentication**: All protected routes require valid token
3. **Role-Based Access**: Super Admin, Dept Admin, User roles enforced
4. **Password Hashing**: bcrypt with salt rounds
5. **Activity Logging**: All admin actions tracked

## Vercel Deployment

Once local works, deploy to Vercel:

1. **Add Environment Variables in Vercel**:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Your secret key
   
2. **Redeploy**: Vercel auto-deploys on git push

## Need Help?

Check these files:
- `server/.env.example` - Example environment variables
- `TESTING.md` - Comprehensive testing guide
- `walkthrough.md` - All features documentation
