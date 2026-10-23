'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Smartphone,
  Globe2,
  QrCode,
  ShieldCheck,
  Recycle,
  Wallet,
  Truck,
  TrendingDown,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Award,
  Layers,
  MapPin,
  FileCheck2,
  Calculator,
  Building2,
  Users,
  Compass,
  ExternalLink,
  HelpCircle,
  LogIn,
  LogOut,
  User,
  UserCheck,
  Lock,
  Calendar,
  Clock,
  Activity,
  Camera,
  Check,
  Droplet,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { BigActionButton } from '@/components/ui/BigActionButton';
import { MetricStatCard } from '@/components/ui/MetricStatCard';
import { HeroGisDemo } from '@/components/gis/HeroGisDemo';
import { formatRupiah, formatTon, cn } from '@/lib/utils';
import { REGIONAL_TELEMETRY, MOCK_GIS_WASTE_POINTS } from '@/lib/gis-data';

type EcoServiceNode = 'sludge' | 'afur' | 'paving' | 'teraso' | 'pupuk';

interface EcoServiceDetail {
  id: EcoServiceNode;
  label: string;
  tag: string;
  title: string;
  description: string;
  points: string[];
  dotColor: string;
}

const ECO_SERVICES: Record<EcoServiceNode, EcoServiceDetail> = {
  sludge: {
    id: 'sludge',
    label: 'Lumpur Sludge',
    tag: 'VALORISASI PRESISI (ZERO-WASTE)',
    title: 'Pemanfaatan Residu Presisi (Zero-Waste)',
    description:
      'Residu pembubutan basah marmer yang selama ini dibuang ke Sungai Ngrowo diserap 100% oleh pabrik mitra sebagai bahan baku sekunder dengan standar uji kalsium terverifikasi.',
    points: [
      'Uji Laboratorium Spektrometri Kalsit (SNI 03-0394)',
      'Rantai Pasok Terbuka & e-Manifest Sah Disperindag',
      'Reduksi Emisi -38.2% CO2 eq dibanding Penambangan Baru',
    ],
    dotColor: '#0284C7',
  },
  afur: {
    id: 'afur',
    label: 'Afur Kasar',
    tag: 'RESIDU BONGKAHAN KUARI',
    title: 'Afur Kasar & Bongkahan Kuari Marmer',
    description:
      'Pecahan batu sisa pemahatan patung dan pemotongan lempeng pualam dipilah berdasarkan ukuran fraksi dan disalurkan ke fasilitas penghancur (crusher) untuk agregat konstruksi bernilai tambah.',
    points: [
      'Struktur kristalin alami dengan kadar CaCO3 mencapai 97.8%',
      'Buku kas digital MUKTI-Pay dengan pencairan langsung ke rekening pengrajin',
      'Mencegah penumpukan limbah padat di sempadan jalan sentra Campurdarat',
    ],
    dotColor: '#F59E0B',
  },
  paving: {
    id: 'paving',
    label: 'Paving Ekologis',
    tag: 'PRODUK HILIR KONSTRUKSI',
    title: 'Paving Block Ramah Lingkungan K-350',
    description:
      'Inovasi paving block berkekuatan tekan tinggi K-350 yang memanfaatkan substitusi agregat afur dan serbuk marmer daur ulang, menghasilkan paving ramah lingkungan yang hemat semen.',
    points: [
      'Kuat tekan rata-rata K-350 sesuai standar pengujian teknis SNI',
      'Mengurangi konsumsi semen portland sebesar 20% per meter persegi',
      'Penyerapan resmi oleh offtaker PT Sentosa untuk trotoar dan perumahan',
    ],
    dotColor: '#10B981',
  },
  teraso: {
    id: 'teraso',
    label: 'Teraso Lantai',
    tag: 'PRODUK HILIR PREMIUM',
    title: 'Ubin Teraso & Meja Komposit Karst',
    description:
      'Lantai teraso premium dan perabot arsitektur dengan tekstur butir marmer asli Tulungagung yang dipoles mengkilap, tahan gores, dan bernilai jual tinggi untuk pasar ekspor dan resort.',
    points: [
      'Estetika corak batu alam asli kalsit dengan ketahanan termal tinggi',
      'Valorisasi ekonomi hingga 3 kali lipat dibanding residu mentah',
      'Paspor Digital QR Code menjamin keaslian batu karst alam Tulungagung',
    ],
    dotColor: '#6366F1',
  },
  pupuk: {
    id: 'pupuk',
    label: 'Pupuk Kalsium Pertanian',
    tag: 'AGRIKULTUR RAMAH LINGKUNGAN',
    title: 'Kaptan & Pupuk Kalsium Pertanian',
    description:
      'Kapur pertanian (Kaptan) hasil pengeringan dan penepungan lumpur sludge marmer murni untuk menetralkan keasaman tanah sawah, meregenerasi unsur hara, dan menunjang swasembada pangan.',
    points: [
      'Kadar kalsit aktif tinggi (> 95% CaCO3) bereaksi cepat menaikkan pH tanah',
      'Harga pupuk terjangkau untuk kelompok tani mandiri Jawa Timur',
      'Sirkularitas murni dari limbah bubut industri marmer kembali menyuburkan bumi',
    ],
    dotColor: '#10B981',
  },
};

type TechSpecialityKey = 'tsp' | 'lidar' | 'wallet' | 'passport';

interface TechSpeciality {
  id: TechSpecialityKey;
  tabLabel: string;
  badge: string;
  title: string;
  description: string;
  specs: string[];
  ctaLabel: string;
  ctaHref: string;
  telemetryTitle: string;
  telemetrySubtitle: string;
  telemetryRows: { label: string; value: string; colorClass?: string }[];
  statusPill: string;
}

