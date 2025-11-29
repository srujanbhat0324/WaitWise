# WaitWise - Smart Multi-Department Queue Tracking System

WaitWise is a MERN stack Progressive Web App (PWA) designed to reduce waiting times in hospitals, RTO offices, and service counters.

## Features
- **Real-time Queue Tracking**: Live token updates using Socket.IO.
- **Location Discovery**: Find nearby offices using Geolocation.
- **AI Predictions**: Estimated waiting times and crowd forecasts.
- **Role-Based Access**: User, Department Admin, and Super Admin roles.
- **PWA Support**: Installable on mobile devices.

## Tech Stack
- **Frontend**: React, Vite, TailwindCSS
- **Backend**: Node.js, Express, MongoDB
- **Real-time**: Socket.IO

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas URI)

### 1. Backend Setup
```bash
cd server
npm install
# Create a .env file with:
# MONGO_URI=mongodb://localhost:27017/waitwise
# JWT_SECRET=your_jwt_secret
# PORT=5000

npm run dev
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```

### 3. Usage
- Open `http://localhost:5173` in your browser.
- **Super Admin**: Sign up with role `super_admin` (in the demo signup form).
- **Create Office**: Go to `/admin` to create an office and departments.
- **User**: Go to Home, find the office, and join a queue.
- **Dept Admin**: Sign up as `dept_admin`, go to the department page to call the next token.

## Project Structure
- `/server`: Backend API and Socket.IO logic.
- `/client`: React frontend application.
