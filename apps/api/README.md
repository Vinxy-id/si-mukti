# 🚀 @si-mukti/api: NestJS REST API Backend Service

Backend API untuk platform **SI-MUKTI (Sistem Informasi Manajemen Spasial dan Rantai Pasok Marmer Tulungagung)**, dibangun berbasis **NestJS (TypeScript)** terintegrasi dengan **PostgreSQL 16 + PostGIS Extension** via **Drizzle ORM** ([@si-mukti/database](../../packages/database)).

---

## 🏛️ Arsitektur & Modul Sistem

Sistem backend menggunakan arsitektur modular NestJS dengan validasi ketat DTO (`class-validator`), format response standar (`{ success: boolean, data: T, message?: string }`), dan dokumentasi interaktif Swagger OpenAPI:

```
apps/api/src/
├── common/
│   ├── decorators/           # @Public(), @CurrentUser()
│   ├── filters/              # AllExceptionsFilter (Standar format galat JSON)
│   ├── guards/               # JwtAuthGuard (Validasi sesi token Bearer)
│   └── interceptors/         # TransformInterceptor (Standar envelope { success: true, data: T })
├── database/                 # DatabaseService & DatabaseModule (Drizzle ORM + PostGIS)
└── modules/
    ├── auth/                 # Otentikasi OTP WhatsApp & Penerbitan JWT Token
    ├── waste-log/            # Input Residu Limbah (Sludge/Afur) & Audit Volumetrik AI
    ├── spatial-gis/          # Mesin Spasial PostGIS ST_DWithin & GeoJSON FeatureCollection
    ├── logistics/            # Dispatch Armada Dump Truck & Auto-Credit MUKTI-Pay
    ├── passport-trace/       # Penerbitan Paspor Digital (SHA-256) & Verifikasi Publik Bebas Auth
    └── wallet/               # Dompet Digital MUKTI-Pay & Pencairan ke Bank Jatim / BRI
```

---

## 📡 Daftar Endpoint REST API (v1)

Semua endpoint diawali dengan prefix `/api/v1`:

### 1. Modul Otentikasi (`AuthModule`)
- `POST /api/v1/auth/otp-request` — Mengirimkan kode 6-digit verifikasi via WhatsApp ke nomor pengrajin/mitra.
- `POST /api/v1/auth/otp-verify` — Verifikasi kode OTP, menerbitkan JWT `accessToken` dengan payload `userId`, `role`, dan `workshopId`.
- `GET /api/v1/auth/profile` — Profil pengguna aktif, bengkel binaan, dan informasi dompet.

### 2. Modul Residu Limbah & Volumetrik AI (`WasteLogModule`)
- `POST /api/v1/waste-logs` — Catat timbulan limbah (sludge basah / afur bongkahan) dengan GPS auto-capture.
- `POST /api/v1/waste-logs/volumetric-audit` — Analisis computer vision citra bak limbah: estimasi volume m3, bulk density (1.628 ton/m3), tonase basah, dan AI bounding polygon.
- `GET /api/v1/waste-logs/workshop/:workshopId` — Riwayat pencatatan residu per bengkel.
- `GET /api/v1/waste-logs/:id` — Detail satu laporan limbah beserta hasil sertifikasi lab SNI.

### 3. Modul Geospasial Web-GIS (`SpatialGisModule`)
- `GET /api/v1/gis/active-waste` — **GeoJSON FeatureCollection** titik residu limbah aktif (Pin Hijau: Sludge, Pin Oranye: Afur) dengan filter PostGIS `ST_DWithin` & radius logistik (km).
- `GET /api/v1/gis/offtakers` — **GeoJSON FeatureCollection** pabrik pengolah (Pin Ungu: PT Sentosa Teraso & CV Agro Kalsium) beserta armada dump truck yang tersedia.
- `GET /api/v1/gis/metrics` — Telemetri dampak lingkungan regional Disperindag Tulungagung (reduksi emisi CO2 eq dan timbulan tercegah ke DAS Ngrowo).

### 4. Modul Armada & Logistik (`LogisticsModule`)
- `POST /api/v1/logistics/dispatch` — Offtaker menugaskan armada truk dump untuk penjemputan multi-stop dan menerbitkan surat e-Manifest resmi (`MNF-TA-YYYYMMDD-XXXX`).
- `PATCH /api/v1/logistics/stops/:id/complete` — **Otomatisasi MUKTI-Pay**: Sopir mengonfirmasi timbang muat riil (kg), sistem otomatis mengkreditkan saldo dompet pengrajin (`bobot x tarif`) secara instan.
- `GET /api/v1/logistics/orders` — Daftar seluruh order penjemputan armada.
- `GET /api/v1/logistics/orders/:id` — Detail order penjemputan dan urutan rute titik singgah (stops).

### 5. Modul Paspor Digital & Ketertelusuran (`PassportTraceModule`)
- `POST /api/v1/passports` — Terbitkan Paspor Digital Produk Marmer (MUKTI-Trace) lengkap dengan hitungan sirkular zero-waste, SHA-256 hash, tanda tangan HMAC-SHA256, dan segel QR Code.
- `GET /api/v1/passports/verify/:hash` — **Endpoint Publik Cepat (< 50ms, Bebas Auth)**: Pindai QR Code untuk verifikasi keaslian marmer, sertifikat SNI 03-0394, profil pengrajin, asal tambang kuari, serta tabel komparasi ilmiah terhadap batu sintetis tiruan impor.
- `GET /api/v1/passports/workshop/:workshopId` — Daftar seluruh produk bersertifikat milik bengkel pengrajin.

### 6. Modul Dompet MUKTI-Pay (`WalletModule`)
- `GET /api/v1/wallets/:workshopId` — Informasi saldo aktif, total insentif yang diperoleh, dan riwayat mutasi kas.
- `POST /api/v1/wallets/:workshopId/withdraw` — Pengajuan pencairan saldo insentif ke rekening Bank Jatim / BRI.
- `GET /api/v1/wallets/:workshopId/transactions` — Daftar seluruh riwayat transaksi mutasi kredit dan debit.

---

## 🛠️ Panduan Perintah

```bash
# 1. Jalankan unit test fungsional API
pnpm --filter @si-mukti/api test

# 2. Kompilasi NestJS untuk produksi
pnpm --filter @si-mukti/api build

# 3. Jalankan server NestJS mode development (Watch mode)
pnpm --filter @si-mukti/api start:dev
```

Akses dokumentasi OpenAPI Swagger interaktif di:  
👉 **`http://localhost:3001/api/docs`**
