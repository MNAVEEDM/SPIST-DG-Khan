@echo off
REM ---------------------------------------------------------------------------
REM  SPIST admissions API - supervised launcher
REM
REM  The website (Vite, port 5173) is useless without this server: login,
REM  signup, applications, uploads and the fee voucher all go through it. It
REM  kept ending up not running because it lived in a terminal somebody closed
REM  or reused, so this runs it detached and restarts it if it ever stops.
REM
REM  Output goes to server\api.log so a crash leaves evidence behind.
REM
REM  Started automatically by the "SPIST Admissions API" scheduled task at
REM  logon. Can also be double-clicked to run it by hand.
REM ---------------------------------------------------------------------------

cd /d "%~dp0"

:loop
echo. >> "%~dp0api.log"
echo ===== starting %DATE% %TIME% ===== >> "%~dp0api.log"
node src/index.js >> "%~dp0api.log" 2>&1
echo ===== stopped  %DATE% %TIME% (restarting in 5s) ===== >> "%~dp0api.log"
timeout /t 5 /nobreak >nul
goto loop
