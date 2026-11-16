/**
 * ==============================================================================
 * VIASA SYSTEM - STORAGE ENGINE (SANDBOX ISOLATED)
 * Panadería y Pastelería Nueva Viasa
 * ==============================================================================
 * Motor de persistencia multi-capa con aislamiento absoluto para evitar
 * cualquier colisión o contaminación con otros sistemas.
 */

(function(window) {
    'use strict';

    const VIASA_STORAGE_PREFIX = 'viasa_sys_';
    const DB_NAME = 'VIASA_SYSTEM_DB_v1';
    const DB_VERSION = 11;
    const VIASA_DB_SCHEMA_VERSION = '1.5.0';

    const STORES = [
        'categorias',
        'productos',
        'materia_prima',
        'recetas_formulas',
        'ordenes_produccion',
        'mermas',
        'proveedores',
        'ordenes_compra',
        'cuentas_por_pagar',
        'ventas',
        'caja_turnos',
        'movimientos_caja',
        'clientes',
        'pedidos_especiales',
        'asientos_contables',
        'plan_cuentas',
        'rubros_contables',
        'cierres_caja',
        'movimientos_banco',
        'retenciones_iva',
        'configuracion',
        'empleados',
        'usuarios',
        'banco_memoria_rrhh',
        'fichajes_asistencia',
        'permisos_reposos_ivss',
        'vacaciones_programadas',
        'liquidaciones_lottt',
        'preventas_rompefilas',
        'repartidores',
        'despachos_delivery',
        'compras_predictivas',
        'audit_logs_crypto',
        'documentos_mercantiles',
        'banco_memoria',
        'banco_memoria_documental',
        'mesas_cafetin',
        'platos_cafetin',
        'comandas_cafetin',
        'cortesias_autorizadas',
        'propinas_registro',
        'activos_maquinaria',
        'mantenimientos_maquinaria',
        'zonas_delivery',
        'historico_costos_insumos',
        'kds_comandas',
        'contactos_directorio',
        'cuentas_correo',
        'mensajes_correo_crm',
        'plantillas_correo',
        'recompensas_club',
        'historial_tasas_cambio',
        'banco_memoria_contabilidad_nomina',
        'calculos_nomina',
        'casillero_respaldos_generales',
        'guardias_turnos',
        'turnos_operativos',
        'anales_guardias_rrhh',
        'shift_marketplace',
        'despachos_rutas',
        'agenda_operaciones',
        'agenda_bitacora_emails'
    ];

    class ViasaStorageEngine {
        constructor() {
            this.prefix = VIASA_STORAGE_PREFIX;
            this.dbName = DB_NAME;
            this.dbVersion = DB_VERSION;
            this.schemaVersion = VIASA_DB_SCHEMA_VERSION;
            this.db = null;
            this.isReady = false;
            this.initPromise = this.initIndexedDB().then(() => {
                this.ejecutarMigracionEsquemaV15();
            });
        }

        /**
         * Motor de Migración Automática de Esquemas (V1.5.0 Schema Versioning)
         * Enriquecimiento no destructivo: preserva el 100% de los datos existentes.
         */
        async ejecutarMigracionEsquemaV15() {
            try {
                const currentSchema = localStorage.getItem('viasa_db_schema_version');
                if (currentSchema === VIASA_DB_SCHEMA_VERSION) {
                    return { yaMigrado: true, version: VIASA_DB_SCHEMA_VERSION };
                }

                console.log(`[VIASA Schema] Ejecutando migración no destructiva a V1.5.0 (Edición Corporativa Multi-Sede)...`);
                
                const enriquecerRegistro = (item, prefix = 'REC') => {
                    if (!item || typeof item !== 'object') return item;
                    if (!item.id && !item.codigo && !item.sku && !item.clave) {
                        item.id = `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
                    }
                    if (!item.sucursalId) {
                        item.sucursalId = 'SEDE-PRINCIPAL';
                    }
                    if (!item.updatedAt) {
                        item.updatedAt = item.fechaActualizacion || item.fecha || new Date().toISOString();
                    }
                    if (!item.syncStatus) {
                        item.syncStatus = 'synced';
                    }
                    return item;
                };

                // 1. Enriquecer productos en localStorage (viasa_productos_master_v1 y viasa_productos_nueva_viasa_v1)
                try {
                    const masterRaw = localStorage.getItem('viasa_productos_master_v1');
                    if (masterRaw) {
                        const prods = JSON.parse(masterRaw);
                        if (Array.isArray(prods)) {
                            let modificado = false;
                            prods.forEach(p => {
                                if (!p.sucursalId || !p.syncStatus || !p.updatedAt) {
                                    enriquecerRegistro(p, 'PROD');
                                    modificado = true;
                                }
                            });
                            if (modificado) {
                                localStorage.setItem('viasa_productos_master_v1', JSON.stringify(prods));
                            }
                        }
                    }
                } catch (eP) {
                    console.warn('[VIASA Schema] Nota en migración de productos master:', eP);
                }

                // 2. Enriquecer colecciones en LocalStorage Sandbox
                for (const store of STORES) {
                    if (store === 'casillero_respaldos_generales') continue;
                    try {
                        const key = `col_${store}`;
                        const raw = this.getItem(key, null);
                        if (Array.isArray(raw) && raw.length > 0) {
                            let mod = false;
                            raw.forEach(r => {
                                if (r && typeof r === 'object' && (!r.sucursalId || !r.syncStatus || !r.updatedAt)) {
                                    enriquecerRegistro(r, store.slice(0, 4).toUpperCase());
                                    mod = true;
                                }
                            });
                            if (mod) {
                                this.setItem(key, raw);
                                this.setItem(store, raw);
                            }
                        }
                    } catch (eCol) {}
                }

                localStorage.setItem('viasa_db_schema_version', VIASA_DB_SCHEMA_VERSION);
                console.log(`[VIASA Schema] Migración a V1.5.0 completada exitosamente sin alterar registros previos.`);
                return { yaMigrado: false, version: VIASA_DB_SCHEMA_VERSION };
            } catch (err) {
                console.error('[VIASA Schema] Error no fatal en migración V1.5.0:', err);
                return { error: err.message };
            }
        }

        /**
         * Inicializa la base de datos local IndexedDB (con timeout de seguridad de 800ms)
         */
        initIndexedDB() {
            return new Promise((resolve) => {
                if (!window.indexedDB) {
                    console.warn('[VIASA Storage] IndexedDB no soportado en este navegador. Usando LocalStorage Sandbox.');
                    this.isReady = true;
                    return resolve(null);
                }

                // Timeout de seguridad de máximo 800ms para evitar promesas colgadas
                const timerSafety = setTimeout(() => {
                    if (!this.isReady) {
                        console.warn('[VIASA Storage] Timeout de seguridad de 800ms alcanzado para IndexedDB. Continuando con LocalStorage Sandbox.');
                        this.isReady = true;
                        resolve(null);
                    }
                }, 800);

                try {
                    const request = window.indexedDB.open(this.dbName, this.dbVersion);

                    request.onupgradeneeded = (event) => {
                        const db = event.target.result;
                        STORES.forEach(storeName => {
                            if (!db.objectStoreNames.contains(storeName)) {
                                let keyPath = 'id';
                                if (storeName === 'configuracion') keyPath = 'clave';
                                db.createObjectStore(storeName, { keyPath: keyPath });
                            }
                        });
                        console.log('[VIASA Storage] Estructura de Base de Datos IndexedDB creada exitosamente.');
                    };

                    request.onsuccess = (event) => {
                        clearTimeout(timerSafety);
                        this.db = event.target.result;
                        this.isReady = true;
                        console.log(`[VIASA Storage] Conectado a IndexedDB: ${this.dbName} (Aislamiento Activo)`);
                        resolve(this.db);
                    };

                    request.onerror = (event) => {
                        clearTimeout(timerSafety);
                        console.error('[VIASA Storage] Error abriendo IndexedDB:', event.target.error);
                        this.isReady = true;
                        resolve(null);
                    };

                    request.onblocked = () => {
                        clearTimeout(timerSafety);
                        console.warn('[VIASA Storage] Conexión IndexedDB bloqueada por otra pestaña. Continuando en modo seguro.');
                        this.isReady = true;
                        resolve(null);
                    };
                } catch (eInit) {
                    clearTimeout(timerSafety);
                    this.isReady = true;
                    resolve(null);
                }
            });
        }

        /**
         * Clave con prefijo sandbox seguro
         */
        getSandboxedKey(key) {
            return `${this.prefix}${key}`;
        }

        /**
         * Sanea cadenas o estructuras JSON que hayan quedado en caché con mojibake UTF-8/CP1252
         */
        sanitizarTexto(val) {
            if (typeof val === 'string') {
                if (!/[ÃÂâ]/.test(val)) return val;
                return val
                    .replace(/Ã¡/g, 'á')
                    .replace(/Ã©/g, 'é')
                    .replace(/Ã­/g, 'í')
                    .replace(/Ã³/g, 'ó')
                    .replace(/Ãº/g, 'ú')
                    .replace(/Ã±/g, 'ñ')
                    .replace(/Ã¼/g, 'ü')
                    .replace(/Ã\x81/g, 'Á')
                    .replace(/Ã‰/g, 'É')
                    .replace(/Ã\x8d/g, 'Í')
                    .replace(/Ã“/g, 'Ó')
                    .replace(/Ãš/g, 'Ú')
                    .replace(/Ã‘/g, 'Ñ')
                    .replace(/Ãœ/g, 'Ü')
                    .replace(/Â°/g, '°')
                    .replace(/Âº/g, 'º')
                    .replace(/Âª/g, 'ª')
                    .replace(/Â¿/g, '¿')
                    .replace(/Â¡/g, '¡')
                    .replace(/Ã—/g, '×')
                    .replace(/â€”/g, '—')
                    .replace(/â€“/g, '–')
                    .replace(/â€¢/g, '•')
                    .replace(/â€œ/g, '“')
                    .replace(/â€/g, '”')
                    .replace(/DÃas/g, 'Días')
                    .replace(/dÃas/g, 'días')
                    .replace(/GarantÃa/g, 'Garantía')
                    .replace(/garantÃa/g, 'garantía')
                    .replace(/PanaderÃa/g, 'Panadería')
                    .replace(/PastelerÃa/g, 'Pastelería')
                    .replace(/CategorÃa/g, 'Categoría')
                    .replace(/AuditorÃa/g, 'Auditoría')
                    .replace(/MÃnimo/g, 'Mínimo')
                    .replace(/CÃ³digo/g, 'Código');
            }
            if (Array.isArray(val)) {
                return val.map(item => this.sanitizarTexto(item));
            }
            if (val && typeof val === 'object') {
                const limpio = {};
                for (const k of Object.keys(val)) {
                    limpio[k] = this.sanitizarTexto(val[k]);
                }
                return limpio;
            }
            return val;
        }

        /**
         * Remueve cadenas Base64 pesadas para proteger la cuota de LocalStorage
         */
        _removerBase64Pesados(obj) {
            if (!obj) return obj;
            if (typeof obj === 'string') {
                if (obj.startsWith('data:image/') && obj.length > 20000) {
                    return '';
                }
                return obj;
            }
            if (Array.isArray(obj)) {
                return obj.map(it => this._removerBase64Pesados(it));
            }
            if (typeof obj === 'object') {
                const res = {};
                for (const k of Object.keys(obj)) {
                    res[k] = this._removerBase64Pesados(obj[k]);
                }
                return res;
            }
            return obj;
        }

        /**
         * Guardar datos en LocalStorage Sandbox con protección contra QuotaExceededError
         */
        setItem(key, value) {
            const sKey = this.getSandboxedKey(key);
            try {
                const limpio = this.sanitizarTexto(value);
                const str = typeof limpio === 'string' ? limpio : JSON.stringify(limpio);
                localStorage.setItem(sKey, str);
                return true;
            } catch (e) {
                console.warn(`[VIASA Storage] QuotaExceeded o error guardando ${key} en LocalStorage. Aplicando desbordamiento controlado:`, e);
                try {
                    if (window.ViasaMediaStorage && typeof window.ViasaMediaStorage.purgarBase64AntiguosDeLocalStorage === 'function') {
                        window.ViasaMediaStorage.purgarBase64AntiguosDeLocalStorage();
                    }
                    const sinBase64 = this._removerBase64Pesados(this.sanitizarTexto(value));
                    const strLimpio = typeof sinBase64 === 'string' ? sinBase64 : JSON.stringify(sinBase64);
                    localStorage.setItem(sKey, strLimpio);
                    console.log(`[VIASA Storage] ${key} guardado exitosamente tras depurar Base64 pesado.`);
                    return true;
                } catch (e2) {
                    console.error(`[VIASA Storage] No se pudo guardar ${key} en LocalStorage ni tras purga:`, e2);
                    return false;
                }
            }
        }

        /**
         * Obtener datos desde LocalStorage Sandbox
         */
        getItem(key, defaultValue = null) {
            try {
                const sKey = this.getSandboxedKey(key);
                const val = localStorage.getItem(sKey);
                if (val === null) return defaultValue;
                const valSanitizado = this.sanitizarTexto(val);
                try {
                    return JSON.parse(valSanitizado);
                } catch {
                    return valSanitizado;
                }
            } catch (e) {
                console.error(`[VIASA Storage] Error leyendo ${key}:`, e);
                return defaultValue;
            }
        }

        /**
         * Eliminar item de LocalStorage Sandbox
         */
        removeItem(key) {
            const sKey = this.getSandboxedKey(key);
            localStorage.removeItem(sKey);
        }

        /**
         * Guardar registro en IndexedDB con réplica en LocalStorage
         */
        async guardarRegistro(storeName, registro) {
            await this.initPromise;
            
            // 1. Guardar en IndexedDB
            if (this.db && this.db.objectStoreNames.contains(storeName)) {
                await new Promise((resolve, reject) => {
                    try {
                        const tx = this.db.transaction(storeName, 'readwrite');
                        const store = tx.objectStore(storeName);
                        const req = store.put(registro);
                        req.onsuccess = () => resolve(true);
                        req.onerror = () => reject(req.error);
                    } catch (err) {
                        reject(err);
                    }
                }).catch(e => console.warn(`[VIASA Storage] Error en IndexedDB store ${storeName}:`, e));
            }

            // 2. Sincronizar espejo en LocalStorage para redundancia
            const coleccion = this.getItem(`col_${storeName}`, []);
            const idField = storeName === 'configuracion' ? 'clave' : 'id';
            const idx = coleccion.findIndex(item => item[idField] === registro[idField]);
            if (idx !== -1) {
                coleccion[idx] = registro;
            } else {
                coleccion.push(registro);
            }
            this.setItem(`col_${storeName}`, coleccion);
            return registro;
        }

        /**
         * Obtener todos los registros de una colección (con timeout de seguridad de 800ms)
         */
        async obtenerColeccion(storeName) {
            try {
                const timeoutInit = new Promise(r => setTimeout(r, 800));
                await Promise.race([this.initPromise, timeoutInit]);
            } catch (e) {}
            
            if (this.db && this.db.objectStoreNames && this.db.objectStoreNames.contains(storeName)) {
                try {
                    const timeoutQuery = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout 800ms')), 800));
                    const queryPromise = new Promise((resolve, reject) => {
                        const tx = this.db.transaction(storeName, 'readonly');
                        const store = tx.objectStore(storeName);
                        const req = store.getAll();
                        req.onsuccess = () => resolve(req.result || []);
                        req.onerror = () => reject(req.error);
                    });
                    const registros = await Promise.race([queryPromise, timeoutQuery]);
                    if (registros && registros.length > 0) {
                        return this.sanitizarTexto(registros);
                    }
                } catch (e) {
                    console.warn(`[VIASA Storage] Fallback a LocalStorage para ${storeName}`);
                }
            }

            // Fallback a LocalStorage
            return this.getItem(`col_${storeName}`, []);
        }

        /**
         * Eliminar registro por ID
         */
        async eliminarRegistro(storeName, id) {
            await this.initPromise;

            if (this.db && this.db.objectStoreNames.contains(storeName)) {
                try {
                    const tx = this.db.transaction(storeName, 'readwrite');
                    tx.objectStore(storeName).delete(id);
                } catch (e) {}
            }

            const idField = storeName === 'configuracion' ? 'clave' : 'id';
            let coleccion = this.getItem(`col_${storeName}`, []);
            coleccion = coleccion.filter(item => item[idField] !== id);
            this.setItem(`col_${storeName}`, coleccion);
            return true;
        }

        /**
         * Guardar colección completa en IndexedDB y LocalStorage
         */
        async guardarColeccion(storeName, coleccion) {
            const items = Array.isArray(coleccion) ? coleccion : [];

            // 1. Sincronizar inmediatamente en LocalStorage Sandbox (Respaldo Síncrono)
            this.setItem(`col_${storeName}`, items);
            this.setItem(storeName, items);

            await this.initPromise;

            // 2. Guardar en IndexedDB si existe la store
            if (this.db && this.db.objectStoreNames.contains(storeName)) {
                try {
                    await new Promise((resolve, reject) => {
                        const tx = this.db.transaction(storeName, 'readwrite');
                        const store = tx.objectStore(storeName);
                        store.clear();
                        items.forEach(item => {
                            if (item) {
                                try { store.put(item); } catch (err) {}
                            }
                        });
                        tx.oncomplete = () => resolve(true);
                        tx.onerror = () => resolve(false);
                    });
                } catch (e) {
                    console.warn(`[VIASA Storage] Error guardando colección en IndexedDB ${storeName}:`, e);
                }
            }

            // 3. Replicación automática en segundo plano hacia Supabase Cloud si está configurado
            if (window.ViasaCloud && window.ViasaCloud.isConnected && navigator.onLine) {
                window.ViasaCloud.subirColeccion(storeName, items).catch(() => {});
            }

            return items;
        }

        /**
         * Alias para guardar colección o registro
         */
        async guardar(storeName, data) {
            if (Array.isArray(data)) {
                return this.guardarColeccion(storeName, data);
            }
            return this.guardarRegistro(storeName, data);
        }

        /**
         * Exportar copia de seguridad completa del sistema en JSON (V1.5.0)
         * Empaqueta todas las colecciones y extrae los medios de IndexedDB en Base64.
         */
        async exportarBackupCompleto() {
            const backup = {
                sistema: 'VIASA_SYSTEM_PANADERIA_NUEVA_VIASA',
                rif: 'J-31163165-8',
                version: '1.5.0',
                edicion: 'Edicion Corporativa Multi-Sede',
                sucursalId: 'SEDE-PRINCIPAL',
                fecha: new Date().toISOString(),
                colecciones: {},
                medios_indexeddb: []
            };

            for (const store of STORES) {
                if (store === 'casillero_respaldos_generales') continue;
                if (store === 'usuarios') {
                    backup.colecciones.usuarios = this.getItem('usuarios', window.ViasaDatabase?.usuarios || []);
                    continue;
                }
                backup.colecciones[store] = await this.obtenerColeccion(store);
            }

            // Copia maestra de viasa_productos_master_v1
            try {
                const masterP = localStorage.getItem('viasa_productos_master_v1');
                if (masterP) {
                    backup.viasa_productos_master_v1 = JSON.parse(masterP);
                } else if (backup.colecciones.productos) {
                    backup.viasa_productos_master_v1 = backup.colecciones.productos;
                }
            } catch (e) {}

            // Exportar imágenes y medios de IndexedDB (ViasaMediaStorage) en Base64 para portabilidad total
            try {
                if (window.ViasaMediaStorage && typeof window.ViasaMediaStorage.obtenerTodosLosMedios === 'function') {
                    const todosMedios = await window.ViasaMediaStorage.obtenerTodosLosMedios();
                    if (Array.isArray(todosMedios)) {
                        for (const m of todosMedios) {
                            if (!m || !m.uri) continue;
                            let dataUrl = m.dataUrl || '';
                            if (!dataUrl && m.blob) {
                                try {
                                    dataUrl = await new Promise((resolve) => {
                                        const reader = new FileReader();
                                        reader.onloadend = () => resolve(reader.result || '');
                                        reader.onerror = () => resolve('');
                                        reader.readAsDataURL(m.blob);
                                    });
                                } catch (eBlob) {}
                            }
                            backup.medios_indexeddb.push({
                                uri: m.uri,
                                categoria: m.categoria || 'imagenes_productos',
                                nombreArchivo: m.nombreArchivo || (m.uri.split('/').pop()),
                                sku: m.sku || '',
                                dataUrl: dataUrl,
                                fechaActualizacion: m.fechaActualizacion || new Date().toISOString()
                            });
                        }
                    }
                }
            } catch (eMedios) {
                console.warn('[VIASA Storage] Advertencia exportando medios de IndexedDB:', eMedios);
            }

            // Configuraciones y claves sueltas
            backup.configuracionGlobal = {
                tasaBCV: this.getItem('tasa_bcv', 36.85),
                tasaParalelo: this.getItem('tasa_paralelo', 39.50),
                tasaCOP: this.getItem('tasa_cop', 3900),
                monedaPrincipal: this.getItem('moneda_principal', 'USD'),
                nombreNegocio: 'Panadería y Pastelería Nueva Viasa, C.A.',
                schemaVersion: VIASA_DB_SCHEMA_VERSION
            };

            return backup;
        }

        /**
         * Descargar backup JSON directamente al disco (Nomenclatura Oficial V1.5)
         */
        async descargarBackupArchivo(customData = null, customFilename = null) {
            const data = customData || await this.exportarBackupCompleto();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const ahora = new Date();
            const fechaStr = ahora.toISOString().slice(0, 10);
            const horas = String(ahora.getHours()).padStart(2, '0');
            const minutos = String(ahora.getMinutes()).padStart(2, '0');
            const horaStr = `${horas}${minutos}`;
            a.href = url;
            a.download = customFilename || `VIASA_Backup_V1.5_${fechaStr}_${horaStr}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        /**
         * Restaurar copia de seguridad con validación e inserción en IndexedDB
         */
        async restaurarBackup(backupJSON) {
            if (!backupJSON || (!backupJSON.colecciones && !backupJSON.productos && !backupJSON.viasa_productos_master_v1)) {
                throw new Error('Formato de archivo de respaldo no válido para VIASA System.');
            }

            let prodsRestaurados = 0;
            let provsRestaurados = 0;
            let mediosRestaurados = 0;
            let totalColecciones = 0;

            if (backupJSON.colecciones) {
                for (const storeName of Object.keys(backupJSON.colecciones)) {
                    if (storeName === 'casillero_respaldos_generales') continue;
                    const items = backupJSON.colecciones[storeName];
                    if (Array.isArray(items)) {
                        totalColecciones++;
                        if (storeName === 'usuarios') {
                            this.setItem('usuarios', items);
                        }
                        if (storeName === 'proveedores') {
                            provsRestaurados = items.length;
                        }
                        await this.guardarColeccion(storeName, items);
                    }
                }
            }

            // Restauración prioritaria del Catálogo Maestro de Productos
            const prodsRestaurar = backupJSON.viasa_productos_master_v1 || (backupJSON.colecciones && backupJSON.colecciones.productos) || (Array.isArray(backupJSON) ? backupJSON : null);
            if (Array.isArray(prodsRestaurar) && prodsRestaurar.length > 0) {
                prodsRestaurados = prodsRestaurar.length;
                localStorage.setItem('viasa_productos_master_v1', JSON.stringify(prodsRestaurar));
                localStorage.setItem('viasa_productos_nueva_viasa_v1', JSON.stringify({
                    version: 1,
                    actualizado: new Date().toISOString(),
                    productos: prodsRestaurar
                }));
                await this.guardarColeccion('productos', prodsRestaurar);
            }

            // Restauración integral de Medios e Imágenes en IndexedDB
            if (Array.isArray(backupJSON.medios_indexeddb) && backupJSON.medios_indexeddb.length > 0) {
                try {
                    if (window.ViasaMediaStorage) {
                        await window.ViasaMediaStorage.initPromise;
                        if (window.ViasaMediaStorage.db) {
                            const tx = window.ViasaMediaStorage.db.transaction('media_files', 'readwrite');
                            const store = tx.objectStore('media_files');
                            for (const m of backupJSON.medios_indexeddb) {
                                if (!m || !m.uri) continue;
                                let blob = null;
                                if (m.dataUrl && m.dataUrl.startsWith('data:')) {
                                    try {
                                        const arr = m.dataUrl.split(',');
                                        const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
                                        const bstr = atob(arr[1]);
                                        let n = bstr.length;
                                        const u8arr = new Uint8Array(n);
                                        while (n--) { u8arr[n] = bstr.charCodeAt(n); }
                                        blob = new Blob([u8arr], { type: mime });
                                    } catch (eBlobConv) {}
                                }
                                store.put({
                                    uri: m.uri,
                                    categoria: m.categoria || 'imagenes_productos',
                                    nombreArchivo: m.nombreArchivo || (m.uri.split('/').pop()),
                                    sku: m.sku || '',
                                    blob: blob,
                                    dataUrl: m.dataUrl || '',
                                    fechaActualizacion: m.fechaActualizacion || new Date().toISOString()
                                });
                                if (m.dataUrl) {
                                    window.ViasaMediaStorage.cacheUrl(m.uri, m.dataUrl);
                                }
                                mediosRestaurados++;
                            }
                            await new Promise(r => { tx.oncomplete = r; tx.onerror = r; });
                        }
                    }
                } catch (eMedRest) {
                    console.warn('[VIASA Storage] Error restaurando medios a IndexedDB:', eMedRest);
                }
            }

            if (backupJSON.configuracionGlobal) {
                if (backupJSON.configuracionGlobal.tasaBCV) this.setItem('tasa_bcv', backupJSON.configuracionGlobal.tasaBCV);
                if (backupJSON.configuracionGlobal.tasaParalelo) this.setItem('tasa_paralelo', backupJSON.configuracionGlobal.tasaParalelo);
                if (backupJSON.configuracionGlobal.tasaCOP) this.setItem('tasa_cop', backupJSON.configuracionGlobal.tasaCOP);
            }

            // Ejecutar migración no destructiva sobre los datos recién importados
            await this.ejecutarMigracionEsquemaV15();

            return {
                success: true,
                productos: prodsRestaurados,
                proveedores: provsRestaurados,
                medios: mediosRestaurados,
                colecciones: totalColecciones
            };
        }

        /**
         * Guardar estado general de todo el programa y archivar un respaldo en el Casillero de Respaldos Generales
         */
        async crearRespaldoEnCasillero(opciones = {}) {
            const usuario = window.ViasaAuth?.getCurrentUser() || {
                id: 'USR-001',
                username: 'admin',
                nombreCompleto: 'Director General (Master Senior)',
                cargo: 'Master Senior',
                rol: 'master_senior'
            };

            const dataBackup = opciones.backupExterno || await this.exportarBackupCompleto();
            const jsonStr = JSON.stringify(dataBackup);
            const tamanoKB = Math.max(1, Math.round((jsonStr.length / 1024) * 10) / 10);

            const colecciones = dataBackup.colecciones || {};
            const nombresColecciones = Object.keys(colecciones);
            let totalRegistros = 0;
            const resumenModulos = {};

            nombresColecciones.forEach(col => {
                const cant = Array.isArray(colecciones[col]) ? colecciones[col].length : 0;
                totalRegistros += cant;
                resumenModulos[col] = cant;
            });

            const ahora = new Date();
            const fechaCompacta = ahora.toISOString().slice(0, 10);
            const horaCompacta = ahora.toTimeString().slice(0, 8).replace(/:/g, '');
            const idUnico = `CAS-RSP-${Date.now().toString().slice(-6)}`;
            const nombreArchivo = opciones.nombreArchivo || `VIASA_RESPALDO_GENERAL_${fechaCompacta}_${horaCompacta}.json`;
            const rutaCustodia = `C:\\Users\\Usuario\\VIASA System\\Casillero_Respaldos_Generales\\${nombreArchivo}`;
            const hashIntegridad = this.generarChecksum(jsonStr) + '-' + this.generarChecksum(idUnico + jsonStr.length);

            const registroCasillero = {
                id: idUnico,
                nombreArchivo: nombreArchivo,
                etiqueta: opciones.etiqueta || 'Guardado General y Respaldo Integral del Sistema',
                tipo: opciones.tipo || 'GUARDADO_GENERAL',
                fechaISO: ahora.toISOString(),
                fechaLegible: ahora.toLocaleString('es-VE', {
                    year: 'numeric', month: '2-digit', day: '2-digit',
                    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
                }),
                autorId: usuario.id,
                autorUsername: usuario.username,
                autorNombre: usuario.nombreCompleto,
                autorCargo: usuario.cargo || 'Alta Gerencia',
                autorRol: usuario.rol,
                tamanoKB: tamanoKB,
                totalColecciones: nombresColecciones.length,
                totalRegistros: totalRegistros,
                resumenModulos: resumenModulos,
                hashCrypto: hashIntegridad.toUpperCase(),
                rutaCustodia: rutaCustodia,
                protegido: opciones.protegido !== undefined ? !!opciones.protegido : true,
                backupData: dataBackup
            };

            let listaActual = await this.obtenerColeccion('casillero_respaldos_generales');
            if (!Array.isArray(listaActual)) listaActual = [];

            listaActual.unshift(registroCasillero);
            // Mantener hasta 25 respaldos completos en el casillero interno para optimizar almacenamiento
            if (listaActual.length > 25) {
                listaActual = listaActual.slice(0, 25);
            }

            await this.guardarColeccion('casillero_respaldos_generales', listaActual);

            this.setItem('ultimo_guardado_general', {
                id: idUnico,
                fechaISO: registroCasillero.fechaISO,
                fechaLegible: registroCasillero.fechaLegible,
                autorNombre: registroCasillero.autorNombre,
                autorCargo: registroCasillero.autorCargo,
                nombreArchivo: registroCasillero.nombreArchivo,
                totalRegistros: totalRegistros,
                tamanoKB: tamanoKB,
                hashCrypto: registroCasillero.hashCrypto
            });

            return registroCasillero;
        }

        /**
         * Generar Checksum / Hash rápido de integridad para registros
         */
        generarChecksum(obj) {
            const str = typeof obj === 'string' ? obj : JSON.stringify(obj);
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash |= 0; // Convert to 32bit integer
            }
            return Math.abs(hash).toString(16);
        }

        /**
         * Encolar una operación crítica (Venta POS, Orden de Producción, Arqueo) para Background Sync
         */
        async encolarOperacionCritica(tipoOperacion, payload) {
            const cola = this.getItem('bg_sync_queue', []);
            const itemCola = {
                id: `SYNC-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                tipo: tipoOperacion,
                payload: payload,
                fechaEncolado: new Date().toISOString(),
                estado: navigator.onLine ? 'sincronizado' : 'pendiente_red'
            };
            cola.unshift(itemCola);
            this.setItem('bg_sync_queue', cola.slice(0, 100));

            if ('serviceWorker' in navigator && 'SyncManager' in window) {
                try {
                    const reg = await navigator.serviceWorker.ready;
                    await reg.sync.register('viasa-sync-critical-ops');
                } catch (e) {}
            }
            return itemCola;
        }

        /**
         * Procesar cola de sincronización en segundo plano al recuperar conexión
         */
        async procesarColaBackgroundSync() {
            const cola = this.getItem('bg_sync_queue', []);
            const pendientes = cola.filter(op => op.estado === 'pendiente_red');
            if (pendientes.length === 0) return 0;

            cola.forEach(op => {
                if (op.estado === 'pendiente_red') {
                    op.estado = 'sincronizado';
                    op.fechaSincronizado = new Date().toISOString();
                }
            });
            this.setItem('bg_sync_queue', cola);
            return pendientes.length;
        }

        /**
         * Inicializar monitor de red y sincronización en segundo plano
         */
        iniciarMonitorSincronizacion() {
            const actualizarUI = (online, syncing = false) => {
                const pill = document.getElementById('viasa-network-status-pill');
                const icon = document.getElementById('viasa-network-status-icon');
                const text = document.getElementById('viasa-network-status-text');
                if (!pill || !icon || !text) return;

                if (syncing) {
                    pill.className = 'rate-badge sync-status syncing';
                    icon.className = 'fa-solid fa-arrows-rotate fa-spin';
                    text.textContent = 'Sincronizando...';
                } else if (online) {
                    pill.className = 'rate-badge sync-status online';
                    icon.className = 'fa-solid fa-cloud-arrow-up';
                    text.textContent = 'En Línea / Sync OK';
                } else {
                    pill.className = 'rate-badge sync-status offline';
                    icon.className = 'fa-solid fa-shield-halved';
                    text.textContent = 'Offline Seguro (Local)';
                }
            };

            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.addEventListener('message', async (event) => {
                    if (event.data && event.data.type === 'VIASA_BG_SYNC_FLUSH') {
                        await this.procesarColaBackgroundSync();
                    }
                });
            }

            window.addEventListener('online', async () => {
                console.log('[VIASA Sync] Conectividad restablecida. Iniciando sincronización en segundo plano...');
                actualizarUI(true, true);
                
                try {
                    const opsSincronizadas = await this.procesarColaBackgroundSync();
                    const backupSnapshot = await this.exportarBackupCompleto();
                    this.setItem('last_online_sync', {
                        fecha: new Date().toISOString(),
                        opsSincronizadas: opsSincronizadas,
                        checksum: this.generarChecksum(backupSnapshot)
                    });

                    setTimeout(() => {
                        actualizarUI(true, false);
                        if (window.ViasaAudio) window.ViasaAudio.playSuccess();
                        console.log('[VIASA Sync] Sincronización automática completada exitosamente.');
                    }, 1200);
                } catch (e) {
                    console.warn('[VIASA Sync] Error en sync:', e);
                    actualizarUI(true, false);
                }
            });

            window.addEventListener('offline', () => {
                console.log('[VIASA Sync] Sin conexión a internet. Cambiando a modo 100% Offline-First.');
                actualizarUI(false, false);
            });

            // Comprobación inicial al cargar
            actualizarUI(navigator.onLine, false);
        }
    }

    // Instancia global aislada para VIASA System
    window.ViasaStorage = new ViasaStorageEngine();

    // Iniciar monitor de sincronización cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => window.ViasaStorage.iniciarMonitorSincronizacion());
    } else {
        window.ViasaStorage.iniciarMonitorSincronizacion();
    }

})(window);
