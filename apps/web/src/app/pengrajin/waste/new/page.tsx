'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BigActionButton } from '@/components/ui/BigActionButton';
import { formatRupiah, cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { useSystemStore } from '@/lib/system-store';
import { AiCameraScanner } from '@/components/waste/AiCameraScanner';
import { type GisWasteItem } from '@/lib/gis-data';
import {
  Recycle,
  Camera,
  MapPin,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Layers,
  UploadCloud,
  Check,
  AlertCircle,
  HelpCircle,
  Clock,
  Building2,
  Lock,
  Globe2,
  Wallet,
  ArrowRight,
  Droplets,
  Boxes,
} from 'lucide-react';

export default function LaporResiduPage() {
  const router = useRouter();
  const { isLoggedIn, openLoginModal } = useAuth();
  const { addWastePoint } = useSystemStore();

  // State Form
  const [wasteType, setWasteType] = useState<'sludge_lumpur' | 'afur_kasar'>('sludge_lumpur');
  const [inputMode, setInputMode] = useState<'ai_camera' | 'manual'>('ai_camera');
  const [volumeM3, setVolumeM3] = useState<number>(2.15);
  const [tonnage, setTonnage] = useState<number>(3.5);
  const [photoPreview, setPhotoPreview] = useState<string>(
    'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=600&q=80'
  );
  const [notes, setNotes] = useState<string>('Sludge basah pembubutan guci kalsit putih, diendapkan 24 jam');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);

  // GPS Auto-Capture State
  const [gpsCoords, setGpsCoords] = useState<{
    lat: number;
    lng: number;
    accuracy: number;
    isLocating: boolean;
  }>({
    lat: -8.1633,
    lng: 111.8594,
    accuracy: 2.1,
    isLocating: false,
  });

  // Auto-capture GPS saat halaman dibuka
  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      setGpsCoords((prev) => ({ ...prev, isLocating: true }));
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: Math.round(pos.coords.accuracy * 10) / 10 || 2.1,
            isLocating: false,
          });
        },
        () => {
          setGpsCoords((prev) => ({ ...prev, isLocating: false }));
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, []);

  // Tarif resmi valorisasi
  const ratePerTon = wasteType === 'sludge_lumpur' ? 180000 : 120000;
  const bulkDensity = wasteType === 'sludge_lumpur' ? 1.628 : 1.545; // ton/m3

  const handleVolumeChange = (newVol: number) => {
    setVolumeM3(newVol);
    const calculatedTon = Math.round(newVol * bulkDensity * 100) / 100;
    setTonnage(calculatedTon);
  };

  const estimatedValue = tonnage * ratePerTon;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }
    setIsSubmitting(true);

    const newWasteItem: GisWasteItem = {
      id: `w-dynamic-${Date.now()}`,
      workshopId: 'a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      workshopName: 'Bengkel Marmer Al-Barokah (Pak Supardi)',
      ownerName: 'Pak Supardi',
      contactPhone: '081234567801',
      subdistrict: 'Campurdarat',
      village: 'Desa Gamping',
      addressDetail: 'Jl. Raya Popoh No. 45, Sentra Bubut Karst',
      wasteType,
      pinColorCategory: wasteType === 'sludge_lumpur' ? 'HIJAU_SLUDGE' : 'ORANYE_AFUR',
      estimatedVolumeM3: volumeM3,
      estimatedTonnage: tonnage,
      ratePerTon,
      estimatedTransactionValueIdr: estimatedValue,
      photoUrl: photoPreview,
      aiConfidenceScore: 98.6,
      status: 'tersedia',
      latitude: gpsCoords.lat,
      longitude: gpsCoords.lng,
      distanceKm: 2.4,
      labCertNumber: 'LAB-SNI-2026/0394-099',
      caco3Pct: wasteType === 'sludge_lumpur' ? 98.4 : 96.8,
      moisturePct: wasteType === 'sludge_lumpur' ? 18.2 : 6.5,
      phLevel: 8.2,
      purityGrade: 'A+',
      isPassedSni: true,
      recordedAt: 'Baru saja',
    };

    setTimeout(() => {
      addWastePoint(newWasteItem);
      setIsSubmitting(false);
      setSubmittedSuccess(true);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
        <Link
          href="/pengrajin/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#00236F] transition-colors shrink-0"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
          <span className="hidden sm:inline">Kembali ke Dasbor Pengrajin</span>
          <span className="sm:hidden">Dasbor Pengrajin</span>
        </Link>
        <span className="text-[11px] sm:text-xs font-bold text-[#006C49] bg-[#ECFDF5] px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border border-emerald-200 shrink-0 whitespace-nowrap">
          Formulir Residu
        </span>
      </div>

      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-black text-[#00236F] tracking-tight">
          Setor Residu Limbah Marmer
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Daftarkan timbulan lumpur (<span className="italic font-medium text-slate-700">sludge</span>) atau pecahan batu (<span className="italic font-medium text-slate-700">afur</span>) untuk dijadwalkan penjemputannya oleh armada truk offtaker.
        </p>
      </div>

      {submittedSuccess ? (
        // Sukses Submission Card
        <div className="bg-white rounded-3xl p-8 border-2 border-emerald-500 shadow-level-2 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#ECFDF5] text-[#10B981] mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-black text-[#00236F]">
              Residu Berhasil Didaftarkan!
            </h3>
            <p className="text-xs text-slate-500">
              Limbah Anda telah masuk ke sistem Web-GIS MUKTI-Spasial dan menunggu konfirmasi penjemputan truk terdekat.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl text-left text-xs space-y-2.5 border border-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-500">Jenis Residu:</span>
              <span className="font-bold text-slate-900 capitalize">
                {wasteType.replace('_', ' ')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Estimasi Bobot:</span>
              <span className="font-black text-[#00236F] font-tabular">
                {tonnage} Ton (~{volumeM3} m³)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Estimasi Insentif MUKTI-Pay:</span>
              <span className="font-black text-emerald-700 font-tabular text-sm">
                {formatRupiah(estimatedValue)}
              </span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-200">
              <span className="text-slate-500">Koordinat GPS:</span>
              <span className="font-mono text-slate-700">
                {gpsCoords.lat.toFixed(4)}, {gpsCoords.lng.toFixed(4)}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Link href="/spasial">
              <BigActionButton variant="eco" className="w-full text-xs font-bold" icon={<Globe2 className="w-4 h-4" />}>
                Lihat Titik Anda di Peta Spasial Command Center
              </BigActionButton>
            </Link>

            <Link href="/pengrajin/wallet">
              <BigActionButton variant="outline" className="w-full text-xs font-bold bg-white text-[#00236F] border-slate-300" icon={<Wallet className="w-4 h-4 text-emerald-600" />}>
                Cek Saldo Masuk di Dompet MUKTI-Pay
              </BigActionButton>
            </Link>

            <button
              type="button"
              onClick={() => setSubmittedSuccess(false)}
              className="py-2 text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              + Setor Residu Lainnya
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Kolom Kiri: Input Jenis, Volume, dan Lokasi (7 Kolom di Desktop) */}
          <div className="lg:col-span-7 space-y-4">
            {/* 1. SEGMENTED BUTTON: Sludge vs Afur */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border-chiseled shadow-xs space-y-2.5">
              <label className="text-xs font-black text-slate-800 uppercase tracking-wide block">
                1. Pilih Jenis Residu Batuan
              </label>
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setWasteType('sludge_lumpur');
                    handleVolumeChange(volumeM3);
                  }}
                  className={cn(
                    'py-3.5 px-2.5 sm:px-3 rounded-2xl flex flex-col items-center gap-1.5 font-bold text-xs transition-all text-center',
                    wasteType === 'sludge_lumpur'
                      ? 'bg-white text-[#006C49] shadow-sm ring-2 ring-[#10B981]'
                      : 'bg-white/60 text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:bg-white'
                  )}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#006C49] border border-emerald-200 flex items-center justify-center shrink-0 shadow-xs">
                    <Droplets className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-xs block text-slate-900">
                      Lumpur Sludge
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block border border-emerald-200/70">
                      Rp 180k / Ton
                    </span>
                    <p className="text-[10px] text-slate-500 font-normal">
                      Hasil bubut basah
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setWasteType('afur_kasar');
                    handleVolumeChange(volumeM3);
                  }}
                  className={cn(
                    'py-3.5 px-2.5 sm:px-3 rounded-2xl flex flex-col items-center gap-1.5 font-bold text-xs transition-all text-center',
                    wasteType === 'afur_kasar'
                      ? 'bg-white text-amber-900 shadow-sm ring-2 ring-amber-500'
                      : 'bg-white/60 text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:bg-white'
                  )}
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center shrink-0 shadow-xs">
                    <Boxes className="w-5 h-5 text-amber-700" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-xs block text-slate-900">
                      Bongkahan Afur
                    </span>
                    <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full inline-block border border-amber-200/70">
                      Rp 120k / Ton
                    </span>
                    <p className="text-[10px] text-slate-500 font-normal">
                      Pecahan gergaji
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* 2. MODE DETEKSI & PENGUKURAN */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-border-chiseled shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span className="text-xs sm:text-sm font-black text-slate-800">
                    2. Estimasi Bobot Tonase
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:inline-flex rounded-xl bg-slate-100 p-1 text-xs font-bold w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setInputMode('ai_camera')}
                    className={cn(
                      'py-1.5 px-3 rounded-lg transition-all text-center whitespace-nowrap text-xs',
                      inputMode === 'ai_camera'
                        ? 'bg-[#00236F] text-white shadow-xs font-black'
                        : 'text-slate-600 hover:text-slate-900 font-bold'
                    )}
                  >
                    Kamera AI (LiDAR)
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMode('manual')}
                    className={cn(
                      'py-1.5 px-3 rounded-lg transition-all text-center whitespace-nowrap text-xs',
                      inputMode === 'manual'
                        ? 'bg-[#00236F] text-white shadow-xs font-black'
                        : 'text-slate-600 hover:text-slate-900 font-bold'
                    )}
                  >
                    Input Manual
                  </button>
                </div>
              </div>

              {inputMode === 'ai_camera' ? (
                /* Scanner Kamera AI Interaktif */
                <AiCameraScanner
                  wasteType={wasteType}
                  photoUrl={photoPreview}
                  onVolumeCalculated={(vol, ton) => {
                    setVolumeM3(vol);
                    setTonnage(ton);
                  }}
                />
              ) : (
                /* Slider Volume & Tonase Input Manual */
                <div className="space-y-3 pt-1">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-600">Volume Bak Penampung:</span>
                      <span className="text-[#00236F] font-tabular font-black">
                        {volumeM3} m³
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="6.0"
                      step="0.1"
                      value={volumeM3}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#00236F]"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                      <span>0.5 m³ (Bak Kecil)</span>
                      <span>6.0 m³ (Bak Galian Masif)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Tonase Terhitung (Ton):
                      </label>
                      <input
                        type="number"
                        step="0.05"
                        value={tonnage}
                        onChange={(e) => setTonnage(parseFloat(e.target.value) || 0)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-black text-[#00236F] font-tabular text-base outline-none focus:border-[#00236F]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Faktor Densitas:
                      </label>
                      <div className="px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 font-bold text-slate-700 text-sm font-tabular">
                        {bulkDensity} Ton/m³
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. AUTO-CAPTURE GPS KOORDINAT */}
            <div className="bg-white p-5 rounded-3xl border border-border-chiseled shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#00236F]" />
                  <span className="text-xs font-black text-slate-800">
                    3. Titik Koordinat GPS Penjemputan
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-[#006C49] px-2.5 py-0.5 rounded-md text-[10px] font-bold border border-emerald-200">
                  <Check className="w-3 h-3" />
                  Presisi: {gpsCoords.accuracy}m
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs flex flex-col gap-1">
                <div className="flex justify-between font-mono text-xs text-slate-700">
                  <span>Lat: {gpsCoords.lat.toFixed(6)}</span>
                  <span>Lng: {gpsCoords.lng.toFixed(6)}</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Bengkel Marmer Al-Barokah, Jl. Raya Popoh No. 45, Desa Gamping, Campurdarat
                </p>
              </div>
            </div>

            {/* 4. CATATAN PENGRAJIN */}
            <div className="bg-white p-5 rounded-3xl border border-border-chiseled shadow-xs space-y-1.5">
              <label className="text-xs font-black text-slate-800">
                4. Catatan Tambahan (Opsional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Sludge marmer putih telah diendapkan 24 jam"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:border-[#00236F]"
              />
            </div>
          </div>

          {/* Kolom Kanan: Viewfinder Kamera AI & Ringkasan Transaksi (5 Kolom di Desktop) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Viewfinder Kamera AI */}
            <div className="bg-white p-5 rounded-3xl border border-border-chiseled shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-[#00236F]" />
                  <span>Pratinjau Foto Tumpukan Residu</span>
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  AI Active
                </span>
              </div>

              <div className="relative w-full h-52 rounded-2xl overflow-hidden bg-slate-900 border border-slate-700">
                <img
                  src={photoPreview}
                  alt="Preview Limbah"
                  className="w-full h-full object-cover opacity-85"
                />
                {/* Mock AI Computer Vision Bounding Box */}
                <div className="absolute inset-4 border-2 border-dashed border-[#10B981] rounded-xl bg-emerald-500/10 flex items-start justify-between p-2.5 pointer-events-none">
                  <span className="bg-[#10B981] text-white text-[10px] font-black px-2 py-0.5 rounded shadow-sm">
                    Kalsit AI: 96.8% Akurat
                  </span>
                  <span className="bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded">
                    Vol: ~{volumeM3} m³
                  </span>
                </div>

                <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-black/75 backdrop-blur-md rounded-xl px-3 py-2 flex items-center justify-between text-xs text-white">
                  <span>Densitas: {bulkDensity} Ton/m³</span>
                  <span className="font-black text-emerald-300">
                    Bobot: {tonnage} Ton
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500">
                Foto diambil di bak penampungan endapan pemotongan basah bengkel Al-Barokah.
              </p>
            </div>

            {/* Kartu Ringkasan Valorisasi & Tombol Kirim */}
            <div className="bg-gradient-to-br from-[#00236F] to-[#1E3A8A] text-white p-6 rounded-3xl shadow-level-2 space-y-4">
              <div>
                <span className="text-[11px] text-blue-200 uppercase font-bold tracking-wider block">
                  Estimasi Insentif MUKTI-Pay
                </span>
                <strong className="text-3xl font-black font-tabular text-amber-300 block mt-1">
                  {formatRupiah(estimatedValue)}
                </strong>
                <p className="text-xs text-blue-200 mt-1">
                  Kalkulasi: {tonnage} Ton x {formatRupiah(ratePerTon)}/Ton
                </p>
              </div>

              <div className="pt-3 border-t border-white/15 space-y-1.5 text-xs">
                <div className="flex justify-between text-blue-100">
                  <span>Tujuan Pabrik:</span>
                  <strong className="text-white">PT Sentosa Teraso</strong>
                </div>
                <div className="flex justify-between text-blue-100">
                  <span>Pencairan Dana:</span>
                  <strong className="text-emerald-300">Otomatis Pasca-Timbang</strong>
                </div>
              </div>

              <div className="pt-2">
                <BigActionButton
                  type="submit"
                  variant="eco"
                  size="large"
                  isLoading={isSubmitting}
                  className="w-full text-xs font-black shadow-md min-h-[50px]"
                  icon={isLoggedIn ? <Recycle className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                >
                  {isLoggedIn
                    ? `Setor Residu Limbah (${tonnage} Ton)`
                    : `Setor Residu (Perlu Login Pengrajin)`}
                </BigActionButton>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
