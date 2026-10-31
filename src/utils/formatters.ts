import { Store } from '../types';

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatShortDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    });
  } catch {
    return dateString;
  }
}

export function getStoreName(store: Store): string {
  switch (store) {
    case 'amazon':
      return 'Amazon India';
    case 'flipkart':
      return 'Flipkart';
    case 'myntra':
      return 'Myntra';
  }
}

export function getStoreColor(store: Store): {
  bg: string;
  text: string;
  border: string;
  chartLine: string;
  chartFill: string;
  badgeBg: string;
} {
  switch (store) {
    case 'amazon':
      return {
        bg: 'bg-amber-500/10 hover:bg-amber-500/20',
        text: 'text-amber-400',
        border: 'border-amber-500/30',
        chartLine: '#f59e0b',
        chartFill: 'rgba(245, 158, 11, 0.15)',
        badgeBg: 'bg-amber-500 text-slate-950',
      };
    case 'flipkart':
      return {
        bg: 'bg-blue-500/10 hover:bg-blue-500/20',
        text: 'text-blue-400',
        border: 'border-blue-500/30',
        chartLine: '#3b82f6',
        chartFill: 'rgba(59, 130, 246, 0.15)',
        badgeBg: 'bg-blue-600 text-white',
      };
    case 'myntra':
      return {
        bg: 'bg-rose-500/10 hover:bg-rose-500/20',
        text: 'text-rose-400',
        border: 'border-rose-500/30',
        chartLine: '#f43f5e',
        chartFill: 'rgba(244, 63, 94, 0.15)',
        badgeBg: 'bg-rose-600 text-white',
      };
  }
}

export function calculateDrop(current: number, base: number): number {
  if (!base || base === 0) return 0;
  return Math.round(((base - current) / base) * 100);
}
