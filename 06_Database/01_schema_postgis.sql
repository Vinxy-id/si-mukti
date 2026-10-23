-- ============================================================================
-- SI-MUKTI DATABASE SCHEMA (POSTGRESQL 16+ WITH POSTGIS EXTENSION)
-- Sistem Informasi Geospasial dan Ketertelusuran Digital Marmer Tulungagung
-- Target Sentra: Campurdarat & Besole, Kabupaten Tulungagung
-- Standard Baseline: PRD.md Versi 1.0
-- ============================================================================

-- 1. Inisialisasi Ekstensi Wajib
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 2. Tipe Data Enum Bisnis
DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM (
        'pengrajin', 
        'offtaker', 
        'regulator_pemkab', 
        'laboratorium', 
        'konsumen'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE waste_type_enum AS ENUM (
        'sludge_lumpur', 
        'afur_kasar'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE waste_status_enum AS ENUM (
        'tersedia', 
        'dijadwalkan', 
        'terangkut', 
        'terserap_pabrik'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE pickup_status_enum AS ENUM (
        'menunggu_sopir', 
        'dalam_perjalanan', 
        'tiba_di_lokasi', 
        'selesai', 
        'dibatalkan'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE passport_status_enum AS ENUM (
        'draft', 
        'aktif', 
        'terverifikasi', 
        'dicabut'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE wallet_tx_type_enum AS ENUM (
        'kredit_valorisasi', 
        'penarikan_dana', 
        'penyesuaian'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE withdrawal_status_enum AS ENUM (
        'pending', 
        'processing', 
        'success', 
        'rejected'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ----------------------------------------------------------------------------
-- TABEL 1: users (Akun Pengguna Pentahelix)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    role user_role_enum NOT NULL DEFAULT 'pengrajin',
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending_verification')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- TABEL 2: workshops (Profil Bengkel Pengrajin Marmer)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS workshops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    owner_name VARCHAR(150) NOT NULL,
    paguyuban_id VARCHAR(50) NOT NULL UNIQUE,
    subdistrict VARCHAR(100) NOT NULL,
    village VARCHAR(100) NOT NULL,
    address_detail TEXT,
    latitude NUMERIC(10, 8) NOT NULL,
    longitude NUMERIC(11, 8) NOT NULL,
    geom GEOMETRY(Point, 4326) NOT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT TRUE,
    active_workers INTEGER NOT NULL DEFAULT 3 CHECK (active_workers >= 1),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workshops_geom ON workshops USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_workshops_subdistrict ON workshops (subdistrict, village);

-- ----------------------------------------------------------------------------
-- TABEL 3: offtakers (Industri Pengolah Paving, Teraso, Pupuk)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS offtakers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    company_name VARCHAR(200) NOT NULL,
    pic_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    subdistrict VARCHAR(100) NOT NULL,
    address_detail TEXT,
    latitude NUMERIC(10, 8) NOT NULL,
    longitude NUMERIC(11, 8) NOT NULL,
    geom GEOMETRY(Point, 4326) NOT NULL,
    absorption_capacity_monthly_ton NUMERIC(10, 2) NOT NULL DEFAULT 150.00 CHECK (absorption_capacity_monthly_ton > 0),
    min_caco3_required NUMERIC(5, 2) NOT NULL DEFAULT 95.00 CHECK (min_caco3_required BETWEEN 0 AND 100),
    max_moisture_allowed NUMERIC(5, 2) NOT NULL DEFAULT 20.00 CHECK (max_moisture_allowed BETWEEN 0 AND 100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_offtakers_geom ON offtakers USING GIST (geom);

-- ----------------------------------------------------------------------------
-- TABEL 4: vehicles (Armada Truk Dump Offtaker)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    offtaker_id UUID NOT NULL REFERENCES offtakers(id) ON DELETE CASCADE,
    plate_number VARCHAR(20) NOT NULL UNIQUE,
    vehicle_type VARCHAR(50) NOT NULL DEFAULT 'Dump Truck 6-Wheeler',
    tonnage_capacity NUMERIC(6, 2) NOT NULL DEFAULT 6.00 CHECK (tonnage_capacity > 0),
    driver_name VARCHAR(100) NOT NULL,
    driver_phone VARCHAR(20) NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- TABEL 5: waste_logs (Pencatatan Residu Limbah & Volumetrik AI)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS waste_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
    waste_type waste_type_enum NOT NULL,
    estimated_volume_m3 NUMERIC(8, 3) NOT NULL CHECK (estimated_volume_m3 > 0),
    estimated_tonnage NUMERIC(8, 2) NOT NULL CHECK (estimated_tonnage > 0),
    actual_weighed_tonnage NUMERIC(8, 2) CHECK (actual_weighed_tonnage IS NULL OR actual_weighed_tonnage > 0),
    rate_per_ton NUMERIC(12, 2) NOT NULL DEFAULT 150000.00 CHECK (rate_per_ton > 0),
    total_value NUMERIC(12, 2) NOT NULL CHECK (total_value >= 0),
    photo_url VARCHAR(500) NOT NULL,
    ai_confidence_score NUMERIC(4, 3) DEFAULT 0.950 CHECK (ai_confidence_score BETWEEN 0 AND 1),
    ai_bounding_polygon JSONB,
    status waste_status_enum NOT NULL DEFAULT 'tersedia',
    latitude NUMERIC(10, 8) NOT NULL,
    longitude NUMERIC(11, 8) NOT NULL,
    geom GEOMETRY(Point, 4326) NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_waste_logs_geom ON waste_logs USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_waste_logs_filter ON waste_logs (status, waste_type);
CREATE INDEX IF NOT EXISTS idx_waste_logs_workshop ON waste_logs (workshop_id);

-- ----------------------------------------------------------------------------
-- TABEL 6: lab_test_reports (Sertifikasi Spektrometri SNI 03-0394)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS lab_test_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
    waste_log_id UUID REFERENCES waste_logs(id) ON DELETE SET NULL,
    certificate_number VARCHAR(100) NOT NULL UNIQUE,
    testing_institution VARCHAR(200) NOT NULL DEFAULT 'Balai Standardisasi dan Pengujian Mutu Batuan Jawa Timur',
    test_date DATE NOT NULL,
    caco3_content_percentage NUMERIC(5, 2) NOT NULL CHECK (caco3_content_percentage BETWEEN 0 AND 100),
    moisture_content_percentage NUMERIC(5, 2) NOT NULL CHECK (moisture_content_percentage BETWEEN 0 AND 100),
    ph_level NUMERIC(4, 2) NOT NULL CHECK (ph_level BETWEEN 0 AND 14),
    purity_grade VARCHAR(50) NOT NULL,
    spectrometry_pdf_url VARCHAR(500),
    is_passed BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lab_test_reports_workshop ON lab_test_reports (workshop_id);

-- ----------------------------------------------------------------------------
-- TABEL 7: pickup_orders (Penugasan Penjemputan Armada Logistik)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pickup_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_code VARCHAR(50) NOT NULL UNIQUE,
    offtaker_id UUID NOT NULL REFERENCES offtakers(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
    scheduled_pickup_date TIMESTAMPTZ NOT NULL,
    actual_pickup_date TIMESTAMPTZ,
    status pickup_status_enum NOT NULL DEFAULT 'menunggu_sopir',
    total_target_tonnage NUMERIC(8, 2) NOT NULL CHECK (total_target_tonnage > 0),
    total_realized_tonnage NUMERIC(8, 2) NOT NULL DEFAULT 0.00 CHECK (total_realized_tonnage >= 0),
    route_optimized_geojson JSONB,
    total_distance_km NUMERIC(6, 2) CHECK (total_distance_km IS NULL OR total_distance_km >= 0),
    co2_emission_saved_kg NUMERIC(10, 2) DEFAULT 0.00,
    e_manifest_number VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pickup_orders_status ON pickup_orders (status, scheduled_pickup_date);

-- ----------------------------------------------------------------------------
-- TABEL 8: pickup_stops (Titik Multi-Stop Penjemputan Rute)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pickup_stops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pickup_order_id UUID NOT NULL REFERENCES pickup_orders(id) ON DELETE CASCADE,
    waste_log_id UUID NOT NULL REFERENCES waste_logs(id) ON DELETE RESTRICT,
    stop_sequence INTEGER NOT NULL CHECK (stop_sequence >= 1),
    status VARCHAR(30) NOT NULL DEFAULT 'menunggu' CHECK (status IN ('menunggu', 'tiba', 'timbang_muat', 'selesai_muat', 'dilewati')),
    arrived_at TIMESTAMPTZ,
    weighed_at TIMESTAMPTZ,
    measured_weight_kg NUMERIC(8, 2) CHECK (measured_weight_kg IS NULL OR measured_weight_kg > 0),
    weighing_slip_photo_url VARCHAR(500),
    driver_notes TEXT,
    CONSTRAINT uq_pickup_order_sequence UNIQUE (pickup_order_id, stop_sequence)
);

CREATE INDEX IF NOT EXISTS idx_pickup_stops_order ON pickup_stops (pickup_order_id);

-- ----------------------------------------------------------------------------
-- TABEL 9: wallets (Dompet Digital MUKTI-Pay)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workshop_id UUID NOT NULL UNIQUE REFERENCES workshops(id) ON DELETE CASCADE,
    current_balance NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (current_balance >= 0),
    total_earned NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (total_earned >= 0),
    total_withdrawn NUMERIC(14, 2) NOT NULL DEFAULT 0.00 CHECK (total_withdrawn >= 0),
    bank_name VARCHAR(100) NOT NULL DEFAULT 'Bank Jatim',
    bank_account_number VARCHAR(50) NOT NULL,
    bank_account_holder VARCHAR(150) NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- TABEL 10: wallet_transactions (Buku Mutasi MUKTI-Pay)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
    reference_pickup_stop_id UUID REFERENCES pickup_stops(id) ON DELETE SET NULL,
    transaction_code VARCHAR(50) NOT NULL UNIQUE,
    transaction_type wallet_tx_type_enum NOT NULL,
    amount NUMERIC(14, 2) NOT NULL,
    balance_before NUMERIC(14, 2) NOT NULL,
    balance_after NUMERIC(14, 2) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wallet_transactions_wallet ON wallet_transactions (wallet_id, created_at DESC);

-- ----------------------------------------------------------------------------
-- TABEL 11: payout_withdrawals (Pencairan Saldo ke Bank)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payout_withdrawals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
    payout_code VARCHAR(50) NOT NULL UNIQUE,
    amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
    bank_target VARCHAR(100) NOT NULL,
    account_target VARCHAR(50) NOT NULL,
    status withdrawal_status_enum NOT NULL DEFAULT 'pending',
    transfer_receipt_url VARCHAR(500),
    requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_payout_withdrawals_status ON payout_withdrawals (status, requested_at DESC);

-- ----------------------------------------------------------------------------
-- TABEL 12: quarry_blocks (Asal Bongkahan Kuari Marmer Tambang)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS quarry_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_code VARCHAR(50) NOT NULL UNIQUE,
    quarry_location_name VARCHAR(200) NOT NULL,
    geological_formation VARCHAR(150) NOT NULL DEFAULT 'Formasi Wonosari Karst Selatan',
    stone_variety VARCHAR(100) NOT NULL,
    extraction_date DATE NOT NULL,
    caco3_baseline_pct NUMERIC(5, 2) NOT NULL CHECK (caco3_baseline_pct BETWEEN 0 AND 100),
    sn_mining_permit VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- TABEL 13: product_passports (Paspor Digital MUKTI-Trace & Segel QR)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_passports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    passport_uuid VARCHAR(64) NOT NULL UNIQUE,
    workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE RESTRICT,
    quarry_block_id UUID REFERENCES quarry_blocks(id) ON DELETE RESTRICT,
    lab_test_report_id UUID REFERENCES lab_test_reports(id) ON DELETE SET NULL,
    product_name VARCHAR(200) NOT NULL,
    product_category VARCHAR(100) NOT NULL,
    dimensions VARCHAR(100) NOT NULL,
    weight_kg NUMERIC(8, 2) NOT NULL CHECK (weight_kg > 0),
    finished_photo_url VARCHAR(500) NOT NULL,
    circular_waste_recovered_pct NUMERIC(5, 2) NOT NULL DEFAULT 100.00 CHECK (circular_waste_recovered_pct BETWEEN 0 AND 100),
    authenticity_seal_number VARCHAR(100) NOT NULL UNIQUE,
    qr_code_url VARCHAR(500) NOT NULL,
    cryptographic_signature TEXT NOT NULL,
    status passport_status_enum NOT NULL DEFAULT 'aktif',
    view_count INTEGER NOT NULL DEFAULT 0,
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_passports_uuid ON product_passports (passport_uuid);
CREATE INDEX IF NOT EXISTS idx_product_passports_workshop ON product_passports (workshop_id);

-- ----------------------------------------------------------------------------
-- TABEL 14: traceability_events (Linimasa Jejak Ketertelusuran)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS traceability_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_passport_id UUID NOT NULL REFERENCES product_passports(id) ON DELETE CASCADE,
    stage VARCHAR(50) NOT NULL CHECK (stage IN ('kuari_tambang', 'bengkel_bubut', 'uji_mutu_lab', 'residu_terserap', 'pasar_konsumen')),
    event_title VARCHAR(200) NOT NULL,
    event_description TEXT NOT NULL,
    location_name VARCHAR(200) NOT NULL,
    event_timestamp TIMESTAMPTZ NOT NULL,
    evidence_photo_url VARCHAR(500),
    verified_by VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_traceability_events_passport ON traceability_events (product_passport_id, event_timestamp ASC);

-- ----------------------------------------------------------------------------
-- TABEL 15: regional_environmental_metrics (Analitik Telemetri Daerah)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS regional_environmental_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    period_month DATE NOT NULL,
    subdistrict VARCHAR(100) NOT NULL,
    total_waste_generated_tons NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_waste_absorbed_tons NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    river_dumping_prevented_tons NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    carbon_emissions_reduced_kg NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    economic_surplus_generated_idr NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    active_participating_workshops INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT uq_regional_metrics_period UNIQUE (period_month, subdistrict)
);
