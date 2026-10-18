import React from 'react';
import { Link } from 'react-router-dom';
import type { Pharmacy } from '../types';
import { MapPin, Phone, Clock, Navigation, ArrowRight, Star, Pill } from 'lucide-react';
import { openDirections } from '../utils/navigation';

interface PharmacyCardProps {
  pharmacy: Pharmacy;
  onSelectOnMap?: (pharmacy: Pharmacy) => void;
}

export const PharmacyCard: React.FC<PharmacyCardProps> = ({ pharmacy, onSelectOnMap }) => {
  const availableCount = pharmacy.medicines.filter(m => m.status === 'AVAILABLE').length;

  const handleDirections = (e: React.MouseEvent) => {
    e.stopPropagation();
    openDirections(pharmacy.latitude, pharmacy.longitude, pharmacy.name, pharmacy.address);
  };

  return (
    <div
      onClick={() => onSelectOnMap && onSelectOnMap(pharmacy)}
      className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-teal-300 transition-all duration-200 cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase ${
                pharmacy.status === 'Open'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {pharmacy.status}
            </span>
            {pharmacy.rating && (
              <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                {pharmacy.rating}
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
            {pharmacy.name}
          </h3>
        </div>

        {pharmacy.distance && (
          <span className="shrink-0 px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1 border border-slate-200">
            <Navigation size={12} className="text-teal-600" />
            {pharmacy.distance}
          </span>
        )}
      </div>

      <div className="space-y-2 mt-3 text-xs text-slate-600">
        <p className="flex items-start gap-2">
          <MapPin size={15} className="text-slate-400 shrink-0 mt-0.5" />
          <span>{pharmacy.address}</span>
        </p>

        <div className="flex items-center justify-between pt-1">
          <a
            href={`tel:${pharmacy.phone.replace(/\s+/g, '')}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 text-teal-700 hover:text-teal-900 font-semibold hover:underline"
            title="Call Pharmacy"
          >
            <Phone size={14} className="text-teal-600" />
            <span>{pharmacy.phone}</span>
          </a>

          <p className="flex items-center gap-1.5 text-slate-500">
            <Clock size={14} className="text-slate-400" />
            <span>{pharmacy.openingTime} - {pharmacy.closingTime}</span>
          </p>
        </div>
      </div>

      <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-teal-700 font-semibold bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100">
          <Pill size={14} />
          <span>{availableCount} Medicines In Stock</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDirections}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200/80 transition-colors flex items-center gap-1.5"
            title="Fetch GPS & Open Google Maps Directions"
          >
            <Navigation size={13} className="text-teal-600" />
            Directions
          </button>
          
          <Link
            to={`/pharmacies/${pharmacy.id}`}
            onClick={(e) => e.stopPropagation()}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-xs transition-colors flex items-center gap-1"
          >
            Details
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
};
