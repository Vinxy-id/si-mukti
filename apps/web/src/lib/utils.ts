import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Helper untuk menggabungkan class Tailwind secara aman dan menghindari konflik style
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format angka ke format mata uang Rupiah Indonesia (IDR)
 * Menggunakan tabular numbers
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format angka tonase limbah (contoh: 3.50 Ton)
 */
export function formatTon(tonnage: number): string {
  return `${tonnage.toLocaleString('id-ID', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  })} Ton`;
}
