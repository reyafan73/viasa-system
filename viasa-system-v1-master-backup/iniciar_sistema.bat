@echo off
title VIASA System V1.0 - Panaderia Nueva Viasa, C.A. (RIF: J-31163165-8)
cd /d "%~dp0"

echo ===============================================================================
echo   VIASA SYSTEM V1.0 - PANADERIA Y PASTELERIA NUEVA VIASA, C.A.
echo   RIF: J-31163165-8 - Ciudad Bolivar, Venezuela
echo   Iniciando entorno local de escritorio...
echo ===============================================================================

:: 1. Intentar Google Chrome en modo aplicacion de escritorio (--app)
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --app="file:///%~dp0index.html" --window-size=1440,900
    exit /b 0
)
if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --app="file:///%~dp0index.html" --window-size=1440,900
    exit /b 0
)

:: 2. Intentar Microsoft Edge en modo aplicacion de escritorio (--app)
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --app="file:///%~dp0index.html" --window-size=1440,900
    exit /b 0
)
if exist "C:\Program Files\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files\Microsoft\Edge\Application\msedge.exe" --app="file:///%~dp0index.html" --window-size=1440,900
    exit /b 0
)

:: 3. Fallback al navegador predeterminado del sistema
start "" "%~dp0index.html"
exit /b 0
