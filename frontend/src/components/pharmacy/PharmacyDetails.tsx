import React from 'react';
import type { Pharmacy } from '../../types/pharmacy';
import {
  X,
  MapPin,
  Star,
  Phone,
  Globe,
  Clock,
  Navigation,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { formatDistanceText } from '../../utils/distance';
import { openDirections } from '../../utils/navigation';

interface PharmacyDetailsProps {
  pharmacy: Pharmacy | null;
  onClose: () => void;
  loadingDetails?: boolean;
}

export const PharmacyDetails: React.FC<PharmacyDetailsProps> = ({
  pharmacy,
  onClose,
  loadingDetails = false
}) => {
  if (!pharmacy) return null;

  const handleDirectionsClick = () => {
    openDirections(pharmacy.latitude, pharmacy.longitude, pharmacy.name, pharmacy.address);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                pharmacy.openNow
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-400/40'
              }`}
            >
              {pharmacy.openNow ? 'Open Now' : 'Closed'}
            </span>

            {pharmacy.distance !== undefined && (
              <span className="text-xs font-bold text-teal-300 bg-teal-950/60 px-2.5 py-0.5 rounded-full border border-teal-800">
                {formatDistanceText(pharmacy.distance)}
              </span>
            )}
          </div>

          <h2 className="text-xl font-extrabold text-white tracking-tight">{pharmacy.name}</h2>
          <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
            <MapPin size={14} className="text-teal-400 shrink-0" />
            <span className="line-clamp-2">{pharmacy.address}</span>
          </p>
        </div>

        {/* Details Content Body */}
        <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">
          {loadingDetails && (
            <div className="p-3 bg-teal-50 rounded-2xl text-teal-800 text-xs font-bold flex items-center gap-2 border border-teal-200">
              <Loader2 size={16} className="animate-spin text-teal-600" />
              <span>Fetching extended Google Places details (hours, phone, website)...</span>
            </div>
          )}

          {/* Rating */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
            <span className="text-xs font-bold text-slate-600">Google Customer Rating</span>
            <div className="flex items-center gap-1.5 font-extrabold text-sm text-slate-900">
              <Star size={16} className="fill-amber-400 text-amber-400" />
              <span>{pharmacy.rating || '4.5'}</span>
              <span className="text-xs text-slate-500 font-medium">({pharmacy.reviewCount || 120} reviews)</span>
            </div>
          </div>

          {/* Opening Hours */}
          {pharmacy.openingHours && pharmacy.openingHours.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Clock size={15} className="text-teal-600" /> Opening Schedule
              </h4>
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 space-y-1 text-xs text-slate-700 font-medium">
                {pharmacy.openingHours.map((schedule, idx) => (
                  <div key={idx} className="flex justify-between py-0.5 border-b border-slate-100 last:border-0">
                    <span>{schedule}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Phone Number */}
          {pharmacy.phoneNumber && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Phone size={15} className="text-teal-600" /> Contact Number
              </h4>
              <p className="text-xs font-bold text-slate-800 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                {pharmacy.phoneNumber}
              </p>
            </div>
          )}

          {/* Website */}
          {pharmacy.website && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Globe size={15} className="text-teal-600" /> Official Website
              </h4>
              <a
                href={pharmacy.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-teal-700 hover:underline bg-slate-50 p-3 rounded-2xl border border-slate-200/80 flex items-center justify-between"
              >
                <span className="truncate">{pharmacy.website}</span>
                <ExternalLink size={14} className="shrink-0" />
              </a>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-end gap-2.5">
          {pharmacy.phoneNumber && (
            <a
              href={`tel:${pharmacy.phoneNumber}`}
              className="px-4 py-2.5 rounded-2xl bg-white border border-slate-300 text-slate-800 text-xs font-bold hover:bg-slate-100 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Phone size={14} className="text-teal-600" /> Call Pharmacy
            </a>
          )}

          {pharmacy.website && (
            <a
              href={pharmacy.website}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-2xl bg-white border border-slate-300 text-slate-800 text-xs font-bold hover:bg-slate-100 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Globe size={14} className="text-teal-600" /> Visit Website
            </a>
          )}

          <button
            onClick={handleDirectionsClick}
            className="px-5 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold shadow-md transition-colors flex items-center gap-1.5"
          >
            <Navigation size={14} className="fill-white" /> Get Directions
          </button>
        </div>
      </div>
    </div>
  );
};
