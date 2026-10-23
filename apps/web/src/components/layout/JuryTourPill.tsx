'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  MapPin,
  Truck,
  Wallet,
  ShieldCheck,
  X,
  Play,
} from 'lucide-react';
import { useSystemStore } from '@/lib/system-store';
import { cn } from '@/lib/utils';

export const JuryTourPill: React.FC = () => {
  const pathname = usePathname();
  const { isTourOpen, toggleTour, tourStep, setTourStep, resetAllData } = useSystemStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const steps = [
    {
      step: 1,
      title: 'Lapor Residu Limbah',
      desc: 'Pengrajin input foto bak lumpur via Kamera AI & GPS auto-capture',
      href: '/pengrajin/waste/new',
      icon: <MapPin className="w-4 h-4 text-emerald-400" />,
    },
    {
      step: 2,
      title: 'Pusat Komando Web-GIS',
      desc: 'Offtaker memantau timbulan kalsit, filter radius, & kirim armada TSP',
      href: '/spasial',
      icon: <Truck className="w-4 h-4 text-cyan-400" />,
    },
    {
      step: 3,
      title: 'Dompet MUKTI-Pay',
      desc: 'Insentif rupiah masuk otomatis & ditarik instan ke Bank Jatim',
      href: '/pengrajin/wallet',
      icon: <Wallet className="w-4 h-4 text-amber-400" />,
    },
    {
      step: 4,
      title: 'Paspor Digital & Lab SNI',
      desc: 'Konsumen scan QR paspor keaslian kalsit 98.4% vs marmer sintetis',
      href: '/verify/e3b0c44298fc1c149afbf4c8996fb92427ae',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-300" />,
    },
  ];

  const isInsidePengrajin = pathname?.startsWith('/pengrajin');

  return (
    <>
      {/* 1. Tombol Trigger Desktop (Kanan Bawah Layar) */}
      {!isTourOpen && (
        <div className="hidden md:flex fixed bottom-6 right-6 z-50 pointer-events-auto">
          <button
            type="button"
            onClick={toggleTour}
            className="flex items-center gap-2.5 bg-gradient-to-r from-[#00236F] via-[#1E3A8A] to-[#0A192F] text-white px-4 py-2.5 rounded-2xl shadow-2xl border-2 border-amber-400/80 hover:scale-105 active:scale-95 transition-all group"
            title="Buka Alur Panduan Demonstrasi Juri LKTIN"
          >
            <div className="w-6 h-6 rounded-lg bg-amber-400 text-[#00236F] flex items-center justify-center font-black text-xs shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-300 leading-tight">
                Skenario Presentasi
              </p>
              <p className="text-xs font-bold text-white leading-none">
                Jalur Demo Juri LKTIN
              </p>
            </div>
            <ChevronUp className="w-4 h-4 text-amber-300 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      )}

      {/* 2. Tombol Trigger Mobile (Hanya muncul jika di luar modul pengrajin, karena di dalam pengrajin sudah ada di Header) */}
      {!isTourOpen && !isInsidePengrajin && (
        <div className="md:hidden fixed bottom-4 right-3 z-40 pointer-events-auto">
          <button
            type="button"
            onClick={toggleTour}
            className="flex items-center gap-1.5 bg-gradient-to-r from-[#00236F] to-[#1E3A8A] text-white px-2.5 py-1.5 rounded-full shadow-lg border border-amber-400/90 active:scale-95 transition-all"
            title="Buka Panduan Demo Juri"
          >
            <div className="w-5 h-5 rounded-full bg-amber-400 text-[#00236F] flex items-center justify-center font-black text-[10px] shrink-0">
              <Sparkles className="w-3 h-3" />
            </div>
            <span className="text-[10px] font-extrabold text-amber-300 pr-0.5">
              Juri Demo
            </span>
          </button>
        </div>
      )}

      {/* 3. Panel Modal Alur 4-Langkah (Tampil saat Dibuka) */}
      {isTourOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200 pointer-events-auto">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,35,111,0.25)] border-2 border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header Panel */}
            <div className="bg-gradient-to-r from-[#00236F] to-[#1E3A8A] text-white p-3.5 sm:p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-400 text-[#00236F] flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black tracking-wide text-white">
                    Panduan Alur Demonstrasi Juri
                  </h4>
                  <p className="text-[10px] text-blue-200">
                    Simulasi End-to-End Siklus Ekonomi Sirkular Karst
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={toggleTour}
                className="p-1 rounded-full hover:bg-white/10 text-white/80 transition-colors"
                title="Tutup Panduan"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Daftar Langkah */}
            <div className="p-3 space-y-2 max-h-[340px] overflow-y-auto">
              {steps.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.step}
                    href={item.href}
                    onClick={() => {
                      setTourStep(item.step);
                      toggleTour();
                    }}
                    className={cn(
                      'block p-3 rounded-2xl border transition-all text-left relative group',
                      isActive
                        ? 'bg-blue-50/80 border-[#00236F] shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300'
                    )}
                  >
                    <div className="flex items-start gap-2.5">
                      <div
                        className={cn(
                          'w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0',
                          isActive
                            ? 'bg-[#00236F] text-amber-300'
                            : 'bg-white text-slate-700 border border-slate-200'
                        )}
                      >
                        {item.step}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h5 className="text-xs font-black text-slate-900 group-hover:text-[#00236F] transition-colors truncate">
                            {item.title}
                          </h5>
                          {isActive && (
                            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                              Aktif
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                          {item.desc}
                        </p>
                      </div>

                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#00236F] group-hover:translate-x-0.5 transition-all shrink-0 mt-2" />
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Footer Panel: Reset Demo Data */}
            <div className="p-3 bg-slate-100/80 border-t border-slate-200 flex items-center justify-between text-xs">
              {showResetConfirm ? (
                <div className="flex items-center justify-between w-full">
                  <span className="text-[11px] text-slate-600 font-semibold">Yakin reset ke data awal?</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        resetAllData();
                        setShowResetConfirm(false);
                      }}
                      className="px-2.5 py-1 bg-rose-600 text-white rounded-lg text-[10px] font-bold"
                    >
                      Ya, Reset
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowResetConfirm(false)}
                      className="px-2 py-1 bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <span className="text-[10px] text-slate-500 font-medium">
                    Langkah {tourStep} dari 4 Skenario
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(true)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-rose-600 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Demo Data</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
