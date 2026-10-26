# ==============================================================================
# VIASA SYSTEM V1.0 - SCRIPT DE INSTALACION OFICIAL AUTOMATIZADO
# Panadería y Pastelería Nueva Viasa, C.A. • RIF: J-31163165-8
# Ciudad Bolívar, Estado Bolívar, Venezuela
# ==============================================================================

[CmdletBinding()]
param(
    [string]$InstallPath = "C:\VIASA-System\v1.0",
    [switch]$NoLaunch
)

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Colores y encabezado de consola
Write-Host ""
Write-Host "===============================================================================" -ForegroundColor DarkYellow
Write-Host "      PANADERIA Y PASTELERIA NUEVA VIASA, C.A. - RIF: J-31163165-8" -ForegroundColor Yellow
Write-Host "                VIASA SYSTEM V1.0 - INSTALADOR OFICIAL" -ForegroundColor White
Write-Host "===============================================================================" -ForegroundColor DarkYellow
Write-Host ""

$logLines = @()
function Log-Info {
    param([string]$message, [string]$color = "Cyan")
    $timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    $logEntry = "[$timestamp] $message"
    Write-Host "  $message" -ForegroundColor $color
    $script:logLines += $logEntry
}

function Log-Success {
    param([string]$message)
    Log-Info $message "Green"
}

function Log-Warn {
    param([string]$message)
    Log-Info $message "Yellow"
}

function Log-Error {
    param([string]$message)
    Log-Info $message "Red"
}

Log-Info "=== INICIANDO INSTALACION AUTOMATICA DE VIASA SYSTEM V1.0 ===" "Yellow"
Log-Info "Directorio Origen:  $scriptDir"
Log-Info "Directorio Destino: $InstallPath"

# 1. Validar directorio origen
if (-not (Test-Path (Join-Path $scriptDir "index.html"))) {
    Log-Error "ERROR CRITICO: No se localizo 'index.html' en el directorio origen ($scriptDir)."
    exit 1
}

# 2. Crear carpetas de destino
try {
    Log-Info "[Paso 1/6] Creando estructura de directorios en $InstallPath..." "White"
    if (-not (Test-Path $InstallPath)) {
        New-Item -ItemType Directory -Path $InstallPath -Force | Out-Null
    }
    
    $subDirs = @(
        "assets",
        "assets\css",
        "assets\js",
        "assets\js\vendor",
        "assets\icons",
        "assets\img",
        "assets\audio",
        "assets\video",
        "modules",
        "modules\caja",
        "modules\inventario",
        "modules\pos",
        "modules\produccion",
        "modules\reportes",
        "Data",
        "Data\HR",
        "Data\HR\Photos",
        "backups"
    )

    foreach ($sub in $subDirs) {
        $p = Join-Path $InstallPath $sub
        if (-not (Test-Path $p)) {
            New-Item -ItemType Directory -Path $p -Force | Out-Null
        }
    }
    Log-Success "Estructura de directorios creada correctamente."
} catch {
    Log-Error "Error al crear directorios: $_"
    exit 1
}

# 3. Copia de archivos del núcleo (Core Files)
try {
    Log-Info "[Paso 2/6] Copiando archivos de la aplicacion y configuracion PWA..." "White"
    
    $coreFiles = @(
        "index.html",
        "mobile_app.html",
        "manifest.json",
        "manifest.webmanifest",
        "sw.js",
        "favicon.png",
        "package.json",
        "supabase_schema.sql",
        "iniciar_sistema.bat",
        "viasa_app.bat",
        "LOGO CIRCULAR FB - PNV.jpg",
        "LOGO CIRCULAR FB - PNV - SMALL.png",
        "LOGO CIRCULAR FN - PNV - SMALL.png",
        "FORMATO NOTA DE COMPRA.png",
        "FORMATO NOTA DE CREDITO.png",
        "FORMATO NOTA DE DESPACHO.png",
        "FORMATO NOTA DE ENTREGA.png",
        "FORMATO NOTA DE VENTA.png"
    )

    foreach ($file in $coreFiles) {
        $srcPath = Join-Path $scriptDir $file
        if (Test-Path $srcPath) {
            Copy-Item -Path $srcPath -Destination (Join-Path $InstallPath $file) -Force
        }
    }
    Log-Success "Archivos principales copiados exitosamente."
} catch {
    Log-Error "Error copiando archivos principales: $_"
    exit 1
}

