#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SI-MUKTI Full Database Seeder (SQLite 3)
Memastikan seluruh tabel, view, dan data riil PRD Tulungagung
tersedia lengkap di 06_Database/simukti.db
"""

import sqlite3
import os
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

DB_PATH = os.path.join(os.path.dirname(__file__), "simukti.db")
SCHEMA_PATH = os.path.join(os.path.dirname(__file__), "04_schema_sqlite.sql")

def seed_all():
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("PRAGMA foreign_keys = ON;")

    # 1. Load Schema
    with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
        cursor.executescript(f.read())

    # 2. Users (Pentahelix)
    users = [
        ('11111111-1111-1111-1111-111111111111', '081234567801', 'Pak Supardi', 'pengrajin', 'active'),
        ('22222222-2222-2222-2222-222222222222', '081234567802', 'Pak Slamet Riyadi', 'pengrajin', 'active'),
        ('33333333-3333-3333-3333-333333333333', '081234567803', 'Ibu Nurul Hidayati', 'pengrajin', 'active'),
        ('44444444-4444-4444-4444-444444444444', '081298765401', 'Hendra Wijaya', 'offtaker', 'active'),
        ('55555555-5555-5555-5555-555555555555', '081133445501', 'Ir. Bambang Sulistyo', 'regulator_pemkab', 'active'),
        ('66666666-6666-6666-6666-666666666666', '081211223344', 'Dr. Aris Munandar, S.T., M.Sc.', 'laboratorium', 'active'),
        ('77777777-7777-7777-7777-777777777777', '081355667788', 'Maya Arisanti, IAI', 'konsumen', 'active')
    ]
    cursor.executemany("INSERT INTO users (id, phone_number, full_name, role, status) VALUES (?, ?, ?, ?, ?)", users)

    # 3. Workshops (Campurdarat & Besole)
    workshops = [
        ('a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Bengkel Marmer Al-Barokah', 'Pak Supardi', 'PGY-CD-001', 'Campurdarat', 'Desa Gamping', 'Jl. Raya Popoh No. 45, Sentra Bubut Karst', -8.16330000, 111.85940000, 1, 4),
        ('a2222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'Bengkel Marmer & Granit Mulia', 'Pak Slamet Riyadi', 'PGY-BSL-014', 'Besole', 'Desa Besole', 'Jl. Pertambangan Marmer Besole Km 2', -8.18820000, 111.87010000, 1, 6),
        ('a3333333-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'Kerajinan Onyx Indah Lestari', 'Ibu Nurul Hidayati', 'PGY-CD-028', 'Campurdarat', 'Desa Sawo', 'Dusun Krajan RT 02/RW 01', -8.15500000, 111.86500000, 1, 3)
    ]
    cursor.executemany("INSERT INTO workshops (id, user_id, name, owner_name, paguyuban_id, subdistrict, village, address_detail, latitude, longitude, is_verified, active_workers) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", workshops)

    # 4. Offtakers
    offtakers = [
        ('b1111111-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', 'PT Sentosa Teraso & Paving Tulungagung', 'Hendra Wijaya', '081298765401', 'Boyolangu', 'Kawasan Industri Tanggung Campurdarat Km 3', -8.14020000, 111.87500000, 250.00, 95.00, 18.00),
        ('b2222222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', None, 'CV Tulungagung Agro Kalsium Mandiri', 'Bambang Irawan', '081399887766', 'Besole', 'Jl. Lintas Selatan Koridor Popoh', -8.19200000, 111.86200000, 120.00, 92.00, 25.00)
    ]
    cursor.executemany("INSERT INTO offtakers (id, user_id, company_name, pic_name, phone, subdistrict, address_detail, latitude, longitude, absorption_capacity_monthly_ton, min_caco3_required, max_moisture_allowed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", offtakers)

    # 5. Vehicles (Armada Truk Dump)
    vehicles = [
        ('c1111111-cccc-cccc-cccc-cccccccccccc', 'b1111111-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'AG 8492 UT', 'Dump Truck Colt Diesel FE 74 HD', 6.50, 'Budi Santoso', '082143219876', 1),
        ('c2222222-cccc-cccc-cccc-cccccccccccc', 'b1111111-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'AG 9012 UP', 'Dump Truck Isuzu Elf NMR 71', 5.50, 'Eko Prasetyo', '082156781234', 1)
    ]
    cursor.executemany("INSERT INTO vehicles (id, offtaker_id, plate_number, vehicle_type, tonnage_capacity, driver_name, driver_phone, is_available) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", vehicles)

    # 6. Waste Logs (Pencatatan Residu & AI Volumetrik)
    waste_logs = [
        ('d1111111-dddd-dddd-dddd-dddddddddddd', 'a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'sludge_lumpur', 2.150, 3.50, None, 150000.00, 525000.00, 'https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?auto=format&fit=crop&w=400&q=80', 0.965, None, 'tersedia', -8.16330000, 111.85940000, 'Sludge basah hasil pembubutan guci marmer putih, diendapkan 24 jam dalam bak terpal'),
        ('d2222222-dddd-dddd-dddd-dddddddddddd', 'a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'afur_kasar', 2.600, 4.20, None, 120000.00, 504000.00, 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80', 0.940, None, 'tersedia', -8.16330000, 111.85940000, 'Pecahan batu marmer slab trosobo ukuran 5-15 cm cocok untuk agregat teraso'),
        ('d3333333-dddd-dddd-dddd-dddddddddddd', 'a2222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'sludge_lumpur', 3.200, 5.20, None, 150000.00, 780000.00, 'https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?auto=format&fit=crop&w=400&q=80', 0.972, None, 'dijadwalkan', -8.18820000, 111.87010000, 'Lumpur serbuk gergaji gangsaw marmer abu-abu'),
        ('d4444444-dddd-dddd-dddd-dddddddddddd', 'a3333333-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'afur_kasar', 1.800, 2.80, 2.85, 160000.00, 456000.00, 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80', 0.981, None, 'terangkut', -8.15500000, 111.86500000, 'Afur pecahan onyx tembus cahaya grade A')
    ]
    cursor.executemany("INSERT INTO waste_logs (id, workshop_id, waste_type, estimated_volume_m3, estimated_tonnage, actual_weighed_tonnage, rate_per_ton, total_value, photo_url, ai_confidence_score, ai_bounding_polygon, status, latitude, longitude, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", waste_logs)

    # 7. Lab Test Reports (SNI 03-0394)
    labs = [
        ('e1111111-eeee-eeee-eeee-eeeeeeeeeeee', 'a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'd1111111-dddd-dddd-dddd-dddddddddddd', 'LAB-SNI-2026/0394-081', 'Balai Standardisasi dan Pengujian Mutu Batuan Jawa Timur', '2026-10-15', 98.40, 14.20, 8.10, 'Grade A Super Kalsit', 'https://cdn.si-mukti.tulungagung.go.id/certs/sni_081_barokah.pdf', 1),
        ('e2222222-eeee-eeee-eeee-eeeeeeeeeeee', 'a2222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'd3333333-dddd-dddd-dddd-dddddddddddd', 'LAB-SNI-2026/0394-082', 'Balai Standardisasi dan Pengujian Mutu Batuan Jawa Timur', '2026-10-18', 97.60, 16.50, 7.95, 'Grade A Kalsit Industri', 'https://cdn.si-mukti.tulungagung.go.id/certs/sni_082_mulia.pdf', 1)
    ]
    cursor.executemany("INSERT INTO lab_test_reports (id, workshop_id, waste_log_id, certificate_number, testing_institution, test_date, caco3_content_percentage, moisture_content_percentage, ph_level, purity_grade, spectrometry_pdf_url, is_passed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", labs)

    # 8. Wallets & Transactions
    wallets = [
        ('f1111111-ffff-ffff-ffff-ffffffffffff', 'a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1250000.00, 2750000.00, 1500000.00, 'Bank Jatim Cabang Tulungagung', '0182390123', 'SUPARDI'),
        ('f2222222-ffff-ffff-ffff-ffffffffffff', 'a2222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 850000.00, 1850000.00, 1000000.00, 'Bank BRI Unit Campurdarat', '654301009876532', 'SLAMET RIYADI'),
        ('f3333333-ffff-ffff-ffff-ffffffffffff', 'a3333333-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 456000.00, 456000.00, 0.00, 'Bank Jatim Cabang Tulungagung', '0189876543', 'NURUL HIDAYATI')
    ]
    cursor.executemany("INSERT INTO wallets (id, workshop_id, current_balance, total_earned, total_withdrawn, bank_name, bank_account_number, bank_account_holder) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", wallets)

    transactions = [
        ('t1111111-tttt-tttt-tttt-tttttttttttt', 'f1111111-ffff-ffff-ffff-ffffffffffff', None, 'TX-MKT-20261010-0012', 'kredit_valorisasi', 450000.00, 800000.00, 1250000.00, 'Insentif valorisasi 3.0 ton sludge marmer Al-Barokah', '2026-10-10 14:30:00'),
        ('t2222222-tttt-tttt-tttt-tttttttttttt', 'f3333333-ffff-ffff-ffff-ffffffffffff', None, 'TX-MKT-20261021-0038', 'kredit_valorisasi', 456000.00, 0.00, 456000.00, 'Insentif penyaluran 2.85 ton afur onyx ke PT Sentosa Teraso', '2026-10-21 16:15:00')
    ]
    cursor.executemany("INSERT INTO wallet_transactions (id, wallet_id, reference_pickup_stop_id, transaction_code, transaction_type, amount, balance_before, balance_after, description, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", transactions)

    # 9. Quarry Blocks (Asal Kuari Karst Tulungagung)
    quarries = [
        ('q1111111-qqqq-qqqq-qqqq-qqqqqqqqqqqq', 'QRY-BSL-2026-X8', 'Kuari Marmer Selatan Besole Blok 4', 'Formasi Wonosari Karst Tulungagung', 'Kalsit Onyx Tembus Cahaya / Java Cream', '2026-08-12', 98.70, '540/328/IUP-OP/ESDM-JTM/2024'),
        ('q2222222-qqqq-qqqq-qqqq-qqqqqqqqqqqq', 'QRY-CD-2026-A2', 'Kuari Gamping Campurdarat Sektor Barat', 'Formasi Karst Campurdarat Selatan', 'Marmer Bintik Trosobo Natural', '2026-09-05', 97.90, '540/112/SIPB/ESDM-JTM/2025')
    ]
    cursor.executemany("INSERT INTO quarry_blocks (id, batch_code, quarry_location_name, geological_formation, stone_variety, extraction_date, caco3_baseline_pct, sn_mining_permit) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", quarries)

    # 10. Product Passports (MUKTI-Trace)
    passports = [
        ('p1111111-pppp-pppp-pppp-pppppppppppp', '09841-f8a4e32d-98bc-4122-8d99-7f32a00192ea', 'a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'q1111111-qqqq-qqqq-qqqq-qqqqqqqqqqqq', 'e1111111-eeee-eeee-eeee-eeeeeeeeeeee', 'Meja Bundar Solid Onyx Tulungagung', 'Furniture & Dekorasi Interior', 'D: 120cm x T: 75cm, Tebal: 4cm', 185.00, 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80', 100.00, 'REG-PEMKAB-TA/2026/09841', 'https://cdn.si-mukti.tulungagung.go.id/qr/qr_09841.png', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855.HMAC_SIGNATURE_PEMKAB_TULUNGAGUNG', 'terverifikasi', 142, '2026-10-16 10:00:00'),
        ('p2222222-pppp-pppp-pppp-pppppppppppp', '09842-c12e87ab-43dd-4519-91aa-5b23d90211fc', 'a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'q2222222-qqqq-qqqq-qqqq-qqqqqqqqqqqq', 'e1111111-eeee-eeee-eeee-eeeeeeeeeeee', 'Wastafel Marmer Trosobo Natural Edge', 'Sanitari & Kamar Mandi Mewah', 'P: 55cm x L: 45cm x T: 15cm', 42.00, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80', 100.00, 'REG-PEMKAB-TA/2026/09842', 'https://cdn.si-mukti.tulungagung.go.id/qr/qr_09842.png', '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a.HMAC_SIGNATURE_PEMKAB_TULUNGAGUNG', 'aktif', 67, '2026-10-19 14:00:00')
    ]
    cursor.executemany("INSERT INTO product_passports (id, passport_uuid, workshop_id, quarry_block_id, lab_test_report_id, product_name, product_category, dimensions, weight_kg, finished_photo_url, circular_waste_recovered_pct, authenticity_seal_number, qr_code_url, cryptographic_signature, status, view_count, issued_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", passports)

    # 11. Traceability Timeline Events
    events = [
        ('v1', 'p1111111-pppp-pppp-pppp-pppppppppppp', 'kuari_tambang', 'Ekstraksi Bongkahan Marmer Asli', 'Bongkahan batuan kalsit diekstraksi dari Kuari Marmer Besole Blok 4 berizin resmi ESDM Jatim.', 'Kuari Selatan Besole, Tulungagung', '2026-08-12 08:30:00', 'https://cdn.si-mukti.tulungagung.go.id/timeline/kuari_besole.jpg', 'Inspektur ESDM Cabang Tulungagung'),
        ('v2', 'p1111111-pppp-pppp-pppp-pppppppppppp', 'bengkel_bubut', 'Pembubutan & Pemahatan Kerajinan', 'Dikerjakan secara presisi oleh Pak Supardi menggunakan teknologi bubut air dingin.', 'Bengkel Al-Barokah, Campurdarat', '2026-09-20 13:00:00', 'https://cdn.si-mukti.tulungagung.go.id/timeline/bubut_supardi.jpg', 'Paguyuban Marmer Campurdarat'),
        ('v3', 'p1111111-pppp-pppp-pppp-pppppppppppp', 'uji_mutu_lab', 'Pengujian Spektrometri SNI 03-0394', 'Lolos uji spektrometri kemurnian kalsit CaCO3 98.40%, serat tembus pandang tanpa resin.', 'Balai Standardisasi Mutu Jatim', '2026-10-15 11:00:00', 'https://cdn.si-mukti.tulungagung.go.id/timeline/lab_spektro.jpg', 'Dr. Aris Munandar, S.T., M.Sc.'),
        ('v4', 'p1111111-pppp-pppp-pppp-pppppppppppp', 'residu_terserap', 'Valorisasi 100% Residu Sirkular', 'Residu lumpur pemotongan diserap 100% oleh PT Sentosa Teraso menjadi paving ramah lingkungan.', 'Fasilitas Paving Boyolangu', '2026-10-16 09:30:00', 'https://cdn.si-mukti.tulungagung.go.id/timeline/teraso_paving.jpg', 'Manajer Operasional PT Sentosa')
    ]
    cursor.executemany("INSERT INTO traceability_events (id, product_passport_id, stage, event_title, event_description, location_name, event_timestamp, evidence_photo_url, verified_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", events)

    # 12. Pickup Orders & Multi-stop Logistics
    orders = [
        ('o1111111-oooo-oooo-oooo-oooooooooooo', 'TRK-20261022-001', 'b1111111-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'c1111111-cccc-cccc-cccc-cccccccccccc', '2026-10-22 08:00:00', None, 'dalam_perjalanan', 6.00, 2.85, '{"type": "LineString", "coordinates": [[111.875, -8.140], [111.865, -8.155], [111.859, -8.163]]}', 12.40, 47.30, 'MNF-TA-20261022-0089')
    ]
    cursor.executemany("INSERT INTO pickup_orders (id, order_code, offtaker_id, vehicle_id, scheduled_pickup_date, actual_pickup_date, status, total_target_tonnage, total_realized_tonnage, route_optimized_geojson, total_distance_km, co2_emission_saved_kg, e_manifest_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", orders)

    stops = [
        ('s1111111-ssss-ssss-ssss-ssssssssssss', 'o1111111-oooo-oooo-oooo-oooooooooooo', 'd4444444-dddd-dddd-dddd-dddddddddddd', 1, 'selesai_muat', '2026-10-22 09:15:00', '2026-10-22 09:40:00', 2850.00, 'https://cdn.si-mukti.tulungagung.go.id/slip/weigh_slip_0089_1.jpg', 'Muatan afur batu onyx kering, akses jalan lancar'),
        ('s2222222-ssss-ssss-ssss-ssssssssssss', 'o1111111-oooo-oooo-oooo-oooooooooooo', 'd1111111-dddd-dddd-dddd-dddddddddddd', 2, 'menunggu', None, None, None, None, 'Target penjemputan kedua Bengkel Al-Barokah')
    ]
    cursor.executemany("INSERT INTO pickup_stops (id, pickup_order_id, waste_log_id, stop_sequence, status, arrived_at, weighed_at, measured_weight_kg, weighing_slip_photo_url, driver_notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", stops)

    # 13. Regional Environmental Metrics (Bab 7 PRD)
    metrics = [
        ('m1111111-mmmm-mmmm-mmmm-mmmmmmmmmmmm', '2026-10-01', 'Campurdarat', 68.50, 62.00, 62.00, 2368.40, 15500000.00, 31),
        ('m2222222-mmmm-mmmm-mmmm-mmmmmmmmmmmm', '2026-10-01', 'Besole', 45.00, 41.50, 41.50, 1585.30, 10375000.00, 22)
    ]
    cursor.executemany("INSERT INTO regional_environmental_metrics (id, period_month, subdistrict, total_waste_generated_tons, total_waste_absorbed_tons, river_dumping_prevented_tons, carbon_emissions_reduced_kg, economic_surplus_generated_idr, active_participating_workshops) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", metrics)

    conn.commit()
    conn.close()
    print("✅ Berhasil mengisi basis data simukti.db dengan 100% data riil PRD Tulungagung!")

if __name__ == '__main__':
    seed_all()
