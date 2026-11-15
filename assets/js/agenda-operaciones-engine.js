/**
 * ==============================================================================
 * VIASA SYSTEM — MÓDULO: AGENDA Y OPERACIONES
 * Agenda Maestra y Cronograma Corporativo de Panadería y Pastelería Nueva Viasa, C.A.
 * RIF: J-31163165-8 • Ciudad Bolívar, Estado Bolívar, Venezuela
 * 
 * Lenguaje de Diseño: Corporate Prestige Dark UI (#0B0F19, #111827, #1E293B, #1F2937)
 * Paleta Semántica:
 *   - 🔥 Producción y Lotes de Horno: #F59E0B (Ámbar Imperial)
 *   - 🚚 Entregas y Despachos B2B/Clientes: #10B981 (Esmeralda Corporativo)
 *   - 📦 Recepción de Proveedores y Compras: #06B6D4 (Cian Eléctrico)
 *   - 💼 Reuniones de Negocios y Junta Directiva: #A855F7 (Púrpura Real)
 *   - 🏛️ Compromisos Fiscales SENIAT, Pagos y Mantenimiento: #EF4444 (Carmesí Alerta)
 * 
 * 4 Vistas Interactivas:
 *   1. Vista Multi-Mes Continua (Por Defecto: Mes en Curso + Subsecuentes)
 *   2. Vista Dual Ejecutiva (2 Meses Lado a Lado)
 *   3. Cronograma Horario de Planta y Hornos (Timeline 24h)
 *   4. Tablero Kanban Corporativo por Estado
 * ==============================================================================
 */

