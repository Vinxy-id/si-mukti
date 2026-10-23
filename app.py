#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SI-MUKTI Full-Stack Web & REST API Server (Python Flask)
Menghubungkan Antarmuka Pengguna (UI/UX) secara langsung dengan Basis Data simukti.db
Berdasarkan Product Requirement Document (PRD.md Versi 1.0)
"""

import os
import sys
import sqlite3
import json
import math
import uuid
import hashlib
from datetime import datetime
from flask import Flask, jsonify, request, send_from_directory, render_template_string

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DB_PATH = os.path.join(BASE_DIR, "06_Database", "simukti.db")

app = Flask(__name__, static_folder=BASE_DIR)

# Enable CORS for all responses
@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def haversine_km(lat1, lon1, lat2, lon2):
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)

# ============================================================================
# 1. STATIC PAGES ROUTES
# ============================================================================
@app.route('/')
def index():
    return send_from_directory(BASE_DIR, 'interactive_prototype_showcase.html')

@app.route('/prototype_assets/<path:filename>')
def serve_assets(filename):
    return send_from_directory(os.path.join(BASE_DIR, 'prototype_assets'), filename)

# ============================================================================
# 2. REST API ROUTES (Connected directly to simukti.db)
# ============================================================================

# API: Status & Metadata
@app.route('/api/status', methods=['GET'])
def api_status():
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT count(*) FROM workshops")
    num_workshops = c.fetchone()[0]
    c.execute("SELECT count(*) FROM waste_logs")
    num_waste = c.fetchone()[0]
    c.execute("SELECT count(*) FROM product_passports")
    num_passports = c.fetchone()[0]
    conn.close()

    return jsonify({
        "status": "online",
        "system": "SI-MUKTI Tulungagung Backend Service",
        "version": "1.0.0",
        "database": "simukti.db (SQLite 3)",
        "gnss_rtk_base_station": "ONLINE (Akurasi < 0.03m)",
        "counts": {
            "workshops": num_workshops,
            "waste_logs": num_waste,
            "product_passports": num_passports
        }
    })

# API: FR-07, FR-08, FR-09 (MUKTI-Spasial Web-GIS Map Pins)
@app.route('/api/gis/map', methods=['GET'])
def api_gis_map():
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM v_gis_active_waste_map")
    rows = [dict(ix) for ix in c.fetchall()]
    conn.close()
    return jsonify(rows)

# API: Offtakers & Fleet
@app.route('/api/gis/offtakers', methods=['GET'])
def api_gis_offtakers():
    conn = get_db()
    c = conn.cursor()
    c.execute("""
        SELECT o.*, count(v.id) as available_trucks
        FROM offtakers o
        LEFT JOIN vehicles v ON o.id = v.offtaker_id AND v.is_available = 1
        GROUP BY o.id
    """)
    rows = [dict(ix) for ix in c.fetchall()]
    conn.close()
    return jsonify(rows)

# API: Geo-matching radius query (FR-08 & FR-10)
@app.route('/api/gis/nearby', methods=['GET'])
def api_gis_nearby():
    lat = float(request.args.get('lat', -8.1402))
    lng = float(request.args.get('lng', 111.8750))
    radius_km = float(request.args.get('radius_km', 10.0))

    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM v_gis_active_waste_map")
    all_w = [dict(ix) for ix in c.fetchall()]
    conn.close()

    results = []
    for w in all_w:
        dist = haversine_km(lat, lng, w['latitude'], w['longitude'])
        if dist <= radius_km:
            w['distance_km'] = dist
            results.append(w)

    results.sort(key=lambda x: x['distance_km'])
    return jsonify(results)

# API: FR-02 & FR-06 (MUKTI-Pay Wallet & Transactions)
@app.route('/api/wallet/<workshop_id>', methods=['GET'])
def api_get_wallet(workshop_id):
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM wallets WHERE workshop_id = ?", (workshop_id,))
    wallet = c.fetchone()
    if not wallet:
        conn.close()
        return jsonify({"error": "Wallet not found"}), 404

    wallet_dict = dict(wallet)

    c.execute("""
        SELECT * FROM wallet_transactions 
        WHERE wallet_id = ? 
        ORDER BY created_at DESC LIMIT 15
    """, (wallet_dict['id'],))
    transactions = [dict(ix) for ix in c.fetchall()]
    conn.close()

    wallet_dict['transactions'] = transactions
    return jsonify(wallet_dict)

# API: FR-06 (Withdrawal / Tarik Dana ke Bank Jatim)
@app.route('/api/wallet/withdraw', methods=['POST'])
def api_withdraw():
    data = request.json or {}
    workshop_id = data.get('workshop_id', 'a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
    amount = float(data.get('amount', 0))

    if amount <= 0:
        return jsonify({"error": "Nominal penarikan harus lebih besar dari 0"}), 400

    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM wallets WHERE workshop_id = ?", (workshop_id,))
    wallet = c.fetchone()
    if not wallet:
        conn.close()
        return jsonify({"error": "Dompet tidak ditemukan"}), 404

    current_balance = wallet['current_balance']
    if amount > current_balance:
        conn.close()
        return jsonify({"error": "Saldo tidak mencukupi"}), 400

    new_balance = current_balance - amount
    total_withdrawn = wallet['total_withdrawn'] + amount
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Update Wallet
    c.execute("""
        UPDATE wallets 
        SET current_balance = ?, total_withdrawn = ?, updated_at = ?
        WHERE id = ?
    """, (new_balance, total_withdrawn, now_str, wallet['id']))

    # Insert Withdrawal
    payout_id = str(uuid.uuid4())
    payout_code = f"WD-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:6].upper()}"
    c.execute("""
        INSERT INTO payout_withdrawals (id, wallet_id, payout_code, amount, bank_target, account_target, status, requested_at, completed_at)
        VALUES (?, ?, ?, ?, ?, ?, 'success', ?, ?)
    """, (payout_id, wallet['id'], payout_code, amount, wallet['bank_name'], wallet['bank_account_number'], now_str, now_str))

    # Insert Transaction Ledger
    tx_id = str(uuid.uuid4())
    tx_code = f"TX-MKT-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:6].upper()}"
    desc = f"Pencairan dana ke {wallet['bank_name']} ({wallet['bank_account_number']})"
    c.execute("""
        INSERT INTO wallet_transactions (id, wallet_id, transaction_code, transaction_type, amount, balance_before, balance_after, description, created_at)
        VALUES (?, ?, ?, 'penarikan_dana', ?, ?, ?, ?, ?)
    """, (tx_id, wallet['id'], tx_code, amount, current_balance, new_balance, desc, now_str))

    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "message": f"Berhasil mencairkan Rp {amount:,.0f} ke {wallet['bank_name']}",
        "new_balance": new_balance,
        "transaction_code": tx_code,
        "payout_code": payout_code
    })

# API: FR-03 & FR-04 (Pencatatan Residu Limbah Baru & AI Volumetrik)
@app.route('/api/waste-logs', methods=['POST'])
def api_create_waste_log():
    data = request.json or {}
    workshop_id = data.get('workshop_id', 'a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
    waste_type = data.get('waste_type', 'sludge_lumpur')
    vol = float(data.get('estimated_volume_m3', 2.4))
    tonnage = float(data.get('estimated_tonnage', 3.8))
    rate = 150000.0 if waste_type == 'sludge_lumpur' else 120000.0
    total_val = round(tonnage * rate, 2)
    photo_url = data.get('photo_url', 'https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?auto=format&fit=crop&w=400&q=80')
    notes = data.get('notes', 'Audit otomatis kamera AI kontur 3D')

    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT latitude, longitude FROM workshops WHERE id = ?", (workshop_id,))
    ws = c.fetchone()
    lat = ws['latitude'] if ws else -8.1633
    lng = ws['longitude'] if ws else 111.8594

    log_id = str(uuid.uuid4())
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    c.execute("""
        INSERT INTO waste_logs (
            id, workshop_id, waste_type, estimated_volume_m3, estimated_tonnage,
            rate_per_ton, total_value, photo_url, ai_confidence_score, status,
            latitude, longitude, notes, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0.982, 'tersedia', ?, ?, ?, ?, ?)
    """, (log_id, workshop_id, waste_type, vol, tonnage, rate, total_val, photo_url, lat, lng, notes, now_str, now_str))

    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "waste_id": log_id,
        "estimated_tonnage": tonnage,
        "total_value": total_val,
        "message": f"Residu {tonnage} ton berhasil tercatat dan dipublikasikan ke Web-GIS!"
    })

# API: FR-05 & FR-10 (Pelacakan Armada & Majukan Status)
@app.route('/api/pickup/active', methods=['GET'])
def api_get_active_pickup():
    conn = get_db()
    c = conn.cursor()
    c.execute("""
        SELECT p.*, v.plate_number, v.vehicle_type, v.driver_name, v.driver_phone, o.company_name
        FROM pickup_orders p
        JOIN vehicles v ON p.vehicle_id = v.id
        JOIN offtakers o ON p.offtaker_id = o.id
        WHERE p.status != 'selesai'
        LIMIT 1
    """)
    order = c.fetchone()
    if not order:
        conn.close()
        return jsonify({"message": "Tidak ada ritase aktif"}), 200

    order_dict = dict(order)
    c.execute("""
        SELECT s.*, w.name as workshop_name, w.subdistrict, w.village, wl.waste_type, wl.estimated_tonnage
        FROM pickup_stops s
        JOIN waste_logs wl ON s.waste_log_id = wl.id
        JOIN workshops w ON wl.workshop_id = w.id
        WHERE s.pickup_order_id = ?
        ORDER BY s.stop_sequence ASC
    """, (order_dict['id'],))
    stops = [dict(ix) for ix in c.fetchall()]
    conn.close()

    order_dict['stops'] = stops
    return jsonify(order_dict)

@app.route('/api/pickup/advance-status', methods=['POST'])
def api_advance_pickup():
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT id, status FROM pickup_orders WHERE status != 'selesai' LIMIT 1")
    order = c.fetchone()
    if not order:
        conn.close()
        return jsonify({"message": "Semua ritase telah selesai"}), 200

    order_id = order['id']
    curr_status = order['status']

    # Update stop sequence 2 (Bengkel Al-Barokah) to selesai muat & credit wallet
    c.execute("""
        SELECT s.id, s.waste_log_id, wl.workshop_id, wl.rate_per_ton, wl.estimated_tonnage
        FROM pickup_stops s
        JOIN waste_logs wl ON s.waste_log_id = wl.id
        WHERE s.pickup_order_id = ? AND s.stop_sequence = 2
    """, (order_id,))
    target_stop = c.fetchone()

    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    if target_stop:
        measured_kg = 3500.0  # 3.5 ton
        measured_ton = 3.5
        earned_amount = round(measured_ton * target_stop['rate_per_ton'], 2)

        # Update Stop
        c.execute("""
            UPDATE pickup_stops 
            SET status = 'selesai_muat', weighed_at = ?, measured_weight_kg = ?
            WHERE id = ?
        """, (now_str, measured_kg, target_stop['id']))

        # Update Waste Log to terangkut
        c.execute("""
            UPDATE waste_logs 
            SET status = 'terangkut', actual_weighed_tonnage = ?, total_value = ?, updated_at = ?
            WHERE id = ?
        """, (measured_ton, earned_amount, now_str, target_stop['waste_log_id']))

        # Credit Workshop Wallet automatically (Trigger equivalent)
        c.execute("SELECT id, current_balance, total_earned FROM wallets WHERE workshop_id = ?", (target_stop['workshop_id'],))
        wallet = c.fetchone()
        if wallet:
            new_bal = wallet['current_balance'] + earned_amount
            new_earned = wallet['total_earned'] + earned_amount
            c.execute("""
                UPDATE wallets 
                SET current_balance = ?, total_earned = ?, updated_at = ?
                WHERE id = ?
            """, (new_bal, new_earned, now_str, wallet['id']))

            # Record Wallet Transaction
            tx_code = f"TX-MKT-{datetime.now().strftime('%Y%m%d')}-0089"
            c.execute("""
                INSERT INTO wallet_transactions (
                    id, wallet_id, reference_pickup_stop_id, transaction_code,
                    transaction_type, amount, balance_before, balance_after,
                    description, created_at
                ) VALUES (?, ?, ?, ?, 'kredit_valorisasi', ?, ?, ?, 'Insentif penyaluran 3.5 ton sludge marmer ke PT Sentosa', ?)
            """, (str(uuid.uuid4()), wallet['id'], target_stop['id'], tx_code, earned_amount, wallet['current_balance'], new_bal, now_str))

    # Update Order to selesai
    c.execute("""
        UPDATE pickup_orders 
        SET status = 'selesai', actual_pickup_date = ?, total_realized_tonnage = 6.35, updated_at = ?
        WHERE id = ?
    """, (now_str, now_str, order_id))

    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "message": "Penjemputan selesai! Muatan 3.5 ton berhasil ditimbang dan saldo +Rp 525.000 otomatis masuk dompet pengrajin.",
        "order_status": "selesai"
    })

# API: FR-12, FR-14, FR-15 (MUKTI-Trace Digital Product Passport)
@app.route('/api/passports/<passport_uuid>', methods=['GET'])
def api_get_passport(passport_uuid):
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM v_public_passport_verification WHERE passport_uuid = ?", (passport_uuid,))
    passport = c.fetchone()
    if not passport:
        conn.close()
        return jsonify({"error": "Paspor produk tidak ditemukan"}), 404

    p_dict = dict(passport)

    # Get Traceability Timeline
    c.execute("SELECT id FROM product_passports WHERE passport_uuid = ?", (passport_uuid,))
    p_row = c.fetchone()
    c.execute("""
        SELECT * FROM traceability_events 
        WHERE product_passport_id = ? 
        ORDER BY event_timestamp ASC
    """, (p_row['id'],))
    timeline = [dict(ix) for ix in c.fetchall()]
    conn.close()

    p_dict['timeline'] = timeline
    return jsonify(p_dict)

@app.route('/api/passports', methods=['GET'])
def api_list_passports():
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM v_public_passport_verification")
    rows = [dict(ix) for ix in c.fetchall()]
    conn.close()
    return jsonify(rows)

# API: FR-12 & FR-13 (Create New Product Passport)
@app.route('/api/passports', methods=['POST'])
def api_create_passport():
    data = request.json or {}
    workshop_id = data.get('workshop_id', 'a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
    quarry_id = data.get('quarry_block_id', 'q1111111-qqqq-qqqq-qqqq-qqqqqqqqqqqq')
    name = data.get('product_name', 'Karya Seni Marmer Kustom')
    category = data.get('product_category', 'Kriya Seni & Dekorasi')
    dim = data.get('dimensions', 'T: 60cm x D: 30cm')
    weight = float(data.get('weight_kg', 45.0))
    photo = data.get('finished_photo_url', 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80')

    new_id = str(uuid.uuid4())
    passport_uuid = f"098{int(datetime.now().timestamp())%100:02d}-{str(uuid.uuid4())[:8]}-{str(uuid.uuid4())[:4]}"
    seal = f"REG-PEMKAB-TA/2026/098{int(datetime.now().timestamp())%100:02d}"
    sig = hashlib.sha256(f"{seal}:{new_id}:{name}".encode()).hexdigest() + ".HMAC_SIGNATURE_PEMKAB_TULUNGAGUNG"

    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    conn = get_db()
    c = conn.cursor()
    c.execute("""
        INSERT INTO product_passports (
            id, passport_uuid, workshop_id, quarry_block_id, lab_test_report_id,
            product_name, product_category, dimensions, weight_kg, finished_photo_url,
            circular_waste_recovered_pct, authenticity_seal_number, qr_code_url,
            cryptographic_signature, status, view_count, issued_at
        ) VALUES (
            ?, ?, ?, ?, 'e1111111-eeee-eeee-eeee-eeeeeeeeeeee',
            ?, ?, ?, ?, ?, 100.00, ?, 'https://cdn.si-mukti.tulungagung.go.id/qr/sample.png',
            ?, 'terverifikasi', 1, ?
        )
    """, (new_id, passport_uuid, workshop_id, quarry_id, name, category, dim, weight, photo, seal, sig, now_str))

    # Add Default Timeline Stage
    c.execute("""
        INSERT INTO traceability_events (
            id, product_passport_id, stage, event_title, event_description, location_name, event_timestamp, verified_by
        ) VALUES (
            ?, ?, 'kuari_tambang', 'Ekstraksi Bongkahan Marmer Asli', 'Batuan diekstraksi dari Kuari Marmer Besole Blok 4 berizin ESDM Jatim.', 'Kuari Besole, Tulungagung', ?, 'Inspektur ESDM'
        )
    """, (str(uuid.uuid4()), new_id, now_str))

    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "passport_uuid": passport_uuid,
        "authenticity_seal_number": seal,
        "message": f"Paspor digital '{name}' berhasil diterbitkan dengan segel resmi {seal}!"
    })

# API: FR-11 & Bab 7 PRD (Circular Economy Analytics)
@app.route('/api/analytics/circular-economy', methods=['GET'])
def api_analytics():
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT * FROM v_circular_economy_dashboard")
    dashboard = dict(c.fetchone() or {})
    c.execute("SELECT * FROM regional_environmental_metrics ORDER BY period_month DESC")
    metrics = [dict(ix) for ix in c.fetchall()]
    conn.close()

    dashboard['regional_metrics'] = metrics
    return jsonify(dashboard)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"🚀 SI-MUKTI Full-Stack Server berjalan di: http://localhost:{port}")
    print(f"📦 Terhubung langsung ke basis data: {DB_PATH}")
    app.run(host='0.0.0.0', port=port, debug=True)