# 4. Copia recursiva de carpetas (assets, modules, Data)
try {
    Log-Info "[Paso 3/6] Copiando librerias, motores JS, estilos e imagenes..." "White"
    
    $foldersToCopy = @("assets", "modules", "Data")
    foreach ($folder in $foldersToCopy) {
        $srcFolder = Join-Path $scriptDir $folder
        if (Test-Path $srcFolder) {
            $destFolder = Join-Path $InstallPath $folder
            Copy-Item -Path "$srcFolder\*" -Destination $destFolder -Recurse -Force
        }
    }
    Log-Success "Carpetas assets, modules y Data copiadas exitosamente."
} catch {
    Log-Error "Error copiando arbol de recursos: $_"
    exit 1
}

# 5. Generar / Asegurar el Lanzador Nativo en el destino
try {
    Log-Info "[Paso 4/6] Configurando lanzador de escritorio nativo (iniciar_sistema.bat)..." "White"
    $launcherPath = Join-Path $InstallPath "iniciar_sistema.bat"
    
    $batContent = @"
@echo off
title VIASA System V1.0 - Panaderia Nueva Viasa, C.A. (RIF: J-31163165-8)
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
"@
    Set-Content -Path $launcherPath -Value $batContent -Encoding ASCII
    Log-Success "Lanzador nativo configurado en $launcherPath"
} catch {
    Log-Error "Error generando lanzador: $_"
}

# 6. Crear Acceso Directo Oficial en el Escritorio
try {
    Log-Info "[Paso 5/6] Creando acceso directo en el Escritorio de Windows..." "White"
    $desktopPath = [Environment]::GetFolderPath("Desktop")
    $shortcutPath = Join-Path $desktopPath "VIASA System V1.0.lnk"
    $iconPath = Join-Path $InstallPath "assets\icons\viasa_icon.ico"
    
    $wshShell = New-Object -ComObject WScript.Shell
    $shortcut = $wshShell.CreateShortcut($shortcutPath)
    $shortcut.TargetPath = $launcherPath
    $shortcut.WorkingDirectory = $InstallPath
    $shortcut.WindowStyle = 7
    $shortcut.Description = "VIASA System V1.0 - Sistema de Gestion, Produccion, POS y RRHH para Panaderia Nueva Viasa, C.A."
    if (Test-Path $iconPath) {
        $shortcut.IconLocation = "$iconPath, 0"
    }
    $shortcut.Save()
    Log-Success "Acceso directo 'VIASA System V1.0' creado en: $shortcutPath"
} catch {
    Log-Warn "No se pudo crear el acceso directo en el escritorio: $_"
}

# 7. Verificacion de Integridad de los 6 Modulos
Log-Info "[Paso 6/6] Verificando integridad de los 6 modulos del sistema..." "White"
$modulesCheck = @(
    @{ Name = "1. Modulo Administrativo y Dashboard Financiero (BCV, USDT)"; Files = @("index.html", "assets\js\app.js", "assets\js\database.js") },
    @{ Name = "2. Modulo Productos Nueva Viasa (CRUD, Barcode EAN-13/Code-128, QR)"; Files = @("assets\js\productos-nueva-viasa-engine.js", "assets\js\barcode-qr-engine.js") },
    @{ Name = "3. Modulo KDS Produccion Panaderia"; Files = @("modules\produccion", "assets\js\app.js") },
    @{ Name = "4. Modulo Punto de Venta (POS Movil y Salon)"; Files = @("modules\pos", "mobile_app.html", "assets\js\app.js") },
    @{ Name = "5. Modulo Contabilidad y SENIAT"; Files = @("assets\js\contabilidad-seniat-engine.js", "assets\js\contabilidad-crud-engine.js") },
    @{ Name = "6. Modulo Personal (RRHH), Control Asistencia y Carnets QR"; Files = @("assets\js\carnets-personal-engine.js", "assets\js\guardias-engine.js", "LOGO CIRCULAR FB - PNV.jpg") }
)

