# 🎨 Panduan Interaktif & Demonstrasi UI/UX SI-MUKTI Tulungagung
**Sistem Informasi Geospasial dan Ketertelusuran Digital untuk Valorisasi Limbah serta Peningkatan Daya Saing UMKM Marmer Tulungagung**  
**Subtema LKTIN UNIMED 2026:** Digitalisasi Ekonomi, UMKM, dan Pemberdayaan Daerah 3T  
**Acuan Resmi:** [PRD.md](../PRD.md) (Versi 1.0 Baseline)

---

## 🌟 Ringkasan Eksekutif Pembaruan Prototipe UI/UX

Prototipe antarmuka SI-MUKTI kini telah ditingkatkan menjadi **Live Interactive Demo Penuh (Bukan Sekadar Gambar Statis)**. Seluruh skenario pada PRD dapat langsung diuji dan diklik melalui peramban web (Google Chrome, Microsoft Edge, Safari, Firefox) tanpa memerlukan dependensi server tambahan.

Berkas utama showcase:
👉 **[`interactive_prototype_showcase.html`](../interactive_prototype_showcase.html)** (dapat dibuka langsung dengan klik ganda di file explorer)

---

## 📱 Layar 1: MUKTI-Pengrajin (Mobile App Interaktif)
*Berkas Antarmuka:* [`prototype_assets/screen1_mobile_pengrajin.html`](../prototype_assets/screen1_mobile_pengrajin.html)  
*Target Persona:* **Pak Supardi (52 tahun)**, Pemilik Bengkel Marmer Al-Barokah, Desa Gamping, Campurdarat.

### Fitur Interaktif yang Dapat Dicoba:
1. **Simulasi Pencairan Dana MUKTI-Pay (Modal Tarik Dana Bank Jatim):**
   * Klik tombol **"Tarik Dana"** pada kartu Saldo Valorisasi Limbah (Rp 1.450.000).
   * Modal interaktif terbuka menampilkan rekening Bank Jatim Pak Supardi (`0182-3901-23`).
   * Pilih chip nominal cepat (Rp 250rb, Rp 500rb, atau Rp 1 Juta), lalu klik **"Konfirmasi Pencairan ke Bank"**.
   * Animasi loading integrasi perbankan berjalan (1.2 detik), saldo berkurang secara riil di layar, dan entri mutasi merah secara otomatis tercatat di buku kas.
2. **Pencatatan Residu Baru Berbasis AI Volumetrik Kamera:**
   * Klik tombol besar beraksen hijau **"Setor Residu Limbah Baru"**.
   * Pilih jenis residu: *Lumpur Sludge* (Tarif Rp 150rb/ton) atau *Bongkahan Afur* (Tarif Rp 120rb/ton).
   * Muncul jendela simulasi viewfinder kamera dengan animasi laser pemindai (*scanner line*) dan *bounding mesh polygon* di atas foto tumpukan lumpur marmer basah.
   * Model AI menghitung secara otomatis: Kubikasi $2.4\text{ m}^3 \rightarrow \approx 3.8\text{ ton}$ (Akurasi 98.2%), koordinat GNSS Desa Gamping terekam otomatis, dan estimasi nilai rupiah muncul seketika (Rp 570.000).
   * Klik **"Publikasikan ke Web-GIS & Panggil Truk"** untuk menyelesaikan proses.
3. **Simulasi Pelacakan Armada Penjemput Real-Time (Live Dispatch Tracking):**
   * Pada kartu *Penjemputan Sedang Berlangsung* (Truk Colt Diesel AG 8492 UT / Sopir: Budi Santoso), klik tombol **"Simulasi Majukan Status Truk"**.
   * Klik ke-1: Status berpindah ke *Truk Tiba di Bengkel & Menimbang*, progress bar maju ke 75%.
   * Klik ke-2: Status berpindah ke *Muat Selesai (3.5 Ton)*, progress bar mencapai 100%, dan insentif saldo sebesar **+Rp 525.000** langsung otomatis bertambah ke saldo MUKTI-Pay Pak Supardi dengan notifikasi toast!
4. **Buku Mutasi Transaksi & Telepon Sopir:**
   * Klik **"Buku Mutasi"** untuk melihat riwayat jurnal debit/kredit valorisasi.
   * Klik ikon telepon pada kartu armada untuk memicu simulasi panggilan WhatsApp ke sopir truk.

---

## 🗺️ Layar 2: MUKTI-Spasial (Desktop Web-GIS Dashboard Interaktif)
*Berkas Antarmuka:* [`prototype_assets/screen2_desktop_webgis.html`](../prototype_assets/screen2_desktop_webgis.html)  
*Target Persona:* **Ir. Bambang Sulistyo** (Disperindag Kab. Tulungagung) & **Hendra Wijaya** (PT Sentosa Teraso & Paving).

### Fitur Interaktif yang Dapat Dicoba:
1. **Peta Geospasial Leaflet.js Beresolusi Tinggi Asli:**
   * Peta dapat digeser (*pan*), diperbesar (*zoom in/out*), dan dipusatkan secara dinamis pada kawasan karst Tulungagung Selatan (Kecamatan Campurdarat dan Besole).
   * Tersedia tombol beralih basemap di pojok kiri atas: **Vektor Karst (OpenStreetMap)** atau **Citra Satelit Geologis (Esri World Imagery)**.
2. **Slider Filter Radius Logistik Multi-Titik (2 km s.d. 15 km):**
   * Geser slider radius di sidebar kiri. Lingkaran radius geospasial berwarna hijau di peta (berpusat di pabrik PT Sentosa Teraso) membesar/mengecil secara *real-time*.
   * Daftar bengkel di sidebar dan pin di peta otomatis terfilter sesuai radius jangkauan truk dump!
