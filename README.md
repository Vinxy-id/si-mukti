# 📁 Struktur Folder Proyek LKTIN TIM Salma
**Karya Tulis Ilmiah: MARBLECHAIN / SI-MUKTI Tulungagung (LKTIN UNIMED 2026)**

Folder ini telah dirapikan ke dalam 5 kategori fungsional untuk memudahkan pengerjaan, revisi, dan persiapan berkas lomba:

---

### 📂 `01_Naskah_KTI/` (Dokumen Karya Tulis Ilmiah)
Memuat berkas naskah utama dan draft revisi KTI:
* **`Draft_Naskah_LKTIN_SI-MUKTI_UNIMED2026.docx`** — Draft naskah kerja aktif terbaru.
* **`MARBLECHAIN_KTI_LKTIN_UNIMED_2026_REVISI_TERBARU.docx`** — Naskah bersih hasil pembaruan/revisi.
* **`MARBLECHAIN_KTI_LKTIN_UNIMED_2026_REVISI_HIGHLIGHT.docx`** — Naskah dengan tanda *highlight* perubahan untuk pengecekan tim/dosen pembimbing.
* **📁 `Arsip_Draft_Lama/`** — Arsip versi sebelumnya (`MARBLECHAIN_KTI_LKTIN_UNIMED_2026_REVISI.docx` serta file PDF pratinjau sebelumnya) agar riwayat penulisan tetap aman tersimpan.

---

### 📂 `02_Instrumen_Wawancara/` (Wawancara & Validasi Lapangan)
Memuat berkas instrumen wawancara SI-MUKTI Tulungagung:
* **`Pedoman_Wawancara_SI-MUKTI_Tulungagung.docx`** — Pedoman pertanyaan wawancara untuk pengrajin marmer, paguyuban, dan dinas terkait.
* **`Matriks_Prediksi_Jawaban_Wawancara_SI-MUKTI.pdf`** — Matriks proyeksi jawaban & bukti lapangan berformat PDF siap cetak.
* **`Matriks_Prediksi_Jawaban_Wawancara_SI-MUKTI.md`** — Dokumen sumber matriks prediksi jawaban (Markdown).

---

### 📂 `03_Pedoman_dan_Referensi/` (Aturan Lomba & Kajian Pustaka)
* **`PEDOMAN LKTIN 2026.pdf`** — Panduan resmi, ketentuan format, sistematika penulisan, dan timeline LKTIN 2026.
* **`ilham85,+[6].+5280-Article+Text-24079-1-2-20250109.pdf`** — Jurnal referensi ilmiah pendukung data marmer / rantai pasok.

---

### 📂 `04_Aset_Gambar/` (Visual & Ilustrasi KTI)
* **`gambar1_alur.jpeg`** — Gambar 1 naskah: Rancangan alur informasi & pelacakan rantai pasok.
* **`gambar2_mockup.jpeg`** — Gambar 2 naskah: Mockup antarmuka pengguna (Dashboard Web & Antarmuka Mobile).
* **📁 `Aset_Ekstrak_PDF/`** — Kumpulan ikon dan gambar (`p18_img_0.png` s.d. `p18_img_6.png`) hasil ekstraksi dokumen pratinjau.

---

### 📂 `05_Prototipe_dan_Skrip/` (Pengembangan & Automasi)
* **`interactive_prototype_showcase.html`** — Showcase terpadu seluruh layar UI/UX (Mobile Pengrajin, Web-GIS Leaflet, Trace QR, & Figma Guide).
* **`PANDUAN_DEMO_DAN_PENGUJIAN_UIUX.md`** — Panduan lengkap skenario pengujian & demonstrasi fitur interaktif UI/UX SI-MUKTI.
* **`marblechain_prototype.html`** — Prototipe antarmuka web interaktif (UI/UX) awal MARBLECHAIN berbasis Tailwind CSS.
* **`create_marblechain_docs.py`** — Skrip Python untuk mengompilasi & memformat otomatis dokumen naskah Word berstandar pedoman.
* **`extracted_doc_text.txt`** — Teks mentah hasil ekstraksi naskah untuk rujukan data.

---

### 📂 `06_Database/` (Arsitektur Basis Data Geospasial & Ketertelusuran)
* **`ERD_DATABASE.md`** — Visualisasi ERD Mermaid dan Kamus Data lengkap untuk 15 entitas sistem.
* **`01_schema_postgis.sql`** — Skema DDL produksi PostgreSQL 16+ dengan ekstensi geospasial PostGIS 3.4+.
* **`02_views_and_functions.sql`** — View analitik peta Web-GIS, fungsi geo-matching radius, dan trigger auto-kredit MUKTI-Pay.
* **`03_seed_data.sql`** — Data awal riil persona pengrajin Campurdarat, Besole, pabrik offtaker, uji mutu SNI, dan paspor QR.
* **`04_schema_sqlite.sql`** — Skema portabel SQLite 3 untuk pengujian lokal instan tanpa instalasi database server.
* **`test_database.py`** — Skrip Python pengujian otomatis seluruh alur fungsional PRD (Lolos 100%).
* **`docker-compose.yml`** — Konfigurasi orkestrasi kontainer satu-klik (PostgreSQL PostGIS + pgAdmin).
* **`README.md`** — Panduan operasional dan deployment basis data.
