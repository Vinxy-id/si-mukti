'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Home,
  Wallet,
  PlusCircle,
  Truck,
  ShieldCheck,
} from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string | number;
  highlight?: boolean;
  index: number;
}

/**
 * AppBottomNav: Navigasi bawah khusus Mobile PWA Pengrajin Marmer
 * Tinggi konsisten 64px, ikon terpusat sempurna, dengan animasi sliding indicator fluida
 */
export const AppBottomNav: React.FC = () => {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      label: 'Beranda',
      href: '/pengrajin/dashboard',
      icon: <Home className="w-5 h-5 transition-transform duration-300" />,
      index: 0,
    },
    {
      label: 'Dompet',
      href: '/pengrajin/wallet',
      icon: <Wallet className="w-5 h-5 transition-transform duration-300" />,
      index: 1,
    },
    {
      label: 'Lapor Residu',
      href: '/pengrajin/waste/new',
      icon: <PlusCircle className="w-6 h-6 transition-transform duration-300" />,
      highlight: true,
      index: 2,
    },
    {
      label: 'Lacak Truk',
      href: '/spasial',
      icon: <Truck className="w-5 h-5 transition-transform duration-300" />,
      index: 3,
    },
    {
      label: 'Paspor',
      href: '/pengrajin/passports',
      icon: <ShieldCheck className="w-5 h-5 transition-transform duration-300" />,
      index: 4,
    },
  ];

  // Hitung indeks aktif untuk animasi sliding indicator
  const getActiveIndex = () => {
    if (pathname === '/pengrajin/dashboard') return 0;
    if (pathname?.startsWith('/pengrajin/wallet')) return 1;
    if (pathname?.startsWith('/pengrajin/waste/new')) return 2;
    if (pathname === '/spasial') return 3;
    if (pathname?.startsWith('/pengrajin/passports') || pathname?.startsWith('/verify')) return 4;
    return -1;
  };

  const activeIndex = getActiveIndex();

  return (
    <nav
      aria-label="Navigasi Bawah Aplikasi PWA"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-lg border-t border-slate-200/90 shadow-[0_-4px_25px_rgba(0,35,111,0.08)] md:hidden select-none h-16"
    >
      <div className="max-w-md mx-auto px-2 relative flex items-center justify-between h-full">
        {/* Animated Top Sliding Active Indicator Line */}
        <div
          className="absolute top-0 h-1 bg-gradient-to-r from-[#0284C7] to-[#00236F] rounded-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] pointer-events-none"
          style={{
            width: '12%',
            left: activeIndex >= 0 ? `calc(${activeIndex * 20}% + 4%)` : '-20%',
            opacity: activeIndex >= 0 ? 1 : 0,
          }}
        />

        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/pengrajin/dashboard' &&
              pathname?.startsWith(item.href)) ||
            (item.href === '/pengrajin/passports' && pathname?.startsWith('/verify'));

          if (item.highlight) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center justify-center -mt-5 flex-1 group z-10"
              >
                <div
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-90',
                    isActive
                      ? 'bg-[#10B981] text-white ring-4 ring-[#ECFDF5] scale-105 shadow-emerald-500/30'
                      : 'bg-[#00236F] text-white hover:bg-[#1E3A8A] hover:scale-105 ring-4 ring-white shadow-blue-900/25'
                  )}
                >
                  <div className={cn('transition-transform duration-300', isActive ? 'scale-110' : 'group-hover:rotate-90')}>
                    {item.icon}
                  </div>
                </div>
                <span
                  className={cn(
                    'text-[10px] tracking-tight mt-0.5 transition-all duration-300',
                    isActive
                      ? 'font-black text-[#006C49]'
                      : 'font-bold text-slate-700'
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center flex-1 h-full py-1 rounded-xl transition-all duration-200 group active:scale-95"
            >
              <div
                className={cn(
                  'p-1.5 rounded-xl transition-all duration-300 ease-out flex items-center justify-center',
                  isActive
                    ? 'bg-[#00236F]/10 text-[#00236F] scale-105 shadow-xs ring-1 ring-[#00236F]/15'
                    : 'text-slate-600 group-hover:text-slate-900 scale-100'
                )}
              >
                {item.icon}
              </div>
              <span
                className={cn(
                  'text-[10px] tracking-tight leading-none mt-0.5 transition-all duration-300',
                  isActive
                    ? 'font-black text-[#00236F]'
                    : 'font-bold text-slate-600'
                )}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#00236F] mt-0.5 animate-pulse" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
