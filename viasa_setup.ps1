# ==============================================================================
# VIASA SYSTEM - POWERSHELL SETUP & DESKTOP SHORTCUT CREATOR
# Panadería y Pastelería Nueva Viasa, C.A. - RIF: J-30485920-1
# ==============================================================================

$ErrorActionPreference = "SilentlyContinue"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$desktopPath = [Environment]::GetFolderPath("Desktop")
$shortcutPath = Join-Path $desktopPath "VIASA System.lnk"
$targetPath = Join-Path $scriptDir "viasa_app.bat"
$iconPath = Join-Path $scriptDir "assets\icons\viasa_icon.ico"
$pngIconPath = Join-Path $scriptDir "assets\img\viasa_isotipo_clean.png"

# Asegurar la existencia del icono .ico si no existe
if (-not (Test-Path $iconPath)) {
    $iconsDir = Join-Path $scriptDir "assets\icons"
    if (-not (Test-Path $iconsDir)) {
        New-Item -ItemType Directory -Path $iconsDir -Force | Out-Null
    }
    
    # Intentar generar .ico desde el PNG usando System.Drawing
    try {
        Add-Type -AssemblyName System.Drawing
        if (Test-Path $pngIconPath) {
            $bmp = [System.Drawing.Bitmap]::FromFile($pngIconPath)
            $thumb = New-Object System.Drawing.Bitmap $bmp, (New-Object System.Drawing.Size(256, 256))
            $iconHandle = $thumb.GetHicon()
            $icon = [System.Drawing.Icon]::FromHandle($iconHandle)
            $fs = New-Object System.IO.FileStream($iconPath, [System.IO.FileMode]::Create)
            $icon.Save($fs)
            $fs.Close()
            $thumb.Dispose()
            $bmp.Dispose()
        }
    } catch {
        # Si falla System.Drawing, se usa el fallback sin icono específico
    }
}

# Crear acceso directo en el Escritorio
try {
    $wshShell = New-Object -ComObject WScript.Shell
    $shortcut = $wshShell.CreateShortcut($shortcutPath)
    $shortcut.TargetPath = $targetPath
    $shortcut.WorkingDirectory = $scriptDir
    $shortcut.WindowStyle = 7
    $shortcut.Description = "VIASA System - Sistema Gerencial y POS Offline para Panadería Nueva Viasa"
    if (Test-Path $iconPath) {
        $shortcut.IconLocation = "$iconPath, 0"
    }
    $shortcut.Save()
    Write-Host " Acceso directo creado exitosamente en: $shortcutPath" -ForegroundColor Green
} catch {
    Write-Host " Error al crear el acceso directo: $_" -ForegroundColor Red
}
