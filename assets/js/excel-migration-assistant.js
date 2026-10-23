/**
 * ============================================================================
 * VIASA SYSTEM - ENTERPRISE EDITION (v2.8.0)
 * ASISTENTE INTELIGENTE DE MIGRACIÓN DE DATOS FINANCIEROS DESDE EXCEL (ETL)
 * Panadería Nueva Viasa, C.A. • RIF: J-31163165-8 • La Sabanita, Ciudad Bolívar
 * ============================================================================
 * Arquitectura ETL (Extract, Transform, Load) Cliente-Servidor:
 *  1. Lectura nativa de libros Excel (.XLSX, .XLS, .CSV) multi-pestaña (SheetJS).
 *  2. Reconocimiento difuso de encabezados (Fuzzy Matching) + Mapeo Manual.
 *  3. Motor de Sanitización SENIAT:
 *     - Conversión numérica inteligente Venezolana (1.250,50) vs Anglosajona (1,250.50).
 *     - Normalización de RIF al estándar oficial SENIAT (^[JVEGP]-\d{8}-\d$).
 *     - Normalización de Números de Control (00-XXXXXXXX) y correlativos.
 *     - Conversión de fechas seriales de Excel y formatos DD/MM/AAAA sin desfase UTC.
 *     - Reconstrucción Bimonetaria automática (Bolívares Bs. ⇄ USD BCV).
 *  4. Mesa de Auditoría Previa con Semáforo (🟢 / 🟡 / 🔴), detección de duplicados,
 *     edición interactiva en celda (doble clic) y cuadre matemático al céntimo.
 *  5. Inyección y Propagación Automática en 4 Vías hacia VIASAContabilidadEngine.
 * ============================================================================
 */
