'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface MetricStatCardProps {
  title: string;
  value: string | number | React.ReactNode;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'eco' | 'blue' | 'gold';
  trend?: {
    label: string;
    positive?: boolean;
  };
  actionButton?: React.ReactNode;
  className?: string;
}

/**
 * MetricStatCard: Komponen kartu statistik numerik berbasis token Tatah Mineral
 * Menggunakan font Inter tabular-nums untuk kejelasan pembacaan angka oleh pengrajin
 * Responsif pada grid 2 kolom mobile tanpa ada ikon yang meluap keluar batas kartu
 */
export const MetricStatCard: React.FC<MetricStatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  variant = 'default',
  trend,
  actionButton,
  className,
}) => {
  const iconContainerStyles = {
    default: 'bg-slate-100 text-text-primary',
    eco: 'bg-[#ECFDF5] text-[#006C49]',
    blue: 'bg-[#DCE1FF] text-[#00236F]',
    gold: 'bg-amber-100 text-[#D97706]',
  };

  const borderAccentStyles = {
    default: 'border-border-chiseled',
    eco: 'border-l-4 border-l-[#10B981] border-border-chiseled',
    blue: 'border-l-4 border-l-[#00236F] border-border-chiseled',
    gold: 'border-l-4 border-l-[#D97706] border-border-chiseled',
  };

  return (
    <div
      className={cn(
        'bg-surface-card rounded-2xl p-3 sm:p-4.5 shadow-level-1 border transition-all duration-200 hover:shadow-level-2 overflow-hidden relative flex flex-col justify-between',
        borderAccentStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between gap-1.5 sm:gap-3">
        <div className="min-w-0 flex-1 space-y-0.5 sm:space-y-1">
          <p className="text-[10px] sm:text-xs font-bold text-text-secondary tracking-wider uppercase truncate">
            {title}
          </p>
          <div className="text-lg sm:text-2xl lg:text-3xl font-extrabold font-tabular tracking-tight text-text-primary truncate">
            {value}
          </div>
        </div>

        {icon && (
          <div
            className={cn(
              'w-8 h-8 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 shadow-xs [&>svg]:w-4 [&>svg]:h-4 sm:[&>svg]:w-5 sm:[&>svg]:h-5',
              iconContainerStyles[variant]
            )}
          >
            {icon}
          </div>
        )}
      </div>

      {(subtitle || trend || actionButton) && (
        <div className="mt-2.5 sm:mt-3 pt-2 border-t border-slate-100/90 flex flex-wrap items-center justify-between gap-1 sm:gap-2">
          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            {trend && (
              <span
                className={cn(
                  'text-[9px] sm:text-xs font-bold px-1.5 py-0.5 rounded-md inline-flex items-center gap-0.5 shrink-0',
                  trend.positive
                    ? 'bg-[#ECFDF5] text-[#006C49]'
                    : 'bg-red-50 text-red-700'
                )}
              >
                {trend.positive ? (
                  <TrendingUp className="w-2.5 h-2.5 shrink-0" />
                ) : (
                  <TrendingDown className="w-2.5 h-2.5 shrink-0" />
                )}
                <span>{trend.label}</span>
              </span>
            )}
            {subtitle && (
              <span className="text-[10px] sm:text-xs font-medium text-text-muted truncate">
                {subtitle}
              </span>
            )}
          </div>

          {actionButton && <div className="shrink-0">{actionButton}</div>}
        </div>
      )}
    </div>
  );
};
