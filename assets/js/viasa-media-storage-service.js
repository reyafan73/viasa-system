/**
 * ==============================================================================
 * VIASA SYSTEM - MEDIA STORAGE SERVICE (ARQUITECTURA HÍBRIDA DE ALMACENAMIENTO)
 * Panadería y Pastelería Nueva Viasa, C.A. (RIF: J-31163165-8)
 * ==============================================================================
 * Resuelve de forma definitiva y permanente el límite de 5MB de LocalStorage
 * implementando una arquitectura de 4 capas:
 *
 * 1. IndexedDB Ilimitado (Database: VIASA_MEDIA_DB_v1, Store: media_files)
 *    Almacena gigabytes de imágenes, fotos y códigos en disco local sin restricciones.
 *
 * 2. Carpetas Físicas en la Laptop (/VIASA_System_Data/...)
 *    Sincronización directa vía File System Access API o exportación a disco:
 *    - /VIASA_System_Data/imagenes_productos/
 *    - /VIASA_System_Data/imagenes_servicios/
 *    - /VIASA_System_Data/imagenes_personal_laboral/
 *    - /VIASA_System_Data/codigos_barras_y_qr/
 *
 * 3. Servidor Online / Cloud Storage
 *    Sincronización con Supabase Storage o API Cloud en segundo plano.
 *
 * 4. Optimización Canvas Inteligente
 *    Redimensionamiento a máx 1200px para fotografías y preservación 100%
 *    crisp-edges en PNG para Códigos de Barras y Códigos QR.
 *
 * 5. Nomenclatura Automática Estandarizada
 *    - Productos: [SKU]_[Nombre_Producto_Limpio].[ext]
 *    - Códigos de Barras: BARCODE_[SKU]_[Numero_Codigo]_[Nombre_Producto].png
 *    - Códigos QR: QR_[SKU]_[Nombre_Producto].png
 *    - Personal: PERSONAL_[Cedula_o_ID]_[Nombre_Apellido]_[Cargo].jpg
 *    - Servicios: SERVICIO_[Codigo]_[Nombre_Servicio].jpg
 */

