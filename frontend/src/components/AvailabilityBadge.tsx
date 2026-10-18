import React from 'react';
import type { AvailabilityStatus } from '../types';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface AvailabilityBadgeProps {
  status: AvailabilityStatus | string;
  size?: 'sm' | 'md' | 'lg';
}

export const AvailabilityBadge: React.FC<AvailabilityBadgeProps> = ({ status, size = 'md' }) => {
  const normStatus = status ? status.toUpperCase() : 'AVAILABLE';

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 font-semibold'
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };

  if (normStatus === 'AVAILABLE' || normStatus === 'IN STOCK') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 ${sizeClasses[size]}`}>
        <CheckCircle2 size={iconSizes[size]} className="text-emerald-600 shrink-0" />
        AVAILABLE
      </span>
    );
  }

  if (normStatus === 'LOW STOCK') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 ${sizeClasses[size]}`}>
        <AlertTriangle size={iconSizes[size]} className="text-amber-600 shrink-0" />
        LOW STOCK
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/80 ${sizeClasses[size]}`}>
      <XCircle size={iconSizes[size]} className="text-rose-600 shrink-0" />
      OUT OF STOCK
    </span>
  );
};
