import React from 'react';
import type { Pharmacy, DistanceRadius } from '../../types/pharmacy';
import { PharmacyCard } from './PharmacyCard';
import { SearchX, PlusCircle, Loader2 } from 'lucide-react';

interface PharmacyListProps {
  pharmacies: Pharmacy[];
  selectedPharmacy: Pharmacy | null;
  onSelectPharmacy: (pharmacy: Pharmacy) => void;
  onViewDetails: (pharmacy: Pharmacy) => void;
  loading: boolean;
  searchRadius: DistanceRadius;
  onIncreaseRadius: (newRadius: DistanceRadius) => void;
}

export const PharmacyList: React.FC<PharmacyListProps> = ({
  pharmacies,
  selectedPharmacy,
  onSelectPharmacy,
  onViewDetails,
  loading,
  searchRadius,
  onIncreaseRadius
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center p-6 bg-white rounded-3xl border border-slate-200/80 text-teal-700 text-xs font-bold gap-2">
          <Loader2 size={18} className="animate-spin text-teal-600" />
          <span>Finding nearby pharmacies via Google Places API...</span>
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-5 bg-white rounded-3xl border border-slate-200/80 animate-pulse space-y-3">
            <div className="h-5 bg-slate-200 rounded-md w-3/4" />
            <div className="h-4 bg-slate-100 rounded-md w-1/2" />
            <div className="h-4 bg-slate-100 rounded-md w-full" />
            <div className="h-8 bg-slate-200/60 rounded-xl w-full pt-2" />
          </div>
        ))}
      </div>
    );
  }

  if (pharmacies.length === 0) {
    const nextRadius: DistanceRadius | null =
      searchRadius === 1 ? 2 : searchRadius === 2 ? 5 : searchRadius === 5 ? 10 : null;

    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto border border-teal-100">
          <SearchX size={32} />
        </div>
        <div>
          <h3 className="text-base font-extrabold text-slate-900">No pharmacies found within {searchRadius} km</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Try expanding your search radius or selecting a different location.
          </p>
        </div>

        {nextRadius && (
          <button
            type="button"
            onClick={() => onIncreaseRadius(nextRadius)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all cursor-pointer"
          >
            <PlusCircle size={16} />
            Increase Search Radius to {nextRadius} km
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      {pharmacies.map((pharmacy) => (
        <PharmacyCard
          key={pharmacy.placeId}
          pharmacy={pharmacy}
          isSelected={selectedPharmacy?.placeId === pharmacy.placeId}
          onSelect={onSelectPharmacy}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};
