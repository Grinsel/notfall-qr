@echo off
echo ============================================
echo   Notfall-QR - Lokaler Entwicklungsserver
echo ============================================
echo.

cd /d "%~dp0notfall-qr"

echo [1/2] Installiere Abhaengigkeiten...
call npm install
if %ERRORLEVEL% neq 0 (
    echo FEHLER: npm install fehlgeschlagen!
    pause
    exit /b 1
)

echo.
echo [2/2] Starte Entwicklungsserver...
echo.
echo   Seite erreichbar unter: http://localhost:3000
echo   Beenden mit: Strg+C
echo.
call npm run dev
