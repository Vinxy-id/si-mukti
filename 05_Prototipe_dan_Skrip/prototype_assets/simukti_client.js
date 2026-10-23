/**
 * SI-MUKTI Unified Database & REST API Client
 * Menjembatani antarmuka pengguna secara real-time dengan Basis Data simukti.db
 * Mendukung mode Live REST API (http://localhost:5000) dan Offline Fallback (file:///)
 */

const SIMUKTI_API_BASE = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
  ? window.location.origin
  : 'http://localhost:5000';

class SimuktiClient {
  constructor() {
    this.isApiAvailable = null;
    this.checkApi();
  }

  async checkApi() {
    try {
      const res = await fetch(`${SIMUKTI_API_BASE}/api/status`, { signal: AbortSignal.timeout(1000) });
      this.isApiAvailable = res.ok;
    } catch (e) {
      this.isApiAvailable = false;
    }
    return this.isApiAvailable;
  }

  // FR-02 & FR-06: Ambil Data Dompet MUKTI-Pay Pengrajin
  async getWallet(workshopId = 'a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa') {
    if (this.isApiAvailable) {
      try {
        const res = await fetch(`${SIMUKTI_API_BASE}/api/wallet/${workshopId}`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('API error, falling back to local DB cache:', e);
      }
    }
    // Fallback Local Storage / Memory
    const cached = localStorage.getItem('simukti_wallet');
    if (cached) return JSON.parse(cached);

    return {
      id: "f1111111-ffff-ffff-ffff-ffffffffffff",
      workshop_id: workshopId,
      current_balance: 1450000.0,
      total_earned: 2750000.0,
      total_withdrawn: 1300000.0,
      bank_name: "Bank Jatim Cabang Tulungagung",
      bank_account_number: "0182390123",
      bank_account_holder: "SUPARDI",
      transactions: [
        {
          id: "t1",
          transaction_code: "TX-MKT-20261010-0012",
          transaction_type: "kredit_valorisasi",
          amount: 450000.0,
          description: "Insentif valorisasi 3.0 ton sludge marmer Al-Barokah",
          created_at: "2026-10-10 14:30:00"
        },
        {
          id: "t2",
          transaction_code: "TX-MKT-20261002-0008",
          transaction_type: "kredit_valorisasi",
          amount: 480000.0,
          description: "Insentif valorisasi 4.0 ton afur marmer Al-Barokah",
          created_at: "2026-10-02 11:15:00"
        }
      ]
    };
  }

  // FR-06: Tarik Dana ke Rekening Bank Jatim
  async withdraw(amount, workshopId = 'a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa') {
    if (this.isApiAvailable) {
      try {
        const res = await fetch(`${SIMUKTI_API_BASE}/api/wallet/withdraw`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ workshop_id: workshopId, amount: amount })
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('API error, falling back:', e);
      }
    }

    // Fallback
    const wallet = await this.getWallet(workshopId);
    if (amount > wallet.current_balance) throw new Error("Saldo tidak mencukupi!");
    wallet.current_balance -= amount;
    wallet.total_withdrawn += amount;
    wallet.transactions.unshift({
      id: "t_" + Date.now(),
      transaction_code: "WD-" + new Date().toISOString().slice(0,10).replace(/-/g,'') + "-" + Math.floor(Math.random()*900+100),
      transaction_type: "penarikan_dana",
      amount: amount,
      description: `Pencairan dana ke ${wallet.bank_name} (${wallet.bank_account_number})`,
      created_at: new Date().toISOString().slice(0,19).replace('T', ' ')
    });
    localStorage.setItem('simukti_wallet', JSON.stringify(wallet));
    return { success: true, new_balance: wallet.current_balance, message: `Berhasil mencairkan Rp ${amount.toLocaleString('id-ID')}!` };
  }

