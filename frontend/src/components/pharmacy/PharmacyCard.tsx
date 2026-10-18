import React from 'react';
import { MapPin, Star, Navigation, ArrowRight, Clock, Phone } from 'lucide-react';
import type { Pharmacy } from '../../types/pharmacy';
import { formatDistanceText } from '../../utils/distance';
import { openDirections } from '../../utils/navigation';

interface PharmacyCardProps {
  pharmacy: Pharmacy;
  isSelected?: boolean;
  onSelect: (pharmacy: Pharmacy) => void;
  onViewDetails: (pharmacy: Pharmacy) => void;
}

export const PharmacyCard: React.FC<PharmacyCardProps> = ({
  pharmacy,
  isSelected = false,
  onSelect,
  onViewDetails
}) => {
  const handleDirections = (e: React.MouseEvent) => {
    e.stopPropagation();
    openDirections(pharmacy.latitude, pharmacy.longitude, pharmacy.name, pharmacy.address);
  };

  const handleViewOnMap = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(pharmacy);
  };

  return (
    <div
      onClick={() => onSelect(pharmacy)}
      className={`p-5 rounded-3xl border transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'bg-teal-50/70 border-teal-500 shadow-md ring-2 ring-teal-500/20'
          : 'bg-white border-slate-200/80 hover:border-teal-300 hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                pharmacy.openNow
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300/60'
                  : 'bg-rose-100 text-rose-800 border border-rose-300/60'
              }`}
            >
              {pharmacy.openNow ? 'Open Now' : 'Closed'}
            </span>

            {pharmacy.rating !== undefined && (
              <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/60">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                {pharmacy.rating} {pharmacy.reviewCount ? `(${pharmacy.reviewCount})` : ''}
              </span>
            )}
          </div>

          <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
            {pharmacy.name}
          </h3>
        </div>

        {pharmacy.distance !== undefined && (
          <span className="shrink-0 px-2.5 py-1 rounded-xl bg-teal-100/60 text-teal-900 text-xs font-extrabold border border-teal-200 flex items-center gap-1">
            <Navigation size={12} className="text-teal-600 fill-teal-600/30" />
            {formatDistanceText(pharmacy.distance)}
          </span>
        )}
      </div>

      <p className="mt-2.5 text-xs text-slate-600 flex items-start gap-1.5 leading-relaxed">
        <MapPin size={15} className="text-slate-400 shrink-0 mt-0.5" />
        <span className="line-clamp-2">{pharmacy.address}</span>
      </p>

      {pharmacy.phoneNumber && (
        <a
          href={`tel:${pharmacy.phoneNumber.replace(/\s+/g, '')}`}
          onClick={(e) => e.stopPropagation()}
          className="mt-1 text-xs text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1.5 hover:underline"
          title="Call Pharmacy"
        >
          <Phone size={13} className="text-teal-600 shrink-0" />
          <span>{pharmacy.phoneNumber}</span>
        </a>
      )}

      {pharmacy.openingHours && pharmacy.openingHours.length > 0 && (
        <p className="mt-1 text-xs text-slate-500 flex items-center gap-1.5">
          <Clock size={13} className="text-slate-400 shrink-0" />
          <span className="truncate">{pharmacy.openingHours[0]}</span>
        </p>
      )}

      {/* Action Buttons */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
        <button
          onClick={handleViewOnMap}
          className="px-2.5 py-1.5 rounded-xl font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1"
          title="Center and zoom on map"
        >
          <MapPin size={13} className="text-teal-600" />
          View on Map
        </button>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleDirections}
            className="px-3 py-1.5 rounded-xl font-extrabold text-teal-900 bg-teal-100 hover:bg-teal-200 border border-teal-200 transition-all flex items-center gap-1"
            title="Open Google Maps Turn-by-Turn Navigation"
          >
            <Navigation size={13} className="text-teal-700 fill-teal-700" />
            Directions
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(pharmacy);
            }}
            className="px-3 py-1.5 rounded-xl font-bold text-white bg-teal-600 hover:bg-teal-700 transition-colors shadow-xs flex items-center gap-1"
          >
            Details
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
