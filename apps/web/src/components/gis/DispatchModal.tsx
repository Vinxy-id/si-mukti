'use client';

import React, { useState } from 'react';
import {
  X,
  Truck,
  CheckCircle2,
  Calendar,
  Building2,
  User,
  ShieldCheck,
  FileText,
  AlertCircle,
} from 'lucide-react';
import type { GisWasteItem, GisOfftakerItem } from '@/lib/gis-data';
import { MOCK_GIS_OFFTAKERS } from '@/lib/gis-data';
import { formatRupiah } from '@/lib/utils';
import { BigActionButton } from '@/components/ui/BigActionButton';

interface DispatchModalProps {
  waste: GisWasteItem | null;
  onClose: () => void;
  onSuccess: (orderCode: string) => void;
}

export default function DispatchModal({
  waste,
  onClose,
  onSuccess,
}: DispatchModalProps) {
  const [selectedOfftakerId, setSelectedOfftakerId] = useState(
    MOCK_GIS_OFFTAKERS[0].id
  );
  const [selectedTruck, setSelectedTruck] = useState('truck-1');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!waste) return null;

  const selectedOfftaker =
    MOCK_GIS_OFFTAKERS.find((o) => o.id === selectedOfftakerId) ||
    MOCK_GIS_OFFTAKERS[0];

  const handleConfirmDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const orderCode = `ORD-DISP-20261022-${Math.floor(100 + Math.random() * 900)}`;
      setIsSubmitting(false);
      onSuccess(orderCode);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-[#00236F] rounded-xl">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Jadwalkan Armada Truk
              </h2>
              <p className="text-xs text-slate-500">
                Surat Perintah Muat Logistik Sirkular
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleConfirmDispatch} className="space-y-4 mt-4 text-xs">
          {/* Rincian Muatan */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-600">Lokasi Penjemputan:</span>
              <span className="font-extrabold text-slate-900">
                {waste.workshopName}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-600">Jenis Residu:</span>
              <span className="font-bold text-[#10B981]">
                {waste.wasteType === 'sludge_lumpur'
                  ? 'Sludge Lumpur Kalsium (CaCO3 98.4%)'
                  : 'Afur Kasar Bongkahan'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-600">Bobot Taksiran:</span>
              <strong className="font-tabular text-sm font-black text-[#00236F]">
                {waste.estimatedTonnage} Ton
              </strong>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-slate-200">
              <span className="font-bold text-slate-600">Nilai Transaksi (MUKTI-Pay):</span>
              <strong className="font-tabular font-extrabold text-emerald-700">
                {formatRupiah(waste.estimatedTransactionValueIdr)}
              </strong>
            </div>
          </div>

          {/* Pilih Pabrik Offtaker Penerima */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              Pabrik Offtaker Pemanfaat
            </label>
            <select
              value={selectedOfftakerId}
              onChange={(e) => setSelectedOfftakerId(e.target.value)}
              className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:border-[#00236F] outline-none"
            >
              {MOCK_GIS_OFFTAKERS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.companyName} ({o.industryType} - {o.subdistrict})
                </option>
              ))}
            </select>
          </div>

          {/* Pilih Armada & Sopir */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              Armada Truk & Pengemudi
            </label>
            <div className="space-y-2">
              <label
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedTruck === 'truck-1'
                    ? 'border-[#00236F] bg-blue-50/50 ring-1 ring-[#00236F]'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="truck"
                    value="truck-1"
                    checked={selectedTruck === 'truck-1'}
                    onChange={() => setSelectedTruck('truck-1')}
                    className="accent-[#00236F]"
                  />
                  <div>
                    <p className="font-extrabold text-slate-900">
                      Dump Truck Colt Diesel (6.5 Ton)
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Nopol: <strong>AG 8492 UT</strong> • Sopir: Budi Santoso
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Tersedia
                </span>
              </label>

              <label
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedTruck === 'truck-2'
                    ? 'border-[#00236F] bg-blue-50/50 ring-1 ring-[#00236F]'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="truck"
                    value="truck-2"
                    checked={selectedTruck === 'truck-2'}
                    onChange={() => setSelectedTruck('truck-2')}
                    className="accent-[#00236F]"
                  />
                  <div>
                    <p className="font-extrabold text-slate-900">
                      Truk Engkel Bak Terpal (4.0 Ton)
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Nopol: <strong>AG 9102 UR</strong> • Sopir: Agus Riyadi
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Tersedia
                </span>
              </label>
            </div>
          </div>

          {/* Notifikasi Otomatis */}
          <div className="bg-[#ECFDF5] border border-emerald-200 rounded-xl p-3 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-emerald-900">
              Surat jalan otomatis dan notifikasi penjemputan akan dikirimkan langsung ke aplikasi WhatsApp sopir dan pengrajin ({waste.contactPhone}).
            </p>
          </div>

          <div className="pt-2">
            <BigActionButton
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#00236F] hover:bg-[#1E3A8A] text-white"
            >
              {isSubmitting
                ? 'Mengirim Dispatch...'
                : `Konfirmasi Dispatch (${waste.estimatedTonnage} Ton)`}
            </BigActionButton>
          </div>
        </form>
      </div>
    </div>
  );
}
