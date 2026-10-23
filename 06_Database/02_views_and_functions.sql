-- ============================================================================
-- SI-MUKTI DATABASE VIEWS, FUNCTIONS & TRIGGERS (POSTGRESQL + POSTGIS)
-- Modul: Web-GIS Spatial Engine, Traceability API, & MUKTI-Pay Ledger Automation
-- Standard Baseline: PRD.md Modul 4.1, 4.2, 4.3 & Bab 7
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. VIEW: v_gis_active_waste_map
-- Sumber data untuk peta interaktif MUKTI-Spasial Web-GIS (FR-07, FR-08, FR-09)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_gis_active_waste_map AS
SELECT 
    w.id AS waste_id,
    w.workshop_id,
    ws.name AS workshop_name,
    ws.owner_name,
    ws.paguyuban_id,
    u.phone_number AS contact_phone,
    ws.subdistrict,
    ws.village,
    ws.address_detail,
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
    ST_AsGeoJSON(w.geom)::jsonb AS geojson_geometry,
    -- Info Uji Laboratorium Terakhir (SNI 03-0394)
    lab.certificate_number AS lab_cert_number,
    lab.caco3_content_percentage AS lab_caco3_pct,
    lab.moisture_content_percentage AS lab_moisture_pct,
    lab.ph_level AS lab_ph_level,
    lab.purity_grade AS lab_purity_grade,
    lab.is_passed AS lab_is_passed,
    w.created_at AS recorded_at
FROM waste_logs w
JOIN workshops ws ON w.workshop_id = ws.id
JOIN users u ON ws.user_id = u.id
LEFT JOIN lab_test_reports lab ON w.id = lab.waste_log_id
WHERE w.status IN ('tersedia', 'dijadwalkan');

-- ----------------------------------------------------------------------------
-- 2. VIEW: v_gis_offtaker_facilities
-- Sumber data lokasi pabrik pengolah (Pin Ungu) pada Web-GIS
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_gis_offtaker_facilities AS
SELECT 
    o.id AS offtaker_id,
    o.company_name,
    o.pic_name,
    o.phone,
    o.subdistrict,
    'UNGU_PABRIK' AS pin_color_category,
    o.absorption_capacity_monthly_ton,
    o.min_caco3_required,
    o.max_moisture_allowed,
    o.latitude,
    o.longitude,
    ST_AsGeoJSON(o.geom)::jsonb AS geojson_geometry,
    COUNT(v.id) AS total_available_trucks
FROM offtakers o
LEFT JOIN vehicles v ON o.id = v.offtaker_id AND v.is_available = TRUE
GROUP BY o.id, o.company_name, o.pic_name, o.phone, o.subdistrict, o.absorption_capacity_monthly_ton, o.min_caco3_required, o.max_moisture_allowed, o.latitude, o.longitude, o.geom;

-- ----------------------------------------------------------------------------
-- 3. FUNCTION: fn_find_nearby_waste
-- Pencarian spasial limbah tersedia dalam radius km tertentu dari titik acuan (FR-08, FR-10)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_find_nearby_waste(
    p_lat NUMERIC,
    p_lng NUMERIC,
    p_radius_km NUMERIC DEFAULT 10.0,
    p_min_caco3 NUMERIC DEFAULT 0.0
)
RETURNS TABLE (
    waste_id UUID,
    workshop_name VARCHAR,
    owner_name VARCHAR,
    subdistrict VARCHAR,
    waste_type waste_type_enum,
    estimated_tonnage NUMERIC,
    rate_per_ton NUMERIC,
    caco3_percentage NUMERIC,
    distance_km NUMERIC,
    latitude NUMERIC,
    longitude NUMERIC
) AS $$
DECLARE
    v_center_geom GEOMETRY;
