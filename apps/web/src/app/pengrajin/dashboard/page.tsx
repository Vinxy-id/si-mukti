'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BigActionButton } from '@/components/ui/BigActionButton';
import { MetricStatCard } from '@/components/ui/MetricStatCard';
import { DEFAULT_PENGRAJIN_PROFILE, formatRupiah, formatTon } from '@/lib/api-client';
import { useSystemStore } from '@/lib/system-store';
import { useAuth } from '@/lib/auth-context';
import {
  Wallet,
  Recycle,
  ShieldCheck,
  Truck,
  PlusCircle,
  PhoneCall,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Building2,
  FastForward,
  Sparkles,
  MapPin,
  FileCheck2,
  ExternalLink,
  Award,
  ChevronRight,
} from 'lucide-react';

export default function PengrajinDashboardPage() {
  const { user, isLoggedIn } = useAuth();
  const { walletBalance, activeLogistics } = useSystemStore();
  const profile = DEFAULT_PENGRAJIN_PROFILE;

  // State simulasi progress armada truk penjemput (Step 1 -> 4)
  const [truckStep, setTruckStep] = useState<number>(2); // 1: Dipesan, 2: Menuju Lokasi, 3: Ditimbang, 4: Selesai

  const steps = [
    { num: 1, label: 'Dipesan' },
    { num: 2, label: 'Menuju Lokasi' },
    { num: 3, label: 'Ditimbang' },
    { num: 4, label: 'Selesai' },
  ];

  const handleAdvanceStep = () => {
    setTruckStep((prev) => (prev >= 4 ? 1 : prev + 1));
  };

  return (
    <div className="space-y-3 sm:space-y-4.5">
      {/* 1. Header Salam & Informasi Bengkel - Bersih & Rapi */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/80">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Sugeng Rawuh,</span>
            <span className="text-[10px] bg-sky-50 text-[#00236F] font-bold px-1.5 py-0.2 rounded border border-sky-200">
              Paguyuban {profile.workshop.paguyubanId}
            </span>
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-[#00236F] leading-tight truncate">
            {isLoggedIn && user ? user.fullName : profile.fullName}
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 truncate">
            {profile.workshop.name} &bull; {profile.workshop.addressDetail}
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <Link
            href="/spasial"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[#00236F] bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
          >
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Peta Web-GIS</span>
          </Link>
          <Link
            href="/pengrajin/waste/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#10B981] hover:bg-emerald-600 transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Lapor Residu</span>
          </Link>
        </div>
      </section>

      {/* 2. Grid Baris 1: Hero Saldo Valorisasi + Aksi Cepat Setor Residu */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch">
        {/* Banner Saldo MUKTI-Pay (7 Kolom di Desktop) */}
        <div className="lg:col-span-7 bg-gradient-to-br from-[#00236F] via-[#1E3A8A] to-[#0A192F] rounded-3xl p-4 sm:p-5 text-white shadow-level-2 border border-slate-700/30 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-[#DCE1FF] font-semibold tracking-wide uppercase">
                  <Wallet className="w-4 h-4 text-emerald-300" />
                  <span>Saldo Valorisasi (MUKTI-Pay)</span>
                </div>
                <div className="text-2xl sm:text-4xl font-black font-tabular tracking-tight mt-1 text-white">
                  {formatRupiah(walletBalance)}
                </div>
                <p className="text-[11px] sm:text-xs text-blue-200 mt-0.5">
                  Rekening: <strong>{profile.wallet.bankName}</strong> ({profile.wallet.bankAccountNumber})
                </p>
              </div>

              <span className="inline-flex items-center gap-1 bg-[#ECFDF5] text-[#006C49] px-2.5 py-1 rounded-full text-xs font-extrabold border border-emerald-200 shrink-0">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+18.4%</span>
              </span>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-white/15 flex flex-wrap items-center gap-3 relative z-10">
            <Link href="/pengrajin/wallet" className="flex-1 min-w-[200px]">
              <BigActionButton
                variant="eco"
                className="w-full py-2.5 sm:py-3 min-h-[44px] text-xs font-extrabold shadow-md flex items-center justify-center gap-2"
                icon={<Wallet className="w-4 h-4" />}
              >
                Tarik Saldo ke Rekening Bank Jatim
              </BigActionButton>
            </Link>
          </div>
        </div>

        {/* Kartu Aksi Cepat Setor Residu Baru (5 Kolom di Desktop) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-3xl p-4 sm:p-5 text-white shadow-level-2 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none" />

          <div className="space-y-1.5 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold border border-white/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Insentif Valorisasi Otomatis</span>
            </div>
            <h3 className="text-base sm:text-lg font-black leading-snug">
              Setor Timbulan Residu Baru?
            </h3>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Kamera AI LiDAR siap mengukur volume lumpur kalsit marmer (sludge) atau afur. Armada offtaker siap menjemput langsung.
            </p>
          </div>

          <div className="pt-2.5 relative z-10">
            <Link href="/pengrajin/waste/new" className="block w-full">
              <button
                type="button"
                className="w-full bg-white hover:bg-slate-100 text-[#006C49] font-black text-xs py-2.5 px-4 rounded-2xl shadow-md transition-all flex items-center justify-between min-h-[42px]"
              >
                <span className="flex items-center gap-2">
                  <PlusCircle className="w-4 h-4" />
                  <span>Setor Residu Sekarang</span>
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Baris 2: Ringkasan Metrik (2 Kolom di Mobile, 4 Kolom di Desktop) - Bebas Tumpukan */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3.5">
        <MetricStatCard
          variant="eco"
          title="Limbah Terserap"
          value={formatTon(profile.metrics.distributedTonnage)}
          subtitle="Teraso & Paving"
          icon={<Recycle className="w-5 h-5" />}
          trend={{ label: 'Zero-Waste', positive: true }}
        />

        <MetricStatCard
          variant="gold"
          title="Paspor QR Aktif"
          value={`${profile.metrics.activePassports} Produk`}
          subtitle="Marmer Asli"
          icon={<ShieldCheck className="w-5 h-5" />}
          trend={{ label: 'SNI 03-0394', positive: true }}
        />

        <MetricStatCard
          variant="blue"
          title="Cegah Pencemaran"
          value="8.500 kg"
          subtitle="Sungai Ngrowo"
          icon={<CheckCircle2 className="w-5 h-5" />}
          trend={{ label: '100% Bersih', positive: true }}
        />

        <MetricStatCard
          variant="default"
          title="Kadar Kalsit SNI"
          value="98.4% CaCO3"
          subtitle="Kalsit Alam"
          icon={<Award className="w-5 h-5" />}
          trend={{ label: 'Lolos Mutu', positive: true }}
        />
      </section>

      {/* 4. Baris 3: Live Tracking Truk & Rincian Pesanan (Berdampingan di Desktop) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-5 items-start">
        {/* Kolom Kiri: Pelacakan Armada Truk Penjemput (7 Kolom di Desktop) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-4 sm:p-5 border border-border-chiseled shadow-level-1 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
              <h4 className="text-xs font-black text-[#00236F] uppercase tracking-wider">
                Live Tracking Armada Penjemput Terdekat
              </h4>
            </div>
            <span className="text-xs font-mono font-bold text-slate-400">
              #{profile.activeLogistics.orderCode}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#00236F] shrink-0">
                <Truck className="w-5 sm:w-6 h-5 sm:h-6" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-extrabold text-[#00236F]">
                  {profile.activeLogistics.plateNumber} ({profile.activeLogistics.vehicleType})
                </p>
                <p className="text-[11px] sm:text-xs text-slate-500">
                  Pengemudi: <strong>{profile.activeLogistics.driverName}</strong> &bull; Tujuan: {profile.activeLogistics.offtakerName}
                </p>
              </div>
            </div>

            <span className="px-2.5 sm:px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-extrabold border border-amber-200 shrink-0 font-tabular">
              {truckStep === 4 ? 'Selesai' : `ETA: ${profile.activeLogistics.etaMinutes} Menit`}
            </span>
          </div>

          {/* Stepper Progress Visual */}
          <div className="relative pt-2 pb-1 px-2">
            <div className="absolute top-5 left-6 right-6 h-1.5 bg-slate-100 z-0 rounded-full" />
            <div
              className="absolute top-5 left-6 h-1.5 bg-[#10B981] z-0 rounded-full transition-all duration-300"
              style={{
                width: `${((truckStep - 1) / (steps.length - 1)) * 100}%`,
              }}
            />

            <div className="relative z-10 flex items-center justify-between">
              {steps.map((st) => {
                const isPassed = st.num <= truckStep;
                const isCurrent = st.num === truckStep;

                return (
                  <div key={st.num} className="flex flex-col items-center gap-1">
                    <div
                      className={`w-7 sm:w-8 h-7 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                        isPassed
                          ? 'bg-[#10B981] text-white ring-4 ring-emerald-50'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isPassed && st.num < truckStep ? (
                        <CheckCircle2 className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                      ) : (
                        st.num
                      )}
                    </div>
                    <span
                      className={`text-[11px] sm:text-xs tracking-tight ${
                        isCurrent
                          ? 'font-extrabold text-[#00236F]'
                          : isPassed
                          ? 'font-bold text-[#006C49]'
                          : 'text-slate-400 font-medium'
                      }`}
                    >
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Kontrol Aksi Stepper & WhatsApp Sopir */}
          <div className="pt-2 flex items-center gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleAdvanceStep}
              className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-[#00236F] text-xs font-bold rounded-xl transition-all active:scale-98 flex items-center justify-center gap-1.5 min-h-[40px]"
            >
              <FastForward className="w-4 h-4 text-amber-600" />
              <span>Simulasi Status Truk ({truckStep}/4)</span>
            </button>

            <a
              href={`https://wa.me/62${profile.activeLogistics.driverPhone.replace(/^0/, '')}?text=Halo%20Pak%20${encodeURIComponent(
                profile.activeLogistics.driverName
              )},%20saya%20${encodeURIComponent(profile.fullName)}%20dari%20${encodeURIComponent(
                profile.workshop.name
              )}%20Campurdarat.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-[#ECFDF5] text-[#006C49] hover:bg-emerald-100 rounded-xl border border-emerald-200 flex items-center justify-center gap-1.5 transition-colors shadow-xs text-xs font-bold min-h-[40px]"
              title="Hubungi Sopir via WhatsApp"
            >
              <PhoneCall className="w-4 h-4" />
              <span>WhatsApp Sopir</span>
            </a>
          </div>
        </div>

        {/* Kolom Kanan: Rantai Pasok Paspor & Pintasan Spasial (5 Kolom di Desktop) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-border-chiseled shadow-level-1 space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#D97706]" />
                <span>Paspor Digital Marmer</span>
              </h4>
              <Link href="/pengrajin/passports" className="text-xs font-bold text-[#00236F] hover:underline flex items-center gap-0.5">
                <span>Lihat Semua ({profile.metrics.activePassports})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Produk marmer bengkel Anda telah tersertifikasi asli geologis anti-marmer sintetis resin impor.
            </p>

            <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Produk Terakhir:</span>
                <strong className="text-slate-900 font-bold">Wastafel Batu Utuh Karst Popoh</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Nomor Segel:</span>
                <span className="font-mono text-[#D97706] font-bold">PAS-TA-2026-0819</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Residu Ter-offset:</span>
                <strong className="text-emerald-700 font-bold">8.5 kg Sludge</strong>
              </div>
            </div>

            <Link
              href="/verify/e3b0c44298fc1c149afbf4c8996fb92427ae"
              target="_blank"
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#00236F]" />
              <span>Buka Halaman Verifikasi Konsumen</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
