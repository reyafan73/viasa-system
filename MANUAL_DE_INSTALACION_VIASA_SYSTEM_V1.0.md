# MANUAL OFICIAL DE INSTALACIÓN Y DESPLIEGUE - VIASA SYSTEM V1.0
## Panadería y Pastelería Nueva Viasa, C.A. • RIF: J-31163165-8
### Ciudad Bolívar, Estado Bolívar, Venezuela

---

## 1. FICHA TÉCNICA DEL SISTEMA

| Parámetro | Especificación |
| :--- | :--- |
| **Nombre Oficial** | **VIASA SYSTEM** |
| **Versión de Lanzamiento** | **1.0.0 (Release Oficial de Producción)** |
| **Razón Social** | **Panadería y Pastelería Nueva Viasa, C.A.** |
| **Número de RIF** | **J-31163165-8** |
| **Ubicación Geográfica** | **Ciudad Bolívar, Estado Bolívar, Venezuela** |
| **Arquitectura de Software** | **Progressive Web App (PWA) de Escritorio Offline-First** |
| **Persistencia de Datos** | **IndexedDB Local Storage de alta velocidad + Respaldo Cloud Opcional (Supabase)** |
| **Motores Vectoriales** | **Generador Nativo de Código de Barras (EAN-13 / Code-128) y Códigos QR 2D** |
| **Dependencias de Red** | **Cero (0) dependencias externas para operar; 100% operativo sin Internet** |
| **Ruta Estándar de Instalación** | `C:\VIASA-System\v1.0` |

---

## 2. REQUISITOS DEL SISTEMA

### 2.1. Requisitos de Hardware
* **Procesador (CPU):** Intel Core i3, AMD Ryzen 3 o cualquier CPU de doble núcleo a 2.0 GHz o superior.
* **Memoria RAM:** Mínimo 4 GB (Recomendado 8 GB para terminales de caja o multitarea).
* **Almacenamiento:** Mínimo 500 MB de espacio libre en disco (La aplicación instalada ocupa aproximadamente 42 MB).
* **Resolución de Pantalla:** Mínimo 1366 × 768 píxeles (Recomendado 1920 × 1080 Full HD).

### 2.2. Periféricos Soportados
* **Lectores de Códigos de Barras / QR:** Cualquier lector láser o imager óptico USB / Bluetooth (configurado en emulación de teclado).
* **Impresoras de Tickets:** Impresoras térmicas de 58mm o 80mm compatibles con ESC/POS (USB o Serial).
* **Impresoras Fiscales (Venezuela):** Homologadas para SENIAT (Aclas CR2050, Bixolon, Bematech).
* **Impresoras de Etiquetas:** Zebra, Xprinter, TSC o impresoras láser/inyección con papel autoadhesivo para stickers de productos o carnets PVC.
* **Gaveta de Dinero (Cash Drawer):** Apertura automática por pulso de impresora térmica (RJ11).

### 2.3. Requisitos de Software
* **Sistema Operativo:** Microsoft Windows 10 (todas las ediciones de 32 o 64 bits) o Windows 11.
* **Navegador Motor:** Microsoft Edge (preinstalado en Windows) o Google Chrome (versión 90+).
* **Privilegios de Usuario:** Usuario estándar de Windows (no requiere privilegios elevados de Administrador de dominio).

---

## 3. INSTALACIÓN AUTOMATIZADA PASO A PASO

### Método 1: Instalación Express por Doble Clic (Recomendado)
1. Localice la carpeta del instalador o descomprima el paquete oficial de instalación.
2. Haga doble clic sobre el archivo ejecutable:
   ```text
   Instalar_VIASA_System_V1.0.bat
   ```
3. El instalador abrirá una ventana de consola corporativa de color dorado/ámbar y ejecutará automáticamente los siguientes pasos:
   - Verificación del árbol de código fuente y motores JS.
   - Creación del directorio de producción: `C:\VIASA-System\v1.0`.
   - Copia de todos los módulos, imágenes oficiales (`LOGO CIRCULAR FB - PNV.jpg`), estilos y bases de datos.
   - Creación del lanzador de escritorio independiente `iniciar_sistema.bat`.
   - Creación del **Acceso Directo Oficial en el Escritorio de Windows** denominado **"VIASA System V1.0"** con el isotipo de Panadería Nueva Viasa.
   - Verificación de integridad de los 6 módulos principales.
   - Registro del informe de instalación en `C:\VIASA-System\v1.0\install_log.txt`.
