# 📂 Dokumentasi Basis Data Terpadu: SI-MUKTI Tulungagung
**Sistem Informasi Geospasial dan Ketertelusuran Digital untuk Valorisasi Limbah serta Peningkatan Daya Saing UMKM Marmer Tulungagung**  
**Subtema LKTIN UNIMED 2026:** Digitalisasi Ekonomi, UMKM, dan Pemberdayaan Daerah 3T  
**Dokumen Referensi:** [`../PRD.md`](../PRD.md)

---

## 📌 Daftar Berkas Basis Data

| Nama Berkas | Format | Deskripsi & Fungsi |
| :--- | :--- | :--- |
| **[`ERD_DATABASE.md`](./ERD_DATABASE.md)** | Markdown | **Dokumentasi Lengkap ERD & Kamus Data**. Berisi diagram relasi Mermaid, definisi field, tipe data, indeks spasial GIST, dan constraint bisnis. |
| **[`01_schema_postgis.sql`](./01_schema_postgis.sql)** | SQL (PostgreSQL 16+) | **DDL Produksi PostgreSQL + PostGIS**. 15 tabel lengkap dengan ekstensi spatial, ENUM, tipe `GEOMETRY(Point, 4326)`, dan indeks spasial GIST. |
| **[`02_views_and_functions.sql`](./02_views_and_functions.sql)** | SQL (PostgreSQL 16+) | **View Spasial, Fungsi Geo-Matching & Trigger Keuangan**. Berisi query layer peta Web-GIS (`v_gis_active_waste_map`), fungsi radius (`fn_find_nearby_waste`), dan auto-kredit saldo MUKTI-Pay saat penjemputan limbah. |
| **[`03_seed_data.sql`](./03_seed_data.sql)** | SQL (PostgreSQL 16+) | **Data Awal Riil Sentra Campurdarat & Besole**. Data profil bengkel Pak Supardi, offtaker PT Sentosa Teraso, sertifikasi uji lab SNI 03-0394, dan paspor digital QR. |
| **[`04_schema_sqlite.sql`](./04_schema_sqlite.sql)** | SQL (SQLite 3) | **Skema Portabel Standalone**. Untuk demonstrasi dan uji coba cepat di lingkungan lokal tanpa konfigurasi PostgreSQL. |
| **[`test_database.py`](./test_database.py)** | Python Script | **Suite Pengujian Otomatis**. Menginisialisasi basis data SQLite lokal, mengisi seed data, menjalankan query spasial Haversine, dan memvalidasi seluruh formula PRD. |
| **[`docker-compose.yml`](./docker-compose.yml)** | YAML | **Konfigurasi Satu-Klik Docker**. Menjalankan PostgreSQL 16 + PostGIS 3.4 dan pgAdmin 4 secara otomatis menginisialisasi skema dan seed data. |

---

## 🚀 Cara Menjalankan & Menguji Basis Data

### Opsi 1: Uji Coba Cepat (Zero Dependency dengan Python & SQLite)
Cukup jalankan skrip pengujian otomatis melalui terminal/command prompt:
```bash
python 06_Database/test_database.py
```
Skrip ini akan secara otomatis:
1. Membaca skema `04_schema_sqlite.sql` dan membuat berkas database `simukti.db`.
2. Mengisi data sampel persona pengrajin Campurdarat & Besole.
3. Menguji fungsionalitas layer Web-GIS, formula jarak armada truk ke bengkel terdekat, verifikasi QR Code keaslian marmer, linimasa rantai pasok, dan neraca valorisasi ekonomi Bab 7 PRD.

### Opsi 2: Lingkungan Produksi PostgreSQL + PostGIS (via Docker)
Jika ingin menjalankan server database spasial penuh dengan antarmuka grafis pgAdmin:
```bash
cd 06_Database
docker compose up -d
```
Kredensial bawaan:
* **Host:** `localhost:5432`
* **Database:** `simukti_db`
* **User:** `simukti_user`
* **Password:** `simukti_password_2026`
* **pgAdmin Dashboard:** `http://localhost:5050` (Email: `admin@simukti.tulungagung.go.id`, Password: `admin_simukti_2026`)

---

## 🏛️ Keselarasan dengan Modul PRD SI-MUKTI

```
PRD Modul 1 (MUKTI-Pengrajin)   ──► Tabel: users, workshops, waste_logs, wallets, wallet_transactions
PRD Modul 2 (MUKTI-Spasial)     ──► Tabel: offtakers, vehicles, pickup_orders, pickup_stops, regional_environmental_metrics
                                    + View: v_gis_active_waste_map, v_gis_offtaker_facilities, fn_find_nearby_waste
PRD Modul 3 (MUKTI-Trace QR)    ──► Tabel: quarry_blocks, lab_test_reports, product_passports, traceability_events
                                    + View: v_public_passport_verification
PRD Bab 7 (Model Dampak ROI)    ──► View: v_circular_economy_dashboard
```