const TECH_SPECIALITIES: Record<TechSpecialityKey, TechSpeciality> = {
  tsp: {
    id: 'tsp',
    tabLabel: 'Optimasi Rute TSP',
    badge: 'PostGIS Traveling Salesperson Problem',
    title: 'Penjemputan Residu Cerdas & Otomatisasi Logistik',
    description:
      'Algoritma geospasial menghitung lintasan rute pengangkutan paling efisien menyusuri bengkel pengrajin di Campurdarat dan Besole, memangkas 32% konsumsi BBM armada serta mempercepat siklus sirkular.',
    specs: [
      'Kalkulasi jarak geodesik real-time berbasis PostGIS ST_Distance',
      'Penerbitan Surat Perintah Muat & e-Manifest resmi 3-pihak',
      'Pengurangan jejak karbon armada logistik sebesar -38.2% CO2 eq',
    ],
    ctaLabel: 'Eksplorasi Rute di Pusat Komando',
    ctaHref: '/spasial',
    telemetryTitle: 'ARMADA LOGISTIK AG 8492 UT',
    telemetrySubtitle: 'Rute Campurdarat ke PT Sentosa',
    telemetryRows: [
      { label: 'Kapasitas Muatan', value: '4 Titik (12.8 Ton)', colorClass: 'text-amber-600' },
      { label: 'Efisiensi Bahan Bakar', value: 'Hemat 32% Liter BBM', colorClass: 'text-emerald-600' },
      { label: 'Legalitas Logistik', value: 'e-Manifest Terverifikasi', colorClass: 'text-[#00236F]' },
    ],
    statusPill: 'Rute Optimal Aktif',
  },
  lidar: {
    id: 'lidar',
    tabLabel: 'AI LiDAR Scanner',
    badge: 'Computer Vision & Volumetric AI',
    title: 'Estimasi Tonase Cepat & Akurasi Sub-Sentimeter',
    description:
      'Pengrajin cukup mengarahkan kamera ponsel ke bak sedimentasi atau tumpukan afur. Sensor LiDAR dan visi komputer secara instan menghitung volume kubikasi, densitas kalsit 1.628 ton/m3, dan proyeksi nilai rupiah.',
    specs: [
      'Toleransi galat dimensi spasial di bawah 0.5 cm',
      'Konversi otomatis massa jenis lumpur marmer Tulungagung',
      'Mencegah manipulasi timbangan fisik saat pengangkutan',
    ],
    ctaLabel: 'Coba Scanner Kamera AI',
    ctaHref: '/pengrajin/waste/new',
    telemetryTitle: 'AI VISION TELEMETRY v2.4',
    telemetrySubtitle: 'Bak Sedimentasi Lumpur Al-Barokah',
    telemetryRows: [
      { label: 'Estimasi Volume', value: '2.15 m3 (3.5 Ton)', colorClass: 'text-emerald-600' },
      { label: 'Massa Jenis Batuan', value: '1.628 Ton / m3', colorClass: 'text-[#0284C7]' },
      { label: 'Skor Keyakinan AI', value: '94.2% Akurasi Tinggi', colorClass: 'text-[#00236F]' },
    ],
    statusPill: 'Sensor LiDAR Siap',
  },
  wallet: {
    id: 'wallet',
    tabLabel: 'Dompet MUKTI-Pay',
    badge: 'Automated Valorisasi Ledger',
    title: 'Buku Kas Digital & Pencairan Instan Bank Jatim',
    description:
      'Setiap ton lumpur dan bongkahan yang terangkut otomatis dikonversi menjadi saldo rupiah di dompet digital pengrajin. Transparan, tercatat rapi di buku kas, dan dapat dicairkan langsung ke rekening bank mitra tanpa potongan biaya.',
    specs: [
      'Kredit otomatis seketika setelah penimbangan di offtaker',
      'Pencairan dana langsung ke rekening Bank Jatim tanpa biaya admin',
      'Riwayat transaksi terlindungi audit log terenkripsi',
    ],
    ctaLabel: 'Buka Buku Kas MUKTI-Pay',
    ctaHref: '/pengrajin/wallet',
    telemetryTitle: 'BUKU KAS VALORISASI DIGITAL',
    telemetrySubtitle: 'Pak Supardi - Bengkel Al-Barokah',
    telemetryRows: [
      { label: 'Saldo Terkumpul', value: 'Rp 1.450.000', colorClass: 'text-emerald-600' },
      { label: 'Total Residu Disetor', value: '8.5 Ton Terserap', colorClass: 'text-[#0284C7]' },
      { label: 'Mitra Pembayaran', value: 'Bank Jatim QRIS / Transfer', colorClass: 'text-[#00236F]' },
    ],
    statusPill: 'Dompet Aktif',
  },
  passport: {
    id: 'passport',
    tabLabel: 'Paspor Digital SNI',
    badge: 'Kriptografi SHA-256 & Sertifikasi Karst',
    title: 'Proteksi Marmer Asli dari Invasi Resin Sintetis Impor',
    description:
      'Setiap produk marmer alam asli Tulungagung dilengkapi Paspor Digital QR Code berisi data spektrometri kalsit (CaCO3 > 98%), ketahanan panas > 600 Derajat Celcius, serta segel keaslian Pemkab Tulungagung yang tidak dapat dipalsukan.',
    specs: [
      'Segel tanda tangan kriptografis HMAC SHA-256 anti-pemalsuan',
      'Data uji laboratorium geologis resmi sesuai SNI 03-0394',
      'Pindai instan tanpa unduh aplikasi melalui kamera konsumen',
    ],
    ctaLabel: 'Verifikasi Paspor Digital',
    ctaHref: '/verify/e3b0c44298fc1c149afbf4c8996fb92427ae',
    telemetryTitle: 'SERTIFIKASI PASPOR SNI 03-0394',
    telemetrySubtitle: 'Segel Keaslian Pemkab Tulungagung',
    telemetryRows: [
      { label: 'Kemurnian CaCO3', value: '98.4% Kalsit Murni', colorClass: 'text-emerald-600' },
      { label: 'Daya Tahan Termal', value: '> 600 Derajat Celcius', colorClass: 'text-amber-600' },
      { label: 'Integritas Segel', value: 'Lolos Enkripsi SHA-256', colorClass: 'text-[#00236F]' },
    ],
    statusPill: 'Segel Sah Pemkab',
  },
};