3. **Filter Layer Spasial Multikategori:**
   * Centang/hapus centang layer:
     * *Lumpur Sludge Basah (Pin Hijau)*
     * *Bongkahan Afur (Pin Oranye)*
     * *Pabrik Offtaker Pengolah (Pin Ungu)*
   * Pin di peta dan kartu daftar seketika menyesuaikan tampilan.
4. **Slide-Over Detail Pin Bengkel & Hasil Uji Spektrometri SNI 03-0394:**
   * Klik salah satu pin bengkel di peta (misal: *Bengkel Al-Barokah Pak Supardi*) atau klik dari daftar di sidebar.
   * Panel samping kanan (*slide-over*) meluncur masuk dengan animasi halus, menyajikan:
     * Identitas bengkel, nama penanggung jawab, koordinat RTK, dan foto tumpukan residu.
     * **Kartu Hasil Uji Spektrometri SNI 03-0394:** Kadar $\text{CaCO}_3 = 98.40\%$, kelembapan air $14.20\%$, dan pH $8.10$ (Grade A Super Kalsit).
     * Kalkulasi nilai transaksi instan: $3.5\text{ Ton} \times \text{Rp } 150.000 = \text{Rp } 525.000$.
5. **Penerbitan Surat Jalan Digital (e-Manifest):**
   * Klik tombol **"Cetak Surat Jalan Digital (e-Manifest)"** di panel slide-over.
   * Terbuka modal resmi Surat Jalan Digital berstandar Dinas Perindag & Lingkungan Hidup Kab. Tulungagung lengkap dengan nomor registrasi `MNF-TA-20261022-0089`, rincian muatan tonase, nama pengemudi truk, dan *hash* kriptografis SHA-256 yang siap dicetak/diekspor ke PDF!

---

## 🛡️ Layar 3: MUKTI-Trace (Paspor Digital & Verifikasi Keaslian QR)
*Berkas Antarmuka:* [`prototype_assets/screen3_mobile_trace_qr.html`](../prototype_assets/screen3_mobile_trace_qr.html)  
*Target Persona:* **Maya Arisanti** (Konsumen / Desainer Interior Mewah Surabaya).

### Fitur Interaktif yang Dapat Dicoba:
1. **Penggantian Sampel Produk Instan (Demo Selector):**
   * Gunakan dropdown di bilah atas untuk berganti antar karya seni marmer:
     * *Meja Bundar Solid Onyx Tulungagung* (D: 120cm, 185 kg, Pak Supardi)
     * *Wastafel Marmer Trosobo Natural Edge* (42 kg, Pak Supardi)
     * *Guci Marmer Putih Super Bintik Murni* (68 kg, Pak Slamet Riyadi - Besole)
   * Seluruh data sertifikat, foto produk, asal blok tambang kuari, bobot, dan nama pengrajin berganti secara dinamis!
2. **Inspeksi Stiker QR Fisik Anti-Pemalsuan:**
   * Klik tombol **"Kode QR"** di pojok kanan atas untuk membuka jendela modal stiker fisik resmi.
   * Menampilkan representasi kode QR dengan segel emas bertuliskan `REG-PEMKAB-TA/2026/09841` yang diamankan oleh *Signed Hash* SHA-256 HMAC Pemkab Tulungagung.
3. **Tab Perbandingan Spektrometri Geologis: Alami vs Sintetis Tiruan:**
   * Klik tab **"Marmer Asli Tulungagung"** untuk melihat metrik kemurnian kristal kalsit $\text{CaCO}_3 \ge 98.4\%$, tembus pandang (*translucent*), dan ketahanan panas $> 800^\circ\text{C}$.
   * Klik tab **"Marmer Resin Sintetis (Tiruan)"** untuk melihat indikator pembeda batu komposit palsu berbahan resin poliester impor yang mudah melepuh dan tergores.
4. **Linimasa Kronologis Ketertelusuran Rantai Pasok (4 Tahapan):**
   * *Tahap 1:* Ekstraksi Bongkahan Kuari Marmer Besole Blok 4 (IUP: 540/328/IUP-OP).
   * *Tahap 2:* Pembubutan & Pemahatan Presisi di Bengkel Al-Barokah Campurdarat.
   * *Tahap 3:* Pengujian Mutu Spektrometri di Balai Standardisasi Jatim (SNI 03-0394).
   * *Tahap 4:* Valorisasi 100% Residu Sirkular oleh PT Sentosa Teraso menjadi paving ramah lingkungan (*Zero-Waste Certified*).
5. **Tombol Interaksi Publik:**
   * Klik **"Unduh e-Passport Resmi (Sertifikat PDF)"** untuk mengunduh bukti keabsahan karya.
   * Klik **"Hubungi Pengrajin via WhatsApp"** untuk langsung terhubung dengan nomor kontak pembuat karya guna pemesanan kustom.

---

## 🎨 Token Desain & Standardisasi Antarmuka (*Tatah Mineral*)
Semua layar mematuhi panduan desain visual resmi PRD:
* **Primary (Marble Blue):** `#00236F` & `#1E3A8A`
* **Eco Accent (Circular Green):** `#006C49` & `#6CF8BB`
* **Gold Authenticity Seal:** `#D97706`
* **Canvas Putih Marmer:** `#F8FAFC` & `#FFFFFF`
* **Standar Aksesibilitas:** Ukuran tombol *tap-target* minimal **48–52 px** dan rasio kontras warna **WCAG 2.1 AA (> 4.5:1)** agar terbaca jelas oleh pengrajin di bawah terik sinar matahari bengkel.
