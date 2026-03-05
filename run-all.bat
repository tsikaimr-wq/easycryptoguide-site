@echo off
setlocal

set "PORT=%~1"
if "%PORT%"=="" set "PORT=8000"

set "ROOT=%~dp0"
set "HOST=localhost"
set "BASE=http://%HOST%:%PORT%"
set "FRONT_URL=%BASE%/index.html"
set "ADMIN_URL=%BASE%/admin_login.html"
set "MOBILE_URL=%BASE%/mobile.html"

echo.
echo EasyCrypto one-click startup
echo Port  : %PORT%
echo Root  : %ROOT%
echo Front : %FRONT_URL%
echo Admin : %ADMIN_URL%
echo.

call :check_server
if errorlevel 1 (
    echo Local server is not running. Starting a new server window...
    start "EasyCrypto Server :%PORT%" cmd /k "cd /d ""%ROOT%"" && call server.bat %PORT%"
) else (
    echo Server already running on %BASE%
)

echo Waiting for server readiness...
call :wait_ready
if errorlevel 1 (
    echo.
    echo [ERROR] Server was not ready in time.
    echo Check the server window for errors, then retry:
    echo run-all.bat %PORT%
    exit /b 1
)

echo Opening frontend and admin pages...
start "" "%FRONT_URL%"
start "" "%ADMIN_URL%"

echo.
echo Done.
echo Frontend: %FRONT_URL%
echo Admin   : %ADMIN_URL%
echo Mobile  : %MOBILE_URL%
echo.
echo To stop server: close the "EasyCrypto Server :%PORT%" window.
exit /b 0

:check_server
powershell -NoProfile -ExecutionPolicy Bypass -Command "$u='%FRONT_URL%'; try { $r=Invoke-WebRequest -UseBasicParsing -Uri $u -TimeoutSec 2; if($r.StatusCode -ge 200 -and $r.StatusCode -lt 500){ exit 0 } else { exit 1 } } catch { exit 1 }"
exit /b %errorlevel%

:wait_ready
powershell -NoProfile -ExecutionPolicy Bypass -Command "$u='%FRONT_URL%'; $ok=$false; 1..60 | %% { try { $r=Invoke-WebRequest -UseBasicParsing -Uri $u -TimeoutSec 2; if($r.StatusCode -ge 200 -and $r.StatusCode -lt 500){ $ok=$true; break } } catch {}; Start-Sleep -Milliseconds 500 }; if($ok){ exit 0 } else { exit 1 }"
exit /b %errorlevel%
