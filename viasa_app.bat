@echo off
title VIASA System - Panaderia y Pasteleria Nueva Viasa, C.A.
cd /d "%~dp0"

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