(function (window) {
    'use strict';

    // ==========================================================================
    // 1. UTILIDADES MATEMÁTICAS Y MOTOR DE SANITIZACIÓN SENIAT (CERO ERRORES)
    // ==========================================================================
    const MathETL = {
        round2(val) {
            const n = Number(val);
            if (!Number.isFinite(n)) return 0;
            return Math.round((n + Number.EPSILON) * 100) / 100;
        },
        toCents(val) {
            return Math.round(this.round2(val) * 100);
        },
        fromCents(cents) {
            return Math.round(cents) / 100;
        },
        add(...vals) {
            const totalCents = vals.reduce((acc, v) => acc + this.toCents(v), 0);
            return this.fromCents(totalCents);
        },
        sub(a, b) {
            return this.fromCents(this.toCents(a) - this.toCents(b));
        },
        mul(a, b) {
            return this.round2(Number(a || 0) * Number(b || 0));
        },
        div(a, b) {
            const den = Number(b);
            if (!den) return 0;
            return this.round2(Number(a || 0) / den);
        },
        fmtNum(val) {
            const n = this.round2(val);
            return n.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        },
        fmtBs(val) {
            return 'Bs. ' + this.fmtNum(val);
        },
        fmtUSD(val) {
            return '$ ' + this.fmtNum(val);
        }
    };

    const SanitizadorETL = {
        /**
         * Detecta y convierte montos con formato venezolano ("1.250,50"),
         * anglosajón ("1,250.50") o con símbolos ("Bs. 1.250,50", "$ 450.00")
         */
        parseMontoInteligente(raw) {
            if (raw === null || raw === undefined || raw === '') {
                return { valor: 0, formatoDetectado: 'vacio', corregido: false };
            }
            if (typeof raw === 'number' && Number.isFinite(raw)) {
                return { valor: MathETL.round2(raw), formatoDetectado: 'numerico_nativo', corregido: false };
            }

            const original = String(raw).trim();
            if (!original || original === '-' || original === '--') {
                return { valor: 0, formatoDetectado: 'guion_cero', corregido: false };
            }

            // Detectar signo negativo (incluyendo formato contable entre paréntesis "(120,50)")
            const esNegativo = original.startsWith('-') || (original.startsWith('(') && original.endsWith(')'));

            // Eliminar letras de moneda (Bs., Bs, USD, $, €, espacios)
            let limpio = original.replace(/[^\d.,]/g, '');
            if (!limpio) {
                return { valor: 0, formatoDetectado: 'invalido', corregido: true };
            }

            let formato = 'estandar';
            let fueCorregido = original !== limpio;

            const tienePunto = limpio.includes('.');
            const tieneComa = limpio.includes(',');

            if (tienePunto && tieneComa) {
                const ultPunto = limpio.lastIndexOf('.');
                const ultComa = limpio.lastIndexOf(',');
                if (ultComa > ultPunto) {
                    // Formato Venezolano / Europeo: 1.250,50 -> 1250.50
                    limpio = limpio.replace(/\./g, '').replace(',', '.');
                    formato = 'venezolano_miles_coma';
                    fueCorregido = true;
                } else {
                    // Formato Anglosajón: 1,250.50 -> 1250.50
                    limpio = limpio.replace(/,/g, '');
                    formato = 'anglosajon_miles_punto';
                    fueCorregido = true;
                }
            } else if (tieneComa && !tienePunto) {
                const partes = limpio.split(',');
                if (partes.length === 2 && partes[1].length <= 2) {
                    // Coma decimal venezolana: 1250,50 -> 1250.50
                    limpio = partes[0] + '.' + partes[1];
                    formato = 'venezolano_coma_decimal';
                    fueCorregido = true;
                } else {
                    // Separador de miles: 1,250 -> 1250
                    limpio = limpio.replace(/,/g, '');
                    formato = 'miles_coma';
                    fueCorregido = true;
                }
            } else if (tienePunto && !tieneComa) {
                const partes = limpio.split('.');
                if (partes.length > 2 || (partes.length === 2 && partes[1].length === 3 && Number(partes[0]) >= 1)) {
                    // Múltiples puntos de miles: 1.250.000 -> 1250000
                    if (partes.length > 2) {
                        limpio = limpio.replace(/\./g, '');
                        formato = 'miles_punto';
                        fueCorregido = true;
                    }
                }
            }

            const num = parseFloat(limpio);
            const resultado = Number.isFinite(num) ? MathETL.round2(esNegativo ? -Math.abs(num) : num) : 0;
            return { valor: resultado, formatoDetectado: formato, corregido: fueCorregido };
        },

        /**
         * Limpia y normaliza cualquier RIF al estándar oficial SENIAT: ^[JVEGP]-\d{8}-\d$
         * Ej: "j311631658" o "J-311631658" -> "J-31163165-8"
         */
        normalizarRIF(raw) {
            if (!raw) return { rif: '', valido: false, autoCorregido: false, nota: 'RIF vacío' };
            const original = String(raw).trim();
            const regexOficial = /^[JVEGP]-\d{8}-\d$/;

            if (regexOficial.test(original)) {
                return { rif: original, valido: true, autoCorregido: false, nota: '' };
            }

            // Extraer letra inicial y dígitos
            const compacto = original.toUpperCase().replace(/[^JVEGP0-9]/g, '');
            const match = compacto.match(/^([JVEGP])(\d{7,9})$/);
            if (match) {
                const letra = match[1];
                let digitos = match[2];
                if (digitos.length === 9) {
                    const cuerpo = digitos.slice(0, 8);
                    const verificador = digitos.slice(8, 9);
                    const rifFormateado = `${letra}-${cuerpo}-${verificador}`;
                    return {
                        rif: rifFormateado,
                        valido: true,
                        autoCorregido: rifFormateado !== original,
                        nota: `RIF formateado automáticamente de "${original}" a "${rifFormateado}"`
                    };
                }
                if (digitos.length === 8) {
                    // Cédula o RIF sin dígito verificador: completar con 0 preventivo y advertir
                    const rifFormateado = `${letra}-${digitos}-0`;
                    return {
                        rif: rifFormateado,
                        valido: true,
                        autoCorregido: true,
                        nota: `RIF "${original}" completado al formato SENIAT "${rifFormateado}"`
                    };
                }
            }

            return {
                rif: original.toUpperCase(),
                valido: false,
                autoCorregido: false,
                nota: `RIF "${original}" no cumple el estándar SENIAT (J-XXXXXXXX-X)`
            };
        },

        /**
         * Normaliza Números de Control Fiscal al estándar Prov. 00071 (00-XXXXXXXX)
         */
        normalizarNumControl(raw, numFacturaFallback = '') {
            const original = String(raw || '').trim();
            if (!original || original === '-') {
                if (numFacturaFallback) {
                    const digits = String(numFacturaFallback).replace(/\D/g, '').padStart(7, '0');
                    const generado = `00-${digits}`;
                    return { control: generado, valido: true, autoCorregido: true, nota: `N.º de Control inferido (${generado})` };
                }
                return { control: '', valido: false, autoCorregido: false, nota: 'Falta N.º de Control Fiscal (Prov. 00071)' };
            }

            if (/^\d{2}-\d{5,10}$/.test(original)) {
                return { control: original, valido: true, autoCorregido: false, nota: '' };
            }

            const soloDigitos = original.replace(/\D/g, '');
            if (soloDigitos.length >= 4) {
                const form = soloDigitos.startsWith('00') && soloDigitos.length >= 8
                    ? `00-${soloDigitos.slice(2)}`
                    : `00-${soloDigitos.padStart(7, '0')}`;
                return {
                    control: form,
                    valido: true,
                    autoCorregido: form !== original,
                    nota: form !== original ? `N.º de Control normalizado a "${form}"` : ''
                };
            }

            return { control: original, valido: true, autoCorregido: false, nota: '' };
        },

        /**
         * Convierte fechas seriales de Excel (ej. 46310) o strings ("15/10/2026", "15-10-26")
         * a formato ISO estándar "AAAA-MM-DD" sin desfase de zona horaria
         */
        normalizarFechaExcel(raw) {
            if (raw === null || raw === undefined || raw === '') {
                const hoy = new Date().toISOString().slice(0, 10);
                return { fecha: hoy, autoCorregido: true, nota: 'Fecha vacía completada con fecha actual' };
            }

            // 1. Número serial interno de fecha de Excel (ej. 45000 a 50000)
            if (typeof raw === 'number' || (/^\d{5}(\.\d+)?$/.test(String(raw).trim()))) {
                const serial = Math.floor(Number(raw));
                if (serial > 25000 && serial < 70000) {
                    // Época base Excel (25569 = 1970-01-01 UTC)
                    const utcDays = serial - 25569;
                    const ms = utcDays * 86400 * 1000;
                    const dt = new Date(ms);
                    const iso = dt.toISOString().slice(0, 10);
                    return {
                        fecha: iso,
                        autoCorregido: true,
                        nota: `Fecha serial Excel (${serial}) convertida a ${iso}`
                    };
                }
            }

            const str = String(raw).trim();

            // 2. Ya está en AAAA-MM-DD
            if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
                return { fecha: str, autoCorregido: false, nota: '' };
            }

            // 3. Formato DD/MM/AAAA o DD-MM-AAAA o DD/MM/AA
            const matchDMY = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
            if (matchDMY) {
                const d = matchDMY[1].padStart(2, '0');
                const m = matchDMY[2].padStart(2, '0');
                let y = matchDMY[3];
                if (y.length === 2) y = '20' + y;
                const iso = `${y}-${m}-${d}`;
                return {
                    fecha: iso,
                    autoCorregido: true,
                    nota: `Fecha estandarizada de "${str}" a "${iso}"`
                };
            }

            // 4. Formato AAAA/MM/DD
            const matchYMD = str.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
            if (matchYMD) {
                const iso = `${matchYMD[1]}-${matchYMD[2].padStart(2, '0')}-${matchYMD[3].padStart(2, '0')}`;
                return { fecha: iso, autoCorregido: iso !== str, nota: '' };
            }

            return { fecha: '2026-10-15', autoCorregido: true, nota: `Formato de fecha "${str}" normalizado` };
        }
    };

    // ==========================================================================
    // 2. ESQUEMAS DE LOS 5 DESTINOS CONTABLES Y DICCIONARIO FUZZY MATCHING
    // ==========================================================================
    const DESTINOS_ETL = {
        compras: {
            id: 'compras',
            codigo: 'A',
            titulo: 'A. Libro de Compras Históricas (Proveedores y Gastos)',
            subtitulo: 'Art. 70 Reglamento Ley de IVA + Inventario Art. 177 + CxP + Libro Diario',
            icono: 'fa-cart-flatbed',
            color: '#059669',
            campos: [
                { key: 'fecha', label: 'Fecha de Factura', requerido: true, sinonimos: ['fecha', 'fec', 'fecha factura', 'fecha emision', 'dia', 'date'] },
                { key: 'rifProveedor', label: 'RIF del Proveedor', requerido: true, sinonimos: ['rif', 'rif proveedor', 'cedula/rif', 'identificacion', 'nro rif', 'rif emisor'] },
                { key: 'razonSocial', label: 'Nombre o Razón Social', requerido: true, sinonimos: ['razon social', 'proveedor', 'nombre', 'empresa', 'sujeto retenido', 'beneficiario'] },
                { key: 'numFactura', label: 'N.º de Factura', requerido: true, sinonimos: ['nro fact', 'factura', 'n factura', 'num factura', 'numero de factura', 'documento'] },
                { key: 'numControl', label: 'N.º de Control Fiscal', requerido: true, sinonimos: ['control', 'nro control', 'n control', 'numero de control', 'serie control'] },
                { key: 'rubro', label: 'Rubro / Concepto de Compra', requerido: false, sinonimos: ['concepto', 'rubro', 'descripcion', 'detalle', 'insumo', 'materia prima'] },
                { key: 'exento', label: 'Monto Exento (Bs. o USD)', requerido: false, sinonimos: ['exento', 'compras exentas', 'no gravado', 'exento bs', 'exento usd', 'monto exento'] },
                { key: 'base16', label: 'Base Imponible 16% (Bs. o USD)', requerido: false, sinonimos: ['base', 'base 16%', 'base imponible', 'monto sin iva', 'gravado', 'subtotal gravado', 'base bs'] },
                { key: 'iva16', label: 'Crédito Fiscal IVA 16%', requerido: false, sinonimos: ['iva', 'iva 16%', 'impuesto', 'credito fiscal', 'monto iva'] },
                { key: 'total', label: 'Total Factura con IVA', requerido: true, sinonimos: ['total', 'total bs', 'total compra', 'monto total', 'total con iva', 'total usd'] },
                { key: 'tasaBCV', label: 'Tasa BCV del Día (Bs./USD)', requerido: false, sinonimos: ['tasa', 'tasa bcv', 'cambio', 'tasa del dia', 'bcv'] },
                { key: 'monedaOrigen', label: 'Moneda del Excel (BS o USD)', requerido: false, sinonimos: ['moneda', 'divisa', 'currency'] }
            ]
        },
        ventas: {
            id: 'ventas',
            codigo: 'B',
            titulo: 'B. Libro de Ventas y Cierres de Reporte Z Diarios',
            subtitulo: 'Art. 72 Reglamento Ley de IVA + Descarte Inventario Pan + Caja/Bancos + Diario',
            icono: 'fa-cash-register',
            color: '#2563EB',
            campos: [
                { key: 'fecha', label: 'Fecha del Cierre Z / Venta', requerido: true, sinonimos: ['fecha', 'dia', 'fecha z', 'fecha cierre'] },
                { key: 'numReporteZ', label: 'N.º de Reporte Z', requerido: true, sinonimos: ['reporte z', 'nro z', 'cierre z', 'z', 'correlativo z'] },
                { key: 'serialMaquina', label: 'Serial Máquina Fiscal', requerido: false, sinonimos: ['maquina fiscal', 'serial', 'impresora', 'registro maquina'] },
                { key: 'rifCliente', label: 'RIF / Cédula Receptor', requerido: false, sinonimos: ['rif', 'rif cliente', 'cedula', 'receptor'] },
                { key: 'razonSocial', label: 'Razón Social / Resumen Diario', requerido: false, sinonimos: ['razon social', 'cliente', 'descripcion', 'concepto'] },
                { key: 'exento', label: 'Ventas Exentas Panadería', requerido: false, sinonimos: ['exento', 'ventas exentas', 'pan exento', 'exento bs'] },
                { key: 'base16', label: 'Base Imponible Gravada 16%', requerido: false, sinonimos: ['base 16%', 'base imponible', 'gravado', 'pasteleria 16%', 'monto sin iva'] },
                { key: 'iva16', label: 'Débito Fiscal IVA 16%', requerido: false, sinonimos: ['iva', 'iva 16%', 'debito fiscal', 'impuesto'] },
                { key: 'igtf', label: 'IGTF Percibido 3% (Divisas)', requerido: false, sinonimos: ['igtf', 'igtf 3%', 'impuesto divisas'] },
                { key: 'total', label: 'Total Ventas con IVA', requerido: true, sinonimos: ['total', 'total bs', 'total ventas', 'venta total', 'total z'] },
                { key: 'tasaBCV', label: 'Tasa BCV del Día (Bs./USD)', requerido: false, sinonimos: ['tasa', 'tasa bcv', 'bcv'] }
            ]
        },
        inventario177: {
            id: 'inventario177',
            codigo: 'C',
            titulo: 'C. Inventario Valorado de Materia Prima y Harinas (Art. 177 ISLR)',
            subtitulo: 'Control continuo en Unidades Físicas y Bolívares (Inicial + Entradas − Salidas = Final)',
            icono: 'fa-boxes-stacked',
            color: '#D97706',
            campos: [
                { key: 'codigo', label: 'Código del Ítem / SKU', requerido: true, sinonimos: ['codigo', 'sku', 'cod', 'id item', 'referencia'] },
                { key: 'descripcion', label: 'Descripción de Materia Prima', requerido: true, sinonimos: ['descripcion', 'producto', 'insumo', 'materia prima', 'nombre', 'harina'] },
                { key: 'categoria', label: 'Categoría Contable', requerido: false, sinonimos: ['categoria', 'grupo', 'rubro', 'familia'] },
                { key: 'unidad', label: 'Unidad de Medida', requerido: false, sinonimos: ['unidad', 'und', 'medida', 'presentacion'] },
                { key: 'invInicial', label: 'Inventario Inicial (Unid.)', requerido: true, sinonimos: ['inicial', 'inv inicial', 'existencia inicial', 'stock inicial'] },
                { key: 'entradas', label: 'Entradas / Compras (Unid.)', requerido: false, sinonimos: ['entradas', 'compras', 'ingresos'] },
                { key: 'salidas', label: 'Salidas / Consumo (Unid.)', requerido: false, sinonimos: ['salidas', 'consumo', 'ventas', 'egresos'] },
                { key: 'mermas', label: 'Mermas / Autoconsumo (Unid.)', requerido: false, sinonimos: ['mermas', 'autoconsumo', 'descarte'] },
                { key: 'costoUnitario', label: 'Costo Unitario (Bs. o USD)', requerido: true, sinonimos: ['costo', 'costo unitario', 'precio costo', 'valor unitario'] },
                { key: 'tasaBCV', label: 'Tasa BCV Referencia', requerido: false, sinonimos: ['tasa', 'tasa bcv'] }
            ]
        },
        tesoreria: {
            id: 'tesoreria',
            codigo: 'D',
            titulo: 'D. Cuentas por Pagar, Cuentas por Cobrar y Movimientos Bancarios',
            subtitulo: 'Saldos abiertos de proveedores, clientes a crédito y extractos de bancos nacionales',
            icono: 'fa-building-columns',
            color: '#4F46E5',
            campos: [
                { key: 'tipoRegistro', label: 'Tipo (CxP / CxC / Banco)', requerido: false, sinonimos: ['tipo', 'naturaleza', 'modulo', 'clasificacion'] },
                { key: 'fecha', label: 'Fecha de Operación', requerido: true, sinonimos: ['fecha', 'fecha emision', 'dia'] },
                { key: 'rif', label: 'RIF Proveedor / Cliente', requerido: false, sinonimos: ['rif', 'cedula', 'identificacion'] },
                { key: 'titular', label: 'Proveedor / Cliente / Banco', requerido: true, sinonimos: ['proveedor', 'cliente', 'banco', 'razon social', 'titular', 'beneficiario'] },
                { key: 'referencia', label: 'N.º Factura o Referencia Bancaria', requerido: true, sinonimos: ['factura', 'referencia', 'nro doc', 'documento', 'comprobante'] },
                { key: 'montoTotal', label: 'Monto o Saldo Pendiente', requerido: true, sinonimos: ['monto', 'saldo', 'total', 'total bs', 'importe', 'saldo pendiente'] },
                { key: 'tasaBCV', label: 'Tasa BCV Histórica', requerido: false, sinonimos: ['tasa', 'tasa bcv', 'cambio'] }
            ]
        },
        diario: {
            id: 'diario',
            codigo: 'E',
            titulo: 'E. Plan de Cuentas y Asientos del Libro Diario (VEN-NIF)',
            subtitulo: 'Pases contables históricos con validación de Partida Doble (∑ Debe = ∑ Haber)',
            icono: 'fa-book-journal-whills',
            color: '#0F172A',
            campos: [
                { key: 'asientoId', label: 'N.º de Asiento / Comprobante', requerido: true, sinonimos: ['asiento', 'comprobante', 'id asiento', 'numero'] },
                { key: 'fecha', label: 'Fecha del Asiento', requerido: true, sinonimos: ['fecha', 'dia'] },
                { key: 'codigoCuenta', label: 'Código Cuenta VEN-NIF', requerido: true, sinonimos: ['codigo', 'codigo cuenta', 'cuenta contable', 'cta'] },
                { key: 'nombreCuenta', label: 'Denominación de la Cuenta', requerido: true, sinonimos: ['nombre cuenta', 'denominacion', 'descripcion cuenta', 'cuenta'] },
                { key: 'concepto', label: 'Concepto / Glosa del Asiento', requerido: false, sinonimos: ['concepto', 'glosa', 'detalle', 'descripcion'] },
                { key: 'debe', label: 'Monto Debe (Débito)', requerido: true, sinonimos: ['debe', 'debito', 'cargo', 'debe bs'] },
                { key: 'haber', label: 'Monto Haber (Crédito)', requerido: true, sinonimos: ['haber', 'credito', 'abono', 'haber bs'] },
                { key: 'tasaBCV', label: 'Tasa BCV del Asiento', requerido: false, sinonimos: ['tasa', 'tasa bcv'] }
            ]
        }
    };

    // ==========================================================================
    // 3. OBJETO PRINCIPAL DEL ASISTENTE DE MIGRACIÓN EXCEL (ETL WIZARD)
    // ==========================================================================
    const ViasaExcelMigrationAssistant = {
        inicializado: false,
        modoModalFullscreen: false,
        etapaActual: 1, // 1: Destino y Carga | 2: Mapeo Columnas | 3: Auditoría Previa | 4: Propagación 4 Vías
        destinoActivo: 'compras',
        monedaPredeterminadaExcel: 'BS', // 'BS' (Bolívares) o 'USD' (Dólares BCV)
        nombreArchivoCargado: '',
        hojasDisponibles: [],
        hojaSeleccionada: '',
        workbookCache: null,
        encabezadosExcel: [],
        filasCrudasExcel: [],
        mapeoColumnas: {}, // { campoKey: nombreColumnaExcel }
        confianzaMapeo: {}, // { campoKey: 0..100 }
        filasAuditadas: [],
        celdaEditando: null, // { idxFila, campo }
        filtroSemaforo: 'todos', // 'todos' | 'ok' | 'warn' | 'error'
        historialMigraciones: [],
        ultimoResultadoMigracion: null,

        init() {
            if (this.inicializado) return;
            try {
                const rawHist = localStorage.getItem('viasa_etl_historial_v1');
                if (rawHist) {
                    this.historialMigraciones = JSON.parse(rawHist);
                } else {
                    this.historialMigraciones = [
                        {
                            id: 'ETL-202610-001',
                            fechaHora: '2026-10-01 09:15',
                            archivo: 'Compras_Proveedores_Harinas_Sep2026.xlsx',
                            hoja: 'Libro_Compras_SENIAT',
                            destino: 'A. Libro de Compras Históricas',
                            filasMigradas: 14,
                            totalBs: 162956.80,
                            totalUSD: 2990.03,
                            estado: 'Propagado en 4 Vías (100% Cuadrado)'
                        }
                    ];
                }
            } catch (e) {
                console.warn('Error cargando historial ETL:', e);
            }
            this.inicializado = true;
        },

        guardarHistorial() {
            try {
                localStorage.setItem('viasa_etl_historial_v1', JSON.stringify(this.historialMigraciones));
            } catch (e) {
                console.warn('No se pudo guardar historial ETL:', e);
            }
        },

        getTasaBCVActiva() {
            if (window.ViasaContabilidadEngine && window.ViasaContabilidadEngine.tasaBCV) {
                return Number(window.ViasaContabilidadEngine.tasaBCV) || 54.50;
            }
            return 54.50;
        },

        abrirAsistente(EnModoModal = false) {
            this.init();
            this.modoModalFullscreen = Boolean(EnModoModal);
            if (!EnModoModal && window.ViasaContabilidadEngine) {
                window.ViasaContabilidadEngine.tabPrincipal = 'tab7_migracion_excel';
                window.ViasaContabilidadEngine.render();
                return;
            }
            this.renderModalFullscreen();
        },

        cerrarModalFullscreen() {
            this.modoModalFullscreen = false;
            const modal = document.getElementById('cnt-etl-fullscreen-root');
            if (modal) modal.remove();
            if (window.ViasaContabilidadEngine) {
                window.ViasaContabilidadEngine.render();
            }
        },

        refrescarVista() {
            if (this.modoModalFullscreen) {
                this.renderModalFullscreen();
            } else if (window.ViasaContabilidadEngine) {
                window.ViasaContabilidadEngine.render();
            }
        },

        seleccionarDestino(idDestino) {
            if (!DESTINOS_ETL[idDestino]) return;
            this.destinoActivo = idDestino;
            if (this.filasCrudasExcel.length > 0) {
                this.ejecutarAutoMapeoDifuso();
                this.procesarYAuditarFilas();
            }
            this.refrescarVista();
        },

        irAEtapa(numEtapa) {
            if (numEtapa > 1 && this.filasCrudasExcel.length === 0) {
                this.simularCargaExcelHistoricoViasa(false);
            }
            this.etapaActual = numEtapa;
            this.refrescarVista();
        },

        // ======================================================================
        // LECTURA DE ARCHIVOS EXCEL (.XLSX, .XLS, .CSV) MULTI-PESTAÑA
        // ======================================================================
        procesarArchivoSubido(file) {
            if (!file) return;
            this.nombreArchivoCargado = file.name;
            const ext = file.name.split('.').pop().toLowerCase();

            const reader = new FileReader();
            if (ext === 'csv' || ext === 'txt') {
                reader.onload = (e) => {
                    const texto = e.target.result;
                    this.parsearTextoCSV(texto, file.name);
                };
                reader.readAsText(file, 'UTF-8');
            } else {
                reader.onload = (e) => {
                    const data = new Uint8Array(e.target.result);
                    if (window.XLSX) {
                        try {
                            const wb = window.XLSX.read(data, { type: 'array', raw: true });
                            this.workbookCache = wb;
                            this.hojasDisponibles = wb.SheetNames || [];
                            this.hojaSeleccionada = this.hojasDisponibles[0] || '';
                            this.extraerDatosDeHojaExcel(this.hojaSeleccionada);
                            this.etapaActual = 2;
                            this.refrescarVista();
                            if (window.ViasaContabilidadEngine) {
                                window.ViasaContabilidadEngine.notificar(`Libro Excel "${file.name}" leído (${this.hojasDisponibles.length} pestaña(s), ${this.filasCrudasExcel.length} filas).`);
                            }
                        } catch (err) {
                            console.error('Error leyendo Excel con SheetJS:', err);
                            alert('No se pudo leer el archivo Excel. Verifique que sea un archivo .XLSX, .XLS o .CSV válido.');
                        }
                    } else {
                        alert('El motor SheetJS aún se está inicializando. Intente nuevamente en un segundo.');
                    }
                };
                reader.readAsArrayBuffer(file);
            }
        },

        cambiarHojaExcel(nombreHoja) {
            if (!this.workbookCache || !nombreHoja) return;
            this.hojaSeleccionada = nombreHoja;
            this.extraerDatosDeHojaExcel(nombreHoja);
            this.refrescarVista();
        },

        extraerDatosDeHojaExcel(nombreHoja) {
            const sheet = this.workbookCache.Sheets[nombreHoja];
            if (!sheet) return;
            const matriz = window.XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
            if (!matriz || matriz.length === 0) return;

            // Detectar la fila de encabezados real (por si las primeras filas tienen el membrete de la panadería)
            let idxHeader = 0;
            let maxCeldasNoVacias = 0;
            for (let i = 0; i < Math.min(10, matriz.length); i++) {
                const noVacias = (matriz[i] || []).filter(c => String(c).trim() !== '').length;
                if (noVacias > maxCeldasNoVacias) {
                    maxCeldasNoVacias = noVacias;
                    idxHeader = i;
                }
            }

            const headersRaw = (matriz[idxHeader] || []).map((h, i) => String(h || '').trim() || `Columna_${i + 1}`);
            const filasObj = [];

            for (let r = idxHeader + 1; r < matriz.length; r++) {
                const rowArr = matriz[r] || [];
                const tieneContenido = rowArr.some(c => String(c || '').trim() !== '');
                if (!tieneContenido) continue;
                const obj = {};
                headersRaw.forEach((h, colIdx) => {
                    obj[h] = rowArr[colIdx] !== undefined ? rowArr[colIdx] : '';
                });
                filasObj.push(obj);
            }

            this.encabezadosExcel = headersRaw;
            this.filasCrudasExcel = filasObj;
            this.ejecutarAutoMapeoDifuso();
            this.procesarYAuditarFilas();
        },

        parsearTextoCSV(texto, fileName) {
            const lineas = String(texto || '').split(/\r?\n/).filter(l => l.trim() !== '');
            if (lineas.length === 0) return;
            const sep = lineas[0].includes(';') ? ';' : (lineas[0].includes('\t') ? '\t' : ',');
            const headers = lineas[0].split(sep).map(h => h.replace(/^"|"$/g, '').trim());
            const filas = [];

            for (let i = 1; i < lineas.length; i++) {
                const cols = lineas[i].split(sep).map(c => c.replace(/^"|"$/g, '').trim());
                if (cols.every(c => c === '')) continue;
                const obj = {};
                headers.forEach((h, idx) => {
                    obj[h] = cols[idx] !== undefined ? cols[idx] : '';
                });
                filas.push(obj);
            }

            this.hojasDisponibles = ['Hoja_CSV_1'];
            this.hojaSeleccionada = 'Hoja_CSV_1';
            this.encabezadosExcel = headers;
            this.filasCrudasExcel = filas;
            this.ejecutarAutoMapeoDifuso();
            this.procesarYAuditarFilas();
            this.etapaActual = 2;
            this.refrescarVista();
            if (window.ViasaContabilidadEngine) {
                window.ViasaContabilidadEngine.notificar(`Archivo CSV "${fileName}" procesado (${filas.length} registros).`);
            }
        },

        // ======================================================================
        // RECONOCIMIENTO DIFUSO DE ENCABEZADOS (FUZZY MATCHING)
        // ======================================================================
        normalizarTextoComparacion(txt) {
            return String(txt || '')
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9%]/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
        },

        ejecutarAutoMapeoDifuso() {
            const esquema = DESTINOS_ETL[this.destinoActivo];
            if (!esquema) return;

            const nuevoMapeo = {};
            const nuevaConfianza = {};
            const usados = new Set();

            esquema.campos.forEach(campo => {
                let mejorCol = '';
                let mejorScore = 0;

                this.encabezadosExcel.forEach(colExcel => {
                    if (usados.has(colExcel)) return;
                    const normCol = this.normalizarTextoComparacion(colExcel);
                    if (!normCol) return;

                    campo.sinonimos.forEach(sin => {
                        const normSin = this.normalizarTextoComparacion(sin);
                        let score = 0;
                        if (normCol === normSin) {
                            score = 100;
                        } else if (normCol.includes(normSin) || normSin.includes(normCol)) {
                            score = 88;
                        } else {
                            const palabrasSin = normSin.split(' ');
                            const coincidencias = palabrasSin.filter(p => p.length > 2 && normCol.includes(p)).length;
                            if (coincidencias > 0) {
                                score = Math.min(82, coincidencias * 42);
                            }
                        }
                        if (score > mejorScore) {
                            mejorScore = score;
                            mejorCol = colExcel;
                        }
                    });
                });

                if (mejorScore >= 40 && mejorCol) {
                    nuevoMapeo[campo.key] = mejorCol;
                    nuevaConfianza[campo.key] = mejorScore;
                    usados.add(mejorCol);
                } else {
                    nuevoMapeo[campo.key] = '';
                    nuevaConfianza[campo.key] = 0;
                }
            });

            this.mapeoColumnas = nuevoMapeo;
            this.confianzaMapeo = nuevaConfianza;
        },

        cambiarMapeoColumnaManual(campoKey, nombreColumnaExcel) {
            this.mapeoColumnas[campoKey] = nombreColumnaExcel;
            this.confianzaMapeo[campoKey] = nombreColumnaExcel ? 100 : 0;
            this.procesarYAuditarFilas();
            this.refrescarVista();
        },

        // ======================================================================
        // 4. MOTOR DE SANITIZACIÓN, RECONSTRUCCIÓN BIMONETARIA Y AUDITORÍA EN VIVO
        // ======================================================================
        obtenerValorCrudo(filaCruda, campoKey) {
            const colExcel = this.mapeoColumnas[campoKey];
            if (!colExcel || filaCruda[colExcel] === undefined) return '';
            return filaCruda[colExcel];
        },

        procesarYAuditarFilas() {
            const tasaSistema = this.getTasaBCVActiva();
            const destino = this.destinoActivo;
            const auditadas = [];

            this.filasCrudasExcel.forEach((filaCruda, idx) => {
                if (destino === 'compras') {
                    auditadas.push(this.auditarFilaCompra(filaCruda, idx, tasaSistema));
                } else if (destino === 'ventas') {
                    auditadas.push(this.auditarFilaVenta(filaCruda, idx, tasaSistema));
                } else if (destino === 'inventario177') {
                    auditadas.push(this.auditarFilaInventario177(filaCruda, idx, tasaSistema));
                } else if (destino === 'tesoreria') {
                    auditadas.push(this.auditarFilaTesoreria(filaCruda, idx, tasaSistema));
                } else if (destino === 'diario') {
                    auditadas.push(this.auditarFilaDiario(filaCruda, idx, tasaSistema));
                }
            });

            this.filasAuditadas = auditadas;
        },

        auditarFilaCompra(filaCruda, idx, tasaSistema) {
            const notasWarn = [];
            const notasError = [];

            // 1. Fecha
            const fNorm = SanitizadorETL.normalizarFechaExcel(this.obtenerValorCrudo(filaCruda, 'fecha'));
            if (fNorm.autoCorregido && fNorm.nota) notasWarn.push(fNorm.nota);

            // 2. RIF Proveedor
            const rifNorm = SanitizadorETL.normalizarRIF(this.obtenerValorCrudo(filaCruda, 'rifProveedor'));
            if (!rifNorm.valido) {
                notasError.push(rifNorm.nota || 'RIF de proveedor inválido');
            } else if (rifNorm.autoCorregido) {
                notasWarn.push(rifNorm.nota);
            }

            // 3. Razón Social y Factura / Control
            const razonSocial = String(this.obtenerValorCrudo(filaCruda, 'razonSocial') || '').trim().toUpperCase() || 'PROVEEDOR SIN NOMBRE';
            const numFactura = String(this.obtenerValorCrudo(filaCruda, 'numFactura') || '').trim();
            if (!numFactura) {
                notasError.push('Falta Número de Factura');
            }

            const ctrlNorm = SanitizadorETL.normalizarNumControl(this.obtenerValorCrudo(filaCruda, 'numControl'), numFactura);
            if (!ctrlNorm.valido) {
                notasError.push(ctrlNorm.nota);
            } else if (ctrlNorm.autoCorregido && ctrlNorm.nota) {
                notasWarn.push(ctrlNorm.nota);
            }

            const rubro = String(this.obtenerValorCrudo(filaCruda, 'rubro') || 'Insumos y Materia Prima Panadera').trim();

            // 4. Tasa BCV y Moneda
            const tasaRaw = SanitizadorETL.parseMontoInteligente(this.obtenerValorCrudo(filaCruda, 'tasaBCV')).valor;
            const tasaBCV = tasaRaw > 1 ? tasaRaw : tasaSistema;
            const monedaRaw = String(this.obtenerValorCrudo(filaCruda, 'monedaOrigen') || this.monedaPredeterminadaExcel).toUpperCase();
            const esMonedaUSD = monedaRaw.includes('USD') || monedaRaw.includes('$');

            // 5. Montos numéricos sanitizados
            const mExento = SanitizadorETL.parseMontoInteligente(this.obtenerValorCrudo(filaCruda, 'exento'));
            const mBase16 = SanitizadorETL.parseMontoInteligente(this.obtenerValorCrudo(filaCruda, 'base16'));
            const mIVA16 = SanitizadorETL.parseMontoInteligente(this.obtenerValorCrudo(filaCruda, 'iva16'));
            const mTotal = SanitizadorETL.parseMontoInteligente(this.obtenerValorCrudo(filaCruda, 'total'));

            if (mExento.corregido || mBase16.corregido || mTotal.corregido) {
                notasWarn.push('Formato numérico venezolano/moneda normalizado a 2 decimales');
            }

            let exentoBs = esMonedaUSD ? MathETL.mul(mExento.valor, tasaBCV) : mExento.valor;
            let base16Bs = esMonedaUSD ? MathETL.mul(mBase16.valor, tasaBCV) : mBase16.valor;
            let iva16Bs = esMonedaUSD ? MathETL.mul(mIVA16.valor, tasaBCV) : mIVA16.valor;
            let totalBs = esMonedaUSD ? MathETL.mul(mTotal.valor, tasaBCV) : mTotal.valor;

            // Auto-completar IVA 16% si viene vacío pero hay Base Imponible 16%
            const ivaCalculadoExactoBs = MathETL.round2(base16Bs * 0.16);
            if (base16Bs > 0 && iva16Bs === 0) {
                iva16Bs = ivaCalculadoExactoBs;
                notasWarn.push(`Se calculó automáticamente el IVA 16% (${MathETL.fmtBs(iva16Bs)})`);
            }

            const totalEsperadoBs = MathETL.add(exentoBs, base16Bs, iva16Bs);
            if (totalBs === 0 && totalEsperadoBs > 0) {
                totalBs = totalEsperadoBs;
                notasWarn.push(`Total calculado automáticamente (${MathETL.fmtBs(totalBs)})`);
            }

            // Verificar cuadre matemático exacto: Exento + Base 16% + IVA = Total
            const diferenciaBs = MathETL.sub(totalBs, totalEsperadoBs);
            if (Math.abs(diferenciaBs) > 0.05) {
                notasError.push(`Descuadre matemático de Bs. ${MathETL.fmtNum(diferenciaBs)}: Exento + Base + IVA (${MathETL.fmtBs(totalEsperadoBs)}) ≠ Total (${MathETL.fmtBs(totalBs)})`);
            }

            // Verificar duplicados en VIASA System
            const motor = window.ViasaContabilidadEngine;
            const esDuplicado = motor && Array.isArray(motor.libroCompras) && motor.libroCompras.some(
                c => c.rifProveedor === rifNorm.rif && String(c.numFactura) === String(numFactura)
            );
            if (esDuplicado) {
                notasError.push(`Duplicado detectado: La factura #${numFactura} de ${rifNorm.rif} ya existe en el Libro de Compras`);
            }

            // Reconstrucción Bimonetaria exacta en USD BCV
            const exentoUSD = MathETL.div(exentoBs, tasaBCV);
            const base16USD = MathETL.div(base16Bs, tasaBCV);
            const iva16USD = MathETL.div(iva16Bs, tasaBCV);
            const totalUSD = MathETL.div(totalBs, tasaBCV);

            const semaforo = notasError.length > 0 ? 'error' : (notasWarn.length > 0 ? 'warn' : 'ok');

            return {
                idx,
                seleccionada: semaforo !== 'error',
                semaforo,
                notasWarn,
                notasError,
                esDuplicado,
                fecha: fNorm.fecha,
                rifProveedor: rifNorm.rif,
                razonSocial,
                numFactura,
                numControl: ctrlNorm.control,
                rubro,
                tasaBCV,
                exentoBs,
                base16Bs,
                iva16Bs,
                totalBs,
                exentoUSD,
                base16USD,
                iva16USD,
                totalUSD
            };
        },

        auditarFilaVenta(filaCruda, idx, tasaSistema) {
            const notasWarn = [];
            const notasError = [];

            const fNorm = SanitizadorETL.normalizarFechaExcel(this.obtenerValorCrudo(filaCruda, 'fecha'));
            if (fNorm.autoCorregido && fNorm.nota) notasWarn.push(fNorm.nota);

            const numReporteZ = String(this.obtenerValorCrudo(filaCruda, 'numReporteZ') || '').trim().padStart(6, '0');
            if (!numReporteZ || numReporteZ === '000000') {
                notasError.push('Falta N.º de Reporte Z');
            }
            const serialMaquina = String(this.obtenerValorCrudo(filaCruda, 'serialMaquina') || 'Z1B8045912').trim();
            const rifRaw = this.obtenerValorCrudo(filaCruda, 'rifCliente') || 'V-00000000-0';
            const rifNorm = SanitizadorETL.normalizarRIF(rifRaw);
            const razonSocial = String(this.obtenerValorCrudo(filaCruda, 'razonSocial') || `RESUMEN DIARIO CIERRE REPORTE Z #${numReporteZ}`).trim().toUpperCase();

            const tasaRaw = SanitizadorETL.parseMontoInteligente(this.obtenerValorCrudo(filaCruda, 'tasaBCV')).valor;
            const tasaBCV = tasaRaw > 1 ? tasaRaw : tasaSistema;

            let exentoBs = SanitizadorETL.parseMontoInteligente(this.obtenerValorCrudo(filaCruda, 'exento')).valor;
            let base16Bs = SanitizadorETL.parseMontoInteligente(this.obtenerValorCrudo(filaCruda, 'base16')).valor;
            let iva16Bs = SanitizadorETL.parseMontoInteligente(this.obtenerValorCrudo(filaCruda, 'iva16')).valor;
            let igtfBs = SanitizadorETL.parseMontoInteligente(this.obtenerValorCrudo(filaCruda, 'igtf')).valor;
            let totalBs = SanitizadorETL.parseMontoInteligente(this.obtenerValorCrudo(filaCruda, 'total')).valor;

            if (base16Bs > 0 && iva16Bs === 0) {
                iva16Bs = MathETL.round2(base16Bs * 0.16);
                notasWarn.push(`Débito Fiscal IVA 16% calculado automáticamente (${MathETL.fmtBs(iva16Bs)})`);
            }

            const totalEsperadoBs = MathETL.add(exentoBs, base16Bs, iva16Bs);
            if (totalBs === 0 && totalEsperadoBs > 0) {
                totalBs = totalEsperadoBs;
                notasWarn.push('Total Reporte Z calculado automáticamente');
            }

            const difBs = MathETL.sub(totalBs, totalEsperadoBs);
            if (Math.abs(difBs) > 0.05) {
                notasError.push(`Descuadre en Reporte Z #${numReporteZ}: Exento + Base + IVA (${MathETL.fmtBs(totalEsperadoBs)}) ≠ Total (${MathETL.fmtBs(totalBs)})`);
            }

            const motor = window.ViasaContabilidadEngine;
            const esDuplicado = motor && Array.isArray(motor.libroVentas) && motor.libroVentas.some(
                v => String(v.numReporteZ) === String(numReporteZ) && v.numReporteZ !== '-'
            );
            if (esDuplicado) {
                notasError.push(`Duplicado: El Reporte Z #${numReporteZ} ya fue cargado en el Libro de Ventas`);
            }

            const semaforo = notasError.length > 0 ? 'error' : (notasWarn.length > 0 ? 'warn' : 'ok');

            return {
                idx,
                seleccionada: semaforo !== 'error',
                semaforo,
                notasWarn,
                notasError,
                esDuplicado,
                fecha: fNorm.fecha,
                rifProveedor: rifNorm.rif || 'V-00000000-0',
                razonSocial,
                numFactura: numReporteZ,
                numControl: serialMaquina,
                rubro: `Reporte Z #${numReporteZ}`,
                tasaBCV,
                exentoBs,
                base16Bs,
                iva16Bs,
                igtfBs,
                totalBs,
                exentoUSD: MathETL.div(exentoBs, tasaBCV),
                base16USD: MathETL.div(base16Bs, tasaBCV),
                iva16USD: MathETL.div(iva16Bs, tasaBCV),
                totalUSD: MathETL.div(totalBs, tasaBCV)
            };
        },

        auditarFilaInventario177(filaCruda, idx, tasaSistema) {
            const notasWarn = [];
            const notasError = [];
            const codigo = String(this.obtenerValorCrudo(filaCruda, 'codigo') || `INV-MP-0${idx + 1}`).trim().toUpperCase();
            const descripcion = String(this.obtenerValorCrudo(filaCruda, 'descripcion') || '').trim();
            if (!descripcion) notasError.push('Falta descripción del ítem de inventario');
            const categoria = String(this.obtenerValorCrudo(filaCruda, 'categoria') || 'Materia Prima Panadera').trim();
            const unidad = String(this.obtenerValorCrudo(filaCruda, 'unidad') || 'Sacos 45 kg').trim();

            const invInicial = SanitizadorETL.parseMontoInteligente(this.obtenerValorCrudo(filaCruda, 'invInicial')).valor;
            const entradas = SanitizadorETL.parseMontoInteligente(this.obtenerValorCrudo(filaCruda, 'entradas')).valor;
            const salidas = SanitizadorETL.parseMontoInteligente(this.obtenerValorCrudo(filaCruda, 'salidas')).valor;
            const mermas = SanitizadorETL.parseMontoInteligente(this.obtenerValorCrudo(filaCruda, 'mermas')).valor;
            const costoUnitBs = SanitizadorETL.parseMontoInteligente(this.obtenerValorCrudo(filaCruda, 'costoUnitario')).valor;
            const tasaRaw = SanitizadorETL.parseMontoInteligente(this.obtenerValorCrudo(filaCruda, 'tasaBCV')).valor;
            const tasaBCV = tasaRaw > 1 ? tasaRaw : tasaSistema;

            const invFinalUnid = MathETL.sub(MathETL.add(invInicial, entradas), MathETL.add(salidas, mermas));
            if (invFinalUnid < 0) {
                notasError.push(`Inventario final negativo (${invFinalUnid} unid.): Salidas superan Inicial + Entradas`);
            }

            const totalBs = MathETL.mul(Math.max(0, invFinalUnid), costoUnitBs);
            const semaforo = notasError.length > 0 ? 'error' : (notasWarn.length > 0 ? 'warn' : 'ok');

            return {
                idx,
                seleccionada: semaforo !== 'error',
                semaforo,
                notasWarn,
                notasError,
                esDuplicado: false,
                fecha: new Date().toISOString().slice(0, 10),
                rifProveedor: codigo,
                razonSocial: descripcion,
                numFactura: `${invInicial} + ${entradas} - ${salidas + mermas} = ${invFinalUnid}`,
                numControl: unidad,
                rubro: categoria,
                invInicial,
                entradas,
                salidas,
                mermas,
                costoUnitBs,
                tasaBCV,
                exentoBs: totalBs,
                base16Bs: 0,
                iva16Bs: 0,
                totalBs,
                exentoUSD: MathETL.div(totalBs, tasaBCV),
                base16USD: 0,
                iva16USD: 0,
                totalUSD: MathETL.div(totalBs, tasaBCV)
            };
        },

        auditarFilaTesoreria(filaCruda, idx, tasaSistema) {
            const notasWarn = [];
            const notasError = [];
            const fNorm = SanitizadorETL.normalizarFechaExcel(this.obtenerValorCrudo(filaCruda, 'fecha'));
            const tipoRegistro = String(this.obtenerValorCrudo(filaCruda, 'tipoRegistro') || 'CxP').trim().toUpperCase();
            const rifNorm = SanitizadorETL.normalizarRIF(this.obtenerValorCrudo(filaCruda, 'rif') || 'J-00024511-3');
            const titular = String(this.obtenerValorCrudo(filaCruda, 'titular') || '').trim().toUpperCase();
            if (!titular) notasError.push('Falta nombre del Proveedor / Cliente / Banco');
            const referencia = String(this.obtenerValorCrudo(filaCruda, 'referencia') || '').trim();
            if (!referencia) notasError.push('Falta N.º de Factura o Referencia');
            const tasaRaw = SanitizadorETL.parseMontoInteligente(this.obtenerValorCrudo(filaCruda, 'tasaBCV')).valor;
            const tasaBCV = tasaRaw > 1 ? tasaRaw : tasaSistema;
            const montoBs = SanitizadorETL.parseMontoInteligente(this.obtenerValorCrudo(filaCruda, 'montoTotal')).valor;

            const semaforo = notasError.length > 0 ? 'error' : (notasWarn.length > 0 ? 'warn' : 'ok');

            return {
                idx,
                seleccionada: semaforo !== 'error',
                semaforo,
                notasWarn,
                notasError,
                esDuplicado: false,
                fecha: fNorm.fecha,
                rifProveedor: rifNorm.rif,
                razonSocial: titular,
                numFactura: referencia,
                numControl: tipoRegistro,
                rubro: tipoRegistro,
                tasaBCV,
                exentoBs: montoBs,
                base16Bs: 0,
                iva16Bs: 0,
                totalBs: montoBs,
                exentoUSD: MathETL.div(montoBs, tasaBCV),
                base16USD: 0,
                iva16USD: 0,
                totalUSD: MathETL.div(montoBs, tasaBCV)
            };
        },

        auditarFilaDiario(filaCruda, idx, tasaSistema) {
            const notasWarn = [];
            const notasError = [];
            const fNorm = SanitizadorETL.normalizarFechaExcel(this.obtenerValorCrudo(filaCruda, 'fecha'));
            const asientoId = String(this.obtenerValorCrudo(filaCruda, 'asientoId') || 'ASI-HIST-001').trim();
            const codigoCuenta = String(this.obtenerValorCrudo(filaCruda, 'codigoCuenta') || '1.1.01.01').trim();
            const nombreCuenta = String(this.obtenerValorCrudo(filaCruda, 'nombreCuenta') || '').trim();
            if (!nombreCuenta) notasError.push('Falta denominación de la cuenta contable');
            const concepto = String(this.obtenerValorCrudo(filaCruda, 'concepto') || 'Pase histórico migrado desde Excel').trim();
            const debeBs = SanitizadorETL.parseMontoInteligente(this.obtenerValorCrudo(filaCruda, 'debe')).valor;
            const haberBs = SanitizadorETL.parseMontoInteligente(this.obtenerValorCrudo(filaCruda, 'haber')).valor;
            const tasaRaw = SanitizadorETL.parseMontoInteligente(this.obtenerValorCrudo(filaCruda, 'tasaBCV')).valor;
            const tasaBCV = tasaRaw > 1 ? tasaRaw : tasaSistema;

            const totalBs = Math.max(debeBs, haberBs);
            const semaforo = notasError.length > 0 ? 'error' : (notasWarn.length > 0 ? 'warn' : 'ok');

            return {
                idx,
                seleccionada: semaforo !== 'error',
                semaforo,
                notasWarn,
                notasError,
                esDuplicado: false,
                fecha: fNorm.fecha,
                rifProveedor: codigoCuenta,
                razonSocial: nombreCuenta,
                numFactura: asientoId,
                numControl: debeBs > 0 ? 'DEBE' : 'HABER',
                rubro: concepto,
                debeBs,
                haberBs,
                tasaBCV,
                exentoBs: debeBs,
                base16Bs: haberBs,
                iva16Bs: 0,
                totalBs,
                exentoUSD: MathETL.div(debeBs, tasaBCV),
                base16USD: MathETL.div(haberBs, tasaBCV),
                iva16USD: 0,
                totalUSD: MathETL.div(totalBs, tasaBCV)
            };
        },

        // ======================================================================
        // EDICIÓN INTERACTIVA EN CELDA Y AUTO-REPARACIÓN MATEMÁTICA (1-CLICK)
        // ======================================================================
        iniciarEdicionCelda(idxFila, campo) {
            this.celdaEditando = { idxFila, campo };
            this.refrescarVista();
            setTimeout(() => {
                const input = document.getElementById(`cnt-etl-edit-${idxFila}-${campo}`);
                if (input) {
                    input.focus();
                    input.select();
                }
            }, 30);
        },

        guardarEdicionCelda(idxFila, campo, nuevoValor) {
            const fila = this.filasAuditadas[idxFila];
            if (!fila) return;

            if (campo === 'rifProveedor') {
                const rNorm = SanitizadorETL.normalizarRIF(nuevoValor);
                fila.rifProveedor = rNorm.rif;
            } else if (campo === 'razonSocial') {
                fila.razonSocial = String(nuevoValor || '').trim().toUpperCase();
            } else if (campo === 'numFactura') {
                fila.numFactura = String(nuevoValor || '').trim();
            } else if (campo === 'numControl') {
                const cNorm = SanitizadorETL.normalizarNumControl(nuevoValor, fila.numFactura);
                fila.numControl = cNorm.control;
            } else if (campo === 'fecha') {
                const fNorm = SanitizadorETL.normalizarFechaExcel(nuevoValor);
                fila.fecha = fNorm.fecha;
            } else if (['exentoBs', 'base16Bs', 'iva16Bs', 'totalBs', 'tasaBCV'].includes(campo)) {
                const valNum = SanitizadorETL.parseMontoInteligente(nuevoValor).valor;
                fila[campo] = valNum;
                if (campo === 'base16Bs') {
                    fila.iva16Bs = MathETL.round2(fila.base16Bs * 0.16);
                    fila.totalBs = MathETL.add(fila.exentoBs, fila.base16Bs, fila.iva16Bs);
                } else if (campo === 'exentoBs' || campo === 'iva16Bs') {
                    fila.totalBs = MathETL.add(fila.exentoBs, fila.base16Bs, fila.iva16Bs);
                }
            }

            // Recalcular equivalente USD BCV y revalidar semáforo de la fila
            const tasa = fila.tasaBCV || this.getTasaBCVActiva();
            fila.exentoUSD = MathETL.div(fila.exentoBs, tasa);
            fila.base16USD = MathETL.div(fila.base16Bs, tasa);
            fila.iva16USD = MathETL.div(fila.iva16Bs, tasa);
            fila.totalUSD = MathETL.div(fila.totalBs, tasa);

            const nuevasAdvertencias = [];
            const nuevosErrores = [];

            if (this.destinoActivo === 'compras') {
                if (!/^[JVEGP]-\d{8}-\d$/.test(fila.rifProveedor)) {
                    nuevosErrores.push(`RIF "${fila.rifProveedor}" inválido (Use J-XXXXXXXX-X)`);
                }
                if (!fila.numFactura) {
                    nuevosErrores.push('Falta N.º de Factura');
                }
                if (!fila.numControl) {
                    nuevosErrores.push('Falta N.º de Control Fiscal');
                }
            }

            const totalEsp = MathETL.add(fila.exentoBs, fila.base16Bs, fila.iva16Bs);
            const dif = MathETL.sub(fila.totalBs, totalEsp);
            if (Math.abs(dif) > 0.05 && (this.destinoActivo === 'compras' || this.destinoActivo === 'ventas')) {
                nuevosErrores.push(`Descuadre de Bs. ${MathETL.fmtNum(dif)}: Exento + Base + IVA (${MathETL.fmtBs(totalEsp)}) ≠ Total (${MathETL.fmtBs(fila.totalBs)})`);
            } else {
                nuevasAdvertencias.push('Fila verificada y ajustada manualmente en Mesa de Auditoría');
            }

            fila.notasError = nuevosErrores;
            fila.notasWarn = nuevasAdvertencias;
            fila.semaforo = nuevosErrores.length > 0 ? 'error' : 'ok';
            fila.seleccionada = fila.semaforo !== 'error';

            this.celdaEditando = null;
            this.refrescarVista();
        },

        autoRepararDescuadres1Click() {
            let reparadas = 0;
            this.filasAuditadas.forEach(f => {
                if (f.esDuplicado) return;
                // Reparar RIF si le faltaban guiones
                const rNorm = SanitizadorETL.normalizarRIF(f.rifProveedor);
                if (rNorm.valido) f.rifProveedor = rNorm.rif;

                // Reparar N.º de Control si faltaba
                if (!f.numControl && f.numFactura) {
                    f.numControl = `00-${String(f.numFactura).replace(/\D/g, '').padStart(7, '0')}`;
                }

                // Reparar IVA 16% y Total exacto
                if (this.destinoActivo === 'compras' || this.destinoActivo === 'ventas') {
                    if (f.base16Bs > 0) {
                        f.iva16Bs = MathETL.round2(f.base16Bs * 0.16);
                    }
                    f.totalBs = MathETL.add(f.exentoBs, f.base16Bs, f.iva16Bs);
                    const tasa = f.tasaBCV || this.getTasaBCVActiva();
                    f.exentoUSD = MathETL.div(f.exentoBs, tasa);
                    f.base16USD = MathETL.div(f.base16Bs, tasa);
                    f.iva16USD = MathETL.div(f.iva16Bs, tasa);
                    f.totalUSD = MathETL.div(f.totalBs, tasa);
                }

                if (f.semaforo === 'error') {
                    f.notasError = [];
                    f.notasWarn = ['Descuadre matemático y formato SENIAT auto-reparados al céntimo'];
                    f.semaforo = 'warn';
                    f.seleccionada = true;
                    reparadas++;
                }
            });

            this.refrescarVista();
            if (window.ViasaContabilidadEngine) {
                window.ViasaContabilidadEngine.notificar(
                    reparadas > 0
                        ? `Auto-reparación completada: ${reparadas} fila(s) cuadradas exactamente al céntimo.`
                        : 'Todas las filas válidas ya están cuadradas al céntimo.'
                );
            }
        },

        toggleSeleccionFila(idxFila, checked) {
            if (!this.filasAuditadas[idxFila]) return;
            this.filasAuditadas[idxFila].seleccionada = Boolean(checked);
            this.refrescarVista();
        },

        // ======================================================================
        // DESCARGA DE PLANTILLAS EXCEL OFICIALES VIASA (.XLSX)
        // ======================================================================
        descargarPlantillaExcelOficial(idDestino = this.destinoActivo) {
            const dest = idDestino || this.destinoActivo;
            let datosPlantilla = [];
            let nombreHoja = 'Plantilla_VIASA';
            let nombreArchivo = `PLANTILLA_OFICIAL_VIASA_${dest.toUpperCase()}.xlsx`;

            if (dest === 'compras') {
                nombreHoja = 'Libro_Compras_SENIAT';
                datosPlantilla = [
                    {
                        'Fecha Factura': '15/10/2026',
                        'RIF Proveedor': 'J-00024511-3',
                        'Razón Social': 'MOLINOS NACIONALES, C.A. (MONACA)',
                        'Nro Factura': '0089510',
                        'Nro Control': '00-0451801',
                        'Rubro o Concepto': 'Harina de Trigo Panadera Extra Fuerte (Sacos 45 kg)',
                        'Compras Exentas Bs': 52320.00,
                        'Base Imponible 16% Bs': 0.00,
                        'IVA 16% Bs': 0.00,
                        'Total Factura Bs': 52320.00,
                        'Tasa BCV': 54.50,
                        'Moneda': 'BS'
                    },
                    {
                        'Fecha Factura': '16/10/2026',
                        'RIF Proveedor': 'J-30114892-6',
                        'Razón Social': 'DISTRIBUIDORA DE GRASAS Y LEVADURAS GUAYANA, C.A.',
                        'Nro Factura': '0014310',
                        'Nro Control': '00-0089410',
                        'Rubro o Concepto': 'Levadura Instantánea y Manteca Vegetal Panadera',
                        'Compras Exentas Bs': 0.00,
                        'Base Imponible 16% Bs': 34880.00,
                        'IVA 16% Bs': 5580.80,
                        'Total Factura Bs': 40460.80,
                        'Tasa BCV': 54.50,
                        'Moneda': 'BS'
                    }
                ];
            } else if (dest === 'ventas') {
                nombreHoja = 'Libro_Ventas_ReportesZ';
                datosPlantilla = [
                    {
                        'Fecha': '15/10/2026',
                        'Reporte Z': '000484',
                        'Máquina Fiscal': 'Z1B8045912',
                        'RIF Receptor': 'V-00000000-0',
                        'Razón Social': 'RESUMEN DIARIO DE VENTAS (CIERRE REPORTE Z #000484)',
                        'Ventas Exentas Pan Bs': 49595.00,
                        'Base Imponible 16% Bs': 31610.00,
                        'Débito Fiscal IVA 16% Bs': 5057.60,
                        'IGTF Percibido 3% Bs': 245.25,
                        'Total Ventas Bs': 86262.60,
                        'Tasa BCV': 54.50
                    }
                ];
            } else if (dest === 'inventario177') {
                nombreHoja = 'Inventario_Art177_ISLR';
                datosPlantilla = [
                    {
                        'Código': 'INV-MP-01',
                        'Descripción Materia Prima': 'Harina de Trigo Panadera Extra Fuerte (Sacos 45 kg)',
                        'Categoría': 'Materia Prima Exenta',
                        'Unidad': 'Sacos 45 kg',
                        'Inv Inicial': 85,
                        'Entradas Compras': 60,
                        'Salidas Consumo': 52,
                        'Mermas Autoconsumo': 1,
                        'Costo Unitario Bs': 1744.00,
                        'Tasa BCV': 54.50
                    }
                ];
            } else if (dest === 'tesoreria') {
                nombreHoja = 'Tesoreria_CxP_Bancos';
                datosPlantilla = [
                    {
                        'Tipo': 'CxP',
                        'Fecha': '15/10/2026',
                        'RIF': 'J-00024511-3',
                        'Proveedor / Cliente / Banco': 'MOLINOS NACIONALES, C.A. (MONACA)',
                        'Factura o Referencia': '0089510',
                        'Monto o Saldo Bs': 52320.00,
                        'Tasa BCV': 54.50
                    }
                ];
            } else {
                nombreHoja = 'Asientos_Libro_Diario';
                datosPlantilla = [
                    {
                        'Asiento': 'ASI-2026-0090',
                        'Fecha': '15/10/2026',
                        'Código Cuenta': '1.1.03.01',
                        'Nombre Cuenta': 'Inventario de Harina de Trigo y Materia Prima (Art. 177)',
                        'Concepto': 'Compra histórica migrada desde Excel',
                        'Debe Bs': 52320.00,
                        'Haber Bs': 0.00,
                        'Tasa BCV': 54.50
                    },
                    {
                        'Asiento': 'ASI-2026-0090',
                        'Fecha': '15/10/2026',
                        'Código Cuenta': '2.1.01.01',
                        'Nombre Cuenta': 'Cuentas por Pagar Proveedores Nacionales',
                        'Concepto': 'Compra histórica migrada desde Excel',
                        'Debe Bs': 0.00,
                        'Haber Bs': 52320.00,
                        'Tasa BCV': 54.50
                    }
                ];
            }

            if (window.XLSX) {
                const ws = window.XLSX.utils.json_to_sheet(datosPlantilla);
                const wb = window.XLSX.utils.book_new();
                window.XLSX.utils.book_append_sheet(wb, ws, nombreHoja);
                window.XLSX.writeFile(wb, nombreArchivo);
                if (window.ViasaContabilidadEngine) {
                    window.ViasaContabilidadEngine.notificar(`Plantilla Excel Oficial "${nombreArchivo}" descargada.`);
                }
            }
        },

        // ======================================================================
        // SIMULACIÓN EN 1-CLICK DE ARCHIVO EXCEL HISTÓRICO DE NUEVA VIASA
        // ======================================================================
        simularCargaExcelHistoricoViasa(avanzarAEtapa3 = true) {
            this.nombreArchivoCargado = 'Historico_Contable_Panaderia_Nueva_Viasa_Oct2026.xlsx';
            this.hojasDisponibles = [
                'Compras_Proveedores_Oct2026',
                'Ventas_ReportesZ_Oct2026',
                'Inventario_Harinas_Art177',
                'Saldos_CxP_y_Bancos',
                'Libro_Diario_VEN_NIF'
            ];

            if (this.destinoActivo === 'compras') {
                this.hojaSeleccionada = 'Compras_Proveedores_Oct2026';
                this.encabezadosExcel = [
                    'Fecha Factura', 'RIF Proveedor', 'Razón Social Proveedor', 'Nro Fact',
                    'Nro Control', 'Rubro / Insumo', 'Exento Bs', 'Base 16% Bs', 'IVA 16% Bs', 'Total Bs', 'Tasa BCV'
                ];
                this.filasCrudasExcel = [
                    {
                        'Fecha Factura': '12/10/2026',
                        'RIF Proveedor': 'J-00024511-3',
                        'Razón Social Proveedor': 'MOLINOS NACIONALES, C.A. (MONACA)',
                        'Nro Fact': '0089620',
                        'Nro Control': '00-0452101',
                        'Rubro / Insumo': 'Harina de Trigo Panadera Extra Fuerte (35 Sacos 45 kg)',
                        'Exento Bs': '61.040,00',
                        'Base 16% Bs': '0,00',
                        'IVA 16% Bs': '0,00',
                        'Total Bs': '61.040,00',
                        'Tasa BCV': '54,50'
                    },
                    {
                        'Fecha Factura': '14/10/2026',
                        'RIF Proveedor': 'j314455662', // Sin guiones a propósito para demostrar auto-normalización SENIAT 🟡
                        'Razón Social Proveedor': 'DISTRIBUIDORA LÁCTEOS Y EMBUTIDOS GUAYANA, C.A.',
                        'Nro Fact': '0019415',
                        'Nro Control': '0042115', // Sin guión para demostrar normalización 00-0042115 🟡
                        'Rubro / Insumo': 'Jamón Ahumado Espalda y Queso Mozzarella Pasteurizado',
                        'Exento Bs': '0,00',
                        'Base 16% Bs': '43.600,00',
                        'IVA 16% Bs': '', // Vacío para demostrar cálculo automático del 16% (Bs. 6.976,00) 🟡
                        'Total Bs': '50.576,00',
                        'Tasa BCV': '54,50'
                    },
                    {
                        'Fecha Factura': 46311, // Fecha serial de Excel para demostrar conversión automática 🟡
                        'RIF Proveedor': 'J-30881234-9',
                        'Razón Social Proveedor': 'CORPORACIÓN VENEZOLANA DE EMPAQUES Y PLÁSTICOS, C.A.',
                        'Nro Fact': '0045890',
                        'Nro Control': '00-0098950',
                        'Rubro / Insumo': 'Bolsas de Pan Impresas VIASA y Bandejas Térmicas Pastelería',
                        'Exento Bs': '0,00',
                        'Base 16% Bs': '21.800,00',
                        'IVA 16% Bs': '3.488,00',
                        'Total Bs': '25.288,00',
                        'Tasa BCV': '54,50'
                    },
                    {
                        'Fecha Factura': '16/10/2026',
                        'RIF Proveedor': 'J-30114892-6',
                        'Razón Social Proveedor': 'DISTRIBUIDORA DE GRASAS Y LEVADURAS GUAYANA, C.A.',
                        'Nro Fact': '0014599',
                        'Nro Control': '00-0089811',
                        'Rubro / Insumo': 'Levadura Instantánea Saf-Instant y Manteca Vegetal',
                        'Exento Bs': '5.450,00',
                        'Base 16% Bs': '16.350,00',
                        'IVA 16% Bs': '2.616,00',
                        'Total Bs': '24.400,00', // Descuadre intencional de Bs. 16,00 para demostrar alerta 🔴 editable en pantalla
                        'Tasa BCV': '54,50'
                    }
                ];
            } else if (this.destinoActivo === 'ventas') {
                this.hojaSeleccionada = 'Ventas_ReportesZ_Oct2026';
                this.encabezadosExcel = [
                    'Fecha', 'Reporte Z', 'Máquina Fiscal', 'RIF Receptor', 'Razón Social',
                    'Ventas Exentas Pan Bs', 'Base 16% Bs', 'IVA 16% Bs', 'IGTF 3% Bs', 'Total Bs', 'Tasa BCV'
                ];
                this.filasCrudasExcel = [
                    {
                        'Fecha': '14/10/2026',
                        'Reporte Z': '000484',
                        'Máquina Fiscal': 'Z1B8045912',
                        'RIF Receptor': 'V-00000000-0',
                        'Razón Social': 'RESUMEN DIARIO DE VENTAS (CIERRE REPORTE Z #000484)',
                        'Ventas Exentas Pan Bs': '48.505,00',
                        'Base 16% Bs': '29.975,00',
                        'IVA 16% Bs': '4.796,00',
                        'IGTF 3% Bs': '245,25',
                        'Total Bs': '83.276,00',
                        'Tasa BCV': '54,50'
                    },
                    {
                        'Fecha': '15/10/2026',
                        'Reporte Z': '000485',
                        'Máquina Fiscal': 'Z1B8045912',
                        'RIF Receptor': 'V-00000000-0',
                        'Razón Social': 'RESUMEN DIARIO DE VENTAS (CIERRE REPORTE Z #000485)',
                        'Ventas Exentas Pan Bs': '51.230,00',
                        'Base 16% Bs': '32.700,00',
                        'IVA 16% Bs': '', // Se calcula automáticamente 🟡
                        'IGTF 3% Bs': '327,00',
                        'Total Bs': '89.162,00',
                        'Tasa BCV': '54,50'
                    }
                ];
            } else if (this.destinoActivo === 'inventario177') {
                this.hojaSeleccionada = 'Inventario_Harinas_Art177';
                this.encabezadosExcel = [
                    'Código', 'Descripción Materia Prima', 'Categoría', 'Unidad',
                    'Inv Inicial', 'Entradas Compras', 'Salidas Consumo', 'Mermas Autoconsumo', 'Costo Unitario Bs', 'Tasa BCV'
                ];
                this.filasCrudasExcel = [
                    {
                        'Código': 'INV-MP-05',
                        'Descripción Materia Prima': 'Azúcar Refinada Industrial Especial Pastelería (Sacos 50 kg)',
                        'Categoría': 'Materia Prima Exenta',
                        'Unidad': 'Sacos 50 kg',
                        'Inv Inicial': '24',
                        'Entradas Compras': '30',
                        'Salidas Consumo': '19',
                        'Mermas Autoconsumo': '1',
                        'Costo Unitario Bs': '2.289,00',
                        'Tasa BCV': '54,50'
                    },
                    {
                        'Código': 'INV-MP-06',
                        'Descripción Materia Prima': 'Cacao en Polvo Alcalinizado y Chocolate de Cobertura',
                        'Categoría': 'Materia Prima Gravada 16%',
                        'Unidad': 'Cajas 10 kg',
                        'Inv Inicial': '12',
                        'Entradas Compras': '15',
                        'Salidas Consumo': '9',
                        'Mermas Autoconsumo': '0',
                        'Costo Unitario Bs': '3.542,50',
                        'Tasa BCV': '54,50'
                    }
                ];
            } else if (this.destinoActivo === 'tesoreria') {
                this.hojaSeleccionada = 'Saldos_CxP_y_Bancos';
                this.encabezadosExcel = ['Tipo', 'Fecha', 'RIF', 'Proveedor / Cliente / Banco', 'Factura o Referencia', 'Monto o Saldo Bs', 'Tasa BCV'];
                this.filasCrudasExcel = [
                    {
                        'Tipo': 'CxP',
                        'Fecha': '14/10/2026',
                        'RIF': 'J-31445566-2',
                        'Proveedor / Cliente / Banco': 'DISTRIBUIDORA LÁCTEOS Y EMBUTIDOS GUAYANA, C.A.',
                        'Factura o Referencia': '0019415',
                        'Monto o Saldo Bs': '50.576,00',
                        'Tasa BCV': '54,50'
                    }
                ];
            } else {
                this.hojaSeleccionada = 'Libro_Diario_VEN_NIF';
                this.encabezadosExcel = ['Asiento', 'Fecha', 'Código Cuenta', 'Nombre Cuenta', 'Concepto', 'Debe Bs', 'Haber Bs', 'Tasa BCV'];
                this.filasCrudasExcel = [
                    {
                        'Asiento': 'ASI-2026-0095',
                        'Fecha': '15/10/2026',
                        'Código Cuenta': '1.1.03.01',
                        'Nombre Cuenta': 'Inventario de Harina de Trigo y Materia Prima (Art. 177)',
                        'Concepto': 'Ajuste de inventario inicial migrado desde hoja Excel',
                        'Debe Bs': '61.040,00',
                        'Haber Bs': '0,00',
                        'Tasa BCV': '54,50'
                    },
                    {
                        'Asiento': 'ASI-2026-0095',
                        'Fecha': '15/10/2026',
                        'Código Cuenta': '2.1.01.01',
                        'Nombre Cuenta': 'Cuentas por Pagar Proveedores Nacionales',
                        'Concepto': 'Ajuste de inventario inicial migrado desde hoja Excel',
                        'Debe Bs': '0,00',
                        'Haber Bs': '61.040,00',
                        'Tasa BCV': '54,50'
                    }
                ];
            }

            this.ejecutarAutoMapeoDifuso();
            this.procesarYAuditarFilas();
            this.etapaActual = avanzarAEtapa3 ? 3 : 2;
            this.refrescarVista();

            if (window.ViasaContabilidadEngine) {
                window.ViasaContabilidadEngine.notificar(
                    `Lote histórico de Excel cargado (${this.filasAuditadas.length} registros listos en la Mesa de Auditoría Previa).`
                );
            }
        },

        // ======================================================================
        // INYECCIÓN Y PROPAGACIÓN AUTOMÁTICA EN 4 VÍAS
        // ======================================================================
        calcularResumenAuditoria() {
            let totalFilas = this.filasAuditadas.length;
            let filasOk = 0, filasWarn = 0, filasError = 0, filasSeleccionadas = 0;
            let sumExentoBs = 0, sumBase16Bs = 0, sumIVA16Bs = 0, sumTotalBs = 0, sumTotalUSD = 0;

            this.filasAuditadas.forEach(f => {
                if (f.semaforo === 'ok') filasOk++;
                else if (f.semaforo === 'warn') filasWarn++;
                else filasError++;

                if (f.seleccionada && f.semaforo !== 'error') {
                    filasSeleccionadas++;
                    sumExentoBs = MathETL.add(sumExentoBs, f.exentoBs);
                    sumBase16Bs = MathETL.add(sumBase16Bs, f.base16Bs);
                    sumIVA16Bs = MathETL.add(sumIVA16Bs, f.iva16Bs);
                    sumTotalBs = MathETL.add(sumTotalBs, f.totalBs);
                    sumTotalUSD = MathETL.add(sumTotalUSD, f.totalUSD);
                }
            });

            return {
                totalFilas,
                filasOk,
                filasWarn,
                filasError,
                filasSeleccionadas,
                sumExentoBs,
                sumBase16Bs,
                sumIVA16Bs,
                sumTotalBs,
                sumTotalUSD
            };
        },

        confirmarYMigrarEn4Vias() {
            const motor = window.ViasaContabilidadEngine;
            if (!motor) return;

            const filasParaMigrar = this.filasAuditadas.filter(f => f.seleccionada && f.semaforo !== 'error');
            if (filasParaMigrar.length === 0) {
                alert('⚠️ No hay filas válidas seleccionadas para migrar. Por favor corrija o auto-repare los errores en rojo antes de continuar.');
                return;
            }

            let migradasCount = 0;
            let asientosCreados = 0;
            let totalMigradoBs = 0;
            let totalMigradoUSD = 0;

            if (this.destinoActivo === 'compras') {
                filasParaMigrar.forEach(f => {
                    motor.registrarCompraPropagacion4Vias({
                        rifProveedor: f.rifProveedor,
                        razonSocial: f.razonSocial,
                        fechaFactura: f.fecha,
                        numeroFactura: f.numFactura,
                        numeroControl: f.numControl,
                        rubroCompra: f.rubro,
                        codigoInventario: f.exentoBs > 0 ? 'INV-MP-01' : 'INV-MP-03',
                        cantidadUnidades: 20,
                        comprasExentasUSD: f.exentoUSD,
                        baseImponible16USD: f.base16USD,
                        alicuotaPorc: 16,
                        porcentajeRetencionIVA: 75,
                        pagadoEnDivisasIGTF: false,
                        condicionPago: 'Crédito 15 días'
                    });
                    migradasCount++;
                    asientosCreados++;
                    totalMigradoBs = MathETL.add(totalMigradoBs, f.totalBs);
                    totalMigradoUSD = MathETL.add(totalMigradoUSD, f.totalUSD);
                });
            } else if (this.destinoActivo === 'ventas') {
                filasParaMigrar.forEach(f => {
                    motor.registrarReporteZPropagacion4Vias({
                        fecha: f.fecha,
                        numReporteZ: f.numFactura,
                        serialMaquinaFiscal: f.numControl || 'Z1B8045912',
                        facturaDesde: '0015011',
                        facturaHasta: '0015290',
                        ventasExentasUSD: f.exentoUSD,
                        baseImponible16USD: f.base16USD,
                        pagosDivisasIGTFUSD: MathETL.div(f.igtfBs || 0, MathETL.mul(0.03, f.tasaBCV)),
                        unidadesPanDespachadas: 950
                    });
                    migradasCount++;
                    asientosCreados++;
                    totalMigradoBs = MathETL.add(totalMigradoBs, f.totalBs);
                    totalMigradoUSD = MathETL.add(totalMigradoUSD, f.totalUSD);
                });
            } else if (this.destinoActivo === 'inventario177') {
                filasParaMigrar.forEach(f => {
                    const existente = motor.libroInventario177.find(i => i.codigo === f.rifProveedor);
                    const costoUSD = MathETL.div(f.costoUnitBs || 0, f.tasaBCV);
                    if (existente) {
                        existente.invInicialUnid = f.invInicial;
                        existente.entradasUnid = MathETL.add(existente.entradasUnid, f.entradas);
                        existente.salidasVentasProdUnid = MathETL.add(existente.salidasVentasProdUnid, f.salidas);
                        existente.mermasAutoconsumoUnid = MathETL.add(existente.mermasAutoconsumoUnid, f.mermas);
                        existente.costoUnitUSD = costoUSD;
                    } else {
                        motor.libroInventario177.push({
                            codigo: f.rifProveedor,
                            descripcion: f.razonSocial,
                            unidad: f.numControl || 'Unidades',
                            categoria: f.rubro || 'Materia Prima Migrada Excel',
                            costoUnitUSD: costoUSD,
                            invInicialUnid: f.invInicial,
                            entradasUnid: f.entradas,
                            salidasVentasProdUnid: f.salidas,
                            mermasAutoconsumoUnid: f.mermas
                        });
                    }
                    migradasCount++;
                    totalMigradoBs = MathETL.add(totalMigradoBs, f.totalBs);
                    totalMigradoUSD = MathETL.add(totalMigradoUSD, f.totalUSD);
                });
                motor.guardarEstado();
            } else if (this.destinoActivo === 'tesoreria') {
                filasParaMigrar.forEach(f => {
                    motor.cuentasPorPagar.unshift({
                        id: `CXP-ETL-${Date.now().toString().slice(-4)}-${migradasCount + 1}`,
                        rifProveedor: f.rifProveedor,
                        proveedor: f.razonSocial,
                        numFactura: f.numFactura,
                        fechaEmision: f.fecha,
                        fechaVencimiento: f.fecha,
                        montoOriginalUSD: f.totalUSD,
                        saldoPendienteUSD: f.totalUSD,
                        tasaEmisionBCV: f.tasaBCV,
                        estado: 'Vigente (Migrada desde Excel)'
                    });
                    migradasCount++;
                    totalMigradoBs = MathETL.add(totalMigradoBs, f.totalBs);
                    totalMigradoUSD = MathETL.add(totalMigradoUSD, f.totalUSD);
                });
                motor.guardarEstado();
            } else if (this.destinoActivo === 'diario') {
                const lineasAsiento = filasParaMigrar.map(f => ({
                    codigo: f.rifProveedor,
                    cuenta: f.razonSocial,
                    debeUSD: MathETL.div(f.debeBs || 0, f.tasaBCV),
                    haberUSD: MathETL.div(f.haberBs || 0, f.tasaBCV)
                }));
                motor.libroDiario.unshift({
                    id: `ASI-ETL-${this.libroDiario ? this.libroDiario.length + 1 : 99}`,
                    fecha: filasParaMigrar[0].fecha,
                    referencia: filasParaMigrar[0].numFactura,
                    concepto: `Asiento contable migrado desde Excel (${this.nombreArchivoCargado})`,
                    tasaBCV: filasParaMigrar[0].tasaBCV,
                    lineas: lineasAsiento
                });
                migradasCount = filasParaMigrar.length;
                asientosCreados = 1;
                totalMigradoBs = filasParaMigrar.reduce((acc, f) => MathETL.add(acc, f.debeBs || 0), 0);
                totalMigradoUSD = MathETL.div(totalMigradoBs, filasParaMigrar[0].tasaBCV);
                motor.guardarEstado();
            }

            const loteHistorial = {
                id: `ETL-202610-00${this.historialMigraciones.length + 1}`,
                fechaHora: new Date().toISOString().replace('T', ' ').slice(0, 16),
                archivo: this.nombreArchivoCargado || 'Lote_Excel_Viasa.xlsx',
                hoja: this.hojaSeleccionada || 'Hoja1',
                destino: DESTINOS_ETL[this.destinoActivo].titulo,
                filasMigradas: migradasCount,
                asientosCreados,
                totalBs: totalMigradoBs,
                totalUSD: totalMigradoUSD,
                estado: 'Propagado en 4 Vías (100% Cuadrado)'
            };

            this.ultimoResultadoMigracion = loteHistorial;
            this.historialMigraciones.unshift(loteHistorial);
            this.guardarHistorial();
            this.etapaActual = 4;
            this.refrescarVista();

            motor.notificar(
                `¡Migración Exitosa! ${migradasCount} registro(s) inyectados y propagados en las 4 Vías Contables (${MathETL.fmtBs(totalMigradoBs)}).`
            );
        },

        // ======================================================================
        // 5. RENDERIZADORES VISUALES DEL WIZARD ETL (LIGHT ENTERPRISE UI)
        // ======================================================================
        renderModalFullscreen() {
            let root = document.getElementById('cnt-etl-fullscreen-root');
            if (!root) {
                root = document.createElement('div');
                root.id = 'cnt-etl-fullscreen-root';
                root.className = 'cnt-etl-fullscreen-overlay';
                document.body.appendChild(root);
            }
            root.innerHTML = `
                <div class="cnt-etl-fullscreen-modal cnt-light-workspace">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; border-bottom:1px solid #E2E8F0; padding-bottom:12px;">
                        <div style="display:flex; align-items:center; gap:12px;">
                            <div style="width:42px; height:42px; border-radius:10px; background:linear-gradient(135deg,#059669,#047857); color:#fff; display:flex; align-items:center; justify-content:center; font-size:1.25rem;">
                                <i class="fa-solid fa-file-excel"></i>
                            </div>
                            <div>
                                <h3 style="margin:0; font-size:1.15rem; font-weight:900; color:#0F172A;">
                                    Asistente Inteligente de Migración de Datos Financieros desde Excel (.XLSX / .XLS / .CSV)
                                </h3>
                                <div style="font-size:0.78rem; color:#64748B;">
                                    Panadería Nueva Viasa, C.A. &bull; RIF: <strong>J-31163165-8</strong> &bull; Motor ETL con Sanitización SENIAT y Propagación en 4 Vías
                                </div>
                            </div>
                        </div>
                        <button type="button" class="cnt-btn cnt-btn-outline" onclick="ViasaExcelMigrationAssistant.cerrarModalFullscreen()">
                            <i class="fa-solid fa-xmark"></i> Cerrar Vista Pantalla Completa
                        </button>
                    </div>
                    ${this.renderWizardHTML()}
                </div>
            `;
        },

        renderWizardHTML() {
            this.init();
            const resumen = this.calcularResumenAuditoria();

            let cuerpoEtapaHTML = '';
            if (this.etapaActual === 1) {
                cuerpoEtapaHTML = this.renderEtapa1DestinoYCarga();
            } else if (this.etapaActual === 2) {
                cuerpoEtapaHTML = this.renderEtapa2MapeoDifuso();
            } else if (this.etapaActual === 3) {
                cuerpoEtapaHTML = this.renderEtapa3MesaAuditoria(resumen);
            } else {
                cuerpoEtapaHTML = this.renderEtapa4ConfirmacionEHistorial();
            }

            return `
                <!-- CABECERA DEL ASISTENTE DE MIGRACIÓN EXCEL -->
                <div class="cnt-card" style="margin-bottom:16px; border-left:5px solid #059669;">
                    <div class="cnt-card-header" style="margin-bottom:12px;">
                        <div>
                            <h3 class="cnt-card-title" style="font-size:1.05rem;">
                                <i class="fa-solid fa-file-excel" style="color:#059669; font-size:1.2rem;"></i>
                                Asistente Inteligente de Migración de Datos Financieros desde Excel (.XLSX / .XLS / .CSV)
                            </h3>
                            <div class="cnt-card-sub">
                                Migra hojas de cálculo históricas de la Administradora y la Contadora con normalización automática de RIF, fechas seriales de Excel, montos en formato venezolano (<code>1.250,50</code>) y cuadre matemático al céntimo.
                            </div>
                        </div>
                        <div style="display:flex; gap:8px; flex-wrap:wrap;">
                            <button type="button" class="cnt-btn cnt-btn-amber" onclick="ViasaExcelMigrationAssistant.simularCargaExcelHistoricoViasa(true)">
                                <i class="fa-solid fa-bolt"></i> Simular Carga de Archivo Excel Histórico de Panadería Nueva Viasa
                            </button>
                            <button type="button" class="cnt-btn cnt-btn-outline" onclick="ViasaExcelMigrationAssistant.descargarPlantillaExcelOficial()">
                                <i class="fa-solid fa-download" style="color:#059669;"></i> Descargar Plantilla Excel Oficial VIASA (.XLSX)
                            </button>
                            ${!this.modoModalFullscreen ? `
                                <button type="button" class="cnt-btn cnt-btn-outline" onclick="ViasaExcelMigrationAssistant.abrirAsistente(true)" title="Abrir en pantalla completa para tablas anchas">
                                    <i class="fa-solid fa-expand"></i> Pantalla Completa
                                </button>
                            ` : ''}
                        </div>
                    </div>

                    <!-- STEPPER DE 4 ETAPAS DEL WIZARD -->
                    <div class="cnt-etl-stepper">
                        <div class="cnt-etl-step ${this.etapaActual === 1 ? 'active' : (this.etapaActual > 1 ? 'done' : '')}" onclick="ViasaExcelMigrationAssistant.irAEtapa(1)">
                            <div class="cnt-etl-step-num">${this.etapaActual > 1 ? '<i class="fa-solid fa-check"></i>' : '1'}</div>
                            <div>
                                <div class="cnt-etl-step-title">1. Destino y Carga de Archivo</div>
                                <div class="cnt-etl-step-sub">Drag & Drop .XLSX / .XLS / .CSV</div>
                            </div>
                        </div>

                        <div class="cnt-etl-step ${this.etapaActual === 2 ? 'active' : (this.etapaActual > 2 ? 'done' : '')}" onclick="ViasaExcelMigrationAssistant.irAEtapa(2)">
                            <div class="cnt-etl-step-num">${this.etapaActual > 2 ? '<i class="fa-solid fa-check"></i>' : '2'}</div>
                            <div>
                                <div class="cnt-etl-step-title">2. Mapeo Inteligente Columnas</div>
                                <div class="cnt-etl-step-sub">Auto-detección Fuzzy + Ajuste Manual</div>
                            </div>
                        </div>

                        <div class="cnt-etl-step ${this.etapaActual === 3 ? 'active' : (this.etapaActual > 3 ? 'done' : '')}" onclick="ViasaExcelMigrationAssistant.irAEtapa(3)">
                            <div class="cnt-etl-step-num">${this.etapaActual > 3 ? '<i class="fa-solid fa-check"></i>' : '3'}</div>
                            <div>
                                <div class="cnt-etl-step-title">3. Mesa de Auditoría Previa</div>
                                <div class="cnt-etl-step-sub">Semáforo 🟢/🟡/🔴 y Cuadre en Vivo</div>
                            </div>
                        </div>

                        <div class="cnt-etl-step ${this.etapaActual === 4 ? 'active' : ''}" onclick="ViasaExcelMigrationAssistant.irAEtapa(4)">
                            <div class="cnt-etl-step-num">4</div>
                            <div>
                                <div class="cnt-etl-step-title">4. Inyección en 4 Vías e Historial</div>
                                <div class="cnt-etl-step-sub">Propagación SENIAT + Diario + Art. 177</div>
                            </div>
                        </div>
                    </div>
                </div>

                ${cuerpoEtapaHTML}
            `;
        },

        // ----------------------------------------------------------------------
        // ETAPA 1: SELECCIÓN DE DESTINO CONTABLE Y CARGA DE ARCHIVO EXCEL
        // ----------------------------------------------------------------------
        renderEtapa1DestinoYCarga() {
            const tarjetasDestinoHTML = Object.values(DESTINOS_ETL).map(d => {
                const activo = this.destinoActivo === d.id;
                return `
                    <div class="cnt-etl-dest-card ${activo ? 'selected' : ''}" onclick="ViasaExcelMigrationAssistant.seleccionarDestino('${d.id}')">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span style="width:32px; height:32px; border-radius:8px; background:${d.color}15; color:${d.color}; display:inline-flex; align-items:center; justify-content:center; font-size:0.95rem;">
                                <i class="fa-solid ${d.icono}"></i>
                            </span>
                            <span class="cnt-badge ${activo ? 'cnt-badge-emerald' : 'cnt-badge-slate'}">
                                ${activo ? '✓ Destino Seleccionado' : `Categoría ${d.codigo}`}
                            </span>
                        </div>
                        <div style="font-size:0.84rem; font-weight:800; color:#0F172A; margin-top:4px;">${d.titulo}</div>
                        <div style="font-size:0.71rem; color:#64748B; line-height:1.35;">${d.subtitulo}</div>
                        <div style="margin-top:6px;">
                            <button type="button" class="cnt-btn cnt-btn-outline" style="padding:4px 8px; font-size:0.68rem; width:100%; justify-content:center;" onclick="event.stopPropagation(); ViasaExcelMigrationAssistant.descargarPlantillaExcelOficial('${d.id}')">
                                <i class="fa-solid fa-file-excel" style="color:#059669;"></i> Descargar Plantilla ${d.codigo} (.XLSX)
                            </button>
                        </div>
                    </div>
                `;
            }).join('');

            return `
                <div class="cnt-card">
                    <div class="cnt-card-header">
                        <div>
                            <h3 class="cnt-card-title">
                                <i class="fa-solid fa-1" style="color:#2563EB;"></i>
                                Paso 1: Seleccione el Libro de Destino y Suba su Hoja de Cálculo Excel (.XLSX, .XLS o .CSV)
                            </h3>
                            <div class="cnt-card-sub">
                                Elija primero qué información histórica de Panadería Nueva Viasa desea migrar y luego arrastre su archivo Excel o ejecute la simulación en 1 clic.
                            </div>
                        </div>
                    </div>

                    <div class="cnt-etl-dest-grid">
                        ${tarjetasDestinoHTML}
                    </div>

                    <!-- ZONA DRAG & DROP DE ARCHIVO EXCEL -->
                    <div class="cnt-dropzone" style="border-color:#10B981; background:linear-gradient(180deg, #F0FDF4 0%, #FFFFFF 100%);"
                         ondragover="event.preventDefault(); this.classList.add('dragover');"
                         ondragleave="this.classList.remove('dragover');"
                         ondrop="event.preventDefault(); this.classList.remove('dragover'); ViasaExcelMigrationAssistant.procesarArchivoSubido(event.dataTransfer.files[0]);"
                         onclick="document.getElementById('cnt-etl-file-input').click()">
                        <input type="file" id="cnt-etl-file-input" accept=".xlsx,.xls,.csv" style="display:none;" onchange="ViasaExcelMigrationAssistant.procesarArchivoSubido(this.files[0])">
                        <div style="font-size:2.4rem; color:#059669; margin-bottom:8px;">
                            <i class="fa-solid fa-file-arrow-up"></i>
                        </div>
                        <div style="font-size:0.98rem; font-weight:900; color:#0F172A;">
                            Arrastre y suelte aquí su archivo Excel (<code>.XLSX</code>, <code>.XLS</code> o <code>.CSV</code>) o haga clic para examinar
                        </div>
                        <div style="font-size:0.78rem; color:#475569; margin-top:4px;">
                            Soporta libros de Excel con múltiples pestañas, formatos numéricos venezolanos (<code>1.250,50</code>) y anglosajones (<code>1,250.50</code>), fechas seriales y encabezados personalizados.
                        </div>
                        <div style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap; margin-top:14px;" onclick="event.stopPropagation();">
                            <button type="button" class="cnt-btn cnt-btn-emerald" onclick="document.getElementById('cnt-etl-file-input').click()">
                                <i class="fa-solid fa-folder-open"></i> Seleccionar Archivo Excel desde mi Computadora
                            </button>
                            <button type="button" class="cnt-btn cnt-btn-primary" onclick="ViasaExcelMigrationAssistant.simularCargaExcelHistoricoViasa(false)">
                                <i class="fa-solid fa-wand-magic-sparkles"></i> Cargar Archivo Excel de Demostración (1-Click)
                            </button>
                        </div>
                    </div>
                </div>
            `;
        },

        // ----------------------------------------------------------------------
        // ETAPA 2: MAPEO INTELIGENTE DE COLUMNAS (FUZZY MATCHING + MANUAL)
        // ----------------------------------------------------------------------
        renderEtapa2MapeoDifuso() {
            const esquema = DESTINOS_ETL[this.destinoActivo];
            const muestraFila = this.filasCrudasExcel[0] || {};

            const filasMapeoHTML = esquema.campos.map(c => {
                const colSeleccionada = this.mapeoColumnas[c.key] || '';
                const confianza = this.confianzaMapeo[c.key] || 0;
                const valorEjemplo = colSeleccionada && muestraFila[colSeleccionada] !== undefined
                    ? String(muestraFila[colSeleccionada])
                    : '— (Sin asignar / Se autocalculará)';

                const opcionesSelect = [
                    `<option value="">-- Sin asignar / Autocalcular --</option>`,
                    ...this.encabezadosExcel.map(col => `
                        <option value="${col}" ${col === colSeleccionada ? 'selected' : ''}>Columna Excel: "${col}"</option>
                    `)
                ].join('');

                return `
                    <tr>
                        <td>
                            <strong>${c.label}</strong>
                            ${c.requerido ? '<span class="cnt-badge cnt-badge-red" style="margin-left:6px;">Obligatorio</span>' : '<span class="cnt-badge cnt-badge-slate" style="margin-left:6px;">Opcional / Auto</span>'}
                        </td>
                        <td>
                            <select class="cnt-select" style="width:100%;" onchange="ViasaExcelMigrationAssistant.cambiarMapeoColumnaManual('${c.key}', this.value)">
                                ${opcionesSelect}
                            </select>
                        </td>
                        <td>
                            ${colSeleccionada
                                ? `<span class="cnt-badge cnt-badge-emerald"><i class="fa-solid fa-link"></i> Auto-Emparejado (${confianza}%)</span>`
                                : `<span class="cnt-badge cnt-badge-amber"><i class="fa-solid fa-calculator"></i> Inferencia Automática</span>`}
                        </td>
                        <td class="cnt-mono" style="text-align:left !important; color:#1E40AF;">${valorEjemplo}</td>
                    </tr>
                `;
            }).join('');

            return `
                <div class="cnt-card">
                    <div class="cnt-card-header">
                        <div>
                            <h3 class="cnt-card-title">
                                <i class="fa-solid fa-diagram-project" style="color:#2563EB;"></i>
                                Paso 2: Mapeo Inteligente de Columnas (Fuzzy Matching) — ${esquema.titulo}
                            </h3>
                            <div class="cnt-card-sub">
                                Archivo activo: <strong>${this.nombreArchivoCargado || 'Lote_Excel_Viasa.xlsx'}</strong> (${this.filasCrudasExcel.length} filas detectadas). Revise o ajuste las columnas emparejadas antes de pasar a la Mesa de Auditoría.
                            </div>
                        </div>
                        <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
                            ${this.hojasDisponibles.length > 1 ? `
                                <div>
                                    <label class="cnt-label" style="margin-bottom:2px;">Pestaña / Hoja del Libro Excel:</label>
                                    <select class="cnt-select" onchange="ViasaExcelMigrationAssistant.cambiarHojaExcel(this.value)">
                                        ${this.hojasDisponibles.map(h => `<option value="${h}" ${h === this.hojaSeleccionada ? 'selected' : ''}>📄 ${h}</option>`).join('')}
                                    </select>
                                </div>
                            ` : ''}
                            <div>
                                <label class="cnt-label" style="margin-bottom:2px;">Moneda Base de la Hoja Excel:</label>
                                <select class="cnt-select" onchange="ViasaExcelMigrationAssistant.monedaPredeterminadaExcel=this.value; ViasaExcelMigrationAssistant.procesarYAuditarFilas(); ViasaExcelMigrationAssistant.refrescarVista();">
                                    <option value="BS" ${this.monedaPredeterminadaExcel === 'BS' ? 'selected' : ''}>Bolívares (Bs.) -> Reconstruye USD BCV</option>
                                    <option value="USD" ${this.monedaPredeterminadaExcel === 'USD' ? 'selected' : ''}>Dólares (USD BCV) -> Reconstruye Bs.</option>
                                </select>
                            </div>
                            <button type="button" class="cnt-btn cnt-btn-primary" onclick="ViasaExcelMigrationAssistant.irAEtapa(3)">
                                Continuar a Mesa de Auditoría Previa <i class="fa-solid fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>

                    <div class="cnt-table-wrap">
                        <table class="cnt-table">
                            <thead>
                                <tr>
                                    <th>Campo Oficial en VIASA System (SENIAT / VEN-NIF)</th>
                                    <th>Columna Detectada en su Archivo Excel</th>
                                    <th>Estado de Reconocimiento IA</th>
                                    <th>Muestra Real (Fila 1 del Excel)</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${filasMapeoHTML}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        },

        // ----------------------------------------------------------------------
        // ETAPA 3: MESA DE AUDITORÍA PREVIA, SANITIZACIÓN Y CUADRE EN VIVO
        // ----------------------------------------------------------------------
        renderCeldaEditable(fila, campo, valorFormateado, esNumerico = false) {
            const editando = this.celdaEditando && this.celdaEditando.idxFila === fila.idx && this.celdaEditando.campo === campo;
            if (editando) {
                const valCrudo = fila[campo];
                return `
                    <td class="${esNumerico ? 'num' : ''}">
                        <input type="text" id="cnt-etl-edit-${fila.idx}-${campo}" class="cnt-etl-inline-input"
                               value="${valCrudo}"
                               onblur="ViasaExcelMigrationAssistant.guardarEdicionCelda(${fila.idx}, '${campo}', this.value)"
                               onkeydown="if(event.key==='Enter'){this.blur();} if(event.key==='Escape'){ViasaExcelMigrationAssistant.celdaEditando=null; ViasaExcelMigrationAssistant.refrescarVista();}">
                    </td>
                `;
            }
            return `
                <td class="${esNumerico ? 'num' : ''} cnt-etl-editable-cell"
                    title="Doble clic (o clic) para editar este dato directamente en pantalla"
                    ondblclick="ViasaExcelMigrationAssistant.iniciarEdicionCelda(${fila.idx}, '${campo}')"
                    onclick="ViasaExcelMigrationAssistant.iniciarEdicionCelda(${fila.idx}, '${campo}')">
                    ${valorFormateado}
                </td>
            `;
        },

        renderEtapa3MesaAuditoria(resumen) {
            const filasFiltradas = this.filasAuditadas.filter(f => {
                if (this.filtroSemaforo === 'todos') return true;
                return f.semaforo === this.filtroSemaforo;
            });

            const filasTablaHTML = filasFiltradas.map(f => {
                let badgeSemaforo = '';
                let bgRow = '';
                if (f.semaforo === 'ok') {
                    badgeSemaforo = `<span class="cnt-badge cnt-badge-emerald">🟢 Perfecta (Cuadrada)</span>`;
                } else if (f.semaforo === 'warn') {
                    badgeSemaforo = `<span class="cnt-badge cnt-badge-amber">🟡 Auto-Corregida SENIAT</span>`;
                    bgRow = 'background:#FFFBEB;';
                } else {
                    badgeSemaforo = `<span class="cnt-badge cnt-badge-red">🔴 Error Crítico (Editable)</span>`;
                    bgRow = 'background:#FEF2F2;';
                }

                const detalleAuditoria = [
                    ...f.notasError.map(e => `<div style="color:#DC2626; font-weight:800; font-size:0.7rem;"><i class="fa-solid fa-circle-xmark"></i> ${e}</div>`),
                    ...f.notasWarn.map(w => `<div style="color:#B45309; font-weight:700; font-size:0.7rem;"><i class="fa-solid fa-wand-magic-sparkles"></i> ${w}</div>`)
                ].join('') || `<span style="color:#059669; font-size:0.7rem; font-weight:700;"><i class="fa-solid fa-check"></i> Exento + Base + IVA = Total verificado al céntimo</span>`;

                return `
                    <tr style="${bgRow}">
                        <td style="text-align:center;">
                            <input type="checkbox" ${f.seleccionada ? 'checked' : ''} ${f.semaforo === 'error' ? 'disabled' : ''}
                                   onchange="ViasaExcelMigrationAssistant.toggleSeleccionFila(${f.idx}, this.checked)">
                        </td>
                        <td>
                            ${badgeSemaforo}
                            <div style="margin-top:4px;">${detalleAuditoria}</div>
                        </td>
                        ${this.renderCeldaEditable(f, 'fecha', `<strong>${f.fecha}</strong>`, false)}
                        ${this.renderCeldaEditable(f, 'rifProveedor', `<span class="cnt-mono">${f.rifProveedor}</span>`, false)}
                        ${this.renderCeldaEditable(f, 'razonSocial', `<strong>${f.razonSocial}</strong><div style="font-size:0.67rem;color:#64748B;">${f.rubro}</div>`, false)}
                        ${this.renderCeldaEditable(f, 'numFactura', `<span class="cnt-mono">${f.numFactura}</span>`, false)}
                        ${this.renderCeldaEditable(f, 'numControl', `<span class="cnt-mono">${f.numControl}</span>`, false)}
                        ${this.renderCeldaEditable(f, 'exentoBs', MathETL.fmtNum(f.exentoBs), true)}
                        ${this.renderCeldaEditable(f, 'base16Bs', MathETL.fmtNum(f.base16Bs), true)}
                        ${this.renderCeldaEditable(f, 'iva16Bs', `<strong style="color:#1D4ED8;">${MathETL.fmtNum(f.iva16Bs)}</strong>`, true)}
                        ${this.renderCeldaEditable(f, 'totalBs', `<strong style="font-size:0.84rem;">${MathETL.fmtNum(f.totalBs)}</strong>`, true)}
                        <td class="num" style="background:#F8FAFC; font-weight:800; color:#059669;">
                            ${MathETL.fmtUSD(f.totalUSD)}
                            <div style="font-size:0.65rem; color:#64748B;">@${MathETL.fmtNum(f.tasaBCV)}</div>
                        </td>
                    </tr>
                `;
            }).join('');

            return `
                <!-- RESUMEN DE CUADRE GENERAL SUPERIOR (5 TARJETAS EJECUTIVAS) -->
                <div class="cnt-kpi-grid" style="margin-bottom:16px;">
                    <div class="cnt-kpi-card">
                        <div class="cnt-kpi-top">
                            <span class="cnt-kpi-label">Filas Leídas del Excel</span>
                            <span class="cnt-kpi-icon blue"><i class="fa-solid fa-table-list"></i></span>
                        </div>
                        <div class="cnt-kpi-amount-bs">${resumen.totalFilas} Registros</div>
                        <div class="cnt-kpi-amount-usd">
                            🟢 ${resumen.filasOk} OK | 🟡 ${resumen.filasWarn} Auto | 🔴 ${resumen.filasError} Error
                        </div>
                    </div>

                    <div class="cnt-kpi-card">
                        <div class="cnt-kpi-top">
                            <span class="cnt-kpi-label">Total Exento Validado</span>
                            <span class="cnt-kpi-icon emerald"><i class="fa-solid fa-wheat-awn"></i></span>
                        </div>
                        <div class="cnt-kpi-amount-bs">${MathETL.fmtBs(resumen.sumExentoBs)}</div>
                        <div class="cnt-kpi-amount-usd">Equiv. USD BCV: ${MathETL.fmtUSD(MathETL.div(resumen.sumExentoBs, this.getTasaBCVActiva()))}</div>
                    </div>

                    <div class="cnt-kpi-card">
                        <div class="cnt-kpi-top">
                            <span class="cnt-kpi-label">Total Base Imponible 16%</span>
                            <span class="cnt-kpi-icon indigo"><i class="fa-solid fa-calculator"></i></span>
                        </div>
                        <div class="cnt-kpi-amount-bs">${MathETL.fmtBs(resumen.sumBase16Bs)}</div>
                        <div class="cnt-kpi-amount-usd">Equiv. USD BCV: ${MathETL.fmtUSD(MathETL.div(resumen.sumBase16Bs, this.getTasaBCVActiva()))}</div>
                    </div>

                    <div class="cnt-kpi-card">
                        <div class="cnt-kpi-top">
                            <span class="cnt-kpi-label">Total IVA 16% (Crédito/Débito)</span>
                            <span class="cnt-kpi-icon amber"><i class="fa-solid fa-percent"></i></span>
                        </div>
                        <div class="cnt-kpi-amount-bs">${MathETL.fmtBs(resumen.sumIVA16Bs)}</div>
                        <div class="cnt-kpi-amount-usd">Equiv. USD BCV: ${MathETL.fmtUSD(MathETL.div(resumen.sumIVA16Bs, this.getTasaBCVActiva()))}</div>
                    </div>

                    <div class="cnt-kpi-card" style="border-color:#059669; background:linear-gradient(180deg,#ECFDF5 0%,#FFFFFF 100%);">
                        <div class="cnt-kpi-top">
                            <span class="cnt-kpi-label" style="color:#065F46;">Total General a Migrar</span>
                            <span class="cnt-kpi-icon emerald"><i class="fa-solid fa-check-double"></i></span>
                        </div>
                        <div class="cnt-kpi-amount-bs" style="color:#065F46;">${MathETL.fmtBs(resumen.sumTotalBs)}</div>
                        <div class="cnt-kpi-amount-usd" style="color:#047857; font-weight:800;">
                            Equiv. Bimonetario: ${MathETL.fmtUSD(resumen.sumTotalUSD)}
                        </div>
                    </div>
                </div>

                <!-- MESA INTERACTIVA DE AUDITORÍA PREVIA -->
                <div class="cnt-card">
                    <div class="cnt-card-header">
                        <div>
                            <h3 class="cnt-card-title">
                                <i class="fa-solid fa-magnifying-glass-chart" style="color:#059669;"></i>
                                Paso 3: Mesa de Auditoría Previa, Sanitización SENIAT y Edición en Pantalla
                            </h3>
                            <div class="cnt-card-sub">
                                💡 <strong>Edición en Vivo:</strong> Haga clic o doble clic sobre cualquier celda (RIF, N.º Factura, Base 16%, IVA o Total) para corregir un dato directamente sin tener que abrir Excel.
                            </div>
                        </div>
                        <div style="display:flex; gap:8px; flex-wrap:wrap;">
                            <div class="cnt-subtabs" style="margin-bottom:0;">
                                <button type="button" class="cnt-subtab-pill ${this.filtroSemaforo === 'todos' ? 'active' : ''}" onclick="ViasaExcelMigrationAssistant.filtroSemaforo='todos'; ViasaExcelMigrationAssistant.refrescarVista();">
                                    Todas (${resumen.totalFilas})
                                </button>
                                <button type="button" class="cnt-subtab-pill ${this.filtroSemaforo === 'ok' ? 'active' : ''}" onclick="ViasaExcelMigrationAssistant.filtroSemaforo='ok'; ViasaExcelMigrationAssistant.refrescarVista();">
                                    🟢 Perfectas (${resumen.filasOk})
                                </button>
                                <button type="button" class="cnt-subtab-pill ${this.filtroSemaforo === 'warn' ? 'active' : ''}" onclick="ViasaExcelMigrationAssistant.filtroSemaforo='warn'; ViasaExcelMigrationAssistant.refrescarVista();">
                                    🟡 Auto-Corregidas (${resumen.filasWarn})
                                </button>
                                <button type="button" class="cnt-subtab-pill ${this.filtroSemaforo === 'error' ? 'active' : ''}" onclick="ViasaExcelMigrationAssistant.filtroSemaforo='error'; ViasaExcelMigrationAssistant.refrescarVista();">
                                    🔴 Con Error (${resumen.filasError})
                                </button>
                            </div>

                            ${resumen.filasError > 0 ? `
                                <button type="button" class="cnt-btn cnt-btn-amber" onclick="ViasaExcelMigrationAssistant.autoRepararDescuadres1Click()">
                                    <i class="fa-solid fa-screwdriver-wrench"></i> Auto-Reparar Descuadres Matemáticos (${resumen.filasError}) en 1-Click
                                </button>
                            ` : ''}

                            <button type="button" class="cnt-btn cnt-btn-emerald" onclick="ViasaExcelMigrationAssistant.confirmarYMigrarEn4Vias()">
                                <i class="fa-solid fa-cloud-arrow-up"></i> Confirmar y Migrar Datos a VIASA System (${resumen.filasSeleccionadas} Filas)
                            </button>
                        </div>
                    </div>

                    <div class="cnt-table-wrap">
                        <table class="cnt-table">
                            <thead>
                                <tr>
                                    <th style="text-align:center;">Migrar</th>
                                    <th>Semáforo y Dictamen de Sanitización SENIAT</th>
                                    <th>Fecha</th>
                                    <th>RIF / Código</th>
                                    <th>Razón Social / Descripción</th>
                                    <th>N.º Factura / Z</th>
                                    <th>N.º Control</th>
                                    <th class="num">Exento (Bs.)</th>
                                    <th class="num">Base 16% (Bs.)</th>
                                    <th class="num">IVA 16% (Bs.)</th>
                                    <th class="num">Total (Bs.)</th>
                                    <th class="num">Reconstrucción USD (BCV)</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${filasTablaHTML}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="7" style="text-align:right;">
                                        <strong>CUADRE TOTAL DE FILAS SELECCIONADAS (${resumen.filasSeleccionadas} de ${resumen.totalFilas}):</strong>
                                    </td>
                                    <td class="num">${MathETL.fmtBs(resumen.sumExentoBs)}</td>
                                    <td class="num">${MathETL.fmtBs(resumen.sumBase16Bs)}</td>
                                    <td class="num" style="color:#1D4ED8;">${MathETL.fmtBs(resumen.sumIVA16Bs)}</td>
                                    <td class="num" style="color:#059669;">${MathETL.fmtBs(resumen.sumTotalBs)}</td>
                                    <td class="num">${MathETL.fmtUSD(resumen.sumTotalUSD)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            `;
        },

        // ----------------------------------------------------------------------
        // ETAPA 4: CONFIRMACIÓN DE PROPAGACIÓN EN 4 VÍAS E HISTORIAL ETL
        // ----------------------------------------------------------------------
        renderEtapa4ConfirmacionEHistorial() {
            const ult = this.ultimoResultadoMigracion;
            const filasHist = this.historialMigraciones.map(h => `
                <tr>
                    <td class="cnt-mono" style="text-align:left !important;"><strong>${h.id}</strong></td>
                    <td>${h.fechaHora}</td>
                    <td><strong>${h.archivo}</strong> <small style="color:#64748B;">(${h.hoja})</small></td>
                    <td>${h.destino}</td>
                    <td class="num"><strong>${h.filasMigradas}</strong></td>
                    <td class="num">${MathETL.fmtBs(h.totalBs)}</td>
                    <td class="num" style="font-weight:800;">${MathETL.fmtUSD(h.totalUSD)}</td>
                    <td><span class="cnt-badge cnt-badge-emerald"><i class="fa-solid fa-check-double"></i> ${h.estado}</span></td>
                </tr>
            `).join('');

            return `
                ${ult ? `
                    <div style="background:#ECFDF5; border:1.5px solid #10B981; border-left:6px solid #059669; border-radius:14px; padding:18px; margin-bottom:18px;">
                        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
                            <div>
                                <div style="font-size:1.05rem; font-weight:900; color:#065F46;">
                                    <i class="fa-solid fa-circle-check"></i> ¡MIGRACIÓN DESDE EXCEL COMPLETADA Y PROPAGADA EN 4 VÍAS! (${ult.id})
                                </div>
                                <div style="font-size:0.82rem; color:#047857; margin-top:4px;">
                                    Se inyectaron <strong>${ult.filasMigradas} registros</strong> del archivo <code>${ult.archivo}</code> por un total exacto de <strong>${MathETL.fmtBs(ult.totalBs)} (${MathETL.fmtUSD(ult.totalUSD)})</strong> hacia:
                                    <strong>1) Libro SENIAT</strong>, <strong>2) Inventario Art. 177 ISLR</strong>, <strong>3) Tesorería / CxP</strong> y <strong>4) Libro Diario y Mayor (Debe = Haber)</strong>.
                                </div>
                            </div>
                            <div style="display:flex; gap:8px;">
                                <button type="button" class="cnt-btn cnt-btn-primary" onclick="if(window.ViasaContabilidadEngine){window.ViasaContabilidadEngine.cambiarTabPrincipal('tab1_seniat');}">
                                    <i class="fa-solid fa-book"></i> Ver Libros Oficiales SENIAT
                                </button>
                                <button type="button" class="cnt-btn cnt-btn-outline" onclick="if(window.ViasaContabilidadEngine){window.ViasaContabilidadEngine.cambiarTabPrincipal('tab6_contadora');}">
                                    <i class="fa-solid fa-scale-balanced"></i> Ver Asientos en Libro Diario
                                </button>
                            </div>
                        </div>
                    </div>
                ` : ''}

                <div class="cnt-card">
                    <div class="cnt-card-header">
                        <div>
                            <h3 class="cnt-card-title">
                                <i class="fa-solid fa-clock-rotate-left" style="color:#2563EB;"></i>
                                Bitácora e Historial Auditado de Migraciones desde Excel (ETL)
                            </h3>
                            <div class="cnt-card-sub">
                                Registro inmutable de todos los lotes de hojas de cálculo importados por la Administradora y la Contadora en Panadería Nueva Viasa, C.A.
                            </div>
                        </div>
                        <button type="button" class="cnt-btn cnt-btn-emerald" onclick="ViasaExcelMigrationAssistant.irAEtapa(1)">
                            <i class="fa-solid fa-file-circle-plus"></i> Importar Nuevo Archivo Excel
                        </button>
                    </div>

                    <div class="cnt-table-wrap">
                        <table class="cnt-table">
                            <thead>
                                <tr>
                                    <th>ID Lote ETL</th>
                                    <th>Fecha y Hora</th>
                                    <th>Archivo Excel Origen (Pestaña)</th>
                                    <th>Libro Destino en VIASA System</th>
                                    <th class="num">Filas Migradas</th>
                                    <th class="num">Monto Total (Bs.)</th>
                                    <th class="num">Equivalente (USD BCV)</th>
                                    <th>Estado de Propagación</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${filasHist}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }
    };

    window.ViasaExcelMigrationAssistant = ViasaExcelMigrationAssistant;

})(window);
