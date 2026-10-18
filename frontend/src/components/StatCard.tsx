import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  color?: 'blue' | 'emerald' | 'amber' | 'rose' | 'purple' | 'indigo';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  change,
  changeType = 'positive',
  color = 'blue'
}) => {
  const colorStyles = {
    blue: {
      bg: 'bg-sky-50 text-sky-600 border-sky-100',
      iconBg: 'bg-sky-600 text-white',
    },
    emerald: {
      bg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      iconBg: 'bg-emerald-600 text-white',
    },
    amber: {
      bg: 'bg-amber-50 text-amber-600 border-amber-100',
      iconBg: 'bg-amber-500 text-white',
    },
    rose: {
      bg: 'bg-rose-50 text-rose-600 border-rose-100',
      iconBg: 'bg-rose-600 text-white',
    },
    purple: {
      bg: 'bg-purple-50 text-purple-600 border-purple-100',
      iconBg: 'bg-purple-600 text-white',
    },
    indigo: {
      bg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      iconBg: 'bg-indigo-600 text-white',
    },
  };

  const style = colorStyles[color];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </h3>
          {change && (
            <p
              className={`text-xs font-semibold mt-1 flex items-center gap-1 ${
                changeType === 'positive'
                  ? 'text-emerald-600'
                  : changeType === 'negative'
                  ? 'text-rose-600'
                  : 'text-slate-500'
              }`}
            >
              {change}
            </p>
          )}
        </div>

        <div className={`w-12 h-12 rounded-2xl ${style.iconBg} flex items-center justify-center shadow-md shadow-slate-200 shrink-0`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};
