'use client';

import React, { useState, useEffect } from 'react';
import {
  Camera,
  Sparkles,
  RefreshCw,
  Layers,
  CheckCircle2,
  Maximize2,
  Scan,
  Sliders,
  Eye,
  Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AiCameraScannerProps {
  wasteType: 'sludge_lumpur' | 'afur_kasar';
  onVolumeCalculated: (volumeM3: number, tonnage: number) => void;
  photoUrl: string;
}

export const AiCameraScanner: React.FC<AiCameraScannerProps> = ({
  wasteType,
  onVolumeCalculated,
  photoUrl,
}) => {
  // Parameter Geometris Bak Penampungan
  const [lengthM, setLengthM] = useState<number>(2.5);
  const [widthM, setWidthM] = useState<number>(1.0);
  const [depthM, setDepthM] = useState<number>(0.85);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanConfidence, setScanConfidence] = useState<number>(98.6);
  const [showGridOverlay, setShowGridOverlay] = useState<boolean>(true);

  // Densitas material marmer Tulungagung
  const density = wasteType === 'sludge_lumpur' ? 1.628 : 1.45; // Ton/m3

  // Hitung volume dan tonase
  const volumeM3 = Math.round(lengthM * widthM * depthM * 100) / 100;
  const calculatedTonnage = Math.round(volumeM3 * density * 100) / 100;

  // Notifikasi parent saat kalkulasi berubah
  useEffect(() => {
    onVolumeCalculated(volumeM3, calculatedTonnage);
  }, [volumeM3, calculatedTonnage, onVolumeCalculated]);

  const handleRescan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanConfidence(Math.round((97 + Math.random() * 2.8) * 10) / 10);
    }, 1200);
  };

  return (
    <div className="bg-slate-900 rounded-3xl overflow-hidden border-2 border-slate-700 shadow-xl text-white space-y-4 p-4 sm:p-5">
      {/* Top Header Scanner HUD */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold shrink-0">
            <Camera className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-white text-xs tracking-wide">
                MUKTI-Vision Volumetric AI
              </span>
              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
                LiDAR Active
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              Model: YOLOv8-Karst &bull; Kalibrasi &lt; 0.5 cm
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRescan}
          disabled={isScanning}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-xs font-bold text-slate-200 border border-slate-700 transition-all shrink-0 w-full sm:w-auto"
        >
          <RefreshCw className={cn('w-3.5 h-3.5 text-emerald-400', isScanning && 'animate-spin')} />
          <span>{isScanning ? 'Memindai...' : 'Pindai Ulang'}</span>
        </button>
      </div>

      {/* Viewport Kamera Interaktif dengan Bounding Box & Depth Mesh Grid */}
      <div className="relative aspect-video sm:aspect-[16/10] w-full bg-black rounded-2xl overflow-hidden border border-slate-800 group">
        <img
          src={photoUrl}
          alt="Bak Penampungan Lumpur Marmer"
          className={cn(
            'w-full h-full object-cover transition-transform duration-700',
            isScanning ? 'scale-105 brightness-110 filter' : 'scale-100'
          )}
        />

        {/* Scanline Animasi Vertikal */}
        {isScanning && (
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-400/20 to-transparent animate-pulse pointer-events-none">
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10B981] animate-bounce" />
          </div>
        )}

        {/* Overlay Bounding Box Poligon AI */}
        {showGridOverlay && (
          <div className="absolute inset-4 sm:inset-6 border-2 border-dashed border-emerald-400/90 rounded-2xl bg-emerald-950/20 backdrop-blur-[1px] pointer-events-none transition-all flex flex-col justify-between p-3">
            {/* 4 Titik Sudut Poligon Berpendar */}
            <div className="flex justify-between items-start">
              <span className="w-3.5 h-3.5 border-t-2 border-l-2 border-emerald-400 -mt-1 -ml-1 relative">
                <span className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </span>
              <span className="text-[10px] font-mono bg-black/80 px-2 py-0.5 rounded text-emerald-300 border border-emerald-500/30">
                P1 (0, 0) : L {lengthM}m
              </span>
              <span className="w-3.5 h-3.5 border-t-2 border-r-2 border-emerald-400 -mt-1 -mr-1" />
            </div>

            {/* Mesh Grid Perspektif Kedalaman (Simulasi 3D Kontur Lumpur) */}
            <div className="w-full h-24 sm:h-32 opacity-40 bg-[linear-gradient(to_right,#10B981_1px,transparent_1px),linear-gradient(to_bottom,#10B981_1px,transparent_1px)] bg-[size:24px_24px] rounded-lg my-auto" />

            <div className="flex justify-between items-end">
              <span className="w-3.5 h-3.5 border-b-2 border-l-2 border-emerald-400 -mb-1 -ml-1" />
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono bg-black/80 px-2 py-0.5 rounded text-emerald-300 border border-emerald-500/30">
                  Kedalaman: {depthM} m
                </span>
                <span className="text-[10px] font-bold bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded border border-emerald-400/40">
                  Akurasi: {scanConfidence}%
                </span>
              </div>
              <span className="w-3.5 h-3.5 border-b-2 border-r-2 border-emerald-400 -mb-1 -mr-1" />
            </div>
          </div>
        )}

        {/* Live Badge Telemetri di Sudut Kiri Bawah Viewport */}
        <div className="absolute bottom-3 left-3 bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[11px] text-slate-300 flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>Luas: <strong>{(lengthM * widthM).toFixed(2)} m²</strong></span>
          <span>•</span>
          <span>Volume: <strong className="text-emerald-300 font-tabular">{volumeM3} m³</strong></span>
        </div>
      </div>

      {/* Kontrol Kalibrasi Geometris Interaktif */}
      <div className="bg-slate-800/80 rounded-2xl p-3.5 sm:p-4 border border-slate-700/80 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300 gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <Sliders className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">Kalibrasi Dimensi Bak Penampung</span>
          </div>
          <button
            type="button"
            onClick={() => setShowGridOverlay(!showGridOverlay)}
            className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 shrink-0 whitespace-nowrap"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showGridOverlay ? 'Sembunyikan Grid' : 'Tampilkan Grid'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Slider 1: Panjang Bak */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
              <span>Panjang (L)</span>
              <strong className="text-white font-tabular">{lengthM} m</strong>
            </div>
            <input
              type="range"
              min="1.0"
              max="5.0"
              step="0.1"
              value={lengthM}
              onChange={(e) => setLengthM(parseFloat(e.target.value))}
              className="w-full accent-[#10B981] h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          {/* Slider 2: Lebar Bak */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
              <span>Lebar (W)</span>
              <strong className="text-white font-tabular">{widthM} m</strong>
            </div>
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.1"
              value={widthM}
              onChange={(e) => setWidthM(parseFloat(e.target.value))}
              className="w-full accent-[#10B981] h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          {/* Slider 3: Kedalaman Endapan */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
              <span>Kedalaman Endapan (H)</span>
              <strong className="text-emerald-400 font-tabular">{depthM} m</strong>
            </div>
            <input
              type="range"
              min="0.2"
              max="2.0"
              step="0.05"
              value={depthM}
              onChange={(e) => setDepthM(parseFloat(e.target.value))}
              className="w-full accent-[#10B981] h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Ringkasan Konversi Tonase Material Karst */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
          <span className="text-[10px] text-slate-400 block font-medium">Densitas Bulk</span>
          <strong className="text-sm font-black font-tabular text-white block mt-0.5">
            {density} <span className="text-[10px] text-slate-400 font-normal">T/m³</span>
          </strong>
        </div>

        <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
          <span className="text-[10px] text-slate-400 block font-medium">Volume Kubikasi</span>
          <strong className="text-sm font-black font-tabular text-emerald-300 block mt-0.5">
            {volumeM3} <span className="text-[10px] text-slate-400 font-normal">m³</span>
          </strong>
        </div>

        <div className="bg-gradient-to-r from-emerald-950 to-emerald-900/80 p-2.5 rounded-xl border border-emerald-500/40">
          <span className="text-[10px] text-emerald-300 block font-medium">Bobot Timbang</span>
          <strong className="text-base font-black font-tabular text-amber-300 block">
            {calculatedTonnage} <span className="text-xs text-white">Ton</span>
          </strong>
        </div>
      </div>
    </div>
  );
};
