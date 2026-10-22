/**
 * ==============================================================================
 * VIASA SYSTEM - BASE DE DATOS INICIAL Y CATÁLOGO OPERATIVO
 * Panadería y Pastelería Nueva Viasa, C.A.
 * ==============================================================================
 */

(function(window) {
    'use strict';

    const VIASA_CATALOGO_INICIAL = {
        empresa: {
            nombre: "Panadería Nueva Viasa, C.A.",
            rif: "J-31163165-8",
            direccion: "Av. San Salvador c/c Calle Colón, Edificio Portugal, Planta Baja, Locales 1 y 2, La Sabanita, Ciudad Bolívar, Estado Bolívar, Venezuela",
            telefono: "0424-9182345",
            monedaBase: "USD",
            tasaBCV: 36.85,
            tasaParalelo: 39.50,
            tasaCOP: 3900.00,
            serialFiscal: "BGF-948201",
            ivaPorcentaje: 16.0,
            numeroControlActual: 1042
        },

        roles: {
            master_senior: {
                id: 'master_senior',
                nivel: 1,
                nombre: 'Nivel 1: Master Senior',
                badge: 'MASTER SENIOR',
                color: '#f59e0b',
                descripcion: 'Acceso total e ilimitado al sistema, datos encriptados, auditorías y control estructural.',
                permisos: ['*']
            },
            omega: {
                id: 'omega',
                nivel: 2,
                nombre: 'Nivel 2: OMEGA (Gerencia General y Administrativa)',
                badge: 'OMEGA - GERENCIA',
                color: '#3b82f6',
                descripcion: 'Gerencia General, Gerencia Administrativa, Finanzas, Nómina, SENIAT, Respaldos y Gestión de Usuarios.',
                permisos: ['dashboard', 'pos', 'cafetin', 'inventario', 'produccion', 'activos', 'proveedores', 'crm', 'caja', 'contabilidad', 'reportes', 'configuracion', 'usuarios', 'casillero-respaldos', 'kiosco', 'kds', 'pos_movil', 'rrhh', 'delivery', 'compras_predictivas', 'auditoria_crypto', 'documentos', 'banco_memoria', 'guardias-hub']
            },
            sigma: {
                id: 'sigma',
                nivel: 3,
                nombre: 'Nivel 3: SIGMA (Supervisión y Coordinación)',
                badge: 'SIGMA - SUPERVISOR',
                color: '#a855f7',
                descripcion: 'Jefes de Producción, Supervisores de Planta, Control Operativo y KDS.',
                permisos: ['dashboard', 'cafetin', 'produccion', 'activos', 'inventario', 'kds', 'rrhh', 'delivery', 'compras_predictivas', 'guardias-hub', 'crm']
            },
            kappa: {
                id: 'kappa',
                nivel: 4,
                nombre: 'Nivel 4: KAPPA (Cajeros y Front-Desk)',
                badge: 'KAPPA - CAJERO',
                color: '#10b981',
                descripcion: 'Cajeros, Atención en Mostrador, Facturación Multidivisa, Arqueos y Split y Pay.',
                permisos: ['dashboard', 'pos', 'cafetin', 'caja', 'crm', 'kiosco', 'pos_movil', 'documentos', 'banco_memoria']
            },
            alfa: {
                id: 'alfa',
                nivel: 5,
                nombre: 'Nivel 5: ALFA (Personal Operativo y Campo)',
                badge: 'ALFA - OPERATIVO',
                color: '#06b6d4',
                descripcion: 'Personal Operativo, Despachos, Mesoneros, Marcaje Móvil y Logística.',
                permisos: ['dashboard', 'guardias-hub', 'pos_movil', 'kds']
            },
            // Aliases de retrocompatibilidad
            admin: {
                id: 'master_senior',
                nivel: 1,
                nombre: 'Master Senior (Admin)',
                badge: 'MASTER SENIOR',
                color: '#f59e0b',
                permisos: ['*']
            },
            caja: {
                id: 'kappa',
                nivel: 4,
                nombre: 'Operador de Caja',
                badge: 'KAPPA - CAJERO',
                color: '#10b981',
                permisos: ['dashboard', 'pos', 'cafetin', 'caja', 'crm', 'kiosco', 'pos_movil', 'documentos', 'banco_memoria']
            },
            panadero: {
                id: 'sigma',
                nivel: 3,
                nombre: 'Maestro Panadero',
                badge: 'SIGMA - SUPERVISOR',
                color: '#a855f7',
                permisos: ['dashboard', 'cafetin', 'produccion', 'activos', 'inventario', 'kds', 'rrhh', 'delivery', 'compras_predictivas', 'guardias-hub', 'crm']
            }
        },

        usuarios: [
            {
                id: "USR-001",
                username: "admin",
                pin: "viasa2026",
                nombreCompleto: "Director General (Master Senior)",
                rol: "master_senior",
                cargo: "Director General / Master Senior",
                departamento: "Dirección Ejecutiva",
                avatar: "fa-user-tie",
                activo: true,
                fechaCreacion: "2026-01-01T08:00:00.000Z"
            },
            {
                id: "USR-002",
                username: "gerente",
                pin: "gerente2026",
                nombreCompleto: "Lcda. Valentina Mendoza",
                rol: "omega",
                cargo: "Gerente General",
                departamento: "Gerencia General",
                avatar: "fa-user-gear",
                activo: true,
                fechaCreacion: "2026-01-05T08:00:00.000Z"
            },
            {
                id: "USR-007",
                username: "administracion",
                pin: "admin2026",
                nombreCompleto: "Lcda. Carmen Bastardo",
                rol: "omega",
                cargo: "Gerente Administrativa",
                departamento: "Administración y Finanzas",
                avatar: "fa-user-shield",
                activo: true,
                fechaCreacion: "2026-01-06T08:00:00.000Z"
            },
            {
                id: "USR-003",
                username: "supervisor",
                pin: "sigma2026",
                nombreCompleto: "Carlos Rodríguez",
                rol: "sigma",
                cargo: "Maestro Panadero y Supervisor de Planta",
                departamento: "Producción y Calidad",
                avatar: "fa-wheat-awn",
                activo: true,
                fechaCreacion: "2026-01-10T08:00:00.000Z"
            },
            {
                id: "USR-004",
                username: "cajero",
                pin: "caja123",
                nombreCompleto: "María Contreras",
                rol: "kappa",
                cargo: "Cajera Principal y Front-Desk",
                departamento: "Caja y Ventas",
                avatar: "fa-cash-register",
                activo: true,
                fechaCreacion: "2026-01-15T08:00:00.000Z"
            },
            {
                id: "USR-005",
                username: "operador",
                pin: "alfa2026",
                nombreCompleto: "Jesús Da Silva",
                rol: "alfa",
                cargo: "Operador de Piso y Despachos",
                departamento: "Logística y Salón",
                avatar: "fa-truck-fast",
                activo: true,
                fechaCreacion: "2026-02-01T08:00:00.000Z"
            },
            {
                id: "USR-006",
                username: "panadero",
                pin: "harina123",
                nombreCompleto: "Roberto Gómez",
                rol: "sigma",
                cargo: "Jefe de Hornos (Turno Madrugada)",
                departamento: "Producción",
                avatar: "fa-fire-burner",
                activo: true,
                fechaCreacion: "2026-02-05T08:00:00.000Z"
            }
        ],

        categorias: [
            { id: "cat_pan_salado", nombre: "Panadería Salada", icono: "fa-bread-slice", color: "#d97706" },
            { id: "cat_pan_dulce", nombre: "Panadería Dulce", icono: "fa-cookie", color: "#f59e0b" },
            { id: "cat_pasteleria", nombre: "Pastelería y Tortas", icono: "fa-cake-candles", color: "#ec4899" },
            { id: "cat_charcuteria", nombre: "Charcutería y Lácteos", icono: "fa-cheese", color: "#eab308" },
            { id: "cat_cafeteria", nombre: "Cafetería y Bebidas", icono: "fa-mug-hot", color: "#854d0e" },
            { id: "cat_viveres", nombre: "Víveres y Despensa", icono: "fa-basket-shopping", color: "#10b981" }
        ],

        productos: [
            // Panadería Salada (Canilla, Campesino, Francés: Exentos de IVA según gaceta alimentaria)
            {
                id: "PRD-001",
                codigoBarras: "7591001",
                nombre: "Pan Canilla Tradicional",
                categoria: "cat_pan_salado",
                precioUSD: 0.50,
                costoUSD: 0.22,
                unidad: "UND",
                stock: 120,
                stockMinimo: 20,
                exentoIVA: true,
                rindeReceta: "rec_canilla"
            },
            {
                id: "PRD-002",
                codigoBarras: "7591002",
                nombre: "Pan Campesino Rústico",
                categoria: "cat_pan_salado",
                precioUSD: 1.00,
                costoUSD: 0.45,
                unidad: "UND",
                stock: 80,
                stockMinimo: 15,
                exentoIVA: true,
                rindeReceta: "rec_campesino"
            },
            {
                id: "PRD-003",
                codigoBarras: "7591003",
                nombre: "Pan Francés (Bolsa de 10 uds)",
                categoria: "cat_pan_salado",
                precioUSD: 1.50,
                costoUSD: 0.70,
                unidad: "BOLSA",
                stock: 50,
                stockMinimo: 10,
                exentoIVA: true,
                rindeReceta: "rec_frances"
            },
            {
                id: "PRD-004",
                codigoBarras: "7591004",
                nombre: "Pan de Jamón Tradicional Viasa (Especial)",
                categoria: "cat_pan_salado",
                precioUSD: 12.00,
                costoUSD: 6.20,
                unidad: "UND",
                stock: 25,
                stockMinimo: 5,
                exentoIVA: false,
                rindeReceta: "rec_pan_jamon"
            },

            // Panadería Dulce
            {
                id: "PRD-005",
                codigoBarras: "7592001",
                nombre: "Golfeado Meloso con Queso de Mano",
                categoria: "cat_pan_dulce",
                precioUSD: 1.50,
                costoUSD: 0.65,
                unidad: "UND",
                stock: 45,
                stockMinimo: 10,
                exentoIVA: false,
                rindeReceta: "rec_golfeados"
            },
            {
                id: "PRD-006",
                codigoBarras: "7592002",
                nombre: "Pan Piñita Dulce con Azúcar",
                categoria: "cat_pan_dulce",
                precioUSD: 0.40,
                costoUSD: 0.18,
                unidad: "UND",
                stock: 90,
                stockMinimo: 20,
                exentoIVA: true
            },
            {
                id: "PRD-007",
                codigoBarras: "7592003",
                nombre: "Trenza Rellena de Guayaba y Queso",
                categoria: "cat_pan_dulce",
                precioUSD: 2.50,
                costoUSD: 1.10,
                unidad: "UND",
                stock: 30,
                stockMinimo: 5,
                exentoIVA: false
            },

            // Pastelería y Repostería
            {
                id: "PRD-008",
                codigoBarras: "7593001",
                nombre: "Torta Tres Leches Viasa (Porción)",
                categoria: "cat_pasteleria",
                precioUSD: 2.50,
                costoUSD: 0.95,
                unidad: "PORCION",
                stock: 35,
                stockMinimo: 8,
                exentoIVA: false
            },
            {
                id: "PRD-009",
                codigoBarras: "7593002",
                nombre: "Milhojas de Crema Pastelera y Arequipe",
                categoria: "cat_pasteleria",
                precioUSD: 2.00,
                costoUSD: 0.80,
                unidad: "UND",
                stock: 40,
                stockMinimo: 10,
                exentoIVA: false
            },

            // Cafetería y Bebidas
            {
                id: "PRD-010",
                codigoBarras: "7594001",
                nombre: "Café con Leche Grande (Cremoso)",
                categoria: "cat_cafeteria",
                precioUSD: 1.20,
                costoUSD: 0.35,
                unidad: "VASO",
                stock: 200,
                stockMinimo: 30,
                exentoIVA: false
            },
            {
                id: "PRD-011",
                codigoBarras: "7594002",
                nombre: "Café Marrón / Espresso",
                categoria: "cat_cafeteria",
                precioUSD: 0.80,
                costoUSD: 0.20,
                unidad: "VASO",
                stock: 200,
                stockMinimo: 30,
                exentoIVA: false
            },
            {
                id: "PRD-012",
                codigoBarras: "7593116310121",
                nombre: "Malta Polar 355ml (Fría)",
                categoria: "cat_cafeteria",
                precioUSD: 1.00,
                costoUSD: 0.68,
                unidad: "UND",
                stock: 144,
                stockMinimo: 24,
                exentoIVA: false
            },
            // Línea de Creaciones y Envasados Propios VIASA
            {
                id: "PRD-013",
                codigoBarras: "7593116310130",
                nombre: "Pan Molido Especial Viasa (Empaque 500g)",
                categoria: "cat_viveres",
                precioUSD: 1.20,
                costoUSD: 0.40,
                unidad: "PAQUETE",
                stock: 60,
                stockMinimo: 15,
                exentoIVA: true,
                produccionPropia: true,
                rindeReceta: "rec_pan_molido"
            },
            {
                id: "PRD-014",
                codigoBarras: "7593116310147",
                nombre: "Pan para Perrote Tradicional (Bolsa x6 Uds)",
                categoria: "cat_pan_salado",
                precioUSD: 1.80,
                costoUSD: 0.75,
                unidad: "BOLSA",
                stock: 40,
                stockMinimo: 10,
                exentoIVA: true,
                produccionPropia: true,
                rindeReceta: "rec_perrote"
            },
            {
                id: "PRD-015",
                codigoBarras: "7593116310154",
                nombre: "Galletas Polvorosas Viasa (Bandeja 250g)",
                categoria: "cat_pan_dulce",
                precioUSD: 2.00,
                costoUSD: 0.85,
                unidad: "BANDEJA",
                stock: 35,
                stockMinimo: 8,
                exentoIVA: false,
                produccionPropia: true,
                rindeReceta: "rec_polvorosas"
            },
            {
                id: "PRD-016",
                codigoBarras: "7593116310161",
                nombre: "Bizcochos Tostados con Anís Dulce (Empaque 300g)",
                categoria: "cat_pan_dulce",
                precioUSD: 1.50,
                costoUSD: 0.55,
                unidad: "PAQUETE",
                stock: 50,
                stockMinimo: 12,
                exentoIVA: false,
                produccionPropia: true,
                rindeReceta: "rec_bizcochos"
            },
        ],

        materiaPrima: [
            { id: "MP-001", nombre: "Harina de Trigo Panadera Fuerte (000)", categoria: "harinas", unidad: "SACO 45KG", stockActual: 42, stockMinimo: 10, costoUSD: 36.00, lote: "HAR-2026-09", fechaCaducidad: "2026-12-15", proveedor: "Molinos Nacionales C.A.", icono: "fa-wheat-awn" },
            { id: "MP-002", nombre: "Harina de Trigo Todo Uso Pastelera", categoria: "harinas", unidad: "SACO 45KG", stockActual: 18, stockMinimo: 5, costoUSD: 33.50, lote: "HAR-2026-08", fechaCaducidad: "2026-11-20", proveedor: "Molinos Nacionales C.A.", icono: "fa-wheat-awn" },
            { id: "MP-003", nombre: "Harina de Trigo Integral Fina", categoria: "harinas", unidad: "SACO 25KG", stockActual: 10, stockMinimo: 3, costoUSD: 24.00, lote: "HIN-2026-07", fechaCaducidad: "2026-11-05", proveedor: "Distribuidora Trigo Dorado", icono: "fa-wheat-awn" },
            { id: "MP-004", nombre: "Levadura Fresca Prensada en Bloque", categoria: "levaduras", unidad: "KG", stockActual: 28.5, stockMinimo: 8, costoUSD: 4.20, lote: "LEV-260901", fechaCaducidad: "2026-10-01", proveedor: "Levaduras del Caribe", icono: "fa-cubes-stacked" },
            { id: "MP-005", nombre: "Levadura Seca Instantánea", categoria: "levaduras", unidad: "KG", stockActual: 14.0, stockMinimo: 4, costoUSD: 6.80, lote: "LSI-260810", fechaCaducidad: "2027-04-10", proveedor: "Levaduras del Caribe", icono: "fa-cubes-stacked" },
            { id: "MP-006", nombre: "Manteca Vegetal Industrial", categoria: "grasas", unidad: "CAJA 15KG", stockActual: 14, stockMinimo: 4, costoUSD: 28.00, lote: "MAN-260815", fechaCaducidad: "2027-02-15", proveedor: "Oleaginosas Industriales", icono: "fa-jar" },
            { id: "MP-007", nombre: "Mantequilla Pura con Sal Gourmet", categoria: "grasas", unidad: "KG", stockActual: 22.0, stockMinimo: 6, costoUSD: 7.50, lote: "MNT-260825", fechaCaducidad: "2026-10-25", proveedor: "Lácteos Los Andes", icono: "fa-jar" },
            { id: "MP-008", nombre: "Azúcar Refinada Extra Blanca", categoria: "azucares", unidad: "SACO 50KG", stockActual: 22, stockMinimo: 5, costoUSD: 45.00, lote: "AZU-260902", fechaCaducidad: "2027-08-01", proveedor: "Central Azucarero El Palmar", icono: "fa-spoon" },
            { id: "MP-009", nombre: "Papelón / Panela Melado Artesanal", categoria: "azucares", unidad: "KG", stockActual: 35.0, stockMinimo: 10, costoUSD: 2.20, lote: "PAP-260715", fechaCaducidad: "2027-01-15", proveedor: "Trapiches del Valle", icono: "fa-spoon" },
            { id: "MP-010", nombre: "Sal Marina Refinada Microionizada", categoria: "aditivos", unidad: "SACO 25KG", stockActual: 12, stockMinimo: 3, costoUSD: 8.50, lote: "SAL-260601", fechaCaducidad: "2028-01-01", proveedor: "Salinas de Araya", icono: "fa-mortar-pestle" },
            { id: "MP-011", nombre: "Mejorador de Masa Panadero (Plus)", categoria: "aditivos", unidad: "KG", stockActual: 15.0, stockMinimo: 3, costoUSD: 6.50, lote: "MEJ-260810", fechaCaducidad: "2027-06-10", proveedor: "Puratos Venezuela", icono: "fa-vial" },
            { id: "MP-012", nombre: "Queso Blanco Duro para Rallar", categoria: "lacteos", unidad: "KG", stockActual: 65.0, stockMinimo: 15, costoUSD: 4.80, lote: "QBL-260902", fechaCaducidad: "2026-09-30", proveedor: "Quesera La Llanera", icono: "fa-cheese" },
            { id: "MP-013", nombre: "Queso de Mano Fresco Artesanal", categoria: "lacteos", unidad: "KG", stockActual: 18.0, stockMinimo: 5, costoUSD: 6.20, lote: "QMN-260903", fechaCaducidad: "2026-09-18", proveedor: "Quesera La Llanera", icono: "fa-cheese" },
            { id: "MP-014", nombre: "Jamón Ahumado Superior", categoria: "embutidos", unidad: "KG", stockActual: 32.0, stockMinimo: 8, costoUSD: 7.20, lote: "JAM-260901", fechaCaducidad: "2026-10-15", proveedor: "Embutidos Plumrose", icono: "fa-drumstick-bite" },
            { id: "MP-015", nombre: "Tocineta Ahumada Especial", categoria: "embutidos", unidad: "KG", stockActual: 16.0, stockMinimo: 4, costoUSD: 8.90, lote: "TOC-260828", fechaCaducidad: "2026-10-20", proveedor: "Embutidos Plumrose", icono: "fa-bacon" },
            { id: "MP-016", nombre: "Uvas Pasas Rubias y Negras", categoria: "frutos_secos", unidad: "KG", stockActual: 20.0, stockMinimo: 5, costoUSD: 4.50, lote: "PAS-260710", fechaCaducidad: "2027-03-10", proveedor: "Importadora Frutos del Sol", icono: "fa-seedling" },
            { id: "MP-017", nombre: "Aceitunas Rellenas con Pimentón", categoria: "conservas", unidad: "KG", stockActual: 18.0, stockMinimo: 4, costoUSD: 5.80, lote: "ACE-260615", fechaCaducidad: "2027-05-15", proveedor: "Importadora Frutos del Sol", icono: "fa-circle-dot" },
            { id: "MP-018", nombre: "Bocadillo de Guayaba Rojo Concentrado", categoria: "dulces", unidad: "KG", stockActual: 25.0, stockMinimo: 6, costoUSD: 3.20, lote: "GUA-260812", fechaCaducidad: "2027-02-12", proveedor: "Dulcería Andina", icono: "fa-candy-cane" }
        ],

        recetasFormulas: [
            {
                id: "rec_canilla",
                nombre: "Fórmula Pan Canilla Viasa (Base 1 Saco 45kg)",
                descripcion: "Canilla crujiente tradicional, miga alveolada y suave.",
                productoResultante: "PRD-001",
                rendimientoEstimadoUnidades: 260,
                tiempoAmasadoMin: 18,
                tiempoFermentacionMin: 60,
                tiempoHorneadoMin: 22,
                tempHornoC: 220,
                ingredientes: [
                    { materiaPrimaId: "MP-001", nombre: "Harina Panadera Fuerte (000)", cantidad: 45, unidad: "kg", porcentaje: 100 },
                    { materiaPrimaId: "MP-004", nombre: "Levadura Fresca Prensada", cantidad: 0.9, unidad: "kg", porcentaje: 2.0 },
                    { materiaPrimaId: "MP-006", nombre: "Manteca Vegetal Industrial", cantidad: 1.8, unidad: "kg", porcentaje: 4.0 },
                    { materiaPrimaId: "MP-008", nombre: "Azúcar Refinada Extra", cantidad: 1.35, unidad: "kg", porcentaje: 3.0 },
                    { materiaPrimaId: "MP-010", nombre: "Sal Marina Refinada", cantidad: 0.9, unidad: "kg", porcentaje: 2.0 },
                    { materiaPrimaId: "MP-011", nombre: "Mejorador de Masa Panadero", cantidad: 0.22, unidad: "kg", porcentaje: 0.5 }
                ]
            },
            {
                id: "rec_campesino",
                nombre: "Fórmula Pan Campesino Rústico (Base 1 Saco 45kg)",
                descripcion: "Corteza enharinada y crujiente con corte transversal rústico.",
                productoResultante: "PRD-002",
                rendimientoEstimadoUnidades: 140,
                tiempoAmasadoMin: 20,
                tiempoFermentacionMin: 75,
                tiempoHorneadoMin: 30,
                tempHornoC: 215,
                ingredientes: [
                    { materiaPrimaId: "MP-001", nombre: "Harina Panadera Fuerte (000)", cantidad: 45, unidad: "kg", porcentaje: 100 },
                    { materiaPrimaId: "MP-004", nombre: "Levadura Fresca Prensada", cantidad: 0.67, unidad: "kg", porcentaje: 1.5 },
                    { materiaPrimaId: "MP-006", nombre: "Manteca Vegetal Industrial", cantidad: 0.9, unidad: "kg", porcentaje: 2.0 },
                    { materiaPrimaId: "MP-008", nombre: "Azúcar Refinada Extra", cantidad: 0.9, unidad: "kg", porcentaje: 2.0 },
                    { materiaPrimaId: "MP-010", nombre: "Sal Marina Refinada", cantidad: 0.9, unidad: "kg", porcentaje: 2.0 },
                    { materiaPrimaId: "MP-011", nombre: "Mejorador de Masa Panadero", cantidad: 0.18, unidad: "kg", porcentaje: 0.4 }
                ]
            },
            {
                id: "rec_frances",
                nombre: "Fórmula Pan Francés Redondo (Base 1 Saco 45kg)",
                descripcion: "Pan individual de corteza fina y textura ligera (rinde 50 bolsas de 10 uds).",
                productoResultante: "PRD-003",
                rendimientoEstimadoUnidades: 50,
                tiempoAmasadoMin: 18,
                tiempoFermentacionMin: 60,
                tiempoHorneadoMin: 20,
                tempHornoC: 225,
                ingredientes: [
                    { materiaPrimaId: "MP-001", nombre: "Harina Panadera Fuerte (000)", cantidad: 45, unidad: "kg", porcentaje: 100 },
                    { materiaPrimaId: "MP-004", nombre: "Levadura Fresca Prensada", cantidad: 1.0, unidad: "kg", porcentaje: 2.2 },
                    { materiaPrimaId: "MP-006", nombre: "Manteca Vegetal Industrial", cantidad: 1.5, unidad: "kg", porcentaje: 3.3 },
                    { materiaPrimaId: "MP-008", nombre: "Azúcar Refinada Extra", cantidad: 1.2, unidad: "kg", porcentaje: 2.6 },
                    { materiaPrimaId: "MP-010", nombre: "Sal Marina Refinada", cantidad: 0.9, unidad: "kg", porcentaje: 2.0 },
                    { materiaPrimaId: "MP-011", nombre: "Mejorador de Masa Panadero", cantidad: 0.22, unidad: "kg", porcentaje: 0.5 }
                ]
            },
            {
                id: "rec_pan_jamon",
                nombre: "Fórmula Pan de Jamón Especial Viasa (Tanda 10 Uds)",
                descripcion: "Masa semi-hojaldrada con mantequilla pura, jamón ahumado, tocineta, pasas y aceitunas.",
                productoResultante: "PRD-004",
                rendimientoEstimadoUnidades: 10,
                tiempoAmasadoMin: 25,
                tiempoFermentacionMin: 90,
                tiempoHorneadoMin: 40,
                tempHornoC: 180,
                ingredientes: [
                    { materiaPrimaId: "MP-001", nombre: "Harina Panadera Fuerte (000)", cantidad: 5.0, unidad: "kg", porcentaje: 100 },
                    { materiaPrimaId: "MP-007", nombre: "Mantequilla Pura con Sal", cantidad: 0.8, unidad: "kg", porcentaje: 16.0 },
                    { materiaPrimaId: "MP-008", nombre: "Azúcar Refinada Extra", cantidad: 0.6, unidad: "kg", porcentaje: 12.0 },
                    { materiaPrimaId: "MP-004", nombre: "Levadura Fresca Prensada", cantidad: 0.2, unidad: "kg", porcentaje: 4.0 },
                    { materiaPrimaId: "MP-010", nombre: "Sal Marina Refinada", cantidad: 0.08, unidad: "kg", porcentaje: 1.6 },
                    { materiaPrimaId: "MP-014", nombre: "Jamón Ahumado Superior", cantidad: 4.5, unidad: "kg", porcentaje: 90.0 },
                    { materiaPrimaId: "MP-015", nombre: "Tocineta Ahumada Especial", cantidad: 1.2, unidad: "kg", porcentaje: 24.0 },
                    { materiaPrimaId: "MP-016", nombre: "Uvas Pasas Rubias y Negras", cantidad: 0.7, unidad: "kg", porcentaje: 14.0 },
                    { materiaPrimaId: "MP-017", nombre: "Aceitunas Rellenas con Pimentón", cantidad: 0.6, unidad: "kg", porcentaje: 12.0 },
                    { materiaPrimaId: "MP-009", nombre: "Papelón / Panela Melado", cantidad: 0.5, unidad: "kg", porcentaje: 10.0 }
                ]
            },
            {
                id: "rec_golfeados",
                nombre: "Fórmula Golfeados Melosos Viasa (Tanda 50 Uds)",
                descripcion: "Rollos acaramelados con papelón, queso blanco rallado y toque de anís dulce.",
                productoResultante: "PRD-005",
                rendimientoEstimadoUnidades: 50,
                tiempoAmasadoMin: 22,
                tiempoFermentacionMin: 80,
                tiempoHorneadoMin: 25,
                tempHornoC: 190,
                ingredientes: [
                    { materiaPrimaId: "MP-002", nombre: "Harina Todo Uso Pastelera", cantidad: 6.0, unidad: "kg", porcentaje: 100 },
                    { materiaPrimaId: "MP-007", nombre: "Mantequilla Pura con Sal", cantidad: 0.7, unidad: "kg", porcentaje: 11.6 },
                    { materiaPrimaId: "MP-009", nombre: "Papelón / Panela Melado", cantidad: 2.5, unidad: "kg", porcentaje: 41.6 },
                    { materiaPrimaId: "MP-012", nombre: "Queso Blanco Duro para Rallar", cantidad: 2.0, unidad: "kg", porcentaje: 33.3 },
                    { materiaPrimaId: "MP-004", nombre: "Levadura Fresca Prensada", cantidad: 0.25, unidad: "kg", porcentaje: 4.1 },
                    { materiaPrimaId: "MP-010", nombre: "Sal Marina Refinada", cantidad: 0.06, unidad: "kg", porcentaje: 1.0 }
                ]
            },
            {
                id: "rec_trenza",
                nombre: "Fórmula Trenza Dulce Guayaba y Queso (Tanda 20 Uds)",
                descripcion: "Trenza suave dorada al horno rellena de bocadillo de guayaba y queso blanco.",
                productoResultante: "PRD-007",
                rendimientoEstimadoUnidades: 20,
                tiempoAmasadoMin: 20,
                tiempoFermentacionMin: 60,
                tiempoHorneadoMin: 25,
                tempHornoC: 185,
                ingredientes: [
                    { materiaPrimaId: "MP-001", nombre: "Harina Panadera Fuerte (000)", cantidad: 5.0, unidad: "kg", porcentaje: 100 },
                    { materiaPrimaId: "MP-006", nombre: "Manteca Vegetal Industrial", cantidad: 0.5, unidad: "kg", porcentaje: 10.0 },
                    { materiaPrimaId: "MP-008", nombre: "Azúcar Refinada Extra", cantidad: 0.75, unidad: "kg", porcentaje: 15.0 },
                    { materiaPrimaId: "MP-004", nombre: "Levadura Fresca Prensada", cantidad: 0.2, unidad: "kg", porcentaje: 4.0 },
                    { materiaPrimaId: "MP-018", nombre: "Bocadillo de Guayaba Rojo", cantidad: 2.5, unidad: "kg", porcentaje: 50.0 },
                    { materiaPrimaId: "MP-012", nombre: "Queso Blanco Duro para Rallar", cantidad: 1.5, unidad: "kg", porcentaje: 30.0 },
                    { materiaPrimaId: "MP-010", nombre: "Sal Marina Refinada", cantidad: 0.05, unidad: "kg", porcentaje: 1.0 }
                ]
            }
        ],

        metodosPago: [
            { id: "pago_efectivo_usd", nombre: "Efectivo Divisas ($)", icono: "fa-dollar-sign", moneda: "USD", color: "#22c55e" },
            { id: "pago_efectivo_bs", nombre: "Efectivo Bolívares (Bs)", icono: "fa-money-bill-wave", moneda: "VES", color: "#38bdf8" },
            { id: "pago_pago_movil", nombre: "Pago Móvil Interbancario", icono: "fa-mobile-screen-button", moneda: "VES", color: "#a855f7" },
            { id: "pago_punto_debito", nombre: "Punto de Venta / Tarjeta", icono: "fa-credit-card", moneda: "VES", color: "#f59e0b" },
            { id: "pago_zelle", nombre: "Zelle / Transferencia Digital", icono: "fa-building-columns", moneda: "USD", color: "#6366f1" },
            { id: "pago_biopago", nombre: "Biopago BDV", icono: "fa-fingerprint", moneda: "VES", color: "#ec4899" },
            { id: "pago_efectivo_cop", nombre: "Pesos Colombianos (COP)", icono: "fa-coins", moneda: "COP", color: "#eab308" }
        ],

        proveedores: [
            {
                id: "PRV-001",
                rif: "J-00030291-0",
                nombreEmpresa: "Molinos Nacionales C.A. (MONACA)",
                contacto: "Ing. Roberto Morales",
                telefono: "0414-8899221",
                email: "ventas.oriente@monaca.com.ve",
                direccion: "Zona Industrial Matanzas, Galpón 12, Puerto Ordaz, Edo. Bolívar",
                categoria: "Harinas y Trigo",
                diasCredito: 15,
                monedasAceptadas: ["USD", "VES"],
                bancoPago: "Banesco (0134) / Mercantil (0105)",
                pagoMovil: "0414-8899221 | J-00030291-0 | Banesco",
                calificacion: 5.0,
                ratingDetalle: { puntualidad: 5.0, calidad: 5.0, precio: 4.8 },
                notas: "Proveedor principal de Harina Panadera 000 y Todo Uso. Despacho semanal los días martes.",
                insumosSuministrados: ["MP-001", "MP-002"]
            },
            {
                id: "PRV-002",
                rif: "J-30918234-5",
                nombreEmpresa: "Levaduras del Caribe C.A.",
                contacto: "Lic. Elena Benítez",
                telefono: "0424-9128374",
                email: "pedidos@levadurascaribe.com",
                direccion: "Av. Fuerzas Armadas, Edf. Caribe, PB, Ciudad Bolívar",
                categoria: "Levaduras y Cultivos",
                diasCredito: 7,
                monedasAceptadas: ["USD", "VES"],
                bancoPago: "Banco de Venezuela (0102)",
                pagoMovil: "0424-9128374 | J-30918234-5 | BDV",
                calificacion: 4.8,
                ratingDetalle: { puntualidad: 4.8, calidad: 5.0, precio: 4.6 },
                notas: "Levadura fresca prensada y levadura seca instantánea de alto poder fermentativo.",
                insumosSuministrados: ["MP-004", "MP-005"]
            },
            {
                id: "PRV-003",
                rif: "J-40192834-8",
                nombreEmpresa: "Lácteos Los Andes y Quesera La Llanera",
                contacto: "Don Andrés Páez",
                telefono: "0412-7382910",
                email: "queseralallanera@gmail.com",
                direccion: "Carretera Nacional Soledad - Cd. Bolívar, Km 12",
                categoria: "Lácteos y Quesos",
                diasCredito: 5,
                monedasAceptadas: ["USD", "VES", "COP"],
                bancoPago: "Banesco (0134) / Efectivo Divisas",
                pagoMovil: "0412-7382910 | V-14920192 | Banesco",
                calificacion: 4.9,
                ratingDetalle: { puntualidad: 4.9, calidad: 5.0, precio: 4.8 },
                notas: "Queso duro llanero óptimo para rallar, queso de mano fresco artesanal y mantequilla pura con sal.",
                insumosSuministrados: ["MP-007", "MP-012", "MP-013"]
            },
            {
                id: "PRV-004",
                rif: "J-00012384-9",
                nombreEmpresa: "Embutidos Plumrose Latinoamericana, C.A.",
                contacto: "Gerencia Comercial Oriente",
                telefono: "0416-6859123",
                email: "ventas.guayana@plumrose.com",
                direccion: "Distribuidora Oriente, Galpón Plumrose, Puerto Ordaz",
                categoria: "Jamones y Embutidos",
                diasCredito: 21,
                monedasAceptadas: ["USD", "VES"],
                bancoPago: "Banco Mercantil (0105) / Provincial (0108)",
                pagoMovil: "0416-6859123 | J-00012384-9 | Mercantil",
                calificacion: 5.0,
                ratingDetalle: { puntualidad: 5.0, calidad: 5.0, precio: 4.7 },
                notas: "Jamón ahumado superior y tocineta ahumada especial para pan de jamón gourmet.",
                insumosSuministrados: ["MP-014", "MP-015"]
            },
            {
                id: "PRV-005",
                rif: "J-00084729-1",
                nombreEmpresa: "Central Azucarero El Palmar y Trapiches del Valle",
                contacto: "Marcos Villalobos",
                telefono: "0424-8192039",
                email: "azucarelpalmar@gmail.com",
                direccion: "Zona Industrial Los Próceres, Galpón 8, Ciudad Bolívar",
                categoria: "Azúcares y Melados",
                diasCredito: 14,
                monedasAceptadas: ["USD", "VES"],
                bancoPago: "Banco Nacional de Crédito (0191)",
                pagoMovil: "0424-8192039 | J-00084729-1 | BNC",
                calificacion: 4.7,
                ratingDetalle: { puntualidad: 4.6, calidad: 4.8, precio: 4.7 },
                notas: "Azúcar refinada extra en sacos de 50kg y papelón melado artesanal en panelas.",
                insumosSuministrados: ["MP-008", "MP-009"]
            }
        ],

        cuentasPorPagar: [
            {
                id: "CXP-001",
                numeroFacturaProveedor: "FC-84920",
                proveedorId: "PRV-001",
                proveedorNombre: "Molinos Nacionales C.A. (MONACA)",
                concepto: "Compra de 20 Sacos Harina Panadera Fuerte (45kg)",
                fechaEmision: "2026-08-28",
                fechaVencimiento: "2026-09-12",
                montoTotalUSD: 720.00,
                montoPagadoUSD: 360.00,
                saldoPendienteUSD: 360.00,
                estado: "parcial", // 'pendiente', 'parcial', 'pagada', 'vencida'
                pagosRealizados: [
                    {
                        id: "PAG-001",
                        fecha: "2026-08-30",
                        montoUSD: 360.00,
                        metodoPago: "pago_pago_movil",
                        referencia: "PM-984201",
                        banco: "Banesco",
                        tasaBCVAplicada: 36.85,
                        montoBs: 13266.00,
                        comprobante: "COMP-001"
                    }
                ]
            },
            {
                id: "CXP-002",
                numeroFacturaProveedor: "FC-19023",
                proveedorId: "PRV-002",
                proveedorNombre: "Levaduras del Caribe C.A.",
                concepto: "Compra de 28.5 kg Levadura Fresca Prensada",
                fechaEmision: "2026-09-01",
                fechaVencimiento: "2026-09-08",
                montoTotalUSD: 119.70,
                montoPagadoUSD: 0.00,
                saldoPendienteUSD: 119.70,
                estado: "pendiente",
                pagosRealizados: []
            },
            {
                id: "CXP-003",
                numeroFacturaProveedor: "FC-55210",
                proveedorId: "PRV-004",
                proveedorNombre: "Embutidos Plumrose Latinoamericana, C.A.",
                concepto: "Compra de 32 kg Jamón Ahumado + 16 kg Tocineta Ahumada",
                fechaEmision: "2026-08-15",
                fechaVencimiento: "2026-09-05",
                montoTotalUSD: 372.80,
                montoPagadoUSD: 372.80,
                saldoPendienteUSD: 0.00,
                estado: "pagada",
                pagosRealizados: [
                    {
                        id: "PAG-002",
                        fecha: "2026-09-02",
                        montoUSD: 372.80,
                        metodoPago: "pago_zelle",
                        referencia: "ZEL-482019",
                        banco: "Chase Bank Zelle",
                        tasaBCVAplicada: 36.85,
                        montoBs: 13737.68,
                        comprobante: "COMP-002"
                    }
                ]
            }
        ],

        clientes: [
            {
                id: "CLI-001",
                nombre: "Dr. Carlos Mendoza",
                documento: "V-12849201",
                tipo: "Consumidor Frecuente",
                telefono: "0414-8921102",
                email: "cmendoza@gmail.com",
                direccion: "Urb. Los Olivos, Manzana 14, Casa 8, Puerto Ordaz",
                puntosClub: 340,
                saldoWalletUSD: 25.00,
                comprasHistoricasTotalUSD: 480.50,
                productosFavoritos: ["PRD-001", "PRD-010"],
                preferenciasNotas: "Café con leche bien caliente sin azúcar, Pan campesino tostado.",
                fechaRegistro: "2026-05-10"
            },
            {
                id: "CLI-002",
                nombre: "Inversiones y Consultores Bolívar, C.A.",
                documento: "J-30918239-1",
                tipo: "Cliente Corporativo",
                contacto: "Lic. Patricia Suárez",
                telefono: "0424-9382019",
                email: "administracion@icb.com.ve",
                direccion: "Torre Balear, Piso 5, Oficina 502, Alta Vista, Puerto Ordaz",
                puntosClub: 1250,
                saldoWalletUSD: 150.00,
                comprasHistoricasTotalUSD: 2450.00,
                productosFavoritos: ["PRD-004", "PRD-008", "PRD-010"],
                preferenciasNotas: "Desayunos ejecutivos semanales todos los lunes. Facturación fiscal a nombre de la empresa.",
                fechaRegistro: "2026-03-15"
            },
            {
                id: "CLI-003",
                nombre: "Cafetería y Bodegón El Rincón Gourmet",
                documento: "J-40192830-2",
                tipo: "Mayorista / Revendedor",
                contacto: "Manuel De Abreu",
                telefono: "0412-8823491",
                email: "rincongourmetpzo@gmail.com",
                direccion: "Av. Guayana, C.C. Trébol III, Local 12, Puerto Ordaz",
                puntosClub: 2800,
                saldoWalletUSD: 80.00,
                comprasHistoricasTotalUSD: 5600.00,
                productosFavoritos: ["PRD-001", "PRD-002", "PRD-003"],
                preferenciasNotas: "Despacho diario a las 6:30 AM de 30 campesinos y 40 canillas. Descuento mayorista pactado.",
                fechaRegistro: "2026-01-20"
            },
            {
                id: "CLI-004",
                nombre: "Elena Gómez de Silva",
                documento: "V-16892304",
                tipo: "VIP / Embajador Viasa",
                telefono: "0416-7281920",
                email: "elenagomez@hotmail.com",
                direccion: "Villa Antillana, Calle 3, Qta. Los Rosales, Puerto Ordaz",
                puntosClub: 850,
                saldoWalletUSD: 45.00,
                comprasHistoricasTotalUSD: 1120.00,
                productosFavoritos: ["PRD-005", "PRD-007", "PRD-008"],
                preferenciasNotas: "Amante de los golfeados melosos con extra queso blanco. Cumpleaños el 18 de Octubre.",
                fechaRegistro: "2026-04-02"
            }
        ],

        recompensasClub: [
            { id: "REW-001", nombre: "Café con Leche Grande o Espresso", puntosRequeridos: 100, valorUSD: 1.20, icono: "fa-mug-saucer", descripcion: "Válido por 1 café grande caliente o espresso cremoso." },
            { id: "REW-002", nombre: "Bolsa de 2 Panes Campesinos Rústicos", puntosRequeridos: 200, valorUSD: 2.00, icono: "fa-bread-slice", descripcion: "2 panes campesinos crujientes recién horneados." },
            { id: "REW-003", nombre: "Golfeado Meloso con Queso de Mano", puntosRequeridos: 180, valorUSD: 1.80, icono: "fa-cookie-bite", descripcion: "1 golfeado bañado en melado de papelón y queso fresco." },
            { id: "REW-004", nombre: "Porción de Torta Tres Leches Viasa", puntosRequeridos: 250, valorUSD: 2.50, icono: "fa-cake-candles", descripcion: "Porción individual de la clásica tres leches Viasa." },
            { id: "REW-005", nombre: "Pan de Jamón Especial Gourmet", puntosRequeridos: 950, valorUSD: 12.00, icono: "fa-wheat-awn", descripcion: "1 Pan de Jamón tradicional con tocineta y pasas (1kg)." },
            { id: "REW-006", nombre: "Bono Descuento de $5.00 en Mostrador", puntosRequeridos: 500, valorUSD: 5.00, icono: "fa-ticket", descripcion: "Descuento directo de $5.00 aplicable al total de la compra." }
        ],

        pedidosEspeciales: [
            {
                id: "ENC-001",
                clienteId: "CLI-002",
                clienteNombre: "Inversiones y Consultores Bolívar, C.A.",
                clienteDoc: "J-30918239-1",
                telefono: "0424-9382019",
                tipoEncargo: "Catering / Evento Corporativo",
                descripcion: "Bandeja de 50 mini cachitos de jamón + 50 mini golfeados melosos + 2 Termos de Café con Leche (5L)",
                fechaPedido: "2026-09-03",
                fechaEntrega: "2026-09-08",
                horaEntrega: "08:00 AM",
                montoTotalUSD: 85.00,
                abonoInicialUSD: 45.00,
                saldoPendienteUSD: 40.00,
                metodoAbono: "Transferencia Banesco",
                referenciaAbono: "TR-918234",
                estado: "En Preparación", // 'Pendiente', 'En Preparación', 'Listo para Entrega', 'Entregado'
                notasCocina: "Hornear a las 6:30 AM del día 8 para despacho caliente. Empacar en bandejas doradas con logo Viasa.",
                responsable: "Maestro Panadero"
            },
            {
                id: "ENC-002",
                clienteId: "CLI-004",
                clienteNombre: "Elena Gómez de Silva",
                clienteDoc: "V-16892304",
                telefono: "0416-7281920",
                tipoEncargo: "Torta de Cumpleaños Personalizada",
                descripcion: "Torta Selva Negra Gourmet 2kg con cubierta de chocolate oscuro, cerezas al marrasquino y dedicatoria 'Feliz Cumpleaños Sofía'",
                fechaPedido: "2026-09-02",
                fechaEntrega: "2026-09-06",
                horaEntrega: "04:30 PM",
                montoTotalUSD: 35.00,
                abonoInicialUSD: 35.00,
                saldoPendienteUSD: 0.00,
                metodoAbono: "Pago Móvil BDV",
                referenciaAbono: "PM-448201",
                estado: "Listo para Entrega",
                notasCocina: "Torta en refrigerador N° 2. Dedicatoria en fondant dorado lista.",
                responsable: "Chef Pastelero"
            }
        ],

        planCuentas: [
            // ACTIVOS
            { codigo: "1.1.01", nombre: "Caja Principal Efectivo USD ($)", tipo: "Activo", naturaleza: "Deudor", grupo: "Activo Corriente", saldoInicialUSD: 240.00 },
            { codigo: "1.1.02", nombre: "Caja Principal Efectivo Bolívares (Bs)", tipo: "Activo", naturaleza: "Deudor", grupo: "Activo Corriente", saldoInicialUSD: 150.00 },
            { codigo: "1.1.03", nombre: "Banco Banesco C.A. (Cuenta Corriente Bs)", tipo: "Activo", naturaleza: "Deudor", grupo: "Activo Corriente", saldoInicialUSD: 850.00 },
            { codigo: "1.1.04", nombre: "Banco de Venezuela S.A. (Cuenta Corriente Bs)", tipo: "Activo", naturaleza: "Deudor", grupo: "Activo Corriente", saldoInicialUSD: 620.00 },
            { codigo: "1.1.05", nombre: "Billetera Digital Zelle ($)", tipo: "Activo", naturaleza: "Deudor", grupo: "Activo Corriente", saldoInicialUSD: 450.00 },
            { codigo: "1.1.06", nombre: "Cuentas por Cobrar Clientes / Encargos", tipo: "Activo", naturaleza: "Deudor", grupo: "Activo Corriente", saldoInicialUSD: 40.00 },
            { codigo: "1.1.07", nombre: "Inventario de Materia Prima y Harinas", tipo: "Activo", naturaleza: "Deudor", grupo: "Activo Corriente", saldoInicialUSD: 1850.00 },
            { codigo: "1.1.08", nombre: "Inventario de Productos Terminados", tipo: "Activo", naturaleza: "Deudor", grupo: "Activo Corriente", saldoInicialUSD: 320.00 },
            { codigo: "1.1.09", nombre: "Crédito Fiscal IVA (16%)", tipo: "Activo", naturaleza: "Deudor", grupo: "Activo Corriente", saldoInicialUSD: 18.20 },
            { codigo: "1.2.01", nombre: "Maquinaria, Hornos Rotativos y Amasadoras", tipo: "Activo", naturaleza: "Deudor", grupo: "Activo No Corriente", saldoInicialUSD: 8500.00 },
            
            // PASIVOS
            { codigo: "2.1.01", nombre: "Cuentas por Pagar Proveedores (CxP)", tipo: "Pasivo", naturaleza: "Acreedor", grupo: "Pasivo Corriente", saldoInicialUSD: 245.00 },
            { codigo: "2.1.02", nombre: "Débito Fiscal IVA (16%)", tipo: "Pasivo", naturaleza: "Acreedor", grupo: "Pasivo Corriente", saldoInicialUSD: 29.60 },
            { codigo: "2.1.03", nombre: "Retenciones de IVA por Enterar al SENIAT", tipo: "Pasivo", naturaleza: "Acreedor", grupo: "Pasivo Corriente", saldoInicialUSD: 9.60 },
            { codigo: "2.1.04", nombre: "Anticipos y Billeteras Wallet de Clientes", tipo: "Pasivo", naturaleza: "Acreedor", grupo: "Pasivo Corriente", saldoInicialUSD: 185.00 },

            // PATRIMONIO
            { codigo: "3.1.01", nombre: "Capital Social Suscrito y Pagado", tipo: "Patrimonio", naturaleza: "Acreedor", grupo: "Patrimonio", saldoInicialUSD: 10000.00 },
            { codigo: "3.1.02", nombre: "Resultados Acumulados / Superávit", tipo: "Patrimonio", naturaleza: "Acreedor", grupo: "Patrimonio", saldoInicialUSD: 2579.00 },

            // INGRESOS
            { codigo: "4.1.01", nombre: "Ingresos por Ventas Panadería (Exentas IVA)", tipo: "Ingreso", naturaleza: "Acreedor", grupo: "Ingresos Operacionales", saldoInicialUSD: 0.00 },
            { codigo: "4.1.02", nombre: "Ingresos por Ventas Pastelería y Cafetería (Gravadas 16%)", tipo: "Ingreso", naturaleza: "Acreedor", grupo: "Ingresos Operacionales", saldoInicialUSD: 0.00 },

            // COSTOS Y GASTOS
            { codigo: "5.1.01", nombre: "Costo de Producción y Venta de Pan", tipo: "Costo", naturaleza: "Deudor", grupo: "Costos Operacionales", saldoInicialUSD: 0.00 },
            { codigo: "5.1.02", nombre: "Pérdidas por Mermas y Desperdicios", tipo: "Gasto", naturaleza: "Deudor", grupo: "Gastos Operacionales", saldoInicialUSD: 0.00 },
            { codigo: "5.2.01", nombre: "Gastos de Personal y Nómina Panadera", tipo: "Gasto", naturaleza: "Deudor", grupo: "Gastos Administrativos", saldoInicialUSD: 0.00 },
            { codigo: "5.2.02", nombre: "Servicios Públicos (Luz, Gas, Agua, Internet)", tipo: "Gasto", naturaleza: "Deudor", grupo: "Gastos Administrativos", saldoInicialUSD: 0.00 }
        ],

        rubrosContables: [
            {
                id: "RUB-001",
                nombre: "Compra de Materia Prima e Insumos (Harinas/Levaduras)",
                tipo: "Egreso",
                libro: "compras",
                cuentaDebeCodigo: "1.1.07",
                cuentaDebeNombre: "Inventario de Materia Prima y Harinas",
                cuentaHaberCodigo: "2.1.01",
                cuentaHaberNombre: "Cuentas por Pagar Proveedores (CxP)",
                glosaSugerida: "Compra de sacos de harina de trigo y levadura según factura proveedor",
                aplicaIVA: true,
                alicuotaIVA: 16,
                activo: true
            },
            {
                id: "RUB-002",
                nombre: "Venta Mostrador Panadería Tradicional (Exenta)",
                tipo: "Ingreso",
                libro: "ventas",
                cuentaDebeCodigo: "1.1.01",
                cuentaDebeNombre: "Caja Principal Efectivo USD ($)",
                cuentaHaberCodigo: "4.1.01",
                cuentaHaberNombre: "Ingresos por Ventas Panadería (Exentas IVA)",
                glosaSugerida: "Venta diaria de pan canilla, campesino y sobado en mostrador",
                aplicaIVA: false,
                alicuotaIVA: 0,
                activo: true
            },
            {
                id: "RUB-003",
                nombre: "Venta Pastelería Fina y Dulcería (Gravada 16%)",
                tipo: "Ingreso",
                libro: "ventas",
                cuentaDebeCodigo: "1.1.03",
                cuentaDebeNombre: "Banco Banesco C.A. (Cuenta Corriente Bs)",
                cuentaHaberCodigo: "4.1.02",
                cuentaHaberNombre: "Ingresos por Ventas Pastelería y Cafetería (Gravadas 16%)",
                glosaSugerida: "Venta de tortas frías, milhojas y pasteles finos por punto de venta",
                aplicaIVA: true,
                alicuotaIVA: 16,
                activo: true
            },
            {
                id: "RUB-004",
                nombre: "Pago Servicio Eléctrico Industrial (CORPOELEC)",
                tipo: "Egreso",
                libro: "egresos",
                cuentaDebeCodigo: "5.2.02",
                cuentaDebeNombre: "Servicios Públicos (Luz, Gas, Agua, Internet)",
                cuentaHaberCodigo: "1.1.03",
                cuentaHaberNombre: "Banco Banesco C.A. (Cuenta Corriente Bs)",
                glosaSugerida: "Pago de factura de energía eléctrica para hornos y cámaras de fermentación",
                aplicaIVA: false,
                alicuotaIVA: 0,
                activo: true
            },
            {
                id: "RUB-005",
                nombre: "Pago de Nómina Quincenal Operativa y Panaderos",
                tipo: "Egreso",
                libro: "egresos",
                cuentaDebeCodigo: "5.2.01",
                cuentaDebeNombre: "Gastos de Personal y Nómina Panadera",
                cuentaHaberCodigo: "1.1.04",
                cuentaHaberNombre: "Banco de Venezuela S.A. (Cuenta Corriente Bs)",
                glosaSugerida: "Dispersión de nómina quincenal a maestros panaderos y personal de atención",
                aplicaIVA: false,
                alicuotaIVA: 0,
                activo: true
            },
            {
                id: "RUB-006",
                nombre: "Merma por Pan No Conforme / Devolución / Pérdida",
                tipo: "Merma",
                libro: "mermas",
                cuentaDebeCodigo: "5.1.02",
                cuentaDebeNombre: "Pérdidas por Mermas y Desperdicios",
                cuentaHaberCodigo: "1.1.08",
                cuentaHaberNombre: "Inventario de Productos Terminados",
                glosaSugerida: "Baja contable por mermas de panadería y productos no conformes en vitrina",
                aplicaIVA: false,
                alicuotaIVA: 0,
                activo: true
            },
            {
                id: "RUB-007",
                nombre: "Mantenimiento Preventivo / Correctivo de Hornos y Amasadoras",
                tipo: "Egreso",
                libro: "egresos",
                cuentaDebeCodigo: "5.2.02",
                cuentaDebeNombre: "Servicios Públicos (Luz, Gas, Agua, Internet)",
                cuentaHaberCodigo: "1.1.01",
                cuentaHaberNombre: "Caja Principal Efectivo USD ($)",
                glosaSugerida: "Servicio técnico y sustitución de rodamientos en horno rotativo",
                aplicaIVA: false,
                alicuotaIVA: 0,
                activo: true
            },
            {
                id: "RUB-008",
                nombre: "Aporte / Ajuste de Capital y Superávit de Socios",
                tipo: "Ajuste",
                libro: "diario",
                cuentaDebeCodigo: "1.1.01",
                cuentaDebeNombre: "Caja Principal Efectivo USD ($)",
                cuentaHaberCodigo: "3.1.01",
                cuentaHaberNombre: "Capital Social Suscrito y Pagado",
                glosaSugerida: "Inyección de capital en efectivo para ampliación de inventarios y reservas",
                aplicaIVA: false,
                alicuotaIVA: 0,
                activo: true
            }
        ],

        asientosContables: [
            {
                id: "ASI-2026-0001",
                fecha: "2026-09-01T08:00:00.000Z",
                concepto: "Asiento de Apertura del Ejercicio Contable Mensual",
                tipo: "Apertura",
                documentoRef: "APERTURA-09",
                partidas: [
                    { cuentaCodigo: "1.1.01", cuentaNombre: "Caja Principal Efectivo USD ($)", debeUSD: 240.00, haberUSD: 0.00 },
                    { cuentaCodigo: "1.1.03", cuentaNombre: "Banco Banesco C.A. (Cuenta Corriente Bs)", debeUSD: 850.00, haberUSD: 0.00 },
                    { cuentaCodigo: "1.1.07", cuentaNombre: "Inventario de Materia Prima y Harinas", debeUSD: 1850.00, haberUSD: 0.00 },
                    { cuentaCodigo: "1.2.01", cuentaNombre: "Maquinaria, Hornos Rotativos y Amasadoras", debeUSD: 8500.00, haberUSD: 0.00 },
                    { cuentaCodigo: "2.1.01", cuentaNombre: "Cuentas por Pagar Proveedores (CxP)", debeUSD: 0.00, haberUSD: 245.00 },
                    { cuentaCodigo: "3.1.01", cuentaNombre: "Capital Social Suscrito y Pagado", debeUSD: 0.00, haberUSD: 10000.00 },
                    { cuentaCodigo: "3.1.02", cuentaNombre: "Resultados Acumulados / Superávit", debeUSD: 0.00, haberUSD: 1195.00 }
                ],
                totalDebeUSD: 11440.00,
                totalHaberUSD: 11440.00,
                cuadrado: true,
                usuario: "Gerente General"
            },
            {
                id: "ASI-2026-0002",
                fecha: "2026-09-03T18:30:00.000Z",
                concepto: "Registro Contable Diario de Ventas Mostrador POS (Factura BGF-001042)",
                tipo: "Venta",
                documentoRef: "VTA-1725380000",
                partidas: [
                    { cuentaCodigo: "1.1.01", cuentaNombre: "Caja Principal Efectivo USD ($)", debeUSD: 120.00, haberUSD: 0.00 },
                    { cuentaCodigo: "1.1.03", cuentaNombre: "Banco Banesco C.A. (Cuenta Corriente Bs)", debeUSD: 65.50, haberUSD: 0.00 },
                    { cuentaCodigo: "4.1.01", cuentaNombre: "Ingresos por Ventas Panadería (Exentas IVA)", debeUSD: 0.00, haberUSD: 110.00 },
                    { cuentaCodigo: "4.1.02", cuentaNombre: "Ingresos por Ventas Pastelería y Cafetería (Gravadas 16%)", debeUSD: 0.00, haberUSD: 65.09 },
                    { cuentaCodigo: "2.1.02", cuentaNombre: "Débito Fiscal IVA (16%)", debeUSD: 0.00, haberUSD: 10.41 }
                ],
                totalDebeUSD: 185.50,
                totalHaberUSD: 185.50,
                cuadrado: true,
                usuario: "María Contreras"
            },
            {
                id: "ASI-2026-0003",
                fecha: "2026-09-02T14:15:00.000Z",
                concepto: "Recepción de Orden de Compra OC-2026-081 a Molinos Nacionales C.A. (Factura 45892)",
                tipo: "Compra",
                documentoRef: "OC-2026-081",
                partidas: [
                    { cuentaCodigo: "1.1.07", cuentaNombre: "Inventario de Materia Prima y Harinas", debeUSD: 180.00, haberUSD: 0.00 },
                    { cuentaCodigo: "1.1.09", cuentaNombre: "Crédito Fiscal IVA (16%)", debeUSD: 12.80, haberUSD: 0.00 },
                    { cuentaCodigo: "2.1.01", cuentaNombre: "Cuentas por Pagar Proveedores (CxP)", debeUSD: 0.00, haberUSD: 192.80 }
                ],
                totalDebeUSD: 192.80,
                totalHaberUSD: 192.80,
                cuadrado: true,
                usuario: "Gerente General"
            },
            {
                id: "ASI-2026-0004",
                fecha: "2026-09-03T11:00:00.000Z",
                concepto: "Registro de Merma por Exceso de Fermentación en Masa Francés (MRM-9182)",
                tipo: "Merma",
                documentoRef: "MRM-9182",
                partidas: [
                    { cuentaCodigo: "5.1.02", cuentaNombre: "Pérdidas por Mermas y Desperdicios", debeUSD: 8.50, haberUSD: 0.00 },
                    { cuentaCodigo: "1.1.07", cuentaNombre: "Inventario de Materia Prima y Harinas", debeUSD: 0.00, haberUSD: 8.50 }
                ],
                totalDebeUSD: 8.50,
                totalHaberUSD: 8.50,
                cuadrado: true,
                usuario: "Carlos Rodríguez"
            }
        ],

        cierresCaja: [
            {
                id: "CIE-2026-0001",
                fechaCierre: "2026-09-03T20:00:00.000Z",
                turno: "Turno Tarde",
                cajeroNombre: "María Contreras",
                cajeroUsername: "cajero",
                reporteZNumero: "Z-000104",
                totalVentasUSD: 185.50,
                totalVentasBs: 6835.68,
                desgloseEsperado: {
                    efectivoUSD: 120.00,
                    efectivoBs: 0.00,
                    pagoMovilBs: 1500.00,
                    puntoVentaBs: 915.68,
                    zelleUSD: 0.00,
                    walletUSD: 0.00
                },
                desgloseFisico: {
                    efectivoUSD: 120.00,
                    efectivoBs: 0.00,
                    pagoMovilBs: 1500.00,
                    puntoVentaBs: 915.68,
                    zelleUSD: 0.00,
                    walletUSD: 0.00
                },
                diferenciaUSD: 0.00,
                estado: "Cuadrado",
                observaciones: "Cierre de turno sin discrepancias. Billetes USD verificados."
            }
        ],

        movimientosBanco: [
            {
                id: "MOV-BNC-001",
                banco: "Banesco",
                cuenta: "0134-0982-11-0001892341",
                tipo: "Credito",
                montoUSD: 12.00,
                montoBs: 442.20,
                fecha: "2026-09-03",
                referencia: "892011",
                concepto: "Pago Móvil Cliente Dr. Carlos Mendoza",
                estado: "conciliado",
                vinculoOrigen: "VTA-1725380000"
            },
            {
                id: "MOV-BNC-002",
                banco: "Banesco",
                cuenta: "0134-0982-11-0001892341",
                tipo: "Debito",
                montoUSD: 50.00,
                montoBs: 1842.50,
                fecha: "2026-09-03",
                referencia: "TR-774812",
                concepto: "Abono a Factura Proveedor Molinos Nacionales",
                estado: "conciliado",
                vinculoOrigen: "CXP-001"
            },
            {
                id: "MOV-BNC-003",
                banco: "Banco de Venezuela",
                cuenta: "0102-0441-22-0009182301",
                tipo: "Credito",
                montoUSD: 35.00,
                montoBs: 1289.75,
                fecha: "2026-09-02",
                referencia: "PM-448201",
                concepto: "Pago Móvil Encargo Torta Elena Gómez",
                estado: "conciliado",
                vinculoOrigen: "ENC-002"
            },
            {
                id: "MOV-BNC-004",
                banco: "Zelle",
                cuenta: "viasa.pagos@panaderianuevaviasa.com",
                tipo: "Credito",
                montoUSD: 85.00,
                montoBs: 3132.25,
                fecha: "2026-09-01",
                referencia: "ZLL-99201",
                concepto: "Abono Catering Corporativo Inversiones Bolívar",
                estado: "conciliado",
                vinculoOrigen: "ENC-001"
            },
            {
                id: "MOV-BNC-005",
                banco: "Banesco",
                cuenta: "0134-0982-11-0001892341",
                tipo: "Credito",
                montoUSD: 24.85,
                montoBs: 915.68,
                fecha: "2026-09-03",
                referencia: "POS-104928",
                concepto: "Lote Terminal Punto de Venta Banesco",
                estado: "pendiente",
                vinculoOrigen: "CIE-2026-0001"
            }
        ],

        retencionesIVA: [
            {
                id: "RET-2026-001",
                numeroComprobante: "20260900000001",
                fechaEmision: "2026-09-03",
                periodoFiscal: "2026-09",
                sujetoRetenido: "Molinos Nacionales C.A. (MONACA)",
                rifSujetoRetenido: "J-00012345-6",
                numeroFacturaAfectada: "45892",
                numeroControlFactura: "00-008921",
                totalFacturaUSD: 92.80,
                baseImponibleUSD: 80.00,
                impuestoIVAUSD: 12.80,
                porcentajeRetencion: 75,
                ivaRetenidoUSD: 9.60,
                ivaRetenidoBs: 353.76,
                tasaBCVAplicada: 36.85
            }
        ],

        kdsComandas: [
            {
                id: "KDS-101",
                loteId: "LOT-2026-0904-01",
                recetaId: "rec_canilla",
                productoNombre: "Pan Canilla Tradicional",
                icono: "fa-bread-slice",
                cantidadEsperada: 260,
                unidad: "unidades",
                sacosHarina: 1.0,
                estado: "horneando",
                prioridad: "alta",
                tiempoEstimadoMin: 22,
                tiempoRestanteSeg: 780,
                temperaturaHornoC: 220,
                panaderoAsignado: "Carlos Hernández",
                horaInicio: "07:15 AM",
                estacionActual: "Horno #1 Rotativo"
            },
            {
                id: "KDS-102",
                loteId: "LOT-2026-0904-02",
                recetaId: "rec_cachito",
                productoNombre: "Cachito de Jamón Superior",
                icono: "fa-wheat-awn",
                cantidadEsperada: 80,
                unidad: "unidades",
                sacosHarina: 0.25,
                estado: "fermentacion",
                prioridad: "urgente",
                tiempoEstimadoMin: 45,
                tiempoRestanteSeg: 1200,
                temperaturaHornoC: 190,
                panaderoAsignado: "Carlos Hernández",
                horaInicio: "07:30 AM",
                estacionActual: "Cámara de Fermentación #2"
            },
            {
                id: "KDS-103",
                loteId: "LOT-2026-0904-03",
                recetaId: "rec_frances",
                productoNombre: "Pan Francés / Sobado",
                icono: "fa-bread-slice",
                cantidadEsperada: 480,
                unidad: "unidades",
                sacosHarina: 1.0,
                estado: "amasado",
                prioridad: "normal",
                tiempoEstimadoMin: 18,
                tiempoRestanteSeg: 1080,
                temperaturaHornoC: 210,
                panaderoAsignado: "Miguel Rondón",
                horaInicio: "07:45 AM",
                estacionActual: "Amasadora Espiral 50kg"
            },
            {
                id: "KDS-104",
                loteId: "LOT-2026-0904-00",
                recetaId: "rec_croissant",
                productoNombre: "Croissant Hojaldrado de Mantequilla",
                icono: "fa-cookie-bite",
                cantidadEsperada: 60,
                unidad: "piezas",
                sacosHarina: 0.2,
                estado: "listo_despacho",
                prioridad: "alta",
                tiempoEstimadoMin: 18,
                tiempoRestanteSeg: 0,
                temperaturaHornoC: 185,
                panaderoAsignado: "Carlos Hernández",
                horaInicio: "06:40 AM",
                estacionActual: "Mostrador Caliente / Despacho"
            }
        ],

        empleados: [
            {
                id: "EMP-001",
                nombreCompleto: "Gerente General",
                cedula: "V-14.892.110",
                rif: "V14892110-0",
                rol: "admin",
                cargo: "Administrador / Gerente de Tienda",
                departamento: "administracion",
                fechaNacimiento: "1983-05-14",
                direccion: "Av. España con Calle Bolívar, La Sabanita, Ciudad Bolívar",
                telefono: "0414-1234567",
                whatsapp: "0414-1234567",
                email: "gerencia@panaderianuevaviasa.com",
                contactoEmergencia: { nombre: "Rosaura Salazar", parentesco: "Cónyuge", telefono: "0414-9871122" },
                cargasFamiliares: 2,
                fechaIngreso: "2021-01-15",
                tipoContrato: "Tiempo Indeterminado",
                turno: "diurno",
                horarioTexto: "07:30 AM - 04:30 PM (Lunes a Sábado)",
                pinFichaje: "1001",
                salarioBaseUSD: 480.00,
                comisionPorc: 2.0,
                bonoPuntualidadUSD: 50.00,
                bonoCestaTicketUSD: 40.00,
                datosBancarios: { banco: "Banco de Venezuela", tipo: "Corriente", cuenta: "0102-0450-21-0000189211", pagoMovil: "04141234567 / V-14892110" },
                certificadoSalud: { numeroFolio: "CS-2026-BOL-0112", fechaEmision: "2026-01-10", fechaVencimiento: "2027-01-10", estado: "vigente" },
                manipulacionAlimentos: { numeroRegistro: "MA-MPPS-2025-1044", fechaEmision: "2025-06-20", fechaVencimiento: "2026-06-20", estado: "vigente", ente: "MPPS / INHRR" },
                registroIVSS: "IVSS-TIUNA-14892110",
                historialDisciplinario: [],
                reconocimientos: [
                    { id: "REC-01", fecha: "2025-12-28", titulo: "Liderazgo Operativo Extraordinario", motivo: "Excelente coordinación en temporada navideña 2025", premioUSD: 100.00 }
                ],
                vacaciones: { diasAcumuladosTotales: 76, diasDisfrutados: 60, diasPendientes: 16, periodoActual: "2025-2026" },
                estado: "activo",
                avatar: "fa-user-tie",
                foto: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&h=400&q=80"
            },
            {
                id: "EMP-002",
                nombreCompleto: "María Contreras",
                cedula: "V-22.341.980",
                rif: "V22341980-4",
                rol: "caja",
                cargo: "Operadora de Caja Principal",
                departamento: "mostrador_caja",
                fechaNacimiento: "1994-09-22",
                direccion: "Sector Los Próceres, Calle Sucre Casa #14, Ciudad Bolívar",
                telefono: "0424-9876543",
                whatsapp: "0424-9876543",
                email: "m.contreras@gmail.com",
                contactoEmergencia: { nombre: "José Contreras", parentesco: "Padre", telefono: "0416-5544332" },
                cargasFamiliares: 1,
                fechaIngreso: "2022-06-01",
                tipoContrato: "Tiempo Indeterminado",
                turno: "diurno",
                horarioTexto: "06:30 AM - 02:30 PM (Lunes a Sábado)",
                pinFichaje: "2002",
                salarioBaseUSD: 290.00,
                comisionPorc: 1.5,
                bonoPuntualidadUSD: 35.00,
                bonoCestaTicketUSD: 40.00,
                datosBancarios: { banco: "Banesco", tipo: "Corriente", cuenta: "0134-0820-11-0000451290", pagoMovil: "04249876543 / V-22341980" },
                certificadoSalud: { numeroFolio: "CS-2026-BOL-0498", fechaEmision: "2026-03-05", fechaVencimiento: "2027-03-05", estado: "vigente" },
                manipulacionAlimentos: { numeroRegistro: "MA-MPPS-2025-2201", fechaEmision: "2025-09-12", fechaVencimiento: "2026-09-12", estado: "vigente", ente: "MPPS / INHRR" },
                registroIVSS: "IVSS-TIUNA-22341980",
                historialDisciplinario: [],
                reconocimientos: [
                    { id: "REC-02", fecha: "2026-02-14", titulo: "Precisión en Arqueo y Atención al Cliente", motivo: "Cero descuadres de caja y alta valoración en CRM", premioUSD: 30.00 }
                ],
                vacaciones: { diasAcumuladosTotales: 50, diasDisfrutados: 32, diasPendientes: 18, periodoActual: "2025-2026" },
                estado: "activo",
                avatar: "fa-cash-register",
                foto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=400&q=80"
            },
            {
                id: "EMP-003",
                nombreCompleto: "Carlos Hernández",
                cedula: "V-18.765.432",
                rif: "V18765432-8",
                rol: "panadero",
                cargo: "Maestro Panadero Jefe",
                departamento: "produccion",
                fechaNacimiento: "1988-11-03",
                direccion: "Barrio Ajuro, Calle Guzmán Blanco, Ciudad Bolívar",
                telefono: "0412-5551234",
                whatsapp: "0412-5551234",
                email: "carlospanadero@gmail.com",
                contactoEmergencia: { nombre: "Elena Méndez", parentesco: "Esposa", telefono: "0414-8899771" },
                cargasFamiliares: 3,
                fechaIngreso: "2021-03-10",
                tipoContrato: "Tiempo Indeterminado",
                turno: "nocturno_madrugada",
                horarioTexto: "03:00 AM - 10:00 AM (Lunes a Domingo con rotativo)",
                pinFichaje: "3003",
                salarioBaseUSD: 390.00,
                comisionPorc: 0.0,
                bonoSacoHarinaUSD: 3.50,
                bonoPuntualidadUSD: 40.00,
                bonoCestaTicketUSD: 40.00,
                recargoNocturnoPorc: 30.0,
                datosBancarios: { banco: "Banco Mercantil", tipo: "Ahorro", cuenta: "0105-0144-88-0000781234", pagoMovil: "04125551234 / V-18765432" },
                certificadoSalud: { numeroFolio: "CS-2026-BOL-0031", fechaEmision: "2026-02-01", fechaVencimiento: "2027-02-01", estado: "vigente" },
                manipulacionAlimentos: { numeroRegistro: "MA-MPPS-2025-0819", fechaEmision: "2025-05-18", fechaVencimiento: "2026-05-18", estado: "vigente", ente: "MPPS / INHRR" },
                registroIVSS: "IVSS-TIUNA-18765432",
                historialDisciplinario: [],
                reconocimientos: [
                    { id: "REC-03", fecha: "2026-01-10", titulo: "Maestro Artesano Panadero", motivo: "Excelente rendimiento en formulación y horneado de Canillas y Sobados", premioUSD: 60.00 }
                ],
                vacaciones: { diasAcumuladosTotales: 76, diasDisfrutados: 59, diasPendientes: 17, periodoActual: "2025-2026" },
                estado: "activo",
                avatar: "fa-fire-burner",
                foto: "https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=400&h=400&q=80"
            },
            {
                id: "EMP-004",
                nombreCompleto: "José Gregorio Morales",
                cedula: "V-26.112.540",
                rif: "V26112540-1",
                rol: "caja",
                cargo: "Vendedor de Salón / Preventa",
                departamento: "mostrador_caja",
                fechaNacimiento: "1998-04-12",
                direccion: "Urb. Vista Hermosa, Mz 12 Casa 8, Ciudad Bolívar",
                telefono: "0416-8884321",
                whatsapp: "0416-8884321",
                email: "jose.morales98@gmail.com",
                contactoEmergencia: { nombre: "Carmen Morales", parentesco: "Madre", telefono: "0416-7788990" },
                cargasFamiliares: 0,
                fechaIngreso: "2023-08-15",
                tipoContrato: "Tiempo Indeterminado",
                turno: "diurno",
                horarioTexto: "07:00 AM - 03:00 PM (Lunes a Sábado)",
                pinFichaje: "4004",
                salarioBaseUSD: 250.00,
                comisionPorc: 2.5,
                bonoPuntualidadUSD: 30.00,
                bonoCestaTicketUSD: 40.00,
                datosBancarios: { banco: "Banco de Venezuela", tipo: "Ahorro", cuenta: "0102-0991-33-0000881920", pagoMovil: "04168884321 / V-26112540" },
                certificadoSalud: { numeroFolio: "CS-2026-BOL-0891", fechaEmision: "2025-10-10", fechaVencimiento: "2026-10-10", estado: "vigente" },
                manipulacionAlimentos: { numeroRegistro: "MA-MPPS-2025-3410", fechaEmision: "2025-11-04", fechaVencimiento: "2026-11-04", estado: "vigente", ente: "MPPS / INHRR" },
                registroIVSS: "IVSS-TIUNA-26112540",
                historialDisciplinario: [
                    { id: "AMON-01", fecha: "2025-10-22", tipo: "Llamado de Atención Verbal", motivo: "Retardo injustificado de 15 minutos en apertura", articuloLOTTT: "Art. 86 LOTTT", emisor: "Gerencia General" }
                ],
                reconocimientos: [
                    { id: "REC-04", fecha: "2026-03-01", titulo: "Récord de Preventas en Salón", motivo: "Mayor volumen de pre-tickets emitidos en hora pico matutina", premioUSD: 35.00 }
                ],
                vacaciones: { diasAcumuladosTotales: 32, diasDisfrutados: 15, diasPendientes: 17, periodoActual: "2025-2026" },
                estado: "activo",
                avatar: "fa-mobile-screen",
                foto: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&h=400&q=80"
            },
            {
                id: "EMP-005",
                nombreCompleto: "Daniela Salazar",
                cedula: "V-24.908.120",
                rif: "V24908120-7",
                rol: "repostero",
                cargo: "Maestra Pastelera y Repostera",
                departamento: "pasteleria",
                fechaNacimiento: "1996-07-18",
                direccion: "Av. República, Res. Angostura Apto 3B, Ciudad Bolívar",
                telefono: "0414-7766554",
                whatsapp: "0414-7766554",
                email: "daniela.pasteles@gmail.com",
                contactoEmergencia: { nombre: "Marcos Salazar", parentesco: "Hermano", telefono: "0424-6655441" },
                cargasFamiliares: 1,
                fechaIngreso: "2022-09-01",
                tipoContrato: "Tiempo Indeterminado",
                turno: "diurno",
                horarioTexto: "07:00 AM - 03:00 PM (Lunes a Sábado)",
                pinFichaje: "5005",
                salarioBaseUSD: 360.00,
                comisionPorc: 3.0,
                bonoPuntualidadUSD: 35.00,
                bonoCestaTicketUSD: 40.00,
                datosBancarios: { banco: "Banco Provincial", tipo: "Corriente", cuenta: "0108-0112-90-0000334455", pagoMovil: "04147766554 / V-24908120" },
                certificadoSalud: { numeroFolio: "CS-2026-BOL-0772", fechaEmision: "2026-02-15", fechaVencimiento: "2027-02-15", estado: "vigente" },
                manipulacionAlimentos: { numeroRegistro: "MA-MPPS-2025-1889", fechaEmision: "2025-08-20", fechaVencimiento: "2026-08-20", estado: "vigente", ente: "MPPS / INHRR" },
                registroIVSS: "IVSS-TIUNA-24908120",
                historialDisciplinario: [],
                reconocimientos: [
                    { id: "REC-05", fecha: "2026-02-15", titulo: "Excelencia en Tortas y Hojaldres", motivo: "Innovación en acabado de Milhojas y Selva Negra", premioUSD: 45.00 }
                ],
                vacaciones: { diasAcumuladosTotales: 49, diasDisfrutados: 31, diasPendientes: 18, periodoActual: "2025-2026" },
                estado: "activo",
                avatar: "fa-cake-candles",
                foto: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&h=400&q=80"
            },
            {
                id: "EMP-006",
                nombreCompleto: "Luis Eduardo Rivas",
                cedula: "V-20.450.670",
                rif: "V20450670-3",
                rol: "panadero",
                cargo: "Maestro Hornero / Auxiliar de Amasado",
                departamento: "produccion",
                fechaNacimiento: "1991-12-05",
                direccion: "Sector Agua Salada, Calle 4 Casa #28, Ciudad Bolívar",
                telefono: "0426-3332211",
                whatsapp: "0426-3332211",
                email: "luisrivas.hornos@gmail.com",
                contactoEmergencia: { nombre: "Teresa Rivas", parentesco: "Madre", telefono: "0426-1110099" },
                cargasFamiliares: 2,
                fechaIngreso: "2023-01-20",
                tipoContrato: "Tiempo Indeterminado",
                turno: "nocturno_madrugada",
                horarioTexto: "03:30 AM - 10:30 AM (Lunes a Domingo con rotativo)",
                pinFichaje: "6006",
                salarioBaseUSD: 330.00,
                comisionPorc: 0.0,
                bonoSacoHarinaUSD: 2.50,
                bonoPuntualidadUSD: 35.00,
                bonoCestaTicketUSD: 40.00,
                recargoNocturnoPorc: 30.0,
                datosBancarios: { banco: "Banco de Venezuela", tipo: "Corriente", cuenta: "0102-0551-77-0000992211", pagoMovil: "04263332211 / V-20450670" },
                certificadoSalud: { numeroFolio: "CS-2026-BOL-0633", fechaEmision: "2025-11-20", fechaVencimiento: "2026-11-20", estado: "vigente" },
                manipulacionAlimentos: { numeroRegistro: "MA-MPPS-2025-4011", fechaEmision: "2025-07-10", fechaVencimiento: "2026-07-10", estado: "vigente", ente: "MPPS / INHRR" },
                registroIVSS: "IVSS-TIUNA-20450670",
                historialDisciplinario: [],
                reconocimientos: [
                    { id: "REC-06", fecha: "2025-12-30", titulo: "Control de Calidad en Horneado", motivo: "Cero piezas quemadas en hornos rotativos durante alta demanda", premioUSD: 40.00 }
                ],
                vacaciones: { diasAcumuladosTotales: 33, diasDisfrutados: 16, diasPendientes: 17, periodoActual: "2025-2026" },
                estado: "activo",
                avatar: "fa-bread-slice",
                foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80"
            },
            {
                id: "EMP-007",
                nombreCompleto: "Carmen Elena Mendoza",
                cedula: "V-19.123.890",
                rif: "V19123890-9",
                rol: "cocinero",
                cargo: "Cocinera / Desayunos y Cafetería",
                departamento: "cocina",
                fechaNacimiento: "1989-08-30",
                direccion: "Calle Libertad, Casco Histórico, Ciudad Bolívar",
                telefono: "0412-4447788",
                whatsapp: "0412-4447788",
                email: "carmen.desayunos@gmail.com",
                contactoEmergencia: { nombre: "Andrés Mendoza", parentesco: "Esposo", telefono: "0412-9988776" },
                cargasFamiliares: 2,
                fechaIngreso: "2022-11-15",
                tipoContrato: "Tiempo Indeterminado",
                turno: "diurno",
                horarioTexto: "06:00 AM - 02:00 PM (Lunes a Sábado)",
                pinFichaje: "7007",
                salarioBaseUSD: 310.00,
                comisionPorc: 2.0,
                bonoPuntualidadUSD: 35.00,
                bonoCestaTicketUSD: 40.00,
                datosBancarios: { banco: "Bancaribe", tipo: "Corriente", cuenta: "0114-0230-66-0000112233", pagoMovil: "04124447788 / V-19123890" },
                certificadoSalud: { numeroFolio: "CS-2026-BOL-0512", fechaEmision: "2026-01-25", fechaVencimiento: "2027-01-25", estado: "vigente" },
                manipulacionAlimentos: { numeroRegistro: "MA-MPPS-2025-2890", fechaEmision: "2025-10-15", fechaVencimiento: "2026-10-15", estado: "vigente", ente: "MPPS / INHRR" },
                registroIVSS: "IVSS-TIUNA-19123890",
                historialDisciplinario: [],
                reconocimientos: [
                    { id: "REC-07", fecha: "2026-01-28", titulo: "Sabor y Rapidez en Desayunos", motivo: "Excelente preparación de empanadas de cazón y cachapas", premioUSD: 35.00 }
                ],
                vacaciones: { diasAcumuladosTotales: 48, diasDisfrutados: 31, diasPendientes: 17, periodoActual: "2025-2026" },
                estado: "activo",
                avatar: "fa-utensils",
                foto: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&h=400&q=80"
            },
            {
                id: "EMP-008",
                nombreCompleto: "Anthony Valenzuela",
                cedula: "V-27.890.340",
                rif: "V27890340-2",
                rol: "repartidor",
                cargo: "Chofer Repartidor / Delivery y Despacho",
                departamento: "despacho",
                fechaNacimiento: "2000-02-14",
                direccion: "Urb. Los Coquitos, Bloque 4, Ciudad Bolívar",
                telefono: "0414-9993322",
                whatsapp: "0414-9993322",
                email: "anthony.delivery@gmail.com",
                contactoEmergencia: { nombre: "Gladys Valenzuela", parentesco: "Madre", telefono: "0414-8882211" },
                cargasFamiliares: 0,
                fechaIngreso: "2024-02-01",
                tipoContrato: "Tiempo Indeterminado",
                turno: "mixto",
                horarioTexto: "08:00 AM - 04:00 PM (Lunes a Sábado)",
                pinFichaje: "8008",
                salarioBaseUSD: 240.00,
                comisionPorc: 3.5,
                bonoPuntualidadUSD: 30.00,
                bonoCestaTicketUSD: 40.00,
                datosBancarios: { banco: "Banco Nacional de Crédito (BNC)", tipo: "Corriente", cuenta: "0191-0021-44-0000556677", pagoMovil: "04149993322 / V-27890340" },
                certificadoSalud: { numeroFolio: "CS-2026-BOL-0994", fechaEmision: "2025-09-01", fechaVencimiento: "2026-09-01", estado: "vigente" },
                manipulacionAlimentos: { numeroRegistro: "MA-MPPS-2025-5120", fechaEmision: "2025-09-10", fechaVencimiento: "2026-09-10", estado: "vigente", ente: "MPPS / INHRR" },
                registroIVSS: "IVSS-TIUNA-27890340",
                historialDisciplinario: [],
                reconocimientos: [
                    { id: "REC-08", fecha: "2026-02-28", titulo: "Puntualidad en Entregas Corporativas", motivo: "Cero quejas en despachos a abastos y restaurantes", premioUSD: 30.00 }
                ],
                vacaciones: { diasAcumuladosTotales: 31, diasDisfrutados: 15, diasPendientes: 16, periodoActual: "2025-2026" },
                estado: "activo",
                avatar: "fa-truck-fast",
                foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=400&q=80"
            },
            {
                id: "EMP-009",
                nombreCompleto: "Rosaura Medina",
                cedula: "V-17.654.321",
                rif: "V17654321-5",
                rol: "mantenimiento",
                cargo: "Auxiliar de Mantenimiento y Limpieza Integral",
                departamento: "mantenimiento",
                fechaNacimiento: "1986-06-25",
                direccion: "Sector Cruz Verde, Calle Miranda Casa #50, Ciudad Bolívar",
                telefono: "0424-8887766",
                whatsapp: "0424-8887766",
                email: "rosaura.medina@gmail.com",
                contactoEmergencia: { nombre: "Carlos Medina", parentesco: "Hijo", telefono: "0424-5556644" },
                cargasFamiliares: 2,
                fechaIngreso: "2022-03-01",
                tipoContrato: "Tiempo Indeterminado",
                turno: "diurno",
                horarioTexto: "06:00 AM - 02:00 PM (Lunes a Sábado)",
                pinFichaje: "9009",
                salarioBaseUSD: 260.00,
                comisionPorc: 0.0,
                bonoPuntualidadUSD: 35.00,
                bonoCestaTicketUSD: 40.00,
                datosBancarios: { banco: "Banco de Venezuela", tipo: "Ahorro", cuenta: "0102-0881-22-0000778899", pagoMovil: "04248887766 / V-17654321" },
                certificadoSalud: { numeroFolio: "CS-2026-BOL-0341", fechaEmision: "2026-01-18", fechaVencimiento: "2027-01-18", estado: "vigente" },
                manipulacionAlimentos: { numeroRegistro: "MA-MPPS-2025-1550", fechaEmision: "2025-06-12", fechaVencimiento: "2026-06-12", estado: "vigente", ente: "MPPS / INHRR" },
                registroIVSS: "IVSS-TIUNA-17654321",
                historialDisciplinario: [],
                reconocimientos: [
                    { id: "REC-09", fecha: "2026-01-15", titulo: "Higiene y Desinfección Impecable", motivo: "Excelente mantenimiento de áreas de amasado y hornos bajo normas sanitarias", premioUSD: 35.00 }
                ],
                vacaciones: { diasAcumuladosTotales: 50, diasDisfrutados: 33, diasPendientes: 17, periodoActual: "2025-2026" },
                estado: "activo",
                avatar: "fa-broom",
                foto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&h=400&q=80"
            }
        ],

        fichajesAsistencia: [
            {
                id: "FIC-260906-01",
                empleadoId: "EMP-003",
                nombreEmpleado: "Carlos Hernández",
                cargo: "Maestro Panadero Jefe",
                departamento: "produccion",
                turno: "nocturno_madrugada",
                fecha: "2026-09-06",
                horaEntrada: "03:00 AM",
                horaSalida: "10:00 AM",
                tipo: "salida",
                estadoPuntualidad: "puntual",
                horasOrdinarias: 7.0,
                horasExtrasDiurnas: 0.0,
                horasExtrasNocturnas: 0.0,
                horasNocturnas: 7.0,
                recargoNocturnoUSD: 4.09,
                esFeriado: false,
                observacion: "Turno madrugada amasado y horneado de Canillas y Gallego"
            },
            {
                id: "FIC-260906-02",
                empleadoId: "EMP-006",
                nombreEmpleado: "Luis Eduardo Rivas",
                cargo: "Maestro Hornero / Auxiliar",
                departamento: "produccion",
                turno: "nocturno_madrugada",
                fecha: "2026-09-06",
                horaEntrada: "03:30 AM",
                horaSalida: "10:30 AM",
                tipo: "salida",
                estadoPuntualidad: "puntual",
                horasOrdinarias: 7.0,
                horasExtrasDiurnas: 0.0,
                horasExtrasNocturnas: 0.0,
                horasNocturnas: 7.0,
                recargoNocturnoUSD: 3.46,
                esFeriado: false,
                observacion: "Control de hornos rotativos en madrugada"
            },
            {
                id: "FIC-260906-03",
                empleadoId: "EMP-007",
                nombreEmpleado: "Carmen Elena Mendoza",
                cargo: "Cocinera / Desayunos",
                departamento: "cocina",
                turno: "diurno",
                fecha: "2026-09-06",
                horaEntrada: "06:00 AM",
                horaSalida: null,
                tipo: "entrada",
                estadoPuntualidad: "puntual",
                horasOrdinarias: 4.5,
                horasExtrasDiurnas: 0.0,
                horasExtrasNocturnas: 0.0,
                horasNocturnas: 0.0,
                recargoNocturnoUSD: 0.00,
                esFeriado: false,
                observacion: "Apertura cafetería y empanadas matutinas"
            },
            {
                id: "FIC-260906-04",
                empleadoId: "EMP-002",
                nombreEmpleado: "María Contreras",
                cargo: "Operadora de Caja Principal",
                departamento: "mostrador_caja",
                turno: "diurno",
                fecha: "2026-09-06",
                horaEntrada: "06:30 AM",
                horaSalida: null,
                tipo: "entrada",
                estadoPuntualidad: "puntual",
                horasOrdinarias: 4.0,
                horasExtrasDiurnas: 0.0,
                horasExtrasNocturnas: 0.0,
                horasNocturnas: 0.0,
                recargoNocturnoUSD: 0.00,
                esFeriado: false,
                observacion: "Apertura de caja #1 y sincronización fiscal"
            },
            {
                id: "FIC-260906-05",
                empleadoId: "EMP-004",
                nombreEmpleado: "José Gregorio Morales",
                cargo: "Vendedor de Salón / Preventa",
                departamento: "mostrador_caja",
                turno: "diurno",
                fecha: "2026-09-06",
                horaEntrada: "07:00 AM",
                horaSalida: null,
                tipo: "entrada",
                estadoPuntualidad: "puntual",
                horasOrdinarias: 3.5,
                horasExtrasDiurnas: 0.0,
                horasExtrasNocturnas: 0.0,
                horasNocturnas: 0.0,
                recargoNocturnoUSD: 0.00,
                esFeriado: false,
                observacion: "Inicio preventas rompefilas salón"
            },
            {
                id: "FIC-260906-06",
                empleadoId: "EMP-005",
                nombreEmpleado: "Daniela Salazar",
                cargo: "Maestra Pastelera y Repostera",
                departamento: "pasteleria",
                turno: "diurno",
                fecha: "2026-09-06",
                horaEntrada: "07:00 AM",
                horaSalida: null,
                tipo: "entrada",
                estadoPuntualidad: "puntual",
                horasOrdinarias: 3.5,
                horasExtrasDiurnas: 0.0,
                horasExtrasNocturnas: 0.0,
                horasNocturnas: 0.0,
                recargoNocturnoUSD: 0.00,
                esFeriado: false,
                observacion: "Montaje vitrina fría y dulces fríos"
            },
            {
                id: "FIC-260906-07",
                empleadoId: "EMP-001",
                nombreEmpleado: "Gerente General",
                cargo: "Administrador / Gerente",
                departamento: "administracion",
                turno: "diurno",
                fecha: "2026-09-06",
                horaEntrada: "07:30 AM",
                horaSalida: null,
                tipo: "entrada",
                estadoPuntualidad: "puntual",
                horasOrdinarias: 3.0,
                horasExtrasDiurnas: 0.0,
                horasExtrasNocturnas: 0.0,
                horasNocturnas: 0.0,
                recargoNocturnoUSD: 0.00,
                esFeriado: false,
                observacion: "Supervisión general y cuadre de tasas"
            }
        ],

        permisosRepososIVSS: [
            {
                id: "REP-2026-01",
                empleadoId: "EMP-003",
                nombreEmpleado: "Carlos Hernández",
                tipoPermiso: "Reposo Médico IVSS",
                tipoClasificacion: "justificada",
                fechaInicio: "2026-05-12",
                fechaFin: "2026-05-15",
                dias: 3,
                motivo: "Lumbalgia mecánica aguda por esfuerzo",
                numSoporte: "Forma 14-73 IVSS #902148",
                enteEmisor: "Hospital Dr. Héctor Nouel Joubert (IVSS)",
                pagoRemunerado: true,
                estado: "cumplido"
            },
            {
                id: "REP-2026-02",
                empleadoId: "EMP-008",
                nombreEmpleado: "Anthony Valenzuela",
                tipoPermiso: "Licencia por Estudio / Examen",
                tipoClasificacion: "justificada",
                fechaInicio: "2026-07-20",
                fechaFin: "2026-07-20",
                dias: 1,
                motivo: "Presentación de prueba académica universitaria",
                numSoporte: "Constancia UDO #2026-A1",
                enteEmisor: "Universidad de Oriente (UDO)",
                pagoRemunerado: true,
                estado: "cumplido"
            }
        ],

        vacacionesProgramadas: [
            {
                id: "VAC-2026-01",
                empleadoId: "EMP-002",
                nombreEmpleado: "María Contreras",
                cargo: "Operadora de Caja Principal",
                periodoCorrespondiente: "2024-2025",
                antiguedadAnios: 3,
                diasDisfruteLegal: 17,
                diasBonoVacacional: 17,
                fechaInicio: "2026-10-01",
                fechaFin: "2026-10-21",
                salarioBaseDiarioUSD: 9.67,
                montoSalarioVacacionesUSD: 164.39,
                montoBonoVacacionalUSD: 164.39,
                totalLiquidacionVacacionesUSD: 328.78,
                totalBs: 12115.54,
                tasaBCV: 36.85,
                estado: "programada",
                observacion: "Programación aprobada por Gerencia"
            }
        ],

        liquidacionesLOTTT: [
            {
                id: "LIQ-2026-001",
                empleadoId: "EMP-EX-01",
                nombreEmpleado: "Ramón Antonio Castillo",
                cedula: "V-16.554.890",
                cargo: "Panadero de Mesa / Masero",
                fechaIngreso: "2023-01-10",
                fechaEgreso: "2026-08-30",
                antiguedadAnios: 3,
                antiguedadMeses: 7,
                antiguedadDias: 20,
                motivoRetiro: "Retiro Voluntario (Renuncia Justificada)",
                tipoTerminacion: "retiro_voluntario",
                salarioBaseMensualUSD: 340.00,
                salarioBaseDiarioUSD: 11.33,
                alicuotaBonoVacacionalDiarioUSD: 0.53,
                alicuotaUtilidadesDiarioUSD: 0.94,
                salarioIntegralDiarioUSD: 12.80,
                diasGarantiaPrestaciones: 215,
                montoGarantiaUSD: 2752.00,
                diasRetroactivoPrestaciones: 105,
                montoRetroactivoUSD: 1344.00,
                montoPrestacionesDefinitivoUSD: 2752.00,
                interesesPrestacionesUSD: 148.50,
                vacacionesFraccionadasUSD: 66.11,
                bonoVacacionalFraccionadoUSD: 66.11,
                utilidadesFraccionadasUSD: 85.33,
                indemnizacionDespidoArt92USD: 0.00,
                indemnizacionPreavisoUSD: 0.00,
                totalLiquidacionUSD: 3118.05,
                totalLiquidacionBs: 114900.14,
                tasaBCV: 36.85,
                fechaLiquidacion: "2026-08-31",
                hashIntegridad: "8f7e2a9b4c1d6e3f5a0b7c8d9e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f",
                archivoLocalPath: "C:\\Users\\Usuario\\VIASA System\\Expedientes_Personal\\LIQ-2026-001_Ramon_Castillo.html"
            }
        ],

        bancoMemoriaRRHH: [
            {
                id: "MEM-RRHH-001",
                tipoDocumento: "expediente_digital",
                titulo: "Expediente Digital HD - Carlos Hernández (Maestro Panadero)",
                empleadoId: "EMP-003",
                nombreEmpleado: "Carlos Hernández",
                cedula: "V-18.765.432",
                cargo: "Maestro Panadero Jefe",
                departamento: "produccion",
                fechaArchivo: "2026-09-01T08:00:00Z",
                fechaLegible: "01/09/2026 08:00 AM",
                hashCrypto: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                rutaLocal: "C:\\Users\\Usuario\\VIASA System\\Expedientes_Personal\\EXP-EMP-003_Carlos_Hernandez.html",
                estado: "inalterable",
                tamanoKB: 24.5
            },
            {
                id: "MEM-RRHH-002",
                tipoDocumento: "constancia_trabajo",
                titulo: "Constancia de Trabajo Oficial - María Contreras",
                empleadoId: "EMP-002",
                nombreEmpleado: "María Contreras",
                cedula: "V-22.341.980",
                cargo: "Operadora de Caja Principal",
                departamento: "mostrador_caja",
                fechaArchivo: "2026-09-02T10:30:00Z",
                fechaLegible: "02/09/2026 10:30 AM",
                hashCrypto: "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e",
                rutaLocal: "C:\\Users\\Usuario\\VIASA System\\Expedientes_Personal\\CONST-EMP-002_Maria_Contreras.html",
                estado: "inalterable",
                tamanoKB: 18.2
            },
            {
                id: "MEM-RRHH-003",
                tipoDocumento: "liquidacion_lottt",
                titulo: "Finiquito y Liquidación LOTTT - Ramón Castillo",
                empleadoId: "EMP-EX-01",
                nombreEmpleado: "Ramón Antonio Castillo",
                cedula: "V-16.554.890",
                cargo: "Panadero de Mesa / Masero",
                departamento: "produccion",
                fechaArchivo: "2026-08-31T17:00:00Z",
                fechaLegible: "31/08/2026 05:00 PM",
                hashCrypto: "8f7e2a9b4c1d6e3f5a0b7c8d9e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f",
                rutaLocal: "C:\\Users\\Usuario\\VIASA System\\Expedientes_Personal\\LIQ-2026-001_Ramon_Castillo.html",
                estado: "inalterable",
                tamanoKB: 32.8
            }
        ],

        preventasRompefilas: [
            {
                id: "PF-101",
                cliente: "Pedro Pérez (En Fila)",
                clienteRIF: "V-19842100",
                vendedorId: "EMP-004",
                vendedorNombre: "José Gregorio Morales",
                hora: "07:42 AM",
                items: [
                    { id: "PRD-001", nombre: "Pan Canilla Tradicional", cantidad: 4, precioUSD: 0.50 },
                    { id: "PRD-003", nombre: "Cachito de Jamón Superior", cantidad: 2, precioUSD: 1.80 }
                ],
                totalUSD: 5.60,
                totalBs: 206.36,
                estado: "pendiente_cobro"
            }
        ],

        repartidores: [
            {
                id: "REP-01",
                nombre: "Carlos Eduardo Mendoza",
                cedula: "V-22.941.802",
                telefono: "0412-5551122",
                vehiculo: "Moto Bera SBR 150 (Azul - Placa AB1C23D)",
                estado: "disponible",
                entregasTotales: 148,
                calificacion: 4.9,
                zonaAsignada: "Sector Las Delicias / El Castaño"
            },
            {
                id: "REP-02",
                nombre: "Luis Alejandro Morales",
                cedula: "V-25.109.433",
                telefono: "0414-9988771",
                vehiculo: "Moto Empire Keeway Horse (Roja - Placa XY8Z90A)",
                estado: "en_ruta",
                entregasTotales: 112,
                calificacion: 4.8,
                zonaAsignada: "Urb. San Jacinto / La Soledad"
            },
            {
                id: "REP-03",
                nombre: "José Gregorio Rivas",
                cedula: "V-20.485.612",
                telefono: "0416-3344556",
                vehiculo: "Bicicleta Eléctrica Cargo",
                estado: "disponible",
                entregasTotales: 85,
                calificacion: 4.9,
                zonaAsignada: "Casco Central / Av. Bolívar"
            }
        ],

        despachosDelivery: [
            {
                id: "DESP-101",
                comandaId: "PED-DEL-501",
                clienteNombre: "Dra. Valentina Gómez",
                clienteTelefono: "0414-1234567",
                direccionEntrega: "Res. El Bosque, Apto 4-B, Urb. La Soledad",
                zonaSector: "La Soledad",
                repartidorId: "REP-02",
                repartidorNombre: "Luis Alejandro Morales",
                items: [
                    { productoId: "PRD-001", nombre: "Pan Canilla Tradicional", cantidad: 6, precioUnitarioUSD: 0.50, subtotalUSD: 3.00 },
                    { productoId: "PRD-003", nombre: "Cachito de Jamón Superior", cantidad: 4, precioUnitarioUSD: 1.80, subtotalUSD: 7.20 },
                    { productoId: "PRD-005", nombre: "Café con Leche Grande", cantidad: 2, precioUnitarioUSD: 1.50, subtotalUSD: 3.00 }
                ],
                subtotalUSD: 13.20,
                costoFleteUSD: 2.50,
                totalUSD: 15.70,
                totalVES: 578.55,
                metodoPagoContraEntrega: "PAGO_MOVIL",
                estado: "en_ruta",
                horaSalida: "07:45 AM",
                tiempoEstimadoMin: 20,
                horaEntrega: null,
                notaDespacho: "Timbre 4B, dejar en garita si no responde"
            },
            {
                id: "DESP-102",
                comandaId: "PED-DEL-502",
                clienteNombre: "Lic. Fernando Andrade",
                clienteTelefono: "0424-9876543",
                direccionEntrega: "Av. Las Delicias, Centro Empresarial Europa, Piso 6, Ofic. 602",
                zonaSector: "Las Delicias",
                repartidorId: "REP-01",
                repartidorNombre: "Carlos Eduardo Mendoza",
                items: [
                    { productoId: "PRD-004", nombre: "Croissant de Mantequilla", cantidad: 6, precioUnitarioUSD: 2.00, subtotalUSD: 12.00 },
                    { productoId: "PRD-006", nombre: "Tartaleta de Fresas y Crema", cantidad: 3, precioUnitarioUSD: 3.50, subtotalUSD: 10.50 }
                ],
                subtotalUSD: 22.50,
                costoFleteUSD: 3.00,
                totalUSD: 25.50,
                totalVES: 939.68,
                metodoPagoContraEntrega: "EFECTIVO_USD",
                estado: "pendiente_empaque",
                horaSalida: null,
                tiempoEstimadoMin: 25,
                horaEntrega: null,
                notaDespacho: "Empacar en caja decorativa para reunión ejecutiva"
            },
            {
                id: "DESP-100",
                comandaId: "PED-DEL-500",
                clienteNombre: "Clínica Calicanto - Dpto. Adm",
                clienteTelefono: "0412-4433221",
                direccionEntrega: "Calle López Aveledo, Calicanto",
                zonaSector: "Calicanto",
                repartidorId: "REP-03",
                repartidorNombre: "José Gregorio Rivas",
                items: [
                    { productoId: "PRD-002", nombre: "Pan Campesino Rústico", cantidad: 8, precioUnitarioUSD: 1.50, subtotalUSD: 12.00 },
                    { productoId: "PRD-007", nombre: "Empanada Gallega de Atún", cantidad: 5, precioUnitarioUSD: 2.50, subtotalUSD: 12.50 }
                ],
                subtotalUSD: 24.50,
                costoFleteUSD: 2.00,
                totalUSD: 26.50,
                totalVES: 976.53,
                metodoPagoContraEntrega: "PUNTO_POS",
                estado: "entregado_cobrado",
                horaSalida: "06:50 AM",
                tiempoEstimadoMin: 15,
                horaEntrega: "07:12 AM",
                notaDespacho: "Entregado a recepción central - Factura enviada por WhatsApp"
            }
        ],

        comprasPredictivas: [
            {
                id: "PRED-01",
                insumoId: "INS-001",
                nombreInsumo: "Harina de Trigo Panadera Especial 45kg",
                proveedorId: "PRV-001",
                proveedorNombre: "Molinos Nacionales C.A. (MONACA)",
                stockActual: 18,
                unidadMedida: "sacos",
                consumoPromedioDiario: 6.5,
                diasAutonomia: 2.8,
                tiempoEntregaDias: 2,
                puntoReorden: 15,
                cantidadSugeridaReorden: 30,
                costoUnitarioEstimadoUSD: 38.50,
                costoTotalEstimadoUSD: 1155.00,
                nivelUrgencia: "critico",
                justificacionIA: "Consumo proyectado de fin de semana superará stock actual en 48 horas. Lead time de MONACA es de 2 días hábiles."
            },
            {
                id: "PRED-02",
                insumoId: "INS-002",
                nombreInsumo: "Levadura Fresca Prensada (Caja 10kg)",
                proveedorId: "PRV-002",
                proveedorNombre: "Distribuidora Levapan Venezuela",
                stockActual: 4,
                unidadMedida: "cajas",
                consumoPromedioDiario: 1.2,
                diasAutonomia: 3.3,
                tiempoEntregaDias: 3,
                puntoReorden: 5,
                cantidadSugeridaReorden: 8,
                costoUnitarioEstimadoUSD: 24.00,
                costoTotalEstimadoUSD: 192.00,
                nivelUrgencia: "critico",
                justificacionIA: "Autonomía de 3.3 días coincide exactamente con el plazo de despacho de Levapan. Requiere emisión hoy."
            },
            {
                id: "PRED-03",
                insumoId: "INS-003",
                nombreInsumo: "Mantequilla Industrial Sin Sal (Caja 15kg)",
                proveedorId: "PRV-003",
                proveedorNombre: "Lácteos Los Andes / San Simón",
                stockActual: 9,
                unidadMedida: "cajas",
                consumoPromedioDiario: 1.5,
                diasAutonomia: 6.0,
                tiempoEntregaDias: 4,
                puntoReorden: 8,
                cantidadSugeridaReorden: 10,
                costoUnitarioEstimadoUSD: 45.00,
                costoTotalEstimadoUSD: 450.00,
                nivelUrgencia: "preventivo",
                justificacionIA: "Demanda semanal de hojaldres y pastelería en incremento (+18%). Pedido preventivo recomendado."
            },
            {
                id: "PRED-04",
                insumoId: "INS-004",
                nombreInsumo: "Azúcar Refinada Superior 50kg",
                proveedorId: "PRV-004",
                proveedorNombre: "Central Azucarero El Palmar",
                stockActual: 14,
                unidadMedida: "sacos",
                consumoPromedioDiario: 1.0,
                diasAutonomia: 14.0,
                tiempoEntregaDias: 5,
                puntoReorden: 6,
                cantidadSugeridaReorden: 10,
                costoUnitarioEstimadoUSD: 42.00,
                costoTotalEstimadoUSD: 420.00,
                nivelUrgencia: "regular",
                justificacionIA: "Nivel de existencias holgado (14 días). Monitoreo regular sin necesidad de compra urgente."
            }
        ],

        auditLogsCrypto: [
            {
                index: 0,
                timestamp: "2026-09-01T06:00:00.000Z",
                usuarioId: "USR-001",
                usuarioNombre: "Gerente General",
                rol: "admin",
                accion: "GENESIS_BLOCK",
                entidad: "SISTEMA_VIASA",
                entidadId: "GENESIS-000",
                montoImpactoUSD: 0.00,
                payloadResumen: "Génesis de la cadena criptográfica de auditoría inmutable VIASA",
                prevHash: "0000000000000000000000000000000000000000000000000000000000000000",
                hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
            },
            {
                index: 1,
                timestamp: "2026-09-02T14:35:10.000Z",
                usuarioId: "USR-001",
                usuarioNombre: "Gerente General",
                rol: "admin",
                accion: "AJUSTE_INVENTARIO_MERMA",
                entidad: "INVENTARIO_HARINA",
                entidadId: "INS-001",
                montoImpactoUSD: 18.50,
                payloadResumen: "Ajuste por merma técnica de amasado -0.5 sacos Harina Especial",
                prevHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                hash: "a4f89d32b87c109e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e"
            },
            {
                index: 2,
                timestamp: "2026-09-03T17:22:45.000Z",
                usuarioId: "USR-002",
                usuarioNombre: "Cajero de Turno",
                rol: "caja",
                accion: "ANULACION_ITEM_POS",
                entidad: "ORDEN_VENTA",
                entidadId: "TKT-10892",
                montoImpactoUSD: 3.50,
                payloadResumen: "Anulación de 1x Tartaleta de Fresas por error de marcaje en cola",
                prevHash: "a4f89d32b87c109e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e",
                hash: "9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c"
            },
            {
                index: 3,
                timestamp: "2026-09-04T07:15:30.000Z",
                usuarioId: "USR-001",
                usuarioNombre: "Gerente General",
                rol: "admin",
                accion: "ACTUALIZACION_TASA_BCV",
                entidad: "CONFIG_FINANCIERA",
                entidadId: "BCV-OFICIAL",
                montoImpactoUSD: 0.00,
                payloadResumen: "Ajuste de tasa oficial BCV a 36.85 Bs/USD sincronizado",
                prevHash: "9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c",
                hash: "1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2c3b4a5f6e7d8c9b0a1f2e"
            }
        ],

        documentosMercantiles: [
            {
                id: "DOC-000001",
                ncu: "000001",
                numeroControl: 1,
                tipo: "despacho",
                tipoTitulo: "NOTA DE DESPACHO",
                fecha: "2026-09-04T08:00:00.000Z",
                fechaLegible: "04/09/2026 08:00 AM",
                emisor: {
                    nombre: "Panadería Nueva Viasa, C.A.",
                    rif: "J-31163165-8",
                    direccion: "Av. San Salvador c/c Calle Colón, Edificio Portugal, Planta Baja, Locales 1 y 2, La Sabanita, Ciudad Bolívar, Estado Bolívar, Venezuela",
                    telefono: "0424-9182345"
                },
                receptor: {
                    nombre: "Cafetería y Bodegón El Rincón Gourmet",
                    rif: "J-40192830-2",
                    direccion: "C.C. Altavista Mall, Local 22, Puerto Ordaz",
                    telefono: "0412-8371920",
                    tipo: "Cliente / Mayorista"
                },
                condicion: "Contado",
                vendedor: "Sistema VIASA",
                items: [
                    { codigo: "PRD-001", descripcion: "Pan Canilla Tradicional", cantidad: 40, unidad: "Unid.", precioUnitarioUSD: 0.50, exento: true, totalUSD: 20.00 },
                    { codigo: "PRD-002", descripcion: "Pan Campesino Rústico", cantidad: 20, unidad: "Unid.", precioUnitarioUSD: 1.20, exento: true, totalUSD: 24.00 },
                    { codigo: "PRD-004", descripcion: "Golfeado Tradicional con Queso", cantidad: 15, unidad: "Unid.", precioUnitarioUSD: 1.50, exento: false, totalUSD: 22.50 }
                ],
                subtotalUSD: 66.50,
                descuentoPorcentaje: 0.00,
                descuentoUSD: 0.00,
                exentoUSD: 44.00,
                baseImponibleUSD: 22.50,
                ivaPorcentaje: 16.0,
                ivaUSD: 3.60,
                totalUSD: 70.10,
                tasaBCV: 36.85,
                totalBs: 2583.19,
                observaciones: "Despacho para apertura de cafetería. Transporte en camioneta de despacho V-01.",
                documentoAfectado: null,
                estado: "EMITIDO",
                usuarioEmisor: "Gerente General (admin)",
                hashCrypto: "a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0",
                prevHash: "1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2c3b4a5f6e7d8c9b0a1f2e"
            },
            {
                id: "DOC-000002",
                ncu: "000002",
                numeroControl: 2,
                tipo: "entrega",
                tipoTitulo: "NOTA DE ENTREGA",
                fecha: "2026-09-04T09:15:00.000Z",
                fechaLegible: "04/09/2026 09:15 AM",
                emisor: {
                    nombre: "Panadería Nueva Viasa, C.A.",
                    rif: "J-31163165-8",
                    direccion: "Av. San Salvador c/c Calle Colón, Edificio Portugal, Planta Baja, Locales 1 y 2, La Sabanita, Ciudad Bolívar, Estado Bolívar, Venezuela",
                    telefono: "0424-9182345"
                },
                receptor: {
                    nombre: "Inversiones y Consultores Bolívar, C.A.",
                    rif: "J-30918239-1",
                    direccion: "Torre Balear, Piso 5, Oficina 502, Alta Vista, Puerto Ordaz",
                    telefono: "0424-9382019",
                    tipo: "Cliente Corporativo"
                },
                condicion: "Contado",
                vendedor: "Sistema VIASA",
                items: [
                    { codigo: "PRD-008", descripcion: "Cachito de Jamón y Queso Crema", cantidad: 25, unidad: "Unid.", precioUnitarioUSD: 1.80, exento: false, totalUSD: 45.00 },
                    { codigo: "PRD-010", descripcion: "Jugo Natural de Naranja 350ml", cantidad: 25, unidad: "Unid.", precioUnitarioUSD: 1.50, exento: false, totalUSD: 37.50 }
                ],
                subtotalUSD: 82.50,
                descuentoPorcentaje: 0.00,
                descuentoUSD: 0.00,
                exentoUSD: 0.00,
                baseImponibleUSD: 82.50,
                ivaPorcentaje: 16.0,
                ivaUSD: 13.20,
                totalUSD: 95.70,
                tasaBCV: 36.85,
                totalBs: 3526.55,
                observaciones: "Entrega de refrigerio para reunión directiva de gerencia.",
                documentoAfectado: null,
                estado: "EMITIDO",
                usuarioEmisor: "María Contreras (caja)",
                hashCrypto: "b2c3d4e5f6a708192a3b4c5d6e7f809123456789abcdef0123456789abcdef01",
                prevHash: "a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0"
            },
            {
                id: "DOC-000003",
                ncu: "000003",
                numeroControl: 3,
                tipo: "venta",
                tipoTitulo: "NOTA DE VENTA",
                fecha: "2026-09-04T10:30:00.000Z",
                fechaLegible: "04/09/2026 10:30 AM",
                emisor: {
                    nombre: "Panadería Nueva Viasa, C.A.",
                    rif: "J-31163165-8",
                    direccion: "Av. San Salvador c/c Calle Colón, Edificio Portugal, Planta Baja, Locales 1 y 2, La Sabanita, Ciudad Bolívar, Estado Bolívar, Venezuela",
                    telefono: "0424-9182345"
                },
                receptor: {
                    nombre: "Dr. Carlos Mendoza",
                    rif: "V-12849201",
                    direccion: "Urb. Los Olivos, Manzana 14, Casa 8, Puerto Ordaz",
                    telefono: "0414-8921102",
                    tipo: "Consumidor Frecuente"
                },
                condicion: "Contado",
                vendedor: "Sistema VIASA",
                items: [
                    { codigo: "PRD-005", descripcion: "Torta Selva Negra Premium (1.5 Kg)", cantidad: 1, unidad: "Unid.", precioUnitarioUSD: 22.00, exento: false, totalUSD: 22.00 },
                    { codigo: "PRD-003", descripcion: "Croissant Francés de Mantequilla", cantidad: 6, unidad: "Unid.", precioUnitarioUSD: 1.00, exento: false, totalUSD: 6.00 }
                ],
                subtotalUSD: 28.00,
                descuentoPorcentaje: 0.00,
                descuentoUSD: 0.00,
                exentoUSD: 0.00,
                baseImponibleUSD: 28.00,
                ivaPorcentaje: 16.0,
                ivaUSD: 4.48,
                totalUSD: 32.48,
                tasaBCV: 36.85,
                totalBs: 1196.89,
                observaciones: "Encargo para cumpleaños. Empaque especial con dedicatoria.",
                documentoAfectado: null,
                estado: "EMITIDO",
                usuarioEmisor: "María Contreras (caja)",
                hashCrypto: "c3d4e5f6a7b8091a2b3c4d5e6f7081923456789abcdef0123456789abcdef012",
                prevHash: "b2c3d4e5f6a708192a3b4c5d6e7f809123456789abcdef0123456789abcdef01"
            },
            {
                id: "DOC-000004",
                ncu: "000004",
                numeroControl: 4,
                tipo: "compra",
                tipoTitulo: "NOTA DE COMPRA",
                fecha: "2026-09-04T11:45:00.000Z",
                fechaLegible: "04/09/2026 11:45 AM",
                emisor: {
                    nombre: "Panadería Nueva Viasa, C.A.",
                    rif: "J-31163165-8",
                    direccion: "Av. San Salvador c/c Calle Colón, Edificio Portugal, Planta Baja, Locales 1 y 2, La Sabanita, Ciudad Bolívar, Estado Bolívar, Venezuela",
                    telefono: "0424-9182345"
                },
                receptor: {
                    nombre: "Distribuidora Monaca / Harinas Guayana, C.A.",
                    rif: "J-00028491-0",
                    direccion: "Zona Industrial Los Pinos, Parcela 42, Puerto Ordaz",
                    telefono: "0286-9941122",
                    tipo: "Proveedor de Materia Prima"
                },
                condicion: "Crédito 15 Días",
                vendedor: "Harinas Guayana",
                items: [
                    { codigo: "INS-001", descripcion: "Saco Harina de Trigo Panadera Especial 45kg", cantidad: 10, unidad: "Saco", precioUnitarioUSD: 32.50, exento: true, totalUSD: 325.00 },
                    { codigo: "INS-002", descripcion: "Caja Levadura Seca Instantánea 10kg", cantidad: 4, unidad: "Caja", precioUnitarioUSD: 42.00, exento: false, totalUSD: 168.00 }
                ],
                subtotalUSD: 493.00,
                descuentoPorcentaje: 0.00,
                descuentoUSD: 0.00,
                exentoUSD: 325.00,
                baseImponibleUSD: 168.00,
                ivaPorcentaje: 16.0,
                ivaUSD: 26.88,
                totalUSD: 519.88,
                tasaBCV: 36.85,
                totalBs: 19157.58,
                observaciones: "Recepción de insumos panaderos en almacén principal según O/C-8492.",
                documentoAfectado: null,
                estado: "EMITIDO",
                usuarioEmisor: "Gerente General (admin)",
                hashCrypto: "d4e5f6a7b8c901a2b3c4d5e6f7a809123456789abcdef0123456789abcdef0123",
                prevHash: "c3d4e5f6a7b8091a2b3c4d5e6f7081923456789abcdef0123456789abcdef012"
            },
            {
                id: "DOC-000005",
                ncu: "000005",
                numeroControl: 5,
                tipo: "credito",
                tipoTitulo: "NOTA DE CRÉDITO / DÉBITO",
                fecha: "2026-09-04T12:30:00.000Z",
                fechaLegible: "04/09/2026 12:30 PM",
                emisor: {
                    nombre: "Panadería Nueva Viasa, C.A.",
                    rif: "J-31163165-8",
                    direccion: "Av. San Salvador c/c Calle Colón, Edificio Portugal, Planta Baja, Locales 1 y 2, La Sabanita, Ciudad Bolívar, Estado Bolívar, Venezuela",
                    telefono: "0424-9182345"
                },
                receptor: {
                    nombre: "Cafetería y Bodegón El Rincón Gourmet",
                    rif: "J-40192830-2",
                    direccion: "C.C. Altavista Mall, Local 22, Puerto Ordaz",
                    telefono: "0412-8371920",
                    tipo: "Cliente / Mayorista"
                },
                condicion: "Contado",
                vendedor: "Sistema VIASA",
                items: [
                    { codigo: "PRD-004", descripcion: "Golfeado Tradicional con Queso", cantidad: 5, unidad: "Unid.", precioUnitarioUSD: 1.50, exento: false, totalUSD: 7.50 }
                ],
                subtotalUSD: 7.50,
                descuentoPorcentaje: 0.00,
                descuentoUSD: 0.00,
                exentoUSD: 0.00,
                baseImponibleUSD: 7.50,
                ivaPorcentaje: 16.0,
                ivaUSD: 1.20,
                totalUSD: 8.70,
                tasaBCV: 36.85,
                totalBs: 320.60,
                observaciones: "Ajuste por devolución de 5 unidades de golfeado con empaque imperfecto.",
                documentoAfectado: "DOC-000001 (NCU: 000001)",
                estado: "EMITIDO",
                usuarioEmisor: "Gerente General (admin)",
                hashCrypto: "e5f6a7b8c9d012a3b4c5d6e7f8a90123456789abcdef0123456789abcdef01234",
                prevHash: "d4e5f6a7b8c901a2b3c4d5e6f7a809123456789abcdef0123456789abcdef0123"
            }
        ],

        cuentasCorreo: [
            {
                id: "MAIL-ACC-001",
                email: "panaderiaviasa@gmail.com",
                nombreRemitente: "Panadería Nueva Viasa, C.A. - Administración",
                servidorIMAP: "imap.gmail.com",
                puertoIMAP: 993,
                sslIMAP: true,
                servidorSMTP: "smtp.gmail.com",
                puertoSMTP: 465,
                sslSMTP: true,
                usuario: "panaderiaviasa@gmail.com",
                passwordMasked: "••••••••••••••••",
                esPredeterminada: true,
                activo: true,
                colorBadge: "#38bdf8",
                categoriaUso: "Administración General y Facturación SENIAT",
                ultimaSincronizacion: new Date().toISOString(),
                totalRecibidos: 12,
                totalEnviados: 8
            },
            {
                id: "MAIL-ACC-002",
                email: "nuevaviasapg@gmail.com",
                nombreRemitente: "Nueva Viasa - Compras y Proveedores",
                servidorIMAP: "imap.gmail.com",
                puertoIMAP: 993,
                sslIMAP: true,
                servidorSMTP: "smtp.gmail.com",
                puertoSMTP: 465,
                sslSMTP: true,
                usuario: "nuevaviasapg@gmail.com",
                passwordMasked: "••••••••••••••••",
                esPredeterminada: false,
                activo: true,
                colorBadge: "#fbbf24",
                categoriaUso: "Compras, Abastecimiento de Materia Prima y Logística",
                ultimaSincronizacion: new Date().toISOString(),
                totalRecibidos: 9,
                totalEnviados: 5
            }
        ],

        mensajesCorreoCRM: [
            {
                id: "MSG-20260906-001",
                cuentaCorreoId: "MAIL-ACC-002",
                cuentaCorreoDestino: "nuevaviasapg@gmail.com",
                tipo: "entrante",
                de: "ventas.oriente@monaca.com.ve",
                nombreDe: "Molinos Nacionales C.A. (MONACA)",
                para: "nuevaviasapg@gmail.com",
                asunto: "Factura Digital N° 004829 y Nota de Entrega de Harina 000 (Despacho Martes)",
                fecha: new Date(Date.now() - 3600000 * 4).toISOString(),
                fechaLegible: new Date(Date.now() - 3600000 * 4).toLocaleString('es-VE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
                cuerpoTexto: "Estimados Sres. de Panadería Nueva Viasa, C.A., adjuntamos la Factura Digital N° 004829 correspondiente a su Orden de Compra OC-001 por el despacho de 45 sacos de Harina Panadera 000. El camión de reparto estará en sus instalaciones en La Sabanita este martes a las 8:30 AM.\n\nPor favor confirmar recepción y envío de comprobante de retención de IVA según calendario SENIAT.",
                entidadTipo: "proveedor",
                entidadId: "PRV-001",
                entidadNombre: "Molinos Nacionales C.A. (MONACA)",
                entidadRif: "J-00030291-0",
                adjuntos: [
                    {
                        id: "ADJ-001",
                        nombreArchivo: "Factura_Digital_004829_MONACA.pdf",
                        tipo: "pdf",
                        tamanoKB: 245,
                        tipoDocumentoDetectado: "Factura de Compra / CxP",
                        montoDetectadoUSD: 945.00,
                        montoDetectadoBs: 34823.25,
                        archivadoEnBancoMemoria: true,
                        bancoMemoriaId: "MEM-DOC-004829",
                        ordenCompraAsociada: "OC-001"
                    },
                    {
                        id: "ADJ-002",
                        nombreArchivo: "Nota_Entrega_NE-9821_MONACA.pdf",
                        tipo: "pdf",
                        tamanoKB: 180,
                        tipoDocumentoDetectado: "Nota de Entrega",
                        archivadoEnBancoMemoria: true,
                        bancoMemoriaId: "MEM-NE-9821"
                    }
                ],
                leido: true,
                sincronizadoCRM: true,
                categoriaCRM: "factura_compra",
                prioridad: "alta",
                hashCryptoSHA256: "8f4a1c5b89d423e8a719c2f689e4b105d6e27a93c7810b4f8a2916c5b9e0f312"
            },
            {
                id: "MSG-20260906-002",
                cuentaCorreoId: "MAIL-ACC-002",
                cuentaCorreoDestino: "nuevaviasapg@gmail.com",
                tipo: "entrante",
                de: "pedidos@levadurascaribe.com",
                nombreDe: "Levaduras del Caribe C.A.",
                para: "nuevaviasapg@gmail.com",
                asunto: "Cotización Actualizada y Lista de Precios de Levadura Seca Instantánea",
                fecha: new Date(Date.now() - 3600000 * 8).toISOString(),
                fechaLegible: new Date(Date.now() - 3600000 * 8).toLocaleString('es-VE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
                cuerpoTexto: "Saludos cordiales. Cumplimos con enviar cotización solicitada para cajas de 20 paquetes de Levadura Seca Instantánea de 500g y Levadura Fresca en Bloque. Mantenemos condición de crédito a 7 días según histórico comercial.",
                entidadTipo: "proveedor",
                entidadId: "PRV-002",
                entidadNombre: "Levaduras del Caribe C.A.",
                entidadRif: "J-30918234-5",
                adjuntos: [
                    {
                        id: "ADJ-003",
                        nombreArchivo: "Cotizacion_Levaduras_Septiembre_2026.pdf",
                        tipo: "pdf",
                        tamanoKB: 156,
                        tipoDocumentoDetectado: "Cotización de Insumos",
                        montoDetectadoUSD: 320.00,
                        archivadoEnBancoMemoria: true,
                        bancoMemoriaId: "MEM-COT-3921"
                    }
                ],
                leido: true,
                sincronizadoCRM: true,
                categoriaCRM: "cotizacion",
                prioridad: "media",
                hashCryptoSHA256: "3b9f8a2c7104e689d15b29f04c8e7193a5b06d4e8f192c7a3b4e5f6019d8c721"
            },
            {
                id: "MSG-20260906-003",
                cuentaCorreoId: "MAIL-ACC-001",
                cuentaCorreoDestino: "panaderiaviasa@gmail.com",
                tipo: "saliente",
                de: "panaderiaviasa@gmail.com",
                nombreDe: "Panadería Nueva Viasa, C.A. - Administración",
                para: "ventas.oriente@monaca.com.ve",
                asunto: "Envío de Comprobante de Transferencia Bancaria y Retención de IVA - Factura 004829",
                fecha: new Date(Date.now() - 3600000 * 2).toISOString(),
                fechaLegible: new Date(Date.now() - 3600000 * 2).toLocaleString('es-VE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
                cuerpoTexto: "Buenas tardes. Adjuntamos comprobante de transferencia bancaria Banesco y el Certificado Oficial de Retención de IVA N° RET-2026-0091 por el pago de la Factura 004829. Agradecemos acusar recibo.",
                entidadTipo: "proveedor",
                entidadId: "PRV-001",
                entidadNombre: "Molinos Nacionales C.A. (MONACA)",
                entidadRif: "J-00030291-0",
                adjuntos: [
                    {
                        id: "ADJ-004",
                        nombreArchivo: "Comprobante_Pago_Banesco_Ref984120.pdf",
                        tipo: "pdf",
                        tamanoKB: 110,
                        tipoDocumentoDetectado: "Comprobante de Pago Bancario",
                        montoDetectadoUSD: 945.00,
                        archivadoEnBancoMemoria: true
                    },
                    {
                        id: "ADJ-005",
                        nombreArchivo: "Retencion_IVA_SENIAT_RET-2026-0091.pdf",
                        tipo: "pdf",
                        tamanoKB: 195,
                        tipoDocumentoDetectado: "Comprobante Retención IVA SENIAT",
                        archivadoEnBancoMemoria: true
                    }
                ],
                leido: true,
                sincronizadoCRM: true,
                categoriaCRM: "pago_proveedor",
                prioridad: "media",
                hashCryptoSHA256: "91c4e8f192c7a3b4e5f6019d8c7213b9f8a2c7104e689d15b29f04c8e7193a5b"
            },
            {
                id: "MSG-20260906-004",
                cuentaCorreoId: "MAIL-ACC-001",
                cuentaCorreoDestino: "panaderiaviasa@gmail.com",
                tipo: "entrante",
                de: "eventos.angostura@gmail.com",
                nombreDe: "Corporación Eventos Angostura, C.A.",
                para: "panaderiaviasa@gmail.com",
                asunto: "Solicitud de Presupuesto para Catering de 150 Personas (Pasadapalos y Mini Sandwiches)",
                fecha: new Date(Date.now() - 3600000 * 12).toISOString(),
                fechaLegible: new Date(Date.now() - 3600000 * 12).toLocaleString('es-VE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }),
                cuerpoTexto: "Estimado equipo de Panadería Viasa. Solicitamos presupuesto formal para evento corporativo el día 25 de septiembre: 150 mini cachitos de jamón y queso, 150 mini pastelitos de hojaldre surtidos y 3 tortas húmedas de chocolate de 2 Kg. Por favor indicar tiempos de entrega y métodos de pago aceptados.",
                entidadTipo: "cliente",
                entidadId: "CLI-002",
                entidadNombre: "Corporación Eventos Angostura",
                entidadRif: "J-40912845-2",
                adjuntos: [
                    {
                        id: "ADJ-006",
                        nombreArchivo: "Requerimientos_Catering_Evento_25Sep.pdf",
                        tipo: "pdf",
                        tamanoKB: 98,
                        tipoDocumentoDetectado: "Requerimiento de Encargo / Catering",
                        archivadoEnBancoMemoria: true
                    }
                ],
                leido: false,
                sincronizadoCRM: true,
                categoriaCRM: "solicitud_cliente",
                prioridad: "alta",
                hashCryptoSHA256: "4e8f192c7a3b4e5f6019d8c7213b9f8a2c7104e689d15b29f04c8e7193a5b91c"
            }
        ],

        plantillasCorreo: [
            // PROTOCOLO 1: PROVEEDORES Y ACREEDORES
            {
                id: "PLANT-PRV-COTIZ",
                codigo: "PRV_SOLICITUD_COTIZACION",
                protocolo: "proveedores",
                nombre: "Solicitud de Cotización y Lista de Precios de Materia Prima",
                asunto: "Solicitud de Cotización y Disponibilidad de Insumos - Panadería Nueva Viasa, C.A.",
                cuerpo: "Estimados Sres. de {{nombre_destinatario}} (RIF: {{rif_cedula}}),\n\nEsperamos se encuentren bien. Desde el departamento de compras de Panadería y Pastelería Nueva Viasa, C.A., solicitamos amablemente nos remitan su lista de precios actualizada y condiciones comerciales vigentes para los siguientes insumos de producción:\n\n{{detalle_items}}\n\nCondiciones de interés:\n• Tiempos estimados de despacho a nuestras instalaciones en La Sabanita, Ciudad Bolívar.\n• Modalidades de pago aceptadas (Transferencia Banesco, Pago Móvil, Divisas en efectivo).\n• Condiciones de crédito comercial a 7 o 15 días.\n\nQuedamos atentos a su pronta respuesta para procesar nuestras órdenes de compra del mes.\n\nAtentamente,\nDepartamento de Compras y Abastecimiento\nPanadería y Pastelería Nueva Viasa, C.A.\nRIF: J-31163165-8 | Tel: (0285) 632-4411\nCalle Principal La Sabanita, Ciudad Bolívar, Venezuela",
                categoria: "Compras e Insumos",
                variablesPermitidas: ["nombre_destinatario", "rif_cedula", "detalle_items", "fecha", "tasa_bcv"],
                activo: true,
                esSistema: true
            },
            {
                id: "PLANT-PRV-ORDEN",
                codigo: "PRV_ORDEN_COMPRA",
                protocolo: "proveedores",
                nombre: "Envío de Orden de Compra Oficial (Materia Prima)",
                asunto: "Orden de Compra Oficial N° {{numero_documento}} - Panadería Nueva Viasa, C.A.",
                cuerpo: "Estimados Sres. de {{nombre_destinatario}},\n\nPor medio de la presente, remitimos formalmente nuestra Orden de Compra N° {{numero_documento}} por un monto total de ${{monto_usd}} (equivalente a Bs. {{monto_bs}} a Tasa BCV Oficial de {{tasa_bcv}} Bs/$).\n\nResumen del pedido de producción:\n{{detalle_items}}\n\nCondición de Pago: {{condicion_pago}}\nLugar de Recepción: Calle Principal La Sabanita, Ciudad Bolívar.\n\nAgradecemos confirmar recepción de la presente orden, fecha programada de entrega y emisión de la factura digital / nota de despacho correspondiente.\n\nSaludos cordiales,\nGerencia de Compras y Logística\nPanadería Nueva Viasa, C.A. (RIF: J-31163165-8)",
                categoria: "Compras e Insumos",
                variablesPermitidas: ["nombre_destinatario", "numero_documento", "monto_usd", "monto_bs", "tasa_bcv", "detalle_items", "condicion_pago", "fecha"],
                activo: true,
                esSistema: true
            },
            {
                id: "PLANT-PRV-PAGO",
                codigo: "PRV_PAGO_RETENCION_IVA",
                protocolo: "proveedores",
                nombre: "Envío de Comprobante de Pago y Certificado de Retención IVA SENIAT",
                asunto: "Comprobante de Pago Bancario y Retención IVA - Factura N° {{numero_documento}}",
                cuerpo: "Estimados Sres. de {{nombre_destinatario}} (RIF: {{rif_cedula}}),\n\nCumplimos con informarles que se ha procesado exitosamente la transferencia bancaria correspondiente al pago de la Factura N° {{numero_documento}} por un total cancelado de ${{monto_usd}} (Bs. {{monto_bs}}).\n\nDatos de la liquidación:\n• Banco Emisor: Banesco Banco Universal (Cuenta Corriente Nueva Viasa)\n• Banco Destino: {{banco_destino}}\n• Referencia Bancaria: {{referencia_bancaria}}\n• Comprobante Retención IVA SENIAT: N° {{numero_retencion_iva}}\n• Porcentaje Retenido: {{porcentaje_retencion}}%\n\nAdjuntamos en formato PDF el comprobante de transferencia y el Certificado Oficial de Retención de IVA emitido según la providencia administrativa del SENIAT.\n\nPor favor acusar recibo de la presente comunicación.\n\nAtentamente,\nDepartamento de Administración y Finanzas\nPanadería Nueva Viasa, C.A. (Agente de Retención SENIAT)",
                categoria: "Finanzas y SENIAT",
                variablesPermitidas: ["nombre_destinatario", "rif_cedula", "numero_documento", "monto_usd", "monto_bs", "banco_destino", "referencia_bancaria", "numero_retencion_iva", "porcentaje_retencion", "fecha"],
                activo: true,
                esSistema: true
            },
            {
                id: "PLANT-PRV-EDOCTA",
                codigo: "PRV_ESTADO_CUENTA_RECEPCION",
                protocolo: "proveedores",
                nombre: "Solicitud de Estado de Cuenta y Confirmación de Recepción de Mercancía",
                asunto: "Confirmación de Recepción de Insumos y Conciliación de Cuenta - Nueva Viasa",
                cuerpo: "Estimados Sres. de {{nombre_destinatario}},\n\nLe confirmamos la recepción conforme en nuestro almacén de La Sabanita de los insumos detallados a continuación con fecha {{fecha}}:\n\n{{detalle_items}}\n\nAsimismo, solicitamos amablemente nos remitan nuestro Estado de Cuenta actualizado con la relación de facturas emitidas, abonos registrados y saldo pendiente de conciliación a la fecha.\n\nReiteramos nuestro compromiso de puntualidad en los compromisos comerciales acordados.\n\nCordialmente,\nAdministración - Panadería Nueva Viasa, C.A.",
                categoria: "Compras e Insumos",
                variablesPermitidas: ["nombre_destinatario", "fecha", "detalle_items", "saldo_pendiente_usd"],
                activo: true,
                esSistema: true
            },

            // PROTOCOLO 2: CLIENTES (MAYOR Y DETAL)
            {
                id: "PLANT-CLI-NOTA",
                codigo: "CLI_ENVIO_NOTA_MERCANTIL",
                protocolo: "clientes",
                nombre: "Envío de Documento Mercantil (Nota de Despacho / Venta / Crédito en PDF)",
                asunto: "Documento Mercantil Digital N° {{numero_documento}} ({{tipo_documento}}) - Nueva Viasa",
                cuerpo: "Estimado(a) {{nombre_destinatario}} (CI/RIF: {{rif_cedula}}),\n\nEs un placer saludarle. Le hacemos entrega formal en archivo digital adjunto de su {{tipo_documento}} N° {{numero_documento}} emitida el día {{fecha}} por un importe total de ${{monto_usd}} (equivalente a Bs. {{monto_bs}} a Tasa BCV: {{tasa_bcv}} Bs/$).\n\nResumen de productos despachados:\n{{detalle_items}}\n\nNúmero de Control Único (NCU): {{numero_control_ncu}}\nHash de Integridad Criptográfica: {{hash_crypto}}\n\n¡Agradecemos su confianza y preferencia por la calidad y tradición de Panadería Nueva Viasa!\n\nAtentamente,\nAtención al Cliente y Facturación\nPanadería y Pastelería Nueva Viasa, C.A.\nLa Sabanita, Ciudad Bolívar",
                categoria: "Ventas y Clientes",
                variablesPermitidas: ["nombre_destinatario", "rif_cedula", "tipo_documento", "numero_documento", "fecha", "monto_usd", "monto_bs", "tasa_bcv", "detalle_items", "numero_control_ncu", "hash_crypto"],
                activo: true,
                esSistema: true
            },
            {
                id: "PLANT-CLI-COBRANZA",
                codigo: "CLI_RECORDATORIO_SALDO",
                protocolo: "clientes",
                nombre: "Notificación de Saldo Pendiente y Cobranza Comercial Preventiva",
                asunto: "Estado de Cuenta y Recordatorio de Saldo Pendiente - Panadería Nueva Viasa",
                cuerpo: "Estimado(a) {{nombre_destinatario}},\n\nEsperamos se encuentre muy bien. Nos comunicamos de Panadería y Pastelería Nueva Viasa, C.A. para compartirle un recordatorio cordial sobre su saldo comercial pendiente al día {{fecha}}:\n\n• Saldo Pendiente: ${{monto_usd}} (Bs. {{monto_bs}})\n• Tasa Oficial BCV: {{tasa_bcv}} Bs/$\n• Documento de Referencia: {{numero_documento}}\n• Fecha de Vencimiento: {{fecha_vencimiento}}\n\nMétodos de Pago Disponibles:\n1. Pago Móvil Banesco (0134) - RIF: J-31163165-8 - Tel: 0414-8521122\n2. Transferencia Bancaria Banesco / Banco de Venezuela\n3. Efectivo Divisas o Bolívares en caja principal\n\nAgradecemos remitir el comprobante de pago a este mismo correo una vez realizada la operación para actualizar inmediatamente su solvencia en sistema.\n\nSaludos cordiales,\nDepartamento de Crédito y Cobranzas\nPanadería Nueva Viasa, C.A.",
                categoria: "Ventas y Clientes",
                variablesPermitidas: ["nombre_destinatario", "fecha", "monto_usd", "monto_bs", "tasa_bcv", "numero_documento", "fecha_vencimiento"],
                activo: true,
                esSistema: true
            },
            {
                id: "PLANT-CLI-CATERING",
                codigo: "CLI_PRESUPUESTO_CATERING",
                protocolo: "clientes",
                nombre: "Presupuesto y Cotización Formal de Encargo Gourmet y Catering",
                asunto: "Cotización de Encargo Gourmet y Catering N° {{numero_documento}} - Panadería Nueva Viasa",
                cuerpo: "Estimado(a) {{nombre_destinatario}},\n\nEs un gusto saludarle. Adjuntamos la cotización formal para su evento especial programado para el {{fecha_entrega}}:\n\nDetalle de productos y especialidades seleccionadas:\n{{detalle_items}}\n\n• Inversión Total: ${{monto_usd}} (Bs. {{monto_bs}})\n• Anticipo Requerido (50%): ${{monto_anticipo_usd}} (Bs. {{monto_anticipo_bs}})\n• Saldo al Retiro / Despacho: ${{saldo_pendiente_usd}}\n\nTodas nuestras elaboraciones son preparadas con ingredientes de alta pastelería artesanal y horneadas el mismo día de la entrega para garantizar la máxima frescura.\n\nPara formalizar la reserva de fecha de producción, por favor confirme su abono vía transferencia o pago móvil.\n\n¡Gracias por elegir a Panadería Nueva Viasa para sus momentos más especiales!\n\nChef Pastelero y Equipo de Producción\nPanadería y Pastelería Nueva Viasa, C.A.",
                categoria: "Ventas y Clientes",
                variablesPermitidas: ["nombre_destinatario", "numero_documento", "fecha_entrega", "detalle_items", "monto_usd", "monto_bs", "monto_anticipo_usd", "monto_anticipo_bs", "saldo_pendiente_usd"],
                activo: true,
                esSistema: true
            },

            // PROTOCOLO 3: RECURSOS HUMANOS (PERSONAL Y OBREROS)
            {
                id: "PLANT-RRHH-NOMINA",
                codigo: "RRHH_RECIBO_PAGO_NOMINA",
                protocolo: "rrhh",
                nombre: "Envío de Recibo de Pago de Nómina Digital (Normativa LOTTT)",
                asunto: "Recibo de Pago de Nómina - Período {{periodo_nomina}} - {{nombre_destinatario}}",
                cuerpo: "Estimado(a) colaborador(a) {{nombre_destinatario}} (C.I. {{rif_cedula}}),\n\nCumplimos con remitirle en archivo PDF adjunto su Recibo Oficial de Pago de Nómina correspondiente al período: {{periodo_nomina}}.\n\nResumen de Liquidación Salarial:\n• Cargo: {{cargo_empleado}}\n• Salario Base Quincenal: ${{monto_usd}} (Bs. {{monto_bs}})\n• Bono de Alimentación / Asignaciones: Bs. {{monto_bonos_bs}}\n• Deducciones de Ley (IVSS 4%, FAOV 1%, RPE 0.5%): Bs. {{monto_deducciones_bs}}\n• Neto a Cobrar Depositado: Bs. {{monto_neto_bs}} ($ {{monto_neto_usd}})\n• Banco de Pago: {{banco_destino}}\n\nEste documento tiene plena validez legal conforme a lo establecido en la Ley Orgánica del Trabajo, los Trabajadores y las Trabajadoras (LOTTT).\n\n¡Agradecemos su valioso esfuerzo y compromiso diario con la excelencia de nuestra panadería!\n\nDepartamento de Recursos Humanos y Nómina\nPanadería y Pastelería Nueva Viasa, C.A. (RIF: J-31163165-8)",
                categoria: "Recursos Humanos y LOTTT",
                variablesPermitidas: ["nombre_destinatario", "rif_cedula", "periodo_nomina", "cargo_empleado", "monto_usd", "monto_bs", "monto_bonos_bs", "monto_deducciones_bs", "monto_neto_bs", "monto_neto_usd", "banco_destino", "fecha"],
                activo: true,
                esSistema: true
            },
            {
                id: "PLANT-RRHH-VACACIONES",
                codigo: "RRHH_NOTIFICACION_VACACIONES",
                protocolo: "rrhh",
                nombre: "Notificación de Vacaciones Aprobadas y Liquidación de Bono Vacacional LOTTT",
                asunto: "Aprobación de Período Vacacional y Bono LOTTT - {{nombre_destinatario}}",
                cuerpo: "Estimado(a) {{nombre_destinatario}} (Cargo: {{cargo_empleado}}),\n\nNos complace notificarle que ha sido formalmente aprobado su período vacacional reglamentario correspondiente al año de servicio laborado, de conformidad con los artículos 190 y 192 de la LOTTT:\n\n• Período de Disfrute: Del {{fecha_inicio_vacaciones}} al {{fecha_fin_vacaciones}}\n• Fecha de Reincorporación a Labores: {{fecha_reincorporacion}}\n• Días de Disfrute Legal: {{dias_vacaciones}} días hábiles\n• Total Liquidación Bono Vacacional + Días: ${{monto_usd}} (Bs. {{monto_bs}})\n\nAdjuntamos la planilla oficial de vacaciones y el comprobante de depósito bancario del anticipo vacacional.\n\nLe deseamos un merecido y reparador descanso junto a su familia.\n\nAtentamente,\nGerencia de Recursos Humanos\nPanadería Nueva Viasa, C.A.",
                categoria: "Recursos Humanos y LOTTT",
                variablesPermitidas: ["nombre_destinatario", "cargo_empleado", "fecha_inicio_vacaciones", "fecha_fin_vacaciones", "fecha_reincorporacion", "dias_vacaciones", "monto_usd", "monto_bs"],
                activo: true,
                esSistema: true
            },
            {
                id: "PLANT-RRHH-CONSTANCIA",
                codigo: "RRHH_CONSTANCIA_TRABAJO",
                protocolo: "rrhh",
                nombre: "Emisión y Envío de Constancia de Trabajo Oficial con Sello Digital",
                asunto: "Constancia de Trabajo Oficial - Panadería Nueva Viasa, C.A. - {{nombre_destinatario}}",
                cuerpo: "A QUIEN PUEDA INTERESAR,\n\nPor medio de la presente, la empresa PANADERÍA Y PASTELERÍA NUEVA VIASA, C.A., domiciliada en La Sabanita, Ciudad Bolívar, estado Bolívar (RIF: J-31163165-8), hace constar que el(la) ciudadano(a):\n\n{{nombre_destinatario}}, titular de la Cédula de Identidad N° {{rif_cedula}},\n\nPresta sus servicios profesionales en nuestra organización desempeñando el cargo de {{cargo_empleado}}, desde la fecha {{fecha_ingreso}}, devengando un ingreso mensual integral de ${{monto_usd}} (equivalente en Bolívares según tasa oficial del BCV).\n\nConstancia que se expide a solicitud de la parte interesada en Ciudad Bolívar, a los {{fecha_emision_larga}}.\n\nValidez y Verificación Digital: NCU-RH-{{numero_documento}} | Hash SHA-256 Verificado.\n\nAtentamente,\nLcda. Carmen Bastardo\nGerente de Administración y Talento Humano\nPanadería y Pastelería Nueva Viasa, C.A.",
                categoria: "Recursos Humanos y LOTTT",
                variablesPermitidas: ["nombre_destinatario", "rif_cedula", "cargo_empleado", "fecha_ingreso", "monto_usd", "fecha_emision_larga", "numero_documento"],
                activo: true,
                esSistema: true
            },
            {
                id: "PLANT-RRHH-NOTIFICACION",
                codigo: "RRHH_LLAMADO_ATENCION_FORMAL",
                protocolo: "rrhh",
                nombre: "Notificación Formal / Llamado de Atención Administrativo",
                asunto: "Comunicación Formal Administrativa - Departamento de RRHH - {{nombre_destinatario}}",
                cuerpo: "Estimado(a) {{nombre_destinatario}} (C.I. {{rif_cedula}}),\n\nPor medio de la presente comunicación institucional, la Gerencia de Panadería Nueva Viasa, C.A. se dirige a usted con la finalidad de dejar constancia formal respecto a la siguiente eventualidad registrada en su turno de trabajo el día {{fecha}}:\n\nMotivo / Descripción de la Novedad:\n{{motivo_notificacion}}\n\nLe exhortamos a mantener el estricto apego al Reglamento Interno de Trabajo, las normas de higiene y manipulación de alimentos, y los horarios establecidos para su puesto de trabajo ({{cargo_empleado}}).\n\nEsta notificación queda registrada en su expediente laboral digital para los fines de seguimiento de desempeño.\n\nAtentamente,\nDirección de Operaciones y Talento Humano\nPanadería y Pastelería Nueva Viasa, C.A.",
                categoria: "Recursos Humanos y LOTTT",
                variablesPermitidas: ["nombre_destinatario", "rif_cedula", "cargo_empleado", "fecha", "motivo_notificacion"],
                activo: true,
                esSistema: true
            }
        ],

        contactosDirectorio: [
            // PROVEEDORES
            {
                id: "CONT-PRV-001",
                tipo: "proveedor",
                subtipo: "Materia Prima (Harina y Granos)",
                nombre: "Molinos Nacionales C.A. (MONACA)",
                rifCedula: "J-00030291-0",
                email: "ventas.oriente@monaca.com.ve",
                telefono: "0286-9621144",
                ciudad: "Puerto Ordaz, Bolívar",
                etiquetas: ["Proveedor", "Materia Prima", "Harina Panadera"],
                entidadId: "PRV-001",
                sincronizadoEmail: "nuevaviasapg@gmail.com",
                totalMensajesIntercambiados: 14
            },
            {
                id: "CONT-PRV-002",
                tipo: "proveedor",
                subtipo: "Levaduras y Fermentos",
                nombre: "Levaduras del Caribe C.A.",
                rifCedula: "J-30918234-5",
                email: "pedidos@levadurascaribe.com",
                telefono: "0281-2819000",
                ciudad: "Barcelona, Anzoátegui",
                etiquetas: ["Proveedor", "Levaduras", "Insumos Químicos"],
                entidadId: "PRV-002",
                sincronizadoEmail: "nuevaviasapg@gmail.com",
                totalMensajesIntercambiados: 8
            },
            // ACREEDORES Y SERVICIOS
            {
                id: "CONT-ACR-001",
                tipo: "acreedor",
                subtipo: "Mantenimiento Técnico Industrial",
                nombre: "Servicios Técnicos de Hornos y Refrigeración Guayana, C.A.",
                rifCedula: "J-40182931-9",
                email: "servicios.guayana.hornos@gmail.com",
                telefono: "0285-6548811",
                ciudad: "Ciudad Bolívar",
                etiquetas: ["Acreedor", "Servicio Técnico", "Mantenimiento"],
                entidadId: "ACR-001",
                sincronizadoEmail: "panaderiaviasa@gmail.com",
                totalMensajesIntercambiados: 5
            },
            // CLIENTES MAYOR Y DETAL
            {
                id: "CONT-CLI-001",
                tipo: "cliente",
                subtipo: "Cliente Mayorista / Corporativo",
                nombre: "Corporación Eventos Angostura, C.A.",
                rifCedula: "J-40912845-2",
                email: "eventos.angostura@gmail.com",
                telefono: "0414-8854422",
                ciudad: "Ciudad Bolívar",
                etiquetas: ["Cliente", "Corporativo", "Catering y Eventos"],
                entidadId: "CLI-002",
                sincronizadoEmail: "panaderiaviasa@gmail.com",
                totalMensajesIntercambiados: 9
            },
            {
                id: "CONT-CLI-002",
                tipo: "cliente",
                subtipo: "Comercio Revendedor / Bodegón",
                nombre: "Inversiones El Gran Samán, C.A.",
                rifCedula: "J-50123984-1",
                email: "compras.elsaman@gmail.com",
                telefono: "0424-9123847",
                ciudad: "Ciudad Bolívar",
                etiquetas: ["Cliente", "Mayorista", "Pan de Sandwich y Canilla"],
                entidadId: "CLI-003",
                sincronizadoEmail: "panaderiaviasa@gmail.com",
                totalMensajesIntercambiados: 12
            },
            // EMPLEADOS Y OBREROS
            {
                id: "CONT-EMP-001",
                tipo: "empleado",
                subtipo: "Personal de Producción",
                nombre: "Carlos Eduardo Mendoza Rivas",
                rifCedula: "V-18452901",
                email: "carlos.mendoza.viasa@gmail.com",
                telefono: "0414-8891234",
                ciudad: "La Sabanita, Ciudad Bolívar",
                etiquetas: ["Empleado", "Maestro Panadero", "Nómina LOTTT"],
                entidadId: "EMP-001",
                cargo: "Maestro Panadero Principal",
                sincronizadoEmail: "panaderiaviasa@gmail.com",
                totalMensajesIntercambiados: 18
            },
            {
                id: "CONT-EMP-002",
                tipo: "empleado",
                subtipo: "Personal de Pastelería",
                nombre: "María Alejandra Gómez Soto",
                rifCedula: "V-20183942",
                email: "maria.gomez.pastelera@gmail.com",
                telefono: "0424-9345678",
                ciudad: "Agua Salada, Ciudad Bolívar",
                etiquetas: ["Empleado", "Chef Pastelera", "Nómina LOTTT"],
                entidadId: "EMP-002",
                cargo: "Chef Pastelera y Repostería Fina",
                sincronizadoEmail: "panaderiaviasa@gmail.com",
                totalMensajesIntercambiados: 15
            },
            {
                id: "CONT-EMP-003",
                tipo: "empleado",
                subtipo: "Personal de Caja y Atención",
                nombre: "Yulimar del Carmen Torres",
                rifCedula: "V-24589120",
                email: "yulimar.torres.caja@gmail.com",
                telefono: "0416-7890123",
                ciudad: "Los Próceres, Ciudad Bolívar",
                etiquetas: ["Empleado", "Cajera Principal", "Nómina LOTTT"],
                entidadId: "EMP-003",
                cargo: "Cajera Principal Turno Mañana",
                sincronizadoEmail: "panaderiaviasa@gmail.com",
                totalMensajesIntercambiados: 11
            }
        ],

        // ==============================================================
        // EXPANDIDO: SUBSISTEMA GASTRONÓMICO "CAFETÍN VIASA"
        // ==============================================================
        turnosComidaConfig: [
            { id: "turno_desayunos", nombre: "Menú de Desayunos Criollos y Cafetería", horaInicio: "06:00", horaFin: "11:00", icono: "fa-mug-hot", color: "#f59e0b", activo: true },
            { id: "turno_almuerzos", nombre: "Menú de Almuerzos Ejecutivos y Parrilla", horaInicio: "11:30", horaFin: "15:30", icono: "fa-utensils", color: "#38bdf8", activo: true },
            { id: "turno_cenas", nombre: "Menú de Cenas, Pasapalos y Fast Food", horaInicio: "16:00", horaFin: "22:00", icono: "fa-burger", color: "#ec4899", activo: true }
        ],

        mesasCafetin: [
            { id: "MESA-01", numero: 1, sector: "Salón Principal", capacidad: 4, estado: "libre", comandaActivaId: null, comensalesCount: 0, mesoneroAsignado: null, totalCuentaUSD: 0, totalCuentaBs: 0, horaApertura: null, qrPayload: "VIASA_MESA_01_SALON" },
            { id: "MESA-02", numero: 2, sector: "Salón Principal", capacidad: 4, estado: "ocupada", comandaActivaId: "CMD-CAF-001", comensalesCount: 3, mesoneroAsignado: "Yulimar Torres", totalCuentaUSD: 14.20, totalCuentaBs: 523.27, horaApertura: "08:15 AM", qrPayload: "VIASA_MESA_02_SALON" },
            { id: "MESA-03", numero: 3, sector: "Salón Principal", capacidad: 2, estado: "pidiendo", comandaActivaId: "CMD-CAF-002", comensalesCount: 2, mesoneroAsignado: "José Ramón Silva", totalCuentaUSD: 9.70, totalCuentaBs: 357.45, horaApertura: "08:30 AM", qrPayload: "VIASA_MESA_03_SALON" },
            { id: "MESA-04", numero: 4, sector: "Salón Principal", capacidad: 6, estado: "libre", comandaActivaId: null, comensalesCount: 0, mesoneroAsignado: null, totalCuentaUSD: 0, totalCuentaBs: 0, horaApertura: null, qrPayload: "VIASA_MESA_04_SALON" },
            { id: "MESA-05", numero: 5, sector: "Salón Principal", capacidad: 4, estado: "comiendo", comandaActivaId: "CMD-CAF-003", comensalesCount: 4, mesoneroAsignado: "Yulimar Torres", totalCuentaUSD: 23.50, totalCuentaBs: 865.98, horaApertura: "07:50 AM", qrPayload: "VIASA_MESA_05_SALON" },
            { id: "MESA-06", numero: 6, sector: "Salón Principal", capacidad: 4, estado: "por_pagar", comandaActivaId: "CMD-CAF-004", comensalesCount: 2, mesoneroAsignado: "José Ramón Silva", totalCuentaUSD: 8.50, totalCuentaBs: 313.23, horaApertura: "08:05 AM", qrPayload: "VIASA_MESA_06_SALON" },
            { id: "MESA-07", numero: 7, sector: "Salón Principal", capacidad: 2, estado: "libre", comandaActivaId: null, comensalesCount: 0, mesoneroAsignado: null, totalCuentaUSD: 0, totalCuentaBs: 0, horaApertura: null, qrPayload: "VIASA_MESA_07_SALON" },
            { id: "MESA-08", numero: 8, sector: "Salón Principal", capacidad: 4, estado: "libre", comandaActivaId: null, comensalesCount: 0, mesoneroAsignado: null, totalCuentaUSD: 0, totalCuentaBs: 0, horaApertura: null, qrPayload: "VIASA_MESA_08_SALON" },
            { id: "MESA-09", numero: 9, sector: "Terraza Exterior", capacidad: 4, estado: "libre", comandaActivaId: null, comensalesCount: 0, mesoneroAsignado: null, totalCuentaUSD: 0, totalCuentaBs: 0, horaApertura: null, qrPayload: "VIASA_MESA_09_TERRAZA" },
            { id: "MESA-10", numero: 10, sector: "Terraza Exterior", capacidad: 4, estado: "libre", comandaActivaId: null, comensalesCount: 0, mesoneroAsignado: null, totalCuentaUSD: 0, totalCuentaBs: 0, horaApertura: null, qrPayload: "VIASA_MESA_10_TERRAZA" },
            { id: "MESA-11", numero: 11, sector: "Terraza Exterior", capacidad: 6, estado: "libre", comandaActivaId: null, comensalesCount: 0, mesoneroAsignado: null, totalCuentaUSD: 0, totalCuentaBs: 0, horaApertura: null, qrPayload: "VIASA_MESA_11_TERRAZA" },
            { id: "MESA-12", numero: 12, sector: "Terraza Exterior", capacidad: 4, estado: "libre", comandaActivaId: null, comensalesCount: 0, mesoneroAsignado: null, totalCuentaUSD: 0, totalCuentaBs: 0, horaApertura: null, qrPayload: "VIASA_MESA_12_TERRAZA" },
            { id: "MESA-BARRA", numero: 13, sector: "Barra Cafetín", capacidad: 8, estado: "ocupada", comandaActivaId: "CMD-CAF-005", comensalesCount: 2, mesoneroAsignado: "Yulimar Torres", totalCuentaUSD: 4.80, totalCuentaBs: 176.88, horaApertura: "08:40 AM", qrPayload: "VIASA_MESA_BARRA" }
        ],

        platosCafetin: [
            // ==============================================================
            // PLATOS GOURMET VIASA CAFÉ BISTRO Y SMART PAIRING
            // ==============================================================
            {
                id: "PLATO-015",
                codigo: "ESP_DOBLE_ALTURA",
                nombre: "Espresso Especial Blend Altura",
                categoria: "Cafetería de Especialidad",
                turnoId: "turno_desayunos",
                estacion: "barista",
                precioUSD: 1.50,
                costoUSD: 0.40,
                tiempoEstimadoMin: 4,
                tiempoMinutos: 4,
                descripcion: "Extracción 9 bares de granos arábica seleccionados de Boconó y Caripe, con notas a cacao y avellana tostada.",
                icono: "fa-mug-saucer",
                disponible: true,
                smartPairing: {
                    platoSugeridoId: "PLATO-016",
                    sugerenciaCorta: "Croissant Francés de Mantequilla (-10%)",
                    razonamiento: "La mantequilla pura hojaldrada equilibra la acidez cítrica y prolonga el retrogusto achocolatado del espresso.",
                    perfilSensorial: ["Notas de Cacao", "Cuerpo Denso", "Acidez Cítrica"],
                    icono: "fa-croissant"
                }
            },
            {
                id: "PLATO-016",
                codigo: "CROISSANT_MANTEQUILLA",
                nombre: "Croissant de Mantequilla Francés Artesanal",
                categoria: "Bollería y Croissants",
                turnoId: "turno_desayunos",
                estacion: "pasteleria",
                precioUSD: 1.80,
                costoUSD: 0.65,
                tiempoEstimadoMin: 5,
                tiempoMinutos: 5,
                descripcion: "Laminado tradicional francés con 100% mantequilla de crema, crujiente por fuera y alveolado tierno por dentro.",
                icono: "fa-bread-slice",
                disponible: true,
                smartPairing: {
                    platoSugeridoId: "PLATO-015",
                    sugerenciaCorta: "Espresso Especial Blend Altura (-10%)",
                    razonamiento: "El tostado medio de nuestro café de altura corta la untuosidad de la mantequilla en el paladar.",
                    perfilSensorial: ["Hojaldre Crujiente", "Mantequilla Pura", "Alveolado Suave"],
                    icono: "fa-mug-hot"
                }
            },
            {
                id: "PLATO-017",
                codigo: "OMELETTE_GOURMET",
                nombre: "Omelette Gourmet con Champiñones y Queso de Cabra",
                categoria: "Desayunos Criollos",
                turnoId: "turno_desayunos",
                estacion: "cocina_caliente",
                precioUSD: 4.20,
                costoUSD: 1.60,
                tiempoEstimadoMin: 10,
                tiempoMinutos: 10,
                descripcion: "Huevos de campo batidos a mano con champiñones frescos salteados al tomillo, queso de cabra cremoso y tostadas de masa madre.",
                icono: "fa-egg",
                disponible: true,
                smartPairing: {
                    platoSugeridoId: "PLATO-023",
                    sugerenciaCorta: "Capuchino Vainilla y Canela (-10%)",
                    razonamiento: "La suavidad láctea del capuchino redondea la intensidad herbal y caprina del plato.",
                    perfilSensorial: ["Hierbas Frescas", "Queso Cremoso", "Masa Madre"],
                    icono: "fa-mug-hot"
                }
            },
            {
                id: "PLATO-018",
                codigo: "CACHAPA_GOURMET_COCHINO",
                nombre: "Cachapa Gourmet con Queso Telita y Cochino Frito Glaseado",
                categoria: "Almuerzos Ejecutivos",
                turnoId: "turno_almuerzos",
                estacion: "cocina_caliente",
                precioUSD: 6.80,
                costoUSD: 2.80,
                tiempoEstimadoMin: 14,
                tiempoMinutos: 14,
                descripcion: "Maíz tierno molido en casa, rellena con auténtico queso de telita de Upata y trozos de cochino frito glaseado en melaza de papelón.",
                icono: "fa-plate-wheat",
                disponible: true,
                smartPairing: {
                    platoSugeridoId: "PLATO-020",
                    sugerenciaCorta: "Tiramisú al Ron Añejo y Cacao (-10%)",
                    razonamiento: "Un cierre dulce y aromático con licor que complementa la riqueza del cochino glaseado.",
                    perfilSensorial: ["Dulzura de Maíz", "Telita Fresco", "Glaseado Meloso"],
                    icono: "fa-cake-candles"
                }
            },
            {
                id: "PLATO-019",
                codigo: "MEDALLON_LOMITO_CACAO",
                nombre: "Medallón de Lomito al Cacao Guayanés y Risotto",
                categoria: "Cortes y Parrilla",
                turnoId: "turno_almuerzos",
                estacion: "cocina_caliente",
                precioUSD: 9.50,
                costoUSD: 4.10,
                tiempoEstimadoMin: 16,
                tiempoMinutos: 16,
                descripcion: "Corte de res de primera a la parrilla en salsa aterciopelada de cacao amargo del Caroní y vino tinto, acompañado de risotto de hongos.",
                icono: "fa-drumstick-bite",
                disponible: true,
                smartPairing: {
                    platoSugeridoId: "PLATO-022",
                    sugerenciaCorta: "Copa de Vino Tinto Reserva Pomar (-10%)",
                    razonamiento: "Los taninos maduros del vino tinto enaltecen los tonos terrosos del cacao y la terneza de la carne.",
                    perfilSensorial: ["Cacao 70%", "Carne Braseada", "Taninos Suaves"],
                    icono: "fa-wine-glass"
                }
            },
            {
                id: "PLATO-020",
                codigo: "TIRAMISU_RON_CACAO",
                nombre: "Tiramisú Venezolano al Ron Añejo y Cacao",
                categoria: "Pastelería Fina y Repostería",
                turnoId: "turno_cenas",
                estacion: "pasteleria",
                precioUSD: 3.50,
                costoUSD: 1.20,
                tiempoEstimadoMin: 5,
                tiempoMinutos: 5,
                descripcion: "Bizcochuelo artesanal bañado en café espresso y Ron Santa Teresa 1796, crema de mascarpone y lluvia de cacao puro.",
                icono: "fa-cake-candles",
                disponible: true,
                smartPairing: {
                    platoSugeridoId: "PLATO-015",
                    sugerenciaCorta: "Espresso Especial Blend Altura (-10%)",
                    razonamiento: "Contrapunto de temperatura y amargor que potencia la textura sedosa del mascarpone.",
                    perfilSensorial: ["Ron Añejo", "Mascarpone Sedoso", "Cacao Guayanés"],
                    icono: "fa-mug-hot"
                }
            },
            {
                id: "PLATO-021",
                codigo: "TABLA_TAPAS_IBERICAS",
                nombre: "Tabla de Tapas Ibéricas y Quesos de Autor",
                categoria: "Tapas y Entradas",
                turnoId: "turno_cenas",
                estacion: "mesa_fria",
                precioUSD: 8.50,
                costoUSD: 3.40,
                tiempoEstimadoMin: 10,
                tiempoMinutos: 10,
                descripcion: "Selección de jamón serrano, chorizo ibérico, queso manchego curado, queso de cabra a la ceniza, aceitunas marinadas y focaccia de romero.",
                icono: "fa-cheese",
                disponible: true,
                smartPairing: {
                    platoSugeridoId: "PLATO-022",
                    sugerenciaCorta: "Copa de Vino Tinto Reserva Pomar (-10%)",
                    razonamiento: "Maridaje clásico europeo donde la acidez y frutos rojos del vino limpian la grasa noble de los embutidos.",
                    perfilSensorial: ["Curados Nobles", "Aceite de Oliva", "Romero Fresco"],
                    icono: "fa-wine-glass"
                }
            },
            {
                id: "PLATO-022",
                codigo: "COPA_VINO_POMAR",
                nombre: "Copa de Vino Tinto Reserva Bodegas Pomar",
                categoria: "Vinos y Coctelería",
                turnoId: "turno_cenas",
                estacion: "barista",
                precioUSD: 4.00,
                costoUSD: 1.50,
                tiempoEstimadoMin: 3,
                tiempoMinutos: 3,
                descripcion: "Cosecha nacional de Carora, blend Syrah-Tempranillo con crianza en roble americano. Notas a frutos negros y especias.",
                icono: "fa-wine-glass",
                disponible: true,
                smartPairing: {
                    platoSugeridoId: "PLATO-021",
                    sugerenciaCorta: "Tabla de Tapas Ibéricas y Quesos (-10%)",
                    razonamiento: "El acompañamiento gourmet por excelencia para veladas nocturnas y cenas de autor.",
                    perfilSensorial: ["Frutos Negros", "Roble Especiado", "Final Prolongado"],
                    icono: "fa-cheese"
                }
            },
            {
                id: "PLATO-023",
                codigo: "CAPUCHINO_VAINILLA",
                nombre: "Capuchino Vainilla y Canela con Arte Latte",
                categoria: "Cafetería de Especialidad",
                turnoId: "turno_desayunos",
                estacion: "barista",
                precioUSD: 2.20,
                costoUSD: 0.70,
                tiempoEstimadoMin: 6,
                tiempoMinutos: 6,
                descripcion: "Espresso doble con leche texturizada microespuma sedosa, toque de extracto natural de vainilla y canela molida espolvoreada.",
                icono: "fa-mug-hot",
                disponible: true,
                smartPairing: {
                    platoSugeridoId: "PLATO-016",
                    sugerenciaCorta: "Croissant Francés de Mantequilla (-10%)",
                    razonamiento: "Inmejorable combinación para desayunos y meriendas de alta pastelería.",
                    perfilSensorial: ["Vainilla Natural", "Microespuma Sedosa", "Canela Dulce"],
                    icono: "fa-croissant"
                }
            },
            // DESAYUNOS
            {
                id: "PLATO-001",
                codigo: "DES_CRIOLLO_ESP",
                nombre: "Desayuno Criollo Especial Viasa",
                categoria: "Desayunos Criollos",
                turnoId: "turno_desayunos",
                estacion: "cocina_caliente",
                precioUSD: 4.50,
                costoUSD: 1.85,
                tiempoMinutos: 12,
                descripcion: "Carne mechada jugosa, 2 arepitas asadas doradas, queso blanco llanero rallado, caraotas negras refritas y perico de huevos.",
                icono: "fa-plate-wheat",
                disponible: true,
                ingredientesBase: [
                    { materiaPrimaId: "MP-CARNE", nombre: "Carne de Res Mechada", cantidad: 0.15, unidad: "kg" },
                    { materiaPrimaId: "MP-HARINA-PAN", nombre: "Harina de Maíz Precocida", cantidad: 0.12, unidad: "kg" },
                    { materiaPrimaId: "MP-QUESO-BLANCO", nombre: "Queso Blanco Llanero", cantidad: 0.08, unidad: "kg" },
                    { materiaPrimaId: "MP-CARAOTAS", nombre: "Caraotas Negras", cantidad: 0.10, unidad: "kg" },
                    { materiaPrimaId: "MP-HUEVOS", nombre: "Huevos de Granja", cantidad: 2, unidad: "und" },
                    { materiaPrimaId: "MP-ACEITE", nombre: "Aceite Vegetal", cantidad: 0.03, unidad: "lt" }
                ]
            },
            {
                id: "PLATO-002",
                codigo: "AREPA_REINA_PEP",
                nombre: "Arepa Reina Pepiada Suprema",
                categoria: "Desayunos Criollos",
                turnoId: "turno_desayunos",
                estacion: "plancha_freidora",
                precioUSD: 3.20,
                costoUSD: 1.25,
                tiempoMinutos: 8,
                descripcion: "Arepa asada crujiente rellena con abundante pollo desmechado, aguacate fresco, mayonesa casera y queso gouda.",
                icono: "fa-bread-slice",
                disponible: true,
                ingredientesBase: [
                    { materiaPrimaId: "MP-HARINA-PAN", nombre: "Harina de Maíz Precocida", cantidad: 0.12, unidad: "kg" },
                    { materiaPrimaId: "MP-POLLO", nombre: "Pechuga de Pollo Desmechada", cantidad: 0.14, unidad: "kg" },
                    { materiaPrimaId: "MP-AGUACATE", nombre: "Aguacate Fresco", cantidad: 0.08, unidad: "kg" },
                    { materiaPrimaId: "MP-QUESO-AMARILLO", nombre: "Queso Amarillo Gouda", cantidad: 0.04, unidad: "kg" }
                ]
            },
            {
                id: "PLATO-003",
                codigo: "AREPA_PELUA",
                nombre: "Arepa Pelúa Tradicional",
                categoria: "Desayunos Criollos",
                turnoId: "turno_desayunos",
                estacion: "plancha_freidora",
                precioUSD: 3.00,
                costoUSD: 1.15,
                tiempoMinutos: 8,
                descripcion: "Arepa asada de maíz rellena de carne mechada en salsa criolla y queso amarillo rallado grueso.",
                icono: "fa-bread-slice",
                disponible: true,
                ingredientesBase: [
                    { materiaPrimaId: "MP-HARINA-PAN", nombre: "Harina de Maíz Precocida", cantidad: 0.12, unidad: "kg" },
                    { materiaPrimaId: "MP-CARNE", nombre: "Carne de Res Mechada", cantidad: 0.13, unidad: "kg" },
                    { materiaPrimaId: "MP-QUESO-AMARILLO", nombre: "Queso Amarillo Rallado", cantidad: 0.06, unidad: "kg" }
                ]
            },
            {
                id: "PLATO-004",
                codigo: "EMPANADAS_TRIO",
                nombre: "Trío de Empanadas Operadas Viasa",
                categoria: "Desayunos Criollos",
                turnoId: "turno_desayunos",
                estacion: "plancha_freidora",
                precioUSD: 3.50,
                costoUSD: 1.30,
                tiempoMinutos: 10,
                descripcion: "3 empanadas crujientes de maíz amarillo: 1 de carne mechada con queso, 1 de pollo sazonado y 1 de queso paisa derretido.",
                icono: "fa-cookie-bite",
                disponible: true,
                ingredientesBase: [
                    { materiaPrimaId: "MP-HARINA-PAN", nombre: "Harina de Maíz Precocida", cantidad: 0.20, unidad: "kg" },
                    { materiaPrimaId: "MP-CARNE", nombre: "Carne de Res Mechada", cantidad: 0.08, unidad: "kg" },
                    { materiaPrimaId: "MP-POLLO", nombre: "Pollo Sazonado", cantidad: 0.08, unidad: "kg" },
                    { materiaPrimaId: "MP-QUESO-BLANCO", nombre: "Queso Paisa", cantidad: 0.08, unidad: "kg" },
                    { materiaPrimaId: "MP-ACEITE", nombre: "Aceite para Freír", cantidad: 0.06, unidad: "lt" }
                ]
            },
            {
                id: "PLATO-005",
                codigo: "PASTELITOS_ANDINOS",
                nombre: "Pastelitos Andinos Hojaldrados (x3)",
                categoria: "Desayunos Criollos",
                turnoId: "turno_desayunos",
                estacion: "plancha_freidora",
                precioUSD: 2.80,
                costoUSD: 1.05,
                tiempoMinutos: 8,
                descripcion: "Masa fina hojaldrada rellenos de carne molida con arroz y huevo, papa con queso y pollo desmechado.",
                icono: "fa-chart-pie",
                disponible: true,
                ingredientesBase: [
                    { materiaPrimaId: "MP-001", nombre: "Harina de Trigo Todo Uso", cantidad: 0.15, unidad: "kg" },
                    { materiaPrimaId: "MP-CARNE", nombre: "Carne Molida Guisada", cantidad: 0.08, unidad: "kg" },
                    { materiaPrimaId: "MP-QUESO-BLANCO", nombre: "Queso Blanco", cantidad: 0.06, unidad: "kg" },
                    { materiaPrimaId: "MP-ACEITE", nombre: "Aceite Vegetal", cantidad: 0.05, unidad: "lt" }
                ]
            },

            // ALMUERZOS EJECUTIVOS
            {
                id: "PLATO-006",
                codigo: "ALM_PABELLON_CRIOLLO",
                nombre: "Pabellón Criollo Mantaguano",
                categoria: "Almuerzos Ejecutivos",
                turnoId: "turno_almuerzos",
                estacion: "cocina_caliente",
                precioUSD: 5.80,
                costoUSD: 2.30,
                tiempoMinutos: 15,
                descripcion: "Carne de res mechada en su jugo, arroz blanco grano entero, caraotas negras, tajadas de plátano maduro frito y queso blanco.",
                icono: "fa-bowl-rice",
                disponible: true,
                ingredientesBase: [
                    { materiaPrimaId: "MP-CARNE", nombre: "Carne de Res Mechada", cantidad: 0.18, unidad: "kg" },
                    { materiaPrimaId: "MP-ARROZ", nombre: "Arroz Blanco Grano Entero", cantidad: 0.12, unidad: "kg" },
                    { materiaPrimaId: "MP-CARAOTAS", nombre: "Caraotas Negras", cantidad: 0.12, unidad: "kg" },
                    { materiaPrimaId: "MP-PLATANO", nombre: "Plátano Maduro", cantidad: 0.15, unidad: "kg" },
                    { materiaPrimaId: "MP-QUESO-BLANCO", nombre: "Queso Blanco Rallado", cantidad: 0.05, unidad: "kg" }
                ]
            },
            {
                id: "PLATO-007",
                codigo: "ALM_POLLO_GRILL",
                nombre: "Pechuga de Pollo al Grill con Finas Hierbas",
                categoria: "Almuerzos Ejecutivos",
                turnoId: "turno_almuerzos",
                estacion: "plancha_freidora",
                precioUSD: 5.20,
                costoUSD: 2.05,
                tiempoMinutos: 14,
                descripcion: "Pechuga de pollo a la plancha dorada con chimichurri suave, servida con arroz amarillo a la cúrcuma y ensalada fresca mixta.",
                icono: "fa-drumstick-bite",
                disponible: true,
                ingredientesBase: [
                    { materiaPrimaId: "MP-POLLO", nombre: "Pechuga de Pollo", cantidad: 0.22, unidad: "kg" },
                    { materiaPrimaId: "MP-ARROZ", nombre: "Arroz Blanco", cantidad: 0.12, unidad: "kg" },
                    { materiaPrimaId: "MP-VEGETALES", nombre: "Lechuga, Tomate y Pepino", cantidad: 0.10, unidad: "kg" },
                    { materiaPrimaId: "MP-ACEITE", nombre: "Aceite de Oliva y Especias", cantidad: 0.02, unidad: "lt" }
                ]
            },
            {
                id: "PLATO-008",
                codigo: "ALM_ASADO_NEGRO",
                nombre: "Asado Negro en Reducción de Papelón y Puré",
                categoria: "Almuerzos Ejecutivos",
                turnoId: "turno_almuerzos",
                estacion: "cocina_caliente",
                precioUSD: 6.50,
                costoUSD: 2.70,
                tiempoMinutos: 12,
                descripcion: "Medallones de muchacho redondo braseados en salsa oscura de papelón con vino dulce, puré de papas a la mantequilla y ensalada rallada.",
                icono: "fa-utensils",
                disponible: true,
                ingredientesBase: [
                    { materiaPrimaId: "MP-CARNE", nombre: "Muchacho Redondo de Res", cantidad: 0.20, unidad: "kg" },
                    { materiaPrimaId: "MP-PAPELON", nombre: "Papelón / Panela", cantidad: 0.05, unidad: "kg" },
                    { materiaPrimaId: "MP-PAPA", nombre: "Papas para Puré", cantidad: 0.18, unidad: "kg" },
                    { materiaPrimaId: "MP-MANTEQUILLA", nombre: "Mantequilla", cantidad: 0.03, unidad: "kg" }
                ]
            },
            {
                id: "PLATO-009",
                codigo: "ALM_PASTA_BOLOGNESA",
                nombre: "Pasta a la Boloñesa Gratinada y Pan de Ajo",
                categoria: "Almuerzos Ejecutivos",
                turnoId: "turno_almuerzos",
                estacion: "cocina_caliente",
                precioUSD: 4.80,
                costoUSD: 1.80,
                tiempoMinutos: 10,
                descripcion: "Pasta corta pluma en salsa boloñesa con carne de res, tomates confitados, queso parmesano y rebanadas de pan baguette al ajillo.",
                icono: "fa-bowl-food",
                disponible: true,
                ingredientesBase: [
                    { materiaPrimaId: "MP-PASTA", nombre: "Pasta Pluma", cantidad: 0.14, unidad: "kg" },
                    { materiaPrimaId: "MP-CARNE", nombre: "Carne Molida", cantidad: 0.10, unidad: "kg" },
                    { materiaPrimaId: "MP-TOMATE", nombre: "Salsa de Tomate Natural", cantidad: 0.12, unidad: "kg" },
                    { materiaPrimaId: "MP-QUESO-PARMESANO", nombre: "Queso Parmesano", cantidad: 0.03, unidad: "kg" },
                    { materiaPrimaId: "MP-001", nombre: "Pan Baguette de Ajo", cantidad: 0.08, unidad: "kg" }
                ]
            },

            // CENAS, FAST FOOD Y PASAPALOS
            {
                id: "PLATO-010",
                codigo: "CEN_CLUB_HOUSE",
                nombre: "Club House Gourmet Viasa con Papas Fritas",
                categoria: "Cenas y Fast Food",
                turnoId: "turno_cenas",
                estacion: "plancha_freidora",
                precioUSD: 5.50,
                costoUSD: 2.15,
                tiempoMinutos: 14,
                descripcion: "Sandwich de 3 pisos con pan de molde horneado en Viasa, jamón ahumado, queso amarillo, tocineta crocante, pollo desmechado, lechuga, tomate y huevo.",
                icono: "fa-layer-group",
                disponible: true,
                ingredientesBase: [
                    { materiaPrimaId: "MP-001", nombre: "Pan de Sandwich Artesanal (3 rebanadas)", cantidad: 0.12, unidad: "kg" },
                    { materiaPrimaId: "MP-POLLO", nombre: "Pollo Desmechado", cantidad: 0.10, unidad: "kg" },
                    { materiaPrimaId: "MP-JAMON", nombre: "Jamón Superior", cantidad: 0.06, unidad: "kg" },
                    { materiaPrimaId: "MP-QUESO-AMARILLO", nombre: "Queso Amarillo", cantidad: 0.05, unidad: "kg" },
                    { materiaPrimaId: "MP-TOCINETA", nombre: "Tocineta Ahumada", cantidad: 0.04, unidad: "kg" },
                    { materiaPrimaId: "MP-PAPA", nombre: "Papas para Freír", cantidad: 0.15, unidad: "kg" }
                ]
            },
            {
                id: "PLATO-011",
                codigo: "CEN_BURGER_BRIOCHE",
                nombre: "Hamburguesa Gourmet con Pan Brioche Viasa",
                categoria: "Cenas y Fast Food",
                turnoId: "turno_cenas",
                estacion: "plancha_freidora",
                precioUSD: 5.90,
                costoUSD: 2.40,
                tiempoMinutos: 12,
                descripcion: "Carne de res angus 160g a la plancha, queso cheddar fundido, tocineta, cebolla caramelizada, lechuga romana y pan brioche horneado en casa.",
                icono: "fa-burger",
                disponible: true,
                ingredientesBase: [
                    { materiaPrimaId: "MP-001", nombre: "Pan Brioche con Ajonjolí Viasa", cantidad: 1, unidad: "und" },
                    { materiaPrimaId: "MP-CARNE", nombre: "Carne de Res Molida Angus", cantidad: 0.16, unidad: "kg" },
                    { materiaPrimaId: "MP-QUESO-CHEDDAR", nombre: "Queso Cheddar", cantidad: 0.04, unidad: "kg" },
                    { materiaPrimaId: "MP-TOCINETA", nombre: "Tocineta Ahumada", cantidad: 0.04, unidad: "kg" },
                    { materiaPrimaId: "MP-CEBOLLA", nombre: "Cebolla Caramelizada", cantidad: 0.04, unidad: "kg" }
                ]
            },
            {
                id: "PLATO-012",
                codigo: "CEN_TEQUENOS_GTR",
                nombre: "Ración de Tequeños Gourmet Artesanales (x12)",
                categoria: "Cenas y Fast Food",
                turnoId: "turno_cenas",
                estacion: "plancha_freidora",
                precioUSD: 4.00,
                costoUSD: 1.60,
                tiempoMinutos: 8,
                descripcion: "12 tequeños dorados elaborados con masa semidulce hojaldrada rellenos de queso blanco llanero fundente con salsa de papelón con maracuyá.",
                icono: "fa-cubes",
                disponible: true,
                ingredientesBase: [
                    { materiaPrimaId: "MP-001", nombre: "Harina de Trigo Panadera", cantidad: 0.20, unidad: "kg" },
                    { materiaPrimaId: "MP-QUESO-BLANCO", nombre: "Queso Blanco Especial", cantidad: 0.25, unidad: "kg" },
                    { materiaPrimaId: "MP-ACEITE", nombre: "Aceite para Freír", cantidad: 0.08, unidad: "lt" }
                ]
            },

            // CAFETERÍA DE ESPECIALIDAD Y BEBIDAS
            {
                id: "PLATO-013",
                codigo: "CAF_CAPUCHINO",
                nombre: "Café Capuchino Italiano con Espuma y Canela",
                categoria: "Cafetería y Bebidas",
                turnoId: "turno_desayunos",
                estacion: "barra_cafe",
                precioUSD: 1.80,
                costoUSD: 0.45,
                tiempoMinutos: 4,
                descripcion: "Espresso doble de café caroní recién molido, leche entera vaporizada cremosa y toque de canela y cacao en polvo.",
                icono: "fa-mug-hot",
                disponible: true,
                ingredientesBase: [
                    { materiaPrimaId: "MP-CAFE", nombre: "Café en Grano Caroní Gourmet", cantidad: 0.018, unidad: "kg" },
                    { materiaPrimaId: "MP-LECHE", nombre: "Leche Entera Líquida", cantidad: 0.18, unidad: "lt" }
                ]
            },
            {
                id: "PLATO-014",
                codigo: "CAF_CON_LECHE_GRANDE",
                nombre: "Café con Leche Grande Viasa (Marrón Claro)",
                categoria: "Cafetería y Bebidas",
                turnoId: "turno_desayunos",
                estacion: "barra_cafe",
                precioUSD: 1.50,
                costoUSD: 0.40,
                tiempoMinutos: 3,
                descripcion: "Café tradicional venezolano servido en taza grande con leche caliente espumada.",
                icono: "fa-mug-saucer",
                disponible: true,
                ingredientesBase: [
                    { materiaPrimaId: "MP-CAFE", nombre: "Café en Grano Tostado", cantidad: 0.015, unidad: "kg" },
                    { materiaPrimaId: "MP-LECHE", nombre: "Leche Líquida", cantidad: 0.20, unidad: "lt" }
                ]
            },
            {
                id: "PLATO-015",
                codigo: "BEB_JUGO_NATURAL",
                nombre: "Jugo Natural Frappé de Frutas del Día (500ml)",
                categoria: "Cafetería y Bebidas",
                turnoId: "turno_desayunos",
                estacion: "barra_cafe",
                precioUSD: 1.50,
                costoUSD: 0.50,
                tiempoMinutos: 4,
                descripcion: "Jugo natural recién licuado con fruta fresca de temporada (Naranja, Parchita, Melón, Fresa o Guayaba).",
                icono: "fa-glass-water",
                disponible: true,
                ingredientesBase: [
                    { materiaPrimaId: "MP-PULPA-FRUTA", nombre: "Pulpa de Fruta Natural", cantidad: 0.15, unidad: "kg" },
                    { materiaPrimaId: "MP-008", nombre: "Azúcar Refinada", cantidad: 0.03, unidad: "kg" }
                ]
            },
            {
                id: "PLATO-016",
                codigo: "BEB_MALTA_REFRESCO",
                nombre: "Malta Polar / Refresco de Botella 355ml",
                categoria: "Cafetería y Bebidas",
                turnoId: "turno_almuerzos",
                estacion: "barra_cafe",
                precioUSD: 1.20,
                costoUSD: 0.65,
                tiempoMinutos: 1,
                descripcion: "Malta Polar bien fría o Refresco en botella de vidrio retornable / lata.",
                icono: "fa-bottle-water",
                disponible: true,
                ingredientesBase: [
                    { materiaPrimaId: "MP-BEBIDA-EMB", nombre: "Unidad de Bebida Envasada", cantidad: 1, unidad: "und" }
                ]
            }
        ],

        comandasCafetin: [
            {
                id: "CMD-CAF-001",
                mesaId: "MESA-02",
                mesaNumero: 2,
                mesaNombre: "Mesa 2 (Salón Principal)",
                mesoeroNombre: "Yulimar Torres",
                estado: "en_cocina",
                tiempoMinutos: 14,
                horaEnvio: "08:15 AM",
                turno: "turno_desayunos",
                comensales: 3,
                notasGenerales: "Arepas bien tostadas por favor.",
                items: [
                    { platoId: "PLATO-001", nombre: "Desayuno Criollo Especial Viasa", cantidad: 2, precioUnitarioUSD: 4.50, estacion: "cocina_caliente", tiempoOrden: "1º Plato Fuerte", estado: "en_cocina", notas: "Caraotas sin picante" },
                    { platoId: "PLATO-013", nombre: "Café Capuchino Italiano", cantidad: 2, precioUnitarioUSD: 1.80, estacion: "barra_cafe", tiempoOrden: "1º Cafetería", estado: "listo", notas: "Con canela" },
                    { platoId: "PLATO-015", nombre: "Jugo Natural de Parchita", cantidad: 1, precioUnitarioUSD: 1.50, estacion: "barra_cafe", tiempoOrden: "1º Bebida", estado: "listo", notas: "Poco azúcar" }
                ],
                totalUSD: 14.20,
                totalBs: 523.27
            },
            {
                id: "CMD-CAF-002",
                mesaId: "MESA-03",
                mesaNumero: 3,
                mesaNombre: "Mesa 3 (Salón Principal)",
                mesoeroNombre: "José Ramón Silva",
                estado: "pendiente",
                tiempoMinutos: 4,
                horaEnvio: "08:30 AM",
                turno: "turno_desayunos",
                comensales: 2,
                notasGenerales: "Cliente alérgico al tomate.",
                items: [
                    { platoId: "PLATO-002", nombre: "Arepa Reina Pepiada Suprema", cantidad: 2, precioUnitarioUSD: 3.20, estacion: "plancha_freidora", tiempoOrden: "1º Desayuno", estado: "pendiente", notas: "Extra aguacate" },
                    { platoId: "PLATO-014", nombre: "Café con Leche Grande Viasa", cantidad: 2, precioUnitarioUSD: 1.50, estacion: "barra_cafe", tiempoOrden: "1º Cafetería", estado: "en_cocina", notas: "Marrón oscuro" }
                ],
                totalUSD: 9.70,
                totalBs: 357.45
            },
            {
                id: "CMD-CAF-003",
                mesaId: "MESA-05",
                mesaNumero: 5,
                mesaNombre: "Mesa 5 (Salón Principal)",
                mesoeroNombre: "Yulimar Torres",
                estado: "listo",
                tiempoMinutos: 22,
                horaEnvio: "07:50 AM",
                turno: "turno_desayunos",
                comensales: 4,
                notasGenerales: "",
                items: [
                    { platoId: "PLATO-001", nombre: "Desayuno Criollo Especial Viasa", cantidad: 3, precioUnitarioUSD: 4.50, estacion: "cocina_caliente", tiempoOrden: "1º Plato Fuerte", estado: "listo", notas: "" },
                    { platoId: "PLATO-004", nombre: "Trío de Empanadas Operadas Viasa", cantidad: 2, precioUnitarioUSD: 3.50, estacion: "plancha_freidora", tiempoOrden: "1º Entrada", estado: "listo", notas: "" },
                    { platoId: "PLATO-015", nombre: "Jugo Natural de Fresa Frappé", cantidad: 2, precioUnitarioUSD: 1.50, estacion: "barra_cafe", tiempoOrden: "1º Bebida", estado: "listo", notas: "" }
                ],
                totalUSD: 23.50,
                totalBs: 865.98
            },
            {
                id: "CMD-CAF-005",
                mesaId: "MESA-BARRA",
                mesaNumero: 13,
                mesaNombre: "Barra Cafetín",
                mesoeroNombre: "Yulimar Torres",
                estado: "listo",
                tiempoMinutos: 8,
                horaEnvio: "08:40 AM",
                turno: "turno_desayunos",
                comensales: 2,
                notasGenerales: "Consumo rápido en barra",
                items: [
                    { platoId: "PLATO-005", nombre: "Pastelitos Andinos Hojaldrados (x3)", cantidad: 1, precioUnitarioUSD: 2.80, estacion: "plancha_freidora", tiempoOrden: "1º Desayuno", estado: "listo", notas: "" },
                    { platoId: "PLATO-014", nombre: "Café con Leche Grande Viasa", cantidad: 1, precioUnitarioUSD: 1.50, estacion: "barra_cafe", tiempoOrden: "1º Cafetería", estado: "listo", notas: "" }
                ],
                totalUSD: 4.80,
                totalBs: 176.88
            }
        ],

        cortesiasAutorizadas: [
            {
                id: "COR-001",
                fecha: "2026-09-06",
                hora: "09:30 AM",
                mesaId: "MESA-02",
                platoId: "PLATO-014",
                platoNombre: "Café con Leche Grande",
                montoUSD: 1.50,
                motivo: "Cortesía a cliente frecuente VIP por tiempo de espera",
                autorizadoPor: "Administración Viasa",
                aprobado: true
            }
        ],

        propinasRegistro: [
            {
                id: "PROP-001",
                fecha: "2026-09-06",
                turno: "Mañana",
                mesaId: "MESA-04",
                mesoneroNombre: "Yulimar Torres",
                porcentajePropina: 10,
                montoTotalCuentaUSD: 18.50,
                montoPropinaUSD: 1.85,
                montoPropinaBs: 68.17,
                metodoPago: "Pago Móvil Bs"
            }
        ],

        // ==============================================================
        // ACTIVOS FIJOS INDUSTRIALES Y MANTENIMIENTO TÉCNICO DE MAQUINARIA
        // ==============================================================
        activosMaquinaria: [
            {
                id: "ACT-001",
                codigo: "MQ-HORNO-ROT-01",
                nombre: "Horno Rotativo Industrial 36 Bandejas",
                marca: "Revent / Mondial Forni",
                modelo: "Rotomax 80x60 Gas/Diésel",
                numeroSerie: "REV-2021-98402",
                ubicacion: "Nave de Horneado Central",
                fechaAdquisicion: "2021-04-15",
                valorAdquisicionUSD: 12500.00,
                horometroHoras: 4820,
                capacidad: "36 bandejas (720 panes franceses por hornada)",
                temperaturaMaximaC: 300,
                combustible: "Dual Gas Directo / Gasoil de Respaldo",
                potenciaElectricaKW: 4.5,
                estado: "operativo", // 'operativo', 'en_mantenimiento', 'requiere_servicio', 'fuera_de_servicio'
                criticidad: "alta",
                frecuenciaMantenimientoDias: 30,
                ultimoMantenimiento: "2026-08-18",
                proximoMantenimiento: "2026-09-18",
                tecnicoResponsable: "Ing. Roberto Padrón (Servicios Guayana)",
                fotoUrl: "assets/img/maquinaria_horno_rotativo.png",
                repuestosCriticos: ["Inyector de Gas GLP", "Rodamientos de Alta Temperatura SKF 6208", "Correa Dentada de Tracción", "Termocupla Tipo K"]
            },
            {
                id: "ACT-002",
                codigo: "MQ-AMASADORA-ESP-01",
                nombre: "Amasadora Espiral Industrial 2 Sacos (80kg)",
                marca: "Pietro Berto / Sigma",
                modelo: "SpiralMix 120L Double Speed",
                numeroSerie: "PB-2020-44910",
                ubicacion: "Sala de Amasado y Pre-mezcla",
                fechaAdquisicion: "2020-11-20",
                valorAdquisicionUSD: 6800.00,
                horometroHoras: 3140,
                capacidad: "80 kg masa (2 sacos de harina de 45kg)",
                potenciaElectricaKW: 7.5,
                estado: "operativo",
                criticidad: "alta",
                frecuenciaMantenimientoDias: 45,
                ultimoMantenimiento: "2026-08-08",
                proximoMantenimiento: "2026-09-22",
                tecnicoResponsable: "Téc. Marcos Yánez",
                fotoUrl: "assets/img/maquinaria_amasadora_espiral.png",
                repuestosCriticos: ["Juego Correas Gates B-54", "Retenes de Aceite Reductor", "Temporizador Digital Doble Velocidad"]
            },
            {
                id: "ACT-003",
                codigo: "MQ-CAVA-CUARTO-01",
                nombre: "Cava Cuarto de Congelación y Conservación 5 HP",
                marca: "Copeland Scroll / Bohn",
                modelo: "ColdRoom Dual Temp (-18°C / +4°C)",
                numeroSerie: "COP-2019-11029",
                ubicacion: "Almacén de Perecederos y Lácteos",
                fechaAdquisicion: "2019-08-10",
                valorAdquisicionUSD: 8200.00,
                horometroHoras: 12400,
                capacidad: "18 m³ (Capacidad 120 cajas y 40 bloques de queso)",
                potenciaElectricaKW: 5.0,
                estado: "operativo",
                criticidad: "critica",
                frecuenciaMantenimientoDias: 30,
                ultimoMantenimiento: "2026-08-12",
                proximoMantenimiento: "2026-09-12",
                tecnicoResponsable: "Servicios Técnicos Guayana, C.A.",
                fotoUrl: "assets/img/maquinaria_cava_cuarto.png",
                repuestosCriticos: ["Gas Refrigerante R-404A", "Válvula de Expansión Termostática Danfoss", "Motor Ventilador Evaporador 1/4 HP", "Controlador Digital Carel"]
            },
            {
                id: "ACT-004",
                codigo: "MQ-CILINDRO-SOB-01",
                nombre: "Cilindro Refinador Sobador Panadero Pesado",
                marca: "Braesi / Nova",
                modelo: "Sobadora Cilindro 600mm Acero Cromo",
                numeroSerie: "BRA-2022-88231",
                ubicacion: "Mesa de Formado de Masas",
                fechaAdquisicion: "2022-03-05",
                valorAdquisicionUSD: 3900.00,
                horometroHoras: 2950,
                capacidad: "15 kg masa por pasada rápida",
                potenciaElectricaKW: 3.0,
                estado: "operativo",
                criticidad: "media",
                frecuenciaMantenimientoDias: 60,
                ultimoMantenimiento: "2026-07-25",
                proximoMantenimiento: "2026-09-25",
                tecnicoResponsable: "Téc. Marcos Yánez",
                fotoUrl: "assets/img/maquinaria_cilindro_sobador.png",
                repuestosCriticos: ["Chumaceras UCP 208", "Engranajes Helicoidales de Transmisión", "Cadena de Mando 5/8"]
            },
            {
                id: "ACT-005",
                codigo: "MQ-PLANTA-DIESEL-01",
                nombre: "Planta Eléctrica Diésel de Respaldo 50 kVA (ATS)",
                marca: "Cummins / Stamford Power",
                modelo: "Silent C50D5 con Transfer Automático",
                numeroSerie: "CUM-2023-09418",
                ubicacion: "Caseta Exterior de Generación (La Sabanita)",
                fechaAdquisicion: "2023-01-18",
                valorAdquisicionUSD: 14200.00,
                horometroHoras: 380,
                capacidad: "50 kVA / 40 kW trifásica 220V/110V (Autonomía 100% Panadería)",
                potenciaElectricaKW: 40.0,
                estado: "operativo",
                criticidad: "critica",
                frecuenciaMantenimientoDias: 90,
                ultimoMantenimiento: "2026-06-15",
                proximoMantenimiento: "2026-09-15",
                tecnicoResponsable: "Ing. Roberto Padrón",
                fotoUrl: "assets/img/maquinaria_planta_diesel.png",
                repuestosCriticos: ["Filtro de Diésel Separador de Agua Racor", "Filtro de Aceite LF16015", "Aceite 15W-40 4 Galones", "Batería 1000A Duncan"]
            },
            {
                id: "ACT-006",
                codigo: "MQ-DIVISORA-BOL-01",
                nombre: "Divisora y Boleadora Automática de Masas 30 Pistas",
                marca: "Erika Record / Sinmag",
                modelo: "Div-Rounder 30P Semi-Auto",
                numeroSerie: "ERK-2021-33120",
                ubicacion: "Línea de Pan Francés y Canilla",
                fechaAdquisicion: "2021-09-14",
                valorAdquisicionUSD: 4600.00,
                horometroHoras: 1820,
                capacidad: "30 porciones exactas de 50g a 150g por ciclo",
                potenciaElectricaKW: 1.5,
                estado: "en_mantenimiento",
                criticidad: "media",
                frecuenciaMantenimientoDias: 45,
                ultimoMantenimiento: "2026-07-20",
                proximoMantenimiento: "2026-09-08",
                tecnicoResponsable: "Téc. Marcos Yánez",
                fotoUrl: "assets/img/maquinaria_divisora_boleadora.png",
                repuestosCriticos: ["Plato de División de Teflón", "Cuchillas Estrella de Acero Inoxidable", "Pistón Hidráulico de Prensado"]
            },
            {
                id: "ACT-007",
                codigo: "MQ-REBANADORA-EMP-01",
                nombre: "Rebanadora y Empacadora Continua de Pan de Sándwich",
                marca: "Oliver Packaging / Jac",
                modelo: "Variocut Slicer 12mm",
                numeroSerie: "OLV-2022-77192",
                ubicacion: "Área de Empaque y Despacho Viasa",
                fechaAdquisicion: "2022-08-30",
                valorAdquisicionUSD: 3100.00,
                horometroHoras: 1410,
                capacidad: "300 panes de sándwich por hora",
                potenciaElectricaKW: 1.1,
                estado: "operativo",
                criticidad: "media",
                frecuenciaMantenimientoDias: 60,
                ultimoMantenimiento: "2026-07-30",
                proximoMantenimiento: "2026-09-30",
                tecnicoResponsable: "Téc. Marcos Yánez",
                fotoUrl: "assets/img/maquinaria_rebanadora_pan.png",
                repuestosCriticos: ["Juego de Hojas Dentadas de Acero Templado", "Guías de Empuje de Acero Inox"]
            }
        ],

        mantenimientosMaquinaria: [
            {
                id: "MANT-2026-001",
                activoId: "ACT-001",
                activoNombre: "Horno Rotativo Industrial 36 Bandejas",
                tipo: "Preventivo", // 'Preventivo', 'Correctivo', 'Emergencia'
                fecha: "2026-08-18",
                horometroAlMomento: 4680,
                descripcion: "Mantenimiento mensual regular: calibración de quemador de gas, limpieza profunda de toberas, engrase de rodamientos SKF con grasa térmica Klüber y tensión de cadena motriz.",
                repuestosUtilizados: [
                    { repuesto: "Grasa Térmica Alta Temp Klüber (400g)", cantidad: 1, costoUSD: 25.00 },
                    { repuesto: "Empacadura de Mirilla Térmica", cantidad: 1, costoUSD: 20.00 }
                ],
                costoRepuestosUSD: 45.00,
                costoManoObraUSD: 50.00,
                costoTotalUSD: 95.00,
                costoTotalBs: 3500.75,
                tecnico: "Ing. Roberto Padrón",
                empresaServicio: "Servicios Técnicos Guayana, C.A.",
                estado: "completado",
                observaciones: "Quemador funcionando con llama azulada 100% libre de hollín. Próximo servicio programado para el 18 de septiembre."
            },
            {
                id: "MANT-2026-002",
                activoId: "ACT-002",
                activoNombre: "Amasadora Espiral Industrial 2 Sacos (80kg)",
                tipo: "Correctivo",
                fecha: "2026-08-08",
                horometroAlMomento: 3020,
                descripcion: "Sustitución de juego de 3 correas de transmisión por desgaste natural y patinaje en segunda velocidad con carga completa de masa campesina.",
                repuestosUtilizados: [
                    { repuesto: "Correas Industriales Gates B-54", cantidad: 3, costoUSD: 38.00 }
                ],
                costoRepuestosUSD: 38.00,
                costoManoObraUSD: 30.00,
                costoTotalUSD: 68.00,
                costoTotalBs: 2505.80,
                tecnico: "Téc. Marcos Yánez",
                empresaServicio: "Mantenimiento Interno Viasa",
                estado: "completado",
                observaciones: "Tensión calibrada a 45 lbs con tensiómetro óptico. Amasado silencioso y sin vibraciones."
            },
            {
                id: "MANT-2026-003",
                activoId: "ACT-003",
                activoNombre: "Cava Cuarto de Congelación y Conservación 5 HP",
                tipo: "Preventivo",
                fecha: "2026-08-12",
                horometroAlMomento: 12150,
                descripcion: "Lavado químico de serpentín condensador exterior, chequeo de presiones alta/baja (220/28 PSI con R-404A), calibración del termostato digital y revisión del descongelamiento eléctrico por resistencias.",
                repuestosUtilizados: [
                    { repuesto: "Carga de Gas Refrigerante R-404A (1.5 kg)", cantidad: 1, costoUSD: 45.00 },
                    { repuesto: "Limpiador Químico Espumógeno Foamer", cantidad: 1, costoUSD: 20.00 }
                ],
                costoRepuestosUSD: 65.00,
                costoManoObraUSD: 40.00,
                costoTotalUSD: 105.00,
                costoTotalBs: 3869.25,
                tecnico: "Servicios Técnicos Guayana, C.A.",
                empresaServicio: "Servicios Técnicos Guayana, C.A.",
                estado: "completado",
                observaciones: "Cava alcanzando -18°C en 45 minutos. Sellado de burletes de puerta hermético."
            },
            {
                id: "MANT-2026-004",
                activoId: "ACT-006",
                activoNombre: "Divisora y Boleadora Automática de Masas 30 Pistas",
                tipo: "Correctivo",
                fecha: "2026-09-06",
                horometroAlMomento: 1820,
                descripcion: "Desarme para sustitución de resortes de retorno del plato divisor y afilado de cuchillas de corte en acero inoxidable. Equipo en banco de pruebas.",
                repuestosUtilizados: [
                    { repuesto: "Juego Resortes de Compresión Inoxidables", cantidad: 4, costoUSD: 32.00 }
                ],
                costoRepuestosUSD: 32.00,
                costoManoObraUSD: 25.00,
                costoTotalUSD: 57.00,
                costoTotalBs: 2100.45,
                tecnico: "Téc. Marcos Yánez",
                empresaServicio: "Mantenimiento Interno Viasa",
                estado: "en_proceso",
                observaciones: "Reincorporación a línea de producción programada para el 8 de septiembre a las 06:00 AM."
            }
        ],

        // ==============================================================
        // ZONAS Y TARIFAS DE DELIVERY (CIUDAD BOLÍVAR, ESTADO BOLÍVAR)
        // ==============================================================
        zonasDeliveryCiudadBolivar: [
            {
                id: "ZONA-01",
                nombre: "Zona 1 - La Sabanita (Casco Inmediato Sede Viasa)",
                sectores: ["Calle Colón", "Av. San Salvador", "El Mirador", "Los Aceiticos", "Barrio Ajuro", "Las Morenas"],
                tarifaBaseUSD: 1.50,
                tarifaBaseBs: 55.28,
                tiempoEstimadoMin: 15,
                icono: "fa-house-flag",
                color: "#22c55e"
            },
            {
                id: "ZONA-02",
                nombre: "Zona 2 - Casco Histórico y Centro",
                sectores: ["Paseo Orinoco", "Plaza Bolívar", "Paseo Gaspari", "Calle Venezuela", "Calle Amor Patrio", "El Zanjón"],
                tarifaBaseUSD: 2.00,
                tarifaBaseBs: 73.70,
                tiempoEstimadoMin: 22,
                icono: "fa-landmark",
                color: "#38bdf8"
            },
            {
                id: "ZONA-03",
                nombre: "Zona 3 - Agua Salada y Los Próceres",
                sectores: ["Av. 5 de Julio", "Urbanización Los Próceres", "Villa Bolívar", "Las Campiñas", "Brisas del Este"],
                tarifaBaseUSD: 2.50,
                tarifaBaseBs: 92.13,
                tiempoEstimadoMin: 28,
                icono: "fa-tree",
                color: "#fbbf24"
            },
            {
                id: "ZONA-04",
                nombre: "Zona 4 - Vista Hermosa y Paseo Meneses",
                sectores: ["Av. Jesús Soto", "Paseo Meneses", "Urb. Vista Hermosa", "Andrés Eloy Blanco", "Av. Germania", "Cruz Verde"],
                tarifaBaseUSD: 2.50,
                tarifaBaseBs: 92.13,
                tiempoEstimadoMin: 28,
                icono: "fa-city",
                color: "#a78bfa"
            },
            {
                id: "ZONA-05",
                nombre: "Zona 5 - El Perú, San Rafael y Marhuanta",
                sectores: ["Urb. El Perú (Sectores 1 al 5)", "San Rafael de la Perimetral", "Marhuanta", "Puente Gómez", "Parque del Sur"],
                tarifaBaseUSD: 3.50,
                tarifaBaseBs: 128.98,
                tiempoEstimadoMin: 40,
                icono: "fa-route",
                color: "#f87171"
            }
        ],

        // ==============================================================
        // TRAZABILIDAD DE COSTOS DE INSUMOS Y ESCANDALLOS AUTOMÁTICOS
        // ==============================================================
        historicoCostosInsumos: [
            {
                insumoId: "INS-001",
                nombre: "Harina Panadera Fuerte (45kg)",
                proveedor: "Molinos Nacionales C.A. (MONACA)",
                unidad: "Saco 45kg",
                costoAnteriorUSD: 32.00,
                costoActualUSD: 36.00,
                variacionPct: 12.5,
                fechaAjuste: "2026-08-28",
                impactoRecetas: [
                    { productoId: "PRD-001", nombre: "Pan Canilla Tradicional", costoRaciónAnteriorUSD: 0.22, costoRaciónNuevoUSD: 0.25, pvpActualUSD: 0.50, pvpSugeridoUSD: 0.60, margenPct: 58.3 },
                    { productoId: "PRD-002", nombre: "Pan Campesino Rústico", costoRaciónAnteriorUSD: 0.40, costoRaciónNuevoUSD: 0.45, pvpActualUSD: 1.00, pvpSugeridoUSD: 1.20, margenPct: 62.5 },
                    { productoId: "PRD-003", nombre: "Pan Francés (Bolsa x10)", costoRaciónAnteriorUSD: 0.62, costoRaciónNuevoUSD: 0.70, pvpActualUSD: 1.50, pvpSugeridoUSD: 1.80, margenPct: 61.1 }
                ]
            },
            {
                insumoId: "INS-002",
                nombre: "Levadura Fresca Prensada",
                proveedor: "Levaduras del Caribe C.A.",
                unidad: "kg",
                costoAnteriorUSD: 3.80,
                costoActualUSD: 4.20,
                variacionPct: 10.5,
                fechaAjuste: "2026-09-01",
                impactoRecetas: [
                    { productoId: "PRD-004", nombre: "Pan de Jamón Tradicional", costoRaciónAnteriorUSD: 5.80, costoRaciónNuevoUSD: 6.20, pvpActualUSD: 12.00, pvpSugeridoUSD: 14.00, margenPct: 55.7 }
                ]
            },
            {
                insumoId: "INS-003",
                nombre: "Queso Blanco Llanero Rallado",
                proveedor: "Lácteos La Guanota C.A.",
                unidad: "kg",
                costoAnteriorUSD: 4.50,
                costoActualUSD: 5.20,
                variacionPct: 15.6,
                fechaAjuste: "2026-09-03",
                impactoRecetas: [
                    { productoId: "PRD-005", nombre: "Golfeado Meloso con Queso", costoRaciónAnteriorUSD: 0.55, costoRaciónNuevoUSD: 0.65, pvpActualUSD: 1.50, pvpSugeridoUSD: 1.80, margenPct: 63.8 },
                    { productoId: "PLATO-001", nombre: "Desayuno Criollo Especial", costoRaciónAnteriorUSD: 1.60, costoRaciónNuevoUSD: 1.85, pvpActualUSD: 4.50, pvpSugeridoUSD: 5.00, margenPct: 63.0 }
                ]
            }
        ],

        // 19. PROGRAMACIÓN DE GUARDIAS Y TURNOS ROTATIVOS (VIASA SYSTEM)
        guardiasTurnos: [
            {
                id: "GRD-2026-001",
                empleadoId: "EMP-001",
                nombreEmpleado: "Carlos Eduardo Mendoza Rivas",
                cargo: "Maestro Panadero Principal",
                departamento: "Fabricación",
                turno: "madrugada",
                nombreTurno: "Madrugada (04:00 - 12:00)",
                horaEntrada: "04:00",
                horaSalida: "12:00",
                fecha: "2026-09-08",
                estado: "activo",
                ubicacionAsignada: "Sede Principal - Sala de Hornos (La Sabanita)",
                supervisor: "Gerente General"
            },
            {
                id: "GRD-2026-002",
                empleadoId: "EMP-002",
                nombreEmpleado: "María Alejandra Gómez Soto",
                cargo: "Chef Pastelera y Repostería Fina",
                departamento: "Cocina",
                turno: "matutino",
                nombreTurno: "Matutino (06:30 - 14:30)",
                horaEntrada: "06:30",
                horaSalida: "14:30",
                fecha: "2026-09-08",
                estado: "activo",
                ubicacionAsignada: "Cafetín y Pastelería Viasa (La Sabanita)",
                supervisor: "Gerente General"
            },
            {
                id: "GRD-2026-003",
                empleadoId: "EMP-003",
                nombreEmpleado: "José Gregorio Valdez",
                cargo: "Chofer Repartidor Principal",
                departamento: "Despacho",
                turno: "matutino",
                nombreTurno: "Matutino / Despacho (07:00 - 15:00)",
                horaEntrada: "07:00",
                horaSalida: "15:00",
                fecha: "2026-09-08",
                estado: "activo",
                ubicacionAsignada: "Ruta 1 - La Sabanita / Casco Histórico",
                supervisor: "Gerente General"
            },
            {
                id: "GRD-2026-004",
                empleadoId: "EMP-004",
                nombreEmpleado: "Yusneidy del Valle Torres",
                cargo: "Cajera Principal y Mostrador",
                departamento: "Ventas",
                turno: "matutino",
                nombreTurno: "Matutino (06:30 - 14:30)",
                horaEntrada: "06:30",
                horaSalida: "14:30",
                fecha: "2026-09-08",
                estado: "activo",
                ubicacionAsignada: "Caja Principal 1 (La Sabanita)",
                supervisor: "Gerente General"
            },
            {
                id: "GRD-2026-005",
                empleadoId: "EMP-005",
                nombreEmpleado: "Franklin Ramón Silva",
                cargo: "Técnico Electromecánico",
                departamento: "Mantenimiento",
                turno: "vespertino",
                nombreTurno: "Vespertino (13:00 - 21:00)",
                horaEntrada: "13:00",
                horaSalida: "21:00",
                fecha: "2026-09-08",
                estado: "activo",
                ubicacionAsignada: "Taller y Sala de Maquinaria",
                supervisor: "Gerente General"
            },
            {
                id: "GRD-2026-006",
                empleadoId: "EMP-006",
                nombreEmpleado: "Luisiana Isabel Rangel",
                cargo: "Mesonera y Barista",
                departamento: "Cocina",
                turno: "vespertino",
                nombreTurno: "Vespertino / Salón (12:00 - 20:00)",
                horaEntrada: "12:00",
                horaSalida: "20:00",
                fecha: "2026-09-08",
                estado: "activo",
                ubicacionAsignada: "Salón Cafetín Viasa",
                supervisor: "Gerente General"
            }
        ],

        // 20. BOLSA DE INTERCAMBIO DE GUARDIAS (SHIFT MARKETPLACE)
        shiftMarketplace: [
            {
                id: "SWAP-001",
                guardiaId: "GRD-2026-005",
                solicitanteId: "EMP-005",
                solicitanteNombre: "Franklin Ramón Silva",
                departamento: "Mantenimiento",
                fechaGuardia: "2026-09-09",
                turnoOriginal: "Vespertino (13:00 - 21:00)",
                motivo: "Cita médica programada en el IVSS Ciudad Bolívar",
                candidatoId: "EMP-007",
                candidatoNombre: "Héctor Antonio Bermúdez",
                estado: "pendiente_aprobacion",
                fechaSolicitud: "2026-09-08 09:30",
                aprobadoPor: null,
                fechaAprobacion: null
            },
            {
                id: "SWAP-002",
                guardiaId: "GRD-2026-006",
                solicitanteId: "EMP-006",
                solicitanteNombre: "Luisiana Isabel Rangel",
                departamento: "Cocina",
                fechaGuardia: "2026-09-07",
                turnoOriginal: "Vespertino / Salón (12:00 - 20:00)",
                motivo: "Trámite universitario UDO Bolívar",
                candidatoId: "EMP-008",
                candidatoNombre: "Génesis Coromoto Páez",
                estado: "aprobado",
                fechaSolicitud: "2026-09-06 14:00",
                aprobadoPor: "Gerente General",
                fechaAprobacion: "2026-09-06 17:30"
            }
        ],

        // 21. CENTRO LOGÍSTICO Y RUTAS DE DESPACHO EN CIUDAD BOLÍVAR
        despachosRutas: [
            {
                id: "RUTA-CB-001",
                codigo: "RUTA-NORTE-01",
                nombreRuta: "Ruta 1: La Sabanita y Casco Histórico",
                sector: "La Sabanita / Casco Histórico / Paseo Meneses",
                choferId: "EMP-003",
                choferNombre: "José Gregorio Valdez",
                vehiculo: "Furgón Térmico Fiorino (Placa: A92BC3D)",
                fecha: "2026-09-08",
                turno: "07:00 - 11:30",
                estado: "en_ruta",
                totalParadas: 4,
                paradasCompletadas: 2,
                paradas: [
                    {
                        paradaNum: 1,
                        clienteNombre: "Inversiones El Gran Samán, C.A.",
                        rif: "J-50123984-1",
                        direccion: "Calle Colón c/c Av. España, La Sabanita",
                        tipoCarga: "Panadería Mayorista (50 Canillas + 20 Panes de Sandwich)",
                        montoUSD: 45.00,
                        estado: "entregado",
                        horaEntrega: "08:15",
                        lat: 8.1182,
                        lng: -63.5389,
                        qrToken: "QR-DELIV-SAMAN-001",
                        firmadoPor: "Sr. Pedro Rondón"
                    },
                    {
                        paradaNum: 2,
                        clienteNombre: "Corporación Eventos Angostura, C.A.",
                        rif: "J-40912845-2",
                        direccion: "Calle Amor Patrio, Casco Histórico",
                        tipoCarga: "Catering Cafetín (30 Croissants + 20 Golfeados Melosos)",
                        montoUSD: 52.00,
                        estado: "entregado",
                        horaEntrega: "09:05",
                        lat: 8.1345,
                        lng: -63.5512,
                        qrToken: "QR-DELIV-ANGOSTURA-002",
                        firmadoPor: "Lic. Andrea Morales"
                    },
                    {
                        paradaNum: 3,
                        clienteNombre: "Abasto y Bodegón Los Próceres",
                        rif: "J-41239081-5",
                        direccion: "Av. 5 de Julio, Casco Central",
                        tipoCarga: "Pan Francés (15 Bolsas de 10 uds) + Pan Campesino (10 uds)",
                        montoUSD: 32.50,
                        estado: "en_camino",
                        horaEntrega: null,
                        lat: 8.1310,
                        lng: -63.5480,
                        qrToken: "QR-DELIV-PROCERES-003",
                        firmadoPor: null
                    },
                    {
                        paradaNum: 4,
                        clienteNombre: "Dra. Carmen Cecilia Farías",
                        rif: "V-14285910",
                        direccion: "Paseo Meneses, Res. Los Samanes",
                        tipoCarga: "Pedido Cafetín Viasa (Desayuno Criollo + 2 Cafés Carajillo)",
                        montoUSD: 8.50,
                        estado: "pendiente",
                        horaEntrega: null,
                        lat: 8.1250,
                        lng: -63.5420,
                        qrToken: "QR-DELIV-FARIAS-004",
                        firmadoPor: null
                    }
                ]
            },
            {
                id: "RUTA-CB-002",
                codigo: "RUTA-OESTE-02",
                nombreRuta: "Ruta 2: Agua Salada, Los Próceres y El Perú",
                sector: "Agua Salada / Los Próceres / El Perú",
                choferId: "EMP-009",
                choferNombre: "Nelson Enrique Carpio",
                vehiculo: "Moto Cargo 200cc (Placa: AD892J)",
                fecha: "2026-09-08",
                turno: "11:30 - 15:00",
                estado: "preparacion",
                totalParadas: 3,
                paradasCompletadas: 0,
                paradas: [
                    {
                        paradaNum: 1,
                        clienteNombre: "Supermercado La Fuente Agua Salada",
                        rif: "J-30819283-7",
                        direccion: "Av. Principal de Agua Salada",
                        tipoCarga: "Pan Canilla (80 uds) + Pan Dulce Piñita (40 uds)",
                        montoUSD: 60.00,
                        estado: "pendiente",
                        horaEntrega: null,
                        lat: 8.1090,
                        lng: -63.5650,
                        qrToken: "QR-DELIV-AGUA-001",
                        firmadoPor: null
                    }
                ]
            }
        ],

        // 22. COLA DE SINCRONIZACIÓN OFFLINE-FIRST
        syncOfflineQueue: []
    };

    async function inicializarBaseDeDatosViasa() {
        if (!window.ViasaStorage) return;

        // 1. Cargar Usuarios
        const usuariosExistentes = window.ViasaStorage.getItem('usuarios', []);
        if (!usuariosExistentes || usuariosExistentes.length === 0) {
            window.ViasaStorage.setItem('usuarios', VIASA_CATALOGO_INICIAL.usuarios);
        }

        // 2. Cargar Empresa y Configuración
        const cfgEmpresa = window.ViasaStorage.getItem('empresa_fiscal', null);
        if (!cfgEmpresa) {
            window.ViasaStorage.setItem('empresa_fiscal', VIASA_CATALOGO_INICIAL.empresa);
        }

        // 3. Cargar Productos, Materia Prima, Fórmulas, Proveedores, CxP, Clientes y Encargos
        const productosExistentes = await window.ViasaStorage.obtenerColeccion('productos');
        if (!productosExistentes || productosExistentes.length === 0) {
            console.log('[VIASA DB] Sembrando catálogo inicial de productos...');
            for (const prd of VIASA_CATALOGO_INICIAL.productos) {
                await window.ViasaStorage.guardarRegistro('productos', prd);
            }
        }

        const mpExistentes = await window.ViasaStorage.obtenerColeccion('materia_prima');
        if (!mpExistentes || mpExistentes.length === 0) {
            console.log('[VIASA DB] Sembrando materias primas iniciales...');
            for (const mp of VIASA_CATALOGO_INICIAL.materiaPrima) {
                await window.ViasaStorage.guardarRegistro('materia_prima', mp);
            }
        }

        const recExistentes = await window.ViasaStorage.obtenerColeccion('recetas_formulas');
        if (!recExistentes || recExistentes.length === 0) {
            console.log('[VIASA DB] Sembrando fórmulas magistrales iniciales...');
            for (const rec of VIASA_CATALOGO_INICIAL.recetasFormulas) {
                await window.ViasaStorage.guardarRegistro('recetas_formulas', rec);
            }
        }

        const prvExistentes = await window.ViasaStorage.obtenerColeccion('proveedores');
        if (!prvExistentes || prvExistentes.length === 0) {
            console.log('[VIASA DB] Sembrando directorio inicial de proveedores...');
            for (const prv of VIASA_CATALOGO_INICIAL.proveedores) {
                await window.ViasaStorage.guardarRegistro('proveedores', prv);
            }
        }

        const cxpExistentes = await window.ViasaStorage.obtenerColeccion('cuentas_por_pagar');
        if (!cxpExistentes || cxpExistentes.length === 0) {
            console.log('[VIASA DB] Sembrando cuentas por pagar iniciales...');
            for (const cxp of VIASA_CATALOGO_INICIAL.cuentasPorPagar) {
                await window.ViasaStorage.guardarRegistro('cuentas_por_pagar', cxp);
            }
        }

        const clientesExistentes = await window.ViasaStorage.obtenerColeccion('clientes');
        if (!clientesExistentes || clientesExistentes.length === 0) {
            console.log('[VIASA DB] Sembrando catálogo CRM de clientes iniciales...');
            for (const cli of VIASA_CATALOGO_INICIAL.clientes) {
                await window.ViasaStorage.guardarRegistro('clientes', cli);
            }
        }

        const encargosExistentes = await window.ViasaStorage.obtenerColeccion('pedidos_especiales');
        if (!encargosExistentes || encargosExistentes.length === 0) {
            console.log('[VIASA DB] Sembrando pedidos especiales iniciales...');
            for (const enc of VIASA_CATALOGO_INICIAL.pedidosEspeciales) {
                await window.ViasaStorage.guardarRegistro('pedidos_especiales', enc);
            }
        }

        const planExistente = await window.ViasaStorage.obtenerColeccion('plan_cuentas');
        if (!planExistente || planExistente.length === 0) {
            console.log('[VIASA DB] Sembrando plan contable oficial...');
            for (const cta of VIASA_CATALOGO_INICIAL.planCuentas) {
                await window.ViasaStorage.guardarRegistro('plan_cuentas', cta);
            }
        }

        const rubrosExistentes = await window.ViasaStorage.obtenerColeccion('rubros_contables');
        if (!rubrosExistentes || rubrosExistentes.length === 0) {
            console.log('[VIASA DB] Sembrando catálogo de rubros contables frecuentes...');
            for (const rub of (VIASA_CATALOGO_INICIAL.rubrosContables || [])) {
                await window.ViasaStorage.guardarRegistro('rubros_contables', rub);
            }
        }

        const asientosExistentes = await window.ViasaStorage.obtenerColeccion('asientos_contables');
        if (!asientosExistentes || asientosExistentes.length === 0) {
            console.log('[VIASA DB] Sembrando asientos contables iniciales...');
            for (const asi of VIASA_CATALOGO_INICIAL.asientosContables) {
                await window.ViasaStorage.guardarRegistro('asientos_contables', asi);
            }
        }

        const cierresExistentes = await window.ViasaStorage.obtenerColeccion('cierres_caja');
        if (!cierresExistentes || cierresExistentes.length === 0) {
            console.log('[VIASA DB] Sembrando cierres de caja iniciales...');
            for (const cie of VIASA_CATALOGO_INICIAL.cierresCaja) {
                await window.ViasaStorage.guardarRegistro('cierres_caja', cie);
            }
        }

        const movBncExistentes = await window.ViasaStorage.obtenerColeccion('movimientos_banco');
        if (!movBncExistentes || movBncExistentes.length === 0) {
            console.log('[VIASA DB] Sembrando movimientos bancarios iniciales...');
            for (const mov of VIASA_CATALOGO_INICIAL.movimientosBanco) {
                await window.ViasaStorage.guardarRegistro('movimientos_banco', mov);
            }
        }

        const retExistentes = await window.ViasaStorage.obtenerColeccion('retenciones_iva');
        if (!retExistentes || retExistentes.length === 0) {
            console.log('[VIASA DB] Sembrando comprobantes de retención IVA...');
            for (const ret of VIASA_CATALOGO_INICIAL.retencionesIVA) {
                await window.ViasaStorage.guardarRegistro('retenciones_iva', ret);
            }
        }

        const kdsExistentes = await window.ViasaStorage.obtenerColeccion('kds_comandas');
        if (!kdsExistentes || kdsExistentes.length === 0) {
            console.log('[VIASA DB] Sembrando comandas KDS de producción...');
            for (const kds of VIASA_CATALOGO_INICIAL.kdsComandas) {
                await window.ViasaStorage.guardarRegistro('kds_comandas', kds);
            }
        }

        const empExistentes = await window.ViasaStorage.obtenerColeccion('empleados');
        if (!empExistentes || empExistentes.length === 0 || empExistentes.length < VIASA_CATALOGO_INICIAL.empleados.length) {
            console.log('[VIASA DB] Sembrando nómina enriquecida de empleados de Panadería Nueva Viasa...');
            for (const emp of VIASA_CATALOGO_INICIAL.empleados) {
                await window.ViasaStorage.guardarRegistro('empleados', emp);
            }
        }

        const fichExistentes = await window.ViasaStorage.obtenerColeccion('fichajes_asistencia');
        if (!fichExistentes || fichExistentes.length === 0) {
            console.log('[VIASA DB] Sembrando marcas de asistencia iniciales por turnos...');
            for (const fic of VIASA_CATALOGO_INICIAL.fichajesAsistencia) {
                await window.ViasaStorage.guardarRegistro('fichajes_asistencia', fic);
            }
        }

        const permExistentes = await window.ViasaStorage.obtenerColeccion('permisos_reposos_ivss');
        if (!permExistentes || permExistentes.length === 0) {
            console.log('[VIASA DB] Sembrando reposos médicos IVSS y permisos iniciales...');
            for (const perm of VIASA_CATALOGO_INICIAL.permisosRepososIVSS) {
                await window.ViasaStorage.guardarRegistro('permisos_reposos_ivss', perm);
            }
        }

        const vacExistentes = await window.ViasaStorage.obtenerColeccion('vacaciones_programadas');
        if (!vacExistentes || vacExistentes.length === 0) {
            console.log('[VIASA DB] Sembrando vacaciones y bonos vacacionales LOTTT...');
            for (const vac of VIASA_CATALOGO_INICIAL.vacacionesProgramadas) {
                await window.ViasaStorage.guardarRegistro('vacaciones_programadas', vac);
            }
        }

        const liqExistentes = await window.ViasaStorage.obtenerColeccion('liquidaciones_lottt');
        if (!liqExistentes || liqExistentes.length === 0) {
            console.log('[VIASA DB] Sembrando liquidaciones LOTTT iniciales...');
            for (const liq of VIASA_CATALOGO_INICIAL.liquidacionesLOTTT) {
                await window.ViasaStorage.guardarRegistro('liquidaciones_lottt', liq);
            }
        }

        const memRRHHExistente = await window.ViasaStorage.obtenerColeccion('banco_memoria_rrhh');
        if (!memRRHHExistente || memRRHHExistente.length === 0) {
            console.log('[VIASA DB] Sembrando archivo del Banco de Memoria RRHH...');
            for (const mem of VIASA_CATALOGO_INICIAL.bancoMemoriaRRHH) {
                await window.ViasaStorage.guardarRegistro('banco_memoria_rrhh', mem);
            }
        }

        const prevExistentes = await window.ViasaStorage.obtenerColeccion('preventas_rompefilas');
        if (!prevExistentes || prevExistentes.length === 0) {
            console.log('[VIASA DB] Sembrando preventas de salón...');
            for (const prf of VIASA_CATALOGO_INICIAL.preventasRompefilas) {
                await window.ViasaStorage.guardarRegistro('preventas_rompefilas', prf);
            }
        }

        const repExistentes = await window.ViasaStorage.obtenerColeccion('repartidores');
        if (!repExistentes || repExistentes.length === 0) {
            console.log('[VIASA DB] Sembrando flota de repartidores de delivery...');
            for (const rep of VIASA_CATALOGO_INICIAL.repartidores) {
                await window.ViasaStorage.guardarRegistro('repartidores', rep);
            }
        }

        const despExistentes = await window.ViasaStorage.obtenerColeccion('despachos_delivery');
        if (!despExistentes || despExistentes.length === 0) {
            console.log('[VIASA DB] Sembrando órdenes de despacho delivery...');
            for (const desp of VIASA_CATALOGO_INICIAL.despachosDelivery) {
                await window.ViasaStorage.guardarRegistro('despachos_delivery', desp);
            }
        }

        const predExistentes = await window.ViasaStorage.obtenerColeccion('compras_predictivas');
        if (!predExistentes || predExistentes.length === 0) {
            console.log('[VIASA DB] Sembrando parámetros de compras predictivas...');
            for (const pred of VIASA_CATALOGO_INICIAL.comprasPredictivas) {
                await window.ViasaStorage.guardarRegistro('compras_predictivas', pred);
            }
        }

        const auditExistentes = await window.ViasaStorage.obtenerColeccion('audit_logs_crypto');
        if (!auditExistentes || auditExistentes.length === 0) {
            console.log('[VIASA DB] Sembrando bloques iniciales de auditoría criptográfica...');
            for (const aud of VIASA_CATALOGO_INICIAL.auditLogsCrypto) {
                await window.ViasaStorage.guardarRegistro('audit_logs_crypto', aud);
            }
        }

        // 4. Sembrar Documentos Mercantiles y Contador NCU Global
        const docExistentes = await window.ViasaStorage.obtenerColeccion('documentos_mercantiles');
        if (!docExistentes || docExistentes.length === 0) {
            console.log('[VIASA DB] Sembrando documentos mercantiles y NCU inicial...');
            for (const doc of VIASA_CATALOGO_INICIAL.documentosMercantiles) {
                await window.ViasaStorage.guardarRegistro('documentos_mercantiles', doc);
            }
            window.ViasaStorage.setItem('numero_control_ncu_global', 5);
        } else {
            const currentNCU = window.ViasaStorage.getItem('numero_control_ncu_global', null);
            if (currentNCU === null) {
                window.ViasaStorage.setItem('numero_control_ncu_global', docExistentes.length);
            }
        }

        // 5. Sembrar Banco de Memoria Documental
        const memoriaExistente = await window.ViasaStorage.obtenerColeccion('banco_memoria_documental');
        if (!memoriaExistente || memoriaExistente.length === 0) {
            console.log('[VIASA DB] Sembrando Banco de Memoria Digital inicial...');
            const docsParaMemoria = docExistentes && docExistentes.length > 0 ? docExistentes : VIASA_CATALOGO_INICIAL.documentosMercantiles;
            for (const doc of docsParaMemoria) {
                await window.ViasaStorage.guardarRegistro('banco_memoria_documental', {
                    id: `MEM-${doc.id}`,
                    documentoId: doc.id,
                    ncu: doc.ncu,
                    tipo: doc.tipo,
                    tipoTitulo: doc.tipoTitulo,
                    fecha: doc.fecha,
                    fechaLegible: doc.fechaLegible,
                    receptorNombre: doc.receptor.nombre,
                    receptorDoc: doc.receptor.rif,
                    totalUSD: doc.totalUSD,
                    totalBs: doc.totalBs,
                    tasaBCV: doc.tasaBCV,
                    hashCrypto: doc.hashCrypto,
                    prevHash: doc.prevHash,
                    fechaArchivo: new Date().toISOString(),
                    integridadVerificada: true,
                    docOriginal: doc
                });
            }
        }

        // 6. Sembrar Cuentas de Correo Multicuenta Oficiales
        const cuentasExistentes = await window.ViasaStorage.obtenerColeccion('cuentas_correo');
        if (!cuentasExistentes || cuentasExistentes.length === 0) {
            console.log('[VIASA DB] Sembrando cuentas de correo corporativas oficiales...');
            for (const acc of VIASA_CATALOGO_INICIAL.cuentasCorreo) {
                await window.ViasaStorage.guardarRegistro('cuentas_correo', acc);
            }
        }

        // 7. Sembrar Mensajes y Documentos de Correo CRM Sincronizados
        const mensajesExistentes = await window.ViasaStorage.obtenerColeccion('mensajes_correo_crm');
        if (!mensajesExistentes || mensajesExistentes.length === 0) {
            console.log('[VIASA DB] Sembrando mensajes de correo y facturas adjuntas en CRM...');
            for (const msg of VIASA_CATALOGO_INICIAL.mensajesCorreoCRM) {
                await window.ViasaStorage.guardarRegistro('mensajes_correo_crm', msg);
            }
        }

        // 8. Sembrar Plantillas Dinámicas de Correo (Protocolos Comerciales y RRHH)
        const plantillasExistentes = await window.ViasaStorage.obtenerColeccion('plantillas_correo');
        if (!plantillasExistentes || plantillasExistentes.length === 0 || plantillasExistentes.length < VIASA_CATALOGO_INICIAL.plantillasCorreo.length) {
            console.log('[VIASA DB] Sembrando biblioteca oficial de plantillas de correo...');
            for (const plant of VIASA_CATALOGO_INICIAL.plantillasCorreo) {
                await window.ViasaStorage.guardarRegistro('plantillas_correo', plant);
            }
        }

        // 9. Sembrar Directorio Unificado de Contactos CRM
        const contactosExistentes = await window.ViasaStorage.obtenerColeccion('contactos_directorio');
        if (!contactosExistentes || contactosExistentes.length === 0 || contactosExistentes.length < VIASA_CATALOGO_INICIAL.contactosDirectorio.length) {
            console.log('[VIASA DB] Sembrando libreta y directorio unificado de contactos CRM...');
            for (const cont of VIASA_CATALOGO_INICIAL.contactosDirectorio) {
                await window.ViasaStorage.guardarRegistro('contactos_directorio', cont);
            }
        }

        // 10. Sembrar Mesas y Salón de Cafetín Viasa
        const mesasExistentes = await window.ViasaStorage.obtenerColeccion('mesas_cafetin');
        if (!mesasExistentes || mesasExistentes.length === 0 || mesasExistentes.length < VIASA_CATALOGO_INICIAL.mesasCafetin.length) {
            console.log('[VIASA DB] Sembrando configuración de Mesas y Salón Cafetín Viasa...');
            for (const mesa of VIASA_CATALOGO_INICIAL.mesasCafetin) {
                await window.ViasaStorage.guardarRegistro('mesas_cafetin', mesa);
            }
        }

        // 11. Sembrar Menú y Platos Gastronómicos de Cafetín Viasa
        const platosExistentes = await window.ViasaStorage.obtenerColeccion('platos_cafetin');
        if (!platosExistentes || platosExistentes.length === 0 || platosExistentes.length < VIASA_CATALOGO_INICIAL.platosCafetin.length) {
            console.log('[VIASA DB] Sembrando menú de platos gastronómicos Cafetín Viasa...');
            for (const plato of VIASA_CATALOGO_INICIAL.platosCafetin) {
                await window.ViasaStorage.guardarRegistro('platos_cafetin', plato);
            }
        }

        // 12. Sembrar Comandas Gastronómicas KDS
        const cmdCafExistentes = await window.ViasaStorage.obtenerColeccion('comandas_cafetin');
        if (!cmdCafExistentes || cmdCafExistentes.length === 0) {
            console.log('[VIASA DB] Sembrando comandas KDS Cafetín Viasa iniciales...');
            for (const cmd of VIASA_CATALOGO_INICIAL.comandasCafetin) {
                await window.ViasaStorage.guardarRegistro('comandas_cafetin', cmd);
            }
        }

        // 13. Sembrar Cortesías Autorizadas
        const corExistentes = await window.ViasaStorage.obtenerColeccion('cortesias_autorizadas');
        if (!corExistentes || corExistentes.length === 0) {
            console.log('[VIASA DB] Sembrando registro de cortesías de cortesía...');
            for (const cor of VIASA_CATALOGO_INICIAL.cortesiasAutorizadas) {
                await window.ViasaStorage.guardarRegistro('cortesias_autorizadas', cor);
            }
        }

        // 14. Sembrar Propinas de Mesoneros
        const propExistentes = await window.ViasaStorage.obtenerColeccion('propinas_registro');
        if (!propExistentes || propExistentes.length === 0) {
            console.log('[VIASA DB] Sembrando registro de propinas de salón...');
            for (const prop of VIASA_CATALOGO_INICIAL.propinasRegistro) {
                await window.ViasaStorage.guardarRegistro('propinas_registro', prop);
            }
        }

        // 15. Sembrar Activos Fijos y Maquinaria Pesada Industrial
        const actExistentes = await window.ViasaStorage.obtenerColeccion('activos_maquinaria');
        if (!actExistentes || actExistentes.length === 0 || actExistentes.length < VIASA_CATALOGO_INICIAL.activosMaquinaria.length) {
            console.log('[VIASA DB] Sembrando catálogo de Activos Fijos y Maquinaria Pesada Industrial...');
            for (const act of VIASA_CATALOGO_INICIAL.activosMaquinaria) {
                await window.ViasaStorage.guardarRegistro('activos_maquinaria', act);
            }
        }

        // 16. Sembrar Historial de Mantenimientos y Repuestos
        const mantExistentes = await window.ViasaStorage.obtenerColeccion('mantenimientos_maquinaria');
        if (!mantExistentes || mantExistentes.length === 0) {
            console.log('[VIASA DB] Sembrando historial de mantenimientos preventivos y correctivos...');
            for (const mant of VIASA_CATALOGO_INICIAL.mantenimientosMaquinaria) {
                await window.ViasaStorage.guardarRegistro('mantenimientos_maquinaria', mant);
            }
        }

        // 17. Sembrar Zonas Operativas de Delivery en Ciudad Bolívar
        const zonasExistentes = await window.ViasaStorage.obtenerColeccion('zonas_delivery');
        if (!zonasExistentes || zonasExistentes.length === 0 || zonasExistentes.length < VIASA_CATALOGO_INICIAL.zonasDeliveryCiudadBolivar.length) {
            console.log('[VIASA DB] Sembrando zonas operativas de delivery en Ciudad Bolívar...');
            for (const zona of VIASA_CATALOGO_INICIAL.zonasDeliveryCiudadBolivar) {
                await window.ViasaStorage.guardarRegistro('zonas_delivery', zona);
            }
        }

        // 18. Sembrar Trazabilidad de Costos de Insumos e Impacto en Recetas
        const histCostosExistentes = await window.ViasaStorage.obtenerColeccion('historico_costos_insumos');
        if (!histCostosExistentes || histCostosExistentes.length === 0) {
            console.log('[VIASA DB] Sembrando histórico de costos de insumos y escandallos...');
            for (const hist of VIASA_CATALOGO_INICIAL.historicoCostosInsumos) {
                await window.ViasaStorage.guardarRegistro('historico_costos_insumos', hist);
            }
        }

        // 19. Sembrar Guardias y Turnos Rotativos
        const grdExistentes = await window.ViasaStorage.obtenerColeccion('guardias_turnos');
        if (!grdExistentes || grdExistentes.length === 0 || grdExistentes.length < VIASA_CATALOGO_INICIAL.guardiasTurnos.length) {
            console.log('[VIASA DB] Sembrando programación de guardias y turnos rotativos...');
            for (const grd of VIASA_CATALOGO_INICIAL.guardiasTurnos) {
                await window.ViasaStorage.guardarRegistro('guardias_turnos', grd);
            }
        }

        // 20. Sembrar Bolsa de Intercambio de Guardias (Marketplace)
        const swapExistentes = await window.ViasaStorage.obtenerColeccion('shift_marketplace');
        if (!swapExistentes || swapExistentes.length === 0 || swapExistentes.length < VIASA_CATALOGO_INICIAL.shiftMarketplace.length) {
            console.log('[VIASA DB] Sembrando solicitudes iniciales del Shift Marketplace...');
            for (const swap of VIASA_CATALOGO_INICIAL.shiftMarketplace) {
                await window.ViasaStorage.guardarRegistro('shift_marketplace', swap);
            }
        }

        // 21. Sembrar Despachos y Rutas de Ciudad Bolívar
        const rutExistentes = await window.ViasaStorage.obtenerColeccion('despachos_rutas');
        if (!rutExistentes || rutExistentes.length === 0 || rutExistentes.length < VIASA_CATALOGO_INICIAL.despachosRutas.length) {
            console.log('[VIASA DB] Sembrando rutas y despachos de campo en Ciudad Bolívar...');
            for (const rut of VIASA_CATALOGO_INICIAL.despachosRutas) {
                await window.ViasaStorage.guardarRegistro('despachos_rutas', rut);
            }
        }

        const cfgActual = await window.ViasaStorage.obtenerColeccion('configuracion');
        if (!cfgActual || cfgActual.length === 0) {
            await window.ViasaStorage.guardarRegistro('configuracion', {
                clave: 'empresa',
                valor: VIASA_CATALOGO_INICIAL.empresa
            });
            window.ViasaStorage.setItem('tasa_bcv', VIASA_CATALOGO_INICIAL.empresa.tasaBCV);
            window.ViasaStorage.setItem('tasa_paralelo', VIASA_CATALOGO_INICIAL.empresa.tasaParalelo);
            window.ViasaStorage.setItem('tasa_cop', VIASA_CATALOGO_INICIAL.empresa.tasaCOP);
        }
    }

    window.ViasaDatabase = VIASA_CATALOGO_INICIAL;
    window.inicializarBaseDeDatosViasa = inicializarBaseDeDatosViasa;

})(window);