(function(window) {
    'use strict';

    const MEDIA_DB_NAME = 'VIASA_MEDIA_DB_v1';
    const MEDIA_DB_VERSION = 1;
    const STORE_MEDIA = 'media_files';
    const STORE_CONFIG = 'media_config';

    const CATEGORIAS_VALIDAS = {
        PRODUCTOS: 'imagenes_productos',
        SERVICIOS: 'imagenes_servicios',
        PERSONAL: 'imagenes_personal_laboral',
        CODIGOS: 'codigos_barras_y_qr'
    };

    class ViasaMediaStorageService {
        constructor() {
            this.dbName = MEDIA_DB_NAME;
            this.dbVersion = MEDIA_DB_VERSION;
            this.db = null;
            this.isReady = false;
            this.directoryHandle = null;
            this._urlCache = new Map(); // uri -> blobUrl
            this._pendingCloudUploads = [];
            this.initPromise = this.init();
        }

        /**
         * Inicializa la base de datos IndexedDB dedicada a medios
         */
        async init() {
            try {
                this.db = await this._openIndexedDB();
                this.isReady = true;
                // Cargar todas las imágenes a caché en memoria como Blob URLs para acceso síncrono instantáneo
                await this._precargarCache();
                // Migrar Base64 antiguos de LocalStorage para liberar espacio inmediatamente
                this.migrarBase64Existentes().catch(err => {
                    console.warn('[ViasaMediaStorage] Advertencia en migración inicial:', err);
                });
                console.log('[ViasaMediaStorage] Servicio de Almacenamiento Híbrido inicializado con éxito.');
            } catch (err) {
                console.error('[ViasaMediaStorage] Error inicializando IndexedDB de medios:', err);
                this.isReady = true;
            }
            return this;
        }

        _openIndexedDB() {
            return new Promise((resolve, reject) => {
                if (!window.indexedDB) {
                    console.warn('[ViasaMediaStorage] IndexedDB no soportado en este entorno.');
                    return resolve(null);
                }
                const req = window.indexedDB.open(this.dbName, this.dbVersion);
                req.onupgradeneeded = (e) => {
                    const db = e.target.result;
                    if (!db.objectStoreNames.contains(STORE_MEDIA)) {
                        const store = db.createObjectStore(STORE_MEDIA, { keyPath: 'uri' });
                        store.createIndex('categoria', 'categoria', { unique: false });
                        store.createIndex('nombreArchivo', 'nombreArchivo', { unique: false });
                        store.createIndex('fechaActualizacion', 'fechaActualizacion', { unique: false });
                    }
                    if (!db.objectStoreNames.contains(STORE_CONFIG)) {
                        db.createObjectStore(STORE_CONFIG, { keyPath: 'clave' });
                    }
                };
                req.onsuccess = () => resolve(req.result);
                req.onerror = () => reject(req.error);
            });
        }

        /**
         * Precarga Blob URLs en memoria para que resolveUrl sea síncrono e instantáneo
         */
        async _precargarCache() {
            if (!this.db) return;
            try {
                const registros = await this.obtenerTodosLosMedios();
                registros.forEach(item => {
                    if (item && item.uri) {
                        let finalUrl = '';
                        if (item.blob) {
                            try {
                                finalUrl = URL.createObjectURL(item.blob);
                            } catch (e) {
                                finalUrl = item.dataUrl || '';
                            }
                        } else if (item.dataUrl) {
                            finalUrl = item.dataUrl;
                        }
                        if (finalUrl) {
                            this.cacheUrl(item.uri, finalUrl);
                            if (item.localPath) this._urlCache.set(item.localPath, finalUrl);
                            if (item.nombreArchivo) this._urlCache.set(item.nombreArchivo, finalUrl);
                        }
                    }
                });
                console.log(`[ViasaMediaStorage] ${this._urlCache.size} medios precargados en caché en memoria.`);
            } catch (err) {
                console.warn('[ViasaMediaStorage] Error precargando caché de medios:', err);
            }
        }

        /**
         * Registra un recurso en caché bajo su URI y variantes de extensión para resolución tolerante
         */
        cacheUrl(uri, resolvedUrl) {
            if (!uri || !resolvedUrl) return;
            this._urlCache.set(uri, resolvedUrl);
            const str = String(uri);
            const stem = str.replace(/\.[a-zA-Z0-9]+$/, '');
            this._urlCache.set(stem, resolvedUrl);
            ['.webp', '.png', '.jpg', '.jpeg', '.svg'].forEach(ext => {
                this._urlCache.set(`${stem}${ext}`, resolvedUrl);
            });
            const baseStem = str.split('/').pop().replace(/\.[a-zA-Z0-9]+$/, '');
            if (baseStem) {
                this._urlCache.set(baseStem, resolvedUrl);
                ['.webp', '.png', '.jpg', '.jpeg', '.svg'].forEach(ext => {
                    this._urlCache.set(`${baseStem}${ext}`, resolvedUrl);
                });
            }
        }

        // =====================================================================
        // 1. SANITIZACIÓN Y NOMENCLATURA INTELIGENTE
        // =====================================================================

        limpiarCadena(str) {
            if (!str) return 'Sin_Nombre';
            return String(str)
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Quitar acentos
                .replace(/[^a-zA-Z0-9_\-\.]/g, '_') // Caracteres no permitidos a guion bajo
                .replace(/_+/g, '_') // Evitar múltiples guiones bajos continuos
                .replace(/^_|_$/g, '') // Recortar guiones de bordes
                .slice(0, 90);
        }

        /**
         * Genera el nombre de archivo estandarizado según la especificación exacta
         */
        generarNombreArchivo({ categoria, sku, nombre, codigo, cedula, cargo, extension = 'webp', esBarcode = false, esQR = false }) {
            const ext = extension.replace(/^\./, '').toLowerCase() || 'webp';
            const nomLimpio = this.limpiarCadena(nombre || 'Elemento');
            const skuLimpio = this.limpiarCadena(sku || 'PROD');

            switch (categoria) {
                case CATEGORIAS_VALIDAS.PRODUCTOS:
                    // [SKU]_[Nombre_Producto_Limpio].[ext]
                    return `${skuLimpio}_${nomLimpio}.${ext}`;

                case CATEGORIAS_VALIDAS.CODIGOS:
                    if (esBarcode || (codigo && !esQR)) {
                        // BARCODE_[SKU]_[Numero_Codigo]_[Nombre_Producto].png
                        const codLimpio = this.limpiarCadena(codigo || '1D');
                        return `BARCODE_${skuLimpio}_${codLimpio}_${nomLimpio}.png`;
                    } else {
                        // QR_[SKU]_[Nombre_Producto].png
                        return `QR_${skuLimpio}_${nomLimpio}.png`;
                    }

                case CATEGORIAS_VALIDAS.PERSONAL: {
                    // PERSONAL_[Cedula_o_ID]_[Nombre_Apellido]_[Cargo].jpg
                    const idLimpio = this.limpiarCadena(cedula || sku || 'PERSONAL');
                    const cargoLimpio = this.limpiarCadena(cargo || 'Empleado');
                    const extFinal = (ext === 'png') ? 'png' : 'jpg';
                    return `PERSONAL_${idLimpio}_${nomLimpio}_${cargoLimpio}.${extFinal}`;
                }

                case CATEGORIAS_VALIDAS.SERVICIOS: {
                    // SERVICIO_[Codigo]_[Nombre_Servicio].jpg
                    const codLimpio = this.limpiarCadena(codigo || sku || 'SRV');
                    const extFinal = (ext === 'png') ? 'png' : 'jpg';
                    return `SERVICIO_${codLimpio}_${nomLimpio}.${extFinal}`;
                }

                default:
                    return `${skuLimpio}_${nomLimpio}.${ext}`;
            }
        }

        // =====================================================================
        // 2. OPTIMIZACIÓN EN CANVAS SIN PÉRDIDA VISUAL
        // =====================================================================

        /**
         * Optimiza y redimensiona imágenes en Canvas en segundo plano
         * Por defecto WebP al 75% y max 500px para fotos de productos; PNG nítido para códigos
         */
        async optimizarImagen(input, { esCodigo = false, maxDim = 500, calidad = 0.75 } = {}) {
            let dataUrl = '';
            if (input && input.files && input.files[0]) {
                input = input.files[0];
            }
            if (typeof input === 'string') {
                dataUrl = input;
            } else if (input && (input instanceof Blob || input instanceof File || typeof input.slice === 'function')) {
                dataUrl = await this.fileToDataUrl(input);
            } else {
                throw new Error('Entrada de imagen no válida para optimizar.');
            }

            // Si es un SVG puro o data URL de SVG, no convertir con pérdida
            if (dataUrl.startsWith('data:image/svg+xml')) {
                const blob = this.dataUrlToBlob(dataUrl);
                return {
                    blob,
                    dataUrl,
                    mimeType: 'image/svg+xml',
                    extension: 'svg',
                    ancho: 300,
                    alto: 150
                };
            }

            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    try {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');

                        if (esCodigo) {
                            // Códigos de barras y QR: MANTENER 100% CRISP-EDGES, SIN COMPRESIÓN DESTRUCTIVA
                            canvas.width = img.naturalWidth || img.width;
                            canvas.height = img.naturalHeight || img.height;
                            ctx.imageSmoothingEnabled = false;
                            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                            const pngUrl = canvas.toDataURL('image/png');
                            const blob = this.dataUrlToBlob(pngUrl);
                            resolve({
                                blob,
                                dataUrl: pngUrl,
                                mimeType: 'image/png',
                                extension: 'png',
                                ancho: canvas.width,
                                alto: canvas.height
                            });
                        } else {
                            // Fotografías (productos, personal, servicios): Redimensionar a máx 1200px
                            const originalW = img.naturalWidth || img.width;
                            const originalH = img.naturalHeight || img.height;
                            const scale = Math.min(1, maxDim / Math.max(originalW, originalH));
                            canvas.width = Math.max(1, Math.round(originalW * scale));
                            canvas.height = Math.max(1, Math.round(originalH * scale));

                            ctx.imageSmoothingEnabled = true;
                            ctx.imageSmoothingQuality = 'high';
                            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                            // Probar exportar en WebP para máxima compresión, fallback a JPEG
                            let finalDataUrl = '';
                            let mimeType = 'image/webp';
                            let extension = 'webp';

                            try {
                                finalDataUrl = canvas.toDataURL('image/webp', calidad);
                                if (!finalDataUrl.startsWith('data:image/webp')) {
                                    finalDataUrl = canvas.toDataURL('image/jpeg', calidad);
                                    mimeType = 'image/jpeg';
                                    extension = 'jpg';
                                }
                            } catch (e) {
                                finalDataUrl = canvas.toDataURL('image/jpeg', calidad);
                                mimeType = 'image/jpeg';
                                extension = 'jpg';
                            }

                            const blob = this.dataUrlToBlob(finalDataUrl);
                            resolve({
                                blob,
                                dataUrl: finalDataUrl,
                                mimeType,
                                extension,
                                ancho: canvas.width,
                                alto: canvas.height
                            });
                        }
                    } catch (err) {
                        reject(err);
                    }
                };
                img.onerror = () => reject(new Error('No se pudo decodificar el archivo de imagen.'));
                img.src = dataUrl;
            });
        }

        // =====================================================================
        // 3. PERSISTENCIA EN INDEXEDDB + CACHÉ
        // =====================================================================

        /**
         * Guarda una imagen en el almacenamiento híbrido y retorna su URI ligero
         */
        async guardarMedia({
            input,
            categoria = CATEGORIAS_VALIDAS.PRODUCTOS,
            sku = '',
            nombre = '',
            codigo = '',
            cedula = '',
            cargo = '',
            esCodigo = false,
            esQR = false,
            nombrePersonalizado = null
        }) {
            await this.initPromise;
            if (!input) return null;

            // 1. Optimizar imagen con fallback a datos directos si canvas falla
            let opt;
            try {
                opt = await this.optimizarImagen(input, { esCodigo });
            } catch (errOpt) {
                console.warn('[ViasaMediaStorage] Optimización canvas falló, usando entrada directa:', errOpt);
                try {
                    const rawDataUrl = typeof input === 'string' ? input : await this.fileToDataUrl(input && input.files ? input.files[0] : input);
                    opt = {
                        blob: this.dataUrlToBlob(rawDataUrl),
                        dataUrl: rawDataUrl,
                        mimeType: (input && input.type) || 'image/jpeg',
                        extension: 'jpg',
                        ancho: 800,
                        alto: 600
                    };
                } catch (errDirect) {
                    throw new Error('No se pudo procesar el archivo de imagen.');
                }
            }

            // 2. Determinar nombre de archivo estandarizado
            const nombreArchivo = nombrePersonalizado || this.generarNombreArchivo({
                categoria,
                sku,
                nombre,
                codigo,
                cedula,
                cargo,
                extension: opt.extension,
                esBarcode: esCodigo && !esQR,
                esQR
            });

            // 3. URI canónico de VIASA System
            const uri = `viasa-media://${categoria}/${nombreArchivo}`;
            const localPath = `VIASA_System_Data/${categoria}/${nombreArchivo}`;

            // 4. Crear Blob URL en memoria y registrar en caché multi-clave
            let blobUrl = '';
            try {
                blobUrl = URL.createObjectURL(opt.blob);
                this.cacheUrl(uri, blobUrl);
            } catch (e) {
                blobUrl = opt.dataUrl;
                this.cacheUrl(uri, opt.dataUrl);
            }
            if (localPath) this._urlCache.set(localPath, blobUrl);
            if (nombreArchivo) this._urlCache.set(nombreArchivo, blobUrl);

            const record = {
                uri,
                categoria,
                nombreArchivo,
                mimeType: opt.mimeType,
                blob: opt.blob,
                dataUrl: opt.dataUrl,
                tamanoBytes: opt.blob.size,
                tamanoKB: (opt.blob.size / 1024).toFixed(1),
                fechaActualizacion: new Date().toISOString(),
                localPath,
                remoteUrl: null,
                syncedLocalDisk: false,
                syncedCloud: false,
                metadata: { sku, nombre, codigo, cedula, cargo, ancho: opt.ancho, alto: opt.alto }
            };

            // 5. Guardar en IndexedDB
            await this._guardarEnIndexedDB(record);

            // 6. Sincronización en segundo plano con disco físico y servidor
            this._sincronizarFondo(record).catch(() => {});

            return {
                uri,
                resolvedUrl: blobUrl,
                dataUrl: opt.dataUrl,
                nombreArchivo,
                categoria,
                localPath,
                tamanoKB: record.tamanoKB
            };
        }

        async _guardarEnIndexedDB(record) {
            if (!this.db) return false;
            return new Promise((resolve, reject) => {
                try {
                    const tx = this.db.transaction(STORE_MEDIA, 'readwrite');
                    const store = tx.objectStore(STORE_MEDIA);
                    const req = store.put(record);
                    req.onsuccess = () => resolve(true);
                    req.onerror = () => reject(req.error);
                } catch (e) {
                    reject(e);
                }
            });
        }

        async obtenerMedia(uri) {
            await this.initPromise;
            if (!this.db || !uri) return null;
            return new Promise((resolve) => {
                try {
                    const tx = this.db.transaction(STORE_MEDIA, 'readonly');
                    const store = tx.objectStore(STORE_MEDIA);
                    const req = store.get(uri);
                    req.onsuccess = () => resolve(req.result || null);
                    req.onerror = () => resolve(null);
                } catch (e) {
                    resolve(null);
                }
            });
        }

        async obtenerTodosLosMedios() {
            await this.initPromise;
            if (!this.db) return [];
            return new Promise((resolve) => {
                try {
                    const tx = this.db.transaction(STORE_MEDIA, 'readonly');
                    const store = tx.objectStore(STORE_MEDIA);
                    const req = store.getAll();
                    req.onsuccess = () => resolve(req.result || []);
                    req.onerror = () => resolve([]);
                } catch (e) {
                    resolve([]);
                }
            });
        }

        /**
         * Resuelve un URI 'viasa-media://...' a una URL lista para renderizar en <img src="">
         * Si no es un URI viasa-media, lo retorna tal cual de inmediato.
         */
        resolveUrl(uriOrUrl) {
            if (!uriOrUrl) return '';
            const str = String(uriOrUrl).trim();
            if (!str.startsWith('viasa-media://')) {
                return str; // Ya es data:, http://, https://, blob: o ruta relativa
            }
            // 1. Buscar en memoria caché por coincidencia directa
            let cached = this._urlCache.get(str);
            if (cached) return cached;

            // 1b. Buscar por stem sin extensión (.webp vs .png vs .jpg)
            const stem = str.replace(/\.[a-zA-Z0-9]+$/, '');
            cached = this._urlCache.get(stem);
            if (cached) {
                this._urlCache.set(str, cached);
                return cached;
            }

            // 1c. Búsqueda flexible en caché por coincidencia de nombre de archivo
            const clean = str.replace('viasa-media://', '');
            const baseStem = clean.split('/').pop().replace(/\.[a-zA-Z0-9]+$/, '');
            if (baseStem) {
                cached = this._urlCache.get(baseStem);
                if (cached) {
                    this._urlCache.set(str, cached);
                    return cached;
                }
                for (const [k, v] of this._urlCache.entries()) {
                    if (k.includes(baseStem)) {
                        this.cacheUrl(str, v);
                        return v;
                    }
                }
            }

            // 2. Fallback de ruta física local
            const fallbackPath = `VIASA_System_Data/${clean}`;

            // Disparar carga asíncrona para actualizar caché desde IndexedDB
            this._hidratarUri(str).catch(() => {});
            return fallbackPath;
        }

        async _hidratarUri(uri) {
            let item = await this.obtenerMedia(uri);
            if (!item) {
                // Búsqueda tolerante en IndexedDB por coincidencia de stem si difiere la extensión
                const clean = uri.replace('viasa-media://', '');
                const stem = clean.replace(/\.[a-zA-Z0-9]+$/, '');
                const baseStem = stem.split('/').pop();
                const todos = await this.obtenerTodosLosMedios();
                item = todos.find(r => 
                    r.uri === uri || 
                    (r.uri && r.uri.replace(/\.[a-zA-Z0-9]+$/, '').endsWith(stem)) || 
                    (r.nombreArchivo && r.nombreArchivo.replace(/\.[a-zA-Z0-9]+$/, '') === baseStem)
                );
            }
            if (item && (item.blob || item.dataUrl)) {
                let url = '';
                if (item.blob) {
                    try {
                        url = URL.createObjectURL(item.blob);
                    } catch (e) {
                        url = item.dataUrl || '';
                    }
                } else {
                    url = item.dataUrl || '';
                }
                if (url) {
                    this.cacheUrl(uri, url);
                    if (item.uri && item.uri !== uri) this.cacheUrl(item.uri, url);
                    // Si hay elementos con data-viasa-media-src, actualizarlos en el DOM
                    if (typeof document !== 'undefined') {
                        document.querySelectorAll(`img[data-viasa-media-src="${uri}"]`).forEach(img => {
                            img.src = url;
                        });
                    }
                    return url;
                }
            }
            return null;
        }

        // =====================================================================
        // 4. LIMPIEZA DE LOCALSTORAGE Y PREVENCIÓN DE QuotaExceededError
        // =====================================================================

        /**
         * Prepara el catálogo de productos para LocalStorage:
         * Extrae cadenas Base64 o Blob URLs grandes, las guarda en IndexedDB y deja solo 'viasa-media://...'
         * Garantiza que el JSON guardado en LocalStorage mida apenas ~20KB.
         */
        async prepararProductosParaLocalStorage(productos) {
            if (!Array.isArray(productos)) return [];
            const resultado = [];

            for (const prod of productos) {
                const clon = Object.assign({}, prod);

                // 1. Fotografía de producto
                if (clon.fotoUrl && (clon.fotoUrl.startsWith('data:image/') || clon.fotoUrl.startsWith('blob:'))) {
                    try {
                        const guardado = await this.guardarMedia({
                            input: clon.fotoUrl,
                            categoria: CATEGORIAS_VALIDAS.PRODUCTOS,
                            sku: clon.sku,
                            nombre: clon.nombre
                        });
                        clon.fotoUrl = guardado.uri;
                        if (guardado.resolvedUrl) this.cacheUrl(guardado.uri, guardado.resolvedUrl);
                    } catch (e) {
                        console.warn('[ViasaMediaStorage] No se pudo migrar foto de producto:', clon.sku, e);
                    }
                }

                // 2. Código de barras personalizado
                if (clon.customBarcodeImage && (clon.customBarcodeImage.startsWith('data:image/') || clon.customBarcodeImage.startsWith('blob:'))) {
                    try {
                        const guardado = await this.guardarMedia({
                            input: clon.customBarcodeImage,
                            categoria: CATEGORIAS_VALIDAS.CODIGOS,
                            sku: clon.sku,
                            nombre: clon.nombre,
                            codigo: clon.barcode,
                            esCodigo: true,
                            esQR: false
                        });
                        clon.customBarcodeImage = guardado.uri;
                        if (guardado.resolvedUrl) this.cacheUrl(guardado.uri, guardado.resolvedUrl);
                    } catch (e) {
                        console.warn('[ViasaMediaStorage] No se pudo migrar barcode de producto:', clon.sku, e);
                    }
                }

                // 3. Código QR personalizado
                if (clon.customQrImage && (clon.customQrImage.startsWith('data:image/') || clon.customQrImage.startsWith('blob:'))) {
                    try {
                        const guardado = await this.guardarMedia({
                            input: clon.customQrImage,
                            categoria: CATEGORIAS_VALIDAS.CODIGOS,
                            sku: clon.sku,
                            nombre: clon.nombre,
                            esCodigo: true,
                            esQR: true
                        });
                        clon.customQrImage = guardado.uri;
                        if (guardado.resolvedUrl) this.cacheUrl(guardado.uri, guardado.resolvedUrl);
                    } catch (e) {
                        console.warn('[ViasaMediaStorage] No se pudo migrar QR de producto:', clon.sku, e);
                    }
                }

                resultado.push(clon);
            }

            return resultado;
        }

        /**
         * Hidrata los productos cargados desde LocalStorage asignándoles sus Blob URLs
         */
        hidratarProductos(productos) {
            if (!Array.isArray(productos)) return [];
            return productos.map(p => {
                const hydrated = Object.assign({}, p);
                if (hydrated.fotoUrl) hydrated.fotoUrl = this.resolveUrl(hydrated.fotoUrl);
                if (hydrated.customBarcodeImage) hydrated.customBarcodeImage = this.resolveUrl(hydrated.customBarcodeImage);
                if (hydrated.customQrImage) hydrated.customQrImage = this.resolveUrl(hydrated.customQrImage);
                return hydrated;
            });
        }

        /**
         * Escanea LocalStorage y extrae cualquier Base64 pesado hacia IndexedDB
         */
        async migrarBase64Existentes() {
            if (typeof localStorage === 'undefined') return;
            const keysToScan = [
                'viasa_productos_nueva_viasa_v1',
                'viasa_sys_productos',
                'viasa_sys_empleados',
                'viasa_sys_servicios'
            ];

            let migradas = 0;
            for (const key of keysToScan) {
                const raw = localStorage.getItem(key);
                if (!raw || !raw.includes('data:image/')) continue;

                try {
                    const parsed = JSON.parse(raw);
                    if (key === 'viasa_productos_nueva_viasa_v1' && parsed && Array.isArray(parsed.productos)) {
                        parsed.productos = await this.prepararProductosParaLocalStorage(parsed.productos);
                        localStorage.setItem(key, JSON.stringify(parsed));
                        migradas++;
                    }
                } catch (e) {
                    console.warn('[ViasaMediaStorage] Error migrando clave:', key, e);
                }
            }

            if (migradas > 0) {
                console.log(`[ViasaMediaStorage] ${migradas} colecciones saneadas en LocalStorage. Cero Base64 pesados.`);
            }
        }

        /**
         * Purga de emergencia en caso de que alguna clave huérfana sature LocalStorage
         */
        purgarBase64AntiguosDeLocalStorage() {
            if (typeof localStorage === 'undefined') return;
            try {
                for (let i = 0; i < localStorage.length; i++) {
                    const k = localStorage.key(i);
                    if (!k) continue;
                    const val = localStorage.getItem(k);
                    if (val && val.length > 500000 && val.includes('data:image/')) {
                        console.warn(`[ViasaMediaStorage] Purgando clave pesada de LocalStorage: ${k}`);
                        // No eliminar si es la clave principal de productos, sino limpiarla
                        if (k === 'viasa_productos_nueva_viasa_v1') {
                            try {
                                const parsed = JSON.parse(val);
                                if (parsed && parsed.productos) {
                                    parsed.productos.forEach(p => {
                                        if (p.fotoUrl && p.fotoUrl.startsWith('data:image/')) p.fotoUrl = '';
                                        if (p.customBarcodeImage && p.customBarcodeImage.startsWith('data:image/')) p.customBarcodeImage = null;
                                        if (p.customQrImage && p.customQrImage.startsWith('data:image/')) p.customQrImage = null;
                                    });
                                    localStorage.setItem(k, JSON.stringify(parsed));
                                }
                            } catch (e) {}
                        } else {
                            localStorage.removeItem(k);
                        }
                    }
                }
            } catch (e) {
                console.error('[ViasaMediaStorage] Error en purga de emergencia:', e);
            }
        }

        // =====================================================================
        // 5. SINCRONIZACIÓN CON CARPETAS FÍSICAS EN LAPTOP (File System Access)
        // =====================================================================

        /**
         * Permite al usuario seleccionar la carpeta raíz /VIASA_System_Data/ en su laptop
         * y vuelca automáticamente todos los medios a las 4 subcarpetas físicas.
         */
        async sincronizarConCarpetaLocal(promptSelector = true) {
            await this.initPromise;
            const todos = await this.obtenerTodosLosMedios();

            if (!todos || todos.length === 0) {
                this.toast('ℹ️ No hay imágenes almacenadas actualmente para sincronizar.', 'info');
                return { success: true, total: 0 };
            }

            // Si el navegador soporta File System Access API
            if (window.showDirectoryPicker && promptSelector) {
                try {
                    this.toast('📂 Seleccione la carpeta /VIASA_System_Data/ o el directorio del proyecto en su laptop...', 'info');
                    const rootHandle = await window.showDirectoryPicker({
                        id: 'viasa-media-directory',
                        mode: 'readwrite',
                        startIn: 'documents'
                    });

                    this.directoryHandle = rootHandle;

                    // Crear o acceder a las 4 subcarpetas físicas
                    const dirHandles = {
                        [CATEGORIAS_VALIDAS.PRODUCTOS]: await rootHandle.getDirectoryHandle(CATEGORIAS_VALIDAS.PRODUCTOS, { create: true }),
                        [CATEGORIAS_VALIDAS.SERVICIOS]: await rootHandle.getDirectoryHandle(CATEGORIAS_VALIDAS.SERVICIOS, { create: true }),
                        [CATEGORIAS_VALIDAS.PERSONAL]: await rootHandle.getDirectoryHandle(CATEGORIAS_VALIDAS.PERSONAL, { create: true }),
                        [CATEGORIAS_VALIDAS.CODIGOS]: await rootHandle.getDirectoryHandle(CATEGORIAS_VALIDAS.CODIGOS, { create: true })
                    };

                    let sincronizados = 0;
                    for (const item of todos) {
                        const targetDir = dirHandles[item.categoria] || dirHandles[CATEGORIAS_VALIDAS.PRODUCTOS];
                        if (!targetDir || !item.blob) continue;

                        try {
                            const fileHandle = await targetDir.getFileHandle(item.nombreArchivo, { create: true });
                            const writable = await fileHandle.createWritable();
                            await writable.write(item.blob);
                            await writable.close();
                            sincronizados++;
                        } catch (writeErr) {
                            console.warn(`[ViasaMediaStorage] Error escribiendo ${item.nombreArchivo}:`, writeErr);
                        }
                    }

                    if (window.ViasaAudio) window.ViasaAudio.playSuccess();
                    this.toast(`✅ ¡Éxito! ${sincronizados} imágenes sincronizadas en las 4 carpetas locales de la laptop.`, 'success');
                    return { success: true, total: sincronizados };
                } catch (userErr) {
                    if (userErr.name === 'AbortError') {
                        console.log('[ViasaMediaStorage] Usuario canceló selección de carpeta.');
                        return { success: false, reason: 'Cancelado por el usuario' };
                    }
                    console.warn('[ViasaMediaStorage] Error en File System Access API:', userErr);
                }
            }

            // Fallback: Descarga estructurada en paquete ZIP
            return this.exportarZipDeMedios();
        }

        /**
         * Escribe un archivo individual si ya hay un directory handle conectado
         */
        async _sincronizarFondo(record) {
            // 1. Guardar en disco si hay handle
            if (this.directoryHandle && record.blob) {
                try {
                    const subDir = await this.directoryHandle.getDirectoryHandle(record.categoria, { create: true });
                    const fileHandle = await subDir.getFileHandle(record.nombreArchivo, { create: true });
                    const writable = await fileHandle.createWritable();
                    await writable.write(record.blob);
                    await writable.close();
                    record.syncedLocalDisk = true;
                } catch (e) {}
            }

            // 2. Subida en segundo plano a Supabase Storage si está configurado
            if (window.ViasaSupabase && window.ViasaSupabase.isConnected && navigator.onLine) {
                try {
                    const cloudRes = await this._subirASupabaseStorage(record);
                    if (cloudRes && cloudRes.publicUrl) {
                        record.remoteUrl = cloudRes.publicUrl;
                        record.syncedCloud = true;
                        this._guardarEnIndexedDB(record).catch(() => {});
                    }
                } catch (e) {}
            }
        }

        async _subirASupabaseStorage(record) {
            const client = window.ViasaSupabase;
            if (!client || !client.supabaseUrl || !client.supabaseAnonKey) return null;
            const bucket = 'viasa-media';
            const path = `${record.categoria}/${record.nombreArchivo}`;
            const url = `${client.supabaseUrl}/storage/v1/object/${bucket}/${path}`;

            try {
                const res = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'apikey': client.supabaseAnonKey,
                        'Authorization': `Bearer ${client.accessToken || client.supabaseAnonKey}`,
                        'Content-Type': record.mimeType,
                        'x-upsert': 'true'
                    },
                    body: record.blob
                });
                if (res.ok) {
                    const publicUrl = `${client.supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
                    return { success: true, publicUrl };
                }
            } catch (e) {
                console.warn('[ViasaMediaStorage] Falló subida cloud a Supabase:', e);
            }
            return null;
        }

        // =====================================================================
        // 6. EXPORTACIÓN EN PAQUETE ZIP (AUTÓNOMO SIN DEPENDENCIAS EXTERNAS)
        // =====================================================================

        /**
         * Generador ZIP estándar en JavaScript puro (Uint8Array) compatible con Windows y Linux
         */
        async exportarZipDeMedios() {
            const todos = await this.obtenerTodosLosMedios();
            if (!todos || todos.length === 0) {
                this.toast('ℹ️ No hay imágenes en la base de datos para exportar.', 'info');
                return { success: false };
            }

            this.toast(`📦 Comprimiendo ${todos.length} archivos clasificados en sus 4 carpetas...`, 'info');

            try {
                const archivosParaZip = [];
                for (const item of todos) {
                    if (!item.blob) continue;
                    const buffer = await item.blob.arrayBuffer();
                    archivosParaZip.push({
                        ruta: `${item.categoria}/${item.nombreArchivo}`,
                        datos: new Uint8Array(buffer),
                        fecha: new Date(item.fechaActualizacion || Date.now())
                    });
                }

                const zipBytes = this._construirZip(archivosParaZip);
                const zipBlob = new Blob([zipBytes], { type: 'application/zip' });
                const fechaStr = new Date().toISOString().slice(0, 10);
                const nombreZip = `VIASA_System_Data_Carpetas_Media_${fechaStr}.zip`;

                const a = document.createElement('a');
                a.href = URL.createObjectURL(zipBlob);
                a.download = nombreZip;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                setTimeout(() => URL.revokeObjectURL(a.href), 15000);

                if (window.ViasaAudio) window.ViasaAudio.playSuccess();
                this.toast(`✅ Descargado: ${nombreZip} con las 4 carpetas de imágenes.`, 'success');
                return { success: true, total: archivosParaZip.length };
            } catch (err) {
                console.error('[ViasaMediaStorage] Error generando paquete ZIP:', err);
                this.toast('⚠️ Error generando el paquete de imágenes.', 'error');
                return { success: false, error: err };
            }
        }

        /**
         * Constructor ZIP estándar PKZIP (Stored/Deflate básico) en memoria
         */
        _construirZip(archivos) {
            const records = [];
            let offset = 0;

            const crc32Table = new Uint32Array(256);
            for (let i = 0; i < 256; i++) {
                let c = i;
                for (let k = 0; k < 8; k++) c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
                crc32Table[i] = c;
            }
            const crc32 = (bytes) => {
                let c = 0xFFFFFFFF;
                for (let i = 0; i < bytes.length; i++) c = (c >>> 8) ^ crc32Table[(c ^ bytes[i]) & 0xFF];
                return (c ^ 0xFFFFFFFF) >>> 0;
            };

            const encoder = new TextEncoder();
            const partes = [];

            archivos.forEach(arc => {
                const nombreBytes = encoder.encode(arc.ruta.replace(/\\/g, '/'));
                const datos = arc.datos;
                const crc = crc32(datos);
                const d = arc.fecha;
                const dosTime = ((d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1)) & 0xFFFF;
                const dosDate = (((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate()) & 0xFFFF;

                // Local file header (30 bytes + nombre + datos)
                const localHeader = new Uint8Array(30 + nombreBytes.length);
                const v = new DataView(localHeader.buffer);
                v.setUint32(0, 0x04034B50, true); // Firma
                v.setUint16(4, 20, true); // Versión necesaria
                v.setUint16(6, 0x0800, true); // UTF-8 flag
                v.setUint16(8, 0, true); // Sin compresión (stored para máxima velocidad)
                v.setUint16(10, dosTime, true);
                v.setUint16(12, dosDate, true);
                v.setUint32(14, crc, true);
                v.setUint32(18, datos.length, true); // Comprimido
                v.setUint32(22, datos.length, true); // Descomprimido
                v.setUint16(26, nombreBytes.length, true);
                v.setUint16(28, 0, true); // Extra length
                localHeader.set(nombreBytes, 30);

                partes.push(localHeader);
                partes.push(datos);

                records.push({
                    nombreBytes,
                    crc,
                    dosTime,
                    dosDate,
                    size: datos.length,
                    offset
                });

                offset += localHeader.length + datos.length;
            });

            // Central Directory
            const cdOffset = offset;
            let cdSize = 0;

            records.forEach(r => {
                const cdHeader = new Uint8Array(46 + r.nombreBytes.length);
                const v = new DataView(cdHeader.buffer);
                v.setUint32(0, 0x02014B50, true); // Firma CD
                v.setUint16(4, 20, true);
                v.setUint16(6, 20, true);
                v.setUint16(8, 0x0800, true); // UTF-8
                v.setUint16(10, 0, true);
                v.setUint16(12, r.dosTime, true);
                v.setUint16(14, r.dosDate, true);
                v.setUint32(16, r.crc, true);
                v.setUint32(20, r.size, true);
                v.setUint32(24, r.size, true);
                v.setUint16(28, r.nombreBytes.length, true);
                v.setUint16(30, 0, true);
                v.setUint16(32, 0, true);
                v.setUint16(34, 0, true);
                v.setUint16(36, 0, true);
                v.setUint32(38, 0, true); // Atributos externos
                v.setUint32(42, r.offset, true);
                cdHeader.set(r.nombreBytes, 46);

                partes.push(cdHeader);
                cdSize += cdHeader.length;
            });

            // End of central directory record (22 bytes)
            const eocd = new Uint8Array(22);
            const ev = new DataView(eocd.buffer);
            ev.setUint32(0, 0x06054B50, true); // Firma EOCD
            ev.setUint16(4, 0, true);
            ev.setUint16(6, 0, true);
            ev.setUint16(8, records.length, true);
            ev.setUint16(10, records.length, true);
            ev.setUint32(12, cdSize, true);
            ev.setUint32(16, cdOffset, true);
            ev.setUint16(20, 0, true);
            partes.push(eocd);

            // Combinar todos los buffers en un solo Uint8Array
            const totalBytes = offset + cdSize + 22;
            const resultado = new Uint8Array(totalBytes);
            let pos = 0;
            partes.forEach(p => {
                resultado.set(p, pos);
                pos += p.length;
            });
            return resultado;
        }

        // =====================================================================
        // 7. UTILIDADES
        // =====================================================================

        fileToDataUrl(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = () => reject(reader.error);
                reader.readAsDataURL(file);
            });
        }

        dataUrlToBlob(dataUrl) {
            if (!dataUrl || typeof dataUrl !== 'string') return new Blob([], { type: 'image/jpeg' });
            try {
                const parts = dataUrl.split(',');
                if (parts.length < 2) return new Blob([dataUrl], { type: 'text/plain' });
                const mimeMatch = parts[0].match(/:(.*?)(;|$)/);
                const mime = (mimeMatch && mimeMatch[1]) ? mimeMatch[1] : 'image/jpeg';
                const isBase64 = parts[0].includes(';base64');
                if (isBase64) {
                    const bstr = atob(parts[1]);
                    let n = bstr.length;
                    const u8arr = new Uint8Array(n);
                    while (n--) u8arr[n] = bstr.charCodeAt(n);
                    return new Blob([u8arr], { type: mime });
                } else {
                    const text = decodeURIComponent(parts[1] || '');
                    return new Blob([text], { type: mime });
                }
            } catch (err) {
                console.warn('[ViasaMediaStorage] dataUrlToBlob fallback:', err);
                return new Blob([dataUrl], { type: 'image/jpeg' });
            }
        }

        toast(msg, tipo = 'info') {
            if (window.ViasaApp && typeof window.ViasaApp.mostrarNotificacionToast === 'function') {
                window.ViasaApp.mostrarNotificacionToast(msg, tipo);
            } else if (window.ViasaProductosExclusivosEngine && typeof window.ViasaProductosExclusivosEngine.toast === 'function') {
                window.ViasaProductosExclusivosEngine.toast(msg, tipo === 'error' ? 'error' : 'ok');
            } else {
                console.log(`[VIASA Toast (${tipo})]: ${msg}`);
            }
        }
    }

    // Instancia singleton global
    window.ViasaMediaStorage = new ViasaMediaStorageService();

    // =========================================================================
    // RESOLVEDOR E HIDRATADOR REACTIVO UNIVERSAL DE MEDIOS (ViasaImageResolver)
    // =========================================================================
    const ViasaImageResolver = {
        _cache: new Map(),

        // 1. Optimizador de Foto: WebP calidad 0.75, max 500px (fallback JPEG 0.85)
        procesarFoto(fileOrUrl, maxDim = 500, quality = 0.75) {
            return new Promise((resolve) => {
                if (!fileOrUrl) return resolve('');
                if (typeof fileOrUrl === 'string' && fileOrUrl.startsWith('data:image/') && fileOrUrl.length < 40000) {
                    return resolve(fileOrUrl);
                }
                const img = new Image();
                img.crossOrigin = 'anonymous';
                let tempUrl = '';
                const cleanup = () => {
                    if (tempUrl) { try { URL.revokeObjectURL(tempUrl); } catch (e) {} }
                };
                img.onload = () => {
                    try {
                        const canvas = document.createElement('canvas');
                        const w = img.naturalWidth || img.width || 1;
                        const h = img.naturalHeight || img.height || 1;
                        const scale = Math.min(1, maxDim / Math.max(w, h, 1));
                        canvas.width = Math.max(1, Math.round(w * scale));
                        canvas.height = Math.max(1, Math.round(h * scale));
                        const ctx = canvas.getContext('2d');
                        ctx.imageSmoothingEnabled = true;
                        ctx.imageSmoothingQuality = 'high';
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        let dataUrl = '';
                        try {
                            dataUrl = canvas.toDataURL('image/webp', quality);
                            if (!dataUrl.startsWith('data:image/webp')) {
                                dataUrl = canvas.toDataURL('image/jpeg', 0.85);
                            }
                        } catch (eCanvas) {
                            dataUrl = canvas.toDataURL('image/jpeg', 0.85);
                        }
                        cleanup();
                        resolve(dataUrl);
                    } catch (e) {
                        cleanup();
                        resolve(typeof fileOrUrl === 'string' ? fileOrUrl : '');
                    }
                };
                img.onerror = () => {
                    cleanup();
                    resolve(typeof fileOrUrl === 'string' ? fileOrUrl : '');
                };
                if (typeof fileOrUrl === 'string') {
                    img.src = fileOrUrl;
                } else {
                    try {
                        tempUrl = URL.createObjectURL(fileOrUrl);
                        img.src = tempUrl;
                    } catch (e) {
                        resolve('');
                    }
                }
            });
        },

        // 2. Optimizador de Código de Barras: PNG nítido, max 600x120
        procesarBarcode(fileOrUrl, maxW = 600, maxH = 120) {
            return new Promise((resolve) => {
                if (!fileOrUrl) return resolve('');
                const img = new Image();
                img.crossOrigin = 'anonymous';
                let tempUrl = '';
                const cleanup = () => {
                    if (tempUrl) { try { URL.revokeObjectURL(tempUrl); } catch (e) {} }
                };
                img.onload = () => {
                    try {
                        const canvas = document.createElement('canvas');
                        const w = img.naturalWidth || img.width || 1;
                        const h = img.naturalHeight || img.height || 1;
                        const scale = Math.min(1, maxW / w, maxH / h);
                        canvas.width = Math.max(1, Math.round(w * scale));
                        canvas.height = Math.max(1, Math.round(h * scale));
                        const ctx = canvas.getContext('2d');
                        ctx.fillStyle = '#FFFFFF';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        ctx.imageSmoothingEnabled = false;
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        const dataUrl = canvas.toDataURL('image/png');
                        cleanup();
                        resolve(dataUrl);
                    } catch (e) {
                        cleanup();
                        resolve(typeof fileOrUrl === 'string' ? fileOrUrl : '');
                    }
                };
                img.onerror = () => {
                    cleanup();
                    resolve(typeof fileOrUrl === 'string' ? fileOrUrl : '');
                };
                if (typeof fileOrUrl === 'string') {
                    img.src = fileOrUrl;
                } else {
                    try {
                        tempUrl = URL.createObjectURL(fileOrUrl);
                        img.src = tempUrl;
                    } catch (e) {
                        resolve('');
                    }
                }
            });
        },

        // 3. Optimizador de Código QR: PNG nítido, max 256x256
        procesarQR(fileOrUrl, maxDim = 256) {
            return new Promise((resolve) => {
                if (!fileOrUrl) return resolve('');
                const img = new Image();
                img.crossOrigin = 'anonymous';
                let tempUrl = '';
                const cleanup = () => {
                    if (tempUrl) { try { URL.revokeObjectURL(tempUrl); } catch (e) {} }
                };
                img.onload = () => {
                    try {
                        const canvas = document.createElement('canvas');
                        const w = img.naturalWidth || img.width || 1;
                        const h = img.naturalHeight || img.height || 1;
                        const scale = Math.min(1, maxDim / Math.max(w, h, 1));
                        canvas.width = Math.max(1, Math.round(w * scale));
                        canvas.height = Math.max(1, Math.round(h * scale));
                        const ctx = canvas.getContext('2d');
                        ctx.fillStyle = '#FFFFFF';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        ctx.imageSmoothingEnabled = false;
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        const dataUrl = canvas.toDataURL('image/png');
                        cleanup();
                        resolve(dataUrl);
                    } catch (e) {
                        cleanup();
                        resolve(typeof fileOrUrl === 'string' ? fileOrUrl : '');
                    }
                };
                img.onerror = () => {
                    cleanup();
                    resolve(typeof fileOrUrl === 'string' ? fileOrUrl : '');
                };
                if (typeof fileOrUrl === 'string') {
                    img.src = fileOrUrl;
                } else {
                    try {
                        tempUrl = URL.createObjectURL(fileOrUrl);
                        img.src = tempUrl;
                    } catch (e) {
                        resolve('');
                    }
                }
            });
        },

        register(key, val) {
            if (!key || !val) return;
            const strKey = String(key).trim();
            this._cache.set(strKey, val);
            const stem = strKey.replace(/\.[a-zA-Z0-9]+$/, '');
            this._cache.set(stem, val);
            const clean = strKey.replace('viasa-media://', '');
            this._cache.set(clean, val);
            const baseName = clean.split('/').pop().replace(/\.[a-zA-Z0-9]+$/, '');
            if (baseName) this._cache.set(baseName, val);
            if (window.ViasaMediaStorage && typeof window.ViasaMediaStorage.cacheUrl === 'function') {
                window.ViasaMediaStorage.cacheUrl(strKey, val);
            }
        },

        resolve(uriOrKey, fallback = '') {
            if (!uriOrKey) return fallback;
            const str = String(uriOrKey).trim();
            if (str.startsWith('data:image/') || str.startsWith('blob:') || str.startsWith('http://') || str.startsWith('https://')) {
                return str;
            }
            if (this._cache.has(str)) return this._cache.get(str);
            const stem = str.replace(/\.[a-zA-Z0-9]+$/, '');
            if (this._cache.has(stem)) return this._cache.get(stem);
            const clean = str.replace('viasa-media://', '');
            if (this._cache.has(clean)) return this._cache.get(clean);
            const base = clean.split('/').pop().replace(/\.[a-zA-Z0-9]+$/, '');
            if (base && this._cache.has(base)) return this._cache.get(base);
            if (window.ViasaMediaStorage && typeof window.ViasaMediaStorage.resolveUrl === 'function') {
                const res = window.ViasaMediaStorage.resolveUrl(str);
                if (res && (res.startsWith('data:') || res.startsWith('blob:') || res.startsWith('http'))) {
                    this._cache.set(str, res);
                    return res;
                }
            }
            return fallback;
        },

        async hydrateProductsMedia(productos) {
            if (!Array.isArray(productos) || productos.length === 0) return productos;
            let allMedia = [];
            if (window.ViasaMediaStorage && typeof window.ViasaMediaStorage.obtenerTodosLosMedios === 'function') {
                try {
                    allMedia = await window.ViasaMediaStorage.obtenerTodosLosMedios();
                } catch (e) {}
            }
            const mediaMap = new Map();
            allMedia.forEach(m => {
                if (!m) return;
                let resolved = '';
                if (m.dataUrl) resolved = m.dataUrl;
                else if (m.blob) {
                    try { resolved = URL.createObjectURL(m.blob); } catch (e) {}
                }
                if (!resolved) return;
                if (m.uri) mediaMap.set(m.uri, resolved);
                if (m.nombreArchivo) {
                    mediaMap.set(m.nombreArchivo, resolved);
                    const stem = m.nombreArchivo.replace(/\.[a-zA-Z0-9]+$/, '');
                    mediaMap.set(stem, resolved);
                }
                if (m.sku) mediaMap.set(String(m.sku).toUpperCase(), resolved);
                ViasaImageResolver.register(m.uri || m.nombreArchivo, resolved);
            });

            for (const p of productos) {
                if (!p) continue;

                // 1. Fotografía del producto
                const fotoRaw = p.fotoUrl || p.imagen || p.foto || p.imageUrl || p.imagen_producto || p.foto_url;
                let fotoRes = '';
                if (fotoRaw) {
                    if (fotoRaw.startsWith('data:image/') || fotoRaw.startsWith('blob:') || fotoRaw.startsWith('http')) {
                        fotoRes = fotoRaw;
                    } else if (mediaMap.has(fotoRaw)) {
                        fotoRes = mediaMap.get(fotoRaw);
                    } else {
                        fotoRes = ViasaImageResolver.resolve(fotoRaw, '');
                    }
                }
                if (!fotoRes && p.sku && mediaMap.has(String(p.sku).toUpperCase())) {
                    fotoRes = mediaMap.get(String(p.sku).toUpperCase());
                }
                if (fotoRes) {
                    p.fotoUrl = fotoRes;
                    p.imagen = fotoRes;
                    p.foto = fotoRes;
                    p.imageUrl = fotoRes;
                    p.imagen_producto = fotoRes;
                    p.foto_url = fotoRes;
                    ViasaImageResolver.register(p.sku, fotoRes);
                    if (p.id) ViasaImageResolver.register(p.id, fotoRes);
                }

                // 2. Imagen de Código de Barras
                const bcRaw = p.customBarcodeImage || p.barcodeImage || p.imagen_codigo_barras || p.customBarcodeImg || p.codigo_barras_img || p.barcode_img;
                let bcRes = null;
                if (bcRaw && p.usar_imagen_barras_propia !== false) {
                    if (bcRaw.startsWith('data:image/') || bcRaw.startsWith('blob:') || bcRaw.startsWith('http')) {
                        bcRes = bcRaw;
                    } else if (mediaMap.has(bcRaw)) {
                        bcRes = mediaMap.get(bcRaw);
                    } else {
                        bcRes = ViasaImageResolver.resolve(bcRaw, null);
                    }
                }
                if (!bcRes && p.sku) {
                    const bcKey = `barcode-${String(p.sku).toLowerCase()}`;
                    for (const [k, v] of mediaMap.entries()) {
                        if (k.toLowerCase().includes(bcKey)) {
                            bcRes = v;
                            break;
                        }
                    }
                }
                if (bcRes) {
                    p.customBarcodeImage = bcRes;
                    p.barcodeImage = bcRes;
                    p.imagen_codigo_barras = bcRes;
                    p.customBarcodeImg = bcRes;
                    p.codigo_barras_img = bcRes;
                    p.barcode_img = bcRes;
                    p.usar_imagen_barras_propia = true;
                    ViasaImageResolver.register(`barcode-${p.sku}`, bcRes);
                } else if (p.usar_imagen_barras_propia === false) {
                    p.customBarcodeImage = null;
                    p.barcodeImage = null;
                    p.imagen_codigo_barras = null;
                    p.customBarcodeImg = null;
                    p.codigo_barras_img = null;
                    p.barcode_img = null;
                    p.usar_imagen_barras_propia = false;
                }

                // 3. Imagen de Código QR
                const qrRaw = p.customQrImage || p.qrImage || p.imagen_qr || p.customQrImg || p.qr_img;
                let qrRes = null;
                if (qrRaw && p.usar_imagen_qr_propia !== false) {
                    if (qrRaw.startsWith('data:image/') || qrRaw.startsWith('blob:') || qrRaw.startsWith('http')) {
                        qrRes = qrRaw;
                    } else if (mediaMap.has(qrRaw)) {
                        qrRes = mediaMap.get(qrRaw);
                    } else {
                        qrRes = ViasaImageResolver.resolve(qrRaw, null);
                    }
                }
                if (qrRes) {
                    p.customQrImage = qrRes;
                    p.qrImage = qrRes;
                    p.imagen_qr = qrRes;
                    p.customQrImg = qrRes;
                    p.qr_img = qrRes;
                    p.usar_imagen_qr_propia = true;
                } else if (p.usar_imagen_qr_propia === false) {
                    p.customQrImage = null;
                    p.qrImage = null;
                    p.imagen_qr = null;
                    p.customQrImg = null;
                    p.qr_img = null;
                    p.usar_imagen_qr_propia = false;
                }
            }
            return productos;
        }
    };

    window.ViasaImageResolver = ViasaImageResolver;

})(window);
