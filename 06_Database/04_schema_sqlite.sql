-- ============================================================================
-- SI-MUKTI PORTABLE SQLITE SCHEMA (ZERO DEPENDENCY / QUICK TEST)
-- Sistem Informasi Geospasial dan Ketertelusuran Digital Marmer Tulungagung
-- Kompatibel penuh dengan SQLite 3 & Python sqlite3 standard library
-- ============================================================================

PRAGMA foreign_keys = ON;

-- 1. Tabel users
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    phone_number TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('pengrajin', 'offtaker', 'regulator_pemkab', 'laboratorium', 'konsumen')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending_verification')),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabel workshops
CREATE TABLE IF NOT EXISTS workshops (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    paguyuban_id TEXT NOT NULL UNIQUE,
    subdistrict TEXT NOT NULL,
    village TEXT NOT NULL,
    address_detail TEXT,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    is_verified INTEGER NOT NULL DEFAULT 1,
    active_workers INTEGER NOT NULL DEFAULT 3,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_workshops_coords ON workshops(latitude, longitude);

-- 3. Tabel offtakers
CREATE TABLE IF NOT EXISTS offtakers (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    company_name TEXT NOT NULL,
    pic_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    subdistrict TEXT NOT NULL,
    address_detail TEXT,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    absorption_capacity_monthly_ton REAL NOT NULL DEFAULT 150.00,
    min_caco3_required REAL NOT NULL DEFAULT 95.00,
    max_moisture_allowed REAL NOT NULL DEFAULT 20.00,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabel vehicles
CREATE TABLE IF NOT EXISTS vehicles (
    id TEXT PRIMARY KEY,
    offtaker_id TEXT NOT NULL REFERENCES offtakers(id) ON DELETE CASCADE,
    plate_number TEXT NOT NULL UNIQUE,
    vehicle_type TEXT NOT NULL DEFAULT 'Dump Truck 6-Wheeler',
    tonnage_capacity REAL NOT NULL DEFAULT 6.00,
    driver_name TEXT NOT NULL,
    driver_phone TEXT NOT NULL,
    is_available INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabel waste_logs
CREATE TABLE IF NOT EXISTS waste_logs (
    id TEXT PRIMARY KEY,
    workshop_id TEXT NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
    waste_type TEXT NOT NULL CHECK (waste_type IN ('sludge_lumpur', 'afur_kasar')),
    estimated_volume_m3 REAL NOT NULL,
    estimated_tonnage REAL NOT NULL,
    actual_weighed_tonnage REAL,
    rate_per_ton REAL NOT NULL DEFAULT 150000.00,
    total_value REAL NOT NULL,
    photo_url TEXT NOT NULL,
    ai_confidence_score REAL DEFAULT 0.950,
    ai_bounding_polygon TEXT,
    status TEXT NOT NULL DEFAULT 'tersedia' CHECK (status IN ('tersedia', 'dijadwalkan', 'terangkut', 'terserap_pabrik')),
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    notes TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_waste_logs_filter ON waste_logs(status, waste_type);

-- 6. Tabel lab_test_reports
CREATE TABLE IF NOT EXISTS lab_test_reports (
    id TEXT PRIMARY KEY,
    workshop_id TEXT NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
    waste_log_id TEXT REFERENCES waste_logs(id) ON DELETE SET NULL,
    certificate_number TEXT NOT NULL UNIQUE,
    testing_institution TEXT NOT NULL DEFAULT 'Balai Standardisasi dan Pengujian Mutu Batuan Jawa Timur',
    test_date DATE NOT NULL,
    caco3_content_percentage REAL NOT NULL,
    moisture_content_percentage REAL NOT NULL,
    ph_level REAL NOT NULL,
    purity_grade TEXT NOT NULL,
    spectrometry_pdf_url TEXT,
    is_passed INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. Tabel pickup_orders
CREATE TABLE IF NOT EXISTS pickup_orders (
    id TEXT PRIMARY KEY,
    order_code TEXT NOT NULL UNIQUE,
    offtaker_id TEXT NOT NULL REFERENCES offtakers(id) ON DELETE CASCADE,
    vehicle_id TEXT NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
    scheduled_pickup_date DATETIME NOT NULL,
    actual_pickup_date DATETIME,
    status TEXT NOT NULL DEFAULT 'menunggu_sopir' CHECK (status IN ('menunggu_sopir', 'dalam_perjalanan', 'tiba_di_lokasi', 'selesai', 'dibatalkan')),
    total_target_tonnage REAL NOT NULL,
    total_realized_tonnage REAL NOT NULL DEFAULT 0.00,
    route_optimized_geojson TEXT,
    total_distance_km REAL,
    co2_emission_saved_kg REAL DEFAULT 0.00,
    e_manifest_number TEXT NOT NULL UNIQUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 8. Tabel pickup_stops
CREATE TABLE IF NOT EXISTS pickup_stops (
    id TEXT PRIMARY KEY,
    pickup_order_id TEXT NOT NULL REFERENCES pickup_orders(id) ON DELETE CASCADE,
    waste_log_id TEXT NOT NULL REFERENCES waste_logs(id) ON DELETE RESTRICT,
    stop_sequence INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'menunggu' CHECK (status IN ('menunggu', 'tiba', 'timbang_muat', 'selesai_muat', 'dilewati')),
    arrived_at DATETIME,
    weighed_at DATETIME,
    measured_weight_kg REAL,
    weighing_slip_photo_url TEXT,
    driver_notes TEXT,
    UNIQUE (pickup_order_id, stop_sequence)
);

-- 9. Tabel wallets
CREATE TABLE IF NOT EXISTS wallets (
    id TEXT PRIMARY KEY,
    workshop_id TEXT NOT NULL UNIQUE REFERENCES workshops(id) ON DELETE CASCADE,
    current_balance REAL NOT NULL DEFAULT 0.00,
    total_earned REAL NOT NULL DEFAULT 0.00,
    total_withdrawn REAL NOT NULL DEFAULT 0.00,
    bank_name TEXT NOT NULL DEFAULT 'Bank Jatim',
    bank_account_number TEXT NOT NULL,
    bank_account_holder TEXT NOT NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 10. Tabel wallet_transactions
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id TEXT PRIMARY KEY,
    wallet_id TEXT NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
    reference_pickup_stop_id TEXT REFERENCES pickup_stops(id) ON DELETE SET NULL,
    transaction_code TEXT NOT NULL UNIQUE,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('kredit_valorisasi', 'penarikan_dana', 'penyesuaian')),
    amount REAL NOT NULL,
    balance_before REAL NOT NULL,
    balance_after REAL NOT NULL,
    description TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 11. Tabel payout_withdrawals
CREATE TABLE IF NOT EXISTS payout_withdrawals (
    id TEXT PRIMARY KEY,
    wallet_id TEXT NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
    payout_code TEXT NOT NULL UNIQUE,
    amount REAL NOT NULL,
    bank_target TEXT NOT NULL,
    account_target TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'success', 'rejected')),
    transfer_receipt_url TEXT,
    requested_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME
);

-- 12. Tabel quarry_blocks
CREATE TABLE IF NOT EXISTS quarry_blocks (
    id TEXT PRIMARY KEY,
    batch_code TEXT NOT NULL UNIQUE,
    quarry_location_name TEXT NOT NULL,
    geological_formation TEXT NOT NULL DEFAULT 'Formasi Wonosari Karst Selatan',
    stone_variety TEXT NOT NULL,
    extraction_date DATE NOT NULL,
    caco3_baseline_pct REAL NOT NULL,
    sn_mining_permit TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 13. Tabel product_passports
CREATE TABLE IF NOT EXISTS product_passports (
    id TEXT PRIMARY KEY,
    passport_uuid TEXT NOT NULL UNIQUE,
    workshop_id TEXT NOT NULL REFERENCES workshops(id) ON DELETE RESTRICT,
    quarry_block_id TEXT REFERENCES quarry_blocks(id) ON DELETE RESTRICT,
    lab_test_report_id TEXT REFERENCES lab_test_reports(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    product_category TEXT NOT NULL,
    dimensions TEXT NOT NULL,
    weight_kg REAL NOT NULL,
    finished_photo_url TEXT NOT NULL,
    circular_waste_recovered_pct REAL NOT NULL DEFAULT 100.00,
    authenticity_seal_number TEXT NOT NULL UNIQUE,
    qr_code_url TEXT NOT NULL,
    cryptographic_signature TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'aktif' CHECK (status IN ('draft', 'aktif', 'terverifikasi', 'dicabut')),
    view_count INTEGER NOT NULL DEFAULT 0,
    issued_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 14. Tabel traceability_events
CREATE TABLE IF NOT EXISTS traceability_events (
    id TEXT PRIMARY KEY,
    product_passport_id TEXT NOT NULL REFERENCES product_passports(id) ON DELETE CASCADE,
    stage TEXT NOT NULL CHECK (stage IN ('kuari_tambang', 'bengkel_bubut', 'uji_mutu_lab', 'residu_terserap', 'pasar_konsumen')),
    event_title TEXT NOT NULL,
    event_description TEXT NOT NULL,
    location_name TEXT NOT NULL,
    event_timestamp DATETIME NOT NULL,
    evidence_photo_url TEXT,
    verified_by TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 15. Tabel regional_environmental_metrics
CREATE TABLE IF NOT EXISTS regional_environmental_metrics (
    id TEXT PRIMARY KEY,
    period_month DATE NOT NULL,
    subdistrict TEXT NOT NULL,
    total_waste_generated_tons REAL NOT NULL DEFAULT 0.00,
    total_waste_absorbed_tons REAL NOT NULL DEFAULT 0.00,
    river_dumping_prevented_tons REAL NOT NULL DEFAULT 0.00,
    carbon_emissions_reduced_kg REAL NOT NULL DEFAULT 0.00,
    economic_surplus_generated_idr REAL NOT NULL DEFAULT 0.00,
    active_participating_workshops INTEGER NOT NULL DEFAULT 0,
    UNIQUE (period_month, subdistrict)
);

-- ----------------------------------------------------------------------------
-- VIEWS UNTUK SQLITE
-- ----------------------------------------------------------------------------
CREATE VIEW IF NOT EXISTS v_gis_active_waste_map AS
SELECT 
    w.id AS waste_id,
    w.workshop_id,
    ws.name AS workshop_name,
    ws.owner_name,
    ws.paguyuban_id,
    u.phone_number AS contact_phone,
    ws.subdistrict,
    ws.village,
    w.waste_type,
    CASE 
        WHEN w.waste_type = 'sludge_lumpur' THEN 'HIJAU_SLUDGE'
        WHEN w.waste_type = 'afur_kasar' THEN 'ORANYE_AFUR'
        ELSE 'ABU_NETRAL'
    END AS pin_color_category,
    w.estimated_volume_m3,
    w.estimated_tonnage,
    w.rate_per_ton,
    w.total_value AS estimated_transaction_value_idr,
    w.photo_url,
    w.ai_confidence_score,
    w.status AS waste_status,
    w.latitude,
    w.longitude,
    lab.certificate_number AS lab_cert_number,
    lab.caco3_content_percentage AS lab_caco3_pct,
    lab.moisture_content_percentage AS lab_moisture_pct,
    lab.ph_level AS lab_ph_level
FROM waste_logs w
JOIN workshops ws ON w.workshop_id = ws.id
JOIN users u ON ws.user_id = u.id
LEFT JOIN lab_test_reports lab ON w.id = lab.waste_log_id
WHERE w.status IN ('tersedia', 'dijadwalkan');

CREATE VIEW IF NOT EXISTS v_public_passport_verification AS
SELECT 
    p.passport_uuid,
    p.authenticity_seal_number,
    p.status AS passport_status,
    p.product_name,
    p.product_category,
    p.dimensions,
    p.weight_kg,
    p.finished_photo_url,
    p.circular_waste_recovered_pct,
    p.qr_code_url,
    p.cryptographic_signature,
    p.issued_at,
    p.view_count,
    ws.name AS workshop_name,
    ws.owner_name AS artisan_name,
    ws.paguyuban_id,
    ws.subdistrict AS workshop_subdistrict,
    u.phone_number AS artisan_whatsapp,
    qb.batch_code AS quarry_batch_code,
    qb.quarry_location_name,
    qb.geological_formation,
    qb.stone_variety,
    qb.sn_mining_permit,
    lab.certificate_number AS lab_certificate_no,
    lab.testing_institution,
    lab.caco3_content_percentage,
    lab.purity_grade,
    lab.is_passed AS lab_verified
FROM product_passports p
JOIN workshops ws ON p.workshop_id = ws.id
JOIN users u ON ws.user_id = u.id
LEFT JOIN quarry_blocks qb ON p.quarry_block_id = qb.id
LEFT JOIN lab_test_reports lab ON p.lab_test_report_id = lab.id;

CREATE VIEW IF NOT EXISTS v_circular_economy_dashboard AS
SELECT 
    COUNT(DISTINCT ws.id) AS total_registered_workshops,
    COUNT(DISTINCT p.id) AS total_active_passports,
    COALESCE(SUM(w.estimated_tonnage), 0) AS total_logged_waste_tons,
    COALESCE(SUM(CASE WHEN w.status IN ('terangkut', 'terserap_pabrik') THEN COALESCE(w.actual_weighed_tonnage, w.estimated_tonnage) ELSE 0 END), 0) AS total_absorbed_waste_tons,
    COALESCE(SUM(CASE WHEN w.status IN ('terangkut', 'terserap_pabrik') THEN COALESCE(w.actual_weighed_tonnage, w.estimated_tonnage) ELSE 0 END), 0) * 100000.00 AS conventional_disposal_cost_saved_idr,
    COALESCE(SUM(CASE WHEN w.status IN ('terangkut', 'terserap_pabrik') THEN COALESCE(w.actual_weighed_tonnage, w.estimated_tonnage) * w.rate_per_ton ELSE 0 END), 0) AS new_valorization_revenue_idr,
    ((COALESCE(SUM(CASE WHEN w.status IN ('terangkut', 'terserap_pabrik') THEN COALESCE(w.actual_weighed_tonnage, w.estimated_tonnage) ELSE 0 END), 0) * 100000.00) +
     (COALESCE(SUM(CASE WHEN w.status IN ('terangkut', 'terserap_pabrik') THEN COALESCE(w.actual_weighed_tonnage, w.estimated_tonnage) * w.rate_per_ton ELSE 0 END), 0))) AS total_economic_surplus_idr,
    ROUND((COALESCE(SUM(CASE WHEN w.status IN ('terangkut', 'terserap_pabrik') THEN COALESCE(w.actual_weighed_tonnage, w.estimated_tonnage) ELSE 0 END), 0) * 38.20), 2) AS co2_reduction_kg
FROM workshops ws
LEFT JOIN waste_logs w ON ws.id = w.workshop_id
LEFT JOIN product_passports p ON ws.id = p.workshop_id;