4. Al finalizar, presione cualquier tecla para iniciar inmediatamente **VIASA System V1.0** en modo de aplicación de escritorio sin barras de navegación.

### Método 2: Instalación vía PowerShell (Para Administradores TI)
Abra PowerShell en la carpeta raíz y ejecute:
```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\setup-installer.ps1
```
Si desea especificar una ruta de instalación personalizada diferente a la predeterminada:
```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\setup-installer.ps1 -InstallPath "D:\Sistemas\VIASA"
```

---

## 4. ESTRUCTURA DE DIRECTORIOS EN PRODUCCIÓN

Una vez completada la instalación, la carpeta `C:\VIASA-System\v1.0` contendrá la siguiente arquitectura organizada:

```text
C:\VIASA-System\v1.0\
│
├── index.html                           # Aplicación principal de escritorio (ERP / POS / KDS / RRHH)
├── mobile_app.html                      # Interfaz optimizada para terminales móviles y tablets
├── iniciar_sistema.bat                  # Lanzador nativo en modo aplicación de escritorio (--app)
├── viasa_app.bat                        # Lanzador alternativo de compatibilidad
├── install_log.txt                      # Registro de auditoría y certificación de la instalación
├── manifest.json                        # Manifiesto de aplicación web progresiva (PWA)
├── sw.js                                # Service Worker para caché offline 100% desconectado
├── package.json                         # Configuración y metadatos de versión 1.0.0
├── supabase_schema.sql                  # Estructura SQL relacional para respaldo en la nube
│
├── LOGO CIRCULAR FB - PNV.jpg           # Logotipo oficial circular en alta resolución (2x)
├── LOGO CIRCULAR FB - PNV - SMALL.png   # Logotipo optimizado para membretes y reportes
├── favicon.png                          # Favicon de la aplicación
│
├── assets\
│   ├── css\                             # Hojas de estilo corporativas y diseño responsivo
│   ├── js\                              # Motores de lógica comercial y bases de datos
│   │   ├── app.js                       # Controlador principal y orquestador del sistema
│   │   ├── database.js                  # Almacén de datos local reactivo (IndexedDB)
│   │   ├── productos-nueva-viasa-engine.js # Motor de catálogo, trazabilidad y mermas
│   │   ├── barcode-qr-engine.js         # Generador nativo EAN-13, Code-128 y QR
│   │   ├── carnets-personal-engine.js   # Generador de carnets corporativos y control RRHH
│   │   ├── guardias-engine.js           # Motor de asignación de personal y guardias
│   │   ├── contabilidad-seniat-engine.js # Motor de libros fiscales, IVA e ISLR
│   │   ├── contabilidad-crud-engine.js  # Motor de asientos contables y compras
│   │   ├── excel-migration-assistant.js # Asistente de importación/exportación XLSX
│   │   ├── storage-engine.js            # Motor de almacenamiento offline persistente
│   │   └── supabase-cloud.js            # Conector de sincronización con la nube
│   ├── icons\
│   │   ├── viasa_icon.ico               # Ícono de Windows para accesos directos
│   │   └── icon-192.png, icon-512.png   # Íconos PWA en resoluciones estándar
│   ├── img\                             # Isotipos, logotipos vectoriales e imágenes de muestra
│   ├── audio\                           # Efectos de sonido para escaneo y alertas KDS
│   └── video\                           # Material audiovisual e introducciones
│
├── modules\                             # Módulos específicos (caja, inventario, pos, produccion)
├── Data\                                # Datos locales de respaldo y fotos de personal
└── backups\                             # Carpeta destinada a respaldos periódicos JSON/ZIP
```

---

## 5. AUDITORÍA Y VERIFICACIÓN DE LOS 6 MÓDULOS PRINCIPALES

Tras iniciar **VIASA System V1.0**, verifique el correcto funcionamiento de cada uno de los 6 módulos:

### Módulo 1: Dashboard Administrativo y Financiero
* **Funcionalidad:** Visualización de tasas de cambio oficiales en tiempo real (Tasa BCV oficial y Tasa USDT / Paralelo).
* **Operación:** Verifique en el panel superior derecho que las tasas se encuentren actualizadas. El sistema recalcula automáticamente todos los precios en Bolívares y Divisas.
* **Caja Chica y Ventas:** El panel central muestra el flujo de ingresos diario, arqueo de caja y botón para **Cierre Z / Cierre X**.

