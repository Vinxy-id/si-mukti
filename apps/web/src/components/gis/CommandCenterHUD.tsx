'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingDown,
  Sparkles,
  Recycle,
  Factory,
  Users,
  CheckCircle2,
  ChevronRight,
  Radio,
  Activity,
  Layers,
  Award,
  Zap,
  Hammer,
  Droplets,
  Building2,
  Truck,
  Wallet,
  ShieldCheck,
} from 'lucide-react';
import { REGIONAL_TELEMETRY, MOCK_GIS_WASTE_POINTS, MOCK_GIS_OFFTAKERS } from '@/lib/gis-data';
import { formatRupiah } from '@/lib/utils';

interface CircularProgressProps {
  percentage: number;
  label: string;
  subLabel: string;
  usedLabel: string;
  colorHex?: string;
}

export function CircularGauge({
  percentage,
  label,
  subLabel,
  usedLabel,
  colorHex = '#0284C7',
}: CircularProgressProps) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md p-3 rounded-2xl border border-sky-100 shadow-xs hover:shadow-md transition-shadow">
      {/* SVG Circular Ring Gauge */}
      <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
        <svg className="w-16 h-16 transform -rotate-90">
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke="#E0F2FE"
            strokeWidth="5"
            fill="none"
          />
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke={colorHex}
            strokeWidth="5.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <span className="absolute font-black text-xs font-tabular text-slate-800 tracking-tight">
          {percentage}%
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight truncate">
          {label}
        </p>
        <h4 className="text-sm font-black font-tabular text-[#00236F] leading-snug">
          {subLabel}
        </h4>
        <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
          {usedLabel}
        </p>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// PANEL SISI KANAN: TELEMETRI & ANALISIS GAUGE (COMMAND CENTER HUD)
// -----------------------------------------------------------------------------
export function RightCommandHUD() {
  const [activeCustomerTab, setActiveCustomerTab] = useState<'harian' | 'mingguan'>('mingguan');

  const rankingClusters = [
    { rank: 1, name: 'Kecamatan Campurdarat', ton: 68.5, workshops: 18, pct: 92, status: 'Aktif' },
    { rank: 2, name: 'Kecamatan Besole', ton: 44.2, workshops: 12, pct: 76, status: 'Aktif' },
    { rank: 3, name: 'Koridor JLS Pantai Popoh', ton: 18.1, workshops: 5, pct: 54, status: 'Optimal' },
    { rank: 4, name: 'Kawasan Boyolangu', ton: 12.0, workshops: 3, pct: 38, status: 'Siap Jemput' },
  ];

  return (
    <div className="space-y-4">
      {/* 1. KARTU GAUGES CIRCULAR (Resource Allocation / Mutu Batuan) */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-4 sm:p-5 border border-sky-100 shadow-[0_8px_30px_rgb(2,132,199,0.06)] space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-sky-50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7] animate-pulse" />
            <h3 className="text-xs font-black text-[#00236F] uppercase tracking-wider">
              Status Sirkularitas Karst
            </h3>
          </div>
          <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
            Live Telemetri
          </span>
        </div>

        {/* 4 Circular Ring Gauges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <CircularGauge
            percentage={38}
            label="Reduksi Emisi Karbon"
            subLabel="-38.2% CO2 eq"
            usedLabel="Substitusi klinker tambang"
            colorHex="#10B981"
          />
          <CircularGauge
            percentage={98}
            label="Kadar Kalsit CaCO3"
            subLabel="98.4% Kalsit"
            usedLabel="SNI 03-0394 Grade A+"
            colorHex="#0284C7"
          />
          <CircularGauge
            percentage={86}
            label="Rasio Penyerapan"
            subLabel="142.8 Ton"
            usedLabel="Terserap 6 Pabrik Mitra"
            colorHex="#0284C7"
          />
          <CircularGauge
            percentage={100}
            label="Bebas Pembuangan"
            subLabel="100% Zero-Dump"
            usedLabel="Bantaran Sungai Ngrowo"
            colorHex="#F59E0B"
          />
        </div>
      </div>

      {/* 2. RADIAL FLOW METER: TOP 3 PABRIK OFFTAKER PEMANFAAT */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-4 sm:p-5 border border-sky-100 shadow-[0_8px_30px_rgb(2,132,199,0.06)] space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-sky-50">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#0284C7]" />
            <h3 className="text-xs font-black text-[#00236F] uppercase tracking-wider">
              Pemanfaat Residu Terbesar (Offtaker)
            </h3>
          </div>
          <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
            Total 195 Ton/mgg
          </span>
        </div>

        {/* Visualisasi Donut Chart & Total Kapasitas Terpusat */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-1">
          {/* Donut Chart SVG Proposional */}
          <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
            <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background Ring */}
              <circle
                cx="50"
                cy="50"
                r="38"
                stroke="#F1F5F9"
                strokeWidth="8"
                fill="none"
              />
              {/* Segment 1: PT Agro (100 Ton - 51.3%) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                stroke="#10B981"
                strokeWidth="8"
                strokeDasharray="120.4 118.36"
                strokeDashoffset="0"
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-1000"
              />
              {/* Segment 2: PT Sentosa (60 Ton - 30.8%) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                stroke="#0284C7"
                strokeWidth="8"
                strokeDasharray="71.5 167.26"
                strokeDashoffset="-122.4"
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-1000"
              />
              {/* Segment 3: CV Makmur (35 Ton - 17.9%) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                stroke="#F59E0B"
                strokeWidth="8"
                strokeDasharray="40.8 197.96"
                strokeDashoffset="-195.9"
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-1000"
              />
            </svg>

            {/* Label Metrik Tengah */}
            <div className="absolute text-center flex flex-col items-center justify-center">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                Total Serap
              </span>
              <span className="text-xl font-black font-tabular text-[#00236F] leading-tight">
                195 Ton
              </span>
              <span className="text-[9px] text-slate-500 font-medium">
                per minggu
              </span>
            </div>
          </div>
        </div>

        {/* Daftar 3 Pabrik Offtaker (Tersusun Rapi Tanpa Tumpang Tindih) */}
        <div className="space-y-2 pt-1">
          {/* Offtaker 1: PT Agro Kalsium */}
          <div className="bg-slate-50/80 hover:bg-emerald-50/50 p-2.5 rounded-2xl border border-slate-100 transition-colors flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center justify-center shrink-0">
                1
              </span>
              <div className="min-w-0">
                <h4 className="text-xs font-black text-slate-900 truncate">
                  PT Agro Kalsium
                </h4>
                <p className="text-[10px] text-slate-500 truncate">
                  Pupuk Kalsium Pertanian
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <strong className="text-xs font-black text-[#00236F] font-tabular block">
                100 Ton/mgg
              </strong>
              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded-md">
                51.3% porsi
              </span>
            </div>
          </div>

          {/* Offtaker 2: PT Sentosa Teraso */}
          <div className="bg-slate-50/80 hover:bg-sky-50/50 p-2.5 rounded-2xl border border-slate-100 transition-colors flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-5 h-5 rounded-full bg-sky-100 text-[#0284C7] text-[10px] font-black flex items-center justify-center shrink-0">
                2
              </span>
              <div className="min-w-0">
                <h4 className="text-xs font-black text-slate-900 truncate">
                  PT Sentosa Teraso
                </h4>
                <p className="text-[10px] text-slate-500 truncate">
                  Paving Block & Teraso
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <strong className="text-xs font-black text-[#00236F] font-tabular block">
                60 Ton/mgg
              </strong>
              <span className="text-[9px] font-bold text-sky-700 bg-sky-100/70 px-1.5 py-0.5 rounded-md">
                30.8% porsi
              </span>
            </div>
          </div>

          {/* Offtaker 3: CV Makmur Paving */}
          <div className="bg-slate-50/80 hover:bg-amber-50/50 p-2.5 rounded-2xl border border-slate-100 transition-colors flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black flex items-center justify-center shrink-0">
                3
              </span>
              <div className="min-w-0">
                <h4 className="text-xs font-black text-slate-900 truncate">
                  CV Makmur Paving
                </h4>
                <p className="text-[10px] text-slate-500 truncate">
                  Bahan Bangunan & Mortar
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <strong className="text-xs font-black text-[#00236F] font-tabular block">
                35 Ton/mgg
              </strong>
              <span className="text-[9px] font-bold text-amber-700 bg-amber-100/70 px-1.5 py-0.5 rounded-md">
                17.9% porsi
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. RANKING KLASTER SENTRA INDUSTRI KARST (Tabel Progress Bar Glowing) */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-4 sm:p-5 border border-sky-100 shadow-[0_8px_30px_rgb(2,132,199,0.06)] space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-sky-50">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#0284C7]" />
            <h3 className="text-xs font-black text-[#00236F] uppercase tracking-wider">
              Sebaran Timbulan per Klaster
            </h3>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
            4 Sentra
          </span>
        </div>

        <div className="space-y-2.5">
          {rankingClusters.map((cluster) => (
            <div key={cluster.rank} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                      cluster.rank === 1
                        ? 'bg-amber-400 text-slate-900'
                        : cluster.rank === 2
                        ? 'bg-sky-200 text-sky-900'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {cluster.rank}
                  </span>
                  <span>{cluster.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-tabular font-black text-[#00236F]">
                    {cluster.ton} Ton
                  </span>
                  <span className="text-[10px] text-slate-400">
                    ({cluster.workshops} Bengkel)
                  </span>
                </div>
              </div>

              {/* Glowing High-Tech Progress Bar */}
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-400 to-[#0284C7] transition-all duration-700 shadow-xs"
                  style={{ width: `${cluster.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// PANEL SISI KIRI: METRIK VERTIKAL & KONTROL CEPAT (LEFT HUD PILLARS)
// -----------------------------------------------------------------------------
export function LeftCommandHUD({
  totalPoints,
  totalTonnage,
  onOpenNewWaste,
}: {
  totalPoints: number;
  totalTonnage: number;
  onOpenNewWaste?: () => void;
}) {
  const statItems = [
    { label: 'Bengkel Terhubung', val: `${totalPoints} Titik`, icon: <Hammer className="w-4 h-4 text-indigo-600" /> },
    { label: 'Residu Siap Angkut', val: `${totalTonnage.toFixed(1)} Ton`, icon: <Droplets className="w-4 h-4 text-[#0284C7]" /> },
    { label: 'Pabrik Offtaker', val: '6 Mitra', icon: <Building2 className="w-4 h-4 text-purple-600" /> },
    { label: 'Armada Truk Aktif', val: '12 Truk', icon: <Truck className="w-4 h-4 text-amber-600" /> },
    { label: 'Reduksi Emisi', val: '-38.2% CO2', icon: <TrendingDown className="w-4 h-4 text-emerald-600" /> },
    { label: 'Surplus Valorisasi', val: 'Rp 24,8 Jt', icon: <Wallet className="w-4 h-4 text-amber-600" /> },
    { label: 'Paspor QR Asli', val: '14 Produk', icon: <ShieldCheck className="w-4 h-4 text-sky-600" /> },
  ];

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-4 border border-sky-100 shadow-[0_8px_30px_rgb(2,132,199,0.06)] space-y-3">
      <div className="pb-2 border-b border-sky-50 flex items-center justify-between">
        <span className="text-[11px] font-black text-[#00236F] uppercase tracking-wider">
          Metrik Operasional
        </span>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
      </div>

      <div className="space-y-2">
        {statItems.map((st, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-2 rounded-2xl bg-gradient-to-r from-sky-50/50 to-white hover:from-sky-100/60 transition-all border border-sky-50 group"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-white shadow-xs flex items-center justify-center border border-sky-100 group-hover:scale-110 transition-transform shrink-0">
                {st.icon}
              </span>
              <div>
                <p className="text-[10px] text-slate-500 font-semibold leading-tight">
                  {st.label}
                </p>
                <p className="text-xs font-black font-tabular text-[#00236F] leading-snug">
                  {st.val}
                </p>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-sky-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        ))}
      </div>
    </div>
  );
}
