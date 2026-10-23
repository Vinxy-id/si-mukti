'use client';

import React from 'react';
import {
  X,
  MapPin,
  Phone,
  Truck,
  FileText,
  ShieldCheck,
  Sparkles,
  Droplets,
  Boxes,
  Scale,
  Award,
  ChevronRight,
} from 'lucide-react';
import type { GisWasteItem } from '@/lib/gis-data';
import { formatRupiah } from '@/lib/utils';
import { BigActionButton } from '@/components/ui/BigActionButton';

interface PinDetailDrawerProps {
  waste: GisWasteItem | null;
  onClose: () => void;
  onDispatch: (waste: GisWasteItem) => void;
  onPrintManifest: (waste: GisWasteItem) => void;
}

export default function PinDetailDrawer({
  waste,
  onClose,
  onDispatch,
  onPrintManifest,
}: PinDetailDrawerProps) {
  if (!waste) return null;

  const isSludge = waste.wasteType === 'sludge_lumpur';

  return (
    <div className="bg-white rounded-3xl border border-border-chiseled p-5 shadow-level-3 space-y-4 animate-fade-in">
      {/* Header Drawer */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                isSludge
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              {isSludge ? (
                <>
                  <Droplets className="w-3 h-3 text-emerald-600" />
                  <span>Residu Sludge Kalsium</span>
                </>
              ) : (
                <>
                  <Boxes className="w-3 h-3 text-amber-700" />
                  <span>Residu Afur Bongkahan</span>
                </>
              )}
            </span>
            <span className="text-[11px] font-semibold text-slate-500">
              Jarak {waste.distanceKm} km
            </span>
          </div>
          <h3 className="text-base font-extrabold text-slate-900 leading-snug">
            {waste.workshopName}
          </h3>
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-[#00236F]" />
            {waste.village}, {waste.subdistrict} ({waste.addressDetail})
          </p>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Grid Ringkasan Tonase & Nilai Rupiah */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Volume & Tonase
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <strong className="text-2xl font-black font-tabular text-[#00236F]">
              {waste.estimatedTonnage}
            </strong>
            <span className="text-xs font-bold text-slate-600">Ton</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            ~{waste.estimatedVolumeM3} m³ (Densitas 1.628)
          </p>
        </div>

        <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
            Nilai Valorisasi
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <strong className="text-lg font-black font-tabular text-emerald-800">
              {formatRupiah(waste.estimatedTransactionValueIdr)}
            </strong>
          </div>
          <p className="text-[11px] text-emerald-700 mt-0.5">
            Tarif: {formatRupiah(waste.ratePerTon)}/Ton
          </p>
        </div>
      </div>

      {/* Metrik Laboratorium SNI 03-0394 */}
      <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#00236F]">
            <Award className="w-4 h-4 text-[#D97706]" />
            <span>Karakteristik Mutu SNI 03-0394</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
            Grade {waste.purityGrade} Ultra Murni
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center pt-1">
          <div className="bg-white p-2 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 block">Kalsit (CaCO3)</span>
            <strong className="text-sm font-extrabold font-tabular text-slate-900">
              {waste.caco3Pct}%
            </strong>
          </div>
          <div className="bg-white p-2 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 block">Kadar Air</span>
            <strong className="text-sm font-extrabold font-tabular text-slate-900">
              {waste.moisturePct}%
            </strong>
          </div>
          <div className="bg-white p-2 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 block">Derajat pH</span>
            <strong className="text-sm font-extrabold font-tabular text-slate-900">
              {waste.phLevel}
            </strong>
          </div>
        </div>

        <p className="text-[10px] text-slate-500 text-center pt-0.5">
          Sertifikat Uji: <span className="font-mono">{waste.labCertNumber}</span>
        </p>
      </div>

      {/* Tombol Aksi Transaksi & Logistik */}
      <div className="space-y-2 pt-1">
        <BigActionButton
          onClick={() => onDispatch(waste)}
          className="w-full bg-[#00236F] hover:bg-[#1E3A8A] text-white flex items-center justify-center gap-2"
        >
          <Truck className="w-4 h-4" />
          <span>Jadwalkan Armada Truk ({waste.estimatedTonnage} Ton)</span>
        </BigActionButton>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onPrintManifest(waste)}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors min-h-[44px]"
          >
            <FileText className="w-4 h-4 text-[#00236F]" />
            <span>Cetak e-Manifest</span>
          </button>

          <a
            href={`https://wa.me/62${waste.contactPhone.replace(/^0/, '')}?text=Halo%20${encodeURIComponent(
              waste.ownerName
            )},%20kami%20ingin%20menjemput%20residu%20marmer%20${waste.estimatedTonnage}%20Ton%20melalui%20SI-MUKTI.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-xs font-bold text-emerald-800 transition-colors min-h-[44px]"
          >
            <Phone className="w-4 h-4" />
            <span>Hubungi Pengrajin</span>
          </a>
        </div>
      </div>
    </div>
  );
}
