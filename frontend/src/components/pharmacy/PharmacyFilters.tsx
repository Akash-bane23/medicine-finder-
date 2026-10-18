import React from 'react';
import type { DistanceRadius, MinimumRating } from '../../types/pharmacy';
import { SlidersHorizontal, MapPin, Star, Clock } from 'lucide-react';

interface PharmacyFiltersProps {
  radius: DistanceRadius;
  onRadiusChange: (radius: DistanceRadius) => void;
  minRating: MinimumRating;
  onMinRatingChange: (rating: MinimumRating) => void;
  openNowOnly: boolean;
  onOpenNowOnlyChange: (openNow: boolean) => void;
  totalResultsCount: number;
}

export const PharmacyFilters: React.FC<PharmacyFiltersProps> = ({
  radius,
  onRadiusChange,
  minRating,
  onMinRatingChange,
  openNowOnly,
  onOpenNowOnlyChange,
  totalResultsCount
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-teal-600" />
          <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight">
            Search Filters
          </h3>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
          {totalResultsCount} Pharmacies Found
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Distance Radius */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <MapPin size={12} className="text-teal-600" /> Radius
          </label>
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-50 rounded-xl border border-slate-200">
            {([1, 2, 5, 10] as DistanceRadius[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => onRadiusChange(r)}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                  radius === r
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {r}km
              </button>
            ))}
          </div>
        </div>

        {/* Rating Filter */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Star size={12} className="text-amber-500 fill-amber-500" /> Min Rating
          </label>
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-50 rounded-xl border border-slate-200">
            {([0, 3, 4, 4.5] as MinimumRating[]).map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => onMinRatingChange(rate)}
                className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                  minRating === rate
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {rate === 0 ? 'Any' : `${rate}+`}
              </button>
            ))}
          </div>
        </div>

        {/* Open Now Toggle */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Clock size={12} className="text-emerald-600" /> Status
          </label>
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-50 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => onOpenNowOnlyChange(false)}
              className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                !openNowOnly
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => onOpenNowOnlyChange(true)}
              className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                openNowOnly
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              Open Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
