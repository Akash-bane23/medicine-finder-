import type { AvailabilityStatus } from '../types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
};

export const getStatusBadgeColor = (status: AvailabilityStatus | string): string => {
  switch (status.toUpperCase()) {
    case 'AVAILABLE':
    case 'OPEN':
    case 'ACTIVE':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'LOW STOCK':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'OUT OF STOCK':
    case 'CLOSED':
    case 'BLOCKED':
      return 'bg-rose-100 text-rose-800 border-rose-300';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-300';
  }
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
