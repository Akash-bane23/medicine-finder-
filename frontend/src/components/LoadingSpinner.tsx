import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = 'Loading...',
  size = 'md'
}) => {
  const iconSizes = {
    sm: 16,
    md: 24,
    lg: 36
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-slate-500">
      <Loader2 size={iconSizes[size]} className="animate-spin text-sky-600 mb-2" />
      {label && <p className="text-xs font-semibold text-slate-600">{label}</p>}
    </div>
  );
};
