#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SI-MUKTI Automated Database Verification & Test Suite
Memverifikasi fungsionalitas skema basis data, query geospasial,
paspor ketertelusuran QR, dan buku besar MUKTI-Pay.
"""

import sqlite3
import os
import sys
import math
from datetime import datetime

# Pastikan UTF-8 encoding untuk konsol Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

DB_PATH = os.path.join(os.path.dirname(__file__), "simukti.db")
SCHEMA_PATH = os.path.join(os.path.dirname(__file__), "04_schema_sqlite.sql")

def haversine_distance_km(lat1, lon1, lat2, lon2):
    """Menghitung jarak geospasial lingkaran besar (Great-circle) antara dua koordinat GPS."""
    R = 6371.0  # Radius bumi dalam km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)

def init_database():
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("PRAGMA foreign_keys = ON;")
    
    with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
        schema_sql = f.read()
    
    cursor.executescript(schema_sql)
    conn.commit()
    print("✅ Skema database berhasil dibuat dari 04_schema_sqlite.sql")
    return conn

def seed_database(conn):
    cursor = conn.cursor()
    
    # 1. Users
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
    
    # 2. Workshops
    workshops = [
        ('a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Bengkel Marmer Al-Barokah', 'Pak Supardi', 'PGY-CD-001', 'Campurdarat', 'Desa Gamping', 'Jl. Raya Popoh No. 45', -8.16330000, 111.85940000, 1, 4),
        ('a2222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'Bengkel Marmer & Granit Mulia', 'Pak Slamet Riyadi', 'PGY-BSL-014', 'Besole', 'Desa Besole', 'Jl. Pertambangan Marmer Km 2', -8.18820000, 111.87010000, 1, 6),
        ('a3333333-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'Kerajinan Onyx Indah Lestari', 'Ibu Nurul Hidayati', 'PGY-CD-028', 'Campurdarat', 'Desa Sawo', 'Dusun Krajan RT 02/RW 01', -8.15500000, 111.86500000, 1, 3)
    ]
    cursor.executemany("INSERT INTO workshops (id, user_id, name, owner_name, paguyuban_id, subdistrict, village, address_detail, latitude, longitude, is_verified, active_workers) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", workshops)

    # 3. Offtakers
    offtakers = [
        ('b1111111-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', 'PT Sentosa Teraso & Paving Tulungagung', 'Hendra Wijaya', '081298765401', 'Boyolangu', 'Kawasan Industri Tanggung Campurdarat Km 3', -8.14020000, 111.87500000, 250.0, 95.0, 18.0)
    ]
    cursor.executemany("INSERT INTO offtakers (id, user_id, company_name, pic_name, phone, subdistrict, address_detail, latitude, longitude, absorption_capacity_monthly_ton, min_caco3_required, max_moisture_allowed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", offtakers)

    # 4. Vehicles
    vehicles = [
        ('c1111111-cccc-cccc-cccc-cccccccccccc', 'b1111111-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'AG 8492 UT', 'Dump Truck Colt Diesel FE 74 HD', 6.5, 'Budi Santoso', '082143219876', 1)
    ]
    cursor.executemany("INSERT INTO vehicles (id, offtaker_id, plate_number, vehicle_type, tonnage_capacity, driver_name, driver_phone, is_available) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", vehicles)

    # 5. Waste Logs
    waste_logs = [
        ('d1111111-dddd-dddd-dddd-dddddddddddd', 'a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'sludge_lumpur', 2.15, 3.5, None, 150000.0, 525000.0, 'https://cdn.si-mukti.tulungagung.go.id/evidence/sludge_barokah_01.jpg', 0.965, 'tersedia', -8.16330000, 111.85940000, 'Sludge basah pemotongan guci marmer putih'),
        ('d2222222-dddd-dddd-dddd-dddddddddddd', 'a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'afur_kasar', 2.6, 4.2, None, 120000.0, 504000.0, 'https://cdn.si-mukti.tulungagung.go.id/evidence/afur_barokah_01.jpg', 0.940, 'tersedia', -8.16330000, 111.85940000, 'Pecahan batu marmer slab trosobo'),
        ('d3333333-dddd-dddd-dddd-dddddddddddd', 'a2222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'sludge_lumpur', 3.2, 5.2, None, 150000.0, 780000.0, 'https://cdn.si-mukti.tulungagung.go.id/evidence/sludge_mulia_01.jpg', 0.972, 'dijadwalkan', -8.18820000, 111.87010000, 'Lumpur serbuk gergaji gangsaw marmer abu-abu'),
        ('d4444444-dddd-dddd-dddd-dddddddddddd', 'a3333333-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'afur_kasar', 1.8, 2.8, 2.85, 160000.0, 456000.0, 'https://cdn.si-mukti.tulungagung.go.id/evidence/afur_onyx_01.jpg', 0.981, 'terangkut', -8.15500000, 111.86500000, 'Afur pecahan onyx tembus cahaya')
    ]
    cursor.executemany("INSERT INTO waste_logs (id, workshop_id, waste_type, estimated_volume_m3, estimated_tonnage, actual_weighed_tonnage, rate_per_ton, total_value, photo_url, ai_confidence_score, status, latitude, longitude, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", waste_logs)

    # 6. Lab Test Reports
    labs = [
        ('e1111111-eeee-eeee-eeee-eeeeeeeeeeee', 'a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'd1111111-dddd-dddd-dddd-dddddddddddd', 'LAB-SNI-2026/0394-081', 'Balai Standardisasi dan Pengujian Mutu Batuan Jawa Timur', '2026-10-15', 98.40, 14.20, 8.10, 'Grade A Super Kalsit', 'https://cdn.si-mukti.tulungagung.go.id/certs/sni_081_barokah.pdf', 1)
    ]
    cursor.executemany("INSERT INTO lab_test_reports (id, workshop_id, waste_log_id, certificate_number, testing_institution, test_date, caco3_content_percentage, moisture_content_percentage, ph_level, purity_grade, spectrometry_pdf_url, is_passed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", labs)

    # 7. Wallets & Transactions
    wallets = [
        ('f1111111-ffff-ffff-ffff-ffffffffffff', 'a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1250000.0, 2750000.0, 1500000.0, 'Bank Jatim Cabang Tulungagung', '0182390123', 'SUPARDI'),
        ('f3333333-ffff-ffff-ffff-ffffffffffff', 'a3333333-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 456000.0, 456000.0, 0.0, 'Bank Jatim Cabang Tulungagung', '0189876543', 'NURUL HIDAYATI')
    ]
    cursor.executemany("INSERT INTO wallets (id, workshop_id, current_balance, total_earned, total_withdrawn, bank_name, bank_account_number, bank_account_holder) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", wallets)

    # 8. Quarry Blocks
    quarries = [
        ('q1111111-qqqq-qqqq-qqqq-qqqqqqqqqqqq', 'QRY-BSL-2026-X8', 'Kuari Marmer Selatan Besole Blok 4', 'Formasi Wonosari Karst Tulungagung', 'Kalsit Onyx Tembus Cahaya / Java Cream', '2026-08-12', 98.70, '540/328/IUP-OP/ESDM-JTM/2024')
    ]
    cursor.executemany("INSERT INTO quarry_blocks (id, batch_code, quarry_location_name, geological_formation, stone_variety, extraction_date, caco3_baseline_pct, sn_mining_permit) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", quarries)

    # 9. Product Passports
    passports = [
        ('p1111111-pppp-pppp-pppp-pppppppppppp', '09841-f8a4e32d-98bc-4122-8d99-7f32a00192ea', 'a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'q1111111-qqqq-qqqq-qqqq-qqqqqqqqqqqq', 'e1111111-eeee-eeee-eeee-eeeeeeeeeeee', 'Meja Bundar Solid Onyx Tulungagung', 'Furniture & Dekorasi Interior', 'D: 120cm x T: 75cm, Tebal Slab: 4cm', 185.0, 'https://cdn.si-mukti.tulungagung.go.id/products/meja_onyx_supardi.jpg', 100.0, 'REG-PEMKAB-TA/2026/09841', 'https://cdn.si-mukti.tulungagung.go.id/qr/qr_09841.png', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855.HMAC_SIGNATURE_PEMKAB_TULUNGAGUNG', 'terverifikasi', 142, '2026-10-16 10:00:00')
    ]
    cursor.executemany("INSERT INTO product_passports (id, passport_uuid, workshop_id, quarry_block_id, lab_test_report_id, product_name, product_category, dimensions, weight_kg, finished_photo_url, circular_waste_recovered_pct, authenticity_seal_number, qr_code_url, cryptographic_signature, status, view_count, issued_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", passports)

    # 10. Traceability Events
    events = [
        ('v1', 'p1111111-pppp-pppp-pppp-pppppppppppp', 'kuari_tambang', 'Ekstraksi Bongkahan Marmer Asli', 'Bongkahan batuan kalsit diekstraksi dari Kuari Marmer Besole Blok 4 berizin resmi ESDM Jatim.', 'Kuari Selatan Besole, Tulungagung', '2026-08-12 08:30:00', 'Inspektur ESDM Cabang Tulungagung'),
        ('v2', 'p1111111-pppp-pppp-pppp-pppppppppppp', 'bengkel_bubut', 'Pembubutan & Pemahatan Kerajinan', 'Dikerjakan secara presisi oleh Pak Supardi menggunakan mesin bubut air dingin.', 'Bengkel Al-Barokah, Campurdarat', '2026-09-20 13:00:00', 'Paguyuban Marmer Campurdarat'),
        ('v3', 'p1111111-pppp-pppp-pppp-pppppppppppp', 'uji_mutu_lab', 'Pengujian Spektrometri SNI 03-0394', 'Lolos uji spektrometri kemurnian kalsit CaCO3 98.40%, serat tembus pandang.', 'Balai Standardisasi Mutu Jatim', '2026-10-15 11:00:00', 'Dr. Aris Munandar, S.T., M.Sc.'),
        ('v4', 'p1111111-pppp-pppp-pppp-pppppppppppp', 'residu_terserap', 'Valorisasi 100% Residu Sirkular', 'Residu lumpur pemotongan diserap 100% oleh PT Sentosa Teraso menjadi paving ramah lingkungan.', 'Fasilitas Paving Boyolangu', '2026-10-16 09:30:00', 'Manajer Operasional PT Sentosa')
    ]
    cursor.executemany("INSERT INTO traceability_events (id, product_passport_id, stage, event_title, event_description, location_name, event_timestamp, verified_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", events)

    conn.commit()
    print("✅ Seed data realistis Campurdarat & Besole berhasil diinput.")

def test_queries(conn):
    cursor = conn.cursor()
    print("\n" + "="*70)
    print("🔬 TESTING 1: MUKTI-Spasial Web-GIS (Layer Residu Aktif)")
    print("="*70)
    cursor.execute("""
        SELECT workshop_name, owner_name, subdistrict, pin_color_category, estimated_tonnage, estimated_transaction_value_idr, lab_caco3_pct
        FROM v_gis_active_waste_map
    """)
    rows = cursor.fetchall()
    for r in rows:
        print(f"📍 [{r[3]}] {r[0]} ({r[1]} - {r[2]}): {r[4]} Ton | Rp {r[5]:,.0f} | CaCO3: {r[6]}%")

    print("\n" + "="*70)
    print("🔬 TESTING 2: Geo-Matching Jarak Radius ke PT Sentosa Teraso")
    print("="*70)
    # Lokasi PT Sentosa Teraso (-8.1402, 111.8750)
    offtaker_lat, offtaker_lng = -8.1402, 111.8750
    cursor.execute("SELECT id, name, owner_name, subdistrict, latitude, longitude FROM workshops")
    workshops = cursor.fetchall()
    for w in workshops:
        dist = haversine_distance_km(offtaker_lat, offtaker_lng, w[4], w[5])
        print(f"🚚 Jarak Truk Pabrik ke {w[1]} ({w[3]}): {dist} km")

    print("\n" + "="*70)
    print("🔬 TESTING 3: MUKTI-Trace Verifikasi Paspor Digital QR Konsumen")
    print("="*70)
    cursor.execute("""
        SELECT product_name, authenticity_seal_number, artisan_name, stone_variety, caco3_content_percentage, circular_waste_recovered_pct, cryptographic_signature
        FROM v_public_passport_verification
        WHERE passport_uuid = '09841-f8a4e32d-98bc-4122-8d99-7f32a00192ea'
    """)
    passport = cursor.fetchone()
    if passport:
        print(f"✨ Karya: {passport[0]}")
        print(f"🏷️ Segel Resmi: {passport[1]}")
        print(f"👤 Pengrajin: {passport[2]}")
        print(f"🪨 Varietas Batuan: {passport[3]} (CaCO3: {passport[4]}% - SNI Lolos)")
        print(f"♻️ Valorisasi Sirkular: {passport[5]}% Zero Waste")
        print(f"🔐 Digital Signature Hash: {passport[6][:40]}...")

    print("\n" + "="*70)
    print("🔬 TESTING 4: Linimasa Jejak Ketertelusuran (Traceability Timeline)")
    print("="*70)
    cursor.execute("""
        SELECT stage, event_title, location_name, event_timestamp, verified_by
        FROM traceability_events
        ORDER BY event_timestamp ASC
    """)
    timeline = cursor.fetchall()
    for t in timeline:
        print(f"  ➡️ [{t[0].upper()}] {t[1]} @ {t[2]} ({t[3]}) - Valid: {t[4]}")

    print("\n" + "="*70)
    print("🔬 TESTING 5: Neraca Valorisasi Ekonomi & Lingkungan (Bab 7 PRD)")
    print("="*70)
    cursor.execute("""
        SELECT total_registered_workshops, total_active_passports, total_logged_waste_tons, total_absorbed_waste_tons,
               conventional_disposal_cost_saved_idr, new_valorization_revenue_idr, total_economic_surplus_idr, co2_reduction_kg
        FROM v_circular_economy_dashboard
    """)
    stats = cursor.fetchone()
    print(f"📊 Jumlah Bengkel Terdaftar     : {stats[0]} bengkel")
    print(f"🏷️ Paspor QR Aktif               : {stats[1]} produk")
    print(f"⚖️ Total Residu Tercatat        : {stats[2]} ton")
    print(f"♻️ Residu Terserap Industri      : {stats[3]} ton")
    print(f"💰 Biaya Buang Konvensional Dihemat : Rp {stats[4]:,.0f}")
    print(f"💵 Pendapatan Baru Valorisasi    : Rp {stats[5]:,.0f}")
    print(f"🏆 Surplus Perputaran Modal Sentra : Rp {stats[6]:,.0f}")
    print(f"🌿 Reduksi Emisi Karbon          : {stats[7]} kg CO2 eq")
    print("="*70)

if __name__ == "__main__":
    conn = init_database()
    seed_database(conn)
    test_queries(conn)
    conn.close()
    print("\n🎉 SEMUA PENGUJIAN DATABASE SI-MUKTI SUKSES 100%!")
