# Same as start-dev.ps1, but the API runs against a MongoDB on this machine
# instead of MongoDB Atlas, so no connection string is needed.
#
# The local database starts out EMPTY: accounts that exist in Atlas are not
# in it, so sign up once. Its data lives in server\.local-db and survives a
# restart. To use the real admissions data instead, put the Atlas string in
# server\.env as MONGODB_URI and run "npm run dev:all".
#
# Kept to plain ASCII on purpose: Windows PowerShell 5.1 reads a UTF-8 file
# without a BOM as ANSI, which breaks string quoting on characters like an
# em dash.
#
# Usage:  npm run dev:all:local

$root = $PSScriptRoot

Write-Host "Starting admissions API with local MongoDB (port 5000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList '-NoExit', '-Command', "Set-Location '$root\server'; npm run dev:localdb"

Start-Sleep -Seconds 3

Write-Host "Starting SPIST website (port 5173)..." -ForegroundColor Green
Start-Process powershell -ArgumentList '-NoExit', '-Command', "Set-Location '$root'; npm run dev"

Write-Host ""
Write-Host "Two windows opened. Leave both running." -ForegroundColor Cyan
Write-Host "  Website : http://localhost:5173" -ForegroundColor Cyan
Write-Host "  API     : http://localhost:5000/api/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "The database is empty, so create a new account on the Apply page."
