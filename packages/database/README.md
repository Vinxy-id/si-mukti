# 🏛️ @si-mukti/database: PostgreSQL 16 + PostGIS + Drizzle ORM Layer

Paket basis data dan mesin spasial untuk platform **SI-MUKTI (Sistem Informasi Manajemen Spasial dan Rantai Pasok Marmer Menuju Kesejahteraan UMKM Kabupaten Tulungagung Inklusif)**.

Dirancang sesuai spesifikasi [PRD.md](../../PRD.md) Versi 1.0 dan DDL geospasial [06_Database/01_schema_postgis.sql](../../06_Database/01_schema_postgis.sql).

---

## 🚀 Fitur Utama

1. **PostGIS Custom Type (`geometry(Point, 4326)`)**:
   - Terintegrasi penuh dengan Drizzle ORM via `geometryPoint` di [`src/schema/custom-types.ts`](./src/schema/custom-types.ts).
   - Mengonversi otomatis antara objek TypeScript `{ lng: number, lat: number }` dan PostGIS EWKT `SRID=4326;POINT(lng lat)`.
2. **15 Tabel Entitas Bisnis & Pentahelix**:
   - `users`: Pengrajin, offtaker, dinas Pemkab, balai laboratorium, konsumen.
   - `workshops`: Bengkel marmer Campurdarat & Besole dengan titik GPS terverifikasi.
   - `waste_logs`: Residu lumpur bubut (*sludge*) dan pecahan batu kasar (*afur*).
   - `offtakers`: Pabrik paving, teraso, dan pupuk kalsium.
   - `vehicles` & `pickup_orders` & `pickup_stops`: Logistik multi-stop jemput limbah.
   - `wallets` & `wallet_transactions` & `payout_withdrawals`: Buku besar insentif MUKTI-Pay (Bank Jatim / BRI).
   - `quarry_blocks`: Rekam jejak asal bongkahan kuari karst resmi ESDM.
   - `product_passports` & `traceability_events`: Paspor digital produk marmer anti-pemalsuan resin sintetis.
   - `lab_test_reports`: Sertifikasi spektrometri kadar CaCO3 (>95%) dan moisture (<20%) SNI 03-0394.
   - `regional_environmental_metrics`: Telemetri reduksi CO2 eq dan timbulan tercegah ke DAS Ngrowo.
3. **Helper Query Spasial PostGIS**:
   - `findNearbyWaste(db, params)`: Menjalankan ekivalen fungsi SQL `fn_find_nearby_waste` menggunakan `ST_DWithin` dan `ST_Distance` berbasis geodesik bumi (meter/km).
   - `findNearbyOfftakers(db, params)`: Mencari industri penyerap limbah terdekat dari lokasi bengkel.
   - `toGeoJSONFeatureCollection(items, idKey)`: Menghasilkan GeoJSON standar RFC 7946 untuk konsumsi Leaflet.js Web-GIS.
4. **Kriptografi Paspor Digital MUKTI-Trace**:
   - `generatePassportHash()`: Menghasilkan SHA-256 unik kombinasi serial number, batch kuari, nomor sertifikat SNI, dan ID bengkel.
   - `signPassportHash()` & `verifyPassportSignature()`: Tanda tangan digital HMAC-SHA256 untuk anti-pemalsuan dan verifikasi keaslian publik.

---

## 🛠️ Panduan Perintah (CLI Scripts)

Jalankan perintah berikut dari direktori paket atau root monorepo:

```bash
# 1. Jalankan unit test geospasial & kriptografi (16 assertions)
pnpm --filter @si-mukti/database test

# 2. Kompilasi TypeScript ke dist/
pnpm --filter @si-mukti/database build

# 3. Generate migrasi SQL Drizzle dari skema TypeScript
pnpm --filter @si-mukti/database db:generate

# 4. Jalankan migrasi basis data ke instance PostgreSQL PostGIS
pnpm --filter @si-mukti/database db:migrate

# 5. Tanamkan data riil sentra Tulungagung (Pak Supardi, PT Sentosa, kuari Besole)
pnpm --filter @si-mukti/database db:seed
```

---

## 💻 Contoh Penggunaan di Aplikasi (NestJS / Next.js)

### 1. Inisialisasi Database Client
```typescript
import { getDb, schema } from '@si-mukti/database';

const db = getDb();
const activeWorkshops = await db.query.workshops.findMany({
  with: {
    user: true,
    wasteLogs: true,
  },
});
```

### 2. Pencarian Spasial Limbah Dekat Bengkel / Pabrik Offtaker
```typescript
import { getDb, findNearbyWaste } from '@si-mukti/database';

const db = getDb();
// Mencari residu limbah dalam radius 10 km dari koordinat pabrik offtaker
const nearbyWaste = await findNearbyWaste(db, {
  targetLat: -8.1402, // PT Sentosa Boyolangu
  targetLng: 111.8750,
  radiusKm: 10.0,
  wasteType: 'sludge_lumpur',
  minCaco3: 95.0, // Standar SNI 03-0394
});

console.log(nearbyWaste);
```

### 3. Pembuatan & Verifikasi Paspor Digital QR
```typescript
import { generatePassportHash, signPassportHash, verifyPassportSignature } from '@si-mukti/database';

// 1. Generate & Sign saat pengrajin mendaftarkan produk baru
const hash = generatePassportHash({
  serialNumber: 'REG-PEMKAB-TA/2026/09841',
  quarryBatchCode: 'QRY-BSL-2026-X8',
  labCertificateNo: 'LAB-SNI-2026/0394-081',
  workshopId: 'a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
});

const signedQrToken = signPassportHash(hash, process.env.PASSPORT_HMAC_SECRET!);

// 2. Verifikasi instan saat konsumen memindai QR Code di landing page publik (/verify/[hash])
const verification = verifyPassportSignature(signedQrToken, process.env.PASSPORT_HMAC_SECRET!);
if (verification.isValid) {
  console.log('✅ Produk Marmer 100% Asli Tulungagung Terverifikasi!');
}
```
