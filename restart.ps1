# Restart and Seed Script for Windows PowerShell

Write-Host "🔄 Restarting WaitWise Backend..." -ForegroundColor Cyan

# Navigate to server directory
Set-Location -Path "c:\Users\lenovo\Desktop\WaitWise\server"

# Kill existing node processes (be careful with this!)
Write-Host "⚠️  Stopping existing server..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {$_.Path -like "*WaitWise*"} | Stop-Process -Force

# Wait a moment
Start-Sleep -Seconds 2

# Start the server in a new window
Write-Host "🚀 Starting server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd c:\Users\lenovo\Desktop\WaitWise\server; npm run dev"

# Wait for server to start
Write-Host "⏳ Waiting for server to start (10 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Seed the database
Write-Host "🌱 Seeding database..." -ForegroundColor Green
node seed.js

Write-Host ""
Write-Host "✅ Done! Server restarted and database seeded." -ForegroundColor Green
Write-Host ""
Write-Host "Login credentials:" -ForegroundColor Cyan
Write-Host "  Email: admin@waitwise.com" -ForegroundColor White
Write-Host "  Password: password123" -ForegroundColor White
Write-Host ""
Write-Host "Go to: http://localhost:5173/login" -ForegroundColor Cyan
