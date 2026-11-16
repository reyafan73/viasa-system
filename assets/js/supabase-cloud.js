/**
 * ==============================================================================
 * VIASA SYSTEM - MOTOR DE SINCRONIZACIÓN CLOUD & SUPABASE AUTH (HYBRID ENGINE)
 * Panadería y Pastelería Nueva Viasa, C.A. (RIF: J-31163165-8)
 * ==============================================================================
 * Conecta el motor Offline-First (IndexedDB + LocalStorage) con Supabase Cloud
 * (PostgreSQL + Supabase Auth) mediante API REST ligera sin dependencias pesadas.
 */

(function(window) {
    'use strict';

    class ViasaSupabaseCloudEngine {
        constructor() {
            this.configKey = 'supabase_cloud_config';
            this.supabaseUrl = '';
            this.supabaseAnonKey = '';
            this.accessToken = null;
            this.isConnected = false;
            this.cargarConfiguracion();
        }

        cargarConfiguracion() {
            const saved = window.ViasaStorage?.getItem(this.configKey, null);
            const envUrl = window.VIASA_ENV?.VITE_SUPABASE_URL || window.VIASA_ENV?.NEXT_PUBLIC_SUPABASE_URL || '';
            const envKey = window.VIASA_ENV?.VITE_SUPABASE_ANON_KEY || window.VIASA_ENV?.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

            this.supabaseUrl = (saved?.url || envUrl || '').trim().replace(/\/+$/, '');
            this.supabaseAnonKey = (saved?.anonKey || envKey || '').trim();
            this.isConnected = Boolean(
                this.supabaseUrl &&
                this.supabaseAnonKey &&
                !this.supabaseUrl.includes('tu-proyecto-id')
            );
        }

        configurarCredenciales(url, anonKey) {
            const cleanUrl = String(url || '').trim().replace(/\/+$/, '');
            const cleanKey = String(anonKey || '').trim();
            this.supabaseUrl = cleanUrl;
            this.supabaseAnonKey = cleanKey;
            this.isConnected = Boolean(cleanUrl && cleanKey);
            if (window.ViasaStorage) {
                window.ViasaStorage.setItem(this.configKey, {
                    url: cleanUrl,
                    anonKey: cleanKey,
                    updatedAt: new Date().toISOString()
                });
            }
            return this.isConnected;
        }

        getHeaders() {
            return {
                'Content-Type': 'application/json',
                'apikey': this.supabaseAnonKey,
                'Authorization': `Bearer ${this.accessToken || this.supabaseAnonKey}`,
                'Prefer': 'resolution=merge-duplicates,return=representation'
            };
        }

        /**
         * Autenticación opcional contra Supabase Auth (/auth/v1/token) con respaldo a RBAC SHA-256
         */
        async loginSupabaseAuth(emailOrUser, password) {
            if (!this.isConnected) return { handled: false };
            const email = emailOrUser.includes('@') ? emailOrUser : `${emailOrUser}@panaderianuevaviasa.com`;
            try {
                const res = await fetch(`${this.supabaseUrl}/auth/v1/token?grant_type=password`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': this.supabaseAnonKey
                    },
                    body: JSON.stringify({ email, password })
                });
                if (res.ok) {
                    const data = await res.json();
                    this.accessToken = data.access_token || null;
                    return { handled: true, success: true, data };
                }
            } catch (e) {
                console.warn('[VIASA Cloud] Fallback a autenticación local SHA-256:', e);
            }
            return { handled: false };
        }

        /**
         * Sube una colección completa a la tabla `viasa_cloud_store` en Supabase
         */
        async subirColeccion(storeName, records) {
            if (!this.isConnected || !navigator.onLine) return false;
            try {
                const user = window.ViasaAuth?.getCurrentUser();
                const payload = {
                    store_name: storeName,
                    records: Array.isArray(records) ? records : [],
                    checksum: window.ViasaStorage?.generarChecksum(records) || '',
                    updated_by: user ? `${user.username} (${user.cargo})` : 'system',
                    updated_at: new Date().toISOString()
                };
                const res = await fetch(`${this.supabaseUrl}/rest/v1/viasa_cloud_store`, {
                    method: 'POST',
                    headers: this.getHeaders(),
                    body: JSON.stringify(payload)
                });
                return res.ok;
            } catch (err) {
                console.warn(`[VIASA Cloud] Error subiendo colección ${storeName}:`, err);
                return false;
            }
        }

        /**
         * Descarga todas las colecciones desde `viasa_cloud_store` en Supabase y actualiza IndexedDB local
         */
        async sincronizarDesdeNube() {
            if (!this.isConnected || !navigator.onLine) return { success: false, reason: 'No conectado a Supabase' };
            try {
                const res = await fetch(`${this.supabaseUrl}/rest/v1/viasa_cloud_store?select=*`, {
                    method: 'GET',
                    headers: this.getHeaders()
                });
                if (!res.ok) return { success: false, status: res.status };

                const rows = await res.json();
                if (Array.isArray(rows)) {
                    for (const row of rows) {
                        if (row.store_name && Array.isArray(row.records)) {
                            await window.ViasaStorage.guardarColeccion(row.store_name, row.records);
                        }
                    }
                }
                return { success: true, count: rows.length };
            } catch (err) {
                return { success: false, error: err.message };
            }
        }

        /**
         * Sincroniza todo el estado local hacia Supabase Cloud
         */
        async sincronizarTodoHaciaNube() {
            if (!this.isConnected || !navigator.onLine) return { success: false, reason: 'Credenciales de Supabase pendientes' };
            const backup = await window.ViasaStorage.exportarBackupCompleto();
            const cols = backup.colecciones || {};
            let enviados = 0;

            for (const storeName of Object.keys(cols)) {
                const ok = await this.subirColeccion(storeName, cols[storeName]);
                if (ok) enviados++;
            }
            return { success: true, enviados };
        }

        /**
         * Adaptador Local-First + Cloud Sync: transmite cambios individuales al backend
         */
        async pushChange(collection, record, action = 'upsert') {
            if (!this.isConnected || !navigator.onLine) {
                return { synced: false, mode: 'local' };
            }
            try {
                const user = window.ViasaAuth?.getCurrentUser();
                const payload = {
                    collection: collection,
                    action: action,
                    record: record,
                    updated_by: user ? `${user.username} (${user.cargo})` : 'system',
                    updated_at: new Date().toISOString()
                };
                const res = await fetch(`${this.supabaseUrl}/rest/v1/viasa_cloud_mutations`, {
                    method: 'POST',
                    headers: this.getHeaders(),
                    body: JSON.stringify(payload)
                });
                return { synced: res.ok, mode: res.ok ? 'cloud' : 'local' };
            } catch (e) {
                console.warn(`[Cloud Sync] Error no bloqueante enviando cambio de ${collection}:`, e);
                return { synced: false, mode: 'local' };
            }
        }

        /**
         * Probar conexión con Supabase / Cloud backend
         */
        async probarConexion() {
            if (!this.supabaseUrl || !this.supabaseAnonKey) {
                return {
                    ok: false,
                    statusText: 'Credenciales incompletas',
                    message: 'Debes ingresar la URL del proyecto y el Anon Key.'
                };
            }
            if (!navigator.onLine) {
                return {
                    ok: false,
                    statusText: 'Sin conexión a Internet',
                    message: 'El equipo se encuentra offline.'
                };
            }
            try {
                const res = await fetch(`${this.supabaseUrl}/rest/v1/`, {
                    method: 'GET',
                    headers: {
                        'apikey': this.supabaseAnonKey,
                        'Authorization': `Bearer ${this.supabaseAnonKey}`
                    }
                });
                if (res.ok || res.status === 200 || res.status === 404 || res.status === 401) {
                    if (res.status === 401) {
                        return {
                            ok: false,
                            statusText: 'API Key No Válida',
                            message: 'La URL respondió pero el API Key fue rechazado por Supabase.'
                        };
                    }
                    this.isConnected = true;
                    return {
                        ok: true,
                        statusText: 'Nube Conectada en Tiempo Real',
                        message: '¡Conexión exitosa con el proyecto Cloud de VIASA System!'
                    };
                }
                return {
                    ok: false,
                    statusText: `Error HTTP ${res.status}`,
                    message: `El servidor respondió con código ${res.status}.`
                };
            } catch (err) {
                return {
                    ok: false,
                    statusText: 'Fallo de Red / Conexión',
                    message: err.message || 'No se pudo contactar con el endpoint de Supabase.'
                };
            }
        }

        /**
         * Obtener estado descriptivo de la conexión cloud
         */
        obtenerEstadoConexion() {
            if (!this.supabaseUrl || !this.supabaseAnonKey || this.supabaseUrl.includes('tu-proyecto-id')) {
                return {
                    conectado: false,
                    badge: 'Modo Local Blindado (100% Offline)',
                    clase: 'offline',
                    color: '#10b981'
                };
            }
            if (!navigator.onLine) {
                return {
                    conectado: false,
                    badge: 'Sin Conexión a Internet (Trabajando en Local)',
                    clase: 'offline',
                    color: '#f59e0b'
                };
            }
            return {
                conectado: true,
                badge: 'Nube Conectada en Tiempo Real (Multi-Laptop Activo)',
                clase: 'online',
                color: '#3b82f6'
            };
        }
    }

    window.ViasaCloud = new ViasaSupabaseCloudEngine();
    window.cloudSyncService = window.ViasaCloud;
    window.ViasaCloudSync = window.ViasaCloud;
})(window);
