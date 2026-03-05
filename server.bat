@echo off
setlocal
set PORT=%~1
if "%PORT%"=="" set PORT=8000

echo Starting EasyCrypto local server...
echo URL: http://localhost:%PORT%/index.html
echo Admin: http://localhost:%PORT%/admin_login.html
echo Mobile: http://localhost:%PORT%/mobile.html
echo Press Ctrl+C to stop.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\dev-server.ps1" -Port %PORT%
