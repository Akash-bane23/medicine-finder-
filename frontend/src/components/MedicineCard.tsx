import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Medicine } from '../types';
import { AvailabilityBadge } from './AvailabilityBadge';
import { FileText, MapPin, Tag, Heart } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
import { favoriteService } from '../services/api';

interface MedicineCardProps {
  medicine: Medicine;
}

export const MedicineCard: React.FC<MedicineCardProps> = ({ medicine }) => {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    favoriteService.isFavorite(medicine.id).then(setIsFav);
  }, [medicine.id]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFav) {
      const ok = await favoriteService.removeFavorite(medicine.id);
      if (ok) setIsFav(false);
    } else {
      const ok = await favoriteService.addFavorite(medicine.id);
      if (ok) setIsFav(true);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-50 text-sky-700 text-xs font-semibold border border-sky-100">
            <Tag size={12} className="text-sky-600" />
            {medicine.category}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFavorite}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                isFav
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-rose-50'
              }`}
              title={isFav ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart size={14} className={isFav ? 'fill-rose-500 text-rose-500' : ''} />
            </button>
            <AvailabilityBadge status={medicine.availabilityStatus || 'AVAILABLE'} size="sm" />
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-1">
          {medicine.name}
        </h3>
        <p className="text-xs font-medium text-slate-500 mt-0.5 mb-3 flex items-center gap-1">
          <span className="font-semibold text-slate-700">Generic:</span> {medicine.genericName}
        </p>

        <div className="grid grid-cols-2 gap-2 my-3 py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Form & Strength</span>
            <span className="font-semibold text-slate-700">{medicine.dosageForm} ({medicine.strength})</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Manufacturer</span>
            <span className="font-semibold text-slate-700 truncate block">{medicine.manufacturer}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs mt-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <FileText size={14} className={medicine.prescriptionRequired ? 'text-amber-500' : 'text-emerald-500'} />
            <span className="text-slate-600 font-medium">
              {medicine.prescriptionRequired ? 'Prescription Required' : 'Over the Counter (OTC)'}
            </span>
          </div>
          {medicine.price && (
            <span className="font-extrabold text-slate-900 text-sm">
              {formatCurrency(medicine.price)}
            </span>
          )}
        </div>
      </div>

      <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
        <Link
          to={`/medicines/${medicine.id}`}
          className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1"
        >
          View Details
        </Link>
        <Link
          to={`/pharmacies?medicine=${encodeURIComponent(medicine.name)}`}
          className="px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 shadow-xs transition-colors flex items-center gap-1.5"
        >
          <MapPin size={13} />
          Find Nearby
        </Link>
      </div>
    </div>
  );
};