### Módulo 2: Productos Nueva Viasa (CRUD, Códigos de Barras y QR)
* **Funcionalidad:** Gestión del catálogo de panes, pasteles, charcutería y bebidas de Panadería Nueva Viasa, C.A.
* **Códigos de Barras Automáticos:** Generación de códigos comerciales venezolanos **EAN-13 (prefijo 759)** con cálculo algorítmico del dígito verificador y códigos internos **Code-128** (`NV-0001`).
* **Códigos QR de Trazabilidad 360:** Generación de matrices QR con payload estructurado conteniendo: *Nombre del Producto, SKU, Lote, Fecha de Elaboración, Vencimiento, Precios Ref. USD/Bs. y RIF J-31163165-8*.
* **Carga de Imágenes Propias:** Botones dedicados para subir archivos de imagen (`.png`, `.jpg`, `.svg`) si el producto ya cuenta con un código histórico impreso en su empaque, con opción de restaurar el generador automático en cualquier momento.
* **Trazabilidad y Mermas (Art. 177):** Registro de productos dados de baja por vencimiento o merma de producción con justificación legal ante fiscalizaciones.
* **Estudio de Impresión:** Generación e impresión de plantillas de stickers térmicos adhesivos en papel continuo o troquelado.

### Módulo 3: KDS (Kitchen Display System) - Producción de Panadería
* **Funcionalidad:** Pantalla de cocina para maestros panaderos y reposteros.
* **Operación:** Muestra las órdenes en preparación organizadas por estados (*En Espera, Amasado, Fermentación, En Horno, Listo para Despacho*).
* **Alertas Sonoras:** Emite un aviso acústico cuando entra un nuevo lote de producción o cuando un tiempo de cocción ha concluido.

### Módulo 4: Punto de Venta (POS Salón y POS Móvil)
* **Funcionalidad:** Facturación en barra, mostrador y mesas.
* **Integración con Escáner:** Permite el escaneo directo de códigos de barras (EAN-13 / Code-128) para agregar productos al carrito en milisegundos.
* **Pagos Multidivisa:** Soporta cobros mixtos (Ej: Efectivo USD + Pago Móvil Bs. + Punto de Venta Débito).
* **Impresión:** Salida configurada para tickets térmicos ESC/POS e impresoras fiscales SENIAT.

### Módulo 5: Contabilidad Integral y Facturación SENIAT
* **Funcionalidad:** Cumplimiento tributario venezolano para Panadería Nueva Viasa, C.A.
* **Reportes Fiscales:** Generación automática del **Libro de Ventas** y **Libro de Compras** según providencias del SENIAT.
* **Retenciones:** Asistente de cálculo de retenciones de IVA (75% o 100%) y retenciones de ISLR con exportación en formato TXT para carga masiva en el portal fiscal.
* **Migración:** Asistente Excel (.xlsx) para importar listas de precios y proveedores sin reescribir información.

### Módulo 6: Personal (RRHH), Control de Asistencia y Carnets QR
* **Funcionalidad:** Gestión integral de los empleados y obreros de Panadería Nueva Viasa, C.A.
* **Especificaciones del Carnet Físico:**
  - **Dimensiones:** Formato estándar ID-1 (CR-80: 85.6 mm × 53.98 mm) apto para PVC o laminado térmico.
  - **Logotipo Oficial Circular:** Presente en **Anverso (Frente)** y **Reverso (Dorso)** al **doble de tamaño (2x)** con nitidez vectorial.
  - **Fotografía del Trabajador:** Duplicada de tamaño (2x) con **relación de aspecto exacta 4:5** (`148px × 185px`), marco dorado y bordes redondeados.
  - **Código QR Único:** Matriz 2D ampliada (2x: `88px × 88px`) en el anverso con token criptográfico intransferible `NV-EMP-{AREA}-{CEDULA}-{HASH}`.
  - **Paleta Cromática:** Banda superior e inferior en **Marrón Coffee Corporativo (`#4B371C`)** con filetes dorados (`#D97706`) y textos de alto contraste.
  - **Códigos Laborales Correlativos:** Asignación secuencial por departamento:
    - Administración: `ADM-001`, `ADM-002`, etc.
    - Ventas y Caja: `VNT-001`, `VNT-002`, etc.
    - Producción y Panadería: `PROD-001`, `PROD-002`, etc.
    - Logística y Despacho: `LOG-001`, `LOG-002`, etc.
    - Mantenimiento y Servicios: `MNT-001`, `MNT-002`, etc.
  - **Eliminación de Turnos:** Las menciones a "Turno" fueron suprimidas de la cara visible del carnet para mantener una vigencia permanente sin reimpresiones por rotación de horarios.