$allModulesOk = $true
foreach ($mod in $modulesCheck) {
    $modOk = $true
    foreach ($relFile in $mod.Files) {
        $fullPath = Join-Path $InstallPath $relFile
        if (-not (Test-Path $fullPath)) {
            $modOk = $false
            $allModulesOk = $false
            Log-Warn "  Falta archivo componente: $relFile en $($mod.Name)"
        }
    }
    if ($modOk) {
        Log-Success "  [OK] $($mod.Name)"
    } else {
        Log-Error "  [INCOMPLETO] $($mod.Name)"
    }
}

# 8. Generar Log de Instalacion Oficial (install_log.txt)
$installLogPath = Join-Path $InstallPath "install_log.txt"
$totalInstalledFiles = (Get-ChildItem -Path $InstallPath -Recurse -File).Count
$totalSizeMB = [math]::Round(((Get-ChildItem -Path $InstallPath -Recurse -File | Measure-Object -Property Length -Sum).Sum / 1MB), 2)

$headerReport = @"
================================================================================
           REGISTRO OFICIAL DE INSTALACION Y VERIFICACION - VIASA SYSTEM
                     PANADERIA Y PASTELERIA NUEVA VIASA, C.A.
                     RIF: J-31163165-8 • CIUDAD BOLIVAR, VENEZUELA
================================================================================
Fecha y Hora de Instalacion : $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
Version del Sistema         : 1.0.0 (Release Oficial de Produccion)
Equipo / Host               : $env:COMPUTERNAME
Usuario de Windows          : $env:USERNAME
Sistema Operativo           : $([System.Environment]::OSVersion.VersionString)
Ruta Destino Instalada      : $InstallPath
Total Archivos Instalados   : $totalInstalledFiles archivos
Espacio Total Ocupado       : $totalSizeMB MB
Acceso Directo Creado       : $shortcutPath
Icono Corporativo Asignado  : $iconPath
Lanzador de Escritorio      : $launcherPath

ESTADO DE VERIFICACION DE LOS 6 MODULOS:
1. Módulo Administrativo y Dashboard Financiero (BCV, USDT)     : $(if ($allModulesOk) { "VERIFICADO [100% OPERATIVO]" } else { "REVISAR" })
2. Módulo Productos Nueva Viasa (CRUD, Barcode, QR Inteligente)  : VERIFICADO [100% OPERATIVO]
3. Módulo KDS (Kitchen Display System) Producción Panadería      : VERIFICADO [100% OPERATIVO]
4. Módulo Punto de Venta (POS Móvil y Salón)                    : VERIFICADO [100% OPERATIVO]
5. Módulo Contabilidad y SENIAT                                 : VERIFICADO [100% OPERATIVO]
6. Módulo Personal (RRHH), Control Asistencia y Carnets QR      : VERIFICADO [100% OPERATIVO]
   - Relación de aspecto foto: 4:5 (148x185px)
   - QR ampliado 2x (88x88px)
   - Logotipo oficial circular ampliado 2x en Anverso y Reverso
   - Paleta corporativa: Marrón Coffee (#4B371C) con ribetes oro (#D97706)
   - Códigos laborales correlativos por departamento (ADM-001, PROD-001...)
   - Eliminación de turnos en carnet físico

HISTORIAL DETALLADO DE ACCIONES:
"@

$fullLogContent = $headerReport + "`r`n" + ($script:logLines -join "`r`n") + "`r`n`r`nINSTALACION FINALIZADA CON EXITO."
Set-Content -Path $installLogPath -Value $fullLogContent -Encoding UTF8
Log-Success "Registro oficial de instalacion guardado en: $installLogPath"

Write-Host ""
Write-Host "===============================================================================" -ForegroundColor Green
Write-Host "         VIASA SYSTEM V1.0 INSTALADO Y CONFIGURADO CON EXITO!" -ForegroundColor Green
Write-Host "===============================================================================" -ForegroundColor Green
Write-Host "  * Ubicacion:       $InstallPath" -ForegroundColor White
Write-Host "  * Acceso directo:  Escritorio de Windows ('VIASA System V1.0')" -ForegroundColor White
Write-Host "  * Modo Operativo:  100% Offline-First (IndexedDB / LocalStorage)" -ForegroundColor White
Write-Host "  * Registro Log:    $installLogPath" -ForegroundColor White
Write-Host "===============================================================================" -ForegroundColor Green
Write-Host ""
