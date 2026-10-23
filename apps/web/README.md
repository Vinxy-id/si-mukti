# 📱 @si-mukti/web: Next.js 14+ PWA & Tatah Mineral Design System

Aplikasi Front-End Web & Progressive Web App (PWA) untuk platform **SI-MUKTI (Sistem Informasi Manajemen Spasial dan Rantai Pasok Marmer Tulungagung)**, dibangun berbasis **Next.js 14+ (App Router)**, **TypeScript**, dan **Tailwind CSS**.

Mengimplementasikan token desain visual resmi **"Tatah Mineral"** ([`figma_tokens.json`](../../prototype_assets/figma_tokens.json)) serta standar aksesibilitas pengrajin pedesaan (WCAG 2.1 AA).

---

## 🎨 Token Palet Warna "Tatah Mineral"

| Token Warna | Nilai HEX | Peran Desain Sistem |
| :--- | :--- | :--- |
| `marble-blue-900` | `#00236F` | Deepest marble quarry navy (Brand Utama & Top Header) |
| `marble-blue-800` | `#1E3A8A` | Brand primary deep blue (Tombol Utama & Aksen) |
| `marble-blue-100` | `#DCE1FF` | Container soft background (Badge & Icon Container) |
| `circular-emerald-500` | `#10B981` | Eco waste-to-value primary (Valorisasi Limbah & Transaksi Hijau) |
| `circular-emerald-700` | `#006C49` | Deep circular green (Teks Status Berhasil) |
| `circular-emerald-50` | `#ECFDF5` | Eco badge background (Lencana Terverifikasi) |
| `surface-canvas` | `#F8FAFC` | Carrara off-white background |
| `surface-card` | `#FFFFFF` | Polished white card surface |
| `border-chiseled` | `#E2E8F0` | Structural card border |
| `text-primary` | `#0B1C30` | High contrast typography |
| `gold-seal` | `#D97706` | Authenticity gold seal (Stempel Keaslian Geologis Pemkab) |

---

## 📱 PWA & Strategi Offline-First

Dirancang khusus untuk pengrajin yang beraktivitas di ceruk tambang karst Campurdarat & Besole dengan sinyal seluler minim:

1. **`public/manifest.json`**:
   - `display: "standalone"`, `theme_color: "#00236F"`, orientasi `portrait-primary`.
   - Siap diinstal langsung di layar utama smartphone Android / iOS tanpa melalui Play Store.
2. **`public/sw.js` (Service Worker)**:
   - **NetworkFirst**: Untuk mutasi saldo dompet MUKTI-Pay dan status penjemputan armada truk.
   - **CacheFirst / StaleWhileRevalidate**: Untuk tile peta Leaflet, font Plus Jakarta Sans & Inter, ikon SVG, dan aset verifikasi paspor digital.
   - **`public/offline.html`**: Halaman cadangan ramah pengguna yang tampil otomatis saat koneksi seluler terputus total di dasar kuari.

---

## ♿ Komponen Aksesibilitas UMKM (WCAG 2.1 AA)

1. **`BigActionButton`** ([`src/components/ui/BigActionButton.tsx`](./src/components/ui/BigActionButton.tsx)):
   - Tinggi tombol minimal **52px** (aman disentuh jari pengrajin yang basah / berdebu batu).
   - Rasio kontras tinggi (> 4.5:1), tactile visual feedback (`active:scale-[0.98]`), dan focus-ring tegas.
   - Variasi: `primary`, `eco`, `outline`, `gold`, `danger`.
2. **`MetricStatCard`** ([`src/components/ui/MetricStatCard.tsx`](./src/components/ui/MetricStatCard.tsx)):
   - Menampilkan angka saldo dan tonase dalam format font **Inter `tabular-nums`** agar angka tidak bergeser saat data terbarui.
   - Dilengkapi indikator tren (`+Rp 525.000`) dan badge status.
3. **`AppBottomNav`** ([`src/components/layout/AppBottomNav.tsx`](./src/components/layout/AppBottomNav.tsx)):
   - Bilah navigasi bawah tetap (fixed bottom) khusus mobile:
     1. **Beranda** (`/pengrajin/dashboard`)
     2. **Lapor Residu** (`/pengrajin/waste/new` — Tombol bulat menonjol tengah)
     3. **Lacak Truk** (`/spasial`)
     4. **Paspor Saya** (`/pengrajin/passports`)

---

## 🛠️ Panduan Perintah

```bash
# 1. Jalankan unit test validasi desain token & komponen
pnpm --filter @si-mukti/web test

# 2. Jalankan server Next.js mode development
pnpm --filter @si-mukti/web dev

# 3. Bangun aplikasi Next.js untuk produksi
pnpm --filter @si-mukti/web build

# 4. Jalankan aplikasi produksi
pnpm --filter @si-mukti/web start
```
