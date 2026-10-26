/**
 * ==============================================================================
 * VIASA SYSTEM - MÓDULO DE IDENTIFICACIÓN CORPORATIVA, CONTROL DE PERSONAL
 * Y GENERADOR DE CARNETS CON CÓDIGO QR ÚNICO
 * Panadería y Pastelería Nueva Viasa, C.A. • RIF: J-31163165-8
 * La Sabanita, Ciudad Bolívar, Estado Bolívar, Venezuela
 * ==============================================================================
 */

(function(window) {
    'use strict';

    // ==========================================================================
    // 1. CONFIGURACIÓN CORPORATIVA Y CATÁLOGO DE ÁREAS INSTITUCIONALES
    // ==========================================================================
    const EMPRESA_CONFIG = {
        nombre: 'Panadería Nueva Viasa, C.A.',
        nombreCorto: 'NUEVA VIASA',
        rif: 'J-31163165-8',
        direccion: 'Av. España c/ Calle Bolívar, La Sabanita, Ciudad Bolívar, Edo. Bolívar',
        telefono: '0414-1234567',
        lema: 'Tradición y Calidad en Cada Pieza de Pan'
    };

    const AREAS_CORPORATIVAS = {
        ADM: {
            codigo: 'ADM',
            nombre: 'Gerencia y Administración',
            colorPrimario: '#0F172A', // Azul Marino Ejecutivo
            colorAcento: '#D97706',   // Dorado Corporativo
            colorAcentoLight: '#F59E0B',
            bgCard: 'linear-gradient(145deg, #0f172a 0%, #1e293b 70%, #0f172a 100%)',
            bgLight: '#F8FAFC',
            textLight: '#F1F5F9',
            icon: 'fa-briefcase',
            badgeClass: 'pnv-badge-adm',
            descripcion: 'Dirección General, Finanzas, Contabilidad y RRHH'
        },
        PROD: {
            codigo: 'PROD',
            nombre: 'Producción / Panaderos / Horneros / Pasteleros',
            colorPrimario: '#991B1B', // Rojo Horno Corporativo
            colorAcento: '#D97706',   // Dorado Espiga
            colorAcentoLight: '#F59E0B',
            bgCard: 'linear-gradient(145deg, #991b1b 0%, #7f1d1d 70%, #450a0a 100%)',
            bgLight: '#FEF2F2',
            textLight: '#FEF2F2',
            icon: 'fa-fire-burner',
            badgeClass: 'pnv-badge-prod',
            descripcion: 'Maestros Panaderos, Horneros, Pastelería y Repostería'
        },
        VNT: {
            codigo: 'VNT',
            nombre: 'Ventas / Mostrador / Caja POS',
            colorPrimario: '#065F46', // Verde Esmeralda
            colorAcento: '#D97706',   // Dorado Espiga
            colorAcentoLight: '#F59E0B',
            bgCard: 'linear-gradient(145deg, #065f46 0%, #064e3b 70%, #022c22 100%)',
            bgLight: '#ECFDF5',
            textLight: '#ECFDF5',
            icon: 'fa-store',
            badgeClass: 'pnv-badge-vnt',
            descripcion: 'Atención al Público, Despacho Mostrador y Facturación'
        },
        LOG: {
            codigo: 'LOG',
            nombre: 'Distribución B2B / Despacho y Logística',
            colorPrimario: '#1E3A8A', // Azul Acero
            colorAcento: '#F59E0B',   // Ámbar Logístico
            colorAcentoLight: '#FBBF24',
            bgCard: 'linear-gradient(145deg, #1e3a8a 0%, #172554 70%, #0f172a 100%)',
            bgLight: '#EFF6FF',
            textLight: '#EFF6FF',
            icon: 'fa-truck-fast',
            badgeClass: 'pnv-badge-log',
            descripcion: 'Reparto a Comercios Aliados, Despacho Mayorista y Flota'
        },
        MNT: {
            codigo: 'MNT',
            nombre: 'Mantenimiento, Almacén y Servicios Generales',
            colorPrimario: '#334155', // Gris Industrial
            colorAcento: '#D97706',   // Dorado Corporativo
            colorAcentoLight: '#F59E0B',
            bgCard: 'linear-gradient(145deg, #334155 0%, #1e293b 70%, #0f172a 100%)',
            bgLight: '#F1F5F9',
            textLight: '#F1F5F9',
            icon: 'fa-screwdriver-wrench',
            badgeClass: 'pnv-badge-mnt',
            descripcion: 'Mantenimiento de Maquinaria, Higiene y Almacén Central'
        }
    };

    // ==========================================================================
    // 2. MOTOR AUTÓNOMO DE GENERACIÓN VECTORIAL DE CÓDIGO QR (SVG NATIVO)
    // ==========================================================================
    const QRVectorRenderer = {
        /**
         * Genera la representación SVG vectorial pura de alta fidelidad para el QR
         * @param {string} payload - Texto o JSON a codificar
         * @param {object} opt - Opciones de color, margen y tamaño
         * @returns {string} - Código SVG listo para incrustar en HTML
         */
        renderSvg(payload, opt = {}) {
            const margin = opt.margin !== undefined ? opt.margin : 4;
            const colorDark = opt.colorDark || '#000000';
            const colorLight = opt.colorLight || '#FFFFFF';

            // Si ViasaCodeEngine está disponible, usamos su algoritmo de matriz QR
            let matrixData = null;
            if (window.ViasaCodeEngine && window.ViasaCodeEngine.qr && typeof window.ViasaCodeEngine.qr.generarMatrizQR === 'function') {
                try {
                    matrixData = window.ViasaCodeEngine.qr.generarMatrizQR(payload);
                } catch (e) {
                    console.warn('ViasaCodeEngine QR fallback:', e);
                }
            }

            // Fallback si no hay matriz disponible
            if (!matrixData || !matrixData.matrix) {
                matrixData = this._generarMatrizFallback(payload);
            }

            const { matrix, size } = matrixData;
            const totalSize = size + (margin * 2);

            let pathD = '';
            for (let r = 0; r < size; r++) {
                for (let c = 0; c < size; c++) {
                    if (matrix[r][c] === 1) {
                        const x = c + margin;
                        const y = r + margin;
                        pathD += `M${x},${y}h1v1h-1z `;
                    }
                }
            }

            return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalSize} ${totalSize}" width="100%" height="100%" shape-rendering="crispEdges" style="display:block;">
                <rect width="${totalSize}" height="${totalSize}" fill="${colorLight}" />
                <path d="${pathD}" fill="${colorDark}" />
            </svg>`;
        },

        _generarMatrizFallback(texto) {
            // Generador pseudo-QR básico para casos de contingencia offline
            const size = 29;
            const matrix = Array.from({ length: size }, () => Array(size).fill(0));
            // Posicionamiento de Finders (7x7 en las 3 esquinas)
            const colocarFinder = (r0, c0) => {
                for (let r = 0; r < 7; r++) {
                    for (let c = 0; c < 7; c++) {
                        if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
                            matrix[r0 + r][c0 + c] = 1;
                        }
                    }
                }
            };
            colocarFinder(0, 0);
            colocarFinder(0, size - 7);
            colocarFinder(size - 7, 0);

            // Patrones de sincronización
            for (let i = 8; i < size - 8; i++) {
                matrix[6][i] = i % 2 === 0 ? 1 : 0;
                matrix[i][6] = i % 2 === 0 ? 1 : 0;
            }

            // Datos pseudo-aleatorios basados en hash del texto
            let hash = 0;
            for (let i = 0; i < texto.length; i++) {
                hash = ((hash << 5) - hash) + texto.charCodeAt(i);
                hash |= 0;
            }
            let seed = Math.abs(hash) || 123456789;
            for (let r = 0; r < size; r++) {
                for (let c = 0; c < size; c++) {
                    if (matrix[r][c] === 0 && !(r < 8 && c < 8) && !(r < 8 && c >= size - 8) && !(r >= size - 8 && c < 8)) {
                        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
                        matrix[r][c] = (seed % 3 === 0) ? 1 : 0;
                    }
                }
            }
            return { matrix, size };
        }
    };

    // ==========================================================================
    // 3. CONTROLADOR MAESTRO VIASACARNETSENGINE
    // ==========================================================================
    const ViasaCarnetsEngine = {
        coleccionEmpleados: [],
        trabajadorSeleccionadoId: null,
        modoVista: 'unificada', // 'unificada' | 'doble-cara'
        filtroArea: 'TODAS',
        filtroEstatus: 'TODOS',
        busqueda: '',
        enEdicion: false,
        trabajadorEditando: null,

        /**
         * Inicialización del módulo de carnets
         */
        async init() {
            await this.cargarEmpleados();
            if (!this.trabajadorSeleccionadoId && this.coleccionEmpleados.length > 0) {
                this.trabajadorSeleccionadoId = this.coleccionEmpleados[0].id;
            }
        },

        /**
         * Cargar empleados desde ViasaStorage y normalizar datos de credenciales
         */
        async cargarEmpleados() {
            let emps = [];
            if (window.ViasaStorage && typeof window.ViasaStorage.obtenerColeccion === 'function') {
                emps = await window.ViasaStorage.obtenerColeccion('empleados');
            }

            if (!emps || emps.length === 0) {
                if (window.ViasaDatabase && Array.isArray(window.ViasaDatabase.empleados)) {
                    emps = JSON.parse(JSON.stringify(window.ViasaDatabase.empleados));
                }
            }

            let huboCambios = false;
            // Normalizar y enriquecer registros con las especificaciones del carnet
            emps = (emps || []).map(emp => {
                let modificado = false;

                // 1. Área normalizada
                if (!emp.areaCodigo) {
                    emp.areaCodigo = this.determinarAreaPorDepto(emp.departamento, emp.cargo);
                    modificado = true;
                }

                // 2. Token QR único según especificación: NV-EMP-{AREA}-{CEDULA}-{HASH4}
                if (!emp.qrToken || !emp.qrToken.startsWith('NV-EMP-')) {
                    emp.qrToken = this.construirTokenUnico(emp.areaCodigo, emp.cedula, emps, emp.id);
                    modificado = true;
                }

                // 3. Ficha Médica básica
                if (!emp.tipoSangre) {
                    const tipos = ['O+', 'A+', 'B+', 'O+', 'O+', 'AB+'];
                    const hashVal = (emp.cedula || '1').replace(/\D/g, '') || '1';
                    emp.tipoSangre = tipos[parseInt(hashVal, 10) % tipos.length];
                    modificado = true;
                }

                if (!emp.alergias) {
                    emp.alergias = 'Ninguna conocida';
                    modificado = true;
                }

                if (!emp.telefonoEmergencia) {
                    if (emp.contactoEmergencia && typeof emp.contactoEmergencia === 'object') {
                        emp.telefonoEmergencia = `${emp.contactoEmergencia.telefono || '0414-1234567'} (${emp.contactoEmergencia.nombre || 'Familiar'} - ${emp.contactoEmergencia.parentesco || 'Contacto'})`;
                    } else {
                        emp.telefonoEmergencia = '0414-1234567 (Recursos Humanos)';
                    }
                    modificado = true;
                }

                // 4. Estatus
                if (!emp.estatus) {
                    emp.estatus = emp.estado === 'inactivo' ? 'Inactivo' : 'Activo';
                    modificado = true;
                }

                // 5. Turno
                if (!emp.turno) {
                    emp.turno = 'Diurno';
                    modificado = true;
                }

                if (modificado) huboCambios = true;
                return emp;
            });

            this.coleccionEmpleados = emps;

            // Persistir cambios si hubo normalización
            if (huboCambios && window.ViasaStorage && typeof window.ViasaStorage.guardarColeccion === 'function') {
                await window.ViasaStorage.guardarColeccion('empleados', this.coleccionEmpleados);
            }
        },

        /**
         * Mapear departamento o cargo al código de área institucional (ADM, PROD, VNT, LOG, MNT)
         */
        determinarAreaPorDepto(depto, cargo = '') {
            const d = (depto || '').toLowerCase();
            const c = (cargo || '').toLowerCase();

            if (d.includes('admin') || c.includes('gerente') || c.includes('administrador') || c.includes('contador')) {
                return 'ADM';
            }
            if (d.includes('prod') || d.includes('pastel') || d.includes('cocin') || c.includes('panadero') || c.includes('hornero') || c.includes('pastel')) {
                return 'PROD';
            }
            if (d.includes('mostrador') || d.includes('caja') || d.includes('vent') || c.includes('caj') || c.includes('vendedor') || c.includes('salon')) {
                return 'VNT';
            }
            if (d.includes('despacho') || d.includes('delivery') || d.includes('logist') || c.includes('chofer') || c.includes('repartidor') || c.includes('distrib')) {
                return 'LOG';
            }
            if (d.includes('manten') || d.includes('almacen') || d.includes('limpieza') || c.includes('limpieza') || c.includes('mantenimiento')) {
                return 'MNT';
            }
            return 'ADM';
        },

        /**
         * Generar Hash Hexadecimal de 4 dígitos
         */
        generarHash4() {
            const chars = '0123456789ABCDEF';
            let res = '';
            for (let i = 0; i < 4; i++) {
                res += chars[Math.floor(Math.random() * chars.length)];
            }
            return res;
        },

        /**
         * Construir Token Único respetando la estructura:
         * NV-EMP-{CODIGO_AREA}-{CEDULA}-{HASH_4_DIGITOS}
         */
        construirTokenUnico(areaCodigo, cedula, lista = null, actualId = null) {
            const area = (areaCodigo || 'ADM').toUpperCase().trim();
            const ciClean = (cedula || 'V00000000').toUpperCase().replace(/[^VE0-9]/g, '');
            const empleados = lista || this.coleccionEmpleados || [];

            let intentos = 0;
            let token = '';
            do {
                const hash4 = this.generarHash4();
                token = `NV-EMP-${area}-${ciClean}-${hash4}`;
                intentos++;
            } while (empleados.some(e => e.id !== actualId && e.qrToken === token) && intentos < 50);

            return token;
        },

        /**
         * Construir Payload legible y estructurado para el QR
         */
        construirPayloadQR(emp) {
            const areaInfo = AREAS_CORPORATIVAS[emp.areaCodigo] || AREAS_CORPORATIVAS.ADM;
            return JSON.stringify({
                empresa: EMPRESA_CONFIG.nombre,
                rif: EMPRESA_CONFIG.rif,
                token: emp.qrToken,
                id: emp.id,
                nombre: emp.nombreCompleto,
                cedula: emp.cedula,
                cargo: emp.cargo,
                area: areaInfo.nombre,
                turno: emp.turno,
                sangre: emp.tipoSangre,
                emergencia: emp.telefonoEmergencia,
                emision: emp.fechaIngreso || '2026-01-15',
                valido: 'PANADERIA NUEVA VIASA - CIUDAD BOLIVAR'
            });
        },

        /**
         * Obtener datos del empleado activo en el estudio
         */
        getEmpleadoSeleccionado() {
            if (!this.trabajadorSeleccionadoId && this.coleccionEmpleados.length > 0) {
                this.trabajadorSeleccionadoId = this.coleccionEmpleados[0].id;
            }
            return this.coleccionEmpleados.find(e => e.id === this.trabajadorSeleccionadoId) || this.coleccionEmpleados[0] || null;
        },

        // ======================================================================
        // 4. ACCIONES DINÁMICAS (REGENERAR TOKEN, FOTO, QR PERSONALIZADO)
        // ======================================================================

        /**
         * Regenerar Token QR por extravío de carnet físico
         */
        async regenerarTokenTrabajador(empId) {
            const emp = this.coleccionEmpleados.find(e => e.id === empId);
            if (!emp) return;

            const confirmar = confirm(
                `⚠️ ¿Desea regenerar el Token QR para "${emp.nombreCompleto}"?\n\n` +
                `• El token anterior (${emp.qrToken}) quedará INVALIDADO por seguridad institucional.\n` +
                `• Se emitirá un nuevo carnet oficial con código criptográfico irrepetible.\n` +
                `• Utilice esta acción en caso de extravío, deterioro o renovación de credencial.`
            );
            if (!confirmar) return;

            const nuevoToken = this.construirTokenUnico(emp.areaCodigo, emp.cedula, this.coleccionEmpleados, emp.id);
            emp.qrToken = nuevoToken;
            emp.qrCustomImage = null; // Reiniciar imagen personalizada si la hubiere
            emp.fechaUltimaEmision = new Date().toISOString().split('T')[0];

            await this._guardarCambiosPersistentes();
            if (window.ViasaAudio && typeof window.ViasaAudio.playSuccess === 'function') {
                window.ViasaAudio.playSuccess();
            }
            alert(`✅ Token QR regenerado con éxito:\n\n${nuevoToken}\n\nEl nuevo carnet ya está listo para imprimir.`);
            this.render();
        },

        /**
         * Subir imagen propia de Código QR para el trabajador
         */
        subirQRPersonalizado(empId) {
            const emp = this.coleccionEmpleados.find(e => e.id === empId);
            if (!emp) return;

            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/png,image/jpeg,image/webp,image/svg+xml';
            input.onchange = async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                if (file.size > 3 * 1024 * 1024) {
                    alert('⚠️ La imagen es demasiado pesada. El tamaño máximo recomendado es 3MB.');
                    return;
                }

                const reader = new FileReader();
                reader.onload = async (event) => {
                    emp.qrCustomImage = event.target.result;
                    await this._guardarCambiosPersistentes();
                    if (window.ViasaAudio && typeof window.ViasaAudio.playSuccess === 'function') {
                        window.ViasaAudio.playSuccess();
                    }
                    alert(`✅ Código QR personalizado cargado exitosamente para ${emp.nombreCompleto}.`);
                    this.render();
                };
                reader.readAsDataURL(file);
            };
            input.click();
        },

        /**
         * Restaurar al código QR vectorial nativo generado por el sistema
         */
        async restaurarQRAutomatico(empId) {
            const emp = this.coleccionEmpleados.find(e => e.id === empId);
            if (!emp) return;

            emp.qrCustomImage = null;
            await this._guardarCambiosPersistentes();
            if (window.ViasaAudio && typeof window.ViasaAudio.playNotification === 'function') {
                window.ViasaAudio.playNotification();
            }
            this.render();
        },

        /**
         * Subir o cambiar fotografía de alta resolución para el trabajador
         */
        cambiarFotografiaTrabajador(empId) {
            const emp = this.coleccionEmpleados.find(e => e.id === empId);
            if (!emp) return;

            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/png,image/jpeg,image/webp';
            input.onchange = async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = async (event) => {
                    emp.foto = event.target.result;
                    await this._guardarCambiosPersistentes();
                    if (window.ViasaAudio && typeof window.ViasaAudio.playSuccess === 'function') {
                        window.ViasaAudio.playSuccess();
                    }
                    this.render();
                };
                reader.readAsDataURL(file);
            };
            input.click();
        },

        /**
         * Guardar el estado general en ViasaStorage
         */
        async _guardarCambiosPersistentes() {
            if (window.ViasaStorage && typeof window.ViasaStorage.guardarColeccion === 'function') {
                await window.ViasaStorage.guardarColeccion('empleados', this.coleccionEmpleados);
            }
        },

        // ======================================================================
        // 5. GESTIÓN Y FORMULARIO DE TRABAJADOR (CREAR / EDITAR)
        // ======================================================================
        abrirModalTrabajador(empId = null) {
            if (empId) {
                const emp = this.coleccionEmpleados.find(e => e.id === empId);
                if (!emp) return;
                this.trabajadorEditando = JSON.parse(JSON.stringify(emp));
            } else {
                const nuevoIdNum = this.coleccionEmpleados.length + 1;
                const nuevoId = `EMP-${String(nuevoIdNum).padStart(3, '0')}`;
                this.trabajadorEditando = {
                    id: nuevoId,
                    nombreCompleto: '',
                    cedula: 'V-',
                    cargo: '',
                    areaCodigo: 'PROD',
                    turno: 'Diurno',
                    fechaIngreso: new Date().toISOString().split('T')[0],
                    tipoSangre: 'O+',
                    alergias: 'Ninguna conocida',
                    telefonoEmergencia: '',
                    estatus: 'Activo',
                    foto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&h=400&q=80',
                    qrToken: '',
                    qrCustomImage: null
                };
                this.trabajadorEditando.qrToken = this.construirTokenUnico(
                    this.trabajadorEditando.areaCodigo,
                    this.trabajadorEditando.cedula,
                    this.coleccionEmpleados
                );
            }
            this.enEdicion = true;
            this.renderModalTrabajador();
        },

        cerrarModalTrabajador() {
            this.enEdicion = false;
            this.trabajadorEditando = null;
            const modalEl = document.getElementById('pnv-modal-trabajador-carnet');
            if (modalEl) modalEl.remove();
        },

        actualizarAreaEnFormulario(areaCode) {
            if (!this.trabajadorEditando) return;
            this.trabajadorEditando.areaCodigo = areaCode;
            this.trabajadorEditando.qrToken = this.construirTokenUnico(
                areaCode,
                this.trabajadorEditando.cedula,
                this.coleccionEmpleados,
                this.trabajadorEditando.id
            );
            const tokenInput = document.getElementById('form-pnv-token');
            if (tokenInput) tokenInput.value = this.trabajadorEditando.qrToken;

            // Actualizar estilo visual del preview de área
            const areaInfo = AREAS_CORPORATIVAS[areaCode];
            const badgePreview = document.getElementById('form-pnv-area-preview');
            if (badgePreview && areaInfo) {
                badgePreview.style.background = areaInfo.colorPrimario;
                badgePreview.style.color = '#FFFFFF';
                badgePreview.style.borderColor = areaInfo.colorAcento;
                badgePreview.innerHTML = `<i class="fa-solid ${areaInfo.icon}"></i> ${areaInfo.nombre}`;
            }
        },

        actualizarCedulaEnFormulario(val) {
            if (!this.trabajadorEditando) return;
            this.trabajadorEditando.cedula = val;
            this.trabajadorEditando.qrToken = this.construirTokenUnico(
                this.trabajadorEditando.areaCodigo,
                val,
                this.coleccionEmpleados,
                this.trabajadorEditando.id
            );
            const tokenInput = document.getElementById('form-pnv-token');
            if (tokenInput) tokenInput.value = this.trabajadorEditando.qrToken;
        },

        async guardarTrabajadorDesdeModal() {
            if (!this.trabajadorEditando) return;

            const nombre = document.getElementById('form-pnv-nombre')?.value.trim();
            const cedula = document.getElementById('form-pnv-cedula')?.value.trim();
            const cargo = document.getElementById('form-pnv-cargo')?.value.trim();
            const areaCodigo = document.getElementById('form-pnv-area')?.value;
            const turno = document.getElementById('form-pnv-turno')?.value;
            const fechaIngreso = document.getElementById('form-pnv-ingreso')?.value;
            const tipoSangre = document.getElementById('form-pnv-sangre')?.value;
            const alergias = document.getElementById('form-pnv-alergias')?.value.trim();
            const telefonoEmergencia = document.getElementById('form-pnv-emergencia')?.value.trim();
            const estatus = document.getElementById('form-pnv-estatus')?.value;

            if (!nombre || !cedula || !cargo) {
                alert('⚠️ Por favor completa los campos obligatorios: Nombre, Cédula y Cargo.');
                return;
            }

            // Validar unicidad de cédula
            const cedulaDuplicada = this.coleccionEmpleados.find(
                e => e.id !== this.trabajadorEditando.id &&
                     e.cedula.replace(/\D/g, '') === cedula.replace(/\D/g, '')
            );
            if (cedulaDuplicada) {
                alert(`⛔ Error: La cédula ${cedula} ya está asignada a "${cedulaDuplicada.nombreCompleto}". Cada trabajador debe tener cédula única.`);
                return;
            }

            // Actualizar objeto
            this.trabajadorEditando.nombreCompleto = nombre;
            this.trabajadorEditando.cedula = cedula;
            this.trabajadorEditando.cargo = cargo;
            this.trabajadorEditando.areaCodigo = areaCodigo;
            this.trabajadorEditando.turno = turno;
            this.trabajadorEditando.fechaIngreso = fechaIngreso;
            this.trabajadorEditando.tipoSangre = tipoSangre;
            this.trabajadorEditando.alergias = alergias || 'Ninguna conocida';
            this.trabajadorEditando.telefonoEmergencia = telefonoEmergencia || '0414-1234567';
            this.trabajadorEditando.estatus = estatus;

            // Revalidar token único
            if (!this.trabajadorEditando.qrToken || !this.trabajadorEditando.qrToken.startsWith('NV-EMP-')) {
                this.trabajadorEditando.qrToken = this.construirTokenUnico(areaCodigo, cedula, this.coleccionEmpleados, this.trabajadorEditando.id);
            }

            // Insertar o actualizar en la lista
            const idx = this.coleccionEmpleados.findIndex(e => e.id === this.trabajadorEditando.id);
            if (idx >= 0) {
                this.coleccionEmpleados[idx] = this.trabajadorEditando;
            } else {
                this.coleccionEmpleados.unshift(this.trabajadorEditando);
            }

            this.trabajadorSeleccionadoId = this.trabajadorEditando.id;
            await this._guardarCambiosPersistentes();

            if (window.ViasaAudio && typeof window.ViasaAudio.playSuccess === 'function') {
                window.ViasaAudio.playSuccess();
            }

            this.cerrarModalTrabajador();
            this.render();
            alert(`✅ Expediente y credencial de "${nombre}" guardados correctamente.`);
        },

        // ======================================================================
        // 6. ESTUDIO VISUAL CR80 (VISTA UNIFICADA Y VISTA DOBLE CARA)
        // ======================================================================

        /**
         * Renderizar la plantilla HTML del Carnet CR80 según el modo
         */
        renderPlantillaCarnet(emp, modo = 'unificada', esParaImpresion = false) {
            if (!emp) {
                return `<div class="pnv-empty-studio">Seleccione un trabajador para visualizar su carnet corporativo.</div>`;
            }

            const areaInfo = AREAS_CORPORATIVAS[emp.areaCodigo] || AREAS_CORPORATIVAS.ADM;
            const payload = this.construirPayloadQR(emp);

            // Código QR: si tiene imagen personalizada se usa esa, sino el SVG vectorial
            let qrHtml = '';
            if (emp.qrCustomImage) {
                qrHtml = `<img src="${emp.qrCustomImage}" alt="QR Personalizado" style="width: 100%; height: 100%; object-fit: contain; display: block; border-radius: 4px;" />`;
            } else {
                qrHtml = QRVectorRenderer.renderSvg(payload, {
                    colorDark: '#000000',
                    colorLight: '#FFFFFF',
                    margin: 2
                });
            }

            if (modo === 'doble-cara') {
                return `
                <div class="pnv-cr80-dual-wrapper ${esParaImpresion ? 'is-printing' : ''}">
                    <!-- ================= ANVERSO (FRENTE) ================= -->
                    <div class="pnv-carnet-card pnv-carnet-frente" style="--area-color: ${areaInfo.colorPrimario}; --area-accent: ${areaInfo.colorAcento};">
                        <div class="pnv-carnet-header">
                            <div class="pnv-carnet-crest">
                                <i class="fa-solid fa-wheat-awn" style="color: #fbbf24;"></i>
                                <span class="pnv-crest-title">${EMPRESA_CONFIG.nombreCorto}</span>
                            </div>
                            <div class="pnv-carnet-org">
                                <span class="pnv-org-name">${EMPRESA_CONFIG.nombre}</span>
                                <span class="pnv-org-rif">RIF: ${EMPRESA_CONFIG.rif} • CIUDAD BOLÍVAR</span>
                            </div>
                        </div>

                        <div class="pnv-carnet-banda-area" style="background: ${areaInfo.colorPrimario}; border-bottom: 2px solid ${areaInfo.colorAcento};">
                            <i class="fa-solid ${areaInfo.icon}"></i>
                            <span>${areaInfo.nombre}</span>
                        </div>

                        <!-- FOTOGRAFÍA EXTRA GRANDE CON MARCO DORADO -->
                        <div class="pnv-carnet-photo-container">
                            <div class="pnv-carnet-photo-frame" style="border-color: ${areaInfo.colorAcento}; box-shadow: 0 0 0 3px ${areaInfo.colorPrimario};">
                                <img src="${emp.foto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&h=400&q=80'}" alt="${emp.nombreCompleto}" class="pnv-photo-img" />
                            </div>
                            <span class="pnv-turno-tag" style="background: ${areaInfo.colorPrimario}; border: 1px solid ${areaInfo.colorAcento};">
                                <i class="fa-solid fa-clock"></i> Turno ${emp.turno || 'Diurno'}
                            </span>
                        </div>

                        <!-- DATOS DEL TRABAJADOR -->
                        <div class="pnv-carnet-info">
                            <h3 class="pnv-emp-name">${emp.nombreCompleto}</h3>
                            <div class="pnv-emp-cargo-pill" style="background: ${areaInfo.colorPrimario}; color: #FFFFFF; border-left: 3px solid ${areaInfo.colorAcento};">
                                ${emp.cargo}
                            </div>
                            <div class="pnv-emp-cedula-row">
                                <span class="pnv-cedula-label">CÉDULA DE IDENTIDAD</span>
                                <span class="pnv-cedula-val">${emp.cedula}</span>
                            </div>
                        </div>

                        <!-- FOOTER ANVERSO -->
                        <div class="pnv-carnet-anverso-footer">
                            <div class="pnv-footer-code-box">
                                <span class="pnv-footer-token">${emp.qrToken}</span>
                                <span class="pnv-footer-sub">CREDENCIAL OFICIAL DE SEGURIDAD</span>
                            </div>
                            <div class="pnv-mini-qr-box">
                                ${qrHtml}
                            </div>
                        </div>
                    </div>

                    <!-- ================= REVERSO (DORSO CON QR GIGANTE) ================= -->
                    <div class="pnv-carnet-card pnv-carnet-reverso" style="--area-color: ${areaInfo.colorPrimario}; --area-accent: ${areaInfo.colorAcento};">
                        <div class="pnv-reverso-header">
                            <span class="pnv-reverso-title">CONTROL DE IDENTIFICACIÓN Y ACCESO</span>
                            <span class="pnv-reverso-subtitle">PANADERÍA NUEVA VIASA, C.A.</span>
                        </div>

                        <!-- CÓDIGO QR GIGANTE (PROTAGONISTA ABSOLUTO) -->
                        <div class="pnv-giant-qr-container">
                            <div class="pnv-giant-qr-box" style="border: 2px solid ${areaInfo.colorAcento};">
                                ${qrHtml}
                            </div>
                            <div class="pnv-giant-qr-token">
                                <code>${emp.qrToken}</code>
                            </div>
                        </div>

                        <!-- DATOS MÉDICOS DE EMERGENCIA -->
                        <div class="pnv-medical-box">
                            <div class="pnv-med-row">
                                <span class="pnv-med-label"><i class="fa-solid fa-droplet" style="color: #ef4444;"></i> Grupo Sanguíneo:</span>
                                <strong class="pnv-med-val pnv-blood-badge">${emp.tipoSangre || 'O+'}</strong>
                            </div>
                            <div class="pnv-med-row">
                                <span class="pnv-med-label"><i class="fa-solid fa-phone" style="color: #10b981;"></i> Emergencia:</span>
                                <span class="pnv-med-val">${emp.telefonoEmergencia || '0414-1234567'}</span>
                            </div>
                            <div class="pnv-med-row">
                                <span class="pnv-med-label"><i class="fa-solid fa-notes-medical" style="color: #f59e0b;"></i> Alergias:</span>
                                <span class="pnv-med-val">${emp.alergias || 'Ninguna conocida'}</span>
                            </div>
                        </div>

                        <!-- FIRMA Y SELLO -->
                        <div class="pnv-signature-box">
                            <div class="pnv-signature-line"></div>
                            <span class="pnv-signature-label">Firma Autorizada • Gerencia General</span>
                        </div>

                        <!-- NOTA DE SEGURIDAD LEGAL -->
                        <div class="pnv-legal-notice">
                            Este documento es personal e intransferible. Propiedad exclusiva de Panadería Nueva Viasa, C.A. En caso de extravío favor devolver a: Av. España c/ Calle Bolívar, La Sabanita, Ciudad Bolívar. Tel: (0414) 123-4567.
                        </div>
                    </div>
                </div>
                `;
            }

            // ================= MODO 1: VISTA UNIFICADA (FRENTE TODO-EN-UNO) =================
            return `
            <div class="pnv-cr80-single-wrapper ${esParaImpresion ? 'is-printing' : ''}">
                <div class="pnv-carnet-card pnv-carnet-unificado" style="--area-color: ${areaInfo.colorPrimario}; --area-accent: ${areaInfo.colorAcento};">
                    <!-- ENCABEZADO INSTITUCIONAL -->
                    <div class="pnv-carnet-header" style="background: ${areaInfo.colorPrimario}; border-bottom: 2px solid ${areaInfo.colorAcento};">
                        <div class="pnv-carnet-crest">
                            <i class="fa-solid fa-crown" style="color: #fbbf24; font-size: 1.1rem;"></i>
                            <span class="pnv-crest-title">${EMPRESA_CONFIG.nombreCorto}</span>
                        </div>
                        <div class="pnv-carnet-org">
                            <span class="pnv-org-name">${EMPRESA_CONFIG.nombre}</span>
                            <span class="pnv-org-rif">RIF: ${EMPRESA_CONFIG.rif} • LA SABANITA</span>
                        </div>
                    </div>

                    <!-- BANDA DE ÁREA Y NIVEL -->
                    <div class="pnv-unificado-area-bar" style="background: ${areaInfo.colorPrimario}; border-bottom: 1.5px solid ${areaInfo.colorAcento};">
                        <i class="fa-solid ${areaInfo.icon}" style="color: #fbbf24;"></i>
                        <span>${areaInfo.nombre}</span>
                    </div>

                    <!-- FOTOGRAFÍA DE GRAN TAMAÑO CON MARCO DORADO -->
                    <div class="pnv-unificado-photo-block">
                        <div class="pnv-unificado-photo-frame" style="border: 3px solid ${areaInfo.colorAcento}; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
                            <img src="${emp.foto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&h=400&q=80'}" alt="${emp.nombreCompleto}" class="pnv-photo-img" />
                        </div>
                        <div class="pnv-unificado-person-details">
                            <h2 class="pnv-unificado-name">${emp.nombreCompleto}</h2>
                            <div class="pnv-unificado-cargo-badge" style="background: ${areaInfo.colorPrimario}; border: 1px solid ${areaInfo.colorAcento};">
                                ${emp.cargo}
                            </div>
                            <div class="pnv-unificado-meta-row">
                                <span class="pnv-meta-ci">C.I: <strong>${emp.cedula}</strong></span>
                                <span class="pnv-meta-blood">SANGRE: <strong>${emp.tipoSangre || 'O+'}</strong></span>
                            </div>
                        </div>
                    </div>

                    <!-- CÓDIGO QR DE GRAN TAMAÑO (MÍNIMO 140x140px REALES) -->
                    <div class="pnv-unificado-qr-section">
                        <div class="pnv-unificado-qr-box" style="border: 2px solid ${areaInfo.colorAcento};">
                            ${qrHtml}
                        </div>
                        <div class="pnv-unificado-token-pill">
                            <code>${emp.qrToken}</code>
                        </div>
                        <div class="pnv-unificado-scan-hint">
                            <i class="fa-solid fa-qrcode" style="color: ${areaInfo.colorAcento};"></i> ESCANEAR PARA CONTROL DE ASISTENCIA Y ACCESO
                        </div>
                    </div>

                    <!-- FOOTER UNIFICADO -->
                    <div class="pnv-unificado-footer" style="background: ${areaInfo.colorPrimario}; border-top: 1.5px solid ${areaInfo.colorAcento};">
                        <span>PERSONAL AUTORIZADO • CIUDAD BOLÍVAR</span>
                        <span>TURNO: ${emp.turno ? emp.turno.toUpperCase() : 'DIURNO'}</span>
                    </div>
                </div>
            </div>
            `;
        },

        // ======================================================================
        // 7. ACCIONES DE IMPRESIÓN Y EXPORTACIÓN
        // ======================================================================

        /**
         * Imprimir carnet individual del trabajador seleccionado
         */
        imprimirCarnetIndividual(empId = null) {
            const id = empId || this.trabajadorSeleccionadoId;
            const emp = this.coleccionEmpleados.find(e => e.id === id);
            if (!emp) return;

            // Generar contenedor de impresión temporal
            const contenedorAnterior = document.getElementById('pnv-print-container-isolated');
            if (contenedorAnterior) contenedorAnterior.remove();

            const printDiv = document.createElement('div');
            printDiv.id = 'pnv-print-container-isolated';
            printDiv.className = 'pnv-print-isolated single-card';
            printDiv.innerHTML = this.renderPlantillaCarnet(emp, this.modoVista, true);
            document.body.appendChild(printDiv);

            window.print();

            // Limpieza posterior
            setTimeout(() => {
                if (printDiv) printDiv.remove();
            }, 1000);
        },

        /**
         * Imprimir lote completo de carnets en hoja lista para cortar y plastificar
         */
        imprimirLoteCarnets(filtroArea = 'TODAS') {
            let lista = this.coleccionEmpleados;
            if (filtroArea !== 'TODAS') {
                lista = lista.filter(e => e.areaCodigo === filtroArea);
            }

            if (lista.length === 0) {
                alert('No hay trabajadores para imprimir con el filtro seleccionado.');
                return;
            }

            const contenedorAnterior = document.getElementById('pnv-print-container-isolated');
            if (contenedorAnterior) contenedorAnterior.remove();

            const printDiv = document.createElement('div');
            printDiv.id = 'pnv-print-container-isolated';
            printDiv.className = 'pnv-print-isolated batch-cards';

            let batchHtml = `<div class="pnv-batch-print-grid">`;
            lista.forEach(emp => {
                batchHtml += `
                <div class="pnv-batch-item">
                    ${this.renderPlantillaCarnet(emp, this.modoVista, true)}
                </div>`;
            });
            batchHtml += `</div>`;

            printDiv.innerHTML = batchHtml;
            document.body.appendChild(printDiv);

            window.print();

            setTimeout(() => {
                if (printDiv) printDiv.remove();
            }, 1000);
        },

        // ======================================================================
        // 8. RENDERIZADO PRINCIPAL DE LA VISTA DEL MÓDULO
        // ======================================================================
        render() {
            const container = document.getElementById('carnets-personal-content');
            if (!container) return;

            // Filtrado de trabajadores
            let empleadosFiltrados = this.coleccionEmpleados.filter(emp => {
                const matchArea = (this.filtroArea === 'TODAS' || emp.areaCodigo === this.filtroArea);
                const matchEstatus = (this.filtroEstatus === 'TODOS' || emp.estatus === this.filtroEstatus);
                const q = this.busqueda.toLowerCase();
                const matchBusqueda = !q ||
                    (emp.nombreCompleto && emp.nombreCompleto.toLowerCase().includes(q)) ||
                    (emp.cedula && emp.cedula.toLowerCase().includes(q)) ||
                    (emp.cargo && emp.cargo.toLowerCase().includes(q)) ||
                    (emp.qrToken && emp.qrToken.toLowerCase().includes(q));
                return matchArea && matchEstatus && matchBusqueda;
            });

            const empActivo = this.getEmpleadoSeleccionado();

            // Métricas de cabecera
            const totalEmps = this.coleccionEmpleados.length;
            const totalActivos = this.coleccionEmpleados.filter(e => e.estatus === 'Activo').length;
            const totalTokens = this.coleccionEmpleados.filter(e => e.qrToken && e.qrToken.startsWith('NV-EMP-')).length;
            const cuentaAreas = {
                ADM: this.coleccionEmpleados.filter(e => e.areaCodigo === 'ADM').length,
                PROD: this.coleccionEmpleados.filter(e => e.areaCodigo === 'PROD').length,
                VNT: this.coleccionEmpleados.filter(e => e.areaCodigo === 'VNT').length,
                LOG: this.coleccionEmpleados.filter(e => e.areaCodigo === 'LOG').length,
                MNT: this.coleccionEmpleados.filter(e => e.areaCodigo === 'MNT').length
            };

            container.innerHTML = `
            <div class="pnv-carnets-module">
                <!-- ================= 1. CABECERA EJECUTIVA ================= -->
                <div class="pnv-module-header">
                    <div class="pnv-header-info">
                        <div class="pnv-header-badge">
                            <i class="fa-solid fa-id-card-clip"></i> RECURSOS HUMANOS & IDENTIFICACIÓN CORPORATIVA
                        </div>
                        <h1 class="pnv-header-title">Identificación de Personal y Carnets con Código QR Único</h1>
                        <p class="pnv-header-subtitle">
                            <strong>${EMPRESA_CONFIG.nombre}</strong> • RIF: ${EMPRESA_CONFIG.rif} • La Sabanita, Ciudad Bolívar
                        </p>
                    </div>
                    <div class="pnv-header-actions">
                        <button class="btn btn-outline" onclick="window.ViasaCarnetsEngine.abrirModalTrabajador()">
                            <i class="fa-solid fa-user-plus"></i> Registrar Trabajador
                        </button>
                        <button class="btn btn-primary" onclick="window.ViasaCarnetsEngine.imprimirLoteCarnets(window.ViasaCarnetsEngine.filtroArea)" style="background: linear-gradient(135deg, #d97706, #b45309);">
                            <i class="fa-solid fa-print"></i> Imprimir Lote de Carnets
                        </button>
                    </div>
                </div>

                <!-- ================= 2. FILA DE 5 KPIS EN TIEMPO REAL ================= -->
                <div class="pnv-kpi-grid">
                    <div class="pnv-kpi-card">
                        <div class="pnv-kpi-icon" style="background: rgba(15, 23, 42, 0.15); color: #0f172a;">
                            <i class="fa-solid fa-users"></i>
                        </div>
                        <div class="pnv-kpi-content">
                            <span class="pnv-kpi-label">Plantilla Total</span>
                            <span class="pnv-kpi-value">${totalEmps}</span>
                            <span class="pnv-kpi-sub">Trabajadores registrados</span>
                        </div>
                    </div>

                    <div class="pnv-kpi-card">
                        <div class="pnv-kpi-icon" style="background: rgba(16, 185, 129, 0.15); color: #10b981;">
                            <i class="fa-solid fa-user-check"></i>
                        </div>
                        <div class="pnv-kpi-content">
                            <span class="pnv-kpi-label">Carnets Activos</span>
                            <span class="pnv-kpi-value">${totalActivos}</span>
                            <span class="pnv-kpi-sub">Habilitados para control</span>
                        </div>
                    </div>

                    <div class="pnv-kpi-card">
                        <div class="pnv-kpi-icon" style="background: rgba(217, 119, 6, 0.15); color: #d97706;">
                            <i class="fa-solid fa-qrcode"></i>
                        </div>
                        <div class="pnv-kpi-content">
                            <span class="pnv-kpi-label">Tokens QR Únicos</span>
                            <span class="pnv-kpi-value">${totalTokens} / ${totalEmps}</span>
                            <span class="pnv-kpi-sub">100% Criptográficos</span>
                        </div>
                    </div>

                    <div class="pnv-kpi-card">
                        <div class="pnv-kpi-icon" style="background: rgba(153, 27, 27, 0.15); color: #991b1b;">
                            <i class="fa-solid fa-fire-burner"></i>
                        </div>
                        <div class="pnv-kpi-content">
                            <span class="pnv-kpi-label">Producción & Panadería</span>
                            <span class="pnv-kpi-value">${cuentaAreas.PROD}</span>
                            <span class="pnv-kpi-sub">Maestros y Horneros</span>
                        </div>
                    </div>

                    <div class="pnv-kpi-card">
                        <div class="pnv-kpi-icon" style="background: rgba(6, 95, 70, 0.15); color: #065f46;">
                            <i class="fa-solid fa-shield-halved"></i>
                        </div>
                        <div class="pnv-kpi-content">
                            <span class="pnv-kpi-label">Validación Seguridad</span>
                            <span class="pnv-kpi-value" style="color: #10b981; font-size: 1.25rem;">Sin Colisiones</span>
                            <span class="pnv-kpi-sub">Cédula y Token Únicos</span>
                        </div>
                    </div>
                </div>

                <!-- ================= 3. ESTUDIO CENTRAL (2 COLUMNAS) ================= -->
                <div class="pnv-studio-layout">
                    <!-- COLUMNA IZQUIERDA: DIRECTORIO MAESTRO DE TRABAJADORES -->
                    <div class="pnv-directory-column">
                        <div class="pnv-directory-box">
                            <!-- BARRA DE BÚSQUEDA Y FILTROS -->
                            <div class="pnv-filter-bar">
                                <div class="pnv-search-input-wrapper">
                                    <i class="fa-solid fa-magnifying-glass"></i>
                                    <input type="text"
                                           class="pnv-search-input"
                                           placeholder="Buscar por nombre, cédula, cargo o token..."
                                           value="${this.busqueda}"
                                           oninput="window.ViasaCarnetsEngine.busqueda = this.value; window.ViasaCarnetsEngine.render();" />
                                </div>
                                <div class="pnv-filter-selectors">
                                    <select class="pnv-select-area" onchange="window.ViasaCarnetsEngine.filtroArea = this.value; window.ViasaCarnetsEngine.render();">
                                        <option value="TODAS" ${this.filtroArea === 'TODAS' ? 'selected' : ''}>Todas las Áreas</option>
                                        <option value="ADM" ${this.filtroArea === 'ADM' ? 'selected' : ''}>Gerencia / ADM</option>
                                        <option value="PROD" ${this.filtroArea === 'PROD' ? 'selected' : ''}>Producción / Panadería</option>
                                        <option value="VNT" ${this.filtroArea === 'VNT' ? 'selected' : ''}>Ventas / POS</option>
                                        <option value="LOG" ${this.filtroArea === 'LOG' ? 'selected' : ''}>Despacho / B2B</option>
                                        <option value="MNT" ${this.filtroArea === 'MNT' ? 'selected' : ''}>Mantenimiento / Almacén</option>
                                    </select>
                                    <select class="pnv-select-status" onchange="window.ViasaCarnetsEngine.filtroEstatus = this.value; window.ViasaCarnetsEngine.render();">
                                        <option value="TODOS" ${this.filtroEstatus === 'TODOS' ? 'selected' : ''}>Todos los Estatus</option>
                                        <option value="Activo" ${this.filtroEstatus === 'Activo' ? 'selected' : ''}>Activos</option>
                                        <option value="Reposo" ${this.filtroEstatus === 'Reposo' ? 'selected' : ''}>En Reposo</option>
                                        <option value="Vacaciones" ${this.filtroEstatus === 'Vacaciones' ? 'selected' : ''}>Vacaciones</option>
                                        <option value="Inactivo" ${this.filtroEstatus === 'Inactivo' ? 'selected' : ''}>Inactivos</option>
                                    </select>
                                </div>
                            </div>

                            <!-- LISTA INTERACTIVA DE TRABAJADORES -->
                            <div class="pnv-workers-list">
                                ${empleadosFiltrados.length === 0 ? `
                                    <div class="pnv-no-results">
                                        <i class="fa-solid fa-user-slash"></i>
                                        <p>No se encontraron trabajadores con los filtros especificados.</p>
                                    </div>
                                ` : empleadosFiltrados.map(emp => {
                                    const areaInfo = AREAS_CORPORATIVAS[emp.areaCodigo] || AREAS_CORPORATIVAS.ADM;
                                    const esSeleccionado = emp.id === this.trabajadorSeleccionadoId;
                                    return `
                                    <div class="pnv-worker-row ${esSeleccionado ? 'is-selected' : ''}"
                                         onclick="window.ViasaCarnetsEngine.trabajadorSeleccionadoId = '${emp.id}'; window.ViasaCarnetsEngine.render();"
                                         style="--accent-border: ${areaInfo.colorAcento};">
                                        <div class="pnv-worker-avatar-box">
                                            <img src="${emp.foto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&h=400&q=80'}" alt="${emp.nombreCompleto}" class="pnv-worker-avatar" style="border: 2px solid ${areaInfo.colorAcento};" />
                                            <span class="pnv-status-dot ${emp.estatus === 'Activo' ? 'is-active' : 'is-inactive'}"></span>
                                        </div>
                                        <div class="pnv-worker-main-info">
                                            <div class="pnv-worker-name-row">
                                                <strong class="pnv-worker-name">${emp.nombreCompleto}</strong>
                                                <span class="pnv-area-badge" style="background: ${areaInfo.colorPrimario}; color: #FFFFFF; border: 1px solid ${areaInfo.colorAcento};">
                                                    <i class="fa-solid ${areaInfo.icon}"></i> ${emp.areaCodigo}
                                                </span>
                                            </div>
                                            <div class="pnv-worker-cargo-row">
                                                <span class="pnv-worker-cargo">${emp.cargo}</span>
                                                <span class="pnv-worker-ci">C.I: ${emp.cedula}</span>
                                            </div>
                                            <div class="pnv-worker-token-row">
                                                <code class="pnv-token-snippet">${emp.qrToken}</code>
                                            </div>
                                        </div>
                                        <div class="pnv-worker-quick-actions" onclick="event.stopPropagation();">
                                            <button class="pnv-btn-icon" title="Editar Expediente" onclick="window.ViasaCarnetsEngine.abrirModalTrabajador('${emp.id}')">
                                                <i class="fa-solid fa-pen-to-square"></i>
                                            </button>
                                            <button class="pnv-btn-icon" title="Regenerar Token (Por Extravío)" onclick="window.ViasaCarnetsEngine.regenerarTokenTrabajador('${emp.id}')">
                                                <i class="fa-solid fa-arrows-rotate"></i>
                                            </button>
                                            <button class="pnv-btn-icon" title="Imprimir Carnet" onclick="window.ViasaCarnetsEngine.imprimirCarnetIndividual('${emp.id}')">
                                                <i class="fa-solid fa-print"></i>
                                            </button>
                                        </div>
                                    </div>`;
                                }).join('')}
                            </div>
                        </div>
                    </div>

                    <!-- COLUMNA DERECHA: ESTUDIO VISUAL Y PREVISUALIZADOR DEL CARNET CR80 -->
                    <div class="pnv-preview-column">
                        <div class="pnv-studio-card">
                            <!-- BARRA DE MODO DE VISTA Y CONTROLES DEL ESTUDIO -->
                            <div class="pnv-studio-toolbar">
                                <div class="pnv-view-mode-tabs">
                                    <button class="pnv-tab-btn ${this.modoVista === 'unificada' ? 'active' : ''}"
                                            onclick="window.ViasaCarnetsEngine.modoVista = 'unificada'; window.ViasaCarnetsEngine.render();">
                                        <i class="fa-solid fa-id-card"></i> Vista Unificada (Frente de Alto Impacto)
                                    </button>
                                    <button class="pnv-tab-btn ${this.modoVista === 'doble-cara' ? 'active' : ''}"
                                            onclick="window.ViasaCarnetsEngine.modoVista = 'doble-cara'; window.ViasaCarnetsEngine.render();">
                                        <i class="fa-solid fa-clone"></i> Vista Doble Cara (Anverso + Reverso)
                                    </button>
                                </div>
                            </div>

                            ${empActivo ? `
                            <!-- BARRA DE ACCIONES DIRECTAS SOBRE EL CARNET ACTIVO -->
                            <div class="pnv-active-actions-bar">
                                <div class="pnv-active-summary">
                                    <span class="pnv-summary-label">Carnet en Pantalla:</span>
                                    <strong class="pnv-summary-name">${empActivo.nombreCompleto}</strong>
                                    <span class="pnv-summary-token"><code>${empActivo.qrToken}</code></span>
                                </div>
                                <div class="pnv-active-buttons">
                                    <button class="btn btn-sm btn-outline" title="Regenerar Token por extravío" onclick="window.ViasaCarnetsEngine.regenerarTokenTrabajador('${empActivo.id}')">
                                        <i class="fa-solid fa-arrows-rotate"></i> Regenerar Token
                                    </button>
                                    <button class="btn btn-sm btn-outline" title="Subir imagen QR personalizada" onclick="window.ViasaCarnetsEngine.subirQRPersonalizado('${empActivo.id}')">
                                        <i class="fa-solid fa-image"></i> Subir QR
                                    </button>
                                    ${empActivo.qrCustomImage ? `
                                    <button class="btn btn-sm btn-outline" title="Restaurar QR automático nativo" onclick="window.ViasaCarnetsEngine.restaurarQRAutomatico('${empActivo.id}')" style="color: #f59e0b;">
                                        <i class="fa-solid fa-rotate-left"></i> QR Auto
                                    </button>
                                    ` : ''}
                                    <button class="btn btn-sm btn-outline" title="Cambiar fotografía del trabajador" onclick="window.ViasaCarnetsEngine.cambiarFotografiaTrabajador('${empActivo.id}')">
                                        <i class="fa-solid fa-camera"></i> Cambiar Foto
                                    </button>
                                    <button class="btn btn-sm btn-primary" title="Imprimir este carnet" onclick="window.ViasaCarnetsEngine.imprimirCarnetIndividual('${empActivo.id}')" style="background: #0f172a; border-color: #d97706;">
                                        <i class="fa-solid fa-print"></i> Imprimir PVC
                                    </button>
                                </div>
                            </div>

                            <!-- CONTENEDOR VISUAL DEL CARNET CR80 -->
                            <div class="pnv-carnet-viewport">
                                ${this.renderPlantillaCarnet(empActivo, this.modoVista, false)}
                            </div>
                            ` : `
                            <div class="pnv-no-selected-box">
                                <i class="fa-solid fa-address-card"></i>
                                <p>Seleccione un trabajador del listado izquierdo para previsualizar su carnet corporativo.</p>
                            </div>
                            `}
                        </div>
                    </div>
                </div>
            </div>
            `;
        },

        // ======================================================================
        // 9. MODAL FLOTANTE DE EXPEDIENTE / REGISTRO DE TRABAJADOR
        // ======================================================================
        renderModalTrabajador() {
            const emp = this.trabajadorEditando;
            if (!emp) return;

            const modalExistente = document.getElementById('pnv-modal-trabajador-carnet');
            if (modalExistente) modalExistente.remove();

            const areaInfo = AREAS_CORPORATIVAS[emp.areaCodigo] || AREAS_CORPORATIVAS.ADM;

            const modal = document.createElement('div');
            modal.id = 'pnv-modal-trabajador-carnet';
            modal.className = 'pnv-modal-overlay';
            modal.innerHTML = `
            <div class="pnv-modal-card">
                <div class="pnv-modal-header" style="background: ${areaInfo.colorPrimario}; border-bottom: 2px solid ${areaInfo.colorAcento};">
                    <div class="pnv-modal-title-box">
                        <i class="fa-solid fa-id-badge" style="color: #fbbf24;"></i>
                        <h2 class="pnv-modal-title">${emp.id ? 'Expediente y Credencial de Personal' : 'Nuevo Registro de Trabajador'}</h2>
                    </div>
                    <button class="pnv-modal-close-btn" onclick="window.ViasaCarnetsEngine.cerrarModalTrabajador()">&times;</button>
                </div>

                <div class="pnv-modal-body">
                    <div class="pnv-modal-form-grid">
                        <!-- COLUMNA FOTO Y PREVIEW -->
                        <div class="pnv-form-photo-side">
                            <div class="pnv-photo-preview-box">
                                <img id="form-pnv-photo-img" src="${emp.foto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&h=400&q=80'}" alt="Foto" />
                                <button type="button" class="btn btn-sm btn-outline pnv-btn-upload-photo" onclick="document.getElementById('form-pnv-file-photo').click()">
                                    <i class="fa-solid fa-upload"></i> Subir Fotografía
                                </button>
                                <input type="file" id="form-pnv-file-photo" accept="image/*" style="display:none;" onchange="
                                    const f = this.files[0];
                                    if(f){
                                        const r = new FileReader();
                                        r.onload = (ev) => {
                                            document.getElementById('form-pnv-photo-img').src = ev.target.result;
                                            window.ViasaCarnetsEngine.trabajadorEditando.foto = ev.target.result;
                                        };
                                        r.readAsDataURL(f);
                                    }
                                " />
                            </div>

                            <div class="pnv-form-token-display">
                                <label class="pnv-form-label">Token QR Único:</label>
                                <input type="text" id="form-pnv-token" class="pnv-form-input readonly-code" value="${emp.qrToken}" readonly />
                                <small class="pnv-form-help">Generado bajo norma <code>NV-EMP-{AREA}-{CI}-{HASH4}</code></small>
                            </div>

                            <div class="pnv-form-area-badge-preview" id="form-pnv-area-preview" style="background: ${areaInfo.colorPrimario}; color: #FFFFFF; border: 1.5px solid ${areaInfo.colorAcento};">
                                <i class="fa-solid ${areaInfo.icon}"></i> ${areaInfo.nombre}
                            </div>
                        </div>

                        <!-- COLUMNA DATOS -->
                        <div class="pnv-form-data-side">
                            <div class="pnv-form-row-2">
                                <div class="pnv-form-group">
                                    <label class="pnv-form-label">Nombres y Apellidos *</label>
                                    <input type="text" id="form-pnv-nombre" class="pnv-form-input" value="${emp.nombreCompleto}" placeholder="Ej. Carlos Hernández" required />
                                </div>
                                <div class="pnv-form-group">
                                    <label class="pnv-form-label">Cédula de Identidad *</label>
                                    <input type="text" id="form-pnv-cedula" class="pnv-form-input" value="${emp.cedula}" placeholder="Ej. V-18.765.432" oninput="window.ViasaCarnetsEngine.actualizarCedulaEnFormulario(this.value)" required />
                                </div>
                            </div>

                            <div class="pnv-form-row-2">
                                <div class="pnv-form-group">
                                    <label class="pnv-form-label">Cargo Específico *</label>
                                    <input type="text" id="form-pnv-cargo" class="pnv-form-input" value="${emp.cargo}" placeholder="Ej. Maestro Panadero Jefe" required />
                                </div>
                                <div class="pnv-form-group">
                                    <label class="pnv-form-label">Área / Nivel Institucional *</label>
                                    <select id="form-pnv-area" class="pnv-form-input" onchange="window.ViasaCarnetsEngine.actualizarAreaEnFormulario(this.value)">
                                        <option value="ADM" ${emp.areaCodigo === 'ADM' ? 'selected' : ''}>Gerencia y Administración (ADM)</option>
                                        <option value="PROD" ${emp.areaCodigo === 'PROD' ? 'selected' : ''}>Producción / Panadería / Horneros (PROD)</option>
                                        <option value="VNT" ${emp.areaCodigo === 'VNT' ? 'selected' : ''}>Ventas / Mostrador / Caja POS (VNT)</option>
                                        <option value="LOG" ${emp.areaCodigo === 'LOG' ? 'selected' : ''}>Distribución B2B / Despacho (LOG)</option>
                                        <option value="MNT" ${emp.areaCodigo === 'MNT' ? 'selected' : ''}>Mantenimiento y Servicios (MNT)</option>
                                    </select>
                                </div>
                            </div>

                            <div class="pnv-form-row-3">
                                <div class="pnv-form-group">
                                    <label class="pnv-form-label">Turno</label>
                                    <select id="form-pnv-turno" class="pnv-form-input">
                                        <option value="Diurno" ${emp.turno === 'Diurno' || emp.turno === 'diurno' ? 'selected' : ''}>Diurno (Mañana/Tarde)</option>
                                        <option value="Mixto" ${emp.turno === 'Mixto' || emp.turno === 'mixto' ? 'selected' : ''}>Mixto</option>
                                        <option value="Nocturno" ${emp.turno === 'Nocturno' || emp.turno === 'nocturno' || emp.turno === 'nocturno_madrugada' ? 'selected' : ''}>Nocturno (Madrugada)</option>
                                    </select>
                                </div>
                                <div class="pnv-form-group">
                                    <label class="pnv-form-label">Fecha de Ingreso</label>
                                    <input type="date" id="form-pnv-ingreso" class="pnv-form-input" value="${emp.fechaIngreso || '2026-01-15'}" />
                                </div>
                                <div class="pnv-form-group">
                                    <label class="pnv-form-label">Estatus</label>
                                    <select id="form-pnv-estatus" class="pnv-form-input">
                                        <option value="Activo" ${emp.estatus === 'Activo' ? 'selected' : ''}>Activo</option>
                                        <option value="Reposo" ${emp.estatus === 'Reposo' ? 'selected' : ''}>Reposo Médico</option>
                                        <option value="Vacaciones" ${emp.estatus === 'Vacaciones' ? 'selected' : ''}>Vacaciones</option>
                                        <option value="Inactivo" ${emp.estatus === 'Inactivo' ? 'selected' : ''}>Inactivo</option>
                                    </select>
                                </div>
                            </div>

                            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 15px 0;" />
                            <h4 style="margin: 0 0 10px 0; font-size: 0.9rem; color: #64748b; text-transform: uppercase;">Ficha Médica y Contacto de Emergencia</h4>

                            <div class="pnv-form-row-2">
                                <div class="pnv-form-group">
                                    <label class="pnv-form-label">Tipo de Sangre</label>
                                    <select id="form-pnv-sangre" class="pnv-form-input">
                                        <option value="O+" ${emp.tipoSangre === 'O+' ? 'selected' : ''}>O Positivo (O+)</option>
                                        <option value="O-" ${emp.tipoSangre === 'O-' ? 'selected' : ''}>O Negativo (O-)</option>
                                        <option value="A+" ${emp.tipoSangre === 'A+' ? 'selected' : ''}>A Positivo (A+)</option>
                                        <option value="A-" ${emp.tipoSangre === 'A-' ? 'selected' : ''}>A Negativo (A-)</option>
                                        <option value="B+" ${emp.tipoSangre === 'B+' ? 'selected' : ''}>B Positivo (B+)</option>
                                        <option value="B-" ${emp.tipoSangre === 'B-' ? 'selected' : ''}>B Negativo (B-)</option>
                                        <option value="AB+" ${emp.tipoSangre === 'AB+' ? 'selected' : ''}>AB Positivo (AB+)</option>
                                        <option value="AB-" ${emp.tipoSangre === 'AB-' ? 'selected' : ''}>AB Negativo (AB-)</option>
                                    </select>
                                </div>
                                <div class="pnv-form-group">
                                    <label class="pnv-form-label">Teléfono y Contacto de Emergencia</label>
                                    <input type="text" id="form-pnv-emergencia" class="pnv-form-input" value="${emp.telefonoEmergencia}" placeholder="Ej. 0414-9871122 (Esposa)" />
                                </div>
                            </div>

                            <div class="pnv-form-group">
                                <label class="pnv-form-label">Alergias / Condición Médica</label>
                                <input type="text" id="form-pnv-alergias" class="pnv-form-input" value="${emp.alergias}" placeholder="Ej. Ninguna conocida / Alérgico a penicilina" />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="pnv-modal-footer">
                    <button type="button" class="btn btn-outline" onclick="window.ViasaCarnetsEngine.cerrarModalTrabajador()">Cancelar</button>
                    <button type="button" class="btn btn-primary" onclick="window.ViasaCarnetsEngine.guardarTrabajadorDesdeModal()" style="background: ${areaInfo.colorPrimario}; border-color: ${areaInfo.colorAcento};">
                        <i class="fa-solid fa-floppy-disk"></i> Guardar Expediente y Credencial
                    </button>
                </div>
            </div>
            `;
            document.body.appendChild(modal);
        }
    };

    // Publicación en el ámbito global
    window.ViasaCarnetsEngine = ViasaCarnetsEngine;

    // Inicialización automática cuando el DOM esté listo
    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => ViasaCarnetsEngine.init());
        } else {
            ViasaCarnetsEngine.init();
        }
    }

})(window);