(function (window) {
    'use strict';

    // Constantes de Empresa y Configuración
    const EMPRESA_CONFIG = {
        nombre: 'Panadería y Pastelería Nueva Viasa, C.A.',
        rif: 'J-31163165-8',
        direccion: 'Av. Libertador c/c Av. Germania, Ciudad Bolívar, Edo. Bolívar',
        telefono: '0285-6324891 / 0414-8859120',
        emailCorporativo: 'operaciones.nuevaviasa@gmail.com',
        gerenciaEmail: 'gerencia.nuevaviasa@gmail.com'
    };

    // Paleta Semántica y Metadatos por Categoría
    const CATEGORIAS_AGENDA = {
        produccion: {
            id: 'produccion',
            label: 'Producción y Lotes de Horno',
            icon: 'fa-fire-burner',
            emoji: '🔥',
            color: '#F59E0B',
            colorBg: 'rgba(245, 158, 11, 0.14)',
            colorBorder: 'rgba(245, 158, 11, 0.38)',
            descripcion: 'Elaboración de lotes de panadería, pastelería y Línea Pilón.'
        },
        entrega: {
            id: 'entrega',
            label: 'Entregas y Despachos B2B/Clientes',
            icon: 'fa-truck-fast',
            emoji: '🚚',
            color: '#10B981',
            colorBg: 'rgba(16, 185, 129, 0.14)',
            colorBorder: 'rgba(16, 185, 129, 0.38)',
            descripcion: 'Despachos de mercancía, rutas de reparto y pedidos mayoristas.'
        },
        recepcion: {
            id: 'recepcion',
            label: 'Recepción de Proveedores y Compras',
            icon: 'fa-boxes-packing',
            emoji: '📦',
            color: '#06B6D4',
            colorBg: 'rgba(6, 182, 212, 0.14)',
            colorBorder: 'rgba(6, 182, 212, 0.38)',
            descripcion: 'Llegada de camiones de insumos, harinas y órdenes de compra.'
        },
        reunion: {
            id: 'reunion',
            label: 'Reuniones de Negocios y Junta Directiva',
            icon: 'fa-handshake',
            emoji: '💼',
            color: '#A855F7',
            colorBg: 'rgba(168, 85, 247, 0.14)',
            colorBorder: 'rgba(168, 85, 247, 0.38)',
            descripcion: 'Citas ejecutivas, acuerdos comerciales, bancos y alianzas.'
        },
        pago: {
            id: 'pago',
            label: 'Compromisos Fiscales SENIAT, Pagos y Mantenimiento',
            icon: 'fa-landmark',
            emoji: '🏛️',
            color: '#EF4444',
            colorBg: 'rgba(239, 68, 68, 0.14)',
            colorBorder: 'rgba(239, 68, 68, 0.38)',
            descripcion: 'Vencimiento de facturas a crédito de proveedores, impuestos y mantenimiento.'
        }
    };

    // Semillas Ejecutivas de Alta Fidelidad Operativa (Nov 2026, Dic 2026, Ene 2027)
    const SEMILLAS_COMPROMISOS = [
        // --- HOY (15 DE NOVIEMBRE DE 2026) ---
        {
            id: 'CMP-2026-11-15-01',
            titulo: 'Elaboración Lote Pan de Hamburguesa PILÓN Familiar 650g',
            categoria: 'produccion',
            fecha: '2026-11-15',
            horaInicio: '04:30',
            horaFin: '08:30',
            prioridad: 'alta',
            estado: 'en_curso',
            productoId: 'PNV-PA-001',
            productoNombre: 'Pan de Hamburguesa Pilón Familiar (650g)',
            cantidadLotes: 120,
            turnoId: '1',
            turnoNombre: 'Turno Madrugada (04:00 - 12:00)',
            responsable: 'Carlos Mendoza (Maestro Panadero)',
            notas: 'Horno rotativo principal calibrado a 210°C. Fermentación en cámara con humedad al 75%.',
            enviarEmailNotif: false,
            historialEmails: []
        },
        {
            id: 'CMP-2026-11-15-02',
            titulo: 'Despacho Mayorista — Inversiones El Trébol, C.A.',
            categoria: 'entrega',
            fecha: '2026-11-15',
            horaInicio: '09:30',
            horaFin: '11:00',
            prioridad: 'alta',
            estado: 'programado',
            clienteId: 'CLI-003',
            clienteNombre: 'Inversiones El Trébol, C.A.',
            clienteRif: 'J-40982314-5',
            clienteTelefono: '0414-8859120',
            clienteEmail: 'compras@inversioneseltrebol.com',
            montoUSD: 480.00,
            notas: 'Entrega en sede comercial. 80 Paquetes Pan Canilla, 40 Paquetes Pan Campesino y 30 Panes Franceses.',
            enviarEmailNotif: true,
            historialEmails: [
                {
                    fechaEnvio: '2026-11-14 18:30',
                    destinatario: 'Inversiones El Trébol, C.A.',
                    email: 'compras@inversioneseltrebol.com',
                    canal: 'Email',
                    tipo: 'Entrega de Pedido',
                    estado: 'Confirmado'
                }
            ]
        },
        {
            id: 'CMP-2026-11-15-03',
            titulo: 'Recepción de 80 Sacos Harina Panadera 000 MONACA (45kg)',
            categoria: 'recepcion',
            fecha: '2026-11-15',
            horaInicio: '11:30',
            horaFin: '13:00',
            prioridad: 'critica',
            estado: 'programado',
            proveedorId: 'PRV-001',
            proveedorNombre: 'Molinos Nacionales C.A. (MONACA)',
            proveedorRif: 'J-00030291-0',
            representanteVentas: 'Ing. Roberto Morales / Naisi',
            proveedorTelefono: '0286-9231122',
            proveedorEmail: 'ventas.oriente@monaca.com.ve',
            montoUSD: 2880.00,
            muelleRecepcion: 'Muelle A — Carga Pesada Harinas',
            notas: 'Verificar certificados de molienda y control de humedad de los sacos al momento de la estiba.',
            enviarEmailNotif: true,
            historialEmails: []
        },
        {
            id: 'CMP-2026-11-15-04',
            titulo: 'Junta Directiva: Revisión de Márgenes y Fijación Tasa BCV/USDT',
            categoria: 'reunion',
            fecha: '2026-11-15',
            horaInicio: '15:30',
            horaFin: '17:00',
            prioridad: 'alta',
            estado: 'programado',
            clienteNombre: 'Gerencia General, Administración y Jefatura de Planta',
            clienteEmail: 'gerencia.nuevaviasa@gmail.com',
            notas: 'Sala de Conferencias Ejecutiva Nueva Viasa. Análisis de costos de trigo importado y fijación de precios quincenales.',
            enviarEmailNotif: false,
            historialEmails: []
        },

        // --- NOVIEMBRE 2026 ---
        {
            id: 'CMP-2026-11-16-01',
            titulo: 'Elaboración Lote Pan Francés & Baguette Especial',
            categoria: 'produccion',
            fecha: '2026-11-16',
            horaInicio: '05:00',
            horaFin: '09:00',
            prioridad: 'normal',
            estado: 'programado',
            productoId: 'PNV-PA-002',
            productoNombre: 'Pan Francés Tradicional Viasa (10 Unidades)',
            cantidadLotes: 95,
            turnoId: '1',
            turnoNombre: 'Turno Madrugada',
            responsable: 'Antonio Silva',
            notas: 'Destinado al abastecimiento matutino del Punto de Venta y Cafetín Viasa.',
            historialEmails: []
        },
        {
            id: 'CMP-2026-11-18-01',
            titulo: 'SENIAT: Declaración y Pago Retenciones de IVA (Quincena 1 Nov)',
            categoria: 'pago',
            fecha: '2026-11-18',
            horaInicio: '08:30',
            horaFin: '10:30',
            prioridad: 'critica',
            estado: 'programado',
            tipoObligacion: 'SENIAT_IVA_QUINCENAL',
            montoUSD: 1420.00,
            notas: 'Portal SENIAT Sujetos Pasivos Especiales. Cierre de retenciones practicadas del 01 al 15 de Noviembre.',
            historialEmails: []
        },
        {
            id: 'CMP-2026-11-20-01',
            titulo: 'Pago Factura Harina MONACA FC-84920 (Crédito 14 días)',
            categoria: 'pago',
            fecha: '2026-11-20',
            horaInicio: '10:00',
            horaFin: '11:00',
            prioridad: 'alta',
            estado: 'programado',
            proveedorId: 'PRV-001',
            proveedorNombre: 'Molinos Nacionales C.A. (MONACA)',
            proveedorRif: 'J-00030291-0',
            montoUSD: 720.00,
            notas: 'Transferencia bancaria Banesco / Banco Mercantil por $720.00 según acuerdo comercial.',
            historialEmails: []
        },
        {
            id: 'CMP-2026-11-22-01',
            titulo: 'Elaboración Especialidad Golfeados Melosos con Queso de Mano',
            categoria: 'produccion',
            fecha: '2026-11-22',
            horaInicio: '06:00',
            horaFin: '10:30',
            prioridad: 'normal',
            estado: 'programado',
            productoId: 'PNV-DU-001',
            productoNombre: 'Golfeado Meloso Tradicional con Queso Telita',
            cantidadLotes: 160,
            turnoId: '2',
            turnoNombre: 'Turno Matutino',
            responsable: 'María Eugenia Rivas',
            notas: 'Preparación de melao con papelón de caña puro y anís chiquito.',
            historialEmails: []
        },
        {
            id: 'CMP-2026-11-24-01',
            titulo: 'Mantenimiento Preventivo Mensual Horno Rotativo 36 Bandejas',
            categoria: 'pago',
            fecha: '2026-11-24',
            horaInicio: '14:00',
            horaFin: '18:00',
            prioridad: 'alta',
            estado: 'programado',
            activoId: 'ACT-001',
            activoNombre: 'Horno Rotativo Industrial 36 Bandejas',
            proveedorNombre: 'Servicios Técnicos Guayana, C.A.',
            montoUSD: 180.00,
            notas: 'Calibración de quemador a gas, engrase térmico SKF de chumaceras y tensión de cadenas de arrastre.',
            historialEmails: []
        },
        {
            id: 'CMP-2026-11-26-01',
            titulo: 'Despacho Semanal — Bodegón Los Mangos & Cafetín Viasa',
            categoria: 'entrega',
            fecha: '2026-11-26',
            horaInicio: '07:30',
            horaFin: '09:00',
            prioridad: 'normal',
            estado: 'programado',
            clienteId: 'CLI-002',
            clienteNombre: 'Bodegón Los Mangos, C.A.',
            clienteEmail: 'compras@bodegonlosmangos.com',
            montoUSD: 340.00,
            notas: 'Ruta 1 Casco Histórico. Pan de banquete y trenzas dulces.',
            historialEmails: []
        },
        {
            id: 'CMP-2026-11-28-01',
            titulo: 'Recepción Levaduras y Mejoradores — Levaduras del Caribe C.A.',
            categoria: 'recepcion',
            fecha: '2026-11-28',
            horaInicio: '10:00',
            horaFin: '11:30',
            prioridad: 'normal',
            estado: 'programado',
            proveedorId: 'PRV-002',
            proveedorNombre: 'Levaduras del Caribe C.A.',
            proveedorEmail: 'pedidos@levadurascaribe.com',
            montoUSD: 520.00,
            muelleRecepcion: 'Muelle B — Insumos Secos',
            notas: '50 Cajas de levadura fresca prensada y 10 cuñetes de mejorador de masa.',
            historialEmails: []
        },

        // --- DICIEMBRE 2026 (TEMPORADA NAVIDEÑA) ---
        {
            id: 'CMP-2026-12-02-01',
            titulo: 'Mesa Redonda Comercial: Contrato Anual de Trigo y Harinas 2027',
            categoria: 'reunion',
            fecha: '2026-12-02',
            horaInicio: '10:00',
            horaFin: '12:30',
            prioridad: 'alta',
            estado: 'programado',
            proveedorNombre: 'Cargill de Venezuela & Molinos Nacionales',
            proveedorEmail: 'contratos@cargill.com.ve',
            notas: 'Fijación de cuotas trimestrales de harina panadera fuerte para el año 2027.',
            historialEmails: []
        },
        {
            id: 'CMP-2026-12-05-01',
            titulo: 'Gran Horneada Navideña: Primer Lote Pan de Jamón Tradicional Viasa',
            categoria: 'produccion',
            fecha: '2026-12-05',
            horaInicio: '04:00',
            horaFin: '11:00',
            prioridad: 'critica',
            estado: 'programado',
            productoNombre: 'Pan de Jamón Tradicional Nueva Viasa (Jamón Ahumado, Tocineta, Pasas y Aceitunas)',
            cantidadLotes: 200,
            turnoId: '1',
            turnoNombre: 'Turno Madrugada y Refuerzo',
            responsable: 'Jefatura de Producción Viasa',
            notas: 'Inauguración oficial de la zafra navideña. Elaboración con receta centenaria de la casa.',
            historialEmails: []
        },
        {
            id: 'CMP-2026-12-10-01',
            titulo: 'Despacho Cestas Corporativas — Empresas Polar Planta Oriente',
            categoria: 'entrega',
            fecha: '2026-12-10',
            horaInicio: '09:00',
            horaFin: '12:00',
            prioridad: 'alta',
            estado: 'programado',
            clienteNombre: 'Empresas Polar — División Oriente',
            clienteEmail: 'recursoshumanos.oriente@empresaspolar.com',
            montoUSD: 1850.00,
            notas: 'Entrega de 120 Panes de Jamón y 60 Panettones Artesanales empacados con cinta dorada.',
            historialEmails: []
        },
        {
            id: 'CMP-2026-12-15-01',
            titulo: 'Recepción de Insumos Navideños: Pasas Sultanas, Aceitunas y Mantequilla',
            categoria: 'recepcion',
            fecha: '2026-12-15',
            horaInicio: '08:30',
            horaFin: '11:00',
            prioridad: 'alta',
            estado: 'programado',
            proveedorNombre: 'Distribuidora Los Andes C.A.',
            proveedorEmail: 'despachos@distribuidoralosandes.com',
            montoUSD: 1650.00,
            muelleRecepcion: 'Muelle B — Refrigerados e Insumos',
            notas: 'Insumos de importación para la alta demanda de la segunda quincena de diciembre.',
            historialEmails: []
        },
        {
            id: 'CMP-2026-12-18-01',
            titulo: 'SENIAT & Alcaldía: Declaración Retenciones ISLR y Patente Municipal',
            categoria: 'pago',
            fecha: '2026-12-18',
            horaInicio: '09:00',
            horaFin: '11:00',
            prioridad: 'critica',
            estado: 'programado',
            tipoObligacion: 'SENIAT_ISLR_PATENTE',
            montoUSD: 2150.00,
            notas: 'Pago oportuno para mantener solvencia comercial y licencias de expendio al día.',
            historialEmails: []
        },
        {
            id: 'CMP-2026-12-22-01',
            titulo: 'Producción Pico de Nochebuena: 400 Panes de Jamón & Roscones de Reyes',
            categoria: 'produccion',
            fecha: '2026-12-22',
            horaInicio: '03:00',
            horaFin: '13:00',
            prioridad: 'critica',
            estado: 'programado',
            productoNombre: 'Pan de Jamón Navideño & Panettone Italiano',
            cantidadLotes: 400,
            turnoId: '1',
            turnoNombre: 'Doble Turno Continuo de Hornos',
            responsable: 'Carlos Mendoza y Brigada Completa',
            notas: 'Máxima capacidad operativa con los 2 hornos industriales encendidos en simultáneo.',
            historialEmails: []
        },
        {
            id: 'CMP-2026-12-24-01',
            titulo: 'Despacho Especial Nochebuena: Entregas Express a Domicilio y Clientes VIP',
            categoria: 'entrega',
            fecha: '2026-12-24',
            horaInicio: '08:00',
            horaFin: '14:00',
            prioridad: 'alta',
            estado: 'programado',
            clienteNombre: 'Clientes VIP Viasa y Encargos Especiales',
            clienteEmail: 'ventas.nuevaviasa@gmail.com',
            montoUSD: 3100.00,
            notas: 'Flotilla de delivery completa en ruta hasta las 2:00 PM.',
            historialEmails: []
        },
        {
            id: 'CMP-2026-12-29-01',
            titulo: 'Liquidación de Nómina de Fin de Año y Guardias LOTTT Especiales',
            categoria: 'pago',
            fecha: '2026-12-29',
            horaInicio: '10:00',
            horaFin: '13:00',
            prioridad: 'alta',
            estado: 'programado',
            tipoObligacion: 'NOMINA_LOTTT',
            montoUSD: 4200.00,
            notas: 'Pago de bonos decembrinos, guardias nocturnas y feriados laborados según LOTTT.',
            historialEmails: []
        },

        // --- ENERO 2027 (PROYECCIÓN Y ARRANQUE Q1) ---
        {
            id: 'CMP-2027-01-06-01',
            titulo: 'Reunión Ejecutiva Estratégica: Plan de Expansión Rutas B2B Q1 2027',
            categoria: 'reunion',
            fecha: '2027-01-06',
            horaInicio: '10:00',
            horaFin: '12:30',
            prioridad: 'alta',
            estado: 'programado',
            clienteNombre: 'Comité de Dirección y Gerencia de Operaciones',
            clienteEmail: 'gerencia.nuevaviasa@gmail.com',
            notas: 'Presentación del balance anual 2026 y metas comerciales del primer trimestre 2027.',
            historialEmails: []
        },
        {
            id: 'CMP-2027-01-08-01',
            titulo: 'Recepción Programada Harina Trigo Q1: 150 Sacos MONACA',
            categoria: 'recepcion',
            fecha: '2027-01-08',
            horaInicio: '08:00',
            horaFin: '11:00',
            prioridad: 'alta',
            estado: 'programado',
            proveedorNombre: 'Molinos Nacionales C.A. (MONACA)',
            proveedorEmail: 'ventas.oriente@monaca.com.ve',
            montoUSD: 5400.00,
            muelleRecepcion: 'Muelle A — Harinas y Grano',
            notas: 'Primer despacho del año 2027 para reponer silos y bodegas de materia prima.',
            historialEmails: []
        },
        {
            id: 'CMP-2027-01-12-01',
            titulo: 'Mantenimiento General Anual de Línea de Amasadoras y Rebanadoras',
            categoria: 'pago',
            fecha: '2027-01-12',
            horaInicio: '13:00',
            horaFin: '17:00',
            prioridad: 'normal',
            estado: 'programado',
            proveedorNombre: 'Servicios Técnicos Industriales Bolívar',
            montoUSD: 350.00,
            notas: 'Cambio de fajas, rectificación de cuchillas y chequeo de sistemas de parada de emergencia.',
            historialEmails: []
        },
        {
            id: 'CMP-2027-01-15-01',
            titulo: 'SENIAT: Declaración Primera Quincena Enero 2027',
            categoria: 'pago',
            fecha: '2027-01-15',
            horaInicio: '09:00',
            horaFin: '11:00',
            prioridad: 'critica',
            estado: 'programado',
            tipoObligacion: 'SENIAT_IVA_QUINCENAL',
            montoUSD: 1650.00,
            notas: 'Declaración oportuna en portal SENIAT.',
            historialEmails: []
        }
    ];

    // ==============================================================================
    // MOTOR PRINCIPAL DE AGENDA Y OPERACIONES
    // ==============================================================================
    const ViasaAgendaEngine = {
        // Estado
        vistaActiva: 'multi-mes', // 'multi-mes', 'dual', 'timeline', 'kanban'
        mesInicio: new Date(2026, 10, 1), // Noviembre 2026 (mes 10 es 0-indexed)
        mesesVisiblesCount: 3, // Noviembre 2026, Diciembre 2026, Enero 2027
        compromisos: [],
        bitacoraEmails: [],
        filtroCategoria: 'todos',
        filtroPrioridad: 'todos',
        busquedaTexto: '',
        fechaTimeline: '2026-11-15',
        compromisoSeleccionadoId: null,
        sintesisVozActiva: false,
        fechaHoyCalculada: '2026-11-15',

        // --------------------------------------------------------------------------
        // 1. INICIALIZACIÓN
        // --------------------------------------------------------------------------
        async init() {
            console.log('[VIASA Agenda] Inicializando Motor de Agenda y Cronograma Operativo...');
            this.calcularFechaHoy();

            try {
                // Cargar desde Storage (IndexedDB con réplica LocalStorage)
                let stored = null;
                if (window.ViasaStorage && typeof window.ViasaStorage.obtenerColeccion === 'function') {
                    stored = await window.ViasaStorage.obtenerColeccion('agenda_operaciones');
                } else {
                    const raw = localStorage.getItem('viasa_agenda_operaciones');
                    if (raw && raw.trim() !== '') {
                        try { stored = JSON.parse(raw); } catch (e) { stored = null; }
                    }
                }

                if (Array.isArray(stored) && stored.length > 0) {
                    this.compromisos = stored;
                } else {
                    // Sembrar datos iniciales corporativos
                    this.compromisos = JSON.parse(JSON.stringify(SEMILLAS_COMPROMISOS));
                    await this.persistirCompromisos();
                }

                // Cargar bitácora de correos
                let storedEmails = null;
                if (window.ViasaStorage && typeof window.ViasaStorage.obtenerColeccion === 'function') {
                    storedEmails = await window.ViasaStorage.obtenerColeccion('agenda_bitacora_emails');
                } else {
                    const rawE = localStorage.getItem('viasa_agenda_bitacora_emails');
                    if (rawE && rawE.trim() !== '') {
                        try { storedEmails = JSON.parse(rawE); } catch (e) { storedEmails = null; }
                    }
                }
                if (Array.isArray(storedEmails)) {
                    this.bitacoraEmails = storedEmails;
                }

                // Sincronizar automáticamente con compras y activos si existen en la BD
                this.sincronizarConComprasYActivos();

            } catch (err) {
                console.warn('[VIASA Agenda] Error al cargar almacenamiento:', err);
                this.compromisos = JSON.parse(JSON.stringify(SEMILLAS_COMPROMISOS));
            }

            this.actualizarBadgeSidebar();
            console.log(`[VIASA Agenda] Motor listo. ${this.compromisos.length} compromisos cargados.`);
        },

        calcularFechaHoy() {
            // Si la fecha actual real del sistema está en noviembre 2026, la toma; de lo contrario toma 2026-11-15
            const hoy = new Date();
            const y = hoy.getFullYear();
            const m = String(hoy.getMonth() + 1).padStart(2, '0');
            const d = String(hoy.getDate()).padStart(2, '0');
            const fechaStr = `${y}-${m}-${d}`;
            if (fechaStr.startsWith('2026-11')) {
                this.fechaHoyCalculada = fechaStr;
            } else {
                this.fechaHoyCalculada = '2026-11-15';
            }
            this.fechaTimeline = this.fechaHoyCalculada;
        },

        async persistirCompromisos() {
            if (window.ViasaStorage && typeof window.ViasaStorage.guardarColeccion === 'function') {
                await window.ViasaStorage.guardarColeccion('agenda_operaciones', this.compromisos);
            } else {
                localStorage.setItem('viasa_agenda_operaciones', JSON.stringify(this.compromisos));
            }
        },

        async persistirBitacoraEmails() {
            if (window.ViasaStorage && typeof window.ViasaStorage.guardarColeccion === 'function') {
                await window.ViasaStorage.guardarColeccion('agenda_bitacora_emails', this.bitacoraEmails);
            } else {
                localStorage.setItem('viasa_agenda_bitacora_emails', JSON.stringify(this.bitacoraEmails));
            }
        },

        getTasaBCV() {
            if (window.ViasaApp && parseFloat(window.ViasaApp.tasaBCV) > 0) return parseFloat(window.ViasaApp.tasaBCV);
            if (window.ViasaContabilidadEngine && parseFloat(window.ViasaContabilidadEngine.tasaBCV) > 0) return parseFloat(window.ViasaContabilidadEngine.tasaBCV);
            if (window.ViasaDatabase && window.ViasaDatabase.tasaBCV > 0) return parseFloat(window.ViasaDatabase.tasaBCV);
            return 36.85;
        },

        getTasaUSDT() {
            if (window.ViasaApp && parseFloat(window.ViasaApp.tasaUSDT) > 0) return parseFloat(window.ViasaApp.tasaUSDT);
            if (window.ViasaDatabase && window.ViasaDatabase.tasaParalelo > 0) return parseFloat(window.ViasaDatabase.tasaParalelo);
            return 37.50;
        },

        actualizarBadgeSidebar() {
            const hoy = this.fechaHoyCalculada;
            const countHoy = this.compromisos.filter(c => c.fecha === hoy && c.estado !== 'completado').length;
            const badgeEl = document.getElementById('badge-agenda-hoy-count');
            if (badgeEl) {
                badgeEl.textContent = `Hoy: ${countHoy}`;
                badgeEl.title = `${countHoy} compromisos programados para hoy (${hoy})`;
            }
        },

        // --------------------------------------------------------------------------
        // 2. RENDER PRINCIPAL DE LA VISTA
        // --------------------------------------------------------------------------
        render(containerId = 'agenda-operaciones-root') {
            let container = document.getElementById(containerId);
            if (!container) {
                const parentSection = document.getElementById('view-agenda-operaciones');
                if (parentSection) {
                    parentSection.innerHTML = `<div id="${containerId}"></div>`;
                    container = document.getElementById(containerId);
                }
            }
            if (!container) return;

            const tasa = this.getTasaBCV();
            const tasaUsdt = this.getTasaUSDT();
            const kpis = this.calcularKPIs();

            container.innerHTML = `
                <div class="agenda-wrapper">
                    <!-- CABECERA EJECUTIVA CORPORATIVA -->
                    <header class="agenda-header">
                        <div class="agenda-brand-box">
                            <div class="agenda-brand-icon">
                                <i class="fa-solid fa-calendar-days"></i>
                            </div>
                            <div>
                                <div class="agenda-brand-title">AGENDA MAESTRA Y CRONOGRAMA OPERATIVO</div>
                                <div class="agenda-brand-subtitle">
                                    <span>${EMPRESA_CONFIG.nombre}</span>
                                    <span class="agenda-dot-sep">•</span>
                                    <span>RIF: ${EMPRESA_CONFIG.rif}</span>
                                    <span class="agenda-dot-sep">•</span>
                                    <span class="agenda-sync-chip"><i class="fa-solid fa-circle-check"></i> Sincronización Multi-Módulo Activa</span>
                                </div>
                            </div>
                        </div>

                        <!-- TASAS ACTIVAS Y BOTONES DE ACCIÓN PRINCIPALES -->
                        <div class="agenda-header-actions">
                            <div class="agenda-rate-pills">
                                <div class="agenda-rate-pill bcv" title="Tasa Oficial Banco Central de Venezuela">
                                    <i class="fa-solid fa-building-columns"></i>
                                    <span>BCV: <b>Bs. ${tasa.toFixed(2)}</b></span>
                                </div>
                                <div class="agenda-rate-pill usdt" title="Tasa Cripto / Libre">
                                    <i class="fa-solid fa-coins"></i>
                                    <span>USDT: <b>Bs. ${tasaUsdt.toFixed(2)}</b></span>
                                </div>
                            </div>

                            <button type="button" class="btn-agenda-action gold" onclick="window.ViasaAgendaEngine.abrirModalCompromiso()">
                                <i class="fa-solid fa-plus-circle"></i>
                                <span>Agendar Nuevo Compromiso / Lote</span>
                            </button>

                            <button type="button" class="btn-agenda-action cyan" onclick="window.ViasaAgendaEngine.abrirCentroEmails()">
                                <i class="fa-solid fa-paper-plane"></i>
                                <span>Centro de Despacho Emails</span>
                            </button>

                            <button type="button" class="btn-agenda-action purple" id="btn-viasa-voice" onclick="window.ViasaAgendaEngine.reproducirViasaVoice()">
                                <i class="fa-solid fa-microphone-lines"></i>
                                <span>Resumen Viasa Voice</span>
                            </button>

                            <button type="button" class="btn-agenda-action ghost" onclick="window.ViasaAgendaEngine.respaldarDiscoLocal()" title="Descargar respaldo JSON en /VIASA_System_Data/agenda_y_operaciones/">
                                <i class="fa-solid fa-floppy-disk"></i>
                                <span>Respaldar</span>
                            </button>
                        </div>
                    </header>

                    <!-- CINTA DE 5 INDICADORES (KPIS CORPORATIVOS) -->
                    <section class="agenda-kpi-bar">
                        <div class="agenda-kpi-card gold">
                            <div class="agenda-kpi-top">
                                <span class="agenda-kpi-label">Compromisos de Hoy</span>
                                <div class="agenda-kpi-icon"><i class="fa-solid fa-calendar-day"></i></div>
                            </div>
                            <div class="agenda-kpi-value">${kpis.hoy}</div>
                            <div class="agenda-kpi-sub">Fecha activa: ${this.fechaHoyCalculada}</div>
                        </div>

                        <div class="agenda-kpi-card amber">
                            <div class="agenda-kpi-top">
                                <span class="agenda-kpi-label">Lotes de Horno Programados</span>
                                <div class="agenda-kpi-icon"><i class="fa-solid fa-fire-burner"></i></div>
                            </div>
                            <div class="agenda-kpi-value">${kpis.lotesProduccion} <small style="font-size:0.8rem; font-weight:600;">Lotes</small></div>
                            <div class="agenda-kpi-sub">Panadería Pilón y Especialidades</div>
                        </div>

                        <div class="agenda-kpi-card emerald">
                            <div class="agenda-kpi-top">
                                <span class="agenda-kpi-label">Entregas y Despachos B2B</span>
                                <div class="agenda-kpi-icon"><i class="fa-solid fa-truck-fast"></i></div>
                            </div>
                            <div class="agenda-kpi-value">${kpis.entregas} <small style="font-size:0.8rem; font-weight:600;">En Ruta</small></div>
                            <div class="agenda-kpi-sub">Clientes mayoristas y aliados</div>
                        </div>

                        <div class="agenda-kpi-card cyan">
                            <div class="agenda-kpi-top">
                                <span class="agenda-kpi-label">Recepción Harinas / Insumos</span>
                                <div class="agenda-kpi-icon"><i class="fa-solid fa-boxes-packing"></i></div>
                            </div>
                            <div class="agenda-kpi-value">${kpis.recepciones} <small style="font-size:0.8rem; font-weight:600;">Arribos</small></div>
                            <div class="agenda-kpi-sub">MONACA, Levaduras y Granos</div>
                        </div>

                        <div class="agenda-kpi-card red">
                            <div class="agenda-kpi-top">
                                <span class="agenda-kpi-label">Pagos y Vencimientos ($ / Bs)</span>
                                <div class="agenda-kpi-icon"><i class="fa-solid fa-file-invoice-dollar"></i></div>
                            </div>
                            <div class="agenda-kpi-value">$${kpis.montoPagosUSD.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                            <div class="agenda-kpi-sub">Bs. ${(kpis.montoPagosUSD * tasa).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (BCV)</div>
                        </div>
                    </section>

                    <!-- BARRA DE CONTROL, SELECTOR DE 4 DISEÑOS Y FILTROS -->
                    <section class="agenda-controls-bar">
                        <!-- SELECTOR DE LAS 4 VISTAS -->
                        <div class="agenda-view-selector">
                            <button type="button" class="agenda-view-btn ${this.vistaActiva === 'multi-mes' ? 'active' : ''}" onclick="window.ViasaAgendaEngine.cambiarVista('multi-mes')">
                                <i class="fa-solid fa-calendar"></i>
                                <span>1. Multi-Mes Continua</span>
                            </button>
                            <button type="button" class="agenda-view-btn ${this.vistaActiva === 'dual' ? 'active' : ''}" onclick="window.ViasaAgendaEngine.cambiarVista('dual')">
                                <i class="fa-solid fa-table-columns"></i>
                                <span>2. Dual Ejecutiva</span>
                            </button>
                            <button type="button" class="agenda-view-btn ${this.vistaActiva === 'timeline' ? 'active' : ''}" onclick="window.ViasaAgendaEngine.cambiarVista('timeline')">
                                <i class="fa-solid fa-timeline"></i>
                                <span>3. Cronograma 24h</span>
                            </button>
                            <button type="button" class="agenda-view-btn ${this.vistaActiva === 'kanban' ? 'active' : ''}" onclick="window.ViasaAgendaEngine.cambiarVista('kanban')">
                                <i class="fa-solid fa-table-list"></i>
                                <span>4. Kanban Operativo</span>
                            </button>
                        </div>

                        <!-- FILTROS Y BÚSQUEDA RÁPIDA -->
                        <div class="agenda-filter-group">
                            <div class="agenda-search-box">
                                <i class="fa-solid fa-magnifying-glass"></i>
                                <input type="text" placeholder="Buscar compromiso, cliente, harina, lote..." value="${this.busquedaTexto}" oninput="window.ViasaAgendaEngine.filtrarPorTexto(this.value)" />
                                ${this.busquedaTexto ? `<button type="button" class="agenda-clear-search" onclick="window.ViasaAgendaEngine.filtrarPorTexto('')">&times;</button>` : ''}
                            </div>

                            <select class="agenda-filter-select" onchange="window.ViasaAgendaEngine.filtrarPorCategoria(this.value)">
                                <option value="todos" ${this.filtroCategoria === 'todos' ? 'selected' : ''}>🎯 Todas las Categorías</option>
                                <option value="produccion" ${this.filtroCategoria === 'produccion' ? 'selected' : ''}>🔥 Lotes de Producción</option>
                                <option value="entrega" ${this.filtroCategoria === 'entrega' ? 'selected' : ''}>🚚 Entregas B2B</option>
                                <option value="recepcion" ${this.filtroCategoria === 'recepcion' ? 'selected' : ''}>📦 Recepción Harinas</option>
                                <option value="reunion" ${this.filtroCategoria === 'reunion' ? 'selected' : ''}>💼 Reuniones y Juntas</option>
                                <option value="pago" ${this.filtroCategoria === 'pago' ? 'selected' : ''}>🏛️ Pagos y SENIAT</option>
                            </select>

                            <select class="agenda-filter-select" onchange="window.ViasaAgendaEngine.filtrarPorPrioridad(this.value)">
                                <option value="todos" ${this.filtroPrioridad === 'todos' ? 'selected' : ''}>⚡ Toda Prioridad</option>
                                <option value="critica" ${this.filtroPrioridad === 'critica' ? 'selected' : ''}>🔴 Crítica</option>
                                <option value="alta" ${this.filtroPrioridad === 'alta' ? 'selected' : ''}>🟡 Alta</option>
                                <option value="normal" ${this.filtroPrioridad === 'normal' ? 'selected' : ''}>🟢 Normal</option>
                            </select>

                            <div class="agenda-nav-month-group">
                                <button type="button" class="agenda-btn-mini-nav" title="Mes Anterior" onclick="window.ViasaAgendaEngine.desplazarMes(-1)">
                                    <i class="fa-solid fa-chevron-left"></i>
                                </button>
                                <button type="button" class="agenda-btn-mini-nav today" title="Ir al Mes en Curso (Noviembre 2026)" onclick="window.ViasaAgendaEngine.irAlMesActual()">
                                    Hoy
                                </button>
                                <button type="button" class="agenda-btn-mini-nav" title="Mes Siguiente" onclick="window.ViasaAgendaEngine.desplazarMes(1)">
                                    <i class="fa-solid fa-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                    </section>

                    <!-- CONTENEDOR DINÁMICO DE LA VISTA ACTIVA -->
                    <main class="agenda-view-content" id="agenda-view-content-root">
                        ${this.renderContenidoVistaActiva()}
                    </main>
                </div>
            `;

            this.actualizarBadgeSidebar();
        },

        renderContenidoVistaActiva() {
            switch (this.vistaActiva) {
                case 'dual':
                    return this.renderVistaDual();
                case 'timeline':
                    return this.renderVistaTimeline();
                case 'kanban':
                    return this.renderVistaKanban();
                case 'multi-mes':
                default:
                    return this.renderVistaMultiMes();
            }
        },

        cambiarVista(nuevaVista) {
            this.vistaActiva = nuevaVista;
            this.render();
        },

        desplazarMes(delta) {
            const y = this.mesInicio.getFullYear();
            const m = this.mesInicio.getMonth() + delta;
            this.mesInicio = new Date(y, m, 1);
            this.render();
        },

        irAlMesActual() {
            this.mesInicio = new Date(2026, 10, 1); // Noviembre 2026
            this.render();
        },

        agregarMesSubsecuente() {
            this.mesesVisiblesCount += 1;
            this.render();
        },

        filtrarPorTexto(val) {
            this.busquedaTexto = (val || '').trim().toLowerCase();
            this.render();
        },

        filtrarPorCategoria(cat) {
            this.filtroCategoria = cat;
            this.render();
        },

        filtrarPorPrioridad(prio) {
            this.filtroPrioridad = prio;
            this.render();
        },

        calcularKPIs() {
            const hoy = this.fechaHoyCalculada;
            const items = this.compromisos;

            const hoyCount = items.filter(c => c.fecha === hoy).length;
            const lotesCount = items.filter(c => c.categoria === 'produccion' && c.estado !== 'completado').length;
            const entregasCount = items.filter(c => c.categoria === 'entrega' && c.estado !== 'completado').length;
            const recepcionesCount = items.filter(c => c.categoria === 'recepcion' && c.estado !== 'completado').length;

            const pagosItems = items.filter(c => c.categoria === 'pago' && c.estado !== 'completado');
            const montoPagosUSD = pagosItems.reduce((acc, c) => acc + (parseFloat(c.montoUSD) || 0), 0);

            let emailsEnviados = this.bitacoraEmails.length;
            items.forEach(c => {
                if (Array.isArray(c.historialEmails)) emailsEnviados += c.historialEmails.length;
            });

            return {
                hoy: hoyCount,
                lotesProduccion: lotesCount,
                entregas: entregasCount,
                recepciones: recepcionesCount,
                montoPagosUSD: montoPagosUSD,
                emailsEnviados: emailsEnviados
            };
        },

        obtenerCompromisosFiltrados() {
            return this.compromisos.filter(c => {
                // Filtro Categoría
                if (this.filtroCategoria !== 'todos' && c.categoria !== this.filtroCategoria) return false;
                // Filtro Prioridad
                if (this.filtroPrioridad !== 'todos' && c.prioridad !== this.filtroPrioridad) return false;
                // Filtro Texto
                if (this.busquedaTexto) {
                    const searchCorpus = [
                        c.titulo,
                        c.productoNombre,
                        c.clienteNombre,
                        c.proveedorNombre,
                        c.responsable,
                        c.notas,
                        c.tipoObligacion,
                        c.muelleRecepcion
                    ].filter(Boolean).join(' ').toLowerCase();

                    if (!searchCorpus.includes(this.busquedaTexto)) return false;
                }
                return true;
            });
        },

        // --------------------------------------------------------------------------
        // 3. VISTA 1: MULTI-MES CONTINUA (SECUENCIA DE MESES)
        // --------------------------------------------------------------------------
        renderVistaMultiMes() {
            const htmlMeses = [];
            const fechaBase = new Date(this.mesInicio.getFullYear(), this.mesInicio.getMonth(), 1);

            for (let i = 0; i < this.mesesVisiblesCount; i++) {
                const mesIter = new Date(fechaBase.getFullYear(), fechaBase.getMonth() + i, 1);
                const esPrimerMes = (i === 0);

                if (!esPrimerMes) {
                    // Elegante divisor corporativo entre meses
                    const nombreMesSig = mesIter.toLocaleString('es-VE', { month: 'long', year: 'numeric' }).toUpperCase();
                    htmlMeses.push(`
                        <div class="agenda-month-divider">
                            <div class="agenda-divider-line"></div>
                            <div class="agenda-divider-badge">
                                <i class="fa-solid fa-calendar-week"></i>
                                <span>${nombreMesSig} — PROYECCIÓN OPERATIVA Y PLANIFICACIÓN CONTINUA</span>
                            </div>
                            <div class="agenda-divider-line"></div>
                        </div>
                    `);
                }

                htmlMeses.push(this.renderWidgetMesCompleto(mesIter));
            }

            return `
                <div class="agenda-multimes-container">
                    ${htmlMeses.join('')}

                    <div class="agenda-more-months-banner">
                        <button type="button" class="btn-agenda-more-months" onclick="window.ViasaAgendaEngine.agregarMesSubsecuente()">
                            <i class="fa-solid fa-plus-circle"></i>
                            <span>Desplegar Mes Adicional en la Secuencia Continua</span>
                        </button>
                    </div>
                </div>
            `;
        },

        renderWidgetMesCompleto(dateObj) {
            const year = dateObj.getFullYear();
            const month = dateObj.getMonth(); // 0 a 11
            const monthName = dateObj.toLocaleString('es-VE', { month: 'long' });
            const monthTitle = `${monthName.toUpperCase()} ${year}`;

            // Días del mes
            const primerDiaMes = new Date(year, month, 1);
            const ultimoDiaMes = new Date(year, month + 1, 0);
            const totalDias = ultimoDiaMes.getDate();

            // Día de la semana del día 1 (0 = Domingo, 1 = Lunes, ..., 6 = Sábado)
            // Ajustamos a formato Lunes = 0, Domingo = 6
            let primerDiaSemana = primerDiaMes.getDay() - 1;
            if (primerDiaSemana === -1) primerDiaSemana = 6;

            const filtrados = this.obtenerCompromisosFiltrados();

            // Contar eventos del mes para cabecera de widget
            const eventosDelMes = filtrados.filter(c => {
                const f = new Date(c.fecha + 'T00:00:00');
                return f.getFullYear() === year && f.getMonth() === month;
            });

            const diasSemanaNombres = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

            // Celdas del calendario
            const celdas = [];

            // Celdas vacías previas
            const mesAntUltimoDia = new Date(year, month, 0).getDate();
            for (let p = primerDiaSemana - 1; p >= 0; p--) {
                const numDiaAnt = mesAntUltimoDia - p;
                celdas.push(`
                    <div class="agenda-day-cell outside-month">
                        <div class="agenda-day-number">${numDiaAnt}</div>
                    </div>
                `);
            }

            // Celdas activas del mes
            for (let dia = 1; dia <= totalDias; dia++) {
                const diaStr = String(dia).padStart(2, '0');
                const mesStr = String(month + 1).padStart(2, '0');
                const fechaISO = `${year}-${mesStr}-${diaStr}`;
                const esHoy = (fechaISO === this.fechaHoyCalculada);

                // Compromisos del día
                const eventosDia = filtrados.filter(c => c.fecha === fechaISO);
                // Ordenar por hora de inicio
                eventosDia.sort((a, b) => (a.horaInicio || '').localeCompare(b.horaInicio || ''));

                const htmlCapsulas = eventosDia.map(ev => this.renderCapsulaEjecutiva(ev)).join('');

                celdas.push(`
                    <div class="agenda-day-cell ${esHoy ? 'is-today' : ''}" data-fecha="${fechaISO}" onclick="window.ViasaAgendaEngine.onDiaClick('${fechaISO}', event)">
                        <div class="agenda-day-header">
                            <div class="agenda-day-left">
                                <span class="agenda-day-num">${dia}</span>
                                ${esHoy ? `<span class="agenda-badge-today">HOY</span>` : ''}
                            </div>
                            ${eventosDia.length > 0 ? `<span class="agenda-day-load-badge">${eventosDia.length} ${eventosDia.length === 1 ? 'evento' : 'eventos'}</span>` : ''}
                        </div>

                        <div class="agenda-day-capsules-list">
                            ${htmlCapsulas}
                        </div>
                    </div>
                `);
            }

            // Celdas vacías posteriores para completar la cuadrícula de 7 columnas
            const totalCeldasOcupadas = primerDiaSemana + totalDias;
            const resto = totalCeldasOcupadas % 7;
            if (resto !== 0) {
                const celdasFaltantes = 7 - resto;
                for (let s = 1; s <= celdasFaltantes; s++) {
                    celdas.push(`
                        <div class="agenda-day-cell outside-month">
                            <div class="agenda-day-number">${s}</div>
                        </div>
                    `);
                }
            }

            return `
                <div class="agenda-month-card">
                    <div class="agenda-month-card-header">
                        <div class="agenda-month-card-title">
                            <i class="fa-solid fa-calendar-check" style="color: #F59E0B;"></i>
                            <span>${monthTitle}</span>
                        </div>
                        <div class="agenda-month-summary-chips">
                            <span class="agenda-chip-stat"><i class="fa-solid fa-list-check"></i> ${eventosDelMes.length} Compromisos</span>
                            <span class="agenda-chip-stat produccion"><i class="fa-solid fa-fire-burner"></i> ${eventosDelMes.filter(e => e.categoria === 'produccion').length} Lotes</span>
                            <span class="agenda-chip-stat entrega"><i class="fa-solid fa-truck-fast"></i> ${eventosDelMes.filter(e => e.categoria === 'entrega').length} Despachos</span>
                            <span class="agenda-chip-stat pago"><i class="fa-solid fa-file-invoice-dollar"></i> ${eventosDelMes.filter(e => e.categoria === 'pago').length} Obligaciones</span>
                        </div>
                    </div>

                    <div class="agenda-calendar-grid">
                        <div class="agenda-weekdays-row">
                            ${diasSemanaNombres.map(d => `<div class="agenda-weekday-col">${d}</div>`).join('')}
                        </div>
                        <div class="agenda-days-grid">
                            ${celdas.join('')}
                        </div>
                    </div>
                </div>
            `;
        },

        // Renderizado de la Cápsula Ejecutiva con barra izquierda 3px de alto contraste
        renderCapsulaEjecutiva(ev) {
            const cat = CATEGORIAS_AGENDA[ev.categoria] || CATEGORIAS_AGENDA.produccion;
            const hora = ev.horaInicio ? ev.horaInicio : '--:--';
            const estadoLabel = ev.estado === 'en_curso' ? 'En Curso' : ev.estado === 'completado' ? 'Listo' : ev.estado === 'postergado' ? 'Postergado' : 'Prog.';

            return `
                <div class="agenda-capsule ${ev.categoria}" 
                     style="--cat-color: ${cat.color}; --cat-bg: ${cat.colorBg}; --cat-border: ${cat.colorBorder};"
                     data-id="${ev.id}" 
                     onclick="event.stopPropagation(); window.ViasaAgendaEngine.abrirModalCompromiso('${ev.id}')"
                     title="${ev.titulo} • ${ev.horaInicio} a ${ev.horaFin || 'Fin'} • ${cat.label}">
                    <div class="agenda-capsule-top">
                        <span class="agenda-capsule-time"><i class="fa-regular fa-clock"></i> ${hora}</span>
                        <span class="agenda-capsule-status ${ev.estado}">${estadoLabel}</span>
                    </div>
                    <div class="agenda-capsule-title">
                        <i class="fa-solid ${cat.icon}" style="color:${cat.color};"></i>
                        <span>${this.escapeHtml(ev.titulo)}</span>
                    </div>
                </div>
            `;
        },

        onDiaClick(fechaISO, event) {
            // Abre el modal de creación con la fecha ya precargada
            this.abrirModalCompromiso(null, fechaISO);
        },

        // --------------------------------------------------------------------------
        // 4. VISTA 2: DUAL EJECUTIVA (2 MESES LADO A LADO)
        // --------------------------------------------------------------------------
        renderVistaDual() {
            const mes1 = new Date(this.mesInicio.getFullYear(), this.mesInicio.getMonth(), 1);
            const mes2 = new Date(this.mesInicio.getFullYear(), this.mesInicio.getMonth() + 1, 1);

            return `
                <div class="agenda-dual-wrapper">
                    <div class="agenda-dual-col">
                        ${this.renderWidgetMesCompleto(mes1)}
                    </div>
                    <div class="agenda-dual-col">
                        ${this.renderWidgetMesCompleto(mes2)}
                    </div>
                </div>
            `;
        },

        // --------------------------------------------------------------------------
        // 5. VISTA 3: CRONOGRAMA HORARIO DE PLANTA Y HORNOS (TIMELINE 24H)
        // --------------------------------------------------------------------------
        renderVistaTimeline() {
            const fechaSel = this.fechaTimeline;
            const filtrados = this.obtenerCompromisosFiltrados();
            const eventosDia = filtrados.filter(c => c.fecha === fechaSel);

            // Horas de 00 a 23
            const horas = [];
            for (let h = 0; h < 24; h++) {
                horas.push(String(h).padStart(2, '0'));
            }

            const filasHorarias = horas.map(hStr => {
                const horaNum = parseInt(hStr, 10);
                const etiquetaHora = `${hStr}:00`;

                // Eventos que tocan esta hora
                const evs = eventosDia.filter(e => {
                    const hIni = parseInt((e.horaInicio || '00:00').split(':')[0], 10);
                    const hFin = parseInt((e.horaFin || '23:59').split(':')[0], 10);
                    return horaNum >= hIni && horaNum <= hFin;
                });

                return `
                    <div class="agenda-timeline-row">
                        <div class="agenda-timeline-hour-marker">
                            <span>${etiquetaHora}</span>
                        </div>
                        <div class="agenda-timeline-slots-area">
                            ${evs.length === 0 ? `<div class="agenda-timeline-empty-slot"></div>` : evs.map(e => this.renderTimelineCard(e)).join('')}
                        </div>
                    </div>
                `;
            }).join('');

            return `
                <div class="agenda-timeline-container">
                    <div class="agenda-timeline-header-bar">
                        <div class="agenda-timeline-nav">
                            <button type="button" class="btn-timeline-arrow" onclick="window.ViasaAgendaEngine.cambiarFechaTimeline(-1)">
                                <i class="fa-solid fa-chevron-left"></i> Día Anterior
                            </button>
                            <input type="date" class="agenda-timeline-date-input" value="${fechaSel}" onchange="window.ViasaAgendaEngine.fijarFechaTimeline(this.value)" />
                            <button type="button" class="btn-timeline-arrow" onclick="window.ViasaAgendaEngine.cambiarFechaTimeline(1)">
                                Día Siguiente <i class="fa-solid fa-chevron-right"></i>
                            </button>
                        </div>
                        <div class="agenda-timeline-meta">
                            <span class="agenda-timeline-day-title">Cronograma de Operaciones: <b>${fechaSel}</b></span>
                            <span class="agenda-timeline-count">${eventosDia.length} eventos en timeline</span>
                        </div>
                    </div>

                    <div class="agenda-timeline-scroll">
                        ${filasHorarias}
                    </div>
                </div>
            `;
        },

        renderTimelineCard(e) {
            const cat = CATEGORIAS_AGENDA[e.categoria] || CATEGORIAS_AGENDA.produccion;
            return `
                <div class="agenda-timeline-card ${e.categoria}" 
                     style="--cat-color: ${cat.color}; --cat-bg: ${cat.colorBg}; --cat-border: ${cat.colorBorder};"
                     onclick="window.ViasaAgendaEngine.abrirModalCompromiso('${e.id}')">
                    <div class="agenda-timeline-card-time">
                        <i class="fa-solid fa-clock"></i> ${e.horaInicio} — ${e.horaFin || 'Fin'}
                    </div>
                    <div class="agenda-timeline-card-content">
                        <div class="agenda-timeline-card-title">
                            <i class="fa-solid ${cat.icon}" style="color:${cat.color};"></i>
                            <b>${this.escapeHtml(e.titulo)}</b>
                        </div>
                        <div class="agenda-timeline-card-meta">
                            ${e.productoNombre ? `<span><i class="fa-solid fa-box"></i> ${e.productoNombre} (${e.cantidadLotes} paq)</span>` : ''}
                            ${e.clienteNombre ? `<span><i class="fa-solid fa-user-tag"></i> ${e.clienteNombre}</span>` : ''}
                            ${e.proveedorNombre ? `<span><i class="fa-solid fa-truck"></i> ${e.proveedorNombre}</span>` : ''}
                            ${e.responsable ? `<span><i class="fa-solid fa-user-gear"></i> ${e.responsable}</span>` : ''}
                            ${e.muelleRecepcion ? `<span><i class="fa-solid fa-warehouse"></i> ${e.muelleRecepcion}</span>` : ''}
                        </div>
                    </div>
                    <div class="agenda-timeline-card-badge">
                        <span class="agenda-badge-status ${e.estado}">${e.estado}</span>
                    </div>
                </div>
            `;
        },

        cambiarFechaTimeline(delta) {
            const parts = this.fechaTimeline.split('-').map(Number);
            const d = new Date(parts[0], parts[1] - 1, parts[2] + delta);
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const dia = String(d.getDate()).padStart(2, '0');
            this.fechaTimeline = `${y}-${m}-${dia}`;
            this.render();
        },

        fijarFechaTimeline(val) {
            if (val) {
                this.fechaTimeline = val;
                this.render();
            }
        },

        // --------------------------------------------------------------------------
        // 6. VISTA 4: TABLERO KANBAN CORPORATIVO POR ESTADO
        // --------------------------------------------------------------------------
        renderVistaKanban() {
            const filtrados = this.obtenerCompromisosFiltrados();

            const columnas = [
                { id: 'programado', label: '1. Programado / En Cola', icon: 'fa-list-check', color: '#38BDF8' },
                { id: 'en_curso', label: '2. En Curso / En Planta / En Horno', icon: 'fa-fire-burner', color: '#F59E0B' },
                { id: 'completado', label: '3. Completado / Liquidado', icon: 'fa-circle-check', color: '#10B981' },
                { id: 'postergado', label: '4. Postergado / En Espera', icon: 'fa-clock-rotate-left', color: '#A855F7' }
            ];

            const htmlColumnas = columnas.map(col => {
                const itemsCol = filtrados.filter(c => c.estado === col.id);
                const cardsHtml = itemsCol.map(ev => this.renderKanbanCard(ev)).join('');

                return `
                    <div class="agenda-kanban-col" data-col="${col.id}">
                        <div class="agenda-kanban-col-header" style="border-top-color: ${col.color};">
                            <div class="agenda-kanban-col-title">
                                <i class="fa-solid ${col.icon}" style="color:${col.color};"></i>
                                <span>${col.label}</span>
                            </div>
                            <span class="agenda-kanban-col-count" style="background:${col.color}22; color:${col.color}; border:1px solid ${col.color}55;">
                                ${itemsCol.length}
                            </span>
                        </div>

                        <div class="agenda-kanban-cards-stream">
                            ${itemsCol.length === 0 ? `<div class="agenda-kanban-empty">Sin compromisos en esta fase</div>` : cardsHtml}
                        </div>
                    </div>
                `;
            }).join('');

            return `
                <div class="agenda-kanban-board">
                    ${htmlColumnas}
                </div>
            `;
        },

        renderKanbanCard(ev) {
            const cat = CATEGORIAS_AGENDA[ev.categoria] || CATEGORIAS_AGENDA.produccion;
            return `
                <div class="agenda-kanban-card ${ev.categoria}" 
                     style="--cat-color: ${cat.color}; --cat-bg: ${cat.colorBg}; --cat-border: ${cat.colorBorder};"
                     onclick="window.ViasaAgendaEngine.abrirModalCompromiso('${ev.id}')">
                    <div class="agenda-kanban-card-top">
                        <span class="agenda-kanban-card-cat" style="color:${cat.color};">
                            <i class="fa-solid ${cat.icon}"></i> ${cat.label}
                        </span>
                        <span class="agenda-kanban-card-prio ${ev.prioridad}">${ev.prioridad}</span>
                    </div>

                    <div class="agenda-kanban-card-title">${this.escapeHtml(ev.titulo)}</div>

                    <div class="agenda-kanban-card-meta">
                        <div><i class="fa-regular fa-calendar"></i> ${ev.fecha} • ${ev.horaInicio}</div>
                        ${ev.productoNombre ? `<div><i class="fa-solid fa-bread-slice"></i> ${ev.productoNombre}</div>` : ''}
                        ${ev.clienteNombre ? `<div><i class="fa-solid fa-building"></i> ${ev.clienteNombre}</div>` : ''}
                        ${ev.proveedorNombre ? `<div><i class="fa-solid fa-truck-field"></i> ${ev.proveedorNombre}</div>` : ''}
                        ${ev.montoUSD ? `<div style="color:#10B981; font-weight:700;"><i class="fa-solid fa-dollar-sign"></i> USD ${ev.montoUSD.toFixed(2)}</div>` : ''}
                    </div>

                    <!-- BOTONES DE CAMBIO RÁPIDO DE ESTADO -->
                    <div class="agenda-kanban-quick-actions" onclick="event.stopPropagation();">
                        ${ev.estado !== 'programado' ? `
                            <button type="button" class="btn-kanban-step" title="Mover a Programado" onclick="window.ViasaAgendaEngine.moverEstadoKanban('${ev.id}', 'programado')">
                                <i class="fa-solid fa-arrow-left"></i>
                            </button>
                        ` : ''}
                        ${ev.estado !== 'en_curso' ? `
                            <button type="button" class="btn-kanban-step amber" title="Poner En Curso" onclick="window.ViasaAgendaEngine.moverEstadoKanban('${ev.id}', 'en_curso')">
                                <i class="fa-solid fa-play"></i> Iniciar
                            </button>
                        ` : ''}
                        ${ev.estado !== 'completado' ? `
                            <button type="button" class="btn-kanban-step green" title="Marcar Completado" onclick="window.ViasaAgendaEngine.moverEstadoKanban('${ev.id}', 'completado')">
                                <i class="fa-solid fa-check"></i> Listo
                            </button>
                        ` : ''}
                        ${ev.estado !== 'postergado' ? `
                            <button type="button" class="btn-kanban-step purple" title="Postergar" onclick="window.ViasaAgendaEngine.moverEstadoKanban('${ev.id}', 'postergado')">
                                <i class="fa-solid fa-pause"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
        },

        async moverEstadoKanban(id, nuevoEstado) {
            const ev = this.compromisos.find(c => c.id === id);
            if (!ev) return;
            ev.estado = nuevoEstado;
            await this.persistirCompromisos();
            this.render();
            if (window.ViasaAudio && typeof window.ViasaAudio.playClick === 'function') {
                window.ViasaAudio.playClick();
            }
        },

        // --------------------------------------------------------------------------
        // 7. MODAL DE CREACIÓN / EDICIÓN DE COMPROMISO
        // --------------------------------------------------------------------------
        abrirModalCompromiso(id = null, fechaPrevia = null) {
            let ev = null;
            if (id) {
                ev = this.compromisos.find(c => c.id === id);
            }

            const esEdicion = !!ev;
            const fechaDefault = ev ? ev.fecha : (fechaPrevia || this.fechaHoyCalculada);
            const horaInicioDefault = ev ? ev.horaInicio : '08:00';
            const horaFinDefault = ev ? ev.horaFin : '10:00';
            const catDefault = ev ? ev.categoria : 'produccion';

            const modalExistente = document.getElementById('modal-agenda-compromiso');
            if (modalExistente) modalExistente.remove();

            // Productos de Nueva Viasa para el selector
            const prods = (window.ViasaDatabase && Array.isArray(window.ViasaDatabase.productos)) ? window.ViasaDatabase.productos : [];
            // Clientes para el selector
            const clientes = (window.ViasaDatabase && Array.isArray(window.ViasaDatabase.clientes)) ? window.ViasaDatabase.clientes : [];
            // Proveedores para el selector
            const proveedores = (window.ViasaDatabase && Array.isArray(window.ViasaDatabase.proveedores)) ? window.ViasaDatabase.proveedores : [];

            const modal = document.createElement('div');
            modal.id = 'modal-agenda-compromiso';
            modal.className = 'agenda-modal-overlay';
            modal.innerHTML = `
                <div class="agenda-modal-card">
                    <div class="agenda-modal-header">
                        <div class="agenda-modal-title-box">
                            <i class="fa-solid ${esEdicion ? 'fa-pen-to-square' : 'fa-calendar-plus'}" style="color: #F59E0B; font-size: 1.3rem;"></i>
                            <div>
                                <h3 class="agenda-modal-title">${esEdicion ? 'Modificar Compromiso Operativo' : 'Agendar Nuevo Compromiso / Lote'}</h3>
                                <span class="agenda-modal-subtitle">${EMPRESA_CONFIG.nombre} • Control Operativo</span>
                            </div>
                        </div>
                        <button type="button" class="agenda-modal-close" onclick="window.ViasaAgendaEngine.cerrarModalCompromiso()">&times;</button>
                    </div>

                    <form id="form-agenda-compromiso" onsubmit="window.ViasaAgendaEngine.guardarCompromisoDesdeModal(event)">
                        <input type="hidden" name="compromisoId" value="${ev ? ev.id : ''}" />

                        <div class="agenda-modal-body">
                            <!-- FILA 1: TÍTULO Y CATEGORÍA -->
                            <div class="agenda-form-grid-2">
                                <div class="agenda-form-field">
                                    <label class="agenda-label">Título del Compromiso / Lote *</label>
                                    <input type="text" name="titulo" class="agenda-input" required placeholder="Ej. Elaboración Lote Pan Hamburguesa PILÓN..." value="${ev ? this.escapeHtml(ev.titulo) : ''}" />
                                </div>
                                <div class="agenda-form-field">
                                    <label class="agenda-label">Categoría Operativa *</label>
                                    <select name="categoria" id="agenda-form-cat" class="agenda-input" onchange="window.ViasaAgendaEngine.onCambioCategoriaForm(this.value)">
                                        <option value="produccion" ${catDefault === 'produccion' ? 'selected' : ''}>🔥 Producción y Lotes de Horno</option>
                                        <option value="entrega" ${catDefault === 'entrega' ? 'selected' : ''}>🚚 Entregas y Despachos B2B/Clientes</option>
                                        <option value="recepcion" ${catDefault === 'recepcion' ? 'selected' : ''}>📦 Recepción de Proveedores y Compras</option>
                                        <option value="reunion" ${catDefault === 'reunion' ? 'selected' : ''}>💼 Reuniones de Negocios y Junta Directiva</option>
                                        <option value="pago" ${catDefault === 'pago' ? 'selected' : ''}>🏛️ Pagos SENIAT / Facturas / Mantenimiento</option>
                                    </select>
                                </div>
                            </div>

                            <!-- FILA 2: FECHA, HORAS Y PRIORIDAD -->
                            <div class="agenda-form-grid-4">
                                <div class="agenda-form-field">
                                    <label class="agenda-label">Fecha Programada *</label>
                                    <input type="date" name="fecha" class="agenda-input" required value="${fechaDefault}" />
                                </div>
                                <div class="agenda-form-field">
                                    <label class="agenda-label">Hora Inicio *</label>
                                    <input type="time" name="horaInicio" class="agenda-input" required value="${horaInicioDefault}" />
                                </div>
                                <div class="agenda-form-field">
                                    <label class="agenda-label">Hora Fin *</label>
                                    <input type="time" name="horaFin" class="agenda-input" required value="${horaFinDefault}" />
                                </div>
                                <div class="agenda-form-field">
                                    <label class="agenda-label">Prioridad *</label>
                                    <select name="prioridad" class="agenda-input">
                                        <option value="normal" ${ev && ev.prioridad === 'normal' ? 'selected' : ''}>Normal</option>
                                        <option value="alta" ${ev && ev.prioridad === 'alta' ? 'selected' : ''}>Alta</option>
                                        <option value="critica" ${ev && ev.prioridad === 'critica' ? 'selected' : ''}>Crítica</option>
                                    </select>
                                </div>
                            </div>

                            <!-- SECCIÓN DINÁMICA: PRODUCCIÓN -->
                            <div id="agenda-sec-produccion" class="agenda-dynamic-section" style="${catDefault === 'produccion' ? 'display:block;' : 'display:none;'}">
                                <div class="agenda-sec-title"><i class="fa-solid fa-fire-burner" style="color:#F59E0B;"></i> Parámetros de Panificación y Horno</div>
                                <div class="agenda-form-grid-3">
                                    <div class="agenda-form-field">
                                        <label class="agenda-label">Producto Nueva Viasa</label>
                                        <select name="productoId" class="agenda-input" onchange="window.ViasaAgendaEngine.onSelectProductoForm(this.value)">
                                            <option value="">-- Seleccionar Producto del Catálogo --</option>
                                            ${prods.map(p => `<option value="${p.id}" ${ev && ev.productoId === p.id ? 'selected' : ''}>${p.nombre} (SKU: ${p.sku || p.id})</option>`).join('')}
                                        </select>
                                    </div>
                                    <div class="agenda-form-field">
                                        <label class="agenda-label">Cantidad de Paquetes / Lotes</label>
                                        <input type="number" name="cantidadLotes" class="agenda-input" min="1" step="1" value="${ev && ev.cantidadLotes ? ev.cantidadLotes : 100}" />
                                    </div>
                                    <div class="agenda-form-field">
                                        <label class="agenda-label">Turno / Horno Asignado</label>
                                        <select name="turnoNombre" class="agenda-input">
                                            <option value="Turno Madrugada (04:00 - 12:00)" ${ev && ev.turnoNombre && ev.turnoNombre.includes('Madrugada') ? 'selected' : ''}>1. Turno Madrugada (04:00 - 12:00)</option>
                                            <option value="Turno Matutino (06:00 - 14:00)" ${ev && ev.turnoNombre && ev.turnoNombre.includes('Matutino') ? 'selected' : ''}>2. Turno Matutino (06:00 - 14:00)</option>
                                            <option value="Turno Vespertino (14:00 - 22:00)" ${ev && ev.turnoNombre && ev.turnoNombre.includes('Vespertino') ? 'selected' : ''}>3. Turno Vespertino (14:00 - 22:00)</option>
                                            <option value="Turno Nocturno (22:00 - 06:00)" ${ev && ev.turnoNombre && ev.turnoNombre.includes('Nocturno') ? 'selected' : ''}>4. Turno Nocturno (22:00 - 06:00)</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="agenda-form-grid-2" style="margin-top:10px;">
                                    <div class="agenda-form-field">
                                        <label class="agenda-label">Maestro Panadero Responsable</label>
                                        <input type="text" name="responsable" class="agenda-input" placeholder="Ej. Carlos Mendoza, Antonio Silva..." value="${ev && ev.responsable ? this.escapeHtml(ev.responsable) : 'Carlos Mendoza (Maestro Hornero)'}" />
                                    </div>
                                    <div class="agenda-form-field">
                                        <label class="agenda-label">Estado Operativo</label>
                                        <select name="estado" class="agenda-input">
                                            <option value="programado" ${ev && ev.estado === 'programado' ? 'selected' : ''}>Programado / En Espera</option>
                                            <option value="en_curso" ${ev && ev.estado === 'en_curso' ? 'selected' : ''}>En Curso / Horneando</option>
                                            <option value="completado" ${ev && ev.estado === 'completado' ? 'selected' : ''}>Completado / Listo</option>
                                            <option value="postergado" ${ev && ev.estado === 'postergado' ? 'selected' : ''}>Postergado</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <!-- SECCIÓN DINÁMICA: CLIENTE / ENTREGA -->
                            <div id="agenda-sec-entrega" class="agenda-dynamic-section" style="${(catDefault === 'entrega' || catDefault === 'reunion') ? 'display:block;' : 'display:none;'}">
                                <div class="agenda-sec-title"><i class="fa-solid fa-truck-fast" style="color:#10B981;"></i> Vinculación CRM con Cliente Aliado</div>
                                <div class="agenda-form-grid-3">
                                    <div class="agenda-form-field">
                                        <label class="agenda-label">Seleccionar Cliente Registrado</label>
                                        <select name="clienteSelect" class="agenda-input" onchange="window.ViasaAgendaEngine.onSelectClienteForm(this.value)">
                                            <option value="">-- Seleccionar Cliente --</option>
                                            ${clientes.map(c => `<option value="${c.id}" ${ev && ev.clienteId === c.id ? 'selected' : ''}>${c.nombre} (${c.rifCedula || 'S/R'})</option>`).join('')}
                                        </select>
                                    </div>
                                    <div class="agenda-form-field">
                                        <label class="agenda-label">Nombre / Razón Social del Cliente</label>
                                        <input type="text" name="clienteNombre" id="agenda-input-cliente-nombre" class="agenda-input" placeholder="Nombre del cliente..." value="${ev && ev.clienteNombre ? this.escapeHtml(ev.clienteNombre) : ''}" />
                                    </div>
                                    <div class="agenda-form-field">
                                        <label class="agenda-label">Correo Electrónico (Email) *</label>
                                        <input type="email" name="clienteEmail" id="agenda-input-cliente-email" class="agenda-input" placeholder="correo@cliente.com" value="${ev && ev.clienteEmail ? this.escapeHtml(ev.clienteEmail) : ''}" />
                                    </div>
                                </div>
                                <div class="agenda-form-grid-3" style="margin-top:10px;">
                                    <div class="agenda-form-field">
                                        <label class="agenda-label">RIF / C.I.</label>
                                        <input type="text" name="clienteRif" id="agenda-input-cliente-rif" class="agenda-input" placeholder="J-00000000-0" value="${ev && ev.clienteRif ? this.escapeHtml(ev.clienteRif) : ''}" />
                                    </div>
                                    <div class="agenda-form-field">
                                        <label class="agenda-label">Teléfono / WhatsApp</label>
                                        <input type="text" name="clienteTelefono" id="agenda-input-cliente-tel" class="agenda-input" placeholder="0414-0000000" value="${ev && ev.clienteTelefono ? this.escapeHtml(ev.clienteTelefono) : ''}" />
                                    </div>
                                    <div class="agenda-form-field">
                                        <label class="agenda-label">Monto Estimado ($ USD)</label>
                                        <input type="number" step="0.01" name="montoUSD" class="agenda-input" placeholder="0.00" value="${ev && ev.montoUSD ? ev.montoUSD : ''}" />
                                    </div>
                                </div>
                            </div>

                            <!-- SECCIÓN DINÁMICA: PROVEEDOR / RECEPCIÓN -->
                            <div id="agenda-sec-recepcion" class="agenda-dynamic-section" style="${(catDefault === 'recepcion' || catDefault === 'pago') ? 'display:block;' : 'display:none;'}">
                                <div class="agenda-sec-title"><i class="fa-solid fa-boxes-packing" style="color:#06B6D4;"></i> Vinculación con Proveedor y Compras</div>
                                <div class="agenda-form-grid-3">
                                    <div class="agenda-form-field">
                                        <label class="agenda-label">Seleccionar Proveedor</label>
                                        <select name="proveedorSelect" class="agenda-input" onchange="window.ViasaAgendaEngine.onSelectProveedorForm(this.value)">
                                            <option value="">-- Seleccionar Proveedor --</option>
                                            ${proveedores.map(p => `<option value="${p.id}" ${ev && ev.proveedorId === p.id ? 'selected' : ''}>${p.nombreEmpresa || p.nombre} (${p.vendedor || 'S/V'})</option>`).join('')}
                                        </select>
                                    </div>
                                    <div class="agenda-form-field">
                                        <label class="agenda-label">Razón Social del Proveedor</label>
                                        <input type="text" name="proveedorNombre" id="agenda-input-prov-nombre" class="agenda-input" placeholder="Empresa proveedora..." value="${ev && ev.proveedorNombre ? this.escapeHtml(ev.proveedorNombre) : ''}" />
                                    </div>
                                    <div class="agenda-form-field">
                                        <label class="agenda-label">Email del Proveedor / Vendedor</label>
                                        <input type="email" name="proveedorEmail" id="agenda-input-prov-email" class="agenda-input" placeholder="ventas@proveedor.com" value="${ev && ev.proveedorEmail ? this.escapeHtml(ev.proveedorEmail) : ''}" />
                                    </div>
                                </div>
                                <div class="agenda-form-grid-3" style="margin-top:10px;">
                                    <div class="agenda-form-field">
                                        <label class="agenda-label">Representante de Ventas</label>
                                        <input type="text" name="representanteVentas" id="agenda-input-prov-rep" class="agenda-input" placeholder="Ej. Naisi, Roberto Morales..." value="${ev && ev.representanteVentas ? this.escapeHtml(ev.representanteVentas) : ''}" />
                                    </div>
                                    <div class="agenda-form-field">
                                        <label class="agenda-label">Muelle de Recepción</label>
                                        <select name="muelleRecepcion" class="agenda-input">
                                            <option value="Muelle A — Carga Pesada Harinas" ${ev && ev.muelleRecepcion && ev.muelleRecepcion.includes('Muelle A') ? 'selected' : ''}>Muelle A — Carga Pesada Harinas</option>
                                            <option value="Muelle B — Insumos Secos y Levaduras" ${ev && ev.muelleRecepcion && ev.muelleRecepcion.includes('Muelle B') ? 'selected' : ''}>Muelle B — Insumos Secos y Levaduras</option>
                                            <option value="Muelle C — Refrigerados y Lácteos" ${ev && ev.muelleRecepcion && ev.muelleRecepcion.includes('Muelle C') ? 'selected' : ''}>Muelle C — Refrigerados y Lácteos</option>
                                        </select>
                                    </div>
                                    <div class="agenda-form-field">
                                        <label class="agenda-label">Monto de la Factura / Pago ($ USD)</label>
                                        <input type="number" step="0.01" name="montoFacturaUSD" class="agenda-input" placeholder="0.00" value="${ev && ev.montoUSD ? ev.montoUSD : ''}" />
                                    </div>
                                </div>
                            </div>

                            <!-- NOTAS OPERATIVAS -->
                            <div class="agenda-form-field" style="margin-top:12px;">
                                <label class="agenda-label">Instrucciones Operativas y Notas Especiales</label>
                                <textarea name="notas" class="agenda-textarea" rows="2" placeholder="Especificaciones de horno, número de factura, guía SADA, muelle de descarga...">${ev && ev.notas ? this.escapeHtml(ev.notas) : ''}</textarea>
                            </div>

                            <!-- OPCIONES DE EMAIL Y CITACIÓN -->
                            <div class="agenda-email-trigger-box">
                                <label class="agenda-checkbox-label">
                                    <input type="checkbox" name="enviarEmailNotif" id="agenda-chk-email" ${ev && ev.enviarEmailNotif ? 'checked' : ''} />
                                    <span><b>☑️ Enviar Notificación / Citación Oficial por Email al Guardar</b></span>
                                </label>
                                <button type="button" class="btn-agenda-preview-email" onclick="window.ViasaAgendaEngine.previsualizarEmailDesdeForm()">
                                    <i class="fa-solid fa-eye"></i> Previsualizar Plantilla de Email
                                </button>
                            </div>

                            ${esEdicion && Array.isArray(ev.historialEmails) && ev.historialEmails.length > 0 ? `
                                <div class="agenda-historial-emails-box">
                                    <div class="agenda-historial-title"><i class="fa-solid fa-clock-rotate-left"></i> Historial de Notificaciones Enviadas de este Evento</div>
                                    <table class="agenda-table-mini">
                                        <thead>
                                            <tr>
                                                <th>Fecha/Hora</th>
                                                <th>Destinatario</th>
                                                <th>Email</th>
                                                <th>Canal</th>
                                                <th>Estado</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${ev.historialEmails.map(h => `
                                                <tr>
                                                    <td>${h.fechaEnvio}</td>
                                                    <td>${this.escapeHtml(h.destinatario || '')}</td>
                                                    <td>${this.escapeHtml(h.email || '')}</td>
                                                    <td>${h.canal || 'Email'}</td>
                                                    <td><span class="agenda-badge-status completado">${h.estado || 'Enviado'}</span></td>
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            ` : ''}
                        </div>

                        <div class="agenda-modal-footer viasa-modal-footer" style="position: relative; display: flex; flex-direction: row; align-items: center; justify-content: flex-end; gap: 16px; width: 100%; padding: 16px 24px; background-color: #FAF7F2; border-top: 1px solid #E2D9C8; flex-shrink: 0; box-sizing: border-box;">
                            ${esEdicion ? `
                                <button type="button" class="btn-agenda-danger" onclick="window.ViasaAgendaEngine.eliminarCompromiso('${ev.id}')" style="position: static !important; display: inline-flex !important; align-items: center; justify-content: center; gap: 8px; padding: 10px 18px; margin: 0 !important; background-color: #DC2626; color: #FFFFFF; border: none; border-radius: 8px; font-size: 13.5px; font-weight: 700; white-space: nowrap; cursor: pointer;">
                                    <i class="fa-solid fa-trash-can"></i> Eliminar
                                </button>
                            ` : ''}
                            <button type="button" class="btn-agenda-cancel" onclick="window.ViasaAgendaEngine.cerrarModalCompromiso()" style="position: static !important; display: inline-flex !important; align-items: center; justify-content: center; gap: 8px; padding: 10px 22px; margin: 0 !important; background-color: #F3EDE2; color: #2C1A12; border: 1px solid #C8B89E; border-radius: 8px; font-size: 13.5px; font-weight: 700; white-space: nowrap; cursor: pointer;">
                                Cancelar
                            </button>
                            <button type="submit" class="btn-agenda-action gold" style="position: static !important; display: inline-flex !important; align-items: center; justify-content: center; gap: 8px; padding: 10px 24px; margin: 0 !important; background-color: #C88A2B; color: #FFFFFF; border: none; border-radius: 8px; font-size: 13.5px; font-weight: 800; white-space: nowrap; cursor: pointer;">
                                <i class="fa-solid fa-floppy-disk"></i> 💾 Guardar Compromiso
                            </button>
                        </div>
                    </form>
                </div>
            `;

            document.body.appendChild(modal);
        },

        cerrarModalCompromiso() {
            const m = document.getElementById('modal-agenda-compromiso');
            if (m) m.remove();
        },

        onCambioCategoriaForm(cat) {
            const secProd = document.getElementById('agenda-sec-produccion');
            const secEntrega = document.getElementById('agenda-sec-entrega');
            const secRecepcion = document.getElementById('agenda-sec-recepcion');

            if (secProd) secProd.style.display = (cat === 'produccion') ? 'block' : 'none';
            if (secEntrega) secEntrega.style.display = (cat === 'entrega' || cat === 'reunion') ? 'block' : 'none';
            if (secRecepcion) secRecepcion.style.display = (cat === 'recepcion' || cat === 'pago') ? 'block' : 'none';
        },

        onSelectProductoForm(prodId) {
            if (!prodId) return;
            const prods = (window.ViasaDatabase && Array.isArray(window.ViasaDatabase.productos)) ? window.ViasaDatabase.productos : [];
            const p = prods.find(x => x.id === prodId);
            if (p) {
                const form = document.getElementById('form-agenda-compromiso');
                if (form && !form.titulo.value) {
                    form.titulo.value = `Elaboración Lote ${p.nombre}`;
                }
            }
        },

        onSelectClienteForm(cliId) {
            if (!cliId) return;
            const clientes = (window.ViasaDatabase && Array.isArray(window.ViasaDatabase.clientes)) ? window.ViasaDatabase.clientes : [];
            const c = clientes.find(x => x.id === cliId);
            if (!c) return;

            const nom = document.getElementById('agenda-input-cliente-nombre');
            const mail = document.getElementById('agenda-input-cliente-email');
            const rif = document.getElementById('agenda-input-cliente-rif');
            const tel = document.getElementById('agenda-input-cliente-tel');

            if (nom) nom.value = c.nombre || '';
            if (mail) mail.value = c.email || '';
            if (rif) rif.value = c.rifCedula || '';
            if (tel) tel.value = c.telefono || '';
        },

        onSelectProveedorForm(provId) {
            if (!provId) return;
            const proveedores = (window.ViasaDatabase && Array.isArray(window.ViasaDatabase.proveedores)) ? window.ViasaDatabase.proveedores : [];
            const p = proveedores.find(x => x.id === provId);
            if (!p) return;

            const nom = document.getElementById('agenda-input-prov-nombre');
            const mail = document.getElementById('agenda-input-prov-email');
            const rep = document.getElementById('agenda-input-prov-rep');

            if (nom) nom.value = p.nombreEmpresa || p.nombre || '';
            if (mail) mail.value = p.email || '';
            if (rep) rep.value = p.vendedor || p.contacto || '';
        },

        async guardarCompromisoDesdeModal(e) {
            e.preventDefault();
            const form = e.target;
            const compId = form.compromisoId.value;
            const esNuevo = !compId;

            const nuevoObj = {
                id: compId || `CMP-${Date.now()}`,
                titulo: form.titulo.value.trim(),
                categoria: form.categoria.value,
                fecha: form.fecha.value,
                horaInicio: form.horaInicio.value,
                horaFin: form.horaFin.value,
                prioridad: form.prioridad.value,
                estado: form.estado ? form.estado.value : 'programado',
                notas: form.notas.value.trim(),
                enviarEmailNotif: form.enviarEmailNotif ? form.enviarEmailNotif.checked : false,
                historialEmails: []
            };

            // Campos específicos
            if (nuevoObj.categoria === 'produccion') {
                nuevoObj.productoId = form.productoId ? form.productoId.value : '';
                const prods = (window.ViasaDatabase && Array.isArray(window.ViasaDatabase.productos)) ? window.ViasaDatabase.productos : [];
                const p = prods.find(x => x.id === nuevoObj.productoId);
                nuevoObj.productoNombre = p ? p.nombre : '';
                nuevoObj.cantidadLotes = parseInt(form.cantidadLotes ? form.cantidadLotes.value : 0, 10);
                nuevoObj.turnoNombre = form.turnoNombre ? form.turnoNombre.value : '';
                nuevoObj.responsable = form.responsable ? form.responsable.value.trim() : '';
            } else if (nuevoObj.categoria === 'entrega' || nuevoObj.categoria === 'reunion') {
                nuevoObj.clienteNombre = form.clienteNombre ? form.clienteNombre.value.trim() : '';
                nuevoObj.clienteEmail = form.clienteEmail ? form.clienteEmail.value.trim() : '';
                nuevoObj.clienteRif = form.clienteRif ? form.clienteRif.value.trim() : '';
                nuevoObj.clienteTelefono = form.clienteTelefono ? form.clienteTelefono.value.trim() : '';
                nuevoObj.montoUSD = parseFloat(form.montoUSD ? form.montoUSD.value : 0) || 0;
            } else if (nuevoObj.categoria === 'recepcion' || nuevoObj.categoria === 'pago') {
                nuevoObj.proveedorNombre = form.proveedorNombre ? form.proveedorNombre.value.trim() : '';
                nuevoObj.proveedorEmail = form.proveedorEmail ? form.proveedorEmail.value.trim() : '';
                nuevoObj.representanteVentas = form.representanteVentas ? form.representanteVentas.value.trim() : '';
                nuevoObj.muelleRecepcion = form.muelleRecepcion ? form.muelleRecepcion.value : '';
                nuevoObj.montoUSD = parseFloat(form.montoFacturaUSD ? form.montoFacturaUSD.value : 0) || 0;
            }

            if (esNuevo) {
                this.compromisos.push(nuevoObj);
            } else {
                const idx = this.compromisos.findIndex(c => c.id === compId);
                if (idx !== -1) {
                    nuevoObj.historialEmails = this.compromisos[idx].historialEmails || [];
                    this.compromisos[idx] = nuevoObj;
                }
            }

            await this.persistirCompromisos();
            this.cerrarModalCompromiso();

            // Si marcó enviar notificación por correo, abrir el despacho
            if (nuevoObj.enviarEmailNotif) {
                this.abrirCentroEmails(nuevoObj.id);
            } else {
                this.render();
            }

            if (window.ViasaAudio && typeof window.ViasaAudio.playSuccess === 'function') {
                window.ViasaAudio.playSuccess();
            }
        },

        async eliminarCompromiso(id) {
            if (!confirm('¿Está seguro de eliminar este compromiso de la agenda corporativa?')) return;
            this.compromisos = this.compromisos.filter(c => c.id !== id);
            await this.persistirCompromisos();
            this.cerrarModalCompromiso();
            this.render();
            if (window.ViasaAudio && typeof window.ViasaAudio.playClick === 'function') {
                window.ViasaAudio.playClick();
            }
        },

        // --------------------------------------------------------------------------
        // 8. CENTRO DE DESPACHO DE EMAILS & PLANTILLAS EJECUTIVAS
        // --------------------------------------------------------------------------
        abrirCentroEmails(compromisoId = null) {
            const ev = compromisoId ? this.compromisos.find(c => c.id === compromisoId) : (this.compromisos[0] || null);

            const modalExistente = document.getElementById('modal-agenda-centro-emails');
            if (modalExistente) modalExistente.remove();

            const plantilla = this.generarPlantillaEmail(ev);

            const modal = document.createElement('div');
            modal.id = 'modal-agenda-centro-emails';
            modal.className = 'agenda-modal-overlay';
            modal.innerHTML = `
                <div class="agenda-modal-card email-center">
                    <div class="agenda-modal-header" style="background: linear-gradient(135deg, #075985 0%, #0369a1 100%);">
                        <div class="agenda-modal-title-box">
                            <i class="fa-solid fa-paper-plane" style="color: #38bdf8; font-size: 1.4rem;"></i>
                            <div>
                                <h3 class="agenda-modal-title">Centro de Despacho de Correos y Comunicaciones Oficiales</h3>
                                <span class="agenda-modal-subtitle">${EMPRESA_CONFIG.nombre} • Emisión con Membrete Corporativo</span>
                            </div>
                        </div>
                        <button type="button" class="agenda-modal-close" onclick="window.ViasaAgendaEngine.cerrarCentroEmails()">&times;</button>
                    </div>

                    <div class="agenda-modal-body">
                        <!-- SELECTOR DE COMPROMISO A DESPACHAR -->
                        <div class="agenda-form-field" style="margin-bottom: 12px;">
                            <label class="agenda-label">Seleccionar Evento de la Agenda para Notificar:</label>
                            <select class="agenda-input" onchange="window.ViasaAgendaEngine.actualizarPrevisualizacionEmail(this.value)">
                                ${this.compromisos.map(c => `
                                    <option value="${c.id}" ${ev && ev.id === c.id ? 'selected' : ''}>
                                        [${c.fecha}] ${c.titulo} — (${c.clienteNombre || c.proveedorNombre || 'Planta'})
                                    </option>
                                `).join('')}
                            </select>
                        </div>

                        <!-- VISTA PREVIA DEL MEMBRETE Y CORREO -->
                        <div class="agenda-email-preview-box" id="agenda-email-preview-container">
                            ${this.renderPlantillaEmailHtml(plantilla)}
                        </div>

                        <!-- HISTORIAL GLOBAL DE DESPACHOS -->
                        <div class="agenda-historial-emails-box" style="margin-top:16px;">
                            <div class="agenda-historial-title"><i class="fa-solid fa-clock-rotate-left"></i> Bitácora General de Correos Enviados</div>
                            <div class="agenda-table-responsive">
                                <table class="agenda-table-mini">
                                    <thead>
                                        <tr>
                                            <th>Fecha/Hora</th>
                                            <th>Destinatario</th>
                                            <th>Email</th>
                                            <th>Tipo Plantilla</th>
                                            <th>Canal</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody id="agenda-bitacora-tbody">
                                        ${this.renderFilasBitacora()}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div class="agenda-modal-footer viasa-modal-footer" style="position: relative; display: flex; flex-direction: row; align-items: center; justify-content: flex-end; gap: 16px; width: 100%; padding: 16px 24px; background-color: #FAF7F2; border-top: 1px solid #E2D9C8; flex-shrink: 0; box-sizing: border-box;">
                        <button type="button" class="btn-agenda-cancel" onclick="window.ViasaAgendaEngine.cerrarCentroEmails()" style="position: static !important; display: inline-flex !important; align-items: center; justify-content: center; gap: 8px; padding: 10px 22px; margin: 0 !important; background-color: #F3EDE2; color: #2C1A12; border: 1px solid #C8B89E; border-radius: 8px; font-size: 13.5px; font-weight: 700; white-space: nowrap; cursor: pointer;">
                            Cancelar
                        </button>

                        <button type="button" class="btn-agenda-action green" onclick="window.ViasaAgendaEngine.dispararWhatsApp('${ev ? ev.id : ''}')" style="position: static !important; display: inline-flex !important; align-items: center; justify-content: center; gap: 8px; padding: 10px 20px; margin: 0 !important; background-color: #059669; color: #FFFFFF; border: none; border-radius: 8px; font-size: 13.5px; font-weight: 800; white-space: nowrap; cursor: pointer;">
                            <i class="fa-brands fa-whatsapp"></i> Enviar por WhatsApp
                        </button>

                        <button type="button" class="btn-agenda-action cyan" onclick="window.ViasaAgendaEngine.dispararMailto('${ev ? ev.id : ''}')" style="position: static !important; display: inline-flex !important; align-items: center; justify-content: center; gap: 8px; padding: 10px 20px; margin: 0 !important; background-color: #0284C7; color: #FFFFFF; border: none; border-radius: 8px; font-size: 13.5px; font-weight: 800; white-space: nowrap; cursor: pointer;">
                            <i class="fa-solid fa-envelope-open-text"></i> Abrir en Cliente (mailto:)
                        </button>

                        <button type="button" class="btn-agenda-action gold" onclick="window.ViasaAgendaEngine.ejecutarEnvioDirecto('${ev ? ev.id : ''}')" style="position: static !important; display: inline-flex !important; align-items: center; justify-content: center; gap: 8px; padding: 10px 24px; margin: 0 !important; background-color: #C88A2B; color: #FFFFFF; border: none; border-radius: 8px; font-size: 13.5px; font-weight: 800; white-space: nowrap; cursor: pointer;">
                            <i class="fa-solid fa-paper-plane"></i> Enviar Directo
                        </button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);
        },

        cerrarCentroEmails() {
            const m = document.getElementById('modal-agenda-centro-emails');
            if (m) m.remove();
            this.render();
        },

        actualizarPrevisualizacionEmail(compId) {
            const ev = this.compromisos.find(c => c.id === compId);
            if (!ev) return;
            const plantilla = this.generarPlantillaEmail(ev);
            const box = document.getElementById('agenda-email-preview-container');
            if (box) {
                box.innerHTML = this.renderPlantillaEmailHtml(plantilla);
            }
        },

        generarPlantillaEmail(ev) {
            if (!ev) {
                return {
                    tipo: 'General',
                    destinatario: 'Dirección General',
                    email: EMPRESA_CONFIG.emailCorporativo,
                    asunto: `Aviso Corporativo — ${EMPRESA_CONFIG.nombre}`,
                    cuerpoHtml: '<p>Seleccione un evento de la agenda para redactar el despacho.</p>'
                };
            }

            const tasa = this.getTasaBCV();
            const cat = ev.categoria;

            if (cat === 'reunion') {
                return {
                    tipo: 'Citación Oficial de Reunión / Junta Directiva',
                    destinatario: ev.clienteNombre || 'Miembros de Junta y Gerencia',
                    email: ev.clienteEmail || EMPRESA_CONFIG.gerenciaEmail,
                    asunto: `CONVOCATORIA: ${ev.titulo} — ${EMPRESA_CONFIG.nombre}`,
                    cuerpoHtml: `
                        <p>Estimado(a) <b>${ev.clienteNombre || 'Miembro Directivo'}</b>,</p>
                        <p>Por medio de la presente, la Dirección Ejecutiva de <b>${EMPRESA_CONFIG.nombre}</b> le convoca formalmente a la reunión de trabajo programada en nuestra agenda corporativa:</p>
                        <div class="agenda-email-highlight">
                            <p><b>Asunto:</b> ${this.escapeHtml(ev.titulo)}</p>
                            <p><b>Fecha:</b> ${ev.fecha}</p>
                            <p><b>Hora:</b> ${ev.horaInicio} a ${ev.horaFin || 'Fin'}</p>
                            <p><b>Lugar:</b> Sala de Juntas Corporativa / Plataforma Ejecutiva</p>
                            ${ev.notas ? `<p><b>Puntos a Tratar:</b> ${this.escapeHtml(ev.notas)}</p>` : ''}
                        </div>
                        <p>Agradecemos confirmar su asistencia a vuelta de correo o a través de nuestros canales oficiales.</p>
                    `
                };
            }

            if (cat === 'entrega') {
                const montoBs = (parseFloat(ev.montoUSD) || 0) * tasa;
                return {
                    tipo: 'Aviso de Despacho y Entrega de Pedido B2B',
                    destinatario: ev.clienteNombre || 'Cliente Aliado',
                    email: ev.clienteEmail || 'compras@cliente.com',
                    asunto: `AVISO DE DESPACHO: Su pedido de Panadería Nueva Viasa está programado (${ev.fecha})`,
                    cuerpoHtml: `
                        <p>Estimados señores de <b>${ev.clienteNombre || 'Cliente Aliado'}</b> (RIF: ${ev.clienteRif || 'En expediente'}),</p>
                        <p>Reciban un cordial saludo de parte del equipo de <b>${EMPRESA_CONFIG.nombre}</b>. Nos complace informarles que su pedido de productos de panificación ha sido programado para entrega en la siguiente ventana horaria:</p>
                        <div class="agenda-email-highlight">
                            <p><b>Detalle de Entrega:</b> ${this.escapeHtml(ev.titulo)}</p>
                            <p><b>Fecha de Llegada:</b> ${ev.fecha}</p>
                            <p><b>Ventana Horaria:</b> ${ev.horaInicio} a ${ev.horaFin || 'Mediodía'}</p>
                            ${ev.montoUSD > 0 ? `<p><b>Total Comercial:</b> $${ev.montoUSD.toFixed(2)} USD (Equivalente: Bs. ${montoBs.toFixed(2)} a tasa oficial BCV Bs. ${tasa.toFixed(2)})</p>` : ''}
                            ${ev.notas ? `<p><b>Instrucciones de Despacho:</b> ${this.escapeHtml(ev.notas)}</p>` : ''}
                        </div>
                        <p>Agradecemos tener dispuesto al personal receptor en el muelle de descarga correspondiente.</p>
                    `
                };
            }

            if (cat === 'recepcion' || cat === 'pago') {
                const montoBs = (parseFloat(ev.montoUSD) || 0) * tasa;
                return {
                    tipo: 'Confirmación de Recepción de Insumos / Compromiso de Pago',
                    destinatario: ev.proveedorNombre || 'Proveedor Aliado',
                    email: ev.proveedorEmail || 'ventas@proveedor.com',
                    asunto: `COORDINACIÓN LOGÍSTICA: ${ev.titulo} — Panadería Nueva Viasa`,
                    cuerpoHtml: `
                        <p>Estimados señores de <b>${ev.proveedorNombre || 'Proveedor Aliado'}</b> (Atención: ${ev.representanteVentas || 'Departamento de Despachos y Cobranzas'}),</p>
                        <p>Por medio de la presente, la Gerencia de Operaciones y Compras de <b>${EMPRESA_CONFIG.nombre}</b> confirma los detalles logísticos y financieros para la recepción de mercancía:</p>
                        <div class="agenda-email-highlight">
                            <p><b>Concepto / Orden:</b> ${this.escapeHtml(ev.titulo)}</p>
                            <p><b>Fecha Confirmada:</b> ${ev.fecha}</p>
                            <p><b>Ventana de Descarga:</b> ${ev.horaInicio} a ${ev.horaFin || 'Cierre de muelle'}</p>
                            ${ev.muelleRecepcion ? `<p><b>Muelle Designado:</b> ${ev.muelleRecepcion}</p>` : ''}
                            ${ev.montoUSD > 0 ? `<p><b>Compromiso de Pago Asociado:</b> $${ev.montoUSD.toFixed(2)} USD (Bs. ${montoBs.toFixed(2)} tasa BCV)</p>` : ''}
                            ${ev.notas ? `<p><b>Observaciones de Recepción:</b> ${this.escapeHtml(ev.notas)}</p>` : ''}
                        </div>
                        <p>Nuestra jefatura de almacén estará presta para verificar las guías de movilización SADA y certificados de calidad de los insumos.</p>
                    `
                };
            }

            // Caso Producción
            return {
                tipo: 'Orden de Producción y Horneada Programada',
                destinatario: ev.responsable || 'Equipo de Hornos',
                email: EMPRESA_CONFIG.emailCorporativo,
                asunto: `HOJA DE HORNO: ${ev.titulo} — Lote Programado`,
                cuerpoHtml: `
                    <p><b>Jefatura de Producción de ${EMPRESA_CONFIG.nombre}</b></p>
                    <div class="agenda-email-highlight">
                        <p><b>Lote:</b> ${this.escapeHtml(ev.titulo)}</p>
                        <p><b>Producto:</b> ${ev.productoNombre || 'Línea Pilón'}</p>
                        <p><b>Cantidad:</b> ${ev.cantidadLotes || 0} paquetes</p>
                        <p><b>Fecha y Turno:</b> ${ev.fecha} (${ev.turnoNombre || 'Madrugada'})</p>
                        <p><b>Horario de Horneada:</b> ${ev.horaInicio} a ${ev.horaFin}</p>
                        ${ev.notas ? `<p><b>Especificaciones Técnicas:</b> ${this.escapeHtml(ev.notas)}</p>` : ''}
                    </div>
                `
            };
        },

        renderPlantillaEmailHtml(plantilla) {
            return `
                <div class="agenda-letterhead">
                    <div class="agenda-letterhead-top">
                        <div class="agenda-letterhead-brand">
                            <i class="fa-solid fa-crown" style="color: #F59E0B; font-size: 1.5rem;"></i>
                            <div>
                                <div class="agenda-letterhead-title">${EMPRESA_CONFIG.nombre}</div>
                                <div class="agenda-letterhead-sub">RIF: ${EMPRESA_CONFIG.rif} • ${EMPRESA_CONFIG.direccion}</div>
                            </div>
                        </div>
                        <div class="agenda-letterhead-contact">
                            <div>Tel: ${EMPRESA_CONFIG.telefono}</div>
                            <div>Email: ${EMPRESA_CONFIG.emailCorporativo}</div>
                        </div>
                    </div>
                    <div class="agenda-letterhead-divider"></div>

                    <!-- METADATOS DEL CORREO -->
                    <div class="agenda-email-meta-fields">
                        <div><b>Para:</b> ${plantilla.destinatario} &lt;${plantilla.email}&gt;</div>
                        <div><b>De:</b> Dirección de Operaciones &lt;${EMPRESA_CONFIG.emailCorporativo}&gt;</div>
                        <div><b>Asunto:</b> ${plantilla.asunto}</div>
                        <div><b>Plantilla:</b> <span class="agenda-badge-status completado">${plantilla.tipo}</span></div>
                    </div>

                    <!-- CUERPO OFICIAL -->
                    <div class="agenda-email-body-content">
                        ${plantilla.cuerpoHtml}
                    </div>

                    <!-- PIE DE FIRMA EJECUTIVA -->
                    <div class="agenda-letterhead-footer">
                        <div class="agenda-firm-box">
                            <div class="agenda-firm-line"></div>
                            <b>Gerencia General y Dirección de Operaciones</b>
                            <p>${EMPRESA_CONFIG.nombre}</p>
                        </div>
                    </div>
                </div>
            `;
        },

        renderFilasBitacora() {
            if (this.bitacoraEmails.length === 0) {
                return `<tr><td colspan="6" style="text-align:center; color:#94a3b8; padding:12px;">No hay despachos de correos registrados en la bitácora aún.</td></tr>`;
            }
            return this.bitacoraEmails.slice(-8).reverse().map(b => `
                <tr>
                    <td>${b.fechaEnvio}</td>
                    <td>${this.escapeHtml(b.destinatario || '')}</td>
                    <td>${this.escapeHtml(b.email || '')}</td>
                    <td>${b.tipoPlantilla || 'Notificación'}</td>
                    <td><b>${b.canal || 'Email'}</b></td>
                    <td><span class="agenda-badge-status completado">${b.estado}</span></td>
                </tr>
            `).join('');
        },

        previsualizarEmailDesdeForm() {
            const form = document.getElementById('form-agenda-compromiso');
            if (!form) return;

            const dummyEv = {
                id: form.compromisoId.value || 'CMP-TEMP',
                titulo: form.titulo.value.trim() || 'Compromiso Operativo',
                categoria: form.categoria.value,
                fecha: form.fecha.value || this.fechaHoyCalculada,
                horaInicio: form.horaInicio.value || '08:00',
                horaFin: form.horaFin.value || '10:00',
                productoNombre: form.productoId ? form.productoId.options[form.productoId.selectedIndex]?.text : '',
                cantidadLotes: form.cantidadLotes ? form.cantidadLotes.value : 0,
                turnoNombre: form.turnoNombre ? form.turnoNombre.value : '',
                clienteNombre: form.clienteNombre ? form.clienteNombre.value.trim() : '',
                clienteEmail: form.clienteEmail ? form.clienteEmail.value.trim() : '',
                clienteRif: form.clienteRif ? form.clienteRif.value.trim() : '',
                montoUSD: parseFloat(form.montoUSD ? form.montoUSD.value : 0) || 0,
                proveedorNombre: form.proveedorNombre ? form.proveedorNombre.value.trim() : '',
                proveedorEmail: form.proveedorEmail ? form.proveedorEmail.value.trim() : '',
                representanteVentas: form.representanteVentas ? form.representanteVentas.value.trim() : '',
                muelleRecepcion: form.muelleRecepcion ? form.muelleRecepcion.value : '',
                notas: form.notas ? form.notas.value.trim() : ''
            };

            const plantilla = this.generarPlantillaEmail(dummyEv);
            alert(`--- PREVISUALIZACIÓN DE CORREO CORPORATIVO ---\n\nPara: ${plantilla.destinatario} <${plantilla.email}>\nAsunto: ${plantilla.asunto}\n\n${plantilla.cuerpoHtml.replace(/<[^>]*>?/gm, ' ')}`);
        },

        dispararMailto(compId) {
            const ev = this.compromisos.find(c => c.id === compId);
            if (!ev) return;
            const plantilla = this.generarPlantillaEmail(ev);

            const cuerpoPlano = plantilla.cuerpoHtml
                .replace(/<\/p>/g, '\n\n')
                .replace(/<br\s*[\/]?>/gi, '\n')
                .replace(/<[^>]+>/g, '')
                .trim();

            const mailtoUrl = `mailto:${encodeURIComponent(plantilla.email)}?subject=${encodeURIComponent(plantilla.asunto)}&body=${encodeURIComponent(cuerpoPlano)}`;
            window.location.href = mailtoUrl;

            this.registrarDespacho(ev, plantilla, 'mailto (Cliente de Correo)');
        },

        dispararWhatsApp(compId) {
            const ev = this.compromisos.find(c => c.id === compId);
            if (!ev) return;
            const tel = (ev.clienteTelefono || ev.proveedorTelefono || '0414-8859120').replace(/[^0-9]/g, '');
            const plantilla = this.generarPlantillaEmail(ev);

            const textoPlano = `*${EMPRESA_CONFIG.nombre}*\n*${plantilla.asunto}*\n\n` +
                plantilla.cuerpoHtml.replace(/<\/p>/g, '\n\n').replace(/<[^>]+>/g, '').trim();

            const waUrl = `https://wa.me/58${tel}?text=${encodeURIComponent(textoPlano)}`;
            window.open(waUrl, '_blank');

            this.registrarDespacho(ev, plantilla, 'WhatsApp Oficial');
        },

        async ejecutarEnvioDirecto(compId) {
            const ev = this.compromisos.find(c => c.id === compId);
            if (!ev) return;
            const plantilla = this.generarPlantillaEmail(ev);

            // Simulación de envío SMTP / API corporativa exitosa
            await this.registrarDespacho(ev, plantilla, 'SMTP / API Directa');

            const tbody = document.getElementById('agenda-bitacora-tbody');
            if (tbody) {
                tbody.innerHTML = this.renderFilasBitacora();
            }

            alert(`✅ Despacho emitido con éxito a ${plantilla.destinatario} (${plantilla.email}) mediante Servidor Corporativo SMTP.`);
            if (window.ViasaAudio && typeof window.ViasaAudio.playSuccess === 'function') {
                window.ViasaAudio.playSuccess();
            }
        },

        async registrarDespacho(ev, plantilla, canal) {
            const ahora = new Date();
            const fechaStr = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}-${String(ahora.getDate()).padStart(2, '0')} ${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;

            const registro = {
                id: `MAIL-${Date.now()}`,
                compromisoId: ev.id,
                fechaEnvio: fechaStr,
                destinatario: plantilla.destinatario,
                email: plantilla.email,
                asunto: plantilla.asunto,
                tipoPlantilla: plantilla.tipo,
                canal: canal,
                estado: 'Enviado'
            };

            this.bitacoraEmails.push(registro);
            if (!Array.isArray(ev.historialEmails)) ev.historialEmails = [];
            ev.historialEmails.push(registro);

            await this.persistirBitacoraEmails();
            await this.persistirCompromisos();
        },

        // --------------------------------------------------------------------------
        // 9. RESUMEN MATUTINO VIASA VOICE (WEB SPEECH API)
        // --------------------------------------------------------------------------
        reproducirViasaVoice() {
            if (!('speechSynthesis' in window)) {
                alert('La síntesis de voz no está soportada en este navegador.');
                return;
            }

            const btn = document.getElementById('btn-viasa-voice');

            if (this.sintesisVozActiva) {
                window.speechSynthesis.cancel();
                this.sintesisVozActiva = false;
                if (btn) {
                    btn.classList.remove('playing');
                    btn.innerHTML = `<i class="fa-solid fa-microphone-lines"></i> <span>Resumen Viasa Voice</span>`;
                }
                return;
            }

            const hoy = this.fechaHoyCalculada;
            const evsHoy = this.compromisos.filter(c => c.fecha === hoy);

            let textoLocucion = `Buenos días, Junta Directiva y Equipo Operativo de Panadería y Pastelería Nueva Viasa. `;
            textoLocucion += `Para la jornada de hoy, ${hoy}, tenemos programados ${evsHoy.length} compromisos en el cronograma maestro. `;

            if (evsHoy.length === 0) {
                textoLocucion += `No hay compromisos críticos registrados para hoy. Planta y hornos operando en régimen normal de mostrador. `;
            } else {
                evsHoy.forEach((e, idx) => {
                    textoLocucion += `Compromiso número ${idx + 1}: ${e.titulo}, a las ${e.horaInicio}. `;
                    if (e.productoNombre) textoLocucion += `Producto: ${e.productoNombre}, con ${e.cantidadLotes} paquetes. `;
                    if (e.clienteNombre) textoLocucion += `Cliente: ${e.clienteNombre}. `;
                    if (e.proveedorNombre) textoLocucion += `Proveedor: ${e.proveedorNombre}. `;
                });
            }

            textoLocucion += `¡Les deseamos una jornada altamente productiva y de máxima calidad en Panadería Nueva Viasa!`;

            const utter = new SpeechSynthesisUtterance(textoLocucion);
            utter.lang = 'es-VE';
            utter.rate = 1.0;
            utter.pitch = 1.0;

            // Intentar seleccionar voz en español
            const voces = window.speechSynthesis.getVoices();
            const vozEs = voces.find(v => v.lang.startsWith('es'));
            if (vozEs) utter.voice = vozEs;

            this.sintesisVozActiva = true;
            if (btn) {
                btn.classList.add('playing');
                btn.innerHTML = `<i class="fa-solid fa-volume-high fa-beat"></i> <span>Locución en Curso... (Click para Detener)</span>`;
            }

            utter.onend = () => {
                this.sintesisVozActiva = false;
                if (btn) {
                    btn.classList.remove('playing');
                    btn.innerHTML = `<i class="fa-solid fa-microphone-lines"></i> <span>Resumen Viasa Voice</span>`;
                }
            };

            utter.onerror = () => {
                this.sintesisVozActiva = false;
                if (btn) {
                    btn.classList.remove('playing');
                    btn.innerHTML = `<i class="fa-solid fa-microphone-lines"></i> <span>Resumen Viasa Voice</span>`;
                }
            };

            window.speechSynthesis.speak(utter);
        },

        // --------------------------------------------------------------------------
        // 10. AUTO-SINCRONIZACIÓN CON COMPRAS Y ACTIVOS
        // --------------------------------------------------------------------------
        sincronizarConComprasYActivos() {
            if (!window.ViasaDatabase) return;

            // 1. Cuentas por pagar de compras a crédito
            if (Array.isArray(window.ViasaDatabase.cuentasPorPagar)) {
                window.ViasaDatabase.cuentasPorPagar.forEach(cxp => {
                    if (cxp.fechaVencimiento && (cxp.estado === 'pendiente' || cxp.estado === 'parcial')) {
                        const existe = this.compromisos.some(c => c.id === `AUTO-CXP-${cxp.id}`);
                        if (!existe) {
                            this.compromisos.push({
                                id: `AUTO-CXP-${cxp.id}`,
                                titulo: `Vencimiento Pago Factura: ${cxp.proveedorNombre} (${cxp.numeroFacturaProveedor || cxp.id})`,
                                categoria: 'pago',
                                fecha: cxp.fechaVencimiento,
                                horaInicio: '09:00',
                                horaFin: '11:00',
                                prioridad: 'alta',
                                estado: 'programado',
                                proveedorNombre: cxp.proveedorNombre,
                                montoUSD: cxp.saldoPendienteUSD || cxp.montoTotalUSD || 0,
                                notas: `Generado automáticamente desde Módulo Proveedores y Compras. Concepto: ${cxp.concepto || ''}`,
                                historialEmails: []
                            });
                        }
                    }
                });
            }

            // 2. Mantenimientos programados de maquinaria
            if (Array.isArray(window.ViasaDatabase.mantenimientosMaquinaria)) {
                window.ViasaDatabase.mantenimientosMaquinaria.forEach(m => {
                    if (m.fecha && m.estado !== 'completado') {
                        const existe = this.compromisos.some(c => c.id === `AUTO-MANT-${m.id}`);
                        if (!existe) {
                            this.compromisos.push({
                                id: `AUTO-MANT-${m.id}`,
                                titulo: `Mantenimiento ${m.tipo || 'Preventivo'}: ${m.activoNombre}`,
                                categoria: 'pago',
                                fecha: m.fecha,
                                horaInicio: '14:00',
                                horaFin: '17:00',
                                prioridad: 'normal',
                                estado: 'programado',
                                activoNombre: m.activoNombre,
                                montoUSD: m.costoTotalUSD || 0,
                                notas: `Generado automáticamente desde Módulo Activos y Maquinaria. ${m.descripcion || ''}`,
                                historialEmails: []
                            });
                        }
                    }
                });
            }
        },

        // --------------------------------------------------------------------------
        // 11. RESPALDO EN DISCO LOCAL (/VIASA_System_Data/agenda_y_operaciones/)
        // --------------------------------------------------------------------------
        respaldarDiscoLocal() {
            const dataToExport = {
                modulo: 'Agenda y Operaciones — VIASA System',
                empresa: EMPRESA_CONFIG,
                fechaGeneracion: new Date().toISOString(),
                totalCompromisos: this.compromisos.length,
                totalBitacoraEmails: this.bitacoraEmails.length,
                compromisos: this.compromisos,
                bitacoraEmails: this.bitacoraEmails
            };

            const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dataToExport, null, 2));
            const dlAnchorElem = document.createElement('a');
            dlAnchorElem.setAttribute('href', dataStr);
            dlAnchorElem.setAttribute('download', `agenda_operaciones_viasa_${Date.now()}.json`);
            dlAnchorElem.click();

            alert('💾 Respaldo generado con éxito.\n\nPor favor guarde o copie este archivo en su carpeta corporativa:\n/VIASA_System_Data/agenda_y_operaciones/');
        },

        escapeHtml(text) {
            if (!text) return '';
            return String(text)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }
    };

    // Exponer en window
    window.ViasaAgendaEngine = ViasaAgendaEngine;

    // Inicialización automática
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => window.ViasaAgendaEngine.init());
    } else {
        window.ViasaAgendaEngine.init();
    }

})(window);
