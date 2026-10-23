'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Globe2,
  Home,
  Wallet,
  ShieldCheck,
} from 'lucide-react';

export interface GlobalModuleNavbarProps {
  className?: string;
  variant?: 'light' | 'dark';
}

/**
 * GlobalModuleNavbar: Bilah Navigasi Modul Terpadu SI-MUKTI
 * Memberikan konsistensi dan kesinambungan navigasi antar pilar sistem:
 * 1. Pusat Komando Spasial (Web-GIS)
 * 2. Portal Pengrajin Marmer (PWA)
 * 3. Dompet Valorisasi (MUKTI-Pay)
 * 4. Paspor Digital Keaslian (MUKTI-Trace)
 */
export const GlobalModuleNavbar: React.FC<GlobalModuleNavbarProps> = ({
  className,
  variant = 'light',
}) => {
  const pathname = usePathname();

  // Evaluasi modul aktif secara presisi
  const isSpasialActive = pathname === '/spasial';
  const isWalletActive = pathname?.startsWith('/pengrajin/wallet');
  const isPengrajinActive =
    (pathname?.startsWith('/pengrajin') && !isWalletActive);
  const isVerifyActive = pathname?.startsWith('/verify');

  const navItems = [
    {
      label: 'Pusat Komando GIS',
      shortLabel: 'Peta Spasial',
      href: '/spasial',
      icon: <Globe2 className="w-3.5 h-3.5 shrink-0" />,
      isActive: isSpasialActive,
    },
    {
      label: 'Portal Pengrajin',
      shortLabel: 'Pengrajin',
      href: '/pengrajin/dashboard',
      icon: <Home className="w-3.5 h-3.5 shrink-0" />,
      isActive: isPengrajinActive,
    },
    {
      label: 'Dompet MUKTI-Pay',
      shortLabel: 'MUKTI-Pay',
      href: '/pengrajin/wallet',
      icon: <Wallet className="w-3.5 h-3.5 shrink-0" />,
      isActive: isWalletActive,
    },
    {
      label: 'Verifikasi Paspor',
      shortLabel: 'Paspor QR',
      href: '/verify/e3b0c44298fc1c149afbf4c8996fb92427ae',
      icon: <ShieldCheck className="w-3.5 h-3.5 shrink-0" />,
      isActive: isVerifyActive,
    },
  ];

  const isLight = variant === 'light';

  return (
    <nav
      aria-label="Navigasi Modul Utama SI-MUKTI"
      className={cn(
        'items-center gap-1 p-1 rounded-2xl text-xs font-bold transition-all shadow-xs shrink-0',
        isLight
          ? 'bg-slate-100/90 border border-slate-200/90 text-slate-700'
          : 'bg-blue-950/80 border border-blue-800 text-blue-200',
        className
      )}
    >
      {navItems.map((item) => {
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'px-3 sm:px-3.5 py-1.5 rounded-xl transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap active:scale-95',
              item.isActive
                ? isLight
                  ? 'bg-white text-[#00236F] font-black shadow-xs border border-slate-200/80 ring-1 ring-black/5'
                  : 'bg-white text-[#00236F] font-black shadow-md'
                : isLight
                ? 'text-slate-600 hover:text-[#00236F] hover:bg-white/70'
                : 'text-blue-200 hover:text-white hover:bg-white/10'
            )}
          >
            <span
              className={cn(
                item.isActive
                  ? isLight
                    ? 'text-[#0284C7]'
                    : 'text-[#00236F]'
                  : isLight
                  ? 'text-slate-500'
                  : 'text-blue-300'
              )}
            >
              {item.icon}
            </span>
            <span className="hidden xl:inline">{item.label}</span>
            <span className="xl:hidden">{item.shortLabel}</span>
          </Link>
        );
      })}
    </nav>
  );
};
