@echo off
echo Restarting WaitWise Backend...
echo.

cd /d c:\Users\lenovo\Desktop\WaitWise\server

echo Stopping existing server...
taskkill /F /IM node.exe 2>nul

timeout /t 2 /nobreak >nul

echo Starting server...
start "WaitWise Server" cmd /k "npm run dev"

timeout /t 10 /nobreak

echo Seeding database...
node seed.js

echo.
echo Done! Server restarted and database seeded.
echo.
echo Login credentials:
echo   Email: admin@waitwise.com
echo   Password: password123
echo.
echo Go to: http://localhost:5173/login
pause
