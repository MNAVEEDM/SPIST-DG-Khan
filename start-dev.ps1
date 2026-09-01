# Starts both halves of the SPIST dev setup, each in its own window.
#
# They have to run at the same time: the website (Vite, port 5173) talks to the
# admissions API (Express, port 5000) for login, applications and uploads.
# Running them in one terminal does not work, because the first one blocks it,
# so starting the second just stops the first. The site then reports
# "Could not reach the admissions server".
#
# Kept to plain ASCII on purpose: Windows PowerShell 5.1 reads a UTF-8 file
# without a BOM as ANSI, which turns characters like an em dash into bytes that
# break string quoting.
#
# Usage:  npm run dev:all      (or right-click this file, Run with PowerShell)

$root = $PSScriptRoot

Write-Host "Starting admissions API (port 5000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList '-NoExit', '-Command', "Set-Location '$root\server'; npm run dev"

Start-Sleep -Seconds 2

Write-Host "Starting SPIST website (port 5173)..." -ForegroundColor Green
Start-Process powershell -ArgumentList '-NoExit', '-Command', "Set-Location '$root'; npm run dev"

Write-Host ""
Write-Host "Two windows opened. Leave both running." -ForegroundColor Cyan
Write-Host "  Website : http://localhost:5173" -ForegroundColor Cyan
Write-Host "  API     : http://localhost:5000/api/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "The API has no homepage of its own, so opening localhost:5000 in a"
Write-Host "browser shows 'Cannot GET /'. That is normal."