export default function HomePage() {
  const { user, isLoggedIn, role, openLoginModal, logout } = useAuth();

  // State Interaktif untuk Simulator Valorisasi Residu pada Landing Page
  const [calcWasteType, setCalcWasteType] = useState<'sludge' | 'afur'>('sludge');
  const [calcTonnage, setCalcTonnage] = useState<number>(3.5);

  // State Interaktif untuk Layanan Ekosistem Sirkular Terpadu
  const [activeEcoNode, setActiveEcoNode] = useState<EcoServiceNode>('sludge');
  const currentEcoService = ECO_SERVICES[activeEcoNode];

  // State Interaktif untuk Spesialisasi Teknologi SI-MUKTI
  const [activeTechKey, setActiveTechKey] = useState<TechSpecialityKey>('tsp');
  const currentTech = TECH_SPECIALITIES[activeTechKey];

  const ratePerTon = calcWasteType === 'sludge' ? 180000 : 120000;
  const estimatedEarned = calcTonnage * ratePerTon;
  const co2OffsetKg = Math.round(calcTonnage * 382); // 38.2% emisi tereduksi ~382 kg CO2 per ton

  return (
    <div className="min-h-screen bg-[#F0F7FD] text-slate-800 antialiased font-sans relative overflow-x-hidden selection:bg-[#0284C7] selection:text-white">
      {/* ========================================================================= */}
      {/* BACKGROUND ORGANIC FLUID SHAPES (Sesuai Gaya Desain MedCare)              */}
      {/* ========================================================================= */}
      <div className="absolute top-0 left-0 w-full h-[850px] pointer-events-none overflow-hidden z-0">
        {/* Lengkungan Biru Pastel Atas */}
        <div className="absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-[#E0F2FE] via-[#BAE6FD]/60 to-transparent blur-3xl opacity-80" />
        <div className="absolute top-20 -right-40 w-[700px] h-[700px] rounded-full bg-gradient-to-bl from-[#E0F2FE] via-[#BAE6FD]/50 to-transparent blur-3xl opacity-75" />
        <div className="absolute top-[480px] left-1/3 w-[500px] h-[500px] rounded-full bg-[#E0F2FE]/40 blur-3xl" />
      </div>

      {/* ========================================================================= */}
      {/* FLOATING APP CONTAINER (Frame Kartu Utama)                                 */}
      {/* ========================================================================= */}
      <div className="max-w-6xl mx-auto my-3 sm:my-6 lg:my-8 px-3 sm:px-4 relative z-10">
        <div className="bg-white rounded-[32px] sm:rounded-[44px] shadow-2xl shadow-sky-950/10 border border-sky-100 overflow-hidden relative">
          
          {/* ----------------------------------------------------------------------- */}
          {/* 1. TOP NAVBAR DALAM FRAME (Tata Letak Lega & Responsif)                 */}
          {/* ----------------------------------------------------------------------- */}
          <nav className="px-3.5 sm:px-8 lg:px-12 py-3 sm:py-5 flex items-center justify-between border-b border-sky-50 bg-white/90 backdrop-blur-md sticky top-0 z-40">
            {/* Logo MedCare-Style: Simbol Mineral + Teks Identitas */}
            <Link href="/" className="flex items-center gap-2 sm:gap-2.5 shrink-0 mr-2 sm:mr-4 lg:mr-8 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#0284C7] to-[#00236F] p-0.5 shadow-md flex items-center justify-center transition-transform group-hover:scale-105 shrink-0">
                <div className="w-full h-full bg-white rounded-[10px] sm:rounded-[14px] flex items-center justify-center text-[#0284C7]">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#0284C7]" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg sm:text-xl font-black tracking-tight text-[#00236F] whitespace-nowrap">
                    SI-MUKTI
                  </span>
                  <span className="hidden sm:inline-flex text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-sky-100 text-[#0284C7]">
                    Tulungagung
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-semibold -mt-0.5 hidden xl:block">
                  Sirkular Marmer • Web-GIS & AI
                </p>
              </div>
            </Link>

            {/* Menu Navigasi Tengah (Teks Ringkas & Jarak Proporsional agar Tidak Tabrakan) */}
            <div className="hidden lg:flex items-center gap-3.5 xl:gap-6 text-xs font-bold text-slate-600 whitespace-nowrap">
              <a href="#layanan" className="hover:text-[#0284C7] transition-colors py-1">
                Layanan
              </a>
              <a href="#spesialisasi" className="hover:text-[#0284C7] transition-colors py-1">
                Spesialisasi
              </a>
              <a href="#jadwal" className="hover:text-[#0284C7] transition-colors py-1">
                Jadwal
              </a>
              <a href="#aktor" className="hover:text-[#0284C7] transition-colors py-1">
                Pilar Aktor
              </a>
              <a href="#hak-akses" className="hover:text-[#0284C7] transition-colors py-1">
                Hak Akses
              </a>
              <a href="#simulator" className="hover:text-[#0284C7] transition-colors py-1">
                Kalkulator
              </a>
            </div>

            {/* Tombol Aksi Kanan (Masuk Sistem / Status Login) */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              <Link
                href="/spasial"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#0284C7] bg-sky-50 hover:bg-sky-100 px-3.5 py-2 rounded-full transition-all border border-sky-100"
              >
                <Globe2 className="w-3.5 h-3.5" />
                <span>Web-GIS</span>
              </Link>

              {isLoggedIn && user ? (
                <div className="flex items-center gap-2">
                  <Link
                    href={user.role === 'pengrajin' ? '/pengrajin/dashboard' : '/spasial'}
                    className="flex items-center gap-2 pl-2 pr-3.5 py-1.5 rounded-full bg-[#00236F] text-white hover:bg-[#1E3A8A] transition-all shadow-sm group"
                  >
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </div>
                    <span className="text-xs font-bold truncate max-w-[90px] sm:max-w-none">
                      {user.fullName}
                    </span>
                  </Link>

                  <button
                    type="button"
                    onClick={logout}
                    className="p-1.5 sm:p-2 rounded-full bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-all"
                    title="Keluar Akun"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => openLoginModal()}
                  className="inline-flex items-center gap-1.5 bg-[#0284C7] hover:bg-[#0369A1] active:scale-95 text-white text-xs font-extrabold px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-md shadow-sky-600/20 transition-all whitespace-nowrap shrink-0"
                >
                  <LogIn className="w-3.5 h-3.5 shrink-0" />
                  <span>Masuk Akun</span>
                </button>
              )}
            </div>
          </nav>

          {/* ----------------------------------------------------------------------- */}
          {/* 2. HERO SECTION MEDCARE-STYLE: INTERAKTIF DEMO WEB-GIS DIGITAL TWIN     */}
          {/* ----------------------------------------------------------------------- */}
          <section className="px-4 sm:px-8 lg:px-12 xl:px-14 pt-6 sm:pt-12 pb-12 sm:pb-20 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center">
              
              {/* Kolom Kiri: Teks & Aksi */}
              <div className="lg:col-span-6 xl:col-span-7 space-y-4 sm:space-y-5 text-left z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-[#0284C7] text-[11px] sm:text-xs font-extrabold">
                  <span className="w-2 h-2 rounded-full bg-[#0284C7] animate-pulse" />
                  <span>SOLUSI SIRKULAR KARST TULUNGAGUNG</span>
                </div>

                <h1 className="text-2xl sm:text-4xl lg:text-[44px] xl:text-[50px] font-black text-slate-900 tracking-tight leading-[1.2]">
                  Menjaga Kemurnian Marmer, Mengubah Residu Menjadi{' '}
                  <span className="text-[#0284C7]">Nilai Sirkular</span>
                </h1>

                <p className="text-xs sm:text-base text-slate-600 leading-relaxed max-w-xl">
                  Platform pertama di Indonesia yang mengintegrasikan <strong>Web-GIS spasial PostGIS</strong> untuk penjemputan residu lumpur kalsium <em>zero-waste</em>, serta <strong>Paspor Digital QR Code</strong> terverifikasi geologis untuk memproteksi marmer alam asli dari invasi resin sintetis impor.
                </p>

                {/* Tombol Aksi Pill */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-2">
                  <Link href="/spasial" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto bg-[#0284C7] hover:bg-[#0369A1] active:scale-95 text-white text-xs sm:text-sm font-bold px-6 py-3.5 rounded-full shadow-lg shadow-sky-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer">
                      <Globe2 className="w-4 h-4" />
                      <span>Eksplorasi Web-GIS Spasial</span>
                    </button>
                  </Link>

                  <Link href="/verify/e3b0c44298fc1c149afbf4c8996fb92427ae" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto bg-white hover:bg-slate-50 active:scale-95 text-slate-700 border border-slate-200 text-xs sm:text-sm font-bold px-5 py-3.5 rounded-full shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer">
                      <QrCode className="w-4 h-4 text-[#0284C7]" />
                      <span>Pindai Paspor SNI</span>
                    </button>
                  </Link>
                </div>

                {/* Badge Bukti Kredensial Kecil */}
                <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-semibold text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Disperindag Jatim</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>SNI 03-0394</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Bank Jatim</span>
                  </span>
                </div>
              </div>

              {/* Kolom Kanan: DEMO INTERAKTIF WEB-GIS SPASIAL DIGITAL TWIN              */}
              <div className="lg:col-span-6 xl:col-span-5 relative flex items-center justify-center">
                <HeroGisDemo />
              </div>

            </div>
          </section>

          {/* ----------------------------------------------------------------------- */}
          {/* 3. ROW OF 4 FLOATING ACTION CARDS (Signature MedCare Element)           */}
          {/* ----------------------------------------------------------------------- */}
          <div className="px-5 sm:px-8 lg:px-12 -mt-4 sm:-mt-8 mb-16 relative z-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: Solid Blue Primary Card (Opening Hours counterpart) */}
              <div className="bg-[#0284C7] text-white rounded-3xl p-5 shadow-lg shadow-sky-600/20 flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-100 uppercase tracking-wide">
                    Sentra Operasional
                  </span>
                  <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center text-white">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-extrabold">Campurdarat & Besole</h4>
                  <p className="text-xs text-sky-100 mt-0.5">Senin - Sabtu • 08:00 - 17:00</p>
                  <p className="text-[10px] text-sky-200 mt-2 font-mono">
                    38 Bengkel Bubut Aktif
                  </p>
                </div>

                <Link href="/spasial" className="block pt-1">
                  <button className="w-full bg-white/20 hover:bg-white/30 text-white text-xs font-bold py-2 rounded-full transition-all">
                    Pantau Wilayah &rarr;
                  </button>
                </Link>
              </div>

              {/* Card 2: Lapor Residu AI (White Card with Blue Badge) */}
              <div className="bg-white rounded-3xl p-5 border border-sky-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Fitur PWA
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center font-bold">
                    <Camera className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-extrabold text-slate-900">Lapor Residu AI</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Pindai foto bak lumpur, estimasi tonase kalsit 1.628 ton/m³ via kamera LiDAR.
                  </p>
                </div>

                <Link href="/pengrajin/waste/new" className="block pt-1">
                  <button className="w-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold py-2 rounded-full transition-all shadow-sm">
                    Pindai Residu
                  </button>
                </Link>
              </div>

              {/* Card 3: Pusat Komando GIS (White Card with Blue Badge) */}
              <div className="bg-white rounded-3xl p-5 border border-sky-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Web-GIS Spasial
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center font-bold">
                    <MapPin className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-extrabold text-slate-900">Pusat Komando GIS</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Filter radius penjemputan, rute TSP armada truk, dan sebaran industri offtaker.
                  </p>
                </div>

                <Link href="/spasial" className="block pt-1">
                  <button className="w-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold py-2 rounded-full transition-all shadow-sm">
                    Buka Peta Spasial
                  </button>
                </Link>
              </div>

              {/* Card 4: Paspor Keaslian SNI (White Card with Blue Badge) */}
              <div className="bg-white rounded-3xl p-5 border border-sky-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Traceability
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center font-bold">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-extrabold text-slate-900">Paspor Keaslian SNI</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Verifikasi nomor segel resmi Pemkab Tulungagung anti-pemalsuan marmer resin sintetis.
                  </p>
                </div>

                <Link href="/verify/e3b0c44298fc1c149afbf4c8996fb92427ae" className="block pt-1">
                  <button className="w-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold py-2 rounded-full transition-all shadow-sm">
                    Cek Paspor
                  </button>
                </Link>
              </div>

            </div>
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* 4. SECTION LAYANAN SIRKULAR (Our Medical Services Counterpart)          */}
          {/* ----------------------------------------------------------------------- */}
          <section id="layanan" className="px-5 sm:px-8 lg:px-14 py-12 sm:py-20 border-t border-sky-50 bg-[#F9FBFE]">
            <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#0284C7]">
                LAYANAN UNGGULAN
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Layanan Ekosistem Sirkular Terpadu
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Pemanfaatan residu pemahatan dan pembubutan batu marmer dari hulu kuari karst hingga hilir industri modern.
              </p>
            </div>

            {/* Split 2 Kolom: Kiri Satellite Nodes Diagram, Kanan Detail Kartu */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center max-w-5xl mx-auto">
              
              {/* Sisi Kiri: Diagram Ekosistem Sirkular Terpadu dengan Tata Letak Mandiri & Rapi */}
              <div className="lg:col-span-6 relative flex items-center justify-center py-4">
                <div className="relative w-full max-w-[360px] sm:max-w-[400px] aspect-square flex items-center justify-center select-none">
                  
                  {/* SVG Garis Orbit & Konektor Sirkular Antar Node */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
                    <circle cx="200" cy="200" r="148" fill="none" stroke="#BAE6FD" strokeWidth="1.8" strokeDasharray="5 5" className="opacity-70" />
                    <circle cx="200" cy="200" r="105" fill="none" stroke="#E0F2FE" strokeWidth="1.2" strokeDasharray="3 4" className="opacity-50" />
                    
                    {/* Garis Radiasi Menghubungkan Pusat ke 5 Satelit */}
                    <line x1="200" y1="200" x2="80" y2="60" stroke="#BAE6FD" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />
                    <line x1="200" y1="200" x2="320" y2="60" stroke="#BAE6FD" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />
                    <line x1="200" y1="200" x2="55" y2="200" stroke="#BAE6FD" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />
                    <line x1="200" y1="200" x2="345" y2="200" stroke="#BAE6FD" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />
                    <line x1="200" y1="200" x2="200" y2="350" stroke="#BAE6FD" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />
                  </svg>

                  {/* Inti Visual Pusat: Sentra Karst & Pahat Marmer Alami */}
                  <div className="w-40 h-40 sm:w-44 sm:h-44 rounded-[36px] bg-gradient-to-br from-[#00236F] via-[#0284C7] to-[#0369A1] shadow-[0_15px_35px_rgba(2,132,199,0.3)] border-4 border-white flex flex-col items-center justify-center p-3 text-center text-white relative overflow-hidden z-10 transition-transform hover:scale-105">
                    {/* Glow Highlight Radial */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/25 via-transparent to-transparent pointer-events-none" />

                    {/* Ikon Karst / Pualam Murni */}
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center mb-1.5 border border-white/25 shadow-inner">
                      <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-300" />
                    </div>

                    <span className="text-xs sm:text-sm font-black tracking-tight text-white block leading-snug">
                      Sentra Karst Marmer
                    </span>
                    <span className="text-[10px] text-sky-200 font-semibold block mt-0.5">
                      Batu Alam Kalsit Asli
                    </span>
                    <span className="mt-1.5 px-2 py-0.5 rounded-full bg-emerald-500/25 border border-emerald-400/40 text-[9px] font-mono font-bold text-emerald-200">
                      CaCO3 98.4% SNI
                    </span>
                  </div>

                  {/* 5 Tombol Node Satelit Interaktif */}
                  {/* 1. Lumpur Sludge (Kiri Atas) */}
                  <button
                    type="button"
                    onClick={() => setActiveEcoNode('sludge')}
                    className={cn(
                      "absolute top-2 left-1 sm:left-3 px-3 py-1.5 rounded-full shadow-md transition-all flex items-center gap-1.5 text-[11px] font-bold cursor-pointer z-20",
                      activeEcoNode === 'sludge'
                        ? "bg-[#00236F] text-white ring-2 ring-sky-300 scale-105 shadow-lg"
                        : "bg-white text-slate-700 hover:bg-sky-50 border border-sky-100"
                    )}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7] shrink-0" />
                    <span>Lumpur Sludge</span>
                  </button>

                  {/* 2. Afur Kasar (Kanan Atas) */}
                  <button
                    type="button"
                    onClick={() => setActiveEcoNode('afur')}
                    className={cn(
                      "absolute top-2 right-1 sm:right-3 px-3 py-1.5 rounded-full shadow-md transition-all flex items-center gap-1.5 text-[11px] font-bold cursor-pointer z-20",
                      activeEcoNode === 'afur'
                        ? "bg-[#00236F] text-white ring-2 ring-amber-300 scale-105 shadow-lg"
                        : "bg-white text-slate-700 hover:bg-amber-50 border border-sky-100"
                    )}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] shrink-0" />
                    <span>Afur Kasar</span>
                  </button>

                  {/* 3. Paving Ekologis (Kiri Tengah) */}
                  <button
                    type="button"
                    onClick={() => setActiveEcoNode('paving')}
                    className={cn(
                      "absolute top-1/2 left-0 -translate-y-1/2 px-3 py-1.5 rounded-full shadow-md transition-all flex items-center gap-1.5 text-[11px] font-bold cursor-pointer z-20",
                      activeEcoNode === 'paving'
                        ? "bg-[#00236F] text-white ring-2 ring-emerald-300 scale-105 shadow-lg"
                        : "bg-white text-slate-700 hover:bg-emerald-50 border border-sky-100"
                    )}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shrink-0" />
                    <span>Paving Ekologis</span>
                  </button>

                  {/* 4. Teraso Lantai (Kanan Tengah) */}
                  <button
                    type="button"
                    onClick={() => setActiveEcoNode('teraso')}
                    className={cn(
                      "absolute top-1/2 right-0 -translate-y-1/2 px-3 py-1.5 rounded-full shadow-md transition-all flex items-center gap-1.5 text-[11px] font-bold cursor-pointer z-20",
                      activeEcoNode === 'teraso'
                        ? "bg-[#00236F] text-white ring-2 ring-indigo-300 scale-105 shadow-lg"
                        : "bg-white text-slate-700 hover:bg-indigo-50 border border-sky-100"
                    )}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-[#6366F1] shrink-0" />
                    <span>Teraso Lantai</span>
                  </button>

                  {/* 5. Pupuk Kalsium (Bawah Tengah) */}
                  <button
                    type="button"
                    onClick={() => setActiveEcoNode('pupuk')}
                    className={cn(
                      "absolute bottom-1 left-1/2 -translate-x-1/2 px-3.5 py-1.5 rounded-full shadow-md transition-all flex items-center gap-1.5 text-[11px] font-bold cursor-pointer whitespace-nowrap z-20",
                      activeEcoNode === 'pupuk'
                        ? "bg-[#00236F] text-white ring-2 ring-emerald-300 scale-105 shadow-lg"
                        : "bg-white text-slate-700 hover:bg-emerald-50 border border-sky-100"
                    )}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>Pupuk Kalsium Pertanian</span>
                  </button>
                </div>
              </div>

              {/* Sisi Kanan: Kartu Layanan Terpilih Interaktif */}
              <div className="lg:col-span-6 space-y-4 text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase border bg-sky-50 text-[#0284C7] border-sky-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7] animate-pulse" />
                  <span>{currentEcoService.tag}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                  {currentEcoService.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed min-h-[44px]">
                  {currentEcoService.description}
                </p>

                <div className="space-y-2.5 pt-1">
                  {currentEcoService.points.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <a href="#simulator">
                    <button className="bg-[#0284C7] hover:bg-[#0369A1] active:scale-95 text-white text-xs font-bold px-6 py-3 rounded-full shadow-md transition-all flex items-center gap-2 cursor-pointer">
                      <span>Hitung Potensi Residu Anda</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </a>
                  <Link href="/spasial">
                    <button className="bg-white hover:bg-slate-50 active:scale-95 text-slate-700 border border-slate-200 text-xs font-bold px-5 py-3 rounded-full shadow-xs transition-all flex items-center gap-1.5 cursor-pointer">
                      <Globe2 className="w-3.5 h-3.5 text-[#0284C7]" />
                      <span>Peta Distribusi</span>
                    </button>
                  </Link>
                </div>
              </div>

            </div>
          </section>

          {/* ----------------------------------------------------------------------- */}
          {/* 5. SECTION KEUNGGULAN SISTEM: Spesialisasi Teknologi SI-MUKTI           */}
          {/* ----------------------------------------------------------------------- */}
          <section id="spesialisasi" className="px-5 sm:px-8 lg:px-14 py-12 sm:py-20 bg-white border-t border-sky-50">
            <div className="text-center max-w-2xl mx-auto space-y-2 mb-8 sm:mb-10">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#0284C7]">
                KEUNGGULAN SISTEM
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Spesialisasi Teknologi SI-MUKTI
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
                Integrasi 4 pilar teknologi sirkular untuk memodernisasi industri marmer Tulungagung dari hulu kuari karst hingga hilir manufaktur.
              </p>
            </div>

            {/* Switcher 4 Tab Spesialisasi */}
            <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-6">
              <button
                type="button"
                onClick={() => setActiveTechKey('tsp')}
                className={cn(
                  'px-3.5 sm:px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-2xs',
                  activeTechKey === 'tsp'
                    ? 'bg-[#00236F] text-white ring-2 ring-sky-300 shadow-sm font-extrabold'
                    : 'bg-slate-100/90 text-slate-700 hover:bg-slate-200 border border-slate-200/60'
                )}
              >
                <Truck className="w-3.5 h-3.5 text-amber-500" />
                <span>Optimasi Rute TSP</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTechKey('lidar')}
                className={cn(
                  'px-3.5 sm:px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-2xs',
                  activeTechKey === 'lidar'
                    ? 'bg-[#00236F] text-white ring-2 ring-sky-300 shadow-sm font-extrabold'
                    : 'bg-slate-100/90 text-slate-700 hover:bg-slate-200 border border-slate-200/60'
                )}
              >
                <Camera className="w-3.5 h-3.5 text-sky-500" />
                <span>AI LiDAR Scanner</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTechKey('wallet')}
                className={cn(
                  'px-3.5 sm:px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-2xs',
                  activeTechKey === 'wallet'
                    ? 'bg-[#00236F] text-white ring-2 ring-sky-300 shadow-sm font-extrabold'
                    : 'bg-slate-100/90 text-slate-700 hover:bg-slate-200 border border-slate-200/60'
                )}
              >
                <Wallet className="w-3.5 h-3.5 text-emerald-500" />
                <span>Dompet MUKTI-Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTechKey('passport')}
                className={cn(
                  'px-3.5 sm:px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-2xs',
                  activeTechKey === 'passport'
                    ? 'bg-[#00236F] text-white ring-2 ring-sky-300 shadow-sm font-extrabold'
                    : 'bg-slate-100/90 text-slate-700 hover:bg-slate-200 border border-slate-200/60'
                )}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                <span>Paspor Digital SNI</span>
              </button>
            </div>

            {/* Kartu Konsol Spesialisasi Utama (Tema Tatah Mineral: Light Glassmorphism Elegan) */}
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-white via-sky-50/40 to-blue-50/30 rounded-[32px] sm:rounded-[40px] p-6 sm:p-9 border-2 border-sky-200/90 shadow-[0_20px_50px_rgba(0,35,111,0.08)] relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
              
              {/* Glow Ambient Karst di Balik Kartu */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-sky-200/30 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-56 h-56 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />

              {/* Kolom Kiri: Narasi dan Fitur Spesialisasi */}
              <div className="space-y-4 text-left max-w-lg z-10">
                <div className="inline-flex items-center gap-2 bg-sky-100/80 px-3 py-1 rounded-full text-[11px] font-extrabold text-[#00236F] border border-sky-200">
                  <span className="w-2 h-2 rounded-full bg-[#0284C7] animate-pulse" />
                  <span>{currentTech.badge}</span>
                </div>

                <h3 className="text-xl sm:text-2xl lg:text-[26px] font-black tracking-tight text-[#00236F] leading-snug">
                  {currentTech.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed min-h-[48px]">
                  {currentTech.description}
                </p>

                <div className="space-y-2 pt-1">
                  {currentTech.specs.map((spec, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <Link href={currentTech.ctaHref}>
                    <button className="bg-[#00236F] hover:bg-[#1E3A8A] active:scale-95 text-white text-xs font-bold px-6 py-3 rounded-full shadow-md transition-all flex items-center gap-2 cursor-pointer">
                      <span>{currentTech.ctaLabel}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>

              {/* Kolom Kanan: Widget Konsol Telemetri Perangkat Digital */}
              <div className="bg-white/95 backdrop-blur-xl p-5 rounded-2xl border-2 border-sky-100 shadow-md text-slate-800 w-full lg:w-80 space-y-3.5 text-left z-10 shrink-0">
                <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-500 pb-2 border-b border-sky-100">
                  <span>{currentTech.telemetryTitle}</span>
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[9px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{currentTech.statusPill}</span>
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-black text-[#00236F]">
                  {currentTech.telemetrySubtitle}
                </p>

                <div className="space-y-2 text-xs">
                  {currentTech.telemetryRows.map((row, idx) => (
                    <div key={idx} className="bg-sky-50/60 p-2.5 rounded-xl border border-sky-100 flex items-center justify-between">
                      <span className="text-slate-500 text-[11px] font-medium">{row.label}:</span>
                      <strong className={cn('font-black font-tabular text-[11px] sm:text-xs', row.colorClass || 'text-slate-900')}>
                        {row.value}
                      </strong>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Grid 4 Kartu Mini Pilar Spesialisasi di Bawah Konsol */}
            <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mt-6">
              {Object.values(TECH_SPECIALITIES).map((tech) => {
                const isActive = activeTechKey === tech.id;
                return (
                  <button
                    key={tech.id}
                    type="button"
                    onClick={() => setActiveTechKey(tech.id)}
                    className={cn(
                      'p-4 rounded-2xl border transition-all text-left flex flex-col justify-between gap-3 cursor-pointer',
                      isActive
                        ? 'bg-sky-50/80 border-[#0284C7] shadow-md ring-2 ring-sky-200'
                        : 'bg-white hover:bg-slate-50/80 border-slate-200/80 shadow-2xs'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className={cn(
                        'w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white shadow-2xs',
                        tech.id === 'tsp' ? 'bg-[#00236F]' : tech.id === 'lidar' ? 'bg-[#0284C7]' : tech.id === 'wallet' ? 'bg-[#10B981]' : 'bg-indigo-600'
                      )}>
                        {tech.id === 'tsp' ? (
                          <Truck className="w-4 h-4 text-amber-300" />
                        ) : tech.id === 'lidar' ? (
                          <Camera className="w-4 h-4 text-white" />
                        ) : tech.id === 'wallet' ? (
                          <Wallet className="w-4 h-4 text-white" />
                        ) : (
                          <ShieldCheck className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className={cn(
                        'text-[9px] font-bold px-2 py-0.5 rounded-full border',
                        isActive
                          ? 'bg-[#00236F] text-white border-[#00236F]'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      )}>
                        {isActive ? 'Aktif' : 'Pilih'}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-black text-[#00236F] leading-tight">
                        {tech.tabLabel}
                      </h4>
                      <p className="text-[10px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                        {tech.badge}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ----------------------------------------------------------------------- */}
          {/* 6. SECTION JADWAL LOGISTIK (Appointment Schedules Counterpart)          */}
          {/* ----------------------------------------------------------------------- */}
          <section id="jadwal" className="px-5 sm:px-8 lg:px-14 py-12 sm:py-20 border-t border-sky-50 bg-[#F9FBFE]">
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Kolom Kiri: Teks Jadwal */}
              <div className="lg:col-span-6 space-y-4 text-left">
                <span className="text-[11px] font-black uppercase text-[#0284C7] tracking-wider">
                  JADWAL LOGISTIK
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Jadwal Pengangkutan & Valorisasi Terjadwal
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Setiap bengkel terdaftar memiliki ritase penjemputan berkala. Pengrajin juga dapat mengajukan penjemputan kilat saat bak sedimentasi lumpur terisi penuh.
                </p>

                <div className="space-y-2 text-xs text-slate-600 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
                    <span><strong>Ritase Pagi:</strong> Area Desa Campurdarat (Pkl 08:30 WIB)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
                    <span><strong>Ritase Siang:</strong> Kawasan Kuari Besole (Pkl 13:00 WIB)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span><strong>Penimbangan Otomatis:</strong> Langsung tercatat di buku kas</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link href="/pengrajin/dashboard">
                    <button className="bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold px-6 py-3 rounded-full shadow-md transition-all">
                      Lihat Dasbor Pengrajin &rarr;
                    </button>
                  </Link>
                </div>
              </div>

              {/* Kolom Kanan: 3D Stylized Calendar Sesuai Foto MedCare */}
              <div className="lg:col-span-6 flex justify-center">
                <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-xl border border-sky-100 space-y-4 text-left">
                  {/* Top Bar Kalender */}
                  <div className="bg-[#0284C7] text-white p-4 rounded-2xl flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-sky-200" />
                      <span className="text-xs font-black">Oktober 2026 • Ritase Aktif</span>
                    </div>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono">Minggu ke-4</span>
                  </div>

                  {/* Grid Hari Kalender */}
                  <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-bold text-slate-400 pb-1 border-b border-slate-100">
                    <span>Min</span><span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span>
                  </div>

                  <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-bold text-slate-700">
                    <span className="py-1 text-slate-300">18</span>
                    <span className="py-1 bg-sky-100 text-[#0284C7] rounded-lg font-black">19</span>
                    <span className="py-1">20</span>
                    <span className="py-1 bg-emerald-100 text-emerald-700 rounded-lg font-black">21</span>
                    <span className="py-1 bg-amber-100 text-amber-800 rounded-lg font-black">22</span>
                    <span className="py-1">23</span>
                    <span className="py-1 text-slate-300">24</span>
                  </div>

                  {/* Slot Status Penjemputan */}
                  <div className="bg-sky-50/80 p-3 rounded-xl border border-sky-100 space-y-1 text-xs">
                    <div className="flex items-center justify-between font-extrabold text-[#00236F]">
                      <span>Hari Ini: Kamis, 22 Okt</span>
                      <span className="text-emerald-600">On Track</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      <strong>Ritase 3:</strong> Penjemputan Sludge di Bengkel Al-Barokah (Pak Supardi).
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* ----------------------------------------------------------------------- */}
          {/* 7. SECTION PILAR AKTOR UTAMA (Our Doctors Counterpart)                  */}
          {/* ----------------------------------------------------------------------- */}
          <section id="aktor" className="px-5 sm:px-8 lg:px-14 py-12 sm:py-20 bg-white">
            <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#0284C7]">
                PILAR KOLABORASI
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Aktor Utama Sirkularitas Karst
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Kolaborasi sinergis antara pengrajin tradisional, armada logistik, dan industri offtaker.
              </p>
            </div>

            {/* 3 Kartu Aktor Sesuai Gaya MedCare (Top Visual + Solid Cyan/Blue Base) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              
              {/* Aktor 1: Pengrajin */}
              <div className="bg-white rounded-3xl overflow-hidden border border-sky-100 shadow-md hover:shadow-xl transition-all group flex flex-col justify-between">
                <div className="p-4 bg-sky-50 flex items-center justify-center">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80"
                      alt="Pak Supardi"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                </div>
                <div className="bg-[#0284C7] text-white p-4 text-center space-y-1">
                  <h4 className="text-base font-extrabold text-white">Pak Supardi</h4>
                  <p className="text-xs text-sky-100 font-medium">Ketua Paguyuban Pengrajin</p>
                  <p className="text-[10px] text-sky-200 font-mono">Bengkel Al-Barokah, Campurdarat</p>
                </div>
              </div>

              {/* Aktor 2: Driver Logistik */}
              <div className="bg-white rounded-3xl overflow-hidden border border-sky-100 shadow-md hover:shadow-xl transition-all group flex flex-col justify-between">
                <div className="p-4 bg-sky-50 flex items-center justify-center">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
                      alt="Budi Santoso"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                </div>
                <div className="bg-[#0284C7] text-white p-4 text-center space-y-1">
                  <h4 className="text-base font-extrabold text-white">Budi Santoso</h4>
                  <p className="text-xs text-sky-100 font-medium">Driver Armada Logistik</p>
                  <p className="text-[10px] text-sky-200 font-mono">Armada AG 8492 UT • Disperindag</p>
                </div>
              </div>

              {/* Aktor 3: Direktur Offtaker */}
              <div className="bg-white rounded-3xl overflow-hidden border border-sky-100 shadow-md hover:shadow-xl transition-all group flex flex-col justify-between">
                <div className="p-4 bg-sky-50 flex items-center justify-center">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"
                      alt="Ir. Hendra Sentosa"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                </div>
                <div className="bg-[#0284C7] text-white p-4 text-center space-y-1">
                  <h4 className="text-base font-extrabold text-white">Ir. Hendra Sentosa</h4>
                  <p className="text-xs text-sky-100 font-medium">Direktur Pemanfaatan Offtaker</p>
                  <p className="text-[10px] text-sky-200 font-mono">PT Sentosa Teraso & Paving</p>
                </div>
              </div>

            </div>

            <div className="text-center pt-8">
              <button
                type="button"
                onClick={() => openLoginModal()}
                className="bg-sky-50 hover:bg-sky-100 text-[#0284C7] text-xs font-bold px-6 py-2.5 rounded-full border border-sky-200 transition-all shadow-sm"
              >
                Coba Masuk Akun Simulasi Aktor
              </button>
            </div>
          </section>

          {/* ----------------------------------------------------------------------- */}
          {/* 8. SECTION PERBEDAAN HAK AKSES: GUEST VS USER LOGIN                     */}
          {/* ----------------------------------------------------------------------- */}
          <section id="hak-akses" className="px-5 sm:px-8 lg:px-14 py-12 sm:py-20 border-t border-sky-50 bg-[#F9FBFE]">
            <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#0284C7]">
                TATA KELOLA PENGGUNA
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Perbedaan Hak Akses: Mode Tamu vs Pengguna Terverifikasi
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Prinsip transparansi publik untuk konsumen dan keamanan data operasional untuk pengrajin UMKM.
              </p>
            </div>

            {/* Kartu Komparasi 2 Kolom */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto items-stretch">
              
              {/* Kartu 1: Mode Tamu (Guest / Publik) */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-sm flex flex-col justify-between space-y-5 text-left">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center font-bold">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-900">
                          Mode Tamu (Guest / Publik)
                        </h3>
                        <p className="text-[11px] text-slate-400">Konsumen, Wisatawan, & Peneliti</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                      Akses Terbuka
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Didesain untuk transparansi publik tanpa hambatan registrasi. Siapa pun dapat memvalidasi keaslian marmer Tulungagung dan mengawasi dampak sirkular karst.
                  </p>

                  <ul className="space-y-2 text-xs text-slate-700 pt-1">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong>Peta Web-GIS Spasial Publik:</strong> Eksplorasi sebaran residu dan lokasi pabrik.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong>MUKTI-Trace QR Scanner:</strong> Pindai label QR produk untuk sertifikat lab spektrometri.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong>Kalkulator Valorisasi:</strong> Simulasi perhitungan nilai rupiah dan reduksi emisi.</span>
                    </li>
                  </ul>

                  <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-[11px] space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Lock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Batasan Keamanan Mode Tamu:</span>
                    </div>
                    <p className="leading-relaxed">
                      Tidak dapat menjadwalkan armada truk, mencetak e-Manifest, mencairkan saldo Bank Jatim, atau menerbitkan paspor baru.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Status: {isLoggedIn ? 'Sesi Terautentikasi' : 'Aktif (Tamu)'}
                  </span>
                  <Link href="/spasial" className="text-xs font-bold text-[#0284C7] hover:underline flex items-center gap-1">
                    <span>Eksplorasi Tamu</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Kartu 2: Pengguna Terverifikasi (Logged In) */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#0284C7] shadow-lg flex flex-col justify-between space-y-5 text-left relative overflow-hidden">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#0284C7] text-white flex items-center justify-center font-bold">
                        <ShieldCheck className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-[#00236F]">
                          Pengguna Terverifikasi (Logged In)
                        </h3>
                        <p className="text-[11px] text-slate-400">Pengrajin UMKM & Pabrik Offtaker</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-sky-100 text-[#0284C7]">
                      Otoritas Penuh
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Ruang kerja terotorisasi untuk tata kelola operasional rantai pasok marmer, penerbitan sertifikat digital bergaransi, dan pencairan insentif ekonomi sirkular.
                  </p>

                  <ul className="space-y-2 text-xs text-slate-700 pt-1">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                      <span><strong>Dompet Sirkular MUKTI-Pay:</strong> Saldo valorisasi otomatis dan pencairan instan Bank Jatim.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                      <span><strong>Lapor Residu AI:</strong> Auto-capture GPS &lt;3m & kalkulasi volumetrik lumpur/afur otomatis.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                      <span><strong>Dispatch Armada & e-Manifest Resmi:</strong> Buat rute multi-stop & cetak surat jalan sah DLH.</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-sky-100 flex items-center justify-between">
                  {isLoggedIn && user ? (
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold text-[#00236F]">
                        Aktif: <strong>{user.fullName}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={logout}
                        className="text-xs text-rose-600 font-bold hover:underline"
                      >
                        Keluar
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openLoginModal()}
                      className="w-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold py-2.5 rounded-full shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Masuk Akun Pengrajin Demo</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          </section>

          {/* ----------------------------------------------------------------------- */}
          {/* 9. SECTION KALKULATOR VALORISASI INTERAKTIF                             */}
          {/* ----------------------------------------------------------------------- */}
          <section id="simulator" className="px-5 sm:px-8 lg:px-14 py-12 sm:py-20 bg-white">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center space-y-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#0284C7]">
                  KALKULATOR EKONOMI SIRKULAR
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Hitung Potensi Valorisasi Residu Bengkel Anda
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Simulasikan pendapatan tambahan yang diperoleh pengrajin marmer dan kontribusi reduksi karbon regional.
                </p>
              </div>

              <div className="bg-[#F9FBFE] rounded-3xl p-6 sm:p-8 border border-sky-100 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Kontrol Input */}
                <div className="space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Jenis Residu Marmer:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setCalcWasteType('sludge')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                          calcWasteType === 'sludge'
                            ? 'bg-[#0284C7] text-white shadow-sm'
                            : 'bg-white border border-slate-200 text-slate-600'
                        }`}
                      >
                        Sludge Lumpur
                      </button>
                      <button
                        onClick={() => setCalcWasteType('afur')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                          calcWasteType === 'afur'
                            ? 'bg-[#F59E0B] text-white shadow-sm'
                            : 'bg-white border border-slate-200 text-slate-600'
                        }`}
                      >
                        Afur Kasar
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs font-bold mb-1">
                      <span className="text-slate-700">Taksiran Tonase Residu:</span>
                      <span className="text-[#0284C7] font-tabular font-black text-sm">
                        {calcTonnage.toFixed(1)} Ton
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="15"
                      step="0.5"
                      value={calcTonnage}
                      onChange={(e) => setCalcTonnage(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0284C7]"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>0.5 Ton (Pick-up)</span>
                      <span>15 Ton (Dump Truck)</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 bg-white p-3 rounded-xl border border-sky-100">
                    Tarif resmi valorisasi: <strong>{formatRupiah(ratePerTon)}/Ton</strong> diserap oleh pabrik paving block dan teraso mitra SI-MUKTI.
                  </div>
                </div>

                {/* Hasil Kalkulasi */}
                <div className="bg-gradient-to-br from-[#0284C7] to-[#00236F] text-white p-6 rounded-2xl shadow-lg space-y-4 text-left">
                  <div>
                    <span className="text-[10px] text-sky-200 uppercase font-bold tracking-wider block">
                      Estimasi Saldo MUKTI-Pay Diterima
                    </span>
                    <strong className="text-3xl font-black font-tabular text-amber-300 block mt-1">
                      {formatRupiah(estimatedEarned)}
                    </strong>
                    <p className="text-[10px] text-sky-100/80 mt-0.5">
                      Siap dicairkan ke rekening Bank Jatim pengrajin
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-sky-200 block text-[10px]">Reduksi Emisi Karbon:</span>
                      <strong className="text-emerald-300 font-tabular font-bold">
                        ~{co2OffsetKg} kg CO2 eq
                      </strong>
                    </div>
                    <div>
                      <span className="text-sky-200 block text-[10px]">Paving Tercipta:</span>
                      <strong className="text-white font-tabular font-bold">
                        ~{(calcTonnage * 140).toFixed(0)} buah
                      </strong>
                    </div>
                  </div>

                  <Link href="/pengrajin/waste/new" className="block pt-1">
                    <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 px-3 rounded-full text-xs transition-colors shadow-sm">
                      Lapor &amp; Jadwalkan Penjemputan &rarr;
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* ----------------------------------------------------------------------- */}
          {/* 10. SECTION TELEMETRI REGIONAL                                          */}
          {/* ----------------------------------------------------------------------- */}
          <section className="px-5 sm:px-8 lg:px-14 py-12 sm:py-20 border-t border-sky-50 bg-[#F9FBFE]">
            <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#0284C7]">
                DAMPAK RIIL REGIONAL
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Capaian Ekologis & Ekonomi Karst Tulungagung
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              <MetricStatCard
                variant="eco"
                title="Reduksi Jejak Karbon"
                value="-38.2% CO2 eq"
                subtitle="Target PRD Terpenuhi"
                icon={<TrendingDown className="w-6 h-6" />}
                trend={{ label: 'Substitusi klinker primer', positive: true }}
              />

              <MetricStatCard
                variant="blue"
                title="Residu Terserap Sirkular"
                value="142.8 Ton"
                subtitle="Tersalurkan ke 6 Pabrik Offtaker"
                icon={<Recycle className="w-6 h-6" />}
                trend={{ label: 'Zero-Dumping Sungai Ngrowo', positive: true }}
              />

              <MetricStatCard
                variant="gold"
                title="Surplus Valorisasi UMKM"
                value="Rp 24.850.000"
                subtitle="Tercairkan via Bank Jatim"
                icon={<Wallet className="w-6 h-6" />}
                trend={{ label: '+100% tepat sasaran', positive: true }}
              />

              <MetricStatCard
                variant="default"
                title="Kepatuhan Uji Mutu"
                value="98.7% Lolos"
                subtitle="Standar SNI 03-0394"
                icon={<ShieldCheck className="w-6 h-6" />}
                trend={{ label: 'CaCO3 > 95% Grade A+', positive: true }}
              />
            </div>
          </section>

          {/* ----------------------------------------------------------------------- */}
          {/* 11. FOOTER MINIMALIS ELEGAN (Sesuai Konsep Frame)                       */}
          {/* ----------------------------------------------------------------------- */}
          <footer className="px-5 sm:px-8 lg:px-12 py-8 bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div>
                <p className="font-extrabold text-white text-sm">SI-MUKTI Tulungagung</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Sistem Informasi Manajemen Spasial dan Rantai Pasok Marmer Tulungagung
                </p>
              </div>
              <div className="text-[11px] text-slate-400 space-y-0.5">
                <p>© 2026 LKTIN TIM Salma • Seluruh Hak Cipta Dilindungi.</p>
                <p>Didukung Pemkab Tulungagung, Disperindag, ESDM Jatim, & Paguyuban Pengrajin.</p>
              </div>
            </div>
          </footer>

        </div>
      </div>
    </div>
  );
}