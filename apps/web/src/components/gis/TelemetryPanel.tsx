'use client';

import React from 'react';
import {
  TrendingDown,
  Sparkles,
  Recycle,
  Factory,
  Users,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { REGIONAL_TELEMETRY } from '@/lib/gis-data';
import { formatRupiah } from '@/lib/utils';

interface TelemetryPanelProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function TelemetryPanel({
  isCollapsed = false,
  onToggleCollapse,
}: TelemetryPanelProps) {
  return (
    <div className="bg-gradient-to-r from-[#00236F] via-[#1E3A8A] to-[#0A192F] text-white rounded-3xl p-4 sm:p-5 shadow-level-2 border border-blue-900/40 relative overflow-hidden transition-all duration-300">
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Telemetri & Tombol Toggle */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 rounded-xl border border-emerald-400/30 text-emerald-300 flex-shrink-0">
            <Recycle className="w-5 h-5" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-emerald-300 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Telemetri Disperindag & DLH Tulungagung
            </div>
            <h2 className="text-sm sm:text-base font-extrabold tracking-tight">
              Dampak Sirkularitas Kawasan Karst (Campurdarat & Besole)
            </h2>
          </div>
        </div>

        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-blue-100 transition-colors"
            title={isCollapsed ? 'Tampilkan Rincian Metrik' : 'Sembunyikan Rincian'}
          >
            <span className="hidden sm:inline">
              {isCollapsed ? 'Tampilkan Detail' : 'Ciutkan Panel'}
            </span>
            {isCollapsed ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Tampilan Compact HUD saat Collapsed (1 Baris Ringkas) */}
      {isCollapsed && (
        <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center gap-3 text-xs relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-xl">
            <span className="text-blue-200">Emisi:</span>
            <strong className="text-emerald-400 font-tabular font-extrabold">
              {REGIONAL_TELEMETRY.carbonEmissionsReducedPct}% CO2 eq
            </strong>
          </div>
          <div className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-xl">
            <span className="text-blue-200">Residu Terserap:</span>
            <strong className="text-white font-tabular font-extrabold">
              {REGIONAL_TELEMETRY.totalWasteAbsorbedTons} Ton
            </strong>
          </div>
          <div className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-xl">
            <span className="text-blue-200">Surplus Valorisasi:</span>
            <strong className="text-amber-300 font-tabular font-extrabold">
              {formatRupiah(REGIONAL_TELEMETRY.economicSurplusGeneratedIdr)}
            </strong>
          </div>
          <div className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-xl">
            <span className="text-blue-200">Mitra:</span>
            <strong className="text-white font-extrabold">
              {REGIONAL_TELEMETRY.activeParticipatingWorkshops} Bengkel
            </strong>
          </div>
        </div>
      )}

      {/* Grid Metrik Utama Lengkap (Saat Expanded) */}
      {!isCollapsed && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 relative z-10 animate-fade-in">
          {/* Metrik 1: Reduksi Emisi Karbon (PRD Target -38.2%) */}
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <span className="text-[11px] text-blue-200 font-medium block">
              Reduksi Emisi Karbon
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <strong className="text-xl sm:text-2xl font-black font-tabular text-emerald-400">
                {REGIONAL_TELEMETRY.carbonEmissionsReducedPct}%
              </strong>
              <span className="text-xs text-emerald-300 font-bold">CO2 eq</span>
            </div>
            <p className="text-[10px] text-blue-200/80 mt-1">
              Pengganti klinker kalsit primer tambang
            </p>
          </div>

          {/* Metrik 2: Total Residu Terserap */}
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <span className="text-[11px] text-blue-200 font-medium block">
              Residu Terserap Sirkular
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <strong className="text-xl sm:text-2xl font-black font-tabular text-white">
                {REGIONAL_TELEMETRY.totalWasteAbsorbedTons}
              </strong>
              <span className="text-xs text-blue-200 font-bold">Ton</span>
            </div>
            <p className="text-[10px] text-blue-200/80 mt-1">
              Zero-Dumping ke Sungai Ngrowo
            </p>
          </div>

          {/* Metrik 3: Valorisasi Ekonomi */}
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <span className="text-[11px] text-blue-200 font-medium block">
              Surplus Ekonomi UMKM
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <strong className="text-base sm:text-xl font-black font-tabular text-amber-300">
                {formatRupiah(REGIONAL_TELEMETRY.economicSurplusGeneratedIdr)}
              </strong>
            </div>
            <p className="text-[10px] text-blue-200/80 mt-1">
              Tercairkan via Bank Jatim
            </p>
          </div>

          {/* Metrik 4: Ekosistem Mitra */}
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <span className="text-[11px] text-blue-200 font-medium block">
              Kemitraan Sentra
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <strong className="text-xl sm:text-2xl font-black font-tabular text-white">
                {REGIONAL_TELEMETRY.activeParticipatingWorkshops}
              </strong>
              <span className="text-xs text-blue-200 font-bold">Bengkel</span>
            </div>
            <p className="text-[10px] text-blue-200/80 mt-1">
              Terkoneksi ke {REGIONAL_TELEMETRY.activeOfftakers} Pabrik Offtaker
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