BEGIN
    v_center_geom := ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326);

    RETURN QUERY
    SELECT 
        w.id AS waste_id,
        ws.name AS workshop_name,
        ws.owner_name,
        ws.subdistrict,
        w.waste_type,
        w.estimated_tonnage,
        w.rate_per_ton,
        COALESCE(lab.caco3_content_percentage, 0.0) AS caco3_percentage,
        ROUND((ST_Distance(w.geom::geography, v_center_geom::geography) / 1000.0)::numeric, 2) AS distance_km,
        w.latitude,
        w.longitude
    FROM waste_logs w
    JOIN workshops ws ON w.workshop_id = ws.id
    LEFT JOIN lab_test_reports lab ON w.id = lab.waste_log_id
    WHERE w.status = 'tersedia'
      AND ST_DWithin(w.geom::geography, v_center_geom::geography, p_radius_km * 1000.0)
      AND (p_min_caco3 <= 0.0 OR COALESCE(lab.caco3_content_percentage, 100.0) >= p_min_caco3)
    ORDER BY distance_km ASC;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 4. VIEW: v_public_passport_verification
-- Konsumsi publik landing page saat QR Code dipindai oleh konsumen (FR-15)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_public_passport_verification AS
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
    -- Profil Pengrajin
    ws.name AS workshop_name,
    ws.owner_name AS artisan_name,
    ws.paguyuban_id,
    ws.subdistrict AS workshop_subdistrict,
    ws.village AS workshop_village,
    u.phone_number AS artisan_whatsapp,
    -- Asal Usul Geologis Kuari
    qb.batch_code AS quarry_batch_code,
    qb.quarry_location_name,
    qb.geological_formation,
    qb.stone_variety,
    qb.sn_mining_permit,
    -- Hasil Spektrometri Laboratorium
    lab.certificate_number AS lab_certificate_no,
    lab.testing_institution,
    lab.caco3_content_percentage,
    lab.purity_grade,
    lab.spectrometry_pdf_url,
    lab.is_passed AS lab_verified
FROM product_passports p
JOIN workshops ws ON p.workshop_id = ws.id
JOIN users u ON ws.user_id = u.id
LEFT JOIN quarry_blocks qb ON p.quarry_block_id = qb.id
LEFT JOIN lab_test_reports lab ON p.lab_test_report_id = lab.id;

-- ----------------------------------------------------------------------------
-- 5. VIEW: v_circular_economy_dashboard
-- Neraca analitik dampak ekonomi & lingkungan sesuai Bab 7 PRD
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_circular_economy_dashboard AS
SELECT 
    COUNT(DISTINCT ws.id) AS total_registered_workshops,
    COUNT(DISTINCT p.id) AS total_active_passports,
    COALESCE(SUM(w.estimated_tonnage), 0) AS total_logged_waste_tons,
    COALESCE(SUM(CASE WHEN w.status IN ('terangkut', 'terserap_pabrik') THEN COALESCE(w.actual_weighed_tonnage, w.estimated_tonnage) ELSE 0 END), 0) AS total_absorbed_waste_tons,
    -- Penghematan biaya buang (Asumsi standar Rp 200.000 / 2 ton = Rp 100.000 / ton)
    COALESCE(SUM(CASE WHEN w.status IN ('terangkut', 'terserap_pabrik') THEN COALESCE(w.actual_weighed_tonnage, w.estimated_tonnage) ELSE 0 END), 0) * 100000.00 AS conventional_disposal_cost_saved_idr,
    -- Pendapatan baru valorisasi (Tarif Rp 150.000 / ton)
    COALESCE(SUM(CASE WHEN w.status IN ('terangkut', 'terserap_pabrik') THEN COALESCE(w.actual_weighed_tonnage, w.estimated_tonnage) * w.rate_per_ton ELSE 0 END), 0) AS new_valorization_revenue_idr,
    -- Surplus perputaran modal sentra
    (COALESCE(SUM(CASE WHEN w.status IN ('terangkut', 'terserap_pabrik') THEN COALESCE(w.actual_weighed_tonnage, w.estimated_tonnage) ELSE 0 END), 0) * 100000.00) +
    (COALESCE(SUM(CASE WHEN w.status IN ('terangkut', 'terserap_pabrik') THEN COALESCE(w.actual_weighed_tonnage, w.estimated_tonnage) * w.rate_per_ton ELSE 0 END), 0)) AS total_economic_surplus_idr,
    -- Reduksi emisi CO2 (Asumsi -38.2 kg CO2 eq per ton terangkut secara lokal efisien)
    ROUND((COALESCE(SUM(CASE WHEN w.status IN ('terangkut', 'terserap_pabrik') THEN COALESCE(w.actual_weighed_tonnage, w.estimated_tonnage) ELSE 0 END), 0) * 38.20)::numeric, 2) AS co2_reduction_kg
