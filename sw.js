/**
 * ==============================================================================
 * VIASA SYSTEM - ENTERPRISE PWA SERVICE WORKER (v2.6.0)
 * Panadería y Pastelería Nueva Viasa, C.A. (RIF: J-31163165-8)
 * ==============================================================================
 * Arquitectura Multi-Capa:
 *  1. App Shell & Activos Estáticos (JS, CSS, Fuentes, Logos) -> Cache First (< 1s)
 *  2. Consultas Dinámicas y Tasas API -> Network First con Timeout + Fallback a Caché
 *  3. Navegación SPA -> Stale-While-Revalidate con Fallback Offline a index.html
 *  4. Background Sync -> Cola de operaciones críticas (POS, Producción, Respaldos)
 *  5. Control de Versiones -> skipWaiting + clientsClaim + Notificación Interactiva
 */

const SW_VERSION = '2.6.0';
const STATIC_CACHE = `viasa-static-v${SW_VERSION}`;
const DYNAMIC_CACHE = `viasa-dynamic-v${SW_VERSION}`;
const MEDIA_CACHE = `viasa-media-v${SW_VERSION}`;

const APP_SHELL_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './favicon.png',
    './assets/css/main.css',
    './assets/css/main.css?v=2.6',
    './assets/js/storage-engine.js',
    './assets/js/database.js',
    './assets/js/barcode-qr-engine.js',
    './assets/js/driver-fiscal-multi.js',
    './assets/js/driver-aclas-cr2050.js',
    './assets/js/audio-engine.js',
    './assets/js/guardias-engine.js',
    './assets/js/supabase-cloud.js',
    './assets/js/auth.js',
    './assets/js/app.js',
    './assets/icons/favicon-16x16.png',
    './assets/icons/favicon-32x32.png',
    './assets/icons/favicon-48x48.png',
    './assets/icons/apple-touch-icon.png',
    './assets/icons/icon-192.png',
    './assets/icons/icon-512.png',
    './assets/img/viasa_isotipo.png',
    './assets/img/viasa_logo_oficial.png'
];

// 1. INSTALACIÓN: Pre-cachear App Shell de forma resiliente
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE).then(async (cache) => {
            await Promise.allSettled(
                APP_SHELL_ASSETS.map((url) =>
                    cache.add(url).catch((err) => {
                        console.warn(`[VIASA SW] Omitido en pre-cache (${url}):`, err);
                    })
                )
            );
        })
    );
});

// 2. ACTIVACIÓN: Purgar cachés de versiones anteriores y reclamar clientes
self.addEventListener('activate', (event) => {
    const allowedCaches = new Set([STATIC_CACHE, DYNAMIC_CACHE, MEDIA_CACHE]);
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.map((key) => {
                    if (!allowedCaches.has(key)) {
                        console.log(`[VIASA SW] Eliminando caché obsoleto: ${key}`);
                        return caches.delete(key);
                    }
                })
            )
        ).then(() => self.clients.claim())
    );
});

// 3. ESTRATEGIAS DE CACHÉ ESPECIALIZADAS
async function cacheFirstStrategy(request, cacheName = STATIC_CACHE) {
    const cached = await caches.match(request, { ignoreVary: true });
    if (cached) {
        // Revalidación silenciosa en segundo plano para mantener frescos los activos
        fetch(request).then((netRes) => {
            if (netRes && netRes.status === 200) {
                caches.open(cacheName).then((c) => c.put(request, netRes.clone()));
            }
        }).catch(() => {});
        return cached;
    }

    try {
        const netRes = await fetch(request);
        if (netRes && netRes.status === 200) {
            const cache = await caches.open(cacheName);
            cache.put(request, netRes.clone());
        }
        return netRes;
    } catch (err) {
        return caches.match('./index.html');
    }
}

async function networkFirstWithTimeout(request, timeoutMs = 3500) {
    const cache = await caches.open(DYNAMIC_CACHE);
    try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        const netRes = await fetch(request, { signal: controller.signal });
        clearTimeout(timer);

        if (netRes && netRes.status === 200) {
            cache.put(request, netRes.clone());
        }
        return netRes;
    } catch (err) {
        const cached = await cache.match(request);
        if (cached) return cached;
        return new Response(
            JSON.stringify({ offline: true, timestamp: new Date().toISOString(), source: 'VIASA_SW_FALLBACK' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

async function staleWhileRevalidateNavigation(request) {
    const cached = await caches.match('./index.html') || await caches.match(request);
    const networkFetch = fetch(request).then(async (netRes) => {
        if (netRes && netRes.status === 200) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put('./index.html', netRes.clone());
        }
        return netRes;
    }).catch(() => cached);

    return cached || networkFetch;
}

// 4. INTERCEPTOR DE PETICIONES (FETCH)
self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET') return;

    const url = new URL(request.url);
    if (!url.protocol.startsWith('http')) return;

    // A. Navegación de documentos HTML -> Instant App Shell + Revalidación
    if (request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html')) {
        event.respondWith(staleWhileRevalidateNavigation(request));
        return;
    }

    // B. Consultas de APIs externas (Tasas BCV / USDT / DolarApi / Supabase) -> Network First con Fallback
    if (
        url.hostname.includes('dolarapi.com') ||
        url.hostname.includes('pydolarve') ||
        url.hostname.includes('exchangerate') ||
        url.hostname.includes('supabase.co') ||
        url.pathname.includes('/api/')
    ) {
        event.respondWith(networkFirstWithTimeout(request, 3500));
        return;
    }

    // C. Fuentes y CDNs de Iconos (Google Fonts, FontAwesome) -> Cache First Inmutable
    if (
        url.hostname.includes('fonts.googleapis.com') ||
        url.hostname.includes('fonts.gstatic.com') ||
        url.hostname.includes('cdnjs.cloudflare.com')
    ) {
        event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
        return;
    }

    // D. Archivos Multimedia Pesados (Video/Audio) -> Cache bajo demanda
    if (url.pathname.endsWith('.mp4') || url.pathname.endsWith('.wav')) {
        event.respondWith(cacheFirstStrategy(request, MEDIA_CACHE));
        return;
    }

    // E. Activos Estáticos del Sistema (JS, CSS, PNG, ICO, JSON) -> Cache First (< 1s)
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
});

// 5. BACKGROUND SYNC PARA OPERACIONES CRÍTICAS (POS, PRODUCCIÓN, RESPALDOS)
self.addEventListener('sync', (event) => {
    if (event.tag === 'viasa-sync-critical-ops') {
        event.waitUntil(
            self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
                clients.forEach((client) => {
                    client.postMessage({
                        type: 'VIASA_BG_SYNC_FLUSH',
                        version: SW_VERSION,
                        timestamp: new Date().toISOString()
                    });
                });
            })
        );
    }
});

// 6. CANAL DE MENSAJES PARA CONTROL DE VERSIONES E INSTALACIÓN
self.addEventListener('message', (event) => {
    if (!event.data) return;

    if (event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data.type === 'GET_VERSION' && event.ports && event.ports[0]) {
        event.ports[0].postMessage({ version: SW_VERSION });
    }
});
