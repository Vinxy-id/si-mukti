'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Globe2,
  MapPin,
  Truck,
  Layers,
  Sparkles,
  Maximize2,
  ShieldCheck,
  Camera,
  ArrowRight,
  Droplet,
  Building2,
  Route,
  Compass,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface GisPoint {
  id: string;
  name: string;
  owner: string;
  type: 'sludge' | 'afur' | 'offtaker';
  x: number; // percentage in SVG viewBox 0-100
  y: number;
  tonnage: string;
  village: string;
  subdistrict: string;
  caco3?: string;
  valorisasi: string;
  distanceKm: number;
}

const GIS_DEMO_POINTS: GisPoint[] = [
  {
    id: 'wp-1',
    name: 'Bengkel Marmer Al-Barokah',
    owner: 'Pak Supardi',
    type: 'sludge',
    x: 44,
    y: 50,
    tonnage: '3.5 Ton',
    village: 'Desa Gamping',
    subdistrict: 'Campurdarat',
    caco3: '98.4%',
    valorisasi: 'Rp 525.000',
    distanceKm: 1.4,
  },
  {
    id: 'wp-2',
    name: 'Bengkel Bubut Karst Mulya',
    owner: 'Pak Darsono',
    type: 'sludge',
    x: 36,
    y: 38,
    tonnage: '4.2 Ton',
    village: 'Desa Campurdarat',
    subdistrict: 'Campurdarat',
    caco3: '98.2%',
    valorisasi: 'Rp 630.000',
    distanceKm: 1.8,
  },
  {
    id: 'wp-3',
    name: 'UD Kalsit Mulia Besole',
    owner: 'H. Sudarsono',
    type: 'afur',
    x: 26,
    y: 72,
    tonnage: '4.8 Ton',
    village: 'Kuari Besole',
    subdistrict: 'Besole',
    caco3: '97.8%',
    valorisasi: 'Rp 576.000',
    distanceKm: 4.8,
  },
  {
    id: 'wp-4',
    name: 'Sentra Seni Ukir Pualam',
    owner: 'Mbah Slamet',
    type: 'sludge',
    x: 58,
    y: 44,
    tonnage: '2.8 Ton',
    village: 'Desa Wates',
    subdistrict: 'Campurdarat',
    caco3: '98.1%',
    valorisasi: 'Rp 420.000',
    distanceKm: 2.1,
  },
  {
    id: 'wp-5',
    name: 'Kuari Marmer Selatan',
    owner: 'Pak Sukirno',
    type: 'afur',
    x: 70,
    y: 64,
    tonnage: '8.0 Ton',
    village: 'Desa Besole',
    subdistrict: 'Besole',
    caco3: '95.9%',
    valorisasi: 'Rp 960.000',
    distanceKm: 5.1,
  },
  {
    id: 'off-1',
    name: 'PT Sentosa Teraso & Paving',
    owner: 'H. Bambang Irawan',
    type: 'offtaker',
    x: 52,
    y: 18,
    tonnage: 'Kapasitas 60 T/mgg',
    village: 'Kawasan Industri',
    subdistrict: 'Boyolangu',
    caco3: 'Min. 90%',
    valorisasi: 'Offtaker Utama',
    distanceKm: 5.8,
  },
];