FROM workshops ws
LEFT JOIN waste_logs w ON ws.id = w.workshop_id
LEFT JOIN product_passports p ON ws.id = p.workshop_id;

-- ----------------------------------------------------------------------------
-- 6. TRIGGER FUNCTION: trg_update_wallet_on_pickup
-- Otomatisasi pengisian saldo MUKTI-Pay saat limbah berhasil ditimbang & dimuat (FR-02, FR-06)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION trg_update_wallet_on_pickup()
RETURNS TRIGGER AS $$
DECLARE
    v_workshop_id UUID;
    v_rate_per_ton NUMERIC;
    v_tonnage NUMERIC;
    v_amount NUMERIC;
    v_wallet_id UUID;
    v_old_balance NUMERIC;
    v_new_balance NUMERIC;
    v_tx_code VARCHAR;
BEGIN
    -- Hanya berjalan saat status pickup_stops berpindah ke 'selesai_muat'
    IF NEW.status = 'selesai_muat' AND (OLD.status IS NULL OR OLD.status != 'selesai_muat') THEN
        
        -- Dapatkan info bengkel dan tarif limbah
        SELECT w.workshop_id, w.rate_per_ton INTO v_workshop_id, v_rate_per_ton
        FROM waste_logs w
        WHERE w.id = NEW.waste_log_id;

        -- Hitung tonase nyata (dari kilogram)
        v_tonnage := COALESCE(NEW.measured_weight_kg, 0) / 1000.0;
        v_amount := ROUND((v_tonnage * v_rate_per_ton)::numeric, 2);

        -- Perbarui status di tabel waste_logs
        UPDATE waste_logs 
        SET status = 'terangkut',
            actual_weighed_tonnage = v_tonnage,
            total_value = v_amount,
            updated_at = NOW()
        WHERE id = NEW.waste_log_id;

        -- Dapatkan ID dompet pengrajin
        SELECT id, current_balance INTO v_wallet_id, v_old_balance
        FROM wallets
        WHERE workshop_id = v_workshop_id;

        IF v_wallet_id IS NOT NULL THEN
            v_new_balance := v_old_balance + v_amount;
            v_tx_code := 'TX-MKT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || SUBSTRING(NEW.id::text, 1, 8);

            -- Tambah saldo di dompet
            UPDATE wallets
            SET current_balance = v_new_balance,
                total_earned = total_earned + v_amount,
                updated_at = NOW()
            WHERE id = v_wallet_id;

            -- Catat entri jurnal transaksi
            INSERT INTO wallet_transactions (
                wallet_id,
                reference_pickup_stop_id,
                transaction_code,
                transaction_type,
                amount,
                balance_before,
                balance_after,
                description,
                created_at
            ) VALUES (
                v_wallet_id,
                NEW.id,
                v_tx_code,
                'kredit_valorisasi',
                v_amount,
                v_old_balance,
                v_new_balance,
                'Insentif valorisasi residu marmer ' || v_tonnage || ' ton',
                NOW()
            );
        END IF;

    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_after_pickup_stop_update ON pickup_stops;
CREATE TRIGGER trg_after_pickup_stop_update
AFTER UPDATE ON pickup_stops
FOR EACH ROW
EXECUTE FUNCTION trg_update_wallet_on_pickup();
