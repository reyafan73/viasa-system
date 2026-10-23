@echo off
title VIASA SYSTEM - Actualizacion Automatica a la Nube
set PATH=C:\Users\Usuario\.gemini\antigravity\scratch\git-portable\cmd;C:\Program Files\GitHub CLI;C:\Users\Usuario\.gemini\antigravity\scratch\node-portable;%PATH%
cd /d "C:\Users\Usuario\.gemini\antigravity\scratch\VIASA_System"
echo ========================================================
echo   SUBIENDO CAMBIOS DE VIASA SYSTEM A LA NUBE (HTTPS)
echo ========================================================
git add .
git commit -m "chore(viasa): actualizacion automatica de VIASA SYSTEM"
git push origin main
echo.
echo [OK] Cambios publicados en: https://reyafan73.github.io/viasa-system/
pause
