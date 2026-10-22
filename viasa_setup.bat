@echo off
title Instalador VIASA System - Panaderia y Pasteleria Nueva Viasa, C.A.
color 0A
cls
echo ===============================================================================
echo      PANADERIA Y PASTELERIA NUEVA VIASA, C.A. - VIASA SYSTEM
echo               INSTALADOR NATIVO DE ESCRITORIO PARA WINDOWS
echo ===============================================================================
echo.
echo [1/4] Identificando directorio de instalacion local...
set APP_DIR=%~dp0
echo Carpeta origen: %APP_DIR%
echo.

echo [2/4] Verificando componentes del sistema y motor offline-first...
if not exist "%APP_DIR%index.html" (
    color 0C
    echo ERROR: No se encontro index.html en el directorio.
    pause
    exit /b 1
)
echo Componentes verificados con exito.
echo.

echo [3/4] Generando acceso directo en el Escritorio con icono oficial...
powershell -ExecutionPolicy Bypass -File "%APP_DIR%viasa_setup.ps1"
echo.

echo [4/4] Instalacion y configuracion completada exitosamente!
echo.
echo ===============================================================================
echo   El acceso directo "VIASA System" ha sido creado en su Escritorio.
echo   La aplicacion funcionara 100%% offline con base de datos local y backup.
echo ===============================================================================
echo.
echo Presione cualquier tecla para abrir VIASA System ahora mismo...
pause >nul
start "" "%APP_DIR%viasa_app.bat"
exit /b 0