  // FR-03 & FR-04: Simpan Pencatatan Residu Baru
  async createWasteLog(data) {
    if (this.isApiAvailable) {
      try {
        const res = await fetch(`${SIMUKTI_API_BASE}/api/waste-logs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('API error:', e);
      }
    }

    return {
      success: true,
      waste_id: "log_" + Date.now(),
      estimated_tonnage: data.estimated_tonnage || 3.8,
      total_value: (data.estimated_tonnage || 3.8) * (data.waste_type === 'sludge_lumpur' ? 150000 : 120000),
      message: "Residu berhasil dicatat dan dipublikasikan ke Web-GIS!"
    };
  }

  // FR-05 & FR-10: Ambil Status Armada Penjemput
  async getActivePickup() {
    if (this.isApiAvailable) {
      try {
        const res = await fetch(`${SIMUKTI_API_BASE}/api/pickup/active`);
        if (res.ok) return await res.json();
      } catch (e) {}
    }

    return {
      order_code: "TRK-20261022-001",
      plate_number: "AG 8492 UT",
      vehicle_type: "Dump Truck Colt Diesel FE 74 HD",
      driver_name: "Budi Santoso",
      driver_phone: "082143219876",
      company_name: "PT Sentosa Teraso & Paving",
      status: "dalam_perjalanan",
      e_manifest_number: "MNF-TA-20261022-0089",
      total_target_tonnage: 6.00
    };
  }

  // FR-05: Majukan Status Ritase Truk
  async advancePickupStatus() {
    if (this.isApiAvailable) {
      try {
        const res = await fetch(`${SIMUKTI_API_BASE}/api/pickup/advance-status`, { method: 'POST' });
        if (res.ok) return await res.json();
      } catch (e) {}
    }

    return {
      success: true,
      order_status: "selesai",
      message: "Penjemputan selesai! Muatan 3.5 ton ditimbang dan saldo +Rp 525.000 otomatis masuk dompet pengrajin."
    };
  }

  // FR-07, FR-08, FR-09: Ambil Data Peta Web-GIS
  async getGisMap() {
    if (this.isApiAvailable) {
      try {
        const res = await fetch(`${SIMUKTI_API_BASE}/api/gis/map`);
        if (res.ok) return await res.json();
      } catch (e) {}
    }

    // Default Fallback dari Seed Database
    return [
      {
        waste_id: "d1",
        workshop_name: "Bengkel Marmer Al-Barokah",
        owner_name: "Pak Supardi (52 thn)",
        waste_type: "sludge_lumpur",
        pin_color_category: "HIJAU_SLUDGE",
        estimated_volume_m3: 2.15,
        estimated_tonnage: 3.50,
        rate_per_ton: 150000.0,
        estimated_transaction_value_idr: 525000.0,
        latitude: -8.1633,
        longitude: 111.8594,
        subdistrict: "Campurdarat",
        village: "Desa Gamping",
        lab_cert_number: "LAB-SNI-2026/0394-081",
        lab_caco3_pct: 98.40,
        lab_moisture_pct: 14.20,
        lab_ph_level: 8.10,
        lab_purity_grade: "Grade A Super Kalsit",
        photo_url: "https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?auto=format&fit=crop&w=400&q=80"
      },
      {
        waste_id: "d3",
        workshop_name: "Bengkel Marmer & Granit Mulia",
        owner_name: "Pak Slamet Riyadi",
        waste_type: "sludge_lumpur",
        pin_color_category: "HIJAU_SLUDGE",
        estimated_volume_m3: 3.20,
        estimated_tonnage: 5.20,
        rate_per_ton: 150000.0,
        estimated_transaction_value_idr: 780000.0,
        latitude: -8.1882,
        longitude: 111.8701,
        subdistrict: "Besole",
        village: "Desa Besole",
        lab_cert_number: "LAB-SNI-2026/0394-082",
        lab_caco3_pct: 97.60,
        lab_moisture_pct: 16.50,
        lab_ph_level: 7.95,
        lab_purity_grade: "Grade A Kalsit Industri",
        photo_url: "https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?auto=format&fit=crop&w=400&q=80"
      },
      {
        waste_id: "d2",
        workshop_name: "Kerajinan Onyx Indah Lestari",
        owner_name: "Ibu Nurul Hidayati",
        waste_type: "afur_kasar",
        pin_color_category: "ORANYE_AFUR",
        estimated_volume_m3: 1.80,
        estimated_tonnage: 2.80,
        rate_per_ton: 160000.0,
        estimated_transaction_value_idr: 448000.0,
        latitude: -8.1550,
        longitude: 111.8650,
        subdistrict: "Campurdarat",
        village: "Desa Sawo",
        lab_cert_number: "LAB-SNI-2026/0394-083",
        lab_caco3_pct: 99.10,
        lab_moisture_pct: 5.20,
        lab_ph_level: 8.20,
        lab_purity_grade: "Grade A Super Kalsit",
        photo_url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80"
      }
    ];
  }

  // FR-15: Ambil Data Paspor Produk
  async getPassport(uuid = '09841-f8a4e32d-98bc-4122-8d99-7f32a00192ea') {
    if (this.isApiAvailable) {
      try {
        const res = await fetch(`${SIMUKTI_API_BASE}/api/passports/${uuid}`);
        if (res.ok) return await res.json();
      } catch (e) {}
    }

    return {
      passport_uuid: uuid,
      authenticity_seal_number: "REG-PEMKAB-TA/2026/09841",
      product_name: "Meja Bundar Solid Onyx Tulungagung",
      product_category: "Furniture & Dekorasi Interior",
      dimensions: "D: 120cm x T: 75cm, Tebal: 4cm",
      weight_kg: 185.0,
      circular_waste_recovered_pct: 100.0,
      artisan_name: "Pak Supardi",
      workshop_name: "Bengkel Marmer Al-Barokah",
      quarry_location_name: "Kuari Selatan Besole Blok 4",
      stone_variety: "Kalsit Onyx Tembus Cahaya / Java Cream",
      caco3_content_percentage: 98.40,
      finished_photo_url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
      cryptographic_signature: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855.HMAC_SIGNATURE_PEMKAB_TULUNGAGUNG",
      timeline: [
        { stage: "kuari_tambang", event_title: "Ekstraksi Bongkahan Marmer Asli", location_name: "Kuari Besole, Tulungagung", event_timestamp: "2026-08-12 08:30:00", verified_by: "Inspektur ESDM Cabang Tulungagung" },
        { stage: "bengkel_bubut", event_title: "Pembubutan & Pemahatan Kerajinan", location_name: "Bengkel Al-Barokah, Campurdarat", event_timestamp: "2026-09-20 13:00:00", verified_by: "Paguyuban Marmer Campurdarat" },
        { stage: "uji_mutu_lab", event_title: "Pengujian Spektrometri SNI 03-0394", location_name: "Balai Standardisasi Mutu Jatim", event_timestamp: "2026-10-15 11:00:00", verified_by: "Dr. Aris Munandar, S.T., M.Sc." },
        { stage: "residu_terserap", event_title: "Valorisasi 100% Residu Sirkular", location_name: "Fasilitas Paving Boyolangu", event_timestamp: "2026-10-16 09:30:00", verified_by: "Manajer Operasional PT Sentosa" }
      ]
    };
  }

  // FR-12, FR-13, FR-14: Buat Paspor Digital Baru
  async createPassport(data) {
    if (this.isApiAvailable) {
      try {
        const res = await fetch(`${SIMUKTI_API_BASE}/api/passports`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (res.ok) return await res.json();
      } catch (e) {}
    }

    const seal = `REG-PEMKAB-TA/2026/098${Math.floor(Math.random()*90+10)}`;
    return {
      success: true,
      passport_uuid: `09843-${Date.now().toString(16)}`,
      authenticity_seal_number: seal,
      message: `Paspor digital '${data.product_name}' berhasil diterbitkan dengan segel resmi ${seal}!`
    };
  }

  // FR-11 & Bab 7 PRD: Ambil Analitik Lingkungan & Neraca Ekonomi
  async getAnalytics() {
    if (this.isApiAvailable) {
      try {
        const res = await fetch(`${SIMUKTI_API_BASE}/api/analytics/circular-economy`);
        if (res.ok) return await res.json();
      } catch (e) {}
    }

    return {
      total_registered_workshops: 142,
      total_active_passports: 34,
      total_logged_waste_tons: 248.5,
      total_absorbed_waste_tons: 210.0,
      conventional_disposal_cost_saved_idr: 21000000.0,
      new_valorization_revenue_idr: 31500000.0,
      total_economic_surplus_idr: 52500000.0,
      co2_reduction_kg: 8022.0
    };
  }
}

// Global instance
window.simukti = new SimuktiClient();