* **Seguridad y Extravíos:** Botón de **Regeneración de Token QR** que invalida de forma inmediata el carnet anterior si un trabajador extravía su credencial.

---

## 6. CONFIGURACIÓN Y DESPLIEGUE MULTI-TERMINAL (RED LOCAL)

Para operar **VIASA System** en múltiples computadoras dentro de las instalaciones de Panadería Nueva Viasa (Ciudad Bolívar):

```
                       ┌─────────────────────────────────────────┐
                       │   TERMINAL 1: SERVIDOR / PC PRINCIPAL   │
                       │   (Administración, Contabilidad, RRHH)   │
                       │   IP Local: 192.168.1.100 : Puerto 3000 │
                       └────────────────────┬────────────────────┘
                                            │
                    ┌───────────────────────┴───────────────────────┐
                    │                                               │
      ┌─────────────▼─────────────┐                   ┌─────────────▼─────────────┐
      │ TERMINAL 2: CAJA / POS 1  │                   │ TERMINAL 3: KDS PRODUCCIÓN│
      │ (Facturación, Lector EAN) │                   │ (Cocina, Hornos, Despacho)│
      └───────────────────────────┘                   └───────────────────────────┘
```

### Configuración del Servidor (Terminal 1)
1. Instale el sistema en `C:\VIASA-System\v1.0`.
2. Para compartir el sistema en red local mediante HTTP estático:
   - Abra una consola de comandos en `C:\VIASA-System\v1.0`.
   - Ejecute el servidor local ligero:
     ```cmd
     npx --yes serve . -l 3000
     ```
   - O bien comparta la carpeta en red mediante permisos estándar de Windows (SMB).

### Conexión desde las Terminales de Caja (Terminal 2 y 3)
1. Desde la computadora de la Caja o Pantalla de Producción, abra el navegador y apunte a la IP de la máquina principal:
   ```text
   http://192.168.1.100:3000
   ```
2. Haga clic en el ícono de instalación de PWA en la barra de direcciones de Chrome/Edge ("Instalar VIASA System").
3. El sistema se guardará localmente y se ejecutará de forma independiente como una aplicación nativa.

---

## 7. POLÍTICAS DE RESPALDO, SEGURIDAD Y MANTENIMIENTO

### 7.1. Respaldo Maestro Consolidado
El código fuente íntegro, recursos y documentación han sido respaldados en la carpeta:
```text
/viasa-system-v1-master-backup/
```
Esta carpeta contiene el archivo `BACKUP_INFO.json` con las sumas de verificación SHA-256 de cada archivo crítico para garantizar que ningún módulo haya sido alterado.

### 7.2. Respaldo Periódico de la Base de Datos Local
1. Ingrese a **VIASA System** con el perfil de Administrador.
2. Vaya a **Módulo Administrativo -> Configuración del Sistema -> Respaldo de Datos**.
3. Haga clic en **"Exportar Base de Datos Completa (JSON)"**.
4. Guarde el archivo generado en una unidad flash USB externa o disco secundario. Se recomienda realizar este respaldo al finalizar la jornada laboral diaria.

### 7.3. Restauración de Datos
Si se requiere reinstalar el equipo o reemplazar un disco duro:
1. Ejecute `Instalar_VIASA_System_V1.0.bat` en la nueva máquina.
2. Abra **VIASA System V1.0**.
3. Vaya a **Configuración -> Importar Base de Datos** y seleccione el archivo `.json` del último respaldo diario.
4. Todos los productos, ventas históricas, clientes y registros de personal quedarán restaurados inmediatamente.

---

## 8. CONTACTO Y SOPORTE TÉCNICO

* **Organización:** Panadería y Pastelería Nueva Viasa, C.A.
* **Registro de Información Fiscal (RIF):** J-31163165-8
* **Sistema:** VIASA System v1.0
* **Desarrollado y Ensamblado para:** Ciudad Bolívar, Estado Bolívar, República Bolivariana de Venezuela.
