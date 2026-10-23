'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BigActionButton } from '@/components/ui/BigActionButton';
import { DEFAULT_PENGRAJIN_PROFILE, formatRupiah } from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';
import { useSystemStore } from '@/lib/system-store';
import {
  Wallet,
  ArrowLeft,
  ArrowUpRight,
  ArrowDownLeft,
  Building2,
  CheckCircle2,
  Clock,
  History,
  X,
  CreditCard,
  AlertCircle,
  TrendingUp,
  Lock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PengrajinWalletPage() {
  const { isLoggedIn, openLoginModal } = useAuth();
  const { walletBalance, walletTransactions, withdrawFunds } = useSystemStore();
  const profile = DEFAULT_PENGRAJIN_PROFILE;

  // State Saldo & Modal
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState<boolean>(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(500000);
  const [bankTarget, setBankTarget] = useState<string>('Bank Jatim');
  const [withdrawSuccess, setWithdrawSuccess] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const quickAmounts = [100000, 250000, 500000, 1000000];

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount > walletBalance) return;

    setIsProcessing(true);
    setTimeout(() => {
      withdrawFunds(withdrawAmount, bankTarget);
      setIsProcessing(false);
      setWithdrawSuccess(true);
    }, 600);
  };

  return (
    <div className="space-y-3.5 sm:space-y-5">
      {/* Header Back Button & Judul */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 gap-2">
        <Link
          href="/pengrajin/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#00236F] transition-colors shrink-0"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>Dasbor <span className="hidden sm:inline">Pengrajin</span></span>
        </Link>
        <span className="text-[11px] sm:text-xs font-bold text-[#00236F] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 shrink-0">
          Dompet Sirkular MUKTI-Pay
        </span>
      </div>

      {/* Grid Responsif (Desktop 2 Kolom, Mobile 1 Kolom) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-6 items-start">
        {/* Kolom Kiri: Kartu Saldo & Informasi Rekening (5 Kolom di Desktop) */}
        <div className="lg:col-span-5 space-y-3 sm:space-y-4">
          {/* Kartu Saldo Utama */}
          <div className="bg-gradient-to-br from-[#00236F] via-[#1E3A8A] to-[#0A192F] rounded-3xl p-4 sm:p-5 text-white shadow-level-2 border border-slate-700/40 relative overflow-hidden space-y-3">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex items-start justify-between">
              <div>
                <p className="text-xs text-[#DCE1FF] font-semibold uppercase tracking-wider">
                  Saldo Valorisasi Aktif
                </p>
                <h2 className="text-2xl sm:text-4xl font-black font-tabular tracking-tight mt-0.5 text-white">
                  {formatRupiah(walletBalance)}
                </h2>
              </div>
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shrink-0">
                <Wallet className="w-5 sm:w-6 h-5 sm:h-6 text-emerald-300" />
              </div>
            </div>

            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-xs flex items-center justify-between text-xs border border-white/10 relative z-10 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Building2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <div className="min-w-0">
                  <p className="font-bold text-white text-xs leading-tight truncate">
                    {profile.wallet.bankName}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-blue-200 font-mono truncate">
                    No. Rek: {profile.wallet.bankAccountNumber} (a.n {profile.wallet.bankAccountHolder})
                  </p>
                </div>
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold bg-[#ECFDF5] text-[#006C49] px-2 py-0.5 rounded-md shrink-0">
                Terverifikasi
              </span>
            </div>

            <div className="pt-1 relative z-10">
              <BigActionButton
                variant="eco"
                className="w-full text-xs font-black shadow-md min-h-[44px]"
                onClick={() => {
                  if (!isLoggedIn) {
                    openLoginModal();
                    return;
                  }
                  setWithdrawSuccess(false);
                  setIsWithdrawModalOpen(true);
                }}
              >
                {isLoggedIn ? (
                  <span>Tarik Saldo ke Rekening Bank Jatim</span>
                ) : (
                  <span className="flex items-center justify-center gap-1.5">
                    <Lock className="w-4 h-4 text-amber-300" />
                    <span>Tarik Saldo (Perlu Login Akun)</span>
                  </span>
                )}
              </BigActionButton>
            </div>
          </div>

          {/* Statistik Finansial Ringkas */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            <div className="bg-white p-3 sm:p-4 rounded-2xl border border-border-chiseled shadow-xs">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">Insentif Masuk</span>
              </div>
              <p className="text-base sm:text-lg font-black font-tabular text-[#00236F] mt-0.5 truncate">
                {formatRupiah(profile.wallet.totalEarned)}
              </p>
              <p className="text-[10px] text-emerald-700 mt-0.5 font-semibold truncate">
                Dari 8.5 Ton residu
              </p>
            </div>

            <div className="bg-white p-3 sm:p-4 rounded-2xl border border-border-chiseled shadow-xs">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <ArrowUpRight className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="truncate">Telah Dicairkan</span>
              </div>
              <p className="text-base sm:text-lg font-black font-tabular text-slate-800 mt-0.5 truncate">
                {formatRupiah(profile.wallet.totalWithdrawn)}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                Ke Bank Jatim
              </p>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Riwayat Mutasi Buku Kas (7 Kolom di Desktop) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-4 sm:p-6 border border-border-chiseled shadow-level-1 space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#00236F]" />
              <h3 className="text-xs sm:text-sm font-black text-[#00236F] uppercase tracking-wider">
                Mutasi Kas Valorisasi
              </h3>
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200 font-tabular">
              {walletTransactions.length} Transaksi
            </span>
          </div>

          <div className="space-y-2.5">
            {walletTransactions.map((tx) => {
              const isCredit = tx.type === 'kredit_valorisasi';

              return (
                <div
                  key={tx.id}
                  className="p-3 sm:p-3.5 rounded-2xl bg-slate-50/70 hover:bg-slate-100/80 transition-all border border-slate-100 space-y-2.5 group"
                >
                  {/* Baris 1: Ikon + Deskripsi Utama + Nominal & Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      <div
                        className={cn(
                          'w-8 sm:w-9 h-8 sm:h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-xs',
                          isCredit
                            ? 'bg-[#ECFDF5] text-[#006C49] border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        )}
                      >
                        {isCredit ? (
                          <ArrowDownLeft className="w-4 h-4" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1 space-y-0.5">
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug">
                          {tx.description}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate">
                          {tx.source}
                        </p>
                      </div>
                    </div>

                    {/* Sisi Kanan: Nominal dan Lencana Status */}
                    <div className="text-right shrink-0">
                      <strong
                        className={cn(
                          'text-xs sm:text-sm font-black font-tabular block leading-tight',
                          isCredit ? 'text-emerald-700' : 'text-slate-900'
                        )}
                      >
                        {isCredit ? '+' : '-'} {formatRupiah(tx.amount)}
                      </strong>
                      <span
                        className={cn(
                          'text-[9px] font-bold px-2 py-0.5 rounded-full inline-block mt-1',
                          isCredit
                            ? 'bg-emerald-100/80 text-emerald-800'
                            : 'bg-blue-100/80 text-blue-900'
                        )}
                      >
                        {isCredit ? 'Kredit Masuk' : 'Pencairan'}
                      </span>
                    </div>
                  </div>

                  {/* Baris 2: Tanggal & Kode Transaksi (Lebar Penuh, Mudah Dilihat Tanpa Terpotong) */}
                  <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-600">{tx.date}</span>
                    </div>
                    <span className="font-mono text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200 text-[10px] font-bold">
                      {tx.code}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal Pencairan Saldo ke Bank Jatim */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 relative animate-scale-up">
            <button
              onClick={() => setIsWithdrawModalOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-full hover:bg-slate-100 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            {withdrawSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Pencairan Berhasil Diajukan
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    Dana sebesar <strong>{formatRupiah(withdrawAmount)}</strong> sedang diproses menuju rekening {bankTarget} ({profile.wallet.bankAccountNumber}).
                  </p>
                </div>
                <button
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="w-full py-3 bg-[#00236F] text-white text-xs font-black rounded-xl"
                >
                  Selesai
                </button>
              </div>
            ) : (
              <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#00236F] flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">
                      Tarik Saldo ke Rekening Bank
                    </h3>
                    <p className="text-[10px] text-slate-500">
                      Pencairan instan tanpa potongan biaya admin
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">
                    Rekening Tujuan:
                  </label>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center justify-between">
                    <div>
                      <strong className="block text-slate-900">
                        {profile.wallet.bankName}
                      </strong>
                      <span className="text-slate-500 font-mono text-[11px]">
                        {profile.wallet.bankAccountNumber} (a.n {profile.wallet.bankAccountHolder})
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Utama
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-bold text-slate-600">Nominal Penarikan:</label>
                    <span className="text-slate-400 text-[10px]">
                      Maksimal: {formatRupiah(walletBalance)}
                    </span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">
                      Rp
                    </span>
                    <input
                      type="number"
                      min="50000"
                      max={walletBalance}
                      step="50000"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold font-tabular text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                    />
                  </div>
                  <div className="flex gap-1.5 pt-1">
                    {quickAmounts.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setWithdrawAmount(amt)}
                        disabled={amt > walletBalance}
                        className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                          withdrawAmount === amt
                            ? 'bg-[#00236F] text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        } ${amt > walletBalance ? 'opacity-40 cursor-not-allowed' : ''}`}
                      >
                        {(amt / 1000).toLocaleString()}rb
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-2.5 bg-blue-50/80 rounded-xl border border-blue-100 flex items-start gap-2 text-[11px] text-[#00236F]">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#0284C7]" />
                  <p>
                    Dana akan ditransfer secara otomatis ke rekening Bank Jatim Anda dalam waktu 1-5 menit.
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsWithdrawModalOpen(false)}
                    className="flex-1 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing || withdrawAmount <= 0 || withdrawAmount > walletBalance}
                    className="flex-1 py-2.5 bg-[#10B981] hover:bg-emerald-600 text-white text-xs font-black rounded-xl shadow-md transition-all disabled:opacity-50"
                  >
                    {isProcessing ? 'Memproses...' : 'Konfirmasi Tarik'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