export const HeroGisDemo: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'sludge' | 'afur'>('all');
  const [selectedPoint, setSelectedPoint] = useState<GisPoint>(GIS_DEMO_POINTS[0]);
  const [truckStep, setTruckStep] = useState<number>(0);

  // Koordinat rute perjalanan armada truk logistik TSP (persentase x, y)
  const routeWaypoints = [
    { x: 52, y: 18 }, // PT Sentosa Boyolangu (Start/Pabrik Offtaker)
    { x: 36, y: 38 }, // Karst Mulya Campurdarat
    { x: 44, y: 50 }, // Bengkel Al-Barokah
    { x: 26, y: 72 }, // UD Kalsit Mulia Besole
    { x: 58, y: 44 }, // Seni Ukir Pualam Wates
    { x: 52, y: 18 }, // Kembali ke PT Sentosa (Loop)
  ];

  // Efek animasi pergerakan armada truk secara berkala
  useEffect(() => {
    const interval = setInterval(() => {
      setTruckStep((prev) => (prev + 1) % routeWaypoints.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [routeWaypoints.length]);

  const currentTruckPos = routeWaypoints[truckStep];

  // Filter titik residu berdasarkan jenis
  const visiblePoints = GIS_DEMO_POINTS.filter((p) => {
    if (p.type === 'offtaker') return true;
    if (activeFilter === 'all') return true;
    return p.type === activeFilter;
  });

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* ======================================================================= */}
      {/* FRAME UTAMA MINI WEB-GIS: Sesuai Tema Pusat Komando Web-GIS (/spasial)   */}
      {/* ======================================================================= */}
      <div className="relative bg-white/95 backdrop-blur-2xl rounded-[32px] sm:rounded-[40px] p-3.5 sm:p-5 border-2 border-sky-200/90 shadow-[0_20px_50px_rgba(0,35,111,0.12)] overflow-hidden text-slate-800 group">
        
        {/* Glow Ambient Karst di Balik Peta */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />

        {/* --------------------------------------------------------------------- */}
        {/* TOP BAR MINI-GIS: Telemetri Live & Filter                             */}
        {/* --------------------------------------------------------------------- */}
        <div className="relative z-20 flex items-center justify-between pb-3 mb-2.5 border-b border-sky-100 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00236F] to-[#0284C7] flex items-center justify-center text-white shadow-xs ring-2 ring-sky-100 shrink-0">
              <Sparkles className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-black text-[#00236F] text-xs sm:text-sm tracking-tight">
                  Pusat Komando Spasial
                </span>
                <span className="inline-flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                  </span>
                  <span>PostGIS Live</span>
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">
                Sentra Karst Tulungagung • Radius 10 km
              </p>
            </div>
          </div>

          <Link
            href="/spasial"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#00236F] hover:text-[#0284C7] bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-xl transition-all border border-sky-200 shadow-2xs shrink-0"
            title="Buka Pusat Komando Spasial Penuh"
          >
            <Maximize2 className="w-3.5 h-3.5 text-[#0284C7]" />
            <span className="hidden sm:inline">Peta Penuh</span>
          </Link>
        </div>

        {/* --------------------------------------------------------------------- */}
        {/* FILTER CEPAT LAYER RESIDU (Semua / Sludge / Afur)                     */}
        {/* --------------------------------------------------------------------- */}
        <div className="relative z-20 flex items-center justify-between gap-1.5 mb-3 px-0.5">
          <div className="flex items-center gap-1 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={cn(
                'px-2.5 py-1 rounded-xl transition-all cursor-pointer',
                activeFilter === 'all'
                  ? 'bg-[#00236F] text-white shadow-2xs font-extrabold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              )}
            >
              Semua (6)
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('sludge')}
              className={cn(
                'px-2.5 py-1 rounded-xl transition-all flex items-center gap-1 cursor-pointer',
                activeFilter === 'sludge'
                  ? 'bg-[#10B981] text-white shadow-2xs font-extrabold'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              )}
            >
              <Droplet className="w-3 h-3 fill-current" />
              <span>Sludge (4)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('afur')}
              className={cn(
                'px-2.5 py-1 rounded-xl transition-all flex items-center gap-1 cursor-pointer',
                activeFilter === 'afur'
                  ? 'bg-[#F59E0B] text-white shadow-2xs font-extrabold'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              )}
            >
              <Layers className="w-3 h-3" />
              <span>Afur (2)</span>
            </button>
          </div>

          <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-sky-50 text-[#00236F] border border-sky-200 text-[10px] font-bold">
            <Route className="w-3.5 h-3.5 text-[#0284C7] animate-pulse" />
            <span>TSP Aktif</span>
          </div>
        </div>

        {/* --------------------------------------------------------------------- */}
        {/* VIEWPORT PETA VECTOR TOPOGRAFIS DENGAN KARTOGRAFI TULUNGAGUNG         */}
        {/* --------------------------------------------------------------------- */}
        <div className="relative w-full aspect-[4/3] rounded-2xl bg-[#EBF3FA] overflow-hidden border border-sky-200 shadow-inner">
          
          {/* Layer Grid Topografis Koordinat WGS84 */}
          <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="gis-grid-light" width="28" height="28" patternUnits="userSpaceOnUse">
                <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#93C5FD" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#gis-grid-light)" />
          </svg>

          {/* Kontur Geologis Perbukitan Karst & Aliran Sungai Ngrowo */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Formasi Karst Selatan Kuari Besole */}
            <path
              d="M 5 95 Q 25 65 50 78 T 95 95 L 95 100 L 5 100 Z"
              fill="#D1FAE5"
              opacity="0.55"
            />
            {/* Formasi Perbukitan Karst Campurdarat */}
            <path
              d="M 0 50 Q 22 36 38 46 T 85 45 L 95 65 L 0 65 Z"
              fill="#E2E8F0"
              opacity="0.5"
            />

            {/* Sungai Ngrowo Tulungagung - Casing & Aliran Air */}
            <path
              d="M 12 5 Q 32 28 45 44 T 76 74 T 92 98"
              fill="none"
              stroke="#BAE6FD"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.6"
            />
            <path
              d="M 12 5 Q 32 28 45 44 T 76 74 T 92 98"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="2.8"
              strokeLinecap="round"
              opacity="0.85"
            />

            {/* Jaringan Koridor Jalan Raya Boyolangu - Campurdarat - Besole */}
            <path
              d="M 52 18 Q 50 32 58 44 Q 48 48 44 50 Q 34 62 26 72 Q 48 68 70 64"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d="M 52 18 Q 50 32 58 44 Q 48 48 44 50 Q 34 62 26 72 Q 48 68 70 64"
              fill="none"
              stroke="#94A3B8"
              strokeWidth="1.8"
              strokeLinecap="round"
            />

            {/* Lingkaran Radius 10 km */}
            <circle
              cx="52"
              cy="48"
              r="40"
              fill="none"
              stroke="#0284C7"
              strokeWidth="1.2"
              strokeDasharray="4 3"
              opacity="0.4"
            />

            {/* Garis Polyline Rute Penjemputan Logistik TSP (Animated Dash) */}
            <polyline
              points="52,18 36,38 44,50 26,72 58,44 52,18"
              fill="none"
              stroke="#0284C7"
              strokeWidth="2.4"
              strokeDasharray="4, 3"
              className="animate-pulse"
              opacity="0.9"
            />
          </svg>

          {/* Label Nama Wilayah pada Peta (Kartografis Tulungagung) */}
          <span className="absolute top-2 left-3 text-[9px] font-black uppercase tracking-wider text-slate-500 font-mono bg-white/80 px-1.5 py-0.5 rounded shadow-2xs">
            Kec. Boyolangu
          </span>
          <span className="absolute top-1/2 left-2.5 -translate-y-1/2 text-[9px] font-black uppercase tracking-wider text-slate-500 font-mono bg-white/80 px-1.5 py-0.5 rounded shadow-2xs">
            Kec. Campurdarat
          </span>
          <span className="absolute bottom-2 left-2.5 text-[9px] font-black uppercase tracking-wider text-slate-500 font-mono bg-white/80 px-1.5 py-0.5 rounded shadow-2xs">
            Kuari Besole
          </span>

          {/* Indikator Kompas & Radius Spasial */}
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs border border-sky-200 shadow-2xs text-[9px] font-bold text-slate-600">
            <Compass className="w-3 h-3 text-[#0284C7]" />
            <span>Radius 10 km</span>
          </div>

          {/* Render Titik-Titik Residu di Atas Peta (Sesuai Gaya Pin Leaflet) */}
          {visiblePoints.map((point) => {
            const isSelected = selectedPoint.id === point.id;
            const isOfftaker = point.type === 'offtaker';
            const isSludge = point.type === 'sludge';

            return (
              <button
                key={point.id}
                type="button"
                onClick={() => setSelectedPoint(point)}
                style={{ left: `${point.x}%`, top: `${point.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group/point focus:outline-none transition-transform hover:scale-115 cursor-pointer"
                title={`${point.name} (${point.tonnage})`}
              >
                {/* Efek Ping Berdenyut untuk Titik Terpilih */}
                {isSelected && (
                  <span
                    className={cn(
                      'absolute -inset-1.5 rounded-full animate-ping opacity-75',
                      isOfftaker ? 'bg-purple-400' : isSludge ? 'bg-emerald-400' : 'bg-amber-400'
                    )}
                  />
                )}

                {/* Pin Circle Icon (Identik dengan LeafletMap) */}
                <div
                  className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-md border-2 border-white transition-all',
                    isOfftaker
                      ? 'bg-purple-600 text-white'
                      : isSludge
                      ? 'bg-[#10B981] text-white'
                      : 'bg-[#F59E0B] text-white',
                    isSelected && 'ring-2 ring-[#00236F] scale-110 shadow-lg'
                  )}
                >
                  {isOfftaker ? (
                    <Building2 className="w-3.5 h-3.5 text-white" />
                  ) : isSludge ? (
                    <Droplet className="w-3.5 h-3.5 text-white fill-white" />
                  ) : (
                    <Layers className="w-3.5 h-3.5 text-white" />
                  )}
                </div>

                {/* Sub-label Chip Floating Mengambang (Gaya Leaflet) */}
                <div
                  className={cn(
                    'absolute top-full left-1/2 -translate-x-1/2 mt-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold whitespace-nowrap shadow-xs border transition-all pointer-events-none',
                    isSelected
                      ? 'bg-[#00236F] text-white border-sky-400 opacity-100 ring-1 ring-sky-200'
                      : 'bg-white/95 text-slate-800 border-slate-200 opacity-0 group-hover/point:opacity-100'
                  )}
                >
                  {point.tonnage} • {point.subdistrict}
                </div>
              </button>
            );
          })}

          {/* Marker Armada Truk Real-Time Mengikuti Rute TSP */}
          <div
            style={{
              left: `${currentTruckPos.x}%`,
              top: `${currentTruckPos.y}%`,
              transition: 'all 2.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
          >
            <div className="w-7 h-7 rounded-full bg-[#00236F] border-2 border-amber-300 shadow-xl flex items-center justify-center">
              <Truck className="w-3.5 h-3.5 text-amber-300" />
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-1.5 py-0.5 rounded bg-[#00236F] text-[8px] font-mono font-bold text-amber-300 border border-amber-300/40 whitespace-nowrap shadow-xs">
              Armada AG 8492 UT
            </div>
          </div>
        </div>

        {/* --------------------------------------------------------------------- */}
        {/* KARTU DETAIL TITIK RESIDU YANG DIPILIH: Identik SelectedWasteCard    */}
        {/* --------------------------------------------------------------------- */}
        <div className="mt-3.5 bg-slate-50/90 rounded-2xl p-3 border border-sky-100 shadow-2xs text-left">
          {/* Header Kartu Terpilih */}
          <div className="flex items-start justify-between gap-2 pb-2 border-b border-sky-100">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span
                  className={cn(
                    'text-[10px] font-extrabold px-2 py-0.5 rounded-full inline-flex items-center gap-1 border',
                    selectedPoint.type === 'sludge'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : selectedPoint.type === 'afur'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-purple-50 text-purple-800 border-purple-200'
                  )}
                >
                  {selectedPoint.type === 'sludge' ? (
                    <>
                      <Droplet className="w-2.5 h-2.5 fill-current" />
                      <span>Sludge Kalsium</span>
                    </>
                  ) : selectedPoint.type === 'afur' ? (
                    <>
                      <Layers className="w-2.5 h-2.5" />
                      <span>Afur Kasar</span>
                    </>
                  ) : (
                    <>
                      <Building2 className="w-2.5 h-2.5" />
                      <span>Pabrik Offtaker</span>
                    </>
                  )}
                </span>
                <span className="text-[10px] text-slate-400 font-bold truncate">
                  Jarak: {selectedPoint.distanceKm} km
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-black text-[#00236F] leading-snug truncate">
                {selectedPoint.name}
              </h3>
              <p className="text-[11px] text-slate-500 truncate">
                {selectedPoint.village}, Kec. {selectedPoint.subdistrict} ({selectedPoint.owner})
              </p>
            </div>

            <span className="text-[10px] font-mono font-bold text-sky-700 bg-sky-100/70 px-2 py-0.5 rounded-md border border-sky-200 shrink-0">
              {selectedPoint.subdistrict}
            </span>
          </div>

          {/* Grid 3 Metrik Angka Timbulan (Sesuai SelectedWasteCard di /spasial) */}
          <div className="grid grid-cols-3 gap-2 py-2.5">
            <div className="bg-sky-50/70 p-2 rounded-xl text-center border border-sky-100">
              <span className="text-[10px] text-slate-500 block font-medium">Bobot</span>
              <strong className="text-sm sm:text-base font-black font-tabular text-[#00236F] block">
                {selectedPoint.tonnage}
              </strong>
              <span className="text-[9px] text-slate-400 font-bold block">Tonase</span>
            </div>

            <div className="bg-emerald-50/70 p-2 rounded-xl text-center border border-emerald-100">
              <span className="text-[10px] text-emerald-700 block font-medium truncate">CaCO3</span>
              <strong className="text-sm sm:text-base font-black font-tabular text-emerald-700 block">
                {selectedPoint.caco3 || '98.4%'}
              </strong>
              <span className="text-[9px] text-emerald-600 font-bold block truncate">SNI Mutu</span>
            </div>

            <div className="bg-amber-50/70 p-2 rounded-xl text-center border border-amber-100">
              <span className="text-[10px] text-amber-700 block font-medium truncate">Valorisasi</span>
              <strong className="text-xs sm:text-sm font-black font-tabular text-amber-800 block mt-0.5 truncate">
                {selectedPoint.valorisasi}
              </strong>
              <span className="text-[9px] text-amber-600 font-bold block truncate">MUKTI-Pay</span>
            </div>
          </div>

          {/* Tombol Aksi Cepat ke Pusat Komando Spasial */}
          <Link
            href="/spasial"
            className="w-full py-2.5 px-3 bg-[#00236F] hover:bg-[#1E3A8A] active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <Truck className="w-3.5 h-3.5 text-amber-300" />
            <span>Jadwalkan Armada di Pusat Komando</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </Link>
        </div>

      </div>

      {/* ======================================================================= */}
      {/* SATELLITE FLOATING BADGES (Elevated Cards Sesuai Desain MedCare)         */}
      {/* ======================================================================= */}
      
      {/* Satellite Top Right: Segel SNI Kalsit Laboratorium */}
      <div className="hidden sm:flex absolute -top-3 -right-2 sm:-right-4 bg-white rounded-2xl p-2.5 shadow-[0_10px_25px_rgba(0,35,111,0.12)] border border-sky-100 items-center gap-2 z-30 animate-bounce-slow">
        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#10B981] flex items-center justify-center font-bold shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="text-left pr-1">
          <span className="text-[10px] font-extrabold text-[#00236F] block">Kalsit 98.4%</span>
          <span className="text-[9px] text-[#10B981] font-bold block">SNI 03-0394 Lolos</span>
        </div>
      </div>

      {/* Satellite Bottom Left: Scanner AI LiDAR Telemetri */}
      <div className="hidden sm:flex absolute -bottom-3 -left-2 sm:-left-4 bg-white rounded-2xl p-2.5 shadow-[0_10px_25px_rgba(0,35,111,0.12)] border border-sky-100 items-center gap-2 z-30">
        <div className="w-8 h-8 rounded-xl bg-[#00236F] text-white flex items-center justify-center font-bold shadow-xs shrink-0">
          <Camera className="w-4 h-4 text-emerald-300" />
        </div>
        <div className="text-left pr-1">
          <span className="text-[10px] font-extrabold text-[#00236F] block">AI LiDAR Vision</span>
          <span className="text-[9px] text-[#0284C7] font-bold block">Akurasi &lt;0.5 cm</span>
        </div>
      </div>
    </div>
  );
};
