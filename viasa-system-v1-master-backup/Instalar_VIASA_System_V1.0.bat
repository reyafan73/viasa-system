@echo off
title Instalador Oficial VIASA System V1.0 - Panaderia Nueva Viasa, C.A.
color 0E
cls
echo ===============================================================================
echo      PANADERIA Y PASTELERIA NUEVA VIASA, C.A. - RIF: J-31163165-8
echo           INSTALADOR OFICIAL DE PRODUCCION - VIASA SYSTEM V1.0
echo                     CIUDAD BOLIVAR, ESTADO BOLIVAR
echo ===============================================================================
echo.
echo Iniciando proceso de instalacion automatizada en C:\VIASA-System\v1.0...
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0setup-installer.ps1"
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo.
    echo ===============================================================================
    echo ERROR: Ocurrio un fallo durante la ejecucion del instalador.
    echo Revise los mensajes de error mostrados arriba.
    echo ===============================================================================
    pause
    exit /b %ERRORLEVEL%
)

color 0A
echo.
echo ===============================================================================
echo  Presione cualquier tecla para iniciar VIASA System V1.0 ahora mismo...
echo  (o cierre esta ventana si prefiere iniciarlo mas tarde desde el Escritorio)
echo ===============================================================================
pause >nul

if exist "C:\VIASA-System\v1.0\iniciar_sistema.bat" (
    start "" "C:\VIASA-System\v1.0\iniciar_sistema.bat"
) else (
    start "" "%~dp0iniciar_sistema.bat"
)
exit /b 0
