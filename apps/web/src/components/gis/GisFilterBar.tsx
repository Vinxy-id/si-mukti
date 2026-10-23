'use client';

import React from 'react';
import { Filter, Compass, Sliders, CheckSquare, Square, Route, Droplets, Boxes } from 'lucide-react';

interface GisFilterBarProps {
  wasteTypeFilter: 'all' | 'sludge_lumpur' | 'afur_kasar';
  setWasteTypeFilter: (type: 'all' | 'sludge_lumpur' | 'afur_kasar') => void;
  radiusKm: number;
  setRadiusKm: (radius: number) => void;
  strictSniFilter: boolean;
  setStrictSniFilter: (val: boolean) => void;
  totalFilteredPoints: number;
  totalFilteredTonnage: number;
  isMultiStopRouteActive: boolean;
  onToggleMultiStopRoute: () => void;
}

export default function GisFilterBar({
  wasteTypeFilter,
  setWasteTypeFilter,
  radiusKm,
  setRadiusKm,
  strictSniFilter,
  setStrictSniFilter,
  totalFilteredPoints,
  totalFilteredTonnage,
  isMultiStopRouteActive,
  onToggleMultiStopRoute,
}: GisFilterBarProps) {
  return (
    <div className="bg-white rounded-3xl border border-border-chiseled p-4 sm:p-5 shadow-xs space-y-3">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Filter Tipe Residu */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#00236F]" />
            Jenis Residu:
          </span>
          <button
            onClick={() => setWasteTypeFilter('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              wasteTypeFilter === 'all'
                ? 'bg-[#00236F] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua Residu
          </button>
          <button
            onClick={() => setWasteTypeFilter('sludge_lumpur')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              wasteTypeFilter === 'sludge_lumpur'
                ? 'bg-[#10B981] text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <Droplets className="w-3.5 h-3.5 shrink-0" />
            <span>Sludge Lumpur</span>
          </button>
          <button
            onClick={() => setWasteTypeFilter('afur_kasar')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              wasteTypeFilter === 'afur_kasar'
                ? 'bg-[#F59E0B] text-white shadow-sm'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <Boxes className="w-3.5 h-3.5 shrink-0" />
            <span>Afur Kasar</span>
          </button>
        </div>

        {/* Tombol Rute TSP & Badge Stat */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onToggleMultiStopRoute}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              isMultiStopRouteActive
                ? 'bg-[#00236F] text-white ring-2 ring-blue-300'
                : 'bg-blue-50 text-[#00236F] hover:bg-blue-100 border border-blue-200'
            }`}
          >
            <Route className="w-3.5 h-3.5" />
            <span>{isMultiStopRouteActive ? 'Rute Aktif (3 Stop)' : 'Rencana Rute TSP'}</span>
          </button>

          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-2 rounded-xl font-tabular whitespace-nowrap border border-slate-200">
            {totalFilteredPoints} Titik • {totalFilteredTonnage.toFixed(1)} Ton
          </span>
        </div>
      </div>

      {/* Baris 2: Slider Radius & Checkbox SNI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-xs items-center">
        {/* Slider Radius */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-bold text-slate-700">
            <span className="flex items-center gap-1.5 text-xs text-slate-600">
              <Compass className="w-4 h-4 text-[#00236F]" />
              Radius Logistik dari Campurdarat:
            </span>
            <span className="font-tabular font-black text-[#00236F] text-sm">
              {radiusKm} km
            </span>
          </div>
          <input
            type="range"
            min="2"
            max="20"
            step="1"
            value={radiusKm}
            onChange={(e) => setRadiusKm(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#00236F]"
          />
        </div>

        {/* Filter SNI Checkbox */}
        <div className="flex items-center justify-start md:justify-end">
          <button
            onClick={() => setStrictSniFilter(!strictSniFilter)}
            className="flex items-center gap-2 text-slate-700 hover:text-slate-900 font-bold select-none py-1.5 px-3 rounded-xl hover:bg-slate-50 transition-colors"
          >
            {strictSniFilter ? (
              <CheckSquare className="w-4 h-4 text-[#10B981]" />
            ) : (
              <Square className="w-4 h-4 text-slate-400" />
            )}
            <span className="text-xs">Hanya Mutu SNI 03-0394 (CaCO3 ≥ 95%)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
