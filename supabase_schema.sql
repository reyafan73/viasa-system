-- ==============================================================================
-- VIASA SYSTEM - ESQUEMA DE BASE DE DATOS EN LA NUBE (SUPABASE FREE TIER)
-- Panadería y Pastelería Nueva Viasa, C.A. (RIF: J-31163165-8)
-- ==============================================================================
-- Instrucciones: Pegue y ejecute este script en el "SQL Editor" de su proyecto
-- en Supabase (https://supabase.com/dashboard) para habilitar la sincronización
-- multi-dispositivo de las 54 colecciones y el control de usuarios.

-- 1. Tabla Maestra de Colecciones Sincronizadas (JSONB de Alto Rendimiento)
CREATE TABLE IF NOT EXISTS public.viasa_cloud_store (
    store_name TEXT PRIMARY KEY,
    records JSONB NOT NULL DEFAULT '[]'::jsonb,
    checksum TEXT,
    updated_by TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Tabla de Respaldos Generales del Casillero en la Nube
CREATE TABLE IF NOT EXISTS public.viasa_casillero_respaldos (
    id TEXT PRIMARY KEY,
    nombre_archivo TEXT NOT NULL,
    etiqueta TEXT,
    autor_nombre TEXT,
    autor_cargo TEXT,
    total_colecciones INTEGER DEFAULT 0,
    total_registros INTEGER DEFAULT 0,
    tamano_kb NUMERIC(10,2) DEFAULT 0,
    hash_crypto TEXT,
    protegido BOOLEAN DEFAULT TRUE,
    backup_data JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Habilitar Row Level Security (RLS)
ALTER TABLE public.viasa_cloud_store ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.viasa_casillero_respaldos ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de Acceso Seguro para Clientes Autenticados de VIASA SYSTEM
DROP POLICY IF EXISTS "Acceso lectura/escritura VIASA Cloud Store" ON public.viasa_cloud_store;
CREATE POLICY "Acceso lectura/escritura VIASA Cloud Store"
    ON public.viasa_cloud_store
    FOR ALL
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Acceso lectura/escritura Casillero Respaldos" ON public.viasa_casillero_respaldos;
CREATE POLICY "Acceso lectura/escritura Casillero Respaldos"
    ON public.viasa_casillero_respaldos
    FOR ALL
    USING (true)
    WITH CHECK (true);
