'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  Sparkles,
  MapPin,
  Calendar,
  Layers,
  Flame,
  Clock,
  Share2,
  Download,
  Phone,
  FileCheck2,
  QrCode,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  Search,
  Printer,
  X,
  Landmark,
  ArrowLeft,
} from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import { BigActionButton } from '@/components/ui/BigActionButton';
import { useSystemStore } from '@/lib/system-store';
import { GlobalModuleNavbar } from '@/components/layout/GlobalModuleNavbar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { AppBottomNav } from '@/components/layout/AppBottomNav';

interface TraceabilityStep {
  stepNumber: number;
  stageName: string;
  stageTitle: string;
  location: string;
  dateStr: string;
  verifiedBy: string;
  description: string;
  evidenceDoc: string;
}

export default function PublicVerifyPassportPage() {
  const params = useParams();
  const { getPassportByHashOrSerial } = useSystemStore();
  const hashParam = (params?.hash as string) || 'e3b0c44298fc1c149afbf4c8996fb92427ae';
  const displayHash = hashParam.length > 32 ? `${hashParam.slice(0, 32)}...` : hashParam;

  const [copiedLink, setCopiedLink] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isConsumerView, setIsConsumerView] = useState(false);

  // Data Spesifikasi Paspor Marmer Terverifikasi
  const defaultPassportData = {
    serialNumber: 'PAS-TA-2026-0819',
    authenticitySealNumber: 'MKT-2026-78412-TA',
    productName: 'Wastafel Marmer Batu Utuh Karst Popoh',
    productCategory: 'Sanitari & Wastafel Mewah',
    quarryOrigin: 'Kuari Karst Selatan Besole, Tulungagung',
    quarryBatchCode: 'QRY-BSL-2026-X8',
    workshopName: 'Bengkel Marmer Al-Barokah',
    artisanName: 'Pak Supardi (Pengrajin Generasi ke-3)',
    workshopAddress: 'Jl. Raya Popoh No. 45, Sentra Bubut Karst Campurdarat, Tulungagung',
    contactPhone: '081234567801',
    dimensions: '45 cm x 35 cm x 15 cm',
    weightKg: 28.5,
    circularResidueOffsetKg: 8.5,
    labCertNumber: 'LAB-SNI-2026/0394-081',
    caco3Percentage: 98.4,
    moisturePercentage: 16.2,
    phLevel: 8.3,
    status: 'terverifikasi',
    extractionPermit: 'IUP No. 540/128/ESDM-JATIM',
    photoUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    verificationTimestamp: '22 Oktober 2026, 14:30 WIB',
    cryptographicSignature: 'HMAC-SHA256:7b92a4e98f01c3d9a1e847291a82f3c091d',
  };

  const matchedRecord = searchQuery.trim()
    ? getPassportByHashOrSerial(searchQuery)
    : getPassportByHashOrSerial(hashParam);

  const passportData = matchedRecord
    ? {
        ...defaultPassportData,
        serialNumber: matchedRecord.serialNumber,
        productName: matchedRecord.productName,
        dimensions: matchedRecord.dimensions,
        weightKg: matchedRecord.weightKg,
        circularResidueOffsetKg: matchedRecord.circularWasteOffsetKg,
        photoUrl: matchedRecord.photoUrl || defaultPassportData.photoUrl,
        cryptographicSignature: `HMAC-SHA256:${matchedRecord.cryptoHash.slice(0, 32)}`,
      }
    : defaultPassportData;

  const timelineSteps: TraceabilityStep[] = [
    {
      stepNumber: 1,
      stageName: 'Kuari Tambang',
      stageTitle: 'Ekstraksi Bongkahan Marmer Alam Berizin',
      location: 'Kuari Karst Selatan Besole, Tulungagung',
      dateStr: '15 September 2026',
      verifiedBy: 'Dinas ESDM Wilayah Tulungagung',
      description:
        'Bongkahan batuan marmer kalsit masif diekstraksi dari formasi karst laut dangkal Tersier tanpa bahan peledak terlarang.',
      evidenceDoc: 'IUP Resmi No. 540/128/ESDM-JATIM',
    },
    {
      stepNumber: 2,
      stageName: 'Bengkel Bubut',
      stageTitle: 'Pembubutan & Pemahatan Manual Basah',
      location: 'Bengkel Al-Barokah, Campurdarat',
      dateStr: '02 Oktober 2026',
      verifiedBy: 'Paguyuban Pengrajin Marmer Tulungagung',
      description:
        'Dipahat presisi oleh Pak Supardi menggunakan teknik bubut air tradisional untuk mempertahankan kilau serat mineral kalsit kristalin.',
      evidenceDoc: 'Sertifikat Keahlian Tatah Mineral',
    },
    {
      stepNumber: 3,
      stageName: 'Uji Mutu Laboratorium',
      stageTitle: 'Verifikasi Spektrometri SNI 03-0394',
      location: 'Balai Standardisasi Mutu Batuan Jawa Timur',
      dateStr: '18 Oktober 2026',
      verifiedBy: 'Laboratorium Uji Mutu Material Jatim',
      description:
        'Analisis XRF & Spektrometri membuktikan kadar kalsit kalsium karbonat (CaCO3) sebesar 98.4%, bebas bahan kimia poliester resin sintetis.',
      evidenceDoc: 'Sertifikat Uji LAB-SNI-2026/0394-081',
    },
    {
      stepNumber: 4,
      stageName: 'Valorisasi Sirkular',
      stageTitle: '100% Residu Didaur Ulang (Zero-Waste)',
      location: 'Sentra Paving & Teraso Sirkular Boyolangu',
      dateStr: '20 Oktober 2026',
      verifiedBy: 'SI-MUKTI Circular Ledger',
      description:
        'Residu lumpur kalsium seberat 8.5 kg dari proses pemahatan produk ini telah diserap menjadi bahan baku paving block ramah lingkungan.',
      evidenceDoc: 'e-Manifest MNF-TA-20261022-0042',
    },
  ];

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: 'Verifikasi Keaslian Marmer Tulungagung',
        text: `Produk ${passportData.productName} telah terverifikasi asli 100% batu alam marmer Tulungagung (Segel: ${passportData.serialNumber}).`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-surface-canvas text-text-primary antialiased flex flex-col md:flex-row">
      {/* Sidebar Persisten Terpadu (Tampil saat bukan mode konsumen) */}
      {!isConsumerView && (
        <AppSidebar showCollapseToggle={false} />
      )}

      {/* Kolom Konten Utama MUKTI-Trace */}
      <div className="flex-1 flex flex-col min-w-0 pb-16">
        {/* Banner Mode Pratinjau Publik jika diaktifkan */}
        {isConsumerView && (
          <div className="bg-gradient-to-r from-[#00236F] via-[#1E3A8A] to-[#0A192F] text-white px-4 py-2.5 text-xs font-medium flex items-center justify-between sticky top-0 z-40 shadow-sm print:hidden">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                <strong>Pratinjau Mode Publik (Konsumen):</strong> Mensimulasikan tampilan pembeli luar kota saat memindai kode QR fisik pada produk marmer.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsConsumerView(false)}
              className="bg-white/20 hover:bg-white/30 text-white font-bold px-3 py-1 rounded-lg text-xs transition-colors shrink-0 ml-2"
            >
              Kembali ke Portal
            </button>
          </div>
        )}

        {/* Top Header Terpadu Sesuai Tema Light Glassmorphism SI-MUKTI */}
        <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 py-3 px-4 sm:px-6 lg:px-8 shadow-xs sticky top-0 z-30">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Sisi Kiri: Tombol Beranda & Identitas Lembaga */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              <Link
                href="/"
                className="p-1.5 sm:p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-[#00236F] transition-colors shrink-0"
                title="Kembali ke Beranda"
              >
                <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5" />
              </Link>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#00236F] to-[#1E3A8A] flex items-center justify-center text-amber-300 font-bold shrink-0 shadow-sm">
                <Landmark className="w-4 sm:w-5 h-4 sm:h-5 text-amber-300" />
              </div>
              <div className="flex flex-col shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-black tracking-tight text-[#00236F] whitespace-nowrap">
                    SI-MUKTI
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-black uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                    MUKTI-Trace
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-semibold whitespace-nowrap hidden sm:block">
                  Paspor Digital Marmer &bull; Pemkab Tulungagung
                </p>
              </div>
            </div>

            {/* Sisi Tengah: Navigasi Modul Terpadu Global Desktop (Varian Light Selaras) */}
            <GlobalModuleNavbar variant="light" className="hidden lg:flex shrink-0" />

            {/* Sisi Kanan: Aksi Pratinjau & Lencana Verifikasi SNI */}
            <div className="flex items-center gap-2 shrink-0">
              {!isConsumerView ? (
                <button
                  type="button"
                  onClick={() => setIsConsumerView(true)}
                  className="hidden sm:inline-flex items-center gap-1.5 bg-sky-50 hover:bg-sky-100 text-[#00236F] border border-sky-200 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs"
                  title="Pratinjau tampilan konsumen luar kota tanpa sidebar"
                >
                  <QrCode className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>Mode Publik</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsConsumerView(false)}
                  className="hidden sm:inline-flex items-center gap-1.5 bg-[#00236F] hover:bg-[#1E3A8A] text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs"
                  title="Kembali ke tampilan portal terpadu dengan sidebar"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-amber-300" />
                  <span>Mode Portal</span>
                </button>
              )}

              <div className="flex items-center gap-1.5 bg-[#ECFDF5] text-[#006C49] border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                <span className="hidden sm:inline">Terverifikasi SNI</span>
                <span className="sm:hidden">SNI</span>
              </div>
            </div>
          </div>
        </header>

      {/* Konten Utama Responsif (Bebas Blank Space pada Layar Windows / Desktop) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Kotak Pencarian Nomor Seri / Hash Paspor Manual (Lebar Penuh) */}
        <div className="bg-white p-3.5 sm:p-4 rounded-3xl border border-border-chiseled shadow-xs space-y-1.5 print:hidden">
          <label className="text-[11px] font-bold text-slate-600 block">
            Verifikasi Nomor Seri / Hash Paspor Lainnya:
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ketik serial (contoh: PAS-TA-2026-0819, PAS-TA-2026-0820)..."
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00236F] focus:bg-white text-slate-800 font-mono"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Tata Letak Grid 2-Kolom Desktop (Setema & Proporsional dengan Dasbor / GIS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ========================================================================= */}
          {/* KOLOM KIRI (5 Kolom Desktop): Segel Keaslian, Foto Produk, & Aksi Cepat    */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 space-y-5">
            {/* Banner Status Keaslian Resmi (Tatah Mineral Design System) */}
            <section className="bg-gradient-to-br from-[#00236F] via-[#1E3A8A] to-[#0A192F] text-white p-5 sm:p-6 rounded-3xl shadow-level-2 border border-blue-900/40 relative overflow-hidden text-center">
              <div className="absolute top-0 right-0 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

              {/* Lencana Emas Segel Resmi */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30 mb-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>SEGEL KEASLIAN GEOLOGIS RESMI</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                PRODUK TERVERIFIKASI ASLI
              </h2>
              <p className="text-xs sm:text-sm text-emerald-300 font-extrabold uppercase tracking-wide mt-0.5">
                100% Batu Alam Marmer Tulungagung
              </p>

              <div className="mt-3.5 py-2 px-3.5 bg-white/10 rounded-2xl inline-block border border-white/10">
                <p className="text-[10px] text-blue-200 uppercase tracking-widest font-mono">
                  Nomor Registrasi Paspor
                </p>
                <p className="text-sm sm:text-base font-black font-tabular tracking-wider text-amber-300">
                  {passportData.serialNumber} &bull; {passportData.authenticitySealNumber}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-300 font-mono">
                <span>Hash:</span>
                <span className="bg-black/40 px-2 py-0.5 rounded-md text-slate-200 font-mono text-[10px]">
                  {displayHash}
                </span>
              </div>
            </section>

            {/* Kartu Profil & Foto Produk Marmer */}
            <section className="bg-white rounded-3xl border border-border-chiseled p-5 shadow-xs space-y-4">
              <div className="w-full h-56 sm:h-64 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative">
                <img
                  src={passportData.photoUrl}
                  alt={passportData.productName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20">
                  {passportData.productCategory}
                </div>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                  {passportData.productName}
                </h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#00236F] shrink-0" />
                  <span>Dipahat di: <strong>{passportData.workshopName}</strong></span>
                </p>
                <p className="text-[11px] text-slate-600 pl-5">
                  Karya {passportData.artisanName} ({passportData.workshopAddress})
                </p>
              </div>

              {/* Rincian Spesifikasi Teknis Produk */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Dimensi Fisik</span>
                  <strong className="text-slate-900 font-tabular font-bold">
                    {passportData.dimensions}
                  </strong>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Bobot Produk</span>
                  <strong className="text-slate-900 font-tabular font-bold">
                    {passportData.weightKg} kg
                  </strong>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Asal Formasi Karst</span>
                  <strong className="text-slate-900 font-bold truncate block">
                    {passportData.quarryOrigin}
                  </strong>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Kode Batch Kuari</span>
                  <strong className="text-[#00236F] font-mono font-bold">
                    {passportData.quarryBatchCode}
                  </strong>
                </div>
              </div>

              {/* Kontribusi Sirkular Zero-Waste */}
              <div className="bg-[#ECFDF5] border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
                <div className="p-2 bg-emerald-500 text-white rounded-xl shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-emerald-900 uppercase">
                    Kontribusi Ekologi Zero-Waste
                  </h4>
                  <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                    Pembelian marmer ini telah mengimbangi{' '}
                    <strong className="font-tabular font-black text-emerald-950">
                      {passportData.circularResidueOffsetKg} kg
                    </strong>{' '}
                    residu pemahatan yang didaur ulang menjadi paving block ramah lingkungan, mencegah pencemaran bantaran Sungai Ngrowo Tulungagung.
                  </p>
                </div>
              </div>
            </section>

            {/* Tombol Aksi Konsumen */}
            <section className="space-y-2.5 pt-1 print:hidden">
              <BigActionButton
                onClick={() => {
                  window.print();
                }}
                className="w-full bg-[#00236F] hover:bg-[#1E3A8A] text-white flex items-center justify-center gap-2 shadow-md"
              >
                <Printer className="w-4 h-4 text-amber-300" />
                <span>Unduh e-Passport Keaslian (PDF Resmi)</span>
              </BigActionButton>

              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={`https://wa.me/62${passportData.contactPhone.replace(/^0/, '')}?text=Halo%20${encodeURIComponent(
                    passportData.artisanName
                  )},%20saya%20telah%20memverifikasi%20produk%20marmer%20${encodeURIComponent(
                    passportData.productName
                  )}%20(Nomor%20Segel%20${passportData.serialNumber})%20dan%20sangat%20mengapresiasi%20karya%20Anda.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-xs font-bold text-emerald-800 transition-colors min-h-[48px] shadow-xs"
                >
                  <Phone className="w-4 h-4" />
                  <span>WhatsApp Pengrajin</span>
                </a>

                <button
                  type="button"
                  onClick={handleShare}
                  className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors min-h-[48px] shadow-xs active:scale-95"
                >
                  <Share2 className="w-4 h-4 text-[#00236F]" />
                  <span>{copiedLink ? 'Link Tersalin!' : 'Bagikan Paspor'}</span>
                </button>
              </div>
            </section>
          </div>

          {/* ========================================================================= */}
          {/* KOLOM KANAN (7 Kolom Desktop): Spektrometri, Linimasa Rantai Pasok & Audit */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 space-y-5">
            {/* Tabel Komparasi Spektrometri: Marmer Asli vs Resin Sintetis */}
            <section className="bg-white rounded-3xl border border-border-chiseled p-5 sm:p-6 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-blue-50 text-[#00236F] rounded-xl border border-blue-100">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900">
                      Uji Spektrometri Mutu Batuan
                    </h3>
                    <p className="text-[10px] sm:text-xs text-slate-500">
                      Standar Nasional Indonesia (SNI 03-0394)
                    </p>
                  </div>
                </div>
                <span className="text-[10px] sm:text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Grade A+ Kalsit
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Hasil pengujian laboratorium membuktikan produk ini adalah 100% batuan metamorf kalsit alami, berbeda total dari marmer sintetis resin impor:
              </p>

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Parameter Uji</th>
                      <th className="py-2.5 px-3 text-emerald-800 bg-emerald-50/70 font-black">
                        Marmer Tulungagung (Produk Ini)
                      </th>
                      <th className="py-2.5 px-3 text-slate-500">
                        Marmer Sintetis / Resin
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">
                        Kadar Kalsit (CaCO3)
                      </td>
                      <td className="py-2.5 px-3 font-black text-emerald-700 bg-emerald-50/40 font-tabular">
                        98.4% (Tinggi)
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 font-tabular">
                        0% (Serbuk resin polimer)
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">
                        Struktur Kristal
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-900 bg-emerald-50/40">
                        Kristalin Masif Alami
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">
                        Plastik buatan cetak
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">
                        Ketahanan Panas
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-900 bg-emerald-50/40">
                        Tahan &gt; 800&deg;C
                      </td>
                      <td className="py-2.5 px-3 text-red-600 font-medium">
                        Meleleh pada &gt; 120&deg;C
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">
                        Masa Pakai
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-900 bg-emerald-50/40">
                        Ratusan Tahun
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">
                        Menguning 2-3 tahun
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">
                        Sertifikasi
                      </td>
                      <td className="py-2.5 px-3 font-bold text-[#00236F] bg-emerald-50/40 font-mono text-[11px]">
                        {passportData.labCertNumber}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400">Tidak Terdaftar</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Linimasa Rantai Pasok Karst (Traceability Stepper) */}
            <section className="bg-white rounded-3xl border border-border-chiseled p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
                <div className="p-2 bg-blue-50 text-[#00236F] rounded-xl border border-blue-100">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900">
                    Linimasa Rantai Pasok Geologis
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-500">
                    Jejak Terverifikasi dari Tambang Karst hingga Tangan Konsumen
                  </p>
                </div>
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-blue-100">
                {timelineSteps.map((step) => (
                  <div key={step.stepNumber} className="relative group">
                    {/* Lingkaran Stepper */}
                    <div className="absolute -left-6 top-0 w-5 h-5 rounded-full bg-[#00236F] text-white flex items-center justify-center text-[10px] font-black ring-4 ring-white shadow-sm">
                      {step.stepNumber}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <span className="text-[10px] font-extrabold text-[#D97706] uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                          {step.stageName}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400">
                          {step.dateStr}
                        </span>
                      </div>

                      <h4 className="text-xs sm:text-sm font-black text-slate-900">
                        {step.stageTitle}
                      </h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {step.description}
                      </p>

                      <div className="flex items-center gap-2 pt-1 text-[10px] text-slate-500">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                        <span>Diverifikasi oleh: <strong>{step.verifiedBy}</strong></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Footer Sertifikasi Resmi Pemkab */}
        <footer className="text-center pt-8 pb-4 text-[11px] text-slate-400 space-y-1 border-t border-slate-200/60 mt-8">
          <p>&copy; 2026 Pemerintah Kabupaten Tulungagung &bull; SI-MUKTI</p>
          <p>
            Dinas Perindustrian dan Perdagangan bekerjasama dengan Paguyuban Pengrajin Marmer Campurdarat &amp; Besole
          </p>
        </footer>
      </main>

      {/* Navigasi Mobile Bawah */}
      <AppBottomNav />
      </div>
    </div>
  );
}
