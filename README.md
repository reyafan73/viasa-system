# 🥖 VIASA SYSTEM - Panadería y Pastelería Nueva Viasa
**Sistema Integral de Gestión Administrativa, Operativa, Producción y Punto de Venta (POS)**

---

## 🏢 1. Identidad Institucional y Propósito
**VIASA System** es la plataforma tecnológica de alta eficiencia diseñada a la medida para la **Panadería y Pastelería Nueva Viasa**. Controla el ciclo completo del negocio:
1. **Punto de Venta (POS) y Facturación Rápida:** Atención en mostrador, despacho de panes, pasteles, víveres, cafetería y charcutería en bolívares, divisas (USD/COP) y métodos electrónicos (Pago Móvil, Biopago, Zelle, Tarjeta).
2. **Producción y Fórmulas Panaderas:** Control de sacos de harina procesados, recetas base, porcentaje panadero, rendimiento de masa, horneado y control de mermas.
3. **Inventario y Materia Prima:** Harinas, grasas, levaduras, mejoradores, azúcar, quesos, embutidos y productos terminados.
4. **Caja y Tesorería:** Apertura, control de arqueo por turno, tasa de cambio diaria (BCV / Paralelo), egresos y cierre ciego de caja.
5. **Reportes Gerenciales y Analítica:** Márgenes de ganancia por producto, histórico de ventas y alertas de stock crítico.

---

## 🛡️ 2. Aislamiento Absoluto de Entorno (Sandbox Architecture)
Para evitar cualquier contaminación cruzada con otros sistemas:
- **Prefijo de Almacenamiento Local:** `viasa_sys_*`
- **Base de Datos Indexada (IndexedDB):** `VIASA_SYSTEM_DB_v1`
- **Canal de Broadcast:** `viasa_sys_channel`
- **Scope de Service Worker PWA:** `./` dentro de `/VIASA_System/`
- **Cero dependencias compartidas:** Todos los assets, estilos, scripts y bases de datos son autónomos e independientes.

---

## 📂 3. Estructura Modular del Proyecto
```text
VIASA_System/
├── assets/
│   ├── css/
│   │   └── main.css             # Estilos UI modernos, tema panadería cálido y modo nocturno
│   ├── js/
│   │   ├── storage-engine.js   # Motor de persistencia aislado (IndexedDB + LocalStorage Sandbox)
│   │   ├── database.js         # Estructura inicial, catálogo de productos, recetas y tasas
│   │   ├── audio-engine.js     # Sonidos interactivos y alertas del POS
│   │   └── app.js              # Controlador principal de interfaz y navegación
│   └── icons/                  # Iconografía PWA
├── modules/                     # Módulos especializados (POS, Inventario, Producción, Caja, Reportes)
├── manifest.json               # Manifiesto PWA instalable
├── sw.js                       # Service Worker con soporte Offline First
├── index.html                  # Shell de aplicación y consola operativa
└── README.md                   # Documentación técnica
```
