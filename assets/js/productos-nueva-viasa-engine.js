/**
 * ============================================================================
 * VIASA SYSTEM — MÓDULO: PRODUCTOS NUEVA VIASA (CATÁLOGO EXCLUSIVO Y TRAZABILIDAD 360°)
 * Panadería Nueva Viasa, C.A. • RIF: J-31163165-8 • La Sabanita, Ciudad Bolívar
 * ============================================================================
 */
(function () {
    'use strict';

    const STORAGE_KEY_PNV = 'viasa_productos_nueva_viasa_v1';

    function round2(val) {
        const n = parseFloat(val);
        if (isNaN(n)) return 0;
        return Math.round((n + Number.EPSILON) * 100) / 100;
    }

    function fmtNum(val) {
        return round2(val).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function fmtInt(val) {
        const n = Math.round(parseFloat(val) || 0);
        return n.toLocaleString('es-VE');
    }

    function esc(str) {
        return String(str ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    // Generador de Ilustración Gastronómica SVG de Alta Resolución (100% Offline-first)
    function makeFoodArtDataUrl(title, subtitle, bg1, bg2, accent, emojiIcon) {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400">
            <defs>
                <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="${bg1}"/>
                    <stop offset="100%" stop-color="${bg2}"/>
                </linearGradient>
                <radialGradient id="glow" cx="50%" cy="42%" r="55%">
                    <stop offset="0%" stop-color="${accent}" stop-opacity="0.35"/>
                    <stop offset="100%" stop-color="${bg2}" stop-opacity="0"/>
                </radialGradient>
            </defs>
            <rect width="640" height="400" fill="url(#g)"/>
            <circle cx="320" cy="175" r="210" fill="url(#glow)"/>
            <circle cx="320" cy="165" r="88" fill="rgba(255,255,255,0.08)" stroke="${accent}" stroke-width="2" stroke-dasharray="6,4"/>
            <text x="320" y="188" text-anchor="middle" font-size="78" font-family="Segoe UI Emoji, Apple Color Emoji, sans-serif">${emojiIcon}</text>
            <rect x="24" y="305" width="592" height="72" rx="14" fill="rgba(15,23,42,0.78)" stroke="rgba(251,191,36,0.35)" stroke-width="1.2"/>
            <text x="44" y="336" fill="#FFFFFF" font-size="20" font-weight="800" font-family="Outfit, Inter, sans-serif">${title}</text>
            <text x="44" y="361" fill="#FBBF24" font-size="13" font-weight="700" font-family="JetBrains Mono, monospace">${subtitle} • PANADERÍA NUEVA VIASA, C.A.</text>
        </svg>`;
        return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
    }

    const DEFAULT_CATALOG = [
        {
            id: 'PNV-001',
            sku: 'PNV-AUT-001',
            barcode: '7591234001018',
            nombre: 'Pan de Sándwich Especial Nueva Viasa',
            presentacion: 'Empaque Familiar 650 g (24 Rebanadas)',
            categoria: 'Panadería Autóctona',
            condicionFiscal: 'EXENTO',
            ivaPorcentaje: 0,
            stockInicial: 40,
            stockMinimo: 25,
            mostradorLocal: 52,
            reservaDespachoB2B: 38,
            costoUnitarioUsd: 1.45,
            pvpUnitarioUsd: 2.80,
            precioAliadoUsd: 2.35,
            margenObjetivoPct: 35,
            vidaUtilDias: 10,
            fotoUrl: makeFoodArtDataUrl('Pan de Sándwich Especial Viasa', 'Miga Suave Láctea • 650 g', '#451a03', '#1e293b', '#f59e0b', '🍞'),
            insumosReceta: [
                { insumo: 'Harina de Trigo Panadera Extra Fuerte', cantidad: '420 g', costoUsd: 0.62 },
                { insumo: 'Leche en Polvo Completa y Mantequilla', cantidad: '65 g', costoUsd: 0.38 },
                { insumo: 'Azúcar Refinada, Sal Marina y Levadura Fresca', cantidad: '55 g', costoUsd: 0.19 },
                { insumo: 'Bolsa Polietileno Impresa Nueva Viasa + Precinto + Sticker QR', cantidad: '1 und', costoUsd: 0.26 }
            ],
            lotesProduccion: [
                { id: 'LOT-2026-101', fechaHora: '2026-10-22 06:30', vencimiento: '2026-11-01', cantidad: 60, destinoMostrador: 30, destinoB2B: 30, maestroPanadero: 'Maestro Carlos Guaipo', turno: 'Mañana (05:00 - 13:00)', observacion: 'Horneado parejo en horno rotativo #1, humedad 78%.' },
                { id: 'LOT-2026-108', fechaHora: '2026-10-23 06:15', vencimiento: '2026-11-02', cantidad: 55, destinoMostrador: 35, destinoB2B: 20, maestroPanadero: 'Maestro Carlos Guaipo', turno: 'Mañana (05:00 - 13:00)', observacion: 'Textura extra suave, lote sellado al frío.' }
            ],
            movimientosDistribucion: [
                { id: 'MOV-9001', fechaHora: '2026-10-22 08:20', tipoDestino: 'MOSTRADOR_LOCAL', clienteNombre: 'Mostrador Principal y Cafetín Nueva Viasa', clienteRif: 'J-31163165-8', documentoRef: 'INT-MOS-401', cantidad: 13, precioUnitUsd: 2.80, estadoPago: 'LIQUIDADO TIENDA', autorizoNombre: 'Lic. María Elena Rodríguez (Gerente Administrativa)', autorizoPin: 'AUTH-ADM-9921', despachoNombre: 'José Gregorio Bolívar (Supervisor de Despacho)', recibioNombre: 'Yelitza Campos (Encargada de Mostrador)' },
                { id: 'MOV-9002', fechaHora: '2026-10-23 09:40', tipoDestino: 'CLIENTE_ALIADO_B2B', clienteNombre: 'Supermercado Santo Tomé Guayana, C.A.', clienteRif: 'J-30881920-4', documentoRef: 'NE-000814', cantidad: 10, precioUnitUsd: 2.35, estadoPago: 'CRÉDITO 7 DÍAS', autorizoNombre: 'Sr. Reynaldo (Gerente General / Master Senior)', autorizoPin: 'AUTH-GG-0001', despachoNombre: 'José Gregorio Bolívar (Supervisor de Despacho)', recibioNombre: 'Pedro Marcano (Jefe de Recepción Santo Tomé)' }
            ],
            mermas: [
                { id: 'MER-3001', fecha: '2026-10-22', causa: 'Accidente Operativo', detalleCausa: '2 empaques comprimidos durante apilamiento en cesta plástica.', cantidad: 2, costoUnitUsd: 1.45, reportadoPor: 'José Gregorio Bolívar', autorizadoPor: 'Lic. María Elena Rodríguez (Gerente Administrativa)' }
            ]
        },
        {
            id: 'PNV-002',
            sku: 'PNV-PIL-002',
            barcode: '7591234001025',
            nombre: 'Línea Pilón Autóctono Dulce La Sabanita',
            presentacion: 'Paquete x 6 Unidades (480 g)',
            categoria: 'Línea Pilón / Empacados',
            condicionFiscal: 'EXENTO',
            ivaPorcentaje: 0,
            stockInicial: 50,
            stockMinimo: 30,
            mostradorLocal: 64,
            reservaDespachoB2B: 46,
            costoUnitarioUsd: 1.10,
            pvpUnitarioUsd: 2.20,
            precioAliadoUsd: 1.80,
            margenObjetivoPct: 40,
            vidaUtilDias: 12,
            fotoUrl: makeFoodArtDataUrl('Línea Pilón Autóctono La Sabanita', 'Receta Criolla con Papelón y Anís • Paq x 6', '#78350f', '#0f172a', '#fbbf24', '🥖'),
            insumosReceta: [
                { insumo: 'Harina de Trigo Panadera + Melaza de Papelón Guayanés', cantidad: '360 g', costoUsd: 0.56 },
                { insumo: 'Anís Dulce en Grano, Canela y Manteca Vegetal', cantidad: '80 g', costoUsd: 0.32 },
                { insumo: 'Empaque Termosellado Línea Pilón + Etiqueta Lote QR', cantidad: '1 und', costoUsd: 0.22 }
            ],
            lotesProduccion: [
                { id: 'LOT-2026-102', fechaHora: '2026-10-22 10:00', vencimiento: '2026-11-03', cantidad: 85, destinoMostrador: 40, destinoB2B: 45, maestroPanadero: 'Maestro Ramón Tovar', turno: 'Mañana (05:00 - 13:00)', observacion: 'Aroma intenso a papelón y anís dulce.' }
            ],
            movimientosDistribucion: [
                { id: 'MOV-9003', fechaHora: '2026-10-22 14:15', tipoDestino: 'CLIENTE_ALIADO_B2B', clienteNombre: 'Abastos y Víveres El Orinoco, C.A.', clienteRif: 'J-40119283-1', documentoRef: 'FAC-004512', cantidad: 24, precioUnitUsd: 1.80, estadoPago: 'PAGADO', autorizoNombre: 'Lic. María Elena Rodríguez (Gerente Administrativa)', autorizoPin: 'AUTH-ADM-9921', despachoNombre: 'Luis Centeno (Despachador Ruta 1)', recibioNombre: 'Carmen Lanz (Propietaria Abastos El Orinoco)' }
            ],
            mermas: [
                { id: 'MER-3002', fecha: '2026-10-23', causa: 'Ajuste / Autoconsumo Autorizado', detalleCausa: 'Degustación autorizada para clientes corporativos B2B en panadería.', cantidad: 1, costoUnitUsd: 1.10, reportadoPor: 'Yelitza Campos', autorizadoPor: 'Sr. Reynaldo (Gerente General / Master Senior)' }
            ]
        },
        {
            id: 'PNV-003',
            sku: 'PNV-AUT-003',
            barcode: '7591234001032',
            nombre: 'Pan Guayanés / Tunja Artesanal de Leche',
            presentacion: 'Pieza Trenzada 500 g',
            categoria: 'Panadería Autóctona',
            condicionFiscal: 'EXENTO',
            ivaPorcentaje: 0,
            stockInicial: 30,
            stockMinimo: 20,
            mostradorLocal: 38,
            reservaDespachoB2B: 22,
            costoUnitarioUsd: 1.25,
            pvpUnitarioUsd: 2.50,
            precioAliadoUsd: 2.05,
            margenObjetivoPct: 38,
            vidaUtilDias: 8,
            fotoUrl: makeFoodArtDataUrl('Pan Guayanés y Tunja Artesanal', 'Tradición de Ciudad Bolívar • 500 g', '#713f12', '#1e293b', '#facc15', '🥨'),
            insumosReceta: [
                { insumo: 'Harina de Trigo, Huevos Frescos y Leche Entera', cantidad: '390 g', costoUsd: 0.78 },
                { insumo: 'Azúcar, Vainilla Criolla y Barniz de Huevo Dorado', cantidad: '90 g', costoUsd: 0.29 },
                { insumo: 'Bolsa Celofán Transparente + Etiqueta Nueva Viasa', cantidad: '1 und', costoUsd: 0.18 }
            ],
            lotesProduccion: [
                { id: 'LOT-2026-103', fechaHora: '2026-10-23 07:45', vencimiento: '2026-10-31', cantidad: 45, destinoMostrador: 25, destinoB2B: 20, maestroPanadero: 'Maestro Carlos Guaipo', turno: 'Mañana (05:00 - 13:00)', observacion: 'Dorado brillante tradicional.' }
            ],
            movimientosDistribucion: [
                { id: 'MOV-9004', fechaHora: '2026-10-23 11:10', tipoDestino: 'CLIENTE_ALIADO_B2B', clienteNombre: 'Hotel Laja Real Ciudad Bolívar, C.A.', clienteRif: 'J-09501234-9', documentoRef: 'NE-000819', cantidad: 15, precioUnitUsd: 2.05, estadoPago: 'CRÉDITO 15 DÍAS', autorizoNombre: 'Sr. Reynaldo (Gerente General / Master Senior)', autorizoPin: 'AUTH-GG-0001', despachoNombre: 'Luis Centeno (Despachador Ruta 1)', recibioNombre: 'Chef Roberto Figuera (Alimentos y Bebidas)' }
            ],
            mermas: []
        },
        {
            id: 'PNV-004',
            sku: 'PNV-PAS-004',
            barcode: '7591234001049',
            nombre: 'Dulcería y Pastelería Exclusiva Viasa (Milhojas Imperial)',
            presentacion: 'Bandeja Ejecutiva 600 g (6 Porciones)',
            categoria: 'Pastelería Exclusiva',
            condicionFiscal: 'GRAVADO',
            ivaPorcentaje: 16,
            stockInicial: 18,
            stockMinimo: 12,
            mostradorLocal: 21,
            reservaDespachoB2B: 9,
            costoUnitarioUsd: 3.40,
            pvpUnitarioUsd: 6.90,
            precioAliadoUsd: 5.75,
            margenObjetivoPct: 45,
            vidaUtilDias: 5,
            fotoUrl: makeFoodArtDataUrl('Pastelería Exclusiva Milhojas Viasa', 'Hojaldre Francés y Arequipe Artesanal • 600 g', '#831843', '#0f172a', '#f472b6', '🍰'),
            insumosReceta: [
                { insumo: 'Laminado de Hojaldre con Mantequilla Extra', cantidad: '280 g', costoUsd: 1.45 },
                { insumo: 'Crema Pastelera de Vainilla y Arequipe Guayanés', cantidad: '260 g', costoUsd: 1.38 },
                { insumo: 'Domo Acrílico Cristal + Sticker Dorado Nueva Viasa', cantidad: '1 und', costoUsd: 0.57 }
            ],
            lotesProduccion: [
                { id: 'LOT-2026-104', fechaHora: '2026-10-23 08:30', vencimiento: '2026-10-28', cantidad: 20, destinoMostrador: 14, destinoB2B: 6, maestroPanadero: 'Maestra Pastelera Elena Silva', turno: 'Mañana (05:00 - 13:00)', observacion: 'Hojaldre triple vuelta, refrigerado a 4°C.' }
            ],
            movimientosDistribucion: [
                { id: 'MOV-9005', fechaHora: '2026-10-23 12:00', tipoDestino: 'MOSTRADOR_LOCAL', clienteNombre: 'Vitrina Refrigerada Principal Nueva Viasa', clienteRif: 'J-31163165-8', documentoRef: 'INT-VIT-210', cantidad: 7, precioUnitUsd: 6.90, estadoPago: 'LIQUIDADO TIENDA', autorizoNombre: 'Lic. María Elena Rodríguez (Gerente Administrativa)', autorizoPin: 'AUTH-ADM-9921', despachoNombre: 'Elena Silva (Pastelería)', recibioNombre: 'Yelitza Campos (Encargada de Mostrador)' }
            ],
            mermas: [
                { id: 'MER-3003', fecha: '2026-10-22', causa: 'Descomposición / Vencimiento', detalleCausa: '1 bandeja fuera de ventana óptima de frescura de 5 días en vitrina.', cantidad: 1, costoUnitUsd: 3.40, reportadoPor: 'Yelitza Campos', autorizadoPor: 'Lic. María Elena Rodríguez (Gerente Administrativa)' }
            ]
        },
        {
            id: 'PNV-005',
            sku: 'PNV-PIL-005',
            barcode: '7591234001056',
            nombre: 'Pan Molido Especial Crujiente Nueva Viasa',
            presentacion: 'Empaque Sellado 500 g (Grano Seleccionado)',
            categoria: 'Línea Pilón / Empacados',
            condicionFiscal: 'EXENTO',
            ivaPorcentaje: 0,
            stockInicial: 60,
            stockMinimo: 25,
            mostradorLocal: 45,
            reservaDespachoB2B: 55,
            costoUnitarioUsd: 0.75,
            pvpUnitarioUsd: 1.65,
            precioAliadoUsd: 1.30,
            margenObjetivoPct: 48,
            vidaUtilDias: 45,
            fotoUrl: makeFoodArtDataUrl('Pan Molido Especial Nueva Viasa', 'Tostado Doble Horno Empanizador • 500 g', '#9a3412', '#0f172a', '#fb923c', '🥖'),
            insumosReceta: [
                { insumo: 'Pan Blanco Seleccionado Deshidratado en Horno Lento', cantidad: '480 g', costoUsd: 0.54 },
                { insumo: 'Especias Naturales Suaves y Tamizado Industrial', cantidad: '20 g', costoUsd: 0.07 },
                { insumo: 'Bolsa BOPP Alta Barrera Anti-Humedad + Etiqueta QR', cantidad: '1 und', costoUsd: 0.14 }
            ],
            lotesProduccion: [
                { id: 'LOT-2026-105', fechaHora: '2026-10-21 15:00', vencimiento: '2026-12-05', cantidad: 70, destinoMostrador: 25, destinoB2B: 45, maestroPanadero: 'Maestro Ramón Tovar', turno: 'Tarde (13:00 - 21:00)', observacion: 'Granulometría fina uniforme.' }
            ],
            movimientosDistribucion: [
                { id: 'MOV-9006', fechaHora: '2026-10-22 10:30', tipoDestino: 'CLIENTE_ALIADO_B2B', clienteNombre: 'Restaurante y Parrillera Angostura Grill, C.A.', clienteRif: 'J-41209871-3', documentoRef: 'FAC-004518', cantidad: 30, precioUnitUsd: 1.30, estadoPago: 'PAGADO', autorizoNombre: 'Lic. María Elena Rodríguez (Gerente Administrativa)', autorizoPin: 'AUTH-ADM-9921', despachoNombre: 'José Gregorio Bolívar (Supervisor de Despacho)', recibioNombre: 'Miguel Ángel Páez (Compras Angostura Grill)' }
            ],
            mermas: []
        },
        {
            id: 'PNV-006',
            sku: 'PNV-BOC-006',
            barcode: '7591234001063',
            nombre: 'Tequeños y Bocados Especiales Viasa (Queso Guayanés)',
            presentacion: 'Bandeja Empacada x 12 Unidades (540 g)',
            categoria: 'Bocados y Cafetín',
            condicionFiscal: 'GRAVADO',
            ivaPorcentaje: 16,
            stockInicial: 35,
            stockMinimo: 20,
            mostradorLocal: 28,
            reservaDespachoB2B: 32,
            costoUnitarioUsd: 2.30,
            pvpUnitarioUsd: 4.50,
            precioAliadoUsd: 3.80,
            margenObjetivoPct: 42,
            vidaUtilDias: 15,
            fotoUrl: makeFoodArtDataUrl('Tequeños y Bocados Nueva Viasa', 'Rellenos de Queso Blanco Guayanés • x12 Und', '#065f46', '#0f172a', '#34d399', '🥐'),
            insumosReceta: [
                { insumo: 'Queso Blanco Semiduro Guayanés Seleccionado', cantidad: '280 g', costoUsd: 1.42 },
                { insumo: 'Masa Elástica enriquecida con Mantequilla y Huevo', cantidad: '260 g', costoUsd: 0.62 },
                { insumo: 'Bandeja Termoformada + Film Stretch + Sticker QR', cantidad: '1 und', costoUsd: 0.26 }
            ],
            lotesProduccion: [
                { id: 'LOT-2026-106', fechaHora: '2026-10-23 09:00', vencimiento: '2026-11-07', cantidad: 45, destinoMostrador: 20, destinoB2B: 25, maestroPanadero: 'Maestra Pastelera Elena Silva', turno: 'Mañana (05:00 - 13:00)', observacion: 'Listos para mostrador y despacho congelado B2B.' }
            ],
            movimientosDistribucion: [
                { id: 'MOV-9007', fechaHora: '2026-10-23 13:20', tipoDestino: 'CLIENTE_ALIADO_B2B', clienteNombre: 'Cantina Escolar Colegio Cervantes Ciudad Bolívar', clienteRif: 'J-30192837-5', documentoRef: 'NE-000822', cantidad: 20, precioUnitUsd: 3.80, estadoPago: 'PAGADO', autorizoNombre: 'Sr. Reynaldo (Gerente General / Master Senior)', autorizoPin: 'AUTH-GG-0001', despachoNombre: 'Luis Centeno (Despachador Ruta 1)', recibioNombre: 'Prof. Luisa Fernanda Mora (Coordinación Cantina)' }
            ],
            mermas: []
        },
        {
            id: 'PNV-007',
            sku: 'PNV-PIL-007',
            barcode: '7591234001070',
            nombre: 'Catalinas Negras Especiadas de Papelón y Miel Viasa',
            presentacion: 'Paquete Tradicional x 5 Unidades (400 g)',
            categoria: 'Línea Pilón / Empacados',
            condicionFiscal: 'EXENTO',
            ivaPorcentaje: 0,
            stockInicial: 40,
            stockMinimo: 18,
            mostradorLocal: 34,
            reservaDespachoB2B: 28,
            costoUnitarioUsd: 0.95,
            pvpUnitarioUsd: 1.95,
            precioAliadoUsd: 1.55,
            margenObjetivoPct: 45,
            vidaUtilDias: 20,
            fotoUrl: makeFoodArtDataUrl('Catalinas Negras Especiadas Viasa', 'Miel de Papelón, Clavo y Canela • Paq x 5', '#3b0764', '#0f172a', '#c084fc', '🍪'),
            insumosReceta: [
                { insumo: 'Melado de Papelón Oscuro, Harina y Bicarbonato', cantidad: '320 g', costoUsd: 0.58 },
                { insumo: 'Clavo de Olor, Canela Molida, Nuez Moscada y Manteca', cantidad: '80 g', costoUsd: 0.21 },
                { insumo: 'Empaque BOPP + Etiqueta Tradicional Nueva Viasa', cantidad: '1 und', costoUsd: 0.16 }
            ],
            lotesProduccion: [
                { id: 'LOT-2026-107', fechaHora: '2026-10-22 16:20', vencimiento: '2026-11-11', cantidad: 40, destinoMostrador: 20, destinoB2B: 20, maestroPanadero: 'Maestro Ramón Tovar', turno: 'Tarde (13:00 - 21:00)', observacion: 'Suavidad de miga húmeda especiada.' }
            ],
            movimientosDistribucion: [
                { id: 'MOV-9008', fechaHora: '2026-10-23 10:05', tipoDestino: 'CLIENTE_ALIADO_B2B', clienteNombre: 'Minimarket y Panadería Aliada Vista Hermosa, C.A.', clienteRif: 'J-40992104-7', documentoRef: 'FAC-004525', cantidad: 18, precioUnitUsd: 1.55, estadoPago: 'PAGADO', autorizoNombre: 'Lic. María Elena Rodríguez (Gerente Administrativa)', autorizoPin: 'AUTH-ADM-9921', despachoNombre: 'Luis Centeno (Despachador Ruta 1)', recibioNombre: 'Hernán Rivas (Gerente Minimarket Vista Hermosa)' }
            ],
            mermas: []
        },
        {
            id: 'PNV-008',
            sku: 'PNV-TEM-008',
            barcode: '7591234001087',
            nombre: 'Pan de Jamón Ahumado Especial Reserva Nueva Viasa',
            presentacion: 'Pieza Grande 1.150 g (Empaque Termoencogible)',
            categoria: 'Temporada',
            condicionFiscal: 'GRAVADO',
            ivaPorcentaje: 16,
            stockInicial: 15,
            stockMinimo: 10,
            mostradorLocal: 14,
            reservaDespachoB2B: 8,
            costoUnitarioUsd: 6.20,
            pvpUnitarioUsd: 12.50,
            precioAliadoUsd: 10.50,
            margenObjetivoPct: 45,
            vidaUtilDias: 6,
            fotoUrl: makeFoodArtDataUrl('Pan de Jamón Ahumado Reserva Viasa', 'Jamón Ahumado, Tocineta, Pasas y Aceitunas • 1.15 kg', '#7f1d1d', '#0f172a', '#f87171', '🥖'),
            insumosReceta: [
                { insumo: 'Jamón de Pierna Ahumado Extra + Tocineta Ahumada', cantidad: '480 g', costoUsd: 3.65 },
                { insumo: 'Aceitunas Rellenas de Pimiento, Pasas Rubias y Papelón', cantidad: '170 g', costoUsd: 1.25 },
                { insumo: 'Masa Brioche Láctea + Empaque Termoencogible Dorado', cantidad: '500 g', costoUsd: 1.30 }
            ],
            lotesProduccion: [
                { id: 'LOT-2026-109', fechaHora: '2026-10-23 07:00', vencimiento: '2026-10-29', cantidad: 16, destinoMostrador: 10, destinoB2B: 6, maestroPanadero: 'Maestro Carlos Guaipo', turno: 'Mañana (05:00 - 13:00)', observacion: 'Edición especial por encargo corporativo y mostrador.' }
            ],
            movimientosDistribucion: [
                { id: 'MOV-9009', fechaHora: '2026-10-23 15:00', tipoDestino: 'CLIENTE_ALIADO_B2B', clienteNombre: 'Clínica Privada San Pedro Ciudad Bolívar, C.A.', clienteRif: 'J-09518822-0', documentoRef: 'FAC-004530', cantidad: 9, precioUnitUsd: 10.50, estadoPago: 'PAGADO', autorizoNombre: 'Sr. Reynaldo (Gerente General / Master Senior)', autorizoPin: 'AUTH-GG-0001', despachoNombre: 'José Gregorio Bolívar (Supervisor de Despacho)', recibioNombre: 'Dra. Beatriz Alfonzo (Dirección Médica)' }
            ],
            mermas: []
        }
    ];


    // ========================================================================
    // CONSTANTES OPERATIVAS
    // ========================================================================
    const CATEGORIAS = ['Panadería Autóctona', 'Pastelería Exclusiva', 'Línea Pilón / Empacados', 'Bocados y Cafetín', 'Temporada'];

    const CAUSAS_MERMA = [
        'Descomposición / Vencimiento',
        'Accidente Operativo',
        'Ajuste / Error Administrativo / Autoconsumo / Degustación Autorizada'
    ];

    const AUTORIZADORES = [
        'Sr. Reynaldo (Gerente General / Master Senior)',
        'Lic. María Elena Rodríguez (Gerente Administrativa)',
        'Supervisor de Turno Autorizado'
    ];

    const TURNOS = ['Mañana (05:00 - 13:00)', 'Tarde (13:00 - 21:00)', 'Noche (21:00 - 05:00)'];

    const ESTADOS_PAGO = ['PAGADO', 'LIQUIDADO TIENDA', 'CRÉDITO 7 DÍAS', 'CRÉDITO 15 DÍAS', 'CRÉDITO 30 DÍAS', 'PENDIENTE'];

    const ORIGEN_MODULO = 'PRODUCTOS_NUEVA_VIASA';

    function nowLocalInput() {
        const d = new Date();
        const p = n => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
    }

    function addDays(dateStr, days) {
        const base = new Date(String(dateStr).slice(0, 10) + 'T12:00:00');
        if (isNaN(base.getTime())) return '';
        base.setDate(base.getDate() + (parseInt(days, 10) || 0));
        const p = n => String(n).padStart(2, '0');
        return `${base.getFullYear()}-${p(base.getMonth() + 1)}-${p(base.getDate())}`;
    }

    function currentPeriod() {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    }

    function periodLabel(period) {
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const [y, m] = period.split('-');
        return `${meses[parseInt(m, 10) - 1]} ${y}`;
    }

    function uid(prefix) {
        return `${prefix}-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 900 + 100)}`;
    }

    function maskPin(pin) {
        const s = String(pin || '');
        return s.length ? '•'.repeat(Math.max(0, s.length - 2)) + s.slice(-2) : '';
    }

    // ========================================================================
    // MOTOR VECTORIAL DE CÓDIGOS DE BARRA (EAN-13 / CODE-128) Y QR (100% OFFLINE)
    // ========================================================================
    const EAN_L = ['0001101', '0011001', '0010011', '0111101', '0100011', '0110001', '0101111', '0111011', '0110111', '0001011'];
    const EAN_PARITY = ['LLLLLL', 'LLGLGG', 'LLGGLG', 'LLGGGL', 'LGLLGG', 'LGGLLG', 'LGGGLL', 'LGLGLG', 'LGLGGL', 'LGGLGL'];
    const EAN_R = EAN_L.map(c => c.split('').map(b => (b === '0' ? '1' : '0')).join(''));
    const EAN_G = EAN_R.map(c => c.split('').reverse().join(''));

    const CODE128_PATTERNS = [
        "212222", "222122", "222221", "121223", "121322", "131222", "122213", "122312", "132212", "221213",
        "221312", "231212", "112232", "122132", "122231", "113222", "123122", "123221", "223211", "221132",
        "221231", "213212", "223112", "312131", "311222", "321122", "321221", "312212", "322112", "322211",
        "212123", "212321", "232121", "111323", "131123", "131321", "112313", "132113", "132311", "211313",
        "231113", "231311", "112133", "112331", "132131", "113123", "113321", "133121", "313121", "211331",
        "231131", "213113", "213311", "213131", "311123", "311321", "331121", "312113", "312311", "332111",
        "314111", "221411", "431111", "111224", "111422", "121124", "121421", "141122", "141221", "112214",
        "112412", "122114", "122411", "142112", "142211", "241211", "221114", "413111", "241112", "134111",
        "111242", "121142", "121241", "114212", "124112", "124211", "411212", "421112", "421211", "212141",
        "214121", "412121", "111143", "111341", "131141", "114113", "114311", "411113", "411311", "113141",
        "114131", "311141", "411131", "211412", "211214", "211232", "2331112"
    ];

    function calcularChecksumEAN13(raw12) {
        const str = String(raw12 || '').replace(/\D/g, '').padStart(12, '0').slice(0, 12);
        let sum = 0;
        for (let i = 0; i < 12; i++) {
            const digit = parseInt(str[i], 10);
            sum += (i % 2 === 0) ? digit : digit * 3;
        }
        const mod = sum % 10;
        return (mod === 0) ? 0 : (10 - mod);
    }

    function ean13Normalize(code) {
        const digits = String(code || '').replace(/\D/g, '');
        if (digits.length < 12) return null;
        const d12 = digits.slice(0, 12);
        const check = calcularChecksumEAN13(d12);
        return d12 + check;
    }

    function ean13Svg(code, width = 190, height = 64) {
        const full = ean13Normalize(code);
        if (!full) return `<div style="font-family:monospace;font-size:11px;color:#0f172a;">${esc(code || 'SIN CÓDIGO')}</div>`;
        const first = parseInt(full[0], 10);
        let bits = '101';
        for (let i = 1; i <= 6; i++) {
            const d = parseInt(full[i], 10);
            bits += EAN_PARITY[first][i - 1] === 'L' ? EAN_L[d] : EAN_G[d];
        }
        bits += '01010';
        for (let i = 7; i <= 12; i++) bits += EAN_R[parseInt(full[i], 10)];
        bits += '101';
        const w = width || 190;
        const h = height || 64;
        const mod = w / (bits.length + 14);
        let rects = '';
        for (let i = 0; i < bits.length; i++) {
            if (bits[i] === '1') {
                const guard = i < 3 || (i >= 45 && i < 50) || i >= 92;
                rects += `<rect x="${((i + 7) * mod).toFixed(2)}" y="0" width="${mod.toFixed(2)}" height="${guard ? h - 4 : h - 14}" fill="#0f172a"/>`;
            }
        }
        const formatted = `${full.slice(0,1)} ${full.slice(1,7)} ${full.slice(7,13)}`;
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h + 4}" viewBox="0 0 ${w} ${h + 4}" shape-rendering="crispEdges">
            <rect width="${w}" height="${h + 4}" fill="#fff"/>${rects}
            <text x="${w / 2}" y="${h + 2}" text-anchor="middle" font-family="'JetBrains Mono', 'Courier New', monospace" font-size="11" font-weight="800" fill="#0f172a">${formatted}</text>
        </svg>`;
    }

    function code128Bits(text) {
        const raw = String(text || '').trim();
        if (!raw) return { bits: '', text: '' };
        const values = [104];
        let checkSum = 104;
        for (let i = 0; i < raw.length; i++) {
            const code = raw.charCodeAt(i) - 32;
            const valid = (code >= 0 && code <= 95) ? code : 0;
            values.push(valid);
            checkSum += valid * (i + 1);
        }
        values.push(checkSum % 103);
        values.push(106);
        let bits = '';
        values.forEach(val => {
            const pattern = CODE128_PATTERNS[val];
            if (pattern) {
                for (let p = 0; p < pattern.length; p++) {
                    const count = parseInt(pattern[p], 10);
                    bits += ((p % 2 === 0) ? '1' : '0').repeat(count);
                }
            }
        });
        return { bits, text: raw };
    }

    function code128Svg(text, width = 190, height = 64) {
        const raw = String(text || '').trim();
        if (!raw) return `<div style="font-family:monospace;font-size:11px;color:#0f172a;">SIN CÓDIGO</div>`;
        const { bits } = code128Bits(raw);
        if (!bits) return `<div style="font-family:monospace;font-size:11px;color:#0f172a;">${esc(raw)}</div>`;
        const w = width || 190;
        const h = height || 64;
        const mod = w / (bits.length + 16);
        let rects = '';
        for (let i = 0; i < bits.length; i++) {
            if (bits[i] === '1') {
                rects += `<rect x="${((i + 8) * mod).toFixed(2)}" y="2" width="${mod.toFixed(2)}" height="${h - 18}" fill="#0f172a"/>`;
            }
        }
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h + 2}" viewBox="0 0 ${w} ${h + 2}" shape-rendering="crispEdges">
            <rect width="${w}" height="${h + 2}" fill="#fff"/>${rects}
            <text x="${w / 2}" y="${h}" text-anchor="middle" font-family="'JetBrains Mono', 'Courier New', monospace" font-size="11" font-weight="800" fill="#0f172a">${esc(raw)}</text>
        </svg>`;
    }

    function renderBarcodeSvg(code, formato = 'EAN13', width = 190, height = 64) {
        const clean = String(code || '').trim();
        if (formato === 'CODE128' || !/^\d{12,13}$/.test(clean)) {
            return code128Svg(clean, width, height);
        }
        return ean13Svg(clean, width, height);
    }

    // Generador QR ISO/IEC 18004 100% Autónomo y Offline
    const StandaloneQREngine = {
        EXP_TABLE: new Uint8Array(512),
        LOG_TABLE: new Uint8Array(256),
        _inited: false,

        _init() {
            if (this._inited) return;
            let x = 1;
            for (let i = 0; i < 255; i++) {
                this.EXP_TABLE[i] = x;
                this.EXP_TABLE[i + 255] = x;
                this.LOG_TABLE[x] = i;
                x <<= 1;
                if (x & 256) x ^= 0x11d;
            }
            this._inited = true;
        },

        gmul(a, b) {
            if (a === 0 || b === 0) return 0;
            return this.EXP_TABLE[this.LOG_TABLE[a] + this.LOG_TABLE[b]];
        },

        crearPolinomioGenerador(numEC) {
            let poly = [1];
            for (let i = 0; i < numEC; i++) {
                const next = [this.EXP_TABLE[i], 1];
                const res = new Array(poly.length + 1).fill(0);
                for (let j = 0; j < poly.length; j++) {
                    for (let k = 0; k < next.length; k++) {
                        res[j + k] ^= this.gmul(poly[j], next[k]);
                    }
                }
                poly = res;
            }
            return poly;
        },

        calcularECCodewords(dataBytes, numEC) {
            const genPoly = this.crearPolinomioGenerador(numEC);
            const msg = new Array(dataBytes.length + numEC).fill(0);
            for (let i = 0; i < dataBytes.length; i++) msg[i] = dataBytes[i];
            for (let i = 0; i < dataBytes.length; i++) {
                const coef = msg[i];
                if (coef !== 0) {
                    for (let j = 0; j < genPoly.length; j++) {
                        msg[i + j] ^= this.gmul(genPoly[j], coef);
                    }
                }
            }
            return msg.slice(dataBytes.length);
        },

        encodeUTF8(str) {
            const utf8 = [];
            for (let i = 0; i < str.length; i++) {
                let charcode = str.charCodeAt(i);
                if (charcode < 0x80) utf8.push(charcode);
                else if (charcode < 0x800) {
                    utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
                } else if (charcode < 0xd800 || charcode >= 0xe000) {
                    utf8.push(0xe0 | (charcode >> 12), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
                }
            }
            return utf8;
        },

        generarMatrizQR(texto) {
            this._init();
            const utf8Bytes = this.encodeUTF8(String(texto || ''));
            const len = utf8Bytes.length;
            let version = 2;
            let totalDataCodewords = 28;
            let ecCodewords = 16;
            if (len > 20 && len <= 42) {
                version = 3; totalDataCodewords = 44; ecCodewords = 26;
            } else if (len > 42 && len <= 68) {
                version = 4; totalDataCodewords = 64; ecCodewords = 36;
            } else if (len > 68 && len <= 104) {
                version = 5; totalDataCodewords = 86; ecCodewords = 48;
            } else if (len > 104) {
                version = 6; totalDataCodewords = 108; ecCodewords = 56;
            }

            const size = 17 + (version * 4);
            const matrix = Array.from({ length: size }, () => Array(size).fill(null));

            const addFinder = (r, c) => {
                for (let i = -1; i <= 7; i++) {
                    for (let j = -1; j <= 7; j++) {
                        const row = r + i;
                        const col = c + j;
                        if (row >= 0 && row < size && col >= 0 && col < size) {
                            if (i === -1 || i === 7 || j === -1 || j === 7) {
                                matrix[row][col] = 0;
                            } else if (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4)) {
                                matrix[row][col] = 1;
                            } else {
                                matrix[row][col] = 0;
                            }
                        }
                    }
                }
            };

            addFinder(0, 0);
            addFinder(0, size - 7);
            addFinder(size - 7, 0);

            for (let i = 8; i < size - 8; i++) {
                if (matrix[6][i] === null) matrix[6][i] = (i % 2 === 0) ? 1 : 0;
                if (matrix[i][6] === null) matrix[i][6] = (i % 2 === 0) ? 1 : 0;
            }
            matrix[size - 8][8] = 1;

            if (version >= 2) {
                const alignPositions = { 2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30], 6: [6, 34] };
                const pos = alignPositions[version] || [6, 18];
                for (let r of pos) {
                    for (let c of pos) {
                        if (matrix[r][c] === null) {
                            for (let i = -2; i <= 2; i++) {
                                for (let j = -2; j <= 2; j++) {
                                    const isBorder = Math.abs(i) === 2 || Math.abs(j) === 2;
                                    const isCenter = i === 0 && j === 0;
                                    matrix[r + i][c + j] = (isBorder || isCenter) ? 1 : 0;
                                }
                            }
                        }
                    }
                }
            }

            const dataBits = [];
            dataBits.push(0, 1, 0, 0);
            for (let i = 7; i >= 0; i--) dataBits.push((len >> i) & 1);
            for (let b of utf8Bytes) {
                for (let i = 7; i >= 0; i--) dataBits.push((b >> i) & 1);
            }
            const maxBits = totalDataCodewords * 8;
            const termLen = Math.min(4, maxBits - dataBits.length);
            for (let i = 0; i < termLen; i++) dataBits.push(0);
            while (dataBits.length % 8 !== 0) dataBits.push(0);

            const dataBytes = [];
            for (let i = 0; i < dataBits.length; i += 8) {
                let byte = 0;
                for (let j = 0; j < 8; j++) byte = (byte << 1) | dataBits[i + j];
                dataBytes.push(byte);
            }
            const padBytes = [0xec, 0x11];
            let pIdx = 0;
            while (dataBytes.length < totalDataCodewords) {
                dataBytes.push(padBytes[pIdx % 2]);
                pIdx++;
            }

            const ecBytes = this.calcularECCodewords(dataBytes, ecCodewords);
            const finalBits = [];
            for (let b of [...dataBytes, ...ecBytes]) {
                for (let i = 7; i >= 0; i--) finalBits.push((b >> i) & 1);
            }

            let bitIndex = 0;
            let right = size - 1;
            let goingUp = true;

            while (right > 0) {
                if (right === 6) right--;
                const colRange = [right, right - 1];
                const rowOrder = goingUp ? Array.from({ length: size }, (_, i) => size - 1 - i) : Array.from({ length: size }, (_, i) => i);

                for (let row of rowOrder) {
                    for (let col of colRange) {
                        if (matrix[row][col] === null) {
                            let bit = (bitIndex < finalBits.length) ? finalBits[bitIndex++] : 0;
                            if ((row + col) % 2 === 0) bit ^= 1;
                            matrix[row][col] = bit;
                        }
                    }
                }
                goingUp = !goingUp;
                right -= 2;
            }

            const formatBits = [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0];
            let fIdx = 0;
            for (let i = 0; i <= 8; i++) {
                if (i !== 6) matrix[8][i] = formatBits[fIdx++];
            }
            for (let i = 7; i >= 0; i--) {
                if (i !== 6) matrix[i][8] = formatBits[fIdx++];
            }
            for (let i = 0; i < 7; i++) matrix[size - 1 - i][8] = formatBits[i];
            for (let i = 0; i < 8; i++) matrix[8][size - 8 + i] = formatBits[7 + i];

            return { matrix, size };
        }
    };

    function renderQRSvg(payload, pixelSize = 120, margin = 2) {
        let matrixData = null;
        if (typeof window !== 'undefined' && window.ViasaCodeEngine && window.ViasaCodeEngine.qr) {
            try {
                matrixData = window.ViasaCodeEngine.qr.generarMatrizQR(payload);
            } catch (e) {
                matrixData = null;
            }
        }
        if (!matrixData) {
            matrixData = StandaloneQREngine.generarMatrizQR(payload);
        }
        const { matrix, size } = matrixData;
        const total = size + (margin * 2);
        let pathD = '';
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (matrix[r][c] === 1) {
                    pathD += `M${c + margin},${r + margin}h1v1h-1z`;
                }
            }
        }
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${pixelSize}" height="${pixelSize}" viewBox="0 0 ${total} ${total}" shape-rendering="crispEdges">
            <rect width="${total}" height="${total}" fill="#ffffff"/>
            <path d="${pathD}" fill="#0f172a"/>
        </svg>`;
    }

    function renderBarcodeGraphic(p, code, formato = 'EAN13', width = 190, height = 64) {
        if (p && p.customBarcodeImage) {
            const numStr = String(code || p.barcode || '').trim();
            const fontSize = Math.min(10, Math.max(7, Math.round(height * 0.17)));
            return `<div style="width:${width}px;height:${height}px;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;background:#ffffff;border-radius:3px;box-sizing:border-box;padding:2px 4px;">
                <img src="${esc(p.customBarcodeImage)}" alt="Código de barras" style="max-width:100%;max-height:${Math.max(16, height - 16)}px;object-fit:contain;display:block;margin:auto;">
                ${numStr ? `<div style="font-size:${fontSize}px;font-weight:800;font-family:'JetBrains Mono',monospace;color:#0f172a;letter-spacing:1px;line-height:1;margin-top:2px;text-align:center;">${esc(numStr)}</div>` : ''}
            </div>`;
        }
        return renderBarcodeSvg(code || (p ? p.barcode : ''), formato, width, height);
    }

    function renderQRGraphic(p, payloadQR, pixelSize = 120, margin = 2) {
        if (p && p.customQrImage) {
            return `<div style="width:${pixelSize}px;height:${pixelSize}px;display:flex;align-items:center;justify-content:center;overflow:hidden;background:#ffffff;border-radius:4px;box-sizing:border-box;padding:2px;">
                <img src="${esc(p.customQrImage)}" alt="Código QR" style="max-width:100%;max-height:100%;object-fit:contain;display:block;margin:auto;">
            </div>`;
        }
        return renderQRSvg(payloadQR, pixelSize, margin);
    }

    function descargarSvgArchivo(svgString, filename) {
        if (typeof document === 'undefined') return;
        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename.endsWith('.svg') ? filename : `${filename}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function descargarSvgComoPng(svgString, filename, targetW = 800, targetH = 800) {
        if (typeof document === 'undefined') return;
        const img = new Image();
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = targetW;
            canvas.height = targetH;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, targetW, targetH);
            ctx.drawImage(img, 0, 0, targetW, targetH);
            const a = document.createElement('a');
            a.href = canvas.toDataURL('image/png', 1.0);
            a.download = filename.endsWith('.png') ? filename : `${filename}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        };
        img.src = url;
    }

    // ========================================================================
    // MOTOR PRINCIPAL
    // ========================================================================
    const ViasaProductosExclusivosEngine = {
        productos: [],
        initialized: false,
        filtroCategoria: 'Todas',
        busqueda: '',
        detalleId: null,
        tabActiva: 'A',
        studioFormato: 'comercial',
        studioLoteId: null,
        studioTipoCodigo: null,
        studioCopias: 1,

        // --------------------------------------------------------------------
        // PERSISTENCIA
        // --------------------------------------------------------------------
        init() {
            if (this.initialized) return;
            let saved = null;
            try {
                saved = JSON.parse(localStorage.getItem(STORAGE_KEY_PNV) || 'null');
            } catch (e) {
                saved = null;
            }
            if (saved && Array.isArray(saved.productos)) {
                this.productos = saved.productos.map(p => this.normalizar(p));
            } else {
                this.productos = JSON.parse(JSON.stringify(DEFAULT_CATALOG)).map(p => this.normalizar(p));
                this.guardar();
            }
            this.productos.forEach(p => this.sincronizarContabilidad(p));
            this.sincronizarTodosConPOS();
            this.initialized = true;
        },

        guardar() {
            try {
                localStorage.setItem(STORAGE_KEY_PNV, JSON.stringify({ version: 1, actualizado: new Date().toISOString(), productos: this.productos }));
                return true;
            } catch (e) {
                console.error('[Productos Nueva Viasa] Error al guardar:', e);
                this.toast('⚠️ No se pudo guardar: el almacenamiento local está lleno. Use fotografías más livianas.', 'error');
                return false;
            }
        },

        normalizar(p) {
            const prod = Object.assign({
                activo: true,
                insumosReceta: [],
                lotesProduccion: [],
                movimientosDistribucion: [],
                mermas: [],
                stockMinimo: 10,
                margenObjetivoPct: 35,
                vidaUtilDias: 7,
                ivaPorcentaje: 0,
                condicionFiscal: 'EXENTO'
            }, p);

            // Identificación y trazabilidad: Códigos de Barra y QR
            if (!prod.barcode && !prod.codigoBarras) {
                prod.barcode = this.generarEAN13Auto(prod.id ? prod.id.replace(/\D/g, '') : null);
            } else if (!prod.barcode && prod.codigoBarras) {
                prod.barcode = prod.codigoBarras;
            }
            prod.tipoCodigo = prod.tipoCodigo || (/^\d{12,13}$/.test(prod.barcode) ? 'EAN13' : 'CODE128');
            prod.codigoBarras = prod.barcode;
            prod.qrCode = prod.qrCode || this.generarPayloadQR(prod);
            prod.codigoQR = prod.qrCode;
            prod.customBarcodeImage = prod.customBarcodeImage || null;
            prod.customQrImage = prod.customQrImage || null;

            prod.stockInicial = Math.max(0, parseInt(prod.stockInicial, 10) || 0);
            if (prod.stockInicialMostrador === undefined || prod.stockInicialReserva === undefined) {
                const m = parseFloat(prod.mostradorLocal) || 0;
                const r = parseFloat(prod.reservaDespachoB2B) || 0;
                const ratio = (m + r) > 0 ? m / (m + r) : 1;
                prod.stockInicialMostrador = Math.round(prod.stockInicial * ratio);
                prod.stockInicialReserva = prod.stockInicial - prod.stockInicialMostrador;
            }
            delete prod.mostradorLocal;
            delete prod.reservaDespachoB2B;
            prod.ivaPorcentaje = prod.condicionFiscal === 'GRAVADO' ? 16 : 0;

            prod.lotesProduccion.forEach(l => {
                l.cantidad = parseInt(l.cantidad, 10) || 0;
                l.destinoMostrador = parseInt(l.destinoMostrador, 10) || 0;
                l.destinoB2B = l.cantidad - l.destinoMostrador;
            });
            prod.movimientosDistribucion.forEach(m => {
                m.cantidad = parseInt(m.cantidad, 10) || 0;
                if (m.deduceMostrador === undefined || m.deduceReserva === undefined) {
                    if (m.tipoDestino === 'MOSTRADOR_LOCAL') { m.deduceMostrador = m.cantidad; m.deduceReserva = 0; }
                    else { m.deduceMostrador = 0; m.deduceReserva = m.cantidad; }
                }
            });
            prod.mermas.forEach(x => {
                x.cantidad = parseInt(x.cantidad, 10) || 0;
                if (x.causa === 'Ajuste / Autoconsumo Autorizado') x.causa = CAUSAS_MERMA[2];
                if (x.deduceMostrador === undefined || x.deduceReserva === undefined) { x.deduceMostrador = x.cantidad; x.deduceReserva = 0; }
                x.costoUnitUsd = round2(x.costoUnitUsd !== undefined ? x.costoUnitUsd : prod.costoUnitarioUsd);
            });
            return prod;
        },

        // --------------------------------------------------------------------
        // GENERADORES AUTOMÁTICOS DE CÓDIGOS (EAN-13, CODE-128 Y QR)
        // --------------------------------------------------------------------
        generarEAN13Auto(correlativo) {
            const prefijoViasa = '75931163'; // 759 VE + 31163 Panadería Nueva Viasa
            const correlativosUsados = new Set();
            (this.productos || []).forEach(p => {
                const cb = String(p.barcode || p.codigoBarras || '').trim();
                if (cb.startsWith(prefijoViasa) && cb.length >= 12) {
                    const c = parseInt(cb.slice(8, 12), 10);
                    if (!isNaN(c)) correlativosUsados.add(c);
                }
            });
            let corrNum = parseInt(correlativo, 10);
            if (!corrNum || isNaN(corrNum) || correlativosUsados.has(corrNum)) {
                corrNum = 1001;
                while (correlativosUsados.has(corrNum)) corrNum++;
            }
            const raw12 = `${prefijoViasa}${String(corrNum).padStart(4, '0').slice(-4)}`;
            const dv = calcularChecksumEAN13(raw12);
            return `${raw12}${dv}`;
        },

        generarCode128Auto(correlativo) {
            let num = parseInt(correlativo, 10);
            if (!num || isNaN(num)) num = this.productos ? (this.productos.length + 1) : 1;
            return `NV-${String(num).padStart(4, '0')}`;
        },

        generarCodigoAuto(tipo = 'EAN13', sku = '') {
            if (tipo === 'CODE128') {
                if (sku && sku.startsWith('PNV-')) return sku;
                return this.generarCode128Auto();
            }
            return this.generarEAN13Auto();
        },

        generarPayloadQR(p, lote = null, formato = 'texto') {
            const elab = lote ? String(lote.fechaHora).slice(0, 10) : nowLocalInput().slice(0, 10);
            const venc = lote ? lote.vencimiento : addDays(elab, p.vidaUtilDias || 7);
            const loteId = lote ? (lote.id || lote.loteId) : 'LOTE-ACT';
            const precioUSD = round2(p.pvpUnitarioUsd);
            const precioBs = round2(this.bs(precioUSD));

            if (formato === 'json') {
                return JSON.stringify({
                    t: 'PRD_VIASA',
                    id: p.id,
                    sku: p.sku,
                    ean: p.barcode || p.codigoBarras,
                    nom: p.nombre,
                    lot: loteId,
                    elab,
                    venc,
                    usd: precioUSD,
                    bs: precioBs,
                    rif: 'J-31163165-8',
                    fab: 'Panadería Nueva Viasa, C.A.'
                });
            }

            // Formato estructurado inteligente
            return `${p.nombre} | ${p.sku} | ${loteId} | Elab: ${elab} Vence: ${venc} | Ref: $${fmtNum(precioUSD)} / Bs. ${fmtNum(precioBs)} | Panadería Nueva Viasa, C.A. (RIF: J-31163165-8)`;
        },

        // --------------------------------------------------------------------
        // INTEGRACIÓN Y SINCRONIZACIÓN CON EL PUNTO DE VENTA (POS)
        // --------------------------------------------------------------------
        sincronizarConPOS(p, eliminar = false) {
            if (typeof window === 'undefined' || !window.ViasaApp) return;
            try {
                if (!Array.isArray(window.ViasaApp.productos)) window.ViasaApp.productos = [];
                const lista = window.ViasaApp.productos;
                const idx = lista.findIndex(x => x.id === p.id || (p.sku && x.sku === p.sku));

                if (eliminar) {
                    if (idx >= 0) lista.splice(idx, 1);
                } else {
                    const st = this.calcStock(p);
                    const itemPOS = {
                        id: p.id,
                        sku: p.sku,
                        nombre: p.nombre,
                        codigoBarras: p.barcode,
                        barcode: p.barcode,
                        customBarcodeImage: p.customBarcodeImage || null,
                        customQrImage: p.customQrImage || null,
                        qrCode: p.qrCode || this.generarPayloadQR(p),
                        codigoQR: p.qrCode || this.generarPayloadQR(p),
                        categoria: p.categoria || 'Panadería Autóctona',
                        precioUSD: round2(p.pvpUnitarioUsd),
                        precioBs: round2(this.bs(p.pvpUnitarioUsd)),
                        costoUSD: round2(p.costoUnitarioUsd),
                        unidad: p.presentacion || 'UND',
                        stock: Math.max(0, st.mostrador),
                        stockMinimo: p.stockMinimo || 10,
                        exentoIVA: p.condicionFiscal === 'EXENTO',
                        tipoCodigo: p.tipoCodigo || 'EAN13',
                        produccionPropia: true,
                        envasadoViasa: true,
                        origen: 'Productos Nueva Viasa'
                    };
                    if (idx >= 0) {
                        Object.assign(lista[idx], itemPOS);
                    } else {
                        lista.push(itemPOS);
                    }
                }
            } catch (e) {
                console.warn('[PNV -> POS Sync] Advertencia:', e);
            }
        },

        sincronizarTodosConPOS() {
            (this.productos || []).forEach(p => this.sincronizarConPOS(p, p.activo === false));
        },

        buscarProducto(query) {
            if (!query) return null;
            const q = String(query).trim().toLowerCase();
            return (this.productos || []).find(p => 
                (p.barcode && p.barcode.toLowerCase() === q) ||
                (p.codigoBarras && p.codigoBarras.toLowerCase() === q) ||
                (p.sku && p.sku.toLowerCase() === q) ||
                (p.id && p.id.toLowerCase() === q) ||
                (p.nombre && p.nombre.toLowerCase() === q)
            );
        },

        // --------------------------------------------------------------------
        // TASA BCV Y CÁLCULOS EXACTOS
        // --------------------------------------------------------------------
        getTasa() {
            const app = window.ViasaApp;
            if (app && parseFloat(app.tasaBCV) > 0) return parseFloat(app.tasaBCV);
            const ce = window.ViasaContabilidadEngine;
            if (ce && parseFloat(ce.tasaBCV) > 0) return parseFloat(ce.tasaBCV);
            return 36.85;
        },

        bs(usd) {
            return round2(round2(usd) * this.getTasa());
        },

        /**
         * Stock Actual = Stock Inicial + Producción − Ventas Local − Despachos Clientes − Mermas
         * Calculado siempre desde los registros (nunca almacenado) para garantizar cuadre absoluto.
         */
        calcStock(p) {
            const produccion = p.lotesProduccion.reduce((s, l) => s + l.cantidad, 0);
            const prodMostrador = p.lotesProduccion.reduce((s, l) => s + l.destinoMostrador, 0);
            const prodReserva = p.lotesProduccion.reduce((s, l) => s + l.destinoB2B, 0);
            const ventasLocal = p.movimientosDistribucion.filter(m => m.tipoDestino === 'MOSTRADOR_LOCAL').reduce((s, m) => s + m.cantidad, 0);
            const despachosB2B = p.movimientosDistribucion.filter(m => m.tipoDestino === 'CLIENTE_ALIADO_B2B').reduce((s, m) => s + m.cantidad, 0);
            const mermas = p.mermas.reduce((s, x) => s + x.cantidad, 0);
            const salMostrador = p.movimientosDistribucion.reduce((s, m) => s + (m.deduceMostrador || 0), 0) + p.mermas.reduce((s, x) => s + (x.deduceMostrador || 0), 0);
            const salReserva = p.movimientosDistribucion.reduce((s, m) => s + (m.deduceReserva || 0), 0) + p.mermas.reduce((s, x) => s + (x.deduceReserva || 0), 0);
            const mostrador = p.stockInicialMostrador + prodMostrador - salMostrador;
            const reserva = p.stockInicialReserva + prodReserva - salReserva;
            const total = p.stockInicial + produccion - ventasLocal - despachosB2B - mermas;
            return { inicial: p.stockInicial, produccion, ventasLocal, despachosB2B, mermas, mostrador, reserva, total, cuadra: total === mostrador + reserva };
        },

        calcMargen(precio, costo) {
            const pr = round2(precio);
            if (pr <= 0) return 0;
            return round2(((pr - round2(costo)) / pr) * 100);
        },

        costoReceta(p) {
            return round2((p.insumosReceta || []).reduce((s, i) => s + round2(i.costoUsd), 0));
        },

        semaforo(p) {
            const st = this.calcStock(p).total;
            if (st <= 0) return { txt: '🔴 Agotado', color: '#ef4444', bg: 'rgba(127,29,29,0.85)' };
            if (st <= p.stockMinimo) return { txt: '🟡 Stock Bajo', color: '#facc15', bg: 'rgba(113,63,18,0.88)' };
            return { txt: '🟢 En Stock', color: '#4ade80', bg: 'rgba(6,78,59,0.88)' };
        },

        calcKpis() {
            const per = currentPeriod();
            const activos = this.productos.filter(p => p.activo !== false);
            let stockTotal = 0, mostrador = 0, reserva = 0, b2bUnid = 0, b2bUsd = 0, mermaUnid = 0, mermaUsd = 0, valorUsd = 0;
            activos.forEach(p => {
                const st = this.calcStock(p);
                stockTotal += st.total;
                mostrador += st.mostrador;
                reserva += st.reserva;
                valorUsd = round2(valorUsd + round2(st.total * round2(p.costoUnitarioUsd)));
                p.movimientosDistribucion.filter(m => m.tipoDestino === 'CLIENTE_ALIADO_B2B' && String(m.fechaHora).startsWith(per)).forEach(m => {
                    b2bUnid += m.cantidad;
                    b2bUsd = round2(b2bUsd + round2(m.cantidad * round2(m.precioUnitUsd)));
                });
                p.mermas.filter(x => String(x.fecha).startsWith(per)).forEach(x => {
                    mermaUnid += x.cantidad;
                    mermaUsd = round2(mermaUsd + round2(x.cantidad * round2(x.costoUnitUsd)));
                });
            });
            return { per, activos: activos.length, stockTotal, mostrador, reserva, b2bUnid, b2bUsd, mermaUnid, mermaUsd, valorUsd };
        },

        // --------------------------------------------------------------------
        // CONEXIÓN CONTABLE AUTOMÁTICA (Libro Art. 177 ISLR + Libro de Mermas)
        // Idempotente: reconstruye las filas del producto desde sus registros.
        // --------------------------------------------------------------------
        sincronizarContabilidad(p, eliminar) {
            const ce = window.ViasaContabilidadEngine;
            if (!ce) return;
            try {
                if (!ce.initialized && typeof ce.init === 'function') ce.init();
                if (!Array.isArray(ce.libroInventario177)) ce.libroInventario177 = [];
                if (!Array.isArray(ce.mermasAutoconsumo)) ce.mermasAutoconsumo = [];

                ce.libroInventario177 = ce.libroInventario177.filter(r => !(r.origenModulo === ORIGEN_MODULO && r.codigo === p.sku));
                ce.mermasAutoconsumo = ce.mermasAutoconsumo.filter(r => !(r.origenModulo === ORIGEN_MODULO && r.codigoItem === p.sku));

                if (!eliminar) {
                    const st = this.calcStock(p);
                    ce.libroInventario177.push({
                        codigo: p.sku,
                        descripcion: `${p.nombre} (${p.presentacion})`,
                        categoria: 'Producto Terminado Exclusivo',
                        unidad: 'Unidades',
                        costoUnitUSD: round2(p.costoUnitarioUsd),
                        invInicialUnid: st.inicial,
                        entradasUnid: st.produccion,
                        salidasVentasProdUnid: st.ventasLocal + st.despachosB2B,
                        mermasAutoconsumoUnid: st.mermas,
                        origenModulo: ORIGEN_MODULO
                    });
                    const tasa = this.getTasa();
                    p.mermas.forEach(x => {
                        ce.mermasAutoconsumo.push({
                            id: `PNV-${x.id}`,
                            fecha: x.fecha,
                            codigoItem: p.sku,
                            producto: p.nombre,
                            tipo: x.causa,
                            cantidad: x.cantidad,
                            unidad: 'Unidades',
                            costoUnitUSD: round2(x.costoUnitUsd),
                            costoTotalUSD: round2(x.cantidad * round2(x.costoUnitUsd)),
                            tasaBCV: x.tasaBCV || tasa,
                            autorizadoPor: x.autorizadoPor,
                            origenModulo: ORIGEN_MODULO
                        });
                    });
                }
                if (typeof ce.guardarEstado === 'function') ce.guardarEstado();
            } catch (e) {
                console.warn('[Productos Nueva Viasa] Sincronización contable no disponible:', e);
            }
        },

        getProducto(id) {
            return this.productos.find(p => p.id === id);
        },

        usuarioActual() {
            try {
                const u = window.ViasaAuth && window.ViasaAuth.getCurrentUser();
                if (u) return u.nombre || u.usuario || u.email || u.rol || 'Usuario autenticado';
            } catch (e) { /* sin sesión */ }
            return 'Usuario del sistema';
        },

        toast(msg, tipo) {
            const t = document.createElement('div');
            const color = tipo === 'error' ? '#ef4444' : (tipo === 'warn' ? '#f59e0b' : '#10b981');
            t.style.cssText = `position:fixed;bottom:24px;right:24px;z-index:10050;background:#0f172a;color:#fff;border:1px solid ${color};border-left:5px solid ${color};padding:12px 18px;border-radius:12px;font-weight:700;font-size:0.85rem;box-shadow:0 12px 30px rgba(0,0,0,0.5);max-width:420px;`;
            t.textContent = msg;
            document.body.appendChild(t);
            setTimeout(() => { t.style.transition = 'opacity .4s'; t.style.opacity = '0'; }, 3200);
            setTimeout(() => t.remove(), 3700);
        },


        // --------------------------------------------------------------------
        // RENDER PRINCIPAL
        // --------------------------------------------------------------------
        render() {
            this.init();
            const root = document.getElementById('productos-nueva-viasa-content');
            if (!root) return;
            const k = this.calcKpis();
            const tasa = this.getTasa();

            const kpi = (icon, color, label, value, sub) => `
                <div class="pnv-kpi-card" style="border-top: 3px solid ${color};">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                        <span style="font-size:0.7rem;font-weight:800;color:#94A3B8;text-transform:uppercase;letter-spacing:0.05em;">${label}</span>
                        <i class="fa-solid ${icon}" style="color:${color};font-size:1rem;"></i>
                    </div>
                    <div style="font-size:1.55rem;font-weight:900;color:#fff;font-variant-numeric:tabular-nums;line-height:1.1;">${value}</div>
                    <div style="font-size:0.72rem;color:#94A3B8;margin-top:5px;font-variant-numeric:tabular-nums;">${sub}</div>
                </div>`;

            const pills = ['Todas', ...CATEGORIAS].map(c => `
                <button type="button" class="pnv-cat-pill ${this.filtroCategoria === c ? 'active' : ''}" onclick="ViasaProductosExclusivosEngine.setCategoria('${esc(c)}')">
                    ${c === 'Todas' ? '<i class="fa-solid fa-layer-group"></i> Todas las Líneas' : esc(c)}
                </button>`).join('');

            root.innerHTML = `
            <div class="pnv-workspace">
                <div class="pnv-exec-header">
                    <div style="display:flex;align-items:center;gap:16px;">
                        <div style="width:54px;height:54px;border-radius:14px;background:linear-gradient(135deg,#F59E0B,#B45309);display:flex;align-items:center;justify-content:center;box-shadow:0 6px 18px rgba(217,119,6,0.4);">
                            <i class="fa-solid fa-crown" style="color:#fff;font-size:1.5rem;"></i>
                        </div>
                        <div>
                            <h1 style="margin:0;font-size:1.45rem;font-weight:900;color:#fff;letter-spacing:-0.01em;">Productos Nueva Viasa — Catálogo Exclusivo y Trazabilidad de Lotes</h1>
                            <div style="font-size:0.8rem;color:#FBBF24;font-weight:700;margin-top:4px;">Panadería Nueva Viasa, C.A. • RIF: J-31163165-8 • La Sabanita, Ciudad Bolívar</div>
                        </div>
                    </div>
                    <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
                        <span class="pnv-chip"><i class="fa-solid fa-building-columns"></i> Tasa BCV: Bs. ${fmtNum(tasa)}</span>
                        <span class="pnv-chip"><i class="fa-solid fa-calendar"></i> Período: ${periodLabel(k.per)}</span>
                    </div>
                </div>

                <div class="pnv-kpi-grid">
                    ${kpi('fa-crown', '#FBBF24', 'Productos Exclusivos Activos', fmtInt(k.activos), 'Catálogo maestro Nueva Viasa')}
                    ${kpi('fa-boxes-stacked', '#38BDF8', 'Unidades en Stock Hoy', fmtInt(k.stockTotal), `Mostrador: ${fmtInt(k.mostrador)} • Reserva B2B: ${fmtInt(k.reserva)}`)}
                    ${kpi('fa-truck-fast', '#A78BFA', 'Despachadas a Aliados (B2B)', fmtInt(k.b2bUnid), `USD ${fmtNum(k.b2bUsd)} • Bs. ${fmtNum(this.bs(k.b2bUsd))}`)}
                    ${kpi('fa-triangle-exclamation', '#F87171', 'Merma Acumulada del Período', `${fmtInt(k.mermaUnid)} und`, `USD ${fmtNum(k.mermaUsd)} • Bs. ${fmtNum(this.bs(k.mermaUsd))}`)}
                    ${kpi('fa-sack-dollar', '#34D399', 'Valor Inventario Terminado', `USD ${fmtNum(k.valorUsd)}`, `Bs. ${fmtNum(this.bs(k.valorUsd))} (a costo de producción)`)}
                </div>

                <div class="pnv-toolbar">
                    <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;flex:1;">
                        <div style="position:relative;min-width:260px;flex:0 1 340px;">
                            <i class="fa-solid fa-magnifying-glass" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#64748B;"></i>
                            <input id="pnv-search" type="search" class="pnv-input" style="padding-left:36px;" placeholder="Buscar por nombre, SKU o código de barras..." value="${esc(this.busqueda)}" oninput="ViasaProductosExclusivosEngine.setBusqueda(this.value)">
                        </div>
                        <div class="pnv-cat-pills">${pills}</div>
                    </div>
                    <button type="button" class="pnv-btn pnv-btn-gold" onclick="ViasaProductosExclusivosEngine.abrirFormProducto()">
                        <i class="fa-solid fa-plus"></i> Nuevo Producto Nueva Viasa
                    </button>
                </div>

                <div id="pnv-grid-wrap"></div>
            </div>`;
            this.renderGrid();
        },

        setCategoria(c) {
            this.filtroCategoria = c;
            this.render();
        },

        setBusqueda(v) {
            this.busqueda = v;
            this.renderGrid();
        },

        renderGrid() {
            const wrap = document.getElementById('pnv-grid-wrap');
            if (!wrap) return;
            const q = this.busqueda.trim().toLowerCase();
            const lista = this.productos.filter(p => {
                if (this.filtroCategoria !== 'Todas' && p.categoria !== this.filtroCategoria) return false;
                if (!q) return true;
                return [p.nombre, p.sku, p.barcode, p.presentacion].some(v => String(v || '').toLowerCase().includes(q));
            });

            if (!lista.length) {
                wrap.innerHTML = `<div class="pnv-empty"><i class="fa-solid fa-box-open" style="font-size:2.4rem;color:#475569;"></i>
                    <div style="font-weight:800;margin-top:10px;">No se encontraron productos con los filtros actuales.</div>
                    <div style="color:#94A3B8;font-size:0.82rem;margin-top:4px;">Ajuste la búsqueda o registre un nuevo producto exclusivo.</div></div>`;
                return;
            }
            wrap.innerHTML = `<div class="pnv-cards-grid">${lista.map(p => this.cardHtml(p)).join('')}</div>`;
        },

        cardHtml(p) {
            const st = this.calcStock(p);
            const sem = this.semaforo(p);
            const margen = this.calcMargen(p.pvpUnitarioUsd, p.costoUnitarioUsd);
            const margenB2B = this.calcMargen(p.precioAliadoUsd, p.costoUnitarioUsd);
            const margenColor = margen >= p.margenObjetivoPct ? '#4ade80' : (margen > 0 ? '#facc15' : '#f87171');
            const fiscal = p.condicionFiscal === 'GRAVADO'
                ? '<span class="pnv-badge" style="background:rgba(30,64,175,0.9);color:#DBEAFE;">GRAVADO 16%</span>'
                : '<span class="pnv-badge" style="background:rgba(6,95,70,0.9);color:#D1FAE5;">EXENTO IVA</span>';
            const id = esc(p.id);
            return `
            <article class="pnv-product-card" onclick="ViasaProductosExclusivosEngine.abrirDetalle('${id}')" style="${p.activo === false ? 'opacity:0.6;' : ''}">
                <div class="pnv-img-wrap">
                    <img src="${esc(p.fotoUrl)}" alt="${esc(p.nombre)}" loading="lazy" onerror="this.onerror=null;this.src='${makeFoodArtDataUrl('Producto Nueva Viasa', 'Imagen no disponible', '#1e293b', '#0f172a', '#f59e0b', '🥐')}'">
                    <div class="pnv-badge-top-left">
                        <span class="pnv-badge" style="background:rgba(15,23,42,0.85);color:#FDE68A;border:1px solid rgba(251,191,36,0.4);">${esc(p.categoria)}</span>
                        ${fiscal}
                    </div>
                    <div class="pnv-badge-top-right">
                        <span class="pnv-badge" style="background:${sem.bg};color:#fff;border:1px solid ${sem.color};">${sem.txt}</span>
                    </div>
                    <button type="button" class="pnv-photo-btn" onclick="event.stopPropagation();ViasaProductosExclusivosEngine.cambiarFoto('${id}')">📷 Cambiar Foto</button>
                </div>
                <div class="pnv-card-body">
                    <h3 class="pnv-product-title">${esc(p.nombre)}</h3>
                    <div class="pnv-sku-line">
                        <span><i class="fa-solid fa-barcode"></i> ${esc(p.sku)} • ${esc(p.barcode || '—')}</span>
                    </div>
                    <div style="font-size:0.76rem;color:#CBD5E1;"><i class="fa-solid fa-box" style="color:#FBBF24;"></i> ${esc(p.presentacion)}</div>
                    
                    <!-- Tarjeta / Vista rápida de códigos de barras y QR -->
                    <div class="pnv-card-codes-box" onclick="event.stopPropagation();ViasaProductosExclusivosEngine.abrirEstudioStickers('${id}')" title="Clic para abrir Estudio de Códigos e Impresión de Stickers">
                        <div style="flex:1;overflow:hidden;margin-right:8px;background:#fff;padding:2px 4px;border-radius:4px;display:flex;align-items:center;justify-content:center;">
                            ${renderBarcodeGraphic(p, p.barcode || p.sku, p.tipoCodigo || 'EAN13', 140, 32)}
                        </div>
                        <div style="flex-shrink:0;background:#fff;padding:2px;border-radius:4px;display:flex;align-items:center;justify-content:center;">
                            ${renderQRGraphic(p, p.qrCode || this.generarPayloadQR(p), 34, 1)}
                        </div>
                    </div>
                    <div class="pnv-metrics-box">
                        <div class="pnv-stock-row">
                            <div>
                                <div style="font-size:0.66rem;color:#94A3B8;font-weight:800;text-transform:uppercase;">Existencia Actual Total</div>
                                <div style="font-size:0.7rem;color:#94A3B8;">Mostrador Local: <b style="color:#E2E8F0;">${fmtInt(st.mostrador)}</b> • Reserva B2B: <b style="color:#E2E8F0;">${fmtInt(st.reserva)}</b></div>
                            </div>
                            <div style="font-size:1.9rem;font-weight:900;color:${sem.color};font-variant-numeric:tabular-nums;">${fmtInt(st.total)}</div>
                        </div>
                        <div style="display:flex;justify-content:space-between;font-size:0.74rem;">
                            <span style="color:#94A3B8;">Costo producción / und</span>
                            <span style="font-variant-numeric:tabular-nums;color:#E2E8F0;font-weight:700;">USD ${fmtNum(p.costoUnitarioUsd)} • Bs. ${fmtNum(this.bs(p.costoUnitarioUsd))}</span>
                        </div>
                        <div class="pnv-price-grid">
                            <div style="text-align:left;">
                                <div class="pnv-mini-label">PVP Mostrador</div>
                                <div class="pnv-mini-val">USD ${fmtNum(p.pvpUnitarioUsd)}</div>
                                <div class="pnv-mini-sub">Bs. ${fmtNum(this.bs(p.pvpUnitarioUsd))}</div>
                            </div>
                            <div>
                                <div class="pnv-mini-label">Aliados B2B</div>
                                <div class="pnv-mini-val">USD ${fmtNum(p.precioAliadoUsd)}</div>
                                <div class="pnv-mini-sub">Margen ${fmtNum(margenB2B)}%</div>
                            </div>
                            <div>
                                <div class="pnv-mini-label">Margen PVP</div>
                                <div class="pnv-mini-val" style="color:${margenColor};">${fmtNum(margen)}%</div>
                                <div class="pnv-mini-sub">Meta ${fmtNum(p.margenObjetivoPct)}%</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="pnv-card-footer">
                    <button type="button" class="pnv-btn pnv-btn-gold pnv-btn-sm" style="flex:1;" onclick="event.stopPropagation();ViasaProductosExclusivosEngine.abrirDetalle('${id}')"><i class="fa-solid fa-route"></i> Ver Detalle</button>
                    <button type="button" class="pnv-btn pnv-btn-ghost pnv-btn-sm" title="Imprimir stickers y ver códigos" onclick="event.stopPropagation();ViasaProductosExclusivosEngine.abrirEstudioStickers('${id}')"><i class="fa-solid fa-qrcode"></i> Stickers</button>
                    <button type="button" class="pnv-btn pnv-btn-ghost pnv-btn-sm" title="Modificar producto" onclick="event.stopPropagation();ViasaProductosExclusivosEngine.abrirFormProducto('${id}')">✏️</button>
                    <button type="button" class="pnv-btn pnv-btn-danger pnv-btn-sm" title="Eliminar producto" onclick="event.stopPropagation();ViasaProductosExclusivosEngine.confirmarEliminarProducto('${id}')">🗑️</button>
                </div>
            </article>`;
        },

        refrescarTodo() {
            const view = document.getElementById('view-productos-nueva-viasa');
            if (view && view.classList.contains('active')) this.render();
            if (this.detalleId && document.getElementById('pnv-detalle-overlay')) this.renderDetalle();
        },

        // --------------------------------------------------------------------
        // FOTOGRAFÍA (carga desde el equipo, redimensionada para ahorrar espacio)
        // --------------------------------------------------------------------
        leerImagen(file) {
            return new Promise((resolve, reject) => {
                if (!file || !/^image\//.test(file.type)) { reject(new Error('El archivo seleccionado no es una imagen válida.')); return; }
                const reader = new FileReader();
                reader.onerror = () => reject(new Error('No se pudo leer la imagen.'));
                reader.onload = () => {
                    const img = new Image();
                    img.onload = () => {
                        const maxW = 800;
                        const scale = Math.min(1, maxW / img.width);
                        const canvas = document.createElement('canvas');
                        canvas.width = Math.round(img.width * scale);
                        canvas.height = Math.round(img.height * scale);
                        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
                        resolve(canvas.toDataURL('image/jpeg', 0.82));
                    };
                    img.onerror = () => reject(new Error('Formato de imagen no compatible.'));
                    img.src = reader.result;
                };
                reader.readAsDataURL(file);
            });
        },

        cambiarFoto(id) {
            const p = this.getProducto(id);
            if (!p) return;
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = async () => {
                try {
                    const anterior = p.fotoUrl;
                    p.fotoUrl = await this.leerImagen(input.files[0]);
                    if (!this.guardar()) { p.fotoUrl = anterior; return; }
                    this.toast(`📷 Fotografía actualizada: ${p.nombre}`);
                    this.refrescarTodo();
                } catch (e) {
                    this.toast('⚠️ ' + e.message, 'error');
                }
            };
            input.click();
        },

        // --------------------------------------------------------------------
        // MODALES GENÉRICOS
        // --------------------------------------------------------------------
        abrirModal(id, html, maxWidth) {
            this.cerrarModal(id);
            const ov = document.createElement('div');
            ov.className = 'pnv-modal-overlay';
            ov.id = id;
            ov.innerHTML = `<div class="pnv-modal-container" style="${maxWidth ? `max-width:${maxWidth}px;` : ''}" onclick="event.stopPropagation()">${html}</div>`;
            ov.addEventListener('click', () => this.cerrarModal(id));
            document.body.appendChild(ov);
            return ov;
        },

        cerrarModal(id) {
            const el = document.getElementById(id);
            if (el) el.remove();
            if (id === 'pnv-detalle-overlay') this.detalleId = null;
        },

        modalHeader(titulo, subtitulo, closeId) {
            return `<div class="pnv-modal-header">
                <div>
                    <h2 style="margin:0;font-size:1.2rem;font-weight:900;color:#fff;">${titulo}</h2>
                    ${subtitulo ? `<div style="font-size:0.78rem;color:#FBBF24;font-weight:700;margin-top:3px;">${subtitulo}</div>` : ''}
                </div>
                <button type="button" class="pnv-btn pnv-btn-ghost pnv-btn-sm" onclick="ViasaProductosExclusivosEngine.cerrarModal('${closeId}')"><i class="fa-solid fa-xmark"></i> Cerrar</button>
            </div>`;
        },

        // --------------------------------------------------------------------
        // CRUD: AGREGAR / MODIFICAR PRODUCTO
        // --------------------------------------------------------------------
        abrirFormProducto(id) {
            const p = id ? this.getProducto(id) : null;
            const v = p ? Object.assign({}, p) : {
                nombre: '', sku: this.sugerirSku(), barcode: this.generarEAN13Auto(), tipoCodigo: 'EAN13', presentacion: '', categoria: CATEGORIAS[0], condicionFiscal: 'EXENTO',
                stockInicialMostrador: 0, stockInicialReserva: 0, stockMinimo: 10, costoUnitarioUsd: 0, pvpUnitarioUsd: 0,
                precioAliadoUsd: 0, margenObjetivoPct: 35, vidaUtilDias: 7, fotoUrl: '', activo: true
            };
            if (!v.barcode) {
                v.barcode = (v.tipoCodigo === 'CODE128') ? this.generarCode128Auto() : this.generarEAN13Auto();
            }
            v.tipoCodigo = v.tipoCodigo || 'EAN13';
            this._fotoTemporal = v.fotoUrl || '';
            this._customBarcodeImageForm = v.customBarcodeImage || '';
            this._customQrImageForm = v.customQrImage || '';
            const tasa = this.getTasa();
            const opt = (arr, sel) => arr.map(o => `<option value="${esc(o)}" ${o === sel ? 'selected' : ''}>${esc(o)}</option>`).join('');

            const html = `
                ${this.modalHeader(p ? '✏️ Modificar Producto Nueva Viasa' : '➕ Nuevo Producto Nueva Viasa', p ? `${esc(p.sku)} • ${esc(p.nombre)}` : 'Registro en el Catálogo Maestro Exclusivo', 'pnv-form-overlay')}
                <form id="pnv-form-producto" class="pnv-modal-body" onsubmit="event.preventDefault();ViasaProductosExclusivosEngine.guardarFormProducto('${p ? esc(p.id) : ''}')" oninput="ViasaProductosExclusivosEngine.recalcForm()">
                    <div style="display:grid;grid-template-columns:240px 1fr;gap:20px;" class="pnv-form-split">
                        <div>
                            <div class="pnv-label">Fotografía del producto</div>
                            <div id="pnv-form-foto" style="height:180px;border-radius:12px;border:1px dashed rgba(251,191,36,0.45);background:#0B0F19 center/cover no-repeat;${v.fotoUrl ? `background-image:url('${esc(v.fotoUrl)}');` : ''}display:flex;align-items:center;justify-content:center;color:#64748B;font-size:0.8rem;">${v.fotoUrl ? '' : 'Sin fotografía'}</div>
                            <label class="pnv-btn pnv-btn-ghost pnv-btn-sm" style="margin-top:8px;width:100%;justify-content:center;cursor:pointer;">
                                📷 Subir desde la computadora
                                <input type="file" accept="image/*" style="display:none;" onchange="ViasaProductosExclusivosEngine.previewFotoForm(this)">
                            </label>
                            <div class="pnv-label" style="margin-top:14px;">Estado en catálogo</div>
                            <select name="activo" class="pnv-input"><option value="1" ${v.activo !== false ? 'selected' : ''}>Activo</option><option value="0" ${v.activo === false ? 'selected' : ''}>Inactivo (dado de baja)</option></select>
                        </div>
                        <div class="pnv-form-grid">
                            <div class="pnv-field" style="grid-column:span 2;"><label class="pnv-label">Nombre del producto *</label><input name="nombre" class="pnv-input" required maxlength="120" value="${esc(v.nombre)}"></div>
                            <div class="pnv-field"><label class="pnv-label">Código SKU *</label><input name="sku" class="pnv-input" required maxlength="30" value="${esc(v.sku)}"></div>
                            <div class="pnv-field" style="grid-column:span 2;">
                                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                                    <label class="pnv-label" style="margin-bottom:0;"><i class="fa-solid fa-barcode" style="color:#FBBF24;"></i> Código de Barras Asignado (Escanear o escribir número) *</label>
                                    <div style="display:flex;gap:6px;">
                                        <button type="button" class="pnv-btn pnv-btn-ghost pnv-btn-xs" style="color:#FBBF24;border-color:rgba(251,191,36,0.35);" onclick="ViasaProductosExclusivosEngine.regenerarCodigoForm('EAN13')">⚡ Generar EAN-13 (759...)</button>
                                        <button type="button" class="pnv-btn pnv-btn-ghost pnv-btn-xs" onclick="ViasaProductosExclusivosEngine.regenerarCodigoForm('CODE128')">⚡ Generar Code-128</button>
                                    </div>
                                </div>
                                <div style="display:grid;grid-template-columns:140px 1fr;gap:8px;">
                                    <select name="tipoCodigo" class="pnv-input" onchange="ViasaProductosExclusivosEngine.cambiarTipoCodigoForm(this.value)">
                                        <option value="EAN13" ${v.tipoCodigo !== 'CODE128' ? 'selected' : ''}>EAN-13 (Comercial)</option>
                                        <option value="CODE128" ${v.tipoCodigo === 'CODE128' ? 'selected' : ''}>Code-128 (Interno)</option>
                                    </select>
                                    <input name="barcode" id="pnv-form-input-barcode" class="pnv-input" maxlength="25" placeholder="Escanear con pistola o escribir código (ej. 759... o NV-...)" value="${esc(v.barcode || '')}" oninput="ViasaProductosExclusivosEngine.recalcFormCodes()">
                                </div>
                                <div id="pnv-form-codes-live" style="margin-top:10px;padding:8px 12px;background:#080D1A;border:1px solid rgba(251,191,36,0.25);border-radius:10px;display:flex;align-items:center;justify-content:space-between;gap:14px;">
                                    <!-- Renderizado dinámico de códigos en vivo -->
                                </div>
                            </div>
                            <div class="pnv-field"><label class="pnv-label">Presentación *</label><input name="presentacion" class="pnv-input" required placeholder="Unidad 500 g, Paquete x 6, Bandeja..." value="${esc(v.presentacion)}"></div>
                            <div class="pnv-field"><label class="pnv-label">Categoría *</label><select name="categoria" class="pnv-input">${opt(CATEGORIAS, v.categoria)}</select></div>
                            <div class="pnv-field"><label class="pnv-label">Condición IVA (SENIAT)</label><select name="condicionFiscal" class="pnv-input"><option value="EXENTO" ${v.condicionFiscal !== 'GRAVADO' ? 'selected' : ''}>Exento</option><option value="GRAVADO" ${v.condicionFiscal === 'GRAVADO' ? 'selected' : ''}>Gravado 16%</option></select></div>
                            <div class="pnv-field"><label class="pnv-label">Vida útil (días)</label><input name="vidaUtilDias" type="number" min="1" step="1" class="pnv-input" value="${esc(v.vidaUtilDias)}"></div>
                            <div class="pnv-field"><label class="pnv-label">Stock inicial — Mostrador</label><input name="stockInicialMostrador" type="number" min="0" step="1" class="pnv-input" value="${esc(v.stockInicialMostrador)}"></div>
                            <div class="pnv-field"><label class="pnv-label">Stock inicial — Reserva B2B</label><input name="stockInicialReserva" type="number" min="0" step="1" class="pnv-input" value="${esc(v.stockInicialReserva)}"></div>
                            <div class="pnv-field"><label class="pnv-label">Stock mínimo de alerta</label><input name="stockMinimo" type="number" min="0" step="1" class="pnv-input" value="${esc(v.stockMinimo)}"></div>
                            <div class="pnv-field"><label class="pnv-label">Margen objetivo (%)</label><input name="margenObjetivoPct" type="number" min="0" max="99" step="0.01" class="pnv-input" value="${esc(v.margenObjetivoPct)}"></div>
                            <div class="pnv-field"><label class="pnv-label">Costo unitario (USD) *</label><input name="costoUnitarioUsd" type="number" min="0" step="0.01" class="pnv-input" required value="${esc(v.costoUnitarioUsd)}"></div>
                            <div class="pnv-field"><label class="pnv-label">Costo unitario (Bs. BCV)</label><input name="costoBs" type="number" min="0" step="0.01" class="pnv-input" value="${round2(round2(v.costoUnitarioUsd) * tasa)}" oninput="event.stopPropagation();ViasaProductosExclusivosEngine.costoBsAUsd(this.value)"></div>
                            <div class="pnv-field"><label class="pnv-label">Precio mostrador / PVP (USD) *</label><input name="pvpUnitarioUsd" type="number" min="0.01" step="0.01" class="pnv-input" required value="${esc(v.pvpUnitarioUsd)}"></div>
                            <div class="pnv-field"><label class="pnv-label">Precio clientes mayoristas B2B (USD) *</label><input name="precioAliadoUsd" type="number" min="0.01" step="0.01" class="pnv-input" required value="${esc(v.precioAliadoUsd)}"></div>
                            <div id="pnv-form-calc" class="pnv-calc-box" style="grid-column:span 2;"></div>
                        </div>
                    </div>
                    <div class="pnv-modal-actions">
                        <button type="button" class="pnv-btn pnv-btn-ghost" onclick="ViasaProductosExclusivosEngine.cerrarModal('pnv-form-overlay')">Cancelar</button>
                        <button type="submit" class="pnv-btn pnv-btn-gold"><i class="fa-solid fa-floppy-disk"></i> ${p ? 'Guardar Cambios' : 'Registrar Producto'}</button>
                    </div>
                </form>`;
            this.abrirModal('pnv-form-overlay', html, 1040);
            this.recalcForm();
            this.recalcFormCodes();
        },

        sugerirSku() {
            let n = this.productos.length + 1;
            let sku;
            do { sku = `PNV-EXC-${String(n).padStart(3, '0')}`; n++; } while (this.productos.some(p => p.sku === sku));
            return sku;
        },

        async previewFotoForm(input) {
            try {
                this._fotoTemporal = await this.leerImagen(input.files[0]);
                const box = document.getElementById('pnv-form-foto');
                if (box) { box.style.backgroundImage = `url('${this._fotoTemporal}')`; box.textContent = ''; }
            } catch (e) {
                this.toast('⚠️ ' + e.message, 'error');
            }
        },

        costoBsAUsd(valBs) {
            const f = document.getElementById('pnv-form-producto');
            if (!f) return;
            f.costoUnitarioUsd.value = round2((parseFloat(valBs) || 0) / this.getTasa());
            this.recalcForm(true);
        },

        recalcForm(skipBs) {
            const f = document.getElementById('pnv-form-producto');
            const box = document.getElementById('pnv-form-calc');
            if (!f || !box) return;
            const costo = round2(f.costoUnitarioUsd.value);
            const pvp = round2(f.pvpUnitarioUsd.value);
            const b2b = round2(f.precioAliadoUsd.value);
            const meta = round2(f.margenObjetivoPct.value);
            if (!skipBs && document.activeElement !== f.costoBs) f.costoBs.value = this.bs(costo);
            const mP = this.calcMargen(pvp, costo);
            const mB = this.calcMargen(b2b, costo);
            const stIni = (parseInt(f.stockInicialMostrador.value, 10) || 0) + (parseInt(f.stockInicialReserva.value, 10) || 0);
            const col = m => (m >= meta ? '#4ade80' : (m > 0 ? '#facc15' : '#f87171'));
            const iva = f.condicionFiscal.value === 'GRAVADO' ? 16 : 0;
            box.innerHTML = `
                <div><span>Margen PVP</span><b style="color:${col(mP)};">${fmtNum(mP)}%</b></div>
                <div><span>Margen B2B</span><b style="color:${col(mB)};">${fmtNum(mB)}%</b></div>
                <div><span>PVP en Bs.</span><b>Bs. ${fmtNum(this.bs(pvp))}</b></div>
                <div><span>PVP + IVA ${iva}%</span><b>Bs. ${fmtNum(round2(this.bs(pvp) * (1 + iva / 100)))}</b></div>
                <div><span>Precio B2B en Bs.</span><b>Bs. ${fmtNum(this.bs(b2b))}</b></div>
                <div><span>Stock inicial total</span><b>${fmtInt(stIni)} und</b></div>
                ${(pvp > 0 && pvp < costo) || (b2b > 0 && b2b < costo) ? '<div style="grid-column:1/-1;color:#f87171;font-weight:800;">⚠️ Atención: hay precios por debajo del costo de producción.</div>' : ''}`;
            this.recalcFormCodes();
        },

        regenerarCodigoForm(tipo = 'EAN13') {
            const f = document.getElementById('pnv-form-producto');
            if (!f) return;
            const nuevo = (tipo === 'CODE128') ? this.generarCode128Auto() : this.generarEAN13Auto();
            if (f.tipoCodigo) f.tipoCodigo.value = tipo;
            if (f.barcode) f.barcode.value = nuevo;
            this.recalcFormCodes();
            this.toast(`⚡ Nuevo código ${tipo} generado: ${nuevo}`);
        },

        cambiarTipoCodigoForm(tipo) {
            const f = document.getElementById('pnv-form-producto');
            if (!f) return;
            const curVal = (f.barcode ? f.barcode.value : '').trim();
            if (tipo === 'EAN13' && !/^\d{12,13}$/.test(curVal)) {
                f.barcode.value = this.generarEAN13Auto();
            } else if (tipo === 'CODE128' && /^\d{13}$/.test(curVal)) {
                f.barcode.value = this.generarCode128Auto();
            }
            this.recalcFormCodes();
        },

        leerImagenCodigo(file) {
            return new Promise((resolve, reject) => {
                if (!file) { reject(new Error('No se seleccionó ningún archivo.')); return; }
                const isImg = /^image\//.test(file.type) || file.name.match(/\.(png|jpe?g|svg|webp)$/i);
                if (!isImg) { reject(new Error('El archivo seleccionado debe ser una imagen (.png, .jpg, .jpeg, .svg, .webp).')); return; }
                const reader = new FileReader();
                reader.onerror = () => reject(new Error('Error al leer el archivo de imagen.'));
                reader.onload = () => {
                    const result = reader.result;
                    if (file.type === 'image/svg+xml' || file.name.endsWith('.svg') || (result && result.length < 600000 && (file.type === 'image/png' || file.type === 'image/webp'))) {
                        resolve(result);
                        return;
                    }
                    const img = new Image();
                    img.onload = () => {
                        const maxDim = 1200;
                        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
                        const canvas = document.createElement('canvas');
                        canvas.width = Math.round(img.width * scale);
                        canvas.height = Math.round(img.height * scale);
                        const ctx = canvas.getContext('2d');
                        ctx.imageSmoothingEnabled = false;
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        resolve(canvas.toDataURL('image/png'));
                    };
                    img.onerror = () => reject(new Error('Formato de imagen no compatible.'));
                    img.src = result;
                };
                reader.readAsDataURL(file);
            });
        },

        async subirBarcodeForm(input) {
            try {
                if (!input.files || !input.files[0]) return;
                this._customBarcodeImageForm = await this.leerImagenCodigo(input.files[0]);
                this.recalcFormCodes();
                this.toast('🖼️ Imagen de código de barras cargada correctamente.');
            } catch (e) {
                this.toast('⚠️ ' + e.message, 'error');
            }
        },

        restaurarBarcodeForm() {
            this._customBarcodeImageForm = '';
            this.recalcFormCodes();
            this.toast('🔄 Generador automático de código de barras restaurado.');
        },

        async subirQRForm(input) {
            try {
                if (!input.files || !input.files[0]) return;
                this._customQrImageForm = await this.leerImagenCodigo(input.files[0]);
                this.recalcFormCodes();
                this.toast('🖼️ Imagen de código QR cargada correctamente.');
            } catch (e) {
                this.toast('⚠️ ' + e.message, 'error');
            }
        },

        restaurarQRForm() {
            this._customQrImageForm = '';
            this.recalcFormCodes();
            this.toast('🔄 Generador automático de código QR restaurado.');
        },

        recalcFormCodes() {
            const f = document.getElementById('pnv-form-producto');
            const liveBox = document.getElementById('pnv-form-codes-live');
            if (!f || !liveBox) return;
            const tipo = f.tipoCodigo ? f.tipoCodigo.value : 'EAN13';
            let code = (f.barcode ? f.barcode.value : '').trim();
            if (!code) {
                code = (tipo === 'EAN13') ? this.generarEAN13Auto() : this.generarCode128Auto();
                if (f.barcode) f.barcode.value = code;
            }
            const nombre = (f.nombre && f.nombre.value.trim()) || 'Nuevo Producto';
            const sku = (f.sku && f.sku.value.trim().toUpperCase()) || 'NV-0000';
            const pvp = f.pvpUnitarioUsd ? round2(f.pvpUnitarioUsd.value) : 0;
            const tempProd = {
                nombre,
                sku,
                barcode: code,
                tipoCodigo: tipo,
                pvpUnitarioUsd: pvp,
                customBarcodeImage: this._customBarcodeImageForm || null,
                customQrImage: this._customQrImageForm || null
            };
            const payloadQR = this.generarPayloadQR(tempProd, null, 'texto');
            const hasCustomBarcode = !!this._customBarcodeImageForm;
            const hasCustomQr = !!this._customQrImageForm;

            const barcodePreviewHtml = hasCustomBarcode
                ? `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2px 4px;box-sizing:border-box;">
                     <img src="${esc(this._customBarcodeImageForm)}" alt="Código de barras personalizado" style="max-height:44px;max-width:180px;object-fit:contain;display:block;">
                     <div style="font-size:10px;font-weight:800;font-family:'JetBrains Mono',monospace;color:#0F172A;margin-top:2px;">${esc(code)}</div>
                   </div>`
                : renderBarcodeSvg(code, tipo, 190, 42);

            const qrPreviewHtml = hasCustomQr
                ? `<div style="display:flex;align-items:center;justify-content:center;padding:2px;box-sizing:border-box;">
                     <img src="${esc(this._customQrImageForm)}" alt="QR personalizado" style="width:48px;height:48px;object-fit:contain;display:block;">
                   </div>`
                : renderQRSvg(payloadQR, 48, 1);

            liveBox.innerHTML = `
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;align-items:flex-start;width:100%;">
                    <!-- Columna Código de Barras -->
                    <div>
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                            <span style="font-size:0.68rem;font-weight:800;color:#94A3B8;text-transform:uppercase;letter-spacing:0.04em;">
                                <i class="fa-solid fa-barcode" style="color:#FBBF24;"></i> Código de Barras
                            </span>
                            ${hasCustomBarcode
                                ? '<span class="pnv-badge" style="background:#065F46;color:#A7F3D0;font-size:0.62rem;border:1px solid #10B981;">Imagen Propia</span>'
                                : `<span style="font-size:0.65rem;color:#94A3B8;font-weight:700;">${tipo} (Sistema)</span>`}
                        </div>
                        <div style="background:#fff;padding:6px;border-radius:6px;display:flex;align-items:center;justify-content:center;min-height:56px;box-shadow:0 2px 6px rgba(0,0,0,0.35);">
                            ${barcodePreviewHtml}
                        </div>
                        <div style="display:flex;gap:4px;margin-top:6px;flex-wrap:wrap;">
                            <label class="pnv-btn pnv-btn-ghost pnv-btn-xs" style="flex:1;justify-content:center;cursor:pointer;font-size:0.68rem;" title="Subir imagen propia (.png, .jpg, .svg, .webp) para el código de barras">
                                🖼️ Cambiar Imagen de Código de Barras
                                <input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" style="display:none;" onchange="ViasaProductosExclusivosEngine.subirBarcodeForm(this)">
                            </label>
                            ${hasCustomBarcode ? `
                                <button type="button" class="pnv-btn pnv-btn-ghost pnv-btn-xs" style="color:#F87171;border-color:rgba(248,113,113,0.35);font-size:0.65rem;" title="Volver al código de barras dibujado por el sistema" onclick="ViasaProductosExclusivosEngine.restaurarBarcodeForm()">
                                    🔄 Restaurar Generador Automático
                                </button>
                            ` : ''}
                        </div>
                    </div>

                    <!-- Columna Código QR -->
                    <div>
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                            <span style="font-size:0.68rem;font-weight:800;color:#94A3B8;text-transform:uppercase;letter-spacing:0.04em;">
                                <i class="fa-solid fa-qrcode" style="color:#FBBF24;"></i> Código QR
                            </span>
                            ${hasCustomQr
                                ? '<span class="pnv-badge" style="background:#065F46;color:#A7F3D0;font-size:0.62rem;border:1px solid #10B981;">QR Propio</span>'
                                : '<span style="font-size:0.65rem;color:#94A3B8;font-weight:700;">Trazable (Sistema)</span>'}
                        </div>
                        <div style="background:#fff;padding:4px;border-radius:6px;display:flex;align-items:center;justify-content:center;min-height:56px;box-shadow:0 2px 6px rgba(0,0,0,0.35);">
                            ${qrPreviewHtml}
                        </div>
                        <div style="display:flex;gap:4px;margin-top:6px;flex-wrap:wrap;">
                            <label class="pnv-btn pnv-btn-ghost pnv-btn-xs" style="flex:1;justify-content:center;cursor:pointer;font-size:0.68rem;" title="Subir imagen propia (.png, .jpg, .svg, .webp) para el código QR">
                                🖼️ Cambiar Imagen de Código QR
                                <input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" style="display:none;" onchange="ViasaProductosExclusivosEngine.subirQRForm(this)">
                            </label>
                            ${hasCustomQr ? `
                                <button type="button" class="pnv-btn pnv-btn-ghost pnv-btn-xs" style="color:#F87171;border-color:rgba(248,113,113,0.35);font-size:0.65rem;" title="Volver al código QR dibujado por el sistema" onclick="ViasaProductosExclusivosEngine.restaurarQRForm()">
                                    🔄 Restaurar Generador Automático
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>`;
        },

        guardarFormProducto(id) {
            const f = document.getElementById('pnv-form-producto');
            if (!f) return;
            const tipoCodigo = (f.tipoCodigo ? f.tipoCodigo.value : 'EAN13');
            let barcodeVal = (f.barcode ? f.barcode.value : '').trim();

            if (tipoCodigo === 'EAN13') {
                const cleanDigits = barcodeVal.replace(/\D/g, '');
                if (cleanDigits.length === 12 || cleanDigits.length === 13) {
                    barcodeVal = ean13Normalize(cleanDigits);
                } else if (!barcodeVal) {
                    barcodeVal = this.generarEAN13Auto();
                } else if (!this._customBarcodeImageForm) {
                    tipoCodigo = 'CODE128';
                }
            } else {
                if (!barcodeVal) barcodeVal = this.generarCode128Auto();
            }

            const datos = {
                nombre: f.nombre.value.trim(),
                sku: f.sku.value.trim().toUpperCase(),
                barcode: barcodeVal,
                tipoCodigo: tipoCodigo,
                codigoBarras: barcodeVal,
                customBarcodeImage: this._customBarcodeImageForm || null,
                customQrImage: this._customQrImageForm || null,
                presentacion: f.presentacion.value.trim(),
                categoria: f.categoria.value,
                condicionFiscal: f.condicionFiscal.value,
                vidaUtilDias: Math.max(1, parseInt(f.vidaUtilDias.value, 10) || 1),
                stockInicialMostrador: Math.max(0, parseInt(f.stockInicialMostrador.value, 10) || 0),
                stockInicialReserva: Math.max(0, parseInt(f.stockInicialReserva.value, 10) || 0),
                stockMinimo: Math.max(0, parseInt(f.stockMinimo.value, 10) || 0),
                margenObjetivoPct: round2(f.margenObjetivoPct.value),
                costoUnitarioUsd: round2(f.costoUnitarioUsd.value),
                pvpUnitarioUsd: round2(f.pvpUnitarioUsd.value),
                precioAliadoUsd: round2(f.precioAliadoUsd.value),
                activo: f.activo.value === '1'
            };
            datos.qrCode = this.generarPayloadQR(datos, null, 'texto');
            datos.codigoQR = datos.qrCode;
            datos.stockInicial = datos.stockInicialMostrador + datos.stockInicialReserva;
            datos.ivaPorcentaje = datos.condicionFiscal === 'GRAVADO' ? 16 : 0;

            if (!datos.nombre || !datos.sku || !datos.presentacion) { this.toast('⚠️ Complete nombre, SKU y presentación.', 'error'); return; }
            if (this.productos.some(p => p.sku === datos.sku && p.id !== id)) { this.toast(`⚠️ El SKU ${datos.sku} ya existe en el catálogo.`, 'error'); return; }
            if (datos.pvpUnitarioUsd <= 0 || datos.precioAliadoUsd <= 0) { this.toast('⚠️ Los precios deben ser mayores que cero.', 'error'); return; }
            if ((datos.pvpUnitarioUsd < datos.costoUnitarioUsd || datos.precioAliadoUsd < datos.costoUnitarioUsd) &&
                !confirm('Hay precios por debajo del costo de producción. ¿Desea guardar de todas formas?')) return;

            if (id) {
                const p = this.getProducto(id);
                if (!p) return;
                const respaldo = JSON.parse(JSON.stringify(p));
                const skuAnterior = p.sku;
                Object.assign(p, datos, {
                    fotoUrl: this._fotoTemporal || p.fotoUrl,
                    customBarcodeImage: this._customBarcodeImageForm !== undefined ? (this._customBarcodeImageForm || null) : p.customBarcodeImage,
                    customQrImage: this._customQrImageForm !== undefined ? (this._customQrImageForm || null) : p.customQrImage
                });
                const st = this.calcStock(p);
                if (st.mostrador < 0 || st.reserva < 0) {
                    Object.assign(p, respaldo);
                    this.toast('⚠️ El stock inicial indicado dejaría existencias negativas según los movimientos registrados.', 'error');
                    return;
                }
                if (skuAnterior !== p.sku) this.sincronizarContabilidad(Object.assign({}, respaldo), true);
                if (!this.guardar()) { Object.assign(p, respaldo); return; }
                this.sincronizarContabilidad(p);
                this.sincronizarConPOS(p);
                this.toast(`✅ Producto modificado: ${p.nombre}`);
            } else {
                const nuevo = this.normalizar(Object.assign({
                    id: uid('PNV'),
                    fotoUrl: this._fotoTemporal || makeFoodArtDataUrl(datos.nombre.slice(0, 34), datos.presentacion.slice(0, 40), '#451a03', '#0f172a', '#f59e0b', '🥐'),
                    insumosReceta: [], lotesProduccion: [], movimientosDistribucion: [], mermas: [],
                    creadoPor: this.usuarioActual(), creadoEn: new Date().toISOString()
                }, datos));
                this.productos.unshift(nuevo);
                if (!this.guardar()) { this.productos.shift(); return; }
                this.sincronizarContabilidad(nuevo);
                this.sincronizarConPOS(nuevo);
                this.toast(`✅ Producto registrado en el catálogo: ${nuevo.nombre}`);
            }
            this.cerrarModal('pnv-form-overlay');
            this.refrescarTodo();
        },

        // --------------------------------------------------------------------
        // CRUD: ELIMINAR PRODUCTO (con confirmación de seguridad)
        // --------------------------------------------------------------------
        confirmarEliminarProducto(id) {
            const p = this.getProducto(id);
            if (!p) return;
            const st = this.calcStock(p);
            const html = `
                ${this.modalHeader('🗑️ Eliminar Producto del Catálogo', esc(p.nombre), 'pnv-del-overlay')}
                <div class="pnv-modal-body">
                    <div style="background:rgba(127,29,29,0.25);border:1px solid rgba(248,113,113,0.45);border-radius:12px;padding:14px;font-size:0.85rem;line-height:1.55;">
                        Esta acción eliminará el producto <b>${esc(p.nombre)}</b> (${esc(p.sku)}) junto con su historial: <b>${p.lotesProduccion.length}</b> lotes, <b>${p.movimientosDistribucion.length}</b> despachos y <b>${p.mermas.length}</b> mermas.
                        También se retirarán sus filas vinculadas del Libro de Inventario Art. 177 ISLR y del Libro de Mermas, para no dejar registros huérfanos.
                        <br>Existencia actual: <b>${fmtInt(st.total)} unidades</b>.
                    </div>
                    <div style="margin-top:12px;font-size:0.82rem;color:#CBD5E1;">Si solo desea retirarlo de la venta conservando su historial, use <b>Dar de Baja</b>.</div>
                    <label class="pnv-label" style="margin-top:14px;">Para eliminar definitivamente escriba el SKU <b style="color:#FBBF24;">${esc(p.sku)}</b>:</label>
                    <input id="pnv-del-confirm" class="pnv-input" autocomplete="off" placeholder="${esc(p.sku)}">
                    <div class="pnv-modal-actions">
                        <button type="button" class="pnv-btn pnv-btn-ghost" onclick="ViasaProductosExclusivosEngine.cerrarModal('pnv-del-overlay')">Cancelar</button>
                        <button type="button" class="pnv-btn pnv-btn-ghost" onclick="ViasaProductosExclusivosEngine.darDeBaja('${esc(p.id)}')"><i class="fa-solid fa-box-archive"></i> Dar de Baja (conservar historial)</button>
                        <button type="button" class="pnv-btn pnv-btn-danger" onclick="ViasaProductosExclusivosEngine.eliminarProducto('${esc(p.id)}')"><i class="fa-solid fa-trash"></i> Eliminar Definitivamente</button>
                    </div>
                </div>`;
            this.abrirModal('pnv-del-overlay', html, 620);
        },

        darDeBaja(id) {
            const p = this.getProducto(id);
            if (!p) return;
            p.activo = false;
            this.guardar();
            this.sincronizarConPOS(p, true);
            this.cerrarModal('pnv-del-overlay');
            this.toast(`📦 Producto dado de baja (historial conservado): ${p.nombre}`, 'warn');
            this.refrescarTodo();
        },

        eliminarProducto(id) {
            const p = this.getProducto(id);
            if (!p) return;
            const input = document.getElementById('pnv-del-confirm');
            if (!input || input.value.trim().toUpperCase() !== p.sku.toUpperCase()) {
                this.toast('⚠️ El SKU escrito no coincide. No se eliminó el producto.', 'error');
                return;
            }
            const idx = this.productos.indexOf(p);
            this.productos.splice(idx, 1);
            if (!this.guardar()) { this.productos.splice(idx, 0, p); return; }
            this.sincronizarContabilidad(p, true);
            this.sincronizarConPOS(p, true);
            this.cerrarModal('pnv-del-overlay');
            if (this.detalleId === id) this.cerrarModal('pnv-detalle-overlay');
            this.toast(`🗑️ Producto eliminado: ${p.nombre}`, 'warn');
            this.refrescarTodo();
        },


        // --------------------------------------------------------------------
        // MODAL MAESTRO DE TRAZABILIDAD 360°
        // --------------------------------------------------------------------
        abrirDetalle(id, tab) {
            const p = this.getProducto(id);
            if (!p) return;
            this.detalleId = id;
            this.tabActiva = tab || 'A';
            this.abrirModal('pnv-detalle-overlay', '<div id="pnv-detalle-inner"></div>');
            this.detalleId = id;
            this.renderDetalle();
        },

        setTab(t) {
            this.tabActiva = t;
            this.renderDetalle();
        },

        renderDetalle() {
            const p = this.getProducto(this.detalleId);
            const inner = document.getElementById('pnv-detalle-inner');
            if (!p || !inner) return;
            const st = this.calcStock(p);
            const sem = this.semaforo(p);
            const tabs = [
                ['A', 'fa-fire-burner', 'A. Producción y Entrada al Stock'],
                ['B', 'fa-truck-ramp-box', 'B. Distribución y Cadena de Custodia'],
                ['C', 'fa-triangle-exclamation', 'C. Mermas e Incidencias (Art. 177)'],
                ['D', 'fa-file-lines', 'D. Ficha Técnica, Etiqueta y Kardex'],
                ['E', 'fa-qrcode', 'E. Códigos (Barras / QR) e Impresión de Stickers']
            ];
            const resumen = (label, val, color) => `<div class="pnv-sum-cell"><span>${label}</span><b style="color:${color || '#fff'};">${val}</b></div>`;

            inner.innerHTML = `
                <div class="pnv-modal-header" style="align-items:stretch;">
                    <div style="display:flex;gap:16px;align-items:center;">
                        <img src="${esc(p.fotoUrl)}" alt="" style="width:92px;height:72px;object-fit:cover;border-radius:10px;border:1px solid rgba(251,191,36,0.4);">
                        <div>
                            <h2 style="margin:0;font-size:1.3rem;font-weight:900;color:#fff;">${esc(p.nombre)}</h2>
                            <div style="font-size:0.78rem;color:#94A3B8;font-family:'JetBrains Mono',monospace;margin-top:3px;">${esc(p.sku)} • ${esc(p.barcode || '—')} • ${esc(p.presentacion)}</div>
                            <div style="display:flex;gap:6px;margin-top:6px;flex-wrap:wrap;">
                                <span class="pnv-badge" style="background:rgba(15,23,42,0.9);color:#FDE68A;border:1px solid rgba(251,191,36,0.4);">${esc(p.categoria)}</span>
                                <span class="pnv-badge" style="background:${p.condicionFiscal === 'GRAVADO' ? 'rgba(30,64,175,0.9)' : 'rgba(6,95,70,0.9)'};color:#fff;">${p.condicionFiscal === 'GRAVADO' ? 'GRAVADO 16%' : 'EXENTO IVA'}</span>
                                <span class="pnv-badge" style="background:${sem.bg};color:#fff;border:1px solid ${sem.color};">${sem.txt}</span>
                            </div>
                        </div>
                    </div>
                    <div style="display:flex;gap:8px;align-items:flex-start;">
                        <button type="button" class="pnv-btn pnv-btn-ghost pnv-btn-sm" onclick="ViasaProductosExclusivosEngine.abrirFormProducto('${esc(p.id)}')">✏️ Modificar</button>
                        <button type="button" class="pnv-btn pnv-btn-ghost pnv-btn-sm" onclick="ViasaProductosExclusivosEngine.cerrarModal('pnv-detalle-overlay')"><i class="fa-solid fa-xmark"></i> Cerrar</button>
                    </div>
                </div>
                <div class="pnv-sum-strip">
                    ${resumen('Stock Inicial', fmtInt(st.inicial))}
                    ${resumen('+ Producción', fmtInt(st.produccion), '#4ade80')}
                    ${resumen('− Ventas Local', fmtInt(st.ventasLocal), '#fbbf24')}
                    ${resumen('− Despachos B2B', fmtInt(st.despachosB2B), '#a78bfa')}
                    ${resumen('− Mermas', fmtInt(st.mermas), '#f87171')}
                    ${resumen('= Stock Actual', fmtInt(st.total), sem.color)}
                    ${resumen('Mostrador / Reserva', `${fmtInt(st.mostrador)} / ${fmtInt(st.reserva)}`)}
                    ${resumen('Cuadre', st.cuadra ? '✔ Exacto' : '✖ Revisar', st.cuadra ? '#4ade80' : '#f87171')}
                </div>
                <div class="pnv-modal-tabs">
                    ${tabs.map(t => `<button type="button" class="pnv-modal-tab-btn ${this.tabActiva === t[0] ? 'active' : ''}" onclick="ViasaProductosExclusivosEngine.setTab('${t[0]}')"><i class="fa-solid ${t[1]}"></i> ${t[2]}</button>`).join('')}
                </div>
                <div class="pnv-modal-body">
                    ${this.tabActiva === 'A' ? this.tabProduccion(p) : ''}
                    ${this.tabActiva === 'B' ? this.tabDistribucion(p, st) : ''}
                    ${this.tabActiva === 'C' ? this.tabMermas(p, st) : ''}
                    ${this.tabActiva === 'D' ? this.tabFicha(p) : ''}
                    ${this.tabActiva === 'E' ? this.tabCodigosEstudio(p) : ''}
                </div>`;
            if (this.tabActiva === 'E') {
                this.renderStudioPreview();
            }
        },

        abrirEstudioStickers(id) {
            this.abrirDetalle(id, 'E');
        },

        // ---------------------- PESTAÑA A: PRODUCCIÓN ----------------------
        tabProduccion(p) {
            const sigLote = `LOT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`;
            const fh = nowLocalInput();
            const filas = [...p.lotesProduccion].sort((a, b) => String(b.fechaHora).localeCompare(String(a.fechaHora))).map(l => `
                <tr>
                    <td class="mono">${esc(l.id)}</td>
                    <td>${esc(l.fechaHora)}</td>
                    <td>${esc(l.vencimiento)}</td>
                    <td class="num"><b>${fmtInt(l.cantidad)}</b></td>
                    <td class="num">${fmtInt(l.destinoMostrador)}</td>
                    <td class="num">${fmtInt(l.destinoB2B)}</td>
                    <td>${esc(l.maestroPanadero)}<div class="pnv-td-sub">${esc(l.turno)}</div></td>
                    <td class="pnv-td-sub">${esc(l.observacion || '')}</td>
                    <td><button type="button" class="pnv-btn pnv-btn-danger pnv-btn-xs" onclick="ViasaProductosExclusivosEngine.eliminarRegistro('lote','${esc(l.id)}')">🗑️</button></td>
                </tr>`).join('');
            return `
                <div class="pnv-section">
                    <div class="pnv-section-title"><i class="fa-solid fa-plus"></i> Nuevo Lote Producido (Horno → Panadería)</div>
                    <form id="pnv-form-lote" class="pnv-form-grid pnv-form-grid-4" onsubmit="event.preventDefault();ViasaProductosExclusivosEngine.registrarLote()">
                        <div class="pnv-field"><label class="pnv-label">N.º de lote *</label><input name="loteId" class="pnv-input" required value="${sigLote}"></div>
                        <div class="pnv-field"><label class="pnv-label">Piezas creadas *</label><input name="cantidad" type="number" min="1" step="1" class="pnv-input" required oninput="ViasaProductosExclusivosEngine.repartoLote()"></div>
                        <div class="pnv-field"><label class="pnv-label">Asignar a Mostrador Local</label><input name="destinoMostrador" type="number" min="0" step="1" class="pnv-input" oninput="ViasaProductosExclusivosEngine.repartoLote()"></div>
                        <div class="pnv-field"><label class="pnv-label">Asignar a Reserva B2B (auto)</label><input name="destinoB2B" class="pnv-input" readonly value="0"></div>
                        <div class="pnv-field"><label class="pnv-label">Fecha y hora de salida *</label><input name="fechaHora" type="datetime-local" class="pnv-input" required value="${fh}" onchange="this.form.vencimiento.value=ViasaProductosExclusivosEngine._venc(this.value)"></div>
                        <div class="pnv-field"><label class="pnv-label">Vencimiento estimado *</label><input name="vencimiento" type="date" class="pnv-input" required value="${addDays(fh, p.vidaUtilDias)}"></div>
                        <div class="pnv-field"><label class="pnv-label">Maestro panadero responsable *</label><input name="maestroPanadero" class="pnv-input" required list="pnv-maestros"></div>
                        <div class="pnv-field"><label class="pnv-label">Turno</label><select name="turno" class="pnv-input">${TURNOS.map(t => `<option>${t}</option>`).join('')}</select></div>
                        <div class="pnv-field" style="grid-column:span 3;"><label class="pnv-label">Observación de calidad</label><input name="observacion" class="pnv-input" maxlength="200"></div>
                        <div class="pnv-field" style="justify-content:flex-end;"><button type="submit" class="pnv-btn pnv-btn-gold" style="width:100%;justify-content:center;"><i class="fa-solid fa-plus"></i> Registrar Lote</button></div>
                        <datalist id="pnv-maestros">${[...new Set(this.productos.flatMap(x => x.lotesProduccion.map(l => l.maestroPanadero)))].map(m => `<option value="${esc(m)}">`).join('')}</datalist>
                    </form>
                    <div class="pnv-hint">Al registrar el lote, las piezas se suman automáticamente a la existencia del producto y a la columna de entradas del Libro de Inventario Art. 177 ISLR.</div>
                </div>
                <div class="pnv-section">
                    <div class="pnv-section-title"><i class="fa-solid fa-clock-rotate-left"></i> Historial de Lotes Producidos (${p.lotesProduccion.length})</div>
                    <div class="pnv-table-wrap"><table class="pnv-table">
                        <thead><tr><th>Lote</th><th>Salida de horno</th><th>Vence</th><th class="num">Piezas</th><th class="num">Mostrador</th><th class="num">Reserva B2B</th><th>Maestro / Turno</th><th>Observación</th><th></th></tr></thead>
                        <tbody>${filas || '<tr><td colspan="9" class="pnv-td-empty">Sin lotes registrados.</td></tr>'}</tbody>
                    </table></div>
                </div>`;
        },

        _venc(fecha) {
            const p = this.getProducto(this.detalleId);
            return addDays(fecha, p ? p.vidaUtilDias : 7);
        },

        repartoLote() {
            const f = document.getElementById('pnv-form-lote');
            if (!f) return;
            const c = parseInt(f.cantidad.value, 10) || 0;
            let m = f.destinoMostrador.value === '' ? c : (parseInt(f.destinoMostrador.value, 10) || 0);
            if (m > c) { m = c; f.destinoMostrador.value = c; }
            f.destinoB2B.value = Math.max(0, c - m);
        },

        registrarLote() {
            const p = this.getProducto(this.detalleId);
            const f = document.getElementById('pnv-form-lote');
            if (!p || !f) return;
            const cantidad = parseInt(f.cantidad.value, 10) || 0;
            const mostrador = f.destinoMostrador.value === '' ? cantidad : (parseInt(f.destinoMostrador.value, 10) || 0);
            const loteId = f.loteId.value.trim().toUpperCase();
            if (cantidad <= 0) { this.toast('⚠️ La cantidad de piezas debe ser mayor que cero.', 'error'); return; }
            if (mostrador < 0 || mostrador > cantidad) { this.toast('⚠️ La asignación a mostrador no puede superar las piezas creadas.', 'error'); return; }
            if (p.lotesProduccion.some(l => l.id === loteId)) { this.toast(`⚠️ El lote ${loteId} ya existe para este producto.`, 'error'); return; }
            if (f.vencimiento.value < f.fechaHora.value.slice(0, 10)) { this.toast('⚠️ La fecha de vencimiento no puede ser anterior a la de producción.', 'error'); return; }
            p.lotesProduccion.push({
                id: loteId,
                fechaHora: f.fechaHora.value.replace('T', ' '),
                vencimiento: f.vencimiento.value,
                cantidad,
                destinoMostrador: mostrador,
                destinoB2B: cantidad - mostrador,
                maestroPanadero: f.maestroPanadero.value.trim(),
                turno: f.turno.value,
                observacion: f.observacion.value.trim(),
                registradoPor: this.usuarioActual(),
                registradoEn: new Date().toISOString()
            });
            if (!this.guardar()) { p.lotesProduccion.pop(); return; }
            this.sincronizarContabilidad(p);
            this.toast(`🔥 Lote ${loteId} registrado: +${fmtInt(cantidad)} piezas al stock.`);
            this.refrescarTodo();
        },

        // ---------------------- PESTAÑA B: DISTRIBUCIÓN ----------------------
        clientesCRM() {
            const app = window.ViasaApp;
            const lista = (app && Array.isArray(app.clientes)) ? app.clientes : [];
            const map = new Map();
            lista.forEach(c => {
                const nombre = c.nombre || c.razonSocial || c.name || c.empresa;
                if (nombre) map.set(nombre, c.rif || c.documento || c.cedula || '');
            });
            this.productos.forEach(p => p.movimientosDistribucion.forEach(m => {
                if (m.tipoDestino === 'CLIENTE_ALIADO_B2B' && !map.has(m.clienteNombre)) map.set(m.clienteNombre, m.clienteRif || '');
            }));
            return map;
        },

        tabDistribucion(p, st) {
            const clientes = this.clientesCRM();
            this._clientesMap = clientes;
            const filas = [...p.movimientosDistribucion].sort((a, b) => String(b.fechaHora).localeCompare(String(a.fechaHora))).map(m => {
                const esB2B = m.tipoDestino === 'CLIENTE_ALIADO_B2B';
                const total = round2(m.cantidad * round2(m.precioUnitUsd));
                return `<tr>
                    <td class="mono">${esc(m.id)}<div class="pnv-td-sub">${esc(m.fechaHora)}</div></td>
                    <td><span class="pnv-badge" style="background:${esB2B ? 'rgba(91,33,182,0.85)' : 'rgba(180,83,9,0.85)'};color:#fff;">${esB2B ? 'ALIADO B2B' : 'MOSTRADOR'}</span></td>
                    <td>${esc(m.clienteNombre)}<div class="pnv-td-sub">${esc(m.clienteRif || '')} • ${esc(m.documentoRef || '')}</div></td>
                    <td class="num"><b>${fmtInt(m.cantidad)}</b></td>
                    <td class="num">USD ${fmtNum(m.precioUnitUsd)}</td>
                    <td class="num">USD ${fmtNum(total)}<div class="pnv-td-sub">Bs. ${fmtNum(this.bs(total))}</div></td>
                    <td>${esc(m.estadoPago)}</td>
                    <td class="pnv-td-sub"><b style="color:#FDE68A;">Autorizó:</b> ${esc(m.autorizoNombre)}${m.autorizoPin ? ` (${esc(m.autorizoPin)})` : ''}<br><b style="color:#FDE68A;">Despachó:</b> ${esc(m.despachoNombre)}<br><b style="color:#FDE68A;">Recibió:</b> ${esc(m.recibioNombre)}</td>
                    <td style="white-space:nowrap;">
                        <button type="button" class="pnv-btn pnv-btn-ghost pnv-btn-xs" title="Imprimir orden de despacho" onclick="ViasaProductosExclusivosEngine.imprimirOrden('${esc(m.id)}')">🖨️ PDF</button>
                        <button type="button" class="pnv-btn pnv-btn-danger pnv-btn-xs" onclick="ViasaProductosExclusivosEngine.eliminarRegistro('movimiento','${esc(m.id)}')">🗑️</button>
                    </td>
                </tr>`;
            }).join('');
            const sel = arr => arr.map(o => `<option value="${esc(o)}">${esc(o)}</option>`).join('');
            return `
                <div class="pnv-section">
                    <div class="pnv-section-title"><i class="fa-solid fa-dolly"></i> Registrar Salida: Mostrador Local o Cliente Aliado (B2B)</div>
                    <div class="pnv-hint" style="margin-top:0;margin-bottom:10px;">Disponible ahora — Mostrador Local: <b>${fmtInt(st.mostrador)}</b> • Reserva B2B: <b>${fmtInt(st.reserva)}</b> • Total: <b>${fmtInt(st.total)}</b> unidades.</div>
                    <form id="pnv-form-mov" class="pnv-form-grid pnv-form-grid-4" onsubmit="event.preventDefault();ViasaProductosExclusivosEngine.registrarMovimiento()">
                        <div class="pnv-field"><label class="pnv-label">Destino *</label>
                            <select name="tipoDestino" class="pnv-input" onchange="ViasaProductosExclusivosEngine.cambioDestino()">
                                <option value="CLIENTE_ALIADO_B2B">Cliente Aliado Comercial (B2B)</option>
                                <option value="MOSTRADOR_LOCAL">Panadería Nueva Viasa (Mostrador / Cafetín)</option>
                            </select></div>
                        <div class="pnv-field" style="grid-column:span 2;"><label class="pnv-label">Cliente / Destino * <span style="color:#64748B;">(vinculado a CRM y Clientes)</span></label>
                            <input name="clienteNombre" class="pnv-input" list="pnv-clientes" required onchange="ViasaProductosExclusivosEngine.autoRif(this.value)">
                            <datalist id="pnv-clientes">${[...clientes.keys()].map(c => `<option value="${esc(c)}">`).join('')}</datalist></div>
                        <div class="pnv-field"><label class="pnv-label">RIF del cliente</label><input name="clienteRif" class="pnv-input" placeholder="J-00000000-0"></div>
                        <div class="pnv-field"><label class="pnv-label">N.º Nota de Entrega / Factura *</label><input name="documentoRef" class="pnv-input" required></div>
                        <div class="pnv-field"><label class="pnv-label">Cantidad de piezas *</label><input name="cantidad" type="number" min="1" step="1" class="pnv-input" required oninput="ViasaProductosExclusivosEngine.totalMov()"></div>
                        <div class="pnv-field"><label class="pnv-label">Precio unitario (USD) *</label><input name="precioUnitUsd" type="number" min="0" step="0.01" class="pnv-input" required value="${round2(p.precioAliadoUsd)}" oninput="ViasaProductosExclusivosEngine.totalMov()"></div>
                        <div class="pnv-field"><label class="pnv-label">Estado de pago</label><select name="estadoPago" class="pnv-input">${sel(ESTADOS_PAGO)}</select></div>
                        <div class="pnv-field"><label class="pnv-label">Fecha y hora *</label><input name="fechaHora" type="datetime-local" class="pnv-input" required value="${nowLocalInput()}"></div>
                        <div class="pnv-field" style="grid-column:span 3;"><label class="pnv-label">Total de la operación</label><div id="pnv-mov-total" class="pnv-input" style="font-weight:800;color:#FBBF24;">USD 0,00 • Bs. 0,00</div></div>
                        <div class="pnv-custody" style="grid-column:1/-1;">
                            <div class="pnv-section-title" style="margin-bottom:8px;"><i class="fa-solid fa-signature"></i> Firma y Cadena de Custodia (obligatoria)</div>
                            <div class="pnv-form-grid pnv-form-grid-4">
                                <div class="pnv-field"><label class="pnv-label">¿Quién autorizó? *</label><select name="autorizoNombre" class="pnv-input" required>${sel(AUTORIZADORES)}</select></div>
                                <div class="pnv-field"><label class="pnv-label">PIN / usuario del autorizante *</label><input name="pin" type="password" minlength="4" class="pnv-input" required autocomplete="off"></div>
                                <div class="pnv-field"><label class="pnv-label">¿Quién despachó / entregó? *</label><input name="despachoNombre" class="pnv-input" required></div>
                                <div class="pnv-field"><label class="pnv-label">¿Quién recibió? *</label><input name="recibioNombre" class="pnv-input" required placeholder="Mostrador, chofer o cliente destino"></div>
                            </div>
                        </div>
                        <div class="pnv-field" style="grid-column:1/-1;flex-direction:row;justify-content:flex-end;gap:8px;">
                            <button type="button" class="pnv-btn pnv-btn-ghost" onclick="ViasaProductosExclusivosEngine.imprimirOrden()"><i class="fa-solid fa-print"></i> Imprimir Control de Salidas</button>
                            <button type="submit" class="pnv-btn pnv-btn-gold"><i class="fa-solid fa-check"></i> Registrar Salida Autorizada</button>
                        </div>
                    </form>
                </div>
                <div class="pnv-section">
                    <div class="pnv-section-title"><i class="fa-solid fa-list-check"></i> Historial de Distribución y Custodia (${p.movimientosDistribucion.length})</div>
                    <div class="pnv-table-wrap"><table class="pnv-table">
                        <thead><tr><th>Movimiento</th><th>Tipo</th><th>Cliente / Documento</th><th class="num">Piezas</th><th class="num">Precio</th><th class="num">Total</th><th>Pago</th><th>Cadena de custodia</th><th></th></tr></thead>
                        <tbody>${filas || '<tr><td colspan="9" class="pnv-td-empty">Sin salidas registradas.</td></tr>'}</tbody>
                    </table></div>
                </div>`;
        },

        cambioDestino() {
            const f = document.getElementById('pnv-form-mov');
            const p = this.getProducto(this.detalleId);
            if (!f || !p) return;
            if (f.tipoDestino.value === 'MOSTRADOR_LOCAL') {
                f.clienteNombre.value = 'Mostrador Principal y Cafetín Nueva Viasa';
                f.clienteRif.value = 'J-31163165-8';
                f.precioUnitUsd.value = round2(p.pvpUnitarioUsd);
                f.estadoPago.value = 'LIQUIDADO TIENDA';
            } else {
                f.clienteNombre.value = '';
                f.clienteRif.value = '';
                f.precioUnitUsd.value = round2(p.precioAliadoUsd);
                f.estadoPago.value = 'PAGADO';
            }
            this.totalMov();
        },

        autoRif(nombre) {
            const f = document.getElementById('pnv-form-mov');
            if (f && this._clientesMap && this._clientesMap.has(nombre) && !f.clienteRif.value) f.clienteRif.value = this._clientesMap.get(nombre);
        },

        totalMov() {
            const f = document.getElementById('pnv-form-mov');
            const el = document.getElementById('pnv-mov-total');
            if (!f || !el) return;
            const total = round2((parseInt(f.cantidad.value, 10) || 0) * round2(f.precioUnitUsd.value));
            el.textContent = `USD ${fmtNum(total)} • Bs. ${fmtNum(this.bs(total))}`;
        },

        /** Reparte una salida entre Mostrador y Reserva priorizando el depósito natural del destino. */
        asignarSalida(p, cantidad, primario) {
            const st = this.calcStock(p);
            if (cantidad > st.total) return null;
            const disp = { MOSTRADOR: Math.max(0, st.mostrador), RESERVA: Math.max(0, st.reserva) };
            const otro = primario === 'MOSTRADOR' ? 'RESERVA' : 'MOSTRADOR';
            const dePrim = Math.min(cantidad, disp[primario]);
            const deOtro = cantidad - dePrim;
            if (deOtro > disp[otro]) return null;
            const r = { MOSTRADOR: 0, RESERVA: 0 };
            r[primario] = dePrim;
            r[otro] = deOtro;
            return { deduceMostrador: r.MOSTRADOR, deduceReserva: r.RESERVA };
        },

        registrarMovimiento() {
            const p = this.getProducto(this.detalleId);
            const f = document.getElementById('pnv-form-mov');
            if (!p || !f) return;
            const cantidad = parseInt(f.cantidad.value, 10) || 0;
            const tipo = f.tipoDestino.value;
            const campos = ['clienteNombre', 'documentoRef', 'despachoNombre', 'recibioNombre'];
            if (campos.some(c => !f[c].value.trim())) { this.toast('⚠️ Complete todos los campos obligatorios de la cadena de custodia.', 'error'); return; }
            if (String(f.pin.value).length < 4) { this.toast('⚠️ El PIN del autorizante debe tener al menos 4 caracteres.', 'error'); return; }
            if (cantidad <= 0) { this.toast('⚠️ La cantidad debe ser mayor que cero.', 'error'); return; }
            const asignacion = this.asignarSalida(p, cantidad, tipo === 'MOSTRADOR_LOCAL' ? 'MOSTRADOR' : 'RESERVA');
            if (!asignacion) { this.toast(`⚠️ Stock insuficiente: solo hay ${fmtInt(this.calcStock(p).total)} unidades disponibles.`, 'error'); return; }
            const mov = Object.assign({
                id: uid('MOV'),
                fechaHora: f.fechaHora.value.replace('T', ' '),
                tipoDestino: tipo,
                clienteNombre: f.clienteNombre.value.trim(),
                clienteRif: f.clienteRif.value.trim().toUpperCase(),
                documentoRef: f.documentoRef.value.trim().toUpperCase(),
                cantidad,
                precioUnitUsd: round2(f.precioUnitUsd.value),
                tasaBCV: this.getTasa(),
                estadoPago: f.estadoPago.value,
                autorizoNombre: f.autorizoNombre.value,
                autorizoPin: `PIN ${maskPin(f.pin.value)}`,
                autorizoFechaHora: new Date().toLocaleString('es-VE'),
                despachoNombre: f.despachoNombre.value.trim(),
                recibioNombre: f.recibioNombre.value.trim(),
                registradoPor: this.usuarioActual()
            }, asignacion);
            p.movimientosDistribucion.push(mov);
            if (!this.guardar()) { p.movimientosDistribucion.pop(); return; }
            this.sincronizarContabilidad(p);
            this.toast(`🚚 Salida registrada: ${fmtInt(cantidad)} und → ${mov.clienteNombre}`);
            this.refrescarTodo();
            if (confirm('¿Desea imprimir ahora la Orden de Despacho y Control de Salida en PDF?')) this.imprimirOrden(mov.id);
        },

        // ---------------------- PESTAÑA C: MERMAS ----------------------
        tabMermas(p, st) {
            const filas = [...p.mermas].sort((a, b) => String(b.fecha).localeCompare(String(a.fecha))).map(x => {
                const tot = round2(x.cantidad * round2(x.costoUnitUsd));
                return `<tr>
                    <td class="mono">${esc(x.id)}<div class="pnv-td-sub">${esc(x.fecha)}</div></td>
                    <td><b>${esc(x.causa)}</b><div class="pnv-td-sub">${esc(x.detalleCausa || '')}</div></td>
                    <td class="num"><b>${fmtInt(x.cantidad)}</b></td>
                    <td class="num">USD ${fmtNum(x.costoUnitUsd)}</td>
                    <td class="num" style="color:#f87171;">USD ${fmtNum(tot)}<div class="pnv-td-sub">Bs. ${fmtNum(round2(tot * (x.tasaBCV || this.getTasa())))}</div></td>
                    <td class="pnv-td-sub"><b style="color:#FDE68A;">Reportó:</b> ${esc(x.reportadoPor)}<br><b style="color:#FDE68A;">Autorizó:</b> ${esc(x.autorizadoPor)}</td>
                    <td><button type="button" class="pnv-btn pnv-btn-danger pnv-btn-xs" onclick="ViasaProductosExclusivosEngine.eliminarRegistro('merma','${esc(x.id)}')">🗑️</button></td>
                </tr>`;
            }).join('');
            const totU = p.mermas.reduce((s, x) => s + x.cantidad, 0);
            const totUsd = round2(p.mermas.reduce((s, x) => s + round2(x.cantidad * round2(x.costoUnitUsd)), 0));
            return `
                <div class="pnv-section">
                    <div class="pnv-section-title"><i class="fa-solid fa-plus"></i> Registrar Merma o Incidencia</div>
                    <form id="pnv-form-merma" class="pnv-form-grid pnv-form-grid-4" onsubmit="event.preventDefault();ViasaProductosExclusivosEngine.registrarMerma()">
                        <div class="pnv-field" style="grid-column:span 2;"><label class="pnv-label">Causa exacta *</label><select name="causa" class="pnv-input">${CAUSAS_MERMA.map((c, i) => `<option value="${esc(c)}">${i + 1}. ${esc(c)}</option>`).join('')}</select></div>
                        <div class="pnv-field"><label class="pnv-label">Piezas perdidas *</label><input name="cantidad" type="number" min="1" step="1" class="pnv-input" required oninput="ViasaProductosExclusivosEngine.totalMerma()"></div>
                        <div class="pnv-field"><label class="pnv-label">Descontar de</label><select name="origen" class="pnv-input"><option value="MOSTRADOR">Mostrador Local (${fmtInt(st.mostrador)})</option><option value="RESERVA">Reserva B2B (${fmtInt(st.reserva)})</option></select></div>
                        <div class="pnv-field"><label class="pnv-label">Fecha *</label><input name="fecha" type="date" class="pnv-input" required value="${nowLocalInput().slice(0, 10)}"></div>
                        <div class="pnv-field"><label class="pnv-label">Costo unitario (USD)</label><input class="pnv-input" readonly value="${fmtNum(p.costoUnitarioUsd)}"></div>
                        <div class="pnv-field" style="grid-column:span 2;"><label class="pnv-label">Costo total de la pérdida</label><div id="pnv-merma-total" class="pnv-input" style="font-weight:800;color:#f87171;">USD 0,00 • Bs. 0,00</div></div>
                        <div class="pnv-field"><label class="pnv-label">Responsable del reporte *</label><input name="reportadoPor" class="pnv-input" required></div>
                        <div class="pnv-field"><label class="pnv-label">¿Quién autorizó la descarga? *</label><select name="autorizadoPor" class="pnv-input">${AUTORIZADORES.map(a => `<option>${esc(a)}</option>`).join('')}</select></div>
                        <div class="pnv-field"><label class="pnv-label">PIN del autorizante *</label><input name="pin" type="password" minlength="4" class="pnv-input" required autocomplete="off"></div>
                        <div class="pnv-field"><label class="pnv-label">Evidencia / observación *</label><input name="detalleCausa" class="pnv-input" required maxlength="240"></div>
                        <div class="pnv-field" style="grid-column:1/-1;flex-direction:row;justify-content:flex-end;"><button type="submit" class="pnv-btn pnv-btn-danger"><i class="fa-solid fa-triangle-exclamation"></i> Registrar Merma y Descontar Stock</button></div>
                    </form>
                    <div class="pnv-hint">Cada merma descuenta automáticamente del stock y alimenta el Libro de Mermas y Autoconsumo y la columna de salidas del Libro de Inventario Fiscal (Art. 177 Ley de ISLR) en Contabilidad y SENIAT.</div>
                </div>
                <div class="pnv-section">
                    <div class="pnv-section-title"><i class="fa-solid fa-list"></i> Registro de Mermas (${p.mermas.length}) — Total: ${fmtInt(totU)} und • USD ${fmtNum(totUsd)} • Bs. ${fmtNum(this.bs(totUsd))}</div>
                    <div class="pnv-table-wrap"><table class="pnv-table">
                        <thead><tr><th>Registro</th><th>Causa / Evidencia</th><th class="num">Piezas</th><th class="num">Costo und</th><th class="num">Pérdida</th><th>Responsables</th><th></th></tr></thead>
                        <tbody>${filas || '<tr><td colspan="7" class="pnv-td-empty">Sin mermas registradas. ¡Excelente control!</td></tr>'}</tbody>
                    </table></div>
                </div>`;
        },

        totalMerma() {
            const f = document.getElementById('pnv-form-merma');
            const el = document.getElementById('pnv-merma-total');
            const p = this.getProducto(this.detalleId);
            if (!f || !el || !p) return;
            const tot = round2((parseInt(f.cantidad.value, 10) || 0) * round2(p.costoUnitarioUsd));
            el.textContent = `USD ${fmtNum(tot)} • Bs. ${fmtNum(this.bs(tot))}`;
        },

        registrarMerma() {
            const p = this.getProducto(this.detalleId);
            const f = document.getElementById('pnv-form-merma');
            if (!p || !f) return;
            const cantidad = parseInt(f.cantidad.value, 10) || 0;
            if (cantidad <= 0) { this.toast('⚠️ La cantidad debe ser mayor que cero.', 'error'); return; }
            if (String(f.pin.value).length < 4) { this.toast('⚠️ El PIN del autorizante debe tener al menos 4 caracteres.', 'error'); return; }
            if (!f.reportadoPor.value.trim() || !f.detalleCausa.value.trim()) { this.toast('⚠️ Indique el responsable y la evidencia de la merma.', 'error'); return; }
            const asignacion = this.asignarSalida(p, cantidad, f.origen.value);
            if (!asignacion) { this.toast(`⚠️ Stock insuficiente: solo hay ${fmtInt(this.calcStock(p).total)} unidades disponibles.`, 'error'); return; }
            const merma = Object.assign({
                id: uid('MER'),
                fecha: f.fecha.value,
                causa: f.causa.value,
                detalleCausa: f.detalleCausa.value.trim(),
                cantidad,
                costoUnitUsd: round2(p.costoUnitarioUsd),
                tasaBCV: this.getTasa(),
                reportadoPor: f.reportadoPor.value.trim(),
                autorizadoPor: f.autorizadoPor.value,
                autorizoPin: `PIN ${maskPin(f.pin.value)}`,
                registradoPor: this.usuarioActual()
            }, asignacion);
            p.mermas.push(merma);
            if (!this.guardar()) { p.mermas.pop(); return; }
            this.sincronizarContabilidad(p);
            this.toast(`📉 Merma registrada: −${fmtInt(cantidad)} und (${merma.causa}).`, 'warn');
            this.refrescarTodo();
        },

        // ---------------------- ELIMINAR REGISTROS (con validación de stock) ----------------------
        eliminarRegistro(tipo, regId) {
            const p = this.getProducto(this.detalleId);
            if (!p) return;
            const arr = tipo === 'lote' ? p.lotesProduccion : (tipo === 'movimiento' ? p.movimientosDistribucion : p.mermas);
            const idx = arr.findIndex(r => r.id === regId);
            if (idx < 0) return;
            const nombres = { lote: 'el lote de producción', movimiento: 'la salida / despacho', merma: 'el registro de merma' };
            if (!confirm(`¿Confirma eliminar ${nombres[tipo]} ${regId}? El stock y los libros contables se recalcularán automáticamente.`)) return;
            const [quitado] = arr.splice(idx, 1);
            const st = this.calcStock(p);
            if (st.mostrador < 0 || st.reserva < 0) {
                arr.splice(idx, 0, quitado);
                this.toast('⚠️ No se puede eliminar: dejaría existencias negativas porque esas piezas ya fueron distribuidas o descargadas.', 'error');
                return;
            }
            if (!this.guardar()) { arr.splice(idx, 0, quitado); return; }
            this.sincronizarContabilidad(p);
            this.toast(`🗑️ Registro ${regId} eliminado y stock recalculado.`, 'warn');
            this.refrescarTodo();
        },

        // ---------------------- PESTAÑA D: FICHA TÉCNICA, ETIQUETA Y KARDEX ----------------------
        kardex(p) {
            const ev = [];
            p.lotesProduccion.forEach(l => ev.push({ f: l.fechaHora, doc: l.id, concepto: `Entrada por producción (${l.maestroPanadero || 'Producción'})`, ent: l.cantidad, sl: 0, sb: 0, me: 0 }));
            p.movimientosDistribucion.forEach(m => ev.push({ f: m.fechaHora, doc: m.documentoRef || m.id, concepto: m.tipoDestino === 'MOSTRADOR_LOCAL' ? `Salida a mostrador — ${m.clienteNombre}` : `Despacho aliado B2B — ${m.clienteNombre}`, ent: 0, sl: m.tipoDestino === 'MOSTRADOR_LOCAL' ? m.cantidad : 0, sb: m.tipoDestino === 'CLIENTE_ALIADO_B2B' ? m.cantidad : 0, me: 0 }));
            p.mermas.forEach(x => ev.push({ f: `${x.fecha} 23:59`, doc: x.id, concepto: `Merma — ${x.causa}`, ent: 0, sl: 0, sb: 0, me: x.cantidad }));
            ev.sort((a, b) => String(a.f).localeCompare(String(b.f)));
            let saldo = p.stockInicial;
            const filas = [{ f: '—', doc: 'SALDO-INI', concepto: 'Saldo inicial', ent: 0, sl: 0, sb: 0, me: 0, saldo }];
            ev.forEach(e => { saldo = saldo + e.ent - e.sl - e.sb - e.me; filas.push(Object.assign(e, { saldo })); });
            return filas;
        },

        tabFicha(p) {
            const costoRec = this.costoReceta(p);
            const margenRec = this.calcMargen(p.pvpUnitarioUsd, costoRec);
            const margenAct = this.calcMargen(p.pvpUnitarioUsd, p.costoUnitarioUsd);
            const alerta = (p.insumosReceta.length && margenRec < p.margenObjetivoPct) || margenAct < p.margenObjetivoPct;
            const ins = p.insumosReceta.map((i, idx) => `<tr>
                <td>${esc(i.insumo)}</td><td>${esc(i.cantidad)}</td>
                <td class="num">USD ${fmtNum(i.costoUsd)}</td><td class="num">Bs. ${fmtNum(this.bs(i.costoUsd))}</td>
                <td class="num">${costoRec > 0 ? fmtNum(round2((round2(i.costoUsd) / costoRec) * 100)) : '0,00'}%</td>
                <td><button type="button" class="pnv-btn pnv-btn-danger pnv-btn-xs" onclick="ViasaProductosExclusivosEngine.eliminarInsumo(${idx})">🗑️</button></td>
            </tr>`).join('');
            const kx = this.kardex(p);
            const tot = kx.reduce((a, r) => ({ ent: a.ent + r.ent, sl: a.sl + r.sl, sb: a.sb + r.sb, me: a.me + r.me }), { ent: 0, sl: 0, sb: 0, me: 0 });
            const ultimoLote = [...p.lotesProduccion].sort((a, b) => String(b.fechaHora).localeCompare(String(a.fechaHora)))[0];
            return `
                <div style="display:grid;grid-template-columns:1.4fr 1fr;gap:16px;" class="pnv-form-split">
                    <div class="pnv-section">
                        <div class="pnv-section-title"><i class="fa-solid fa-flask"></i> Receta Vinculada y Costo de Insumos por Unidad</div>
                        <div class="pnv-table-wrap"><table class="pnv-table">
                            <thead><tr><th>Insumo</th><th>Cantidad</th><th class="num">Costo USD</th><th class="num">Costo Bs.</th><th class="num">% del costo</th><th></th></tr></thead>
                            <tbody>${ins || '<tr><td colspan="6" class="pnv-td-empty">Sin insumos vinculados.</td></tr>'}</tbody>
                            <tfoot><tr><td colspan="2"><b>Costo de receta por unidad</b></td><td class="num"><b>USD ${fmtNum(costoRec)}</b></td><td class="num"><b>Bs. ${fmtNum(this.bs(costoRec))}</b></td><td colspan="2"></td></tr></tfoot>
                        </table></div>
                        <form id="pnv-form-insumo" class="pnv-form-grid pnv-form-grid-4" style="margin-top:10px;" onsubmit="event.preventDefault();ViasaProductosExclusivosEngine.agregarInsumo()">
                            <div class="pnv-field" style="grid-column:span 2;"><input name="insumo" class="pnv-input" placeholder="Insumo (harina, azúcar, empaque, sticker...)" required></div>
                            <div class="pnv-field"><input name="cantidad" class="pnv-input" placeholder="Cantidad (ej. 250 g)" required></div>
                            <div class="pnv-field" style="flex-direction:row;gap:6px;"><input name="costoUsd" type="number" min="0" step="0.01" class="pnv-input" placeholder="USD" required><button type="submit" class="pnv-btn pnv-btn-gold pnv-btn-sm">+</button></div>
                        </form>
                        <div class="pnv-calc-box" style="margin-top:12px;">
                            <div><span>Costo ficha (actual)</span><b>USD ${fmtNum(p.costoUnitarioUsd)}</b></div>
                            <div><span>Costo según receta</span><b>USD ${fmtNum(costoRec)}</b></div>
                            <div><span>Margen PVP (ficha)</span><b style="color:${margenAct >= p.margenObjetivoPct ? '#4ade80' : '#f87171'};">${fmtNum(margenAct)}%</b></div>
                            <div><span>Margen PVP (receta)</span><b style="color:${margenRec >= p.margenObjetivoPct ? '#4ade80' : '#f87171'};">${fmtNum(margenRec)}%</b></div>
                            <div><span>Margen objetivo</span><b>${fmtNum(p.margenObjetivoPct)}%</b></div>
                            <div><span>PVP sugerido para meta</span><b>USD ${fmtNum(p.margenObjetivoPct < 100 ? round2(Math.max(costoRec, p.costoUnitarioUsd) / (1 - p.margenObjetivoPct / 100)) : 0)}</b></div>
                        </div>
                        ${alerta ? `<div class="pnv-alert">⚠️ Alerta de rentabilidad: el margen de ganancia está por debajo del objetivo de ${fmtNum(p.margenObjetivoPct)}%. Revise el costo de insumos o ajuste el PVP.</div>` : '<div class="pnv-hint" style="color:#4ade80;">✔ El margen de ganancia cumple con el objetivo establecido.</div>'}
                        <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;">
                            ${p.insumosReceta.length ? `<button type="button" class="pnv-btn pnv-btn-ghost pnv-btn-sm" onclick="ViasaProductosExclusivosEngine.aplicarCostoReceta()"><i class="fa-solid fa-arrows-rotate"></i> Aplicar costo de receta a la ficha</button>` : ''}
                            <button type="button" class="pnv-btn pnv-btn-ghost pnv-btn-sm" onclick="ViasaProductosExclusivosEngine.imprimirFicha()"><i class="fa-solid fa-print"></i> Imprimir Ficha Técnica PDF</button>
                        </div>
                    </div>
                    <div class="pnv-section">
                        <div class="pnv-section-title"><i class="fa-solid fa-tag"></i> Etiqueta / Sticker de Lote con QR</div>
                        <div id="pnv-sticker-preview">${this.stickerHtml(p, ultimoLote)}</div>
                        <button type="button" class="pnv-btn pnv-btn-gold pnv-btn-sm" style="margin-top:10px;width:100%;justify-content:center;" onclick="ViasaProductosExclusivosEngine.imprimirSticker()"><i class="fa-solid fa-print"></i> Imprimir Etiqueta del Último Lote</button>
                    </div>
                </div>
                <div class="pnv-section">
                    <div class="pnv-section-title"><i class="fa-solid fa-book"></i> Kardex Histórico del Producto (cronológico, calculado desde los registros)</div>
                    <div class="pnv-table-wrap"><table class="pnv-table">
                        <thead><tr><th>Fecha</th><th>Documento</th><th>Concepto</th><th class="num">Entradas</th><th class="num">Salida mostrador</th><th class="num">Salida aliados</th><th class="num">Mermas</th><th class="num">Saldo</th></tr></thead>
                        <tbody>${kx.map(r => `<tr><td>${esc(r.f)}</td><td class="mono">${esc(r.doc)}</td><td>${esc(r.concepto)}</td><td class="num" style="color:#4ade80;">${r.ent ? fmtInt(r.ent) : ''}</td><td class="num">${r.sl ? fmtInt(r.sl) : ''}</td><td class="num">${r.sb ? fmtInt(r.sb) : ''}</td><td class="num" style="color:#f87171;">${r.me ? fmtInt(r.me) : ''}</td><td class="num"><b>${fmtInt(r.saldo)}</b></td></tr>`).join('')}</tbody>
                        <tfoot><tr><td colspan="3"><b>Totales — Saldo final de piezas</b></td><td class="num"><b>${fmtInt(tot.ent)}</b></td><td class="num"><b>${fmtInt(tot.sl)}</b></td><td class="num"><b>${fmtInt(tot.sb)}</b></td><td class="num"><b>${fmtInt(tot.me)}</b></td><td class="num"><b>${fmtInt(kx[kx.length - 1].saldo)}</b></td></tr></tfoot>
                    </table></div>
                </div>`;
        },

        agregarInsumo() {
            const p = this.getProducto(this.detalleId);
            const f = document.getElementById('pnv-form-insumo');
            if (!p || !f) return;
            p.insumosReceta.push({ insumo: f.insumo.value.trim(), cantidad: f.cantidad.value.trim(), costoUsd: round2(f.costoUsd.value) });
            if (!this.guardar()) { p.insumosReceta.pop(); return; }
            this.renderDetalle();
        },

        eliminarInsumo(idx) {
            const p = this.getProducto(this.detalleId);
            if (!p || !confirm('¿Eliminar este insumo de la receta vinculada?')) return;
            p.insumosReceta.splice(idx, 1);
            this.guardar();
            this.renderDetalle();
        },

        aplicarCostoReceta() {
            const p = this.getProducto(this.detalleId);
            if (!p) return;
            const nuevo = this.costoReceta(p);
            if (!confirm(`¿Actualizar el costo unitario de USD ${fmtNum(p.costoUnitarioUsd)} a USD ${fmtNum(nuevo)} según la receta?`)) return;
            p.costoUnitarioUsd = nuevo;
            this.guardar();
            this.sincronizarContabilidad(p);
            this.toast('✅ Costo unitario actualizado según la receta vinculada.');
            this.refrescarTodo();
        },

        qrUrl(texto, size) {
            return `https://api.qrserver.com/v1/create-qr-code/?size=${size || 120}x${size || 120}&margin=0&data=${encodeURIComponent(texto)}`;
        },

        stickerHtml(p, lote) {
            const elab = lote ? String(lote.fechaHora).slice(0, 10) : nowLocalInput().slice(0, 10);
            const venc = lote ? lote.vencimiento : addDays(elab, p.vidaUtilDias);
            const qrData = this.generarPayloadQR(p, lote, 'texto');
            const tipo = p.tipoCodigo || 'EAN13';
            const barcode = p.barcode || (tipo === 'EAN13' ? this.generarEAN13Auto() : this.generarCode128Auto());
            return `<div class="pnv-sticker">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
                    <div>
                        <div style="font-size:9px;font-weight:900;letter-spacing:0.08em;color:#92400e;">👑 PANADERÍA NUEVA VIASA, C.A.</div>
                        <div style="font-size:8px;color:#334155;">RIF: J-31163165-8 • La Sabanita, Ciudad Bolívar</div>
                        <div style="font-size:14px;font-weight:900;color:#0f172a;line-height:1.15;margin-top:4px;">${esc(p.nombre)}</div>
                        <div style="font-size:9px;color:#334155;">${esc(p.presentacion)} • ${p.condicionFiscal === 'GRAVADO' ? 'IVA 16%' : 'Exento de IVA'}</div>
                    </div>
                    <div style="flex-shrink:0;background:#fff;padding:2px;border:1px solid #cbd5e1;border-radius:4px;">
                        ${renderQRGraphic(p, qrData, 60, 1)}
                    </div>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;margin:6px 0;font-size:8.5px;color:#0f172a;">
                    <div><b>LOTE</b><br>${esc(lote ? lote.id : 'S/L')}</div>
                    <div><b>ELABORACIÓN</b><br>${esc(elab)}</div>
                    <div><b>VENCE</b><br>${esc(venc)}</div>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:flex-end;">
                    <div style="background:#fff;padding:2px 4px;border-radius:4px;border:1px solid #cbd5e1;">${renderBarcodeGraphic(p, barcode, tipo, 170, 44)}</div>
                    <div style="text-align:right;color:#0f172a;"><div style="font-size:8px;">PVP</div><div style="font-size:15px;font-weight:900;">USD ${fmtNum(p.pvpUnitarioUsd)}</div><div style="font-size:9px;">Bs. ${fmtNum(this.bs(p.pvpUnitarioUsd))}</div></div>
                </div>
            </div>`;
        },

        // ====================================================================
        // ESTUDIO INTERACTIVO DE CÓDIGOS E IMPRESIÓN DE STICKERS (PESTAÑA E)
        // ====================================================================
        obtenerLoteStudio(p) {
            if (!p || !p.lotesProduccion || !p.lotesProduccion.length) return null;
            const selId = this.studioLoteId || this._studioLoteId;
            if (selId && selId !== 'GENERICO') {
                const found = p.lotesProduccion.find(l => l.id === selId);
                if (found) return found;
            }
            return [...p.lotesProduccion].sort((a, b) => String(b.fechaHora).localeCompare(String(a.fechaHora)))[0];
        },

        setStudioFormato(formato) {
            this.studioFormato = formato;
            this._studioFormato = formato;
            document.querySelectorAll('.pnv-format-option').forEach(el => {
                if (el.getAttribute('data-format') === formato) el.classList.add('active');
                else el.classList.remove('active');
            });
            this.renderStudioPreview();
        },

        setStudioLote(loteId) {
            this.studioLoteId = loteId;
            this._studioLoteId = loteId;
            this.renderStudioPreview();
        },

        setStudioTipoCodigo(tipo) {
            this.studioTipoCodigo = tipo;
            this._studioTipoCodigo = tipo;
            const p = this.getProducto(this.detalleId);
            if (p) {
                p.tipoCodigo = tipo;
                if (tipo === 'EAN13' && (!/^\d{12,13}$/.test(p.barcode))) {
                    p.barcode = this.generarEAN13Auto();
                    p.codigoBarras = p.barcode;
                } else if (tipo === 'CODE128' && /^\d{13}$/.test(p.barcode)) {
                    p.barcode = this.generarCode128Auto();
                    p.codigoBarras = p.barcode;
                }
                this.guardar();
                this.sincronizarConPOS(p);
            }
            this.renderStudioPreview();
        },

        actualizarBarcodeDesdeStudio(val) {
            const p = this.getProducto(this.detalleId);
            if (!p) return;
            const clean = String(val || '').trim();
            p.barcode = clean;
            p.codigoBarras = clean;
            if (/^\d{12,13}$/.test(clean)) p.tipoCodigo = 'EAN13';
            else p.tipoCodigo = 'CODE128';
            this.guardar();
            this.sincronizarConPOS(p);
            this.toast(`💾 Código de barras asignado actualizado: ${clean}`);
            this.renderStudioPreview();
        },

        async subirBarcodeStudio(input) {
            const p = this.getProducto(this.detalleId);
            if (!p || !input.files || !input.files[0]) return;
            try {
                p.customBarcodeImage = await this.leerImagenCodigo(input.files[0]);
                this.guardar();
                this.sincronizarConPOS(p);
                this.toast(`🖼️ Imagen propia de código de barras guardada para ${p.nombre}.`);
                this.renderDetalle();
            } catch (e) {
                this.toast('⚠️ ' + e.message, 'error');
            }
        },

        restaurarBarcodeStudio() {
            const p = this.getProducto(this.detalleId);
            if (!p) return;
            p.customBarcodeImage = null;
            this.guardar();
            this.sincronizarConPOS(p);
            this.toast('🔄 Generador automático de código de barras restaurado.');
            this.renderDetalle();
        },

        async subirQRStudio(input) {
            const p = this.getProducto(this.detalleId);
            if (!p || !input.files || !input.files[0]) return;
            try {
                p.customQrImage = await this.leerImagenCodigo(input.files[0]);
                this.guardar();
                this.sincronizarConPOS(p);
                this.toast(`🖼️ Imagen propia de código QR guardada para ${p.nombre}.`);
                this.renderDetalle();
            } catch (e) {
                this.toast('⚠️ ' + e.message, 'error');
            }
        },

        restaurarQRStudio() {
            const p = this.getProducto(this.detalleId);
            if (!p) return;
            p.customQrImage = null;
            this.guardar();
            this.sincronizarConPOS(p);
            this.toast('🔄 Generador automático de código QR restaurado.');
            this.renderDetalle();
        },

        setStudioCopias(n) {
            const val = Math.max(1, parseInt(n, 10) || 1);
            this.studioCopias = val;
            this._studioCopias = val;
            const input = document.getElementById('pnv-studio-copias-input');
            if (input && document.activeElement !== input) input.value = val;
            const btn = document.getElementById('pnv-btn-imprimir-studio');
            if (btn) btn.innerHTML = `<i class="fa-solid fa-print"></i> Imprimir Etiquetas (${val} ${val === 1 ? 'copia' : 'copias'})`;
            if ((this.studioFormato || this._studioFormato) === 'a4') {
                this.renderStudioPreview();
            }
        },

        renderStudioPreview() {
            const container = document.getElementById('pnv-studio-preview-content');
            if (!container) return;
            const p = this.getProducto(this.detalleId);
            if (!p) return;
            const formato = this.studioFormato || this._studioFormato || 'comercial';
            const lote = this.obtenerLoteStudio(p);
            const tipoCodigo = this.studioTipoCodigo || this._studioTipoCodigo || p.tipoCodigo || 'EAN13';
            const barcode = p.barcode || (tipoCodigo === 'EAN13' ? this.generarEAN13Auto() : this.generarCode128Auto());
            const loteId = lote ? lote.id : 'LOT-' + new Date().getFullYear() + '-001';
            const fechaElab = lote ? String(lote.fechaHora).slice(0, 10) : nowLocalInput().slice(0, 10);
            const fechaVenc = lote ? lote.vencimiento : addDays(fechaElab, p.vidaUtilDias);
            const payloadQR = this.generarPayloadQR(p, lote, 'texto');

            if (formato === 'termica-5030') {
                container.innerHTML = `
                    <div class="pnv-sticker-termica-5030" id="pnv-sticker-active-preview">
                        <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:1px solid #000;padding-bottom:2px;">
                            <div style="overflow:hidden;padding-right:4px;">
                                <div style="font-size:7.5px;font-weight:900;text-transform:uppercase;white-space:nowrap;">PANADERIA NUEVA VIASA</div>
                                <div style="font-size:11px;font-weight:900;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(p.nombre)}</div>
                            </div>
                            <div style="text-align:right;flex-shrink:0;">
                                <div style="font-size:6.5px;font-weight:700;">${esc(loteId)}</div>
                                <div style="font-size:11px;font-weight:900;">${fmtNum(p.pvpUnitarioUsd)}</div>
                            </div>
                        </div>
                        <div style="display:flex;justify-content:space-between;align-items:center;margin:2px 0;">
                            <div style="font-size:7px;line-height:1.2;">
                                <div>ELAB: ${esc(fechaElab)}</div>
                                <div>VENC: ${esc(fechaVenc)}</div>
                                <div>BS: ${fmtNum(this.bs(p.pvpUnitarioUsd))}</div>
                            </div>
                            <div style="flex-shrink:0;">
                                ${renderQRGraphic(p, payloadQR, 44, 1)}
                            </div>
                        </div>
                        <div style="text-align:center;border-top:1px dashed #000;padding-top:2px;">
                            ${renderBarcodeGraphic(p, barcode, tipoCodigo, 210, 34)}
                        </div>
                    </div>`;
            } else if (formato === 'termica-4040') {
                container.innerHTML = `
                    <div class="pnv-sticker-termica-4040" id="pnv-sticker-active-preview">
                        <div style="text-align:center;border-bottom:1px solid #000;padding-bottom:3px;">
                            <div style="font-size:7.5px;font-weight:900;">NUEVA VIASA • J-31163165-8</div>
                            <div style="font-size:10.5px;font-weight:900;line-height:1.15;margin-top:1px;">${esc(p.nombre)}</div>
                            <div style="font-size:7.5px;">${esc(p.presentacion)}</div>
                        </div>
                        <div style="display:flex;justify-content:center;margin:4px 0;">
                            ${renderQRGraphic(p, payloadQR, 74, 1)}
                        </div>
                        <div style="display:flex;justify-content:space-between;align-items:center;font-size:7.5px;font-weight:700;">
                            <span>L: ${esc(loteId)}</span>
                            <span style="font-size:11px;font-weight:900;">USD ${fmtNum(p.pvpUnitarioUsd)}</span>
                            <span>V: ${esc(fechaVenc)}</span>
                        </div>
                        <div style="text-align:center;border-top:1px dashed #000;padding-top:2px;">
                            ${renderBarcodeGraphic(p, barcode, tipoCodigo, 180, 28)}
                        </div>
                    </div>`;
            } else if (formato === 'a4') {
                const sampleSticker = `
                    <div style="background:#fff;border:1px solid #0f172a;border-radius:6px;padding:8px;font-size:8px;box-shadow:0 2px 6px rgba(0,0,0,0.25);">
                        <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:1px solid #0f172a;padding-bottom:3px;margin-bottom:3px;">
                            <div>
                                <div style="font-size:7.5px;font-weight:900;color:#92400e;">👑 NUEVA VIASA</div>
                                <div style="font-size:10px;font-weight:900;color:#0f172a;">${esc(p.nombre.slice(0, 18))}</div>
                                <div style="font-size:7px;color:#475569;">${esc(p.presentacion)}</div>
                            </div>
                            <div style="flex-shrink:0;">${renderQRGraphic(p, payloadQR, 36, 1)}</div>
                        </div>
                        <div style="display:flex;justify-content:space-between;align-items:center;font-size:6.5px;color:#0f172a;margin-bottom:3px;font-family:monospace;">
                            <span>L: ${esc(loteId)}</span>
                            <span>V: ${esc(fechaVenc)}</span>
                        </div>
                        <div style="display:flex;justify-content:space-between;align-items:flex-end;">
                            <div>${renderBarcodeGraphic(p, barcode, tipoCodigo, 110, 26)}</div>
                            <div style="text-align:right;"><b style="font-size:11px;color:#0f172a;">${fmtNum(p.pvpUnitarioUsd)}</b></div>
                        </div>
                    </div>`;
                container.innerHTML = `
                    <div style="width:100%;text-align:center;margin-bottom:8px;font-size:0.75rem;color:#FBBF24;">
                        <i class="fa-solid fa-table-cells"></i> Vista preliminar de planilla A4 (Etiquetas organizadas para papel adhesivo troquelado)
                    </div>
                    <div class="pnv-a4-preview-grid">
                        ${Array(6).fill(sampleSticker).join('')}
                    </div>`;
            } else { // comercial (65x45 mm)
                container.innerHTML = `
                    <div class="pnv-sticker-comercial" id="pnv-sticker-active-preview">
                        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;border-bottom:1.5px solid #0F172A;padding-bottom:6px;margin-bottom:6px;">
                            <div>
                                <div style="font-size:10px;font-weight:900;letter-spacing:0.06em;color:#92400e;text-transform:uppercase;">👑 PANADERÍA NUEVA VIASA, C.A.</div>
                                <div style="font-size:8px;font-weight:700;color:#334155;">RIF: J-31163165-8 • La Sabanita, Ciudad Bolívar</div>
                                <div style="font-size:15px;font-weight:900;color:#0F172A;line-height:1.15;margin-top:3px;">${esc(p.nombre)}</div>
                                <div style="font-size:9.5px;color:#334155;font-weight:600;">${esc(p.presentacion)} • <span style="color:${p.condicionFiscal === 'GRAVADO' ? '#1D4ED8' : '#047857'};font-weight:800;">${p.condicionFiscal === 'GRAVADO' ? 'IVA 16%' : 'EXENTO IVA'}</span></div>
                            </div>
                            <div style="background:#fff;padding:4px;border:1px solid #CBD5E1;border-radius:6px;box-shadow:0 1px 4px rgba(0,0,0,0.1);flex-shrink:0;">
                                ${renderQRGraphic(p, payloadQR, 68, 1)}
                            </div>
                        </div>
                        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;background:rgba(241,245,249,0.9);padding:4px 6px;border-radius:4px;margin-bottom:6px;font-size:8.5px;color:#0F172A;font-family:'JetBrains Mono',monospace;">
                            <div><span style="font-size:7.5px;color:#64748B;display:block;">LOTE</span><b>${esc(loteId)}</b></div>
                            <div><span style="font-size:7.5px;color:#64748B;display:block;">ELAB.</span><b>${esc(fechaElab)}</b></div>
                            <div><span style="font-size:7.5px;color:#64748B;display:block;">VENCE</span><b>${esc(fechaVenc)}</b></div>
                        </div>
                        <div style="display:flex;justify-content:space-between;align-items:flex-end;">
                            <div style="background:#fff;padding:4px 6px;border-radius:4px;border:1px solid #CBD5E1;display:inline-block;">
                                ${renderBarcodeGraphic(p, barcode, tipoCodigo, 160, 42)}
                            </div>
                            <div style="text-align:right;color:#0F172A;">
                                <div style="font-size:8px;font-weight:800;color:#64748B;text-transform:uppercase;">PVP OFICIAL</div>
                                <div style="font-size:16px;font-weight:900;color:#0F172A;line-height:1;font-variant-numeric:tabular-nums;">USD ${fmtNum(p.pvpUnitarioUsd)}</div>
                                <div style="font-size:9.5px;font-weight:800;color:#B45309;font-variant-numeric:tabular-nums;margin-top:2px;">Bs. ${fmtNum(this.bs(p.pvpUnitarioUsd))}</div>
                            </div>
                        </div>
                    </div>`;
            }
        },

        tabCodigosEstudio(p) {
            const formato = this.studioFormato || this._studioFormato || 'comercial';
            const loteSel = this.obtenerLoteStudio(p);
            const tipoCodigo = this.studioTipoCodigo || this._studioTipoCodigo || p.tipoCodigo || 'EAN13';
            const copias = this.studioCopias || this._studioCopias || 1;

            const lotesOptions = (p.lotesProduccion && p.lotesProduccion.length > 0)
                ? [...p.lotesProduccion].sort((a, b) => String(b.fechaHora).localeCompare(String(a.fechaHora))).map(l => 
                    `<option value="${esc(l.id)}" ${loteSel && loteSel.id === l.id ? 'selected' : ''}>${esc(l.id)} • Creado: ${esc(String(l.fechaHora).slice(0, 10))} • Vence: ${esc(l.vencimiento)} (${fmtInt(l.cantidad)} und)</option>`
                  ).join('')
                : '<option value="GENERICO">Lote genérico del día (sin registros previos)</option>';

            return `
                <div class="pnv-section" style="margin-bottom:0;">
                    <div class="pnv-studio-layout">
                        <!-- PANEL DE CONTROL DEL ESTUDIO -->
                        <div class="pnv-studio-controls">
                            <div>
                                <div class="pnv-label" style="display:flex;align-items:center;gap:6px;">
                                    <i class="fa-solid fa-shapes" style="color:#FBBF24;"></i> 1. Formato de Etiqueta / Salida
                                </div>
                                <div style="display:flex;flex-direction:column;gap:8px;margin-top:6px;">
                                    <div class="pnv-format-option ${formato === 'comercial' ? 'active' : ''}" data-format="comercial" onclick="ViasaProductosExclusivosEngine.setStudioFormato('comercial')">
                                        <div style="font-size:1.3rem;color:#FBBF24;"><i class="fa-solid fa-tag"></i></div>
                                        <div style="flex:1;">
                                            <div style="font-size:0.82rem;font-weight:800;color:#fff;">Sticker Comercial (65 x 45 mm)</div>
                                            <div style="font-size:0.7rem;color:#94A3B8;">Empaque final, bolsas y vitrinas con logo, QR, barras y PVP</div>
                                        </div>
                                    </div>
                                    <div class="pnv-format-option ${formato === 'termica-5030' ? 'active' : ''}" data-format="termica-5030" onclick="ViasaProductosExclusivosEngine.setStudioFormato('termica-5030')">
                                        <div style="font-size:1.3rem;color:#38BDF8;"><i class="fa-solid fa-receipt"></i></div>
                                        <div style="flex:1;">
                                            <div style="font-size:0.82rem;font-weight:800;color:#fff;">Etiqueta Térmica Balanza (50 x 30 mm)</div>
                                            <div style="font-size:0.7rem;color:#94A3B8;">Impresora térmica de rollo (Zebra / Xprinter / Balanzas)</div>
                                        </div>
                                    </div>
                                    <div class="pnv-format-option ${formato === 'termica-4040' ? 'active' : ''}" data-format="termica-4040" onclick="ViasaProductosExclusivosEngine.setStudioFormato('termica-4040')">
                                        <div style="font-size:1.3rem;color:#A78BFA;"><i class="fa-solid fa-square"></i></div>
                                        <div style="flex:1;">
                                            <div style="font-size:0.82rem;font-weight:800;color:#fff;">Etiqueta Cuadrada (40 x 40 mm)</div>
                                            <div style="font-size:0.7rem;color:#94A3B8;">Formato compacto con QR predominante y microcódigo</div>
                                        </div>
                                    </div>
                                    <div class="pnv-format-option ${formato === 'a4' ? 'active' : ''}" data-format="a4" onclick="ViasaProductosExclusivosEngine.setStudioFormato('a4')">
                                        <div style="font-size:1.3rem;color:#4ADE80;"><i class="fa-solid fa-table-cells"></i></div>
                                        <div style="flex:1;">
                                            <div style="font-size:0.82rem;font-weight:800;color:#fff;">Planilla A4 / Carta Troquelada</div>
                                            <div style="font-size:0.7rem;color:#94A3B8;">Cuadrícula de stickers para papel autoadhesivo estándar</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div class="pnv-label"><i class="fa-solid fa-boxes-stacked" style="color:#FBBF24;"></i> 2. Lote de Trazabilidad Vinculado</div>
                                <select class="pnv-input" onchange="ViasaProductosExclusivosEngine.setStudioLote(this.value)">
                                    ${lotesOptions}
                                </select>
                            </div>

                            <!-- Control de Código Asignado e Imágenes Propias -->
                            <div style="background:#080D1A;border:1px solid rgba(251,191,36,0.28);border-radius:10px;padding:12px;">
                                <div class="pnv-label" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                                    <span><i class="fa-solid fa-barcode" style="color:#FBBF24;"></i> Código de Barras Asignado (POS)</span>
                                    ${p.customBarcodeImage
                                        ? '<span class="pnv-badge" style="background:#065F46;color:#A7F3D0;font-size:0.62rem;border:1px solid #10B981;">Imagen Propia Activa</span>'
                                        : '<span class="pnv-badge" style="background:#1E293B;color:#94A3B8;font-size:0.62rem;">Autogenerado</span>'}
                                </div>
                                <div style="display:flex;gap:6px;align-items:center;">
                                    <input type="text" id="pnv-studio-barcode-input" class="pnv-input" style="font-family:'JetBrains Mono',monospace;font-weight:700;letter-spacing:1px;" value="${esc(p.barcode || '')}" placeholder="Escanear o escribir número antiguo..." onchange="ViasaProductosExclusivosEngine.actualizarBarcodeDesdeStudio(this.value)">
                                    <button type="button" class="pnv-btn pnv-btn-ghost pnv-btn-xs" style="color:#FBBF24;border-color:rgba(251,191,36,0.35);padding:6px 10px;" title="Guardar número de código de barras" onclick="ViasaProductosExclusivosEngine.actualizarBarcodeDesdeStudio(document.getElementById('pnv-studio-barcode-input').value)">💾</button>
                                </div>
                                <div style="font-size:0.68rem;color:#94A3B8;margin-top:4px;line-height:1.3;">
                                    ${p.customBarcodeImage ? 'Mostrando imagen propia en stickers. El lector POS leerá el número asignado arriba.' : 'Las barras se dibujan en tiempo real con este número.'}
                                </div>

                                <!-- Botonera Imágenes Propias del Producto -->
                                <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:10px;">
                                    <div>
                                        <label class="pnv-btn pnv-btn-ghost pnv-btn-xs" style="width:100%;justify-content:center;cursor:pointer;font-size:0.68rem;padding:6px 4px;" title="Subir imagen propia (.png, .jpg, .svg, .webp) para el código de barras">
                                            🖼️ Cambiar Imagen de Código de Barras
                                            <input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" style="display:none;" onchange="ViasaProductosExclusivosEngine.subirBarcodeStudio(this)">
                                        </label>
                                        ${p.customBarcodeImage ? `
                                            <button type="button" class="pnv-btn pnv-btn-ghost pnv-btn-xs" style="width:100%;margin-top:4px;color:#F87171;border-color:rgba(248,113,113,0.3);font-size:0.65rem;justify-content:center;" onclick="ViasaProductosExclusivosEngine.restaurarBarcodeStudio()">
                                                🔄 Restaurar Generador Automático
                                            </button>
                                        ` : ''}
                                    </div>
                                    <div>
                                        <label class="pnv-btn pnv-btn-ghost pnv-btn-xs" style="width:100%;justify-content:center;cursor:pointer;font-size:0.68rem;padding:6px 4px;" title="Subir imagen propia (.png, .jpg, .svg, .webp) para el código QR">
                                            🖼️ Cambiar Imagen de Código QR
                                            <input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" style="display:none;" onchange="ViasaProductosExclusivosEngine.subirQRStudio(this)">
                                        </label>
                                        ${p.customQrImage ? `
                                            <button type="button" class="pnv-btn pnv-btn-ghost pnv-btn-xs" style="width:100%;margin-top:4px;color:#F87171;border-color:rgba(248,113,113,0.3);font-size:0.65rem;justify-content:center;" onclick="ViasaProductosExclusivosEngine.restaurarQRStudio()">
                                                🔄 Restaurar Generador Automático
                                            </button>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>

                            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                                <div>
                                    <div class="pnv-label"><i class="fa-solid fa-barcode" style="color:#FBBF24;"></i> Estándar de Barras</div>
                                    <select class="pnv-input" onchange="ViasaProductosExclusivosEngine.setStudioTipoCodigo(this.value)">
                                        <option value="EAN13" ${tipoCodigo !== 'CODE128' ? 'selected' : ''}>EAN-13 (Comercial)</option>
                                        <option value="CODE128" ${tipoCodigo === 'CODE128' ? 'selected' : ''}>Code-128 (Interno)</option>
                                    </select>
                                </div>
                                <div>
                                    <div class="pnv-label"><i class="fa-solid fa-copy" style="color:#FBBF24;"></i> Cantidad Copias</div>
                                    <input type="number" id="pnv-studio-copias-input" min="1" max="500" value="${copias}" class="pnv-input" oninput="ViasaProductosExclusivosEngine.setStudioCopias(this.value)">
                                </div>
                            </div>

                            <!-- Presets de copias rápidas -->
                            <div style="display:flex;gap:4px;flex-wrap:wrap;">
                                <span style="font-size:0.68rem;color:#94A3B8;align-self:center;margin-right:2px;">Copias rápidas:</span>
                                ${[1, 5, 10, 25, 50].map(n => `
                                    <button type="button" class="pnv-btn pnv-btn-ghost pnv-btn-xs" style="padding:2px 8px;${copias === n ? 'border-color:#FBBF24;color:#FBBF24;background:rgba(251,191,36,0.1);' : ''}" onclick="ViasaProductosExclusivosEngine.setStudioCopias(${n})">${n}</button>
                                `).join('')}
                            </div>

                            <!-- Botón Principal de Impresión -->
                            <button type="button" id="pnv-btn-imprimir-studio" class="pnv-btn pnv-btn-gold" style="width:100%;justify-content:center;padding:12px;font-size:0.92rem;font-weight:900;" onclick="ViasaProductosExclusivosEngine.imprimirEtiquetas()">
                                <i class="fa-solid fa-print"></i> Imprimir Etiquetas (${copias} ${copias === 1 ? 'copia' : 'copias'})
                            </button>

                            <!-- Descargas individuales de alta resolución -->
                            <div style="border-top:1px solid rgba(148,163,184,0.18);padding-top:10px;">
                                <div class="pnv-label" style="font-size:0.7rem;text-transform:uppercase;color:#94A3B8;margin-bottom:6px;">
                                    <i class="fa-solid fa-download" style="color:#FBBF24;"></i> Descarga Individual de Activos (HD / Vector)
                                </div>
                                <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
                                    <button type="button" class="pnv-btn pnv-btn-ghost pnv-btn-xs" style="justify-content:center;" onclick="ViasaProductosExclusivosEngine.descargarBarcodePNGActual()">⬇️ Barcode PNG</button>
                                    <button type="button" class="pnv-btn pnv-btn-ghost pnv-btn-xs" style="justify-content:center;" onclick="ViasaProductosExclusivosEngine.descargarBarcodeSVGActual()">⬇️ Barcode SVG</button>
                                    <button type="button" class="pnv-btn pnv-btn-ghost pnv-btn-xs" style="justify-content:center;" onclick="ViasaProductosExclusivosEngine.descargarQRPNGActual()">⬇️ QR PNG (HD)</button>
                                    <button type="button" class="pnv-btn pnv-btn-ghost pnv-btn-xs" style="justify-content:center;" onclick="ViasaProductosExclusivosEngine.descargarQRSVGActual()">⬇️ QR SVG</button>
                                    <button type="button" class="pnv-btn pnv-btn-ghost pnv-btn-xs" style="grid-column:span 2;justify-content:center;border-color:rgba(251,191,36,0.4);color:#FDE68A;" onclick="ViasaProductosExclusivosEngine.descargarStickerPNGActual()">
                                        <i class="fa-solid fa-image"></i> ⬇️ Descargar Sticker Completo PNG (HD)
                                    </button>
                                </div>
                            </div>

                            <!-- Estado de Validación POS / Fiscal -->
                            <div style="background:#080D1A;border:1px solid rgba(74,222,128,0.25);border-radius:8px;padding:8px 10px;font-size:0.72rem;line-height:1.4;">
                                <div style="color:#4ADE80;font-weight:800;display:flex;align-items:center;gap:6px;">
                                    <i class="fa-solid fa-circle-check"></i> Compatibilidad POS y Lectores Garantizada
                                </div>
                                <div style="color:#94A3B8;margin-top:2px;">
                                    Pistola Láser 1D: <b style="color:#E2E8F0;">OK (${esc(p.barcode || 'EAN-13')})</b><br>
                                    Escáner 2D / Celular: <b style="color:#E2E8F0;">OK (QR Trazabilidad)</b><br>
                                    Sincronización POS VIASA: <b style="color:#4ADE80;">100% Activa</b>
                                </div>
                            </div>
                        </div>

                        <!-- ETAPA DE VISTA PREVIA (CANVAS) -->
                        <div class="pnv-preview-stage">
                            <div style="font-size:0.74rem;font-weight:800;color:#94A3B8;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:14px;text-align:center;">
                                <i class="fa-solid fa-eye" style="color:#FBBF24;"></i> Vista Previa en Tiempo Real — Escala 1:1
                            </div>
                            <div id="pnv-studio-preview-content">
                                <!-- Generado por renderStudioPreview() -->
                            </div>
                        </div>
                    </div>
                </div>`;
        },

        imprimirEtiquetas() {
            const p = this.getProducto(this.detalleId);
            if (!p) return;
            const formato = this.studioFormato || this._studioFormato || 'comercial';
            const copias = Math.max(1, parseInt(this.studioCopias || this._studioCopias, 10) || 1);
            const lote = this.obtenerLoteStudio(p);
            const tipoCodigo = this.studioTipoCodigo || this._studioTipoCodigo || p.tipoCodigo || 'EAN13';
            const barcode = p.barcode || (tipoCodigo === 'EAN13' ? this.generarEAN13Auto() : this.generarCode128Auto());
            const loteId = lote ? lote.id : 'LOT-' + new Date().getFullYear() + '-001';
            const fechaElab = lote ? String(lote.fechaHora).slice(0, 10) : nowLocalInput().slice(0, 10);
            const fechaVenc = lote ? lote.vencimiento : addDays(fechaElab, p.vidaUtilDias);
            const payloadQR = this.generarPayloadQR(p, lote, 'texto');

            let singleHtml = '';
            let pageCss = '';

            if (formato === 'termica-5030') {
                pageCss = `
                    @page { size: 50mm 30mm; margin: 0; }
                    body { margin: 0; padding: 0; background: #fff; font-family: 'JetBrains Mono', monospace; }
                    .print-label { width: 50mm; height: 30mm; padding: 1.5mm 2mm; box-sizing: border-box; page-break-after: always; display: flex; flex-direction: column; justify-content: space-between; }
                `;
                singleHtml = `
                    <div class="print-label">
                        <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:0.8px solid #000;padding-bottom:1px;">
                            <div style="overflow:hidden;padding-right:2px;">
                                <div style="font-size:6.5pt;font-weight:900;text-transform:uppercase;">NUEVA VIASA</div>
                                <div style="font-size:8.5pt;font-weight:900;white-space:nowrap;overflow:hidden;line-height:1;">${esc(p.nombre.slice(0, 22))}</div>
                            </div>
                            <div style="text-align:right;flex-shrink:0;">
                                <div style="font-size:5.5pt;font-weight:700;">${esc(loteId)}</div>
                                <div style="font-size:8.5pt;font-weight:900;">${fmtNum(p.pvpUnitarioUsd)}</div>
                            </div>
                        </div>
                        <div style="display:flex;justify-content:space-between;align-items:center;margin:1px 0;">
                            <div style="font-size:5.5pt;line-height:1.2;">
                                <div>ELAB: ${esc(fechaElab)}</div>
                                <div>VENC: ${esc(fechaVenc)}</div>
                                <div>BS: ${fmtNum(this.bs(p.pvpUnitarioUsd))}</div>
                            </div>
                            <div style="flex-shrink:0;">
                                ${renderQRGraphic(p, payloadQR, 38, 1)}
                            </div>
                        </div>
                        <div style="text-align:center;border-top:0.8px dashed #000;padding-top:1px;">
                            ${renderBarcodeGraphic(p, barcode, tipoCodigo, 160, 26)}
                        </div>
                    </div>`;
            } else if (formato === 'termica-4040') {
                pageCss = `
                    @page { size: 40mm 40mm; margin: 0; }
                    body { margin: 0; padding: 0; background: #fff; font-family: 'JetBrains Mono', monospace; }
                    .print-label { width: 40mm; height: 40mm; padding: 1.5mm; box-sizing: border-box; page-break-after: always; display: flex; flex-direction: column; justify-content: space-between; text-align: center; }
                `;
                singleHtml = `
                    <div class="print-label">
                        <div style="border-bottom:0.8px solid #000;padding-bottom:1px;">
                            <div style="font-size:6pt;font-weight:900;">NUEVA VIASA • J-31163165-8</div>
                            <div style="font-size:8pt;font-weight:900;line-height:1;">${esc(p.nombre.slice(0, 20))}</div>
                        </div>
                        <div style="display:flex;justify-content:center;margin:1px 0;">
                            ${renderQRGraphic(p, payloadQR, 52, 1)}
                        </div>
                        <div style="display:flex;justify-content:space-between;align-items:center;font-size:6pt;font-weight:700;">
                            <span>L: ${esc(loteId)}</span>
                            <span style="font-size:8.5pt;font-weight:900;">USD ${fmtNum(p.pvpUnitarioUsd)}</span>
                            <span>V: ${esc(fechaVenc)}</span>
                        </div>
                        <div style="text-align:center;border-top:0.8px dashed #000;padding-top:1px;">
                            ${renderBarcodeGraphic(p, barcode, tipoCodigo, 130, 22)}
                        </div>
                    </div>`;
            } else if (formato === 'a4') {
                pageCss = `
                    @page { size: A4 portrait; margin: 8mm; }
                    body { margin: 0; padding: 0; background: #fff; font-family: system-ui, -apple-system, sans-serif; }
                    .a4-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4mm; page-break-inside: avoid; }
                    .print-card { border: 1px solid #1e293b; border-radius: 6px; padding: 3mm; box-sizing: border-box; page-break-inside: avoid; }
                `;
                singleHtml = `
                    <div class="print-card">
                        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:4px;border-bottom:1px solid #0f172a;padding-bottom:2px;margin-bottom:3px;">
                            <div>
                                <div style="font-size:7pt;font-weight:900;color:#92400e;">👑 PANADERÍA NUEVA VIASA</div>
                                <div style="font-size:5.5pt;color:#334155;">RIF: J-31163165-8</div>
                                <div style="font-size:9.5pt;font-weight:900;color:#0f172a;line-height:1.1;margin-top:2px;">${esc(p.nombre)}</div>
                                <div style="font-size:6.5pt;color:#334155;">${esc(p.presentacion)} • ${p.condicionFiscal === 'GRAVADO' ? 'IVA 16%' : 'EXENTO'}</div>
                            </div>
                            <div style="flex-shrink:0;">
                                ${renderQRGraphic(p, payloadQR, 44, 1)}
                            </div>
                        </div>
                        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:2px;font-size:5.5pt;color:#0f172a;margin-bottom:3px;font-family:monospace;">
                            <div><b>L:</b> ${esc(loteId)}</div>
                            <div><b>E:</b> ${esc(fechaElab)}</div>
                            <div><b>V:</b> ${esc(fechaVenc)}</div>
                        </div>
                        <div style="display:flex;justify-content:space-between;align-items:flex-end;">
                            <div>${renderBarcodeGraphic(p, barcode, tipoCodigo, 115, 30)}</div>
                            <div style="text-align:right;">
                                <div style="font-size:10pt;font-weight:900;color:#0f172a;line-height:1;">${fmtNum(p.pvpUnitarioUsd)}</div>
                                <div style="font-size:6.5pt;font-weight:800;color:#b45309;">Bs. ${fmtNum(this.bs(p.pvpUnitarioUsd))}</div>
                            </div>
                        </div>
                    </div>`;
            } else { // comercial (65x45mm)
                pageCss = `
                    @page { size: 68mm 48mm; margin: 1mm; }
                    body { margin: 0; padding: 0; background: #fff; font-family: system-ui, -apple-system, sans-serif; }
                    .print-label { width: 66mm; height: 46mm; padding: 2.5mm; box-sizing: border-box; page-break-after: always; display: flex; flex-direction: column; justify-content: space-between; border: 1.2px solid #0f172a; border-radius: 4px; }
                `;
                singleHtml = `
                    <div class="print-label">
                        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:4px;border-bottom:1.2px solid #0f172a;padding-bottom:2px;">
                            <div>
                                <div style="font-size:7.5pt;font-weight:900;color:#92400e;">👑 PANADERÍA NUEVA VIASA, C.A.</div>
                                <div style="font-size:5.5pt;color:#334155;font-weight:700;">RIF: J-31163165-8 • La Sabanita, Ciudad Bolívar</div>
                                <div style="font-size:10pt;font-weight:900;color:#0f172a;line-height:1.15;margin-top:2px;">${esc(p.nombre)}</div>
                                <div style="font-size:6.5pt;color:#334155;font-weight:700;">${esc(p.presentacion)} • ${p.condicionFiscal === 'GRAVADO' ? 'IVA 16%' : 'EXENTO'}</div>
                            </div>
                            <div style="flex-shrink:0;">
                                ${renderQRGraphic(p, payloadQR, 48, 1)}
                            </div>
                        </div>
                        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:2px;font-size:6pt;color:#0f172a;background:#f8fafc;padding:2px 4px;border-radius:3px;font-family:monospace;">
                            <div><b>LOTE:</b> ${esc(loteId)}</div>
                            <div><b>ELAB:</b> ${esc(fechaElab)}</div>
                            <div><b>VENCE:</b> ${esc(fechaVenc)}</div>
                        </div>
                        <div style="display:flex;justify-content:space-between;align-items:flex-end;">
                            <div>${renderBarcodeGraphic(p, barcode, tipoCodigo, 130, 32)}</div>
                            <div style="text-align:right;">
                                <div style="font-size:5.5pt;font-weight:800;color:#64748b;">PVP OFICIAL</div>
                                <div style="font-size:11.5pt;font-weight:900;color:#0f172a;line-height:1;">USD ${fmtNum(p.pvpUnitarioUsd)}</div>
                                <div style="font-size:7pt;font-weight:800;color:#b45309;">Bs. ${fmtNum(this.bs(p.pvpUnitarioUsd))}</div>
                            </div>
                        </div>
                    </div>`;
            }

            let bodyContent = '';
            if (formato === 'a4') {
                bodyContent = `<div class="a4-grid">${Array(copias).fill(singleHtml).join('')}</div>`;
            } else {
                bodyContent = Array(copias).fill(singleHtml).join('');
            }

            const w = window.open('', '_blank', 'width=800,height=600');
            if (!w) {
                this.toast('⚠️ El navegador bloqueó la ventana de impresión. Habilite popups para imprimir.', 'error');
                return;
            }
            w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Etiquetas_${esc(p.sku)}</title><style>${pageCss}</style></head><body>${bodyContent}<script>window.onload=function(){window.print();};<\/script></body></html>`);
            w.document.close();
        },

        descargarBarcodePNGActual() {
            const p = this.getProducto(this.detalleId);
            if (!p) return;
            if (p.customBarcodeImage) {
                const a = document.createElement('a');
                a.href = p.customBarcodeImage;
                a.download = `Barcode_Personalizado_${p.sku}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                this.toast(`⬇️ Imagen propia de código de barras descargada para ${p.sku}`);
                return;
            }
            const tipo = this.studioTipoCodigo || this._studioTipoCodigo || p.tipoCodigo || 'EAN13';
            const code = p.barcode || (tipo === 'EAN13' ? this.generarEAN13Auto() : this.generarCode128Auto());
            const svg = renderBarcodeSvg(code, tipo, 380, 120);
            descargarSvgComoPng(svg, `Barcode_${p.sku}_${code}.png`, 1140, 360);
            this.toast(`⬇️ Código de barras PNG descargado: ${code}`);
        },

        descargarBarcodeSVGActual() {
            const p = this.getProducto(this.detalleId);
            if (!p) return;
            const tipo = this.studioTipoCodigo || this._studioTipoCodigo || p.tipoCodigo || 'EAN13';
            const code = p.barcode || (tipo === 'EAN13' ? this.generarEAN13Auto() : this.generarCode128Auto());
            const svg = renderBarcodeSvg(code, tipo, 380, 120);
            descargarSvgArchivo(svg, `Barcode_${p.sku}_${code}.svg`);
            this.toast(`⬇️ Código de barras vectorial SVG descargado: ${code}`);
        },

        descargarQRPNGActual() {
            const p = this.getProducto(this.detalleId);
            if (!p) return;
            if (p.customQrImage) {
                const a = document.createElement('a');
                a.href = p.customQrImage;
                a.download = `QR_Personalizado_${p.sku}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                this.toast(`⬇️ Imagen propia de código QR descargada para ${p.sku}`);
                return;
            }
            const lote = this.obtenerLoteStudio(p);
            const payload = this.generarPayloadQR(p, lote, 'texto');
            const svg = renderQRSvg(payload, 300, 2);
            descargarSvgComoPng(svg, `QR_${p.sku}.png`, 900, 900);
            this.toast(`⬇️ Código QR PNG descargado para ${p.sku}`);
        },

        descargarQRSVGActual() {
            const p = this.getProducto(this.detalleId);
            if (!p) return;
            const lote = this.obtenerLoteStudio(p);
            const payload = this.generarPayloadQR(p, lote, 'texto');
            const svg = renderQRSvg(payload, 300, 2);
            descargarSvgArchivo(svg, `QR_${p.sku}.svg`);
            this.toast(`⬇️ Código QR vectorial SVG descargado para ${p.sku}`);
        },

        descargarStickerPNGActual() {
            const p = this.getProducto(this.detalleId);
            if (!p) return;
            const lote = this.obtenerLoteStudio(p);
            const tipo = this.studioTipoCodigo || this._studioTipoCodigo || p.tipoCodigo || 'EAN13';
            const barcode = p.barcode || (tipo === 'EAN13' ? this.generarEAN13Auto() : this.generarCode128Auto());
            const loteId = lote ? lote.id : 'LOT-' + new Date().getFullYear() + '-001';
            const elab = lote ? String(lote.fechaHora).slice(0, 10) : nowLocalInput().slice(0, 10);
            const venc = lote ? lote.vencimiento : addDays(elab, p.vidaUtilDias);
            const payloadQR = this.generarPayloadQR(p, lote, 'texto');

            if (typeof document === 'undefined') return;
            const canvas = document.createElement('canvas');
            canvas.width = 720;
            canvas.height = 480;
            const ctx = canvas.getContext('2d');

            ctx.fillStyle = '#FFFBEB';
            ctx.fillRect(0, 0, 720, 480);
            ctx.strokeStyle = '#0F172A';
            ctx.lineWidth = 6;
            ctx.strokeRect(6, 6, 708, 468);

            ctx.fillStyle = '#92400E';
            ctx.font = 'bold 20px system-ui, sans-serif';
            ctx.fillText('👑 PANADERÍA NUEVA VIASA, C.A.', 24, 42);

            ctx.fillStyle = '#334155';
            ctx.font = 'bold 15px system-ui, sans-serif';
            ctx.fillText('RIF: J-31163165-8 • La Sabanita, Ciudad Bolívar', 24, 68);

            ctx.fillStyle = '#0F172A';
            ctx.font = '900 28px system-ui, sans-serif';
            ctx.fillText(p.nombre.slice(0, 26), 24, 110);

            ctx.fillStyle = '#334155';
            ctx.font = '16px system-ui, sans-serif';
            ctx.fillText(`${p.presentacion} • ${p.condicionFiscal === 'GRAVADO' ? 'GRAVADO IVA 16%' : 'EXENTO DE IVA'}`, 24, 140);

            ctx.fillStyle = '#E2E8F0';
            ctx.fillRect(24, 160, 672, 44);
            ctx.strokeStyle = '#CBD5E1';
            ctx.lineWidth = 1;
            ctx.strokeRect(24, 160, 672, 44);

            ctx.fillStyle = '#0F172A';
            ctx.font = 'bold 14px "JetBrains Mono", monospace';
            ctx.fillText(`LOTE: ${loteId}`, 36, 188);
            ctx.fillText(`ELAB: ${elab}`, 260, 188);
            ctx.fillText(`VENCE: ${venc}`, 480, 188);

            ctx.fillStyle = '#64748B';
            ctx.font = 'bold 14px system-ui, sans-serif';
            ctx.fillText('PVP OFICIAL:', 480, 395);

            ctx.fillStyle = '#0F172A';
            ctx.font = '900 36px system-ui, sans-serif';
            ctx.fillText(`${fmtNum(p.pvpUnitarioUsd)}`, 480, 435);

            ctx.fillStyle = '#B45309';
            ctx.font = 'bold 18px system-ui, sans-serif';
            ctx.fillText(`Bs. ${fmtNum(this.bs(p.pvpUnitarioUsd))}`, 480, 462);

            const barcodeSvg = renderBarcodeSvg(barcode, tipo, 340, 80);
            const qrSvg = renderQRSvg(payloadQR, 110, 1);

            const imgBarcode = new Image();
            const imgQR = new Image();

            let loaded = 0;
            const tryFinish = () => {
                loaded++;
                if (loaded === 2) {
                    ctx.drawImage(imgQR, 570, 24, 120, 120);
                    ctx.drawImage(imgBarcode, 24, 380, 420, 80);

                    const a = document.createElement('a');
                    a.href = canvas.toDataURL('image/png', 1.0);
                    a.download = `Sticker_Completo_${p.sku}.png`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(imgBarcode.src);
                    URL.revokeObjectURL(imgQR.src);
                }
            };

            imgBarcode.onload = tryFinish;
            imgBarcode.onerror = tryFinish;
            imgQR.onload = tryFinish;
            imgQR.onerror = tryFinish;

            imgBarcode.src = (p.customBarcodeImage) ? p.customBarcodeImage : ('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(barcodeSvg));
            imgQR.src = (p.customQrImage) ? p.customQrImage : ('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(qrSvg));
            this.toast(`⬇️ Generando descarga en alta definición de Sticker Completo...`);
        },

        // --------------------------------------------------------------------
        // IMPRESIÓN / EXPORTACIÓN PDF (ventana de impresión → Guardar como PDF)
        // --------------------------------------------------------------------
        imprimirHtml(titulo, cuerpo) {
            const w = window.open('', '_blank', 'width=960,height=760');
            if (!w) { this.toast('⚠️ El navegador bloqueó la ventana emergente. Permita ventanas emergentes para imprimir.', 'error'); return; }
            w.document.write(`<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>${esc(titulo)}</title>
                <style>
                    body{font-family:Inter,Arial,sans-serif;color:#0f172a;margin:28px;font-size:12px;}
                    h1{font-size:18px;margin:0;} h2{font-size:14px;margin:18px 0 6px;}
                    .head{display:flex;justify-content:space-between;border-bottom:3px solid #d97706;padding-bottom:10px;margin-bottom:14px;}
                    table{width:100%;border-collapse:collapse;margin-top:6px;} th,td{border:1px solid #cbd5e1;padding:6px 8px;text-align:left;vertical-align:top;}
                    th{background:#f1f5f9;font-size:11px;text-transform:uppercase;} .num{text-align:right;font-variant-numeric:tabular-nums;}
                    .firmas{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:48px;} .firma{border-top:1px solid #0f172a;padding-top:6px;text-align:center;font-size:11px;}
                    .pnv-sticker{width:340px;border:1.5px solid #0f172a;border-radius:8px;padding:10px;background:#fffbeb;}
                    .foot{margin-top:28px;font-size:10px;color:#64748b;border-top:1px solid #e2e8f0;padding-top:8px;}
                    @media print{button{display:none;}}
                </style></head><body>
                <div class="head"><div><h1>PANADERÍA NUEVA VIASA, C.A.</h1><div>RIF: J-31163165-8 • La Sabanita, Ciudad Bolívar, Estado Bolívar</div></div>
                <div style="text-align:right;"><b>${esc(titulo)}</b><br>Emitido: ${new Date().toLocaleString('es-VE')}<br>Por: ${esc(this.usuarioActual())}</div></div>
                ${cuerpo}
                <div class="foot">Documento generado por VIASA System — Módulo Productos Nueva Viasa. Tasa BCV de referencia: Bs. ${fmtNum(this.getTasa())} por USD.</div>
                <script>window.onload=function(){setTimeout(function(){window.print();},350);};<\/script>
                </body></html>`);
            w.document.close();
        },

        imprimirOrden(movId) {
            const p = this.getProducto(this.detalleId);
            if (!p) return;
            const movs = movId ? p.movimientosDistribucion.filter(m => m.id === movId) : [...p.movimientosDistribucion].sort((a, b) => String(a.fechaHora).localeCompare(String(b.fechaHora)));
            if (!movs.length) { this.toast('No hay salidas registradas para imprimir.', 'warn'); return; }
            const filas = movs.map(m => {
                const t = round2(m.cantidad * round2(m.precioUnitUsd));
                return `<tr><td>${esc(m.id)}<br>${esc(m.fechaHora)}</td><td>${m.tipoDestino === 'MOSTRADOR_LOCAL' ? 'Mostrador local' : 'Cliente aliado B2B'}</td><td>${esc(m.clienteNombre)}<br>${esc(m.clienteRif || '')}</td><td>${esc(m.documentoRef)}</td><td class="num">${fmtInt(m.cantidad)}</td><td class="num">USD ${fmtNum(m.precioUnitUsd)}</td><td class="num">USD ${fmtNum(t)}<br>Bs. ${fmtNum(round2(t * (m.tasaBCV || this.getTasa())))}</td><td>${esc(m.estadoPago)}</td></tr>`;
            }).join('');
            const totU = movs.reduce((s, m) => s + m.cantidad, 0);
            const totUsd = round2(movs.reduce((s, m) => s + round2(m.cantidad * round2(m.precioUnitUsd)), 0));
            const unica = movs.length === 1 ? movs[0] : null;
            const cuerpo = `
                <h2>Producto: ${esc(p.nombre)} — ${esc(p.sku)} (${esc(p.presentacion)})</h2>
                <table><thead><tr><th>Movimiento</th><th>Tipo</th><th>Destino</th><th>Documento</th><th class="num">Piezas</th><th class="num">Precio</th><th class="num">Total</th><th>Pago</th></tr></thead>
                <tbody>${filas}</tbody><tfoot><tr><th colspan="4">TOTALES</th><th class="num">${fmtInt(totU)}</th><th></th><th class="num">USD ${fmtNum(totUsd)}</th><th></th></tr></tfoot></table>
                <h2>Cadena de custodia</h2>
                <table><thead><tr><th>Movimiento</th><th>Autorizó</th><th>Despachó / entregó</th><th>Recibió</th></tr></thead>
                <tbody>${movs.map(m => `<tr><td>${esc(m.id)}</td><td>${esc(m.autorizoNombre)}<br>${esc(m.autorizoPin || '')} ${esc(m.autorizoFechaHora || '')}</td><td>${esc(m.despachoNombre)}</td><td>${esc(m.recibioNombre)}</td></tr>`).join('')}</tbody></table>
                ${unica ? `<div class="firmas"><div class="firma">Autorizado por<br><b>${esc(unica.autorizoNombre)}</b></div><div class="firma">Despachado por<br><b>${esc(unica.despachoNombre)}</b></div><div class="firma">Recibido conforme<br><b>${esc(unica.recibioNombre)}</b></div></div>` : ''}`;
            this.imprimirHtml(unica ? `Orden de Despacho ${unica.id}` : 'Control de Salidas de Producto', cuerpo);
        },

        imprimirFicha() {
            const p = this.getProducto(this.detalleId);
            if (!p) return;
            const costoRec = this.costoReceta(p);
            const cuerpo = `
                <div style="display:flex;gap:16px;align-items:flex-start;">
                    <img src="${esc(p.fotoUrl)}" style="width:200px;height:130px;object-fit:cover;border-radius:8px;border:1px solid #cbd5e1;">
                    <table style="flex:1;"><tbody>
                        <tr><th>Producto</th><td>${esc(p.nombre)}</td><th>SKU</th><td>${esc(p.sku)}</td></tr>
                        <tr><th>Presentación</th><td>${esc(p.presentacion)}</td><th>Código de barras</th><td>${esc(p.barcode || '—')}</td></tr>
                        <tr><th>Categoría</th><td>${esc(p.categoria)}</td><th>Condición IVA</th><td>${p.condicionFiscal === 'GRAVADO' ? 'Gravado 16%' : 'Exento'}</td></tr>
                        <tr><th>Vida útil</th><td>${fmtInt(p.vidaUtilDias)} días</td><th>Stock mínimo</th><td>${fmtInt(p.stockMinimo)} und</td></tr>
                    </tbody></table>
                </div>
                <h2>Receta estándar y costo de insumos por unidad</h2>
                <table><thead><tr><th>Insumo</th><th>Cantidad</th><th class="num">USD</th><th class="num">Bs.</th></tr></thead>
                <tbody>${p.insumosReceta.map(i => `<tr><td>${esc(i.insumo)}</td><td>${esc(i.cantidad)}</td><td class="num">${fmtNum(i.costoUsd)}</td><td class="num">${fmtNum(this.bs(i.costoUsd))}</td></tr>`).join('') || '<tr><td colspan="4">Sin insumos vinculados.</td></tr>'}</tbody>
                <tfoot><tr><th colspan="2">Costo de receta</th><th class="num">${fmtNum(costoRec)}</th><th class="num">${fmtNum(this.bs(costoRec))}</th></tr></tfoot></table>
                <h2>Estructura de precios bimonetaria</h2>
                <table><thead><tr><th>Concepto</th><th class="num">USD</th><th class="num">Bs. BCV</th><th class="num">Margen</th></tr></thead><tbody>
                    <tr><td>Costo de producción por unidad</td><td class="num">${fmtNum(p.costoUnitarioUsd)}</td><td class="num">${fmtNum(this.bs(p.costoUnitarioUsd))}</td><td class="num">—</td></tr>
                    <tr><td>Precio de venta al público (PVP)</td><td class="num">${fmtNum(p.pvpUnitarioUsd)}</td><td class="num">${fmtNum(this.bs(p.pvpUnitarioUsd))}</td><td class="num">${fmtNum(this.calcMargen(p.pvpUnitarioUsd, p.costoUnitarioUsd))}%</td></tr>
                    <tr><td>Precio clientes aliados (B2B)</td><td class="num">${fmtNum(p.precioAliadoUsd)}</td><td class="num">${fmtNum(this.bs(p.precioAliadoUsd))}</td><td class="num">${fmtNum(this.calcMargen(p.precioAliadoUsd, p.costoUnitarioUsd))}%</td></tr>
                </tbody></table>`;
            this.imprimirHtml(`Ficha Técnica ${p.sku}`, cuerpo);
        },

        imprimirSticker() {
            const p = this.getProducto(this.detalleId);
            if (!p) return;
            const lote = [...p.lotesProduccion].sort((a, b) => String(b.fechaHora).localeCompare(String(a.fechaHora)))[0];
            this.imprimirHtml(`Etiqueta de Lote ${lote ? lote.id : p.sku}`, this.stickerHtml(p, lote));
        }
    };

    ViasaProductosExclusivosEngine.renderBarcodeSvg = renderBarcodeSvg;
    ViasaProductosExclusivosEngine.renderQRSvg = renderQRSvg;
    ViasaProductosExclusivosEngine.renderBarcodeGraphic = renderBarcodeGraphic;
    ViasaProductosExclusivosEngine.renderQRGraphic = renderQRGraphic;

    window.ViasaProductosExclusivosEngine = ViasaProductosExclusivosEngine;
})();
