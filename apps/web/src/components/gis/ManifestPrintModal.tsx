'use client';

import React from 'react';
import { X, Printer, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';
import type { GisWasteItem } from '@/lib/gis-data';
import { MOCK_GIS_OFFTAKERS } from '@/lib/gis-data';
import { formatRupiah } from '@/lib/utils';

interface ManifestPrintModalProps {
  waste: GisWasteItem | null;
  onClose: () => void;
}

export default function ManifestPrintModal({
  waste,
  onClose,
}: ManifestPrintModalProps) {
  if (!waste) return null;

  const manifestNumber = `MNF-TA-20261022-0${Math.floor(100 + Math.random() * 900)}`;
  const defaultOfftaker = MOCK_GIS_OFFTAKERS[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl p-6 shadow-2xl relative my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Lembar Dokumen e-Manifest */}
        <div className="border-2 border-slate-900 p-6 rounded-xl font-serif text-slate-900 space-y-4 print:p-0 print:border-none">
          {/* Header Lembaga */}
          <div className="text-center border-b-2 border-slate-900 pb-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-700">
              Pemerintah Kabupaten Tulungagung
            </h2>
            <h1 className="text-sm font-black uppercase tracking-tight text-slate-900">
              Dinas Perindustrian dan Perdagangan & Dinas Lingkungan Hidup
            </h1>
            <p className="text-[10px] text-slate-600 italic mt-0.5">
              Sistem Informasi Manajemen Spasial & Rantai Pasok Marmer (SI-MUKTI)
            </p>
            <div className="inline-block mt-2 bg-slate-900 text-white text-[11px] font-sans font-extrabold px-3 py-0.5 rounded">
              SURAT MANIFEST ELEKTRONIK RESIDU SIRKULAR (e-MANIFEST)
            </div>
            <p className="text-[11px] font-mono font-bold mt-1">
              Nomor: {manifestNumber}
            </p>
          </div>

          {/* Tabel Identitas Pengirim, Pengangkut, dan Penerima */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-sans text-xs">
            {/* Bagian I */}
            <div className="border border-slate-300 p-3 rounded-lg bg-slate-50/50">
              <span className="text-[10px] font-extrabold text-blue-900 uppercase block mb-1">
                BAGIAN I: PENGHASIL RESIDU
              </span>
              <p className="font-extrabold text-slate-900">{waste.workshopName}</p>
              <p className="text-slate-600 text-[11px]">PIC: {waste.ownerName}</p>
              <p className="text-slate-600 text-[11px]">
                {waste.village}, Kec. {waste.subdistrict}
              </p>
              <p className="text-slate-500 text-[10px]">Telp: {waste.contactPhone}</p>
            </div>

            {/* Bagian II */}
            <div className="border border-slate-300 p-3 rounded-lg bg-slate-50/50">
              <span className="text-[10px] font-extrabold text-emerald-900 uppercase block mb-1">
                BAGIAN II: PENGANGKUT / ARMADA
              </span>
              <p className="font-extrabold text-slate-900">Dump Truck Colt Diesel</p>
              <p className="text-slate-600 text-[11px]">Nopol: <strong>AG 8492 UT</strong></p>
              <p className="text-slate-600 text-[11px]">Pengemudi: Budi Santoso</p>
              <p className="text-slate-500 text-[10px]">Tanggal: 22 Oktober 2026</p>
            </div>

            {/* Bagian III */}
            <div className="border border-slate-300 p-3 rounded-lg bg-slate-50/50">
              <span className="text-[10px] font-extrabold text-purple-900 uppercase block mb-1">
                BAGIAN III: PABRIK OFFTAKER
              </span>
              <p className="font-extrabold text-slate-900">{defaultOfftaker.companyName}</p>
              <p className="text-slate-600 text-[11px]">{defaultOfftaker.industryType}</p>
              <p className="text-slate-600 text-[11px]">Kec. {defaultOfftaker.subdistrict}</p>
              <p className="text-slate-500 text-[10px]">Status: Terdaftar Resmi</p>
            </div>
          </div>

          {/* Spesifikasi Residu & Uji Lab SNI */}
          <div className="border border-slate-300 p-3.5 rounded-lg font-sans text-xs space-y-2">
            <span className="text-[11px] font-bold text-slate-800 uppercase block">
              SPESIFIKASI DAN UJI MUTU RESIDU BATUAN
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div>
                <span className="text-slate-500 block">Jenis Residu:</span>
                <strong className="text-slate-900">
                  {waste.wasteType === 'sludge_lumpur'
                    ? 'Sludge Lumpur Kalsium'
                    : 'Afur Kasar Bongkahan'}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block">Bobot Muatan:</span>
                <strong className="text-slate-900 font-tabular">
                  {waste.estimatedTonnage} Ton ({waste.estimatedVolumeM3} m³)
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block">Kadar Kalsit (CaCO3):</span>
                <strong className="text-emerald-700 font-tabular font-bold">
                  {waste.caco3Pct}% (SNI 03-0394)
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block">Valorisasi Rupiah:</span>
                <strong className="text-slate-900 font-tabular">
                  {formatRupiah(waste.estimatedTransactionValueIdr)}
                </strong>
              </div>
            </div>
          </div>

          {/* Kolom Tanda Tangan Digital 3 Pihak */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-300 font-sans text-center text-[10px]">
            <div className="space-y-10">
              <span className="text-slate-500 font-semibold block">Pihak I: Pengrajin Pengirim</span>
              <div>
                <p className="font-extrabold text-slate-900 underline">{waste.ownerName}</p>
                <p className="text-slate-500 font-mono text-[9px]">{waste.workshopName}</p>
              </div>
            </div>

            <div className="space-y-10">
              <span className="text-slate-500 font-semibold block">Pihak II: Pengemudi Truk</span>
              <div>
                <p className="font-extrabold text-slate-900 underline">Budi Santoso</p>
                <p className="text-slate-500 font-mono text-[9px]">SIM BII Umum / AG 8492 UT</p>
              </div>
            </div>

            <div className="space-y-10">
              <span className="text-slate-500 font-semibold block">Pihak III: Pabrik Penerima</span>
              <div>
                <p className="font-extrabold text-slate-900 underline">{defaultOfftaker.picName}</p>
                <p className="text-slate-500 font-mono text-[9px]">{defaultOfftaker.companyName}</p>
              </div>
            </div>
          </div>

          {/* Pernyataan Legalitas & Cap Digital */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-200 font-sans text-[11px] text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#10B981]" />
              <span>
                Dokumen sah bernomor registrasi resmi Disperindag & DLH Tulungagung
              </span>
            </div>
            <div className="text-right">
              <p className="font-mono text-[10px] text-slate-400">
                SHA256: {waste.id.slice(0, 16)}...
              </p>
              <p className="font-black text-emerald-800">STATUS: TERVERIFIKASI SISTEM</p>
            </div>
          </div>
        </div>

        {/* Tombol Cetak Dokumen */}
        <div className="flex items-center justify-end gap-2 mt-4 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-50"
          >
            Tutup
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#00236F] hover:bg-[#1E3A8A] text-white text-xs font-bold shadow-md transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak e-Manifest (PDF)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
