'use client';

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Smartphone,
  ShieldCheck,
  Building2,
  Landmark,
  ArrowRight,
  CheckCircle2,
  Lock,
  UserCheck,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, loginAs, loginWithPhone } = useAuth();
  const [activeTab, setActiveTab] = useState<'demo' | 'otp'>('demo');
  const [phoneNumber, setPhoneNumber] = useState('081234567801');
  const [otpCode, setOtpCode] = useState('123456');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 8) {
      setErrorMessage('Masukkan nomor telepon valid (contoh: 081234567801)');
      return;
    }
    setErrorMessage('');
    setIsOtpSent(true);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    const res = await loginWithPhone(phoneNumber, otpCode);
    setIsLoading(false);
    if (!res.success) {
      setErrorMessage(res.message || 'Gagal masuk');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header Modal */}
        <div className="relative bg-gradient-to-r from-[#00236F] via-[#1E3A8A] to-[#0A192F] text-white p-6 pb-7">
          <button
            onClick={closeLoginModal}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 flex items-center justify-center text-white/80 hover:text-white transition-all"
            aria-label="Tutup Dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xs font-black tracking-widest uppercase text-amber-300">
              Autentikasi Terpadu SI-MUKTI
            </span>
          </div>

          <h2 id="modal-title" className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Masuk ke Platform SI-MUKTI
          </h2>
          <p className="text-xs text-blue-200 mt-1">
            Kabupaten Tulungagung • Sistem Manajemen Spasial Karst & Rantai Pasok Marmer
          </p>

          {/* Tab Switcher */}
          <div className="flex items-center bg-black/25 p-1 rounded-xl mt-4 text-xs font-bold border border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab('demo')}
              className={cn(
                'flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5',
                activeTab === 'demo'
                  ? 'bg-white text-[#00236F] shadow-sm'
                  : 'text-blue-100 hover:text-white'
              )}
            >
              <UserCheck className="w-4 h-4" />
              <span>Masuk Cepat Demo (1-Klik)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('otp')}
              className={cn(
                'flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5',
                activeTab === 'otp'
                  ? 'bg-white text-[#00236F] shadow-sm'
                  : 'text-blue-100 hover:text-white'
              )}
            >
              <Smartphone className="w-4 h-4" />
              <span>WhatsApp OTP</span>
            </button>
          </div>
        </div>

        {/* Isi Modal */}
        <div className="p-6">
          {activeTab === 'demo' ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 font-semibold mb-1">
                Pilih peran pengguna untuk menguji hak akses & kapabilitas fitur:
              </p>

              {/* Opsi 1: Pengrajin */}
              <button
                type="button"
                onClick={() => loginAs('pengrajin')}
                className="w-full text-left p-4 rounded-2xl border-2 border-slate-200 hover:border-[#10B981] hover:bg-emerald-50/40 active:scale-[0.99] transition-all group relative overflow-hidden"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#006C49] flex items-center justify-center shrink-0 group-hover:bg-[#10B981] group-hover:text-white transition-colors">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-[#00236F]">
                        Pak Supardi (Pengrajin Marmer)
                      </h4>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full border border-emerald-300">
                        Rekomendasi
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Bengkel Bubut Al-Barokah • Sentra Campurdarat (SNI CaCO3 98.4%)
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Akses: Dasbor Pengrajin, Dompet MUKTI-Pay, Lapor Residu, Paspor QR.
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-[#10B981] group-hover:translate-x-1 transition-all shrink-0 mt-3" />
                </div>
              </button>

              {/* Opsi 2: Pabrik Offtaker */}
              <button
                type="button"
                onClick={() => loginAs('offtaker')}
                className="w-full text-left p-4 rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 active:scale-[0.99] transition-all group"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#00236F] flex items-center justify-center shrink-0 group-hover:bg-[#00236F] group-hover:text-white transition-colors">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-[#00236F]">
                      Ir. Hendro Wijaya (Pabrik Offtaker)
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      PT Sentosa Teraso & Paving • Industri Pemanfaat Sirkular
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Akses: Dispatch Armada Truk Multi-Stop, Peta Spasial, Penerimaan Residu.
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all shrink-0 mt-3" />
                </div>
              </button>

              {/* Opsi 3: Regulator Pemkab */}
              <button
                type="button"
                onClick={() => loginAs('regulator_pemkab')}
                className="w-full text-left p-4 rounded-2xl border-2 border-slate-200 hover:border-amber-500 hover:bg-amber-50/40 active:scale-[0.99] transition-all group"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <Landmark className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-[#00236F]">
                      Drs. Tri Wahyudi (Regulator Pemkab)
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Disperindag & Dinas Lingkungan Hidup Kab. Tulungagung
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Akses: Audit Karbon Regional (-38.2%), Pengawasan Zero-Dump, e-Manifest.
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all shrink-0 mt-3" />
                </div>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {!isOtpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Nomor Handphone / WhatsApp
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                        🇮🇩 +62
                      </span>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="81234567801"
                        className="w-full pl-20 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#00236F] focus:bg-white"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                      Gunakan nomor demo: <strong>081234567801</strong> (Pak Supardi)
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-medium">
                      {errorMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#10B981] hover:bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                  >
                    <span>Kirim Kode OTP via WhatsApp</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                    <span>Kode OTP dikirim ke <strong>{phoneNumber}</strong></span>
                    <button
                      type="button"
                      onClick={() => setIsOtpSent(false)}
                      className="text-emerald-700 underline font-bold"
                    >
                      Ubah
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Masukkan 6-Digit Kode OTP
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="123456"
                      className="w-full text-center tracking-widest text-2xl font-black py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00236F] focus:bg-white font-tabular"
                    />
                    <p className="text-[11px] text-slate-500 mt-1 text-center flex items-center justify-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>Kode verifikasi default: <strong>123456</strong></span>
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-medium">
                      {errorMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 bg-[#00236F] hover:bg-[#1E3A8A] text-white rounded-xl font-bold text-sm shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <span>Memverifikasi...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Verifikasi & Masuk Sekarang</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Footer Modal: Lanjut Sebagai Tamu */}
          <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Belum ingin masuk akun sekarang?
            </span>
            <button
              type="button"
              onClick={closeLoginModal}
              className="text-xs font-bold text-[#00236F] hover:underline flex items-center gap-1"
            >
              <span>Lanjut sebagai Tamu (Mode Publik)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
