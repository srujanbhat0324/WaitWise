# 🚀 Deployment Guide (Vercel + Render)

Since your app uses **Socket.io (Real-time updates)**, you cannot deploy the backend to Vercel (Vercel is serverless and doesn't support persistent connections).

You need to deploy:
1. **Frontend** -> **Vercel**
2. **Backend** -> **Render** (Free)

---

## Part 1: Deploy Backend to Render (Free)

1. Create account at **https://render.com**
2. Click **"New +"** -> **"Web Service"**
3. Connect your GitHub repository (`WaitWise`)
4. Settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
5. **Environment Variables** (Add these):
   - `MONGO_URI`: (Your MongoDB Atlas connection string)
   - `JWT_SECRET`: `waitwise_secret_key_2024_secure`
   - `PORT`: `5000`
6. Click **"Create Web Service"**
7. Wait for it to deploy. Copy the **URL** (e.g., `https://waitwise-backend.onrender.com`)

---

## Part 2: Configure Vercel (Frontend)

1. Go to your Vercel Dashboard
2. Select your `WaitWise` project
3. Go to **Settings** -> **Environment Variables**
4. Add a new variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://waitwise-backend.onrender.com/api` (The URL from Render + `/api`)
5. Click **Save**
6. Go to **Deployments** tab
7. Click the three dots on the latest deployment -> **Redeploy**

---

## ✅ Done!

Now your Vercel frontend will talk to your Render backend, and everything (including real-time updates) will work!
