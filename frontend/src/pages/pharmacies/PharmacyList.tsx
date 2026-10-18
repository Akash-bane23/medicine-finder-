import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { pharmacyService } from '../../services/api';
import type { Pharmacy } from '../../types';
import { PharmacyCard } from '../../components/PharmacyCard';
import { MapPlaceholder } from '../../components/MapPlaceholder';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { MapPin, Navigation } from 'lucide-react';

export const PharmacyList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const medicineFilter = searchParams.get('medicine') || '';

  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState('Central City, Sector 18');
  const [isLocating, setIsLocating] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);

  useEffect(() => {
    const fetchPharmacies = async () => {
      setLoading(true);
      const data = await pharmacyService.getAll();
      setPharmacies(data);
      if (data.length > 0) setSelectedPharmacy(data[0]);
      setLoading(false);
    };
    fetchPharmacies();
  }, []);

  const handleUseMyLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsLocating(false);
          setUserLocation(`GPS Coords: ${position.coords.latitude.toFixed(3)}, ${position.coords.longitude.toFixed(3)}`);
        },
        () => {
          setIsLocating(false);
          setUserLocation('Sector 18, Central City (Detected)');
        }
      );
    } else {
      setIsLocating(false);
      setUserLocation('Sector 18, Central City (Detected)');
    }
  };

  const filteredPharmacies = pharmacies.filter(pharm => {
    if (medicineFilter.trim()) {
      const medQ = medicineFilter.toLowerCase();
      const hasMed = pharm.medicines.some(m => m.medicineName.toLowerCase().includes(medQ));
      if (!hasMed) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-100 mb-2">
            <MapPin size={14} className="text-teal-600" />
            <span>Nearby Pharmacy Locator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Find Nearby Licensed Pharmacies
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Locate chemists near you, check real-time stock availability, opening hours, and contact details.
          </p>
        </div>

        {medicineFilter && (
          <div className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
            Filtered by medicine: <span className="font-bold">{medicineFilter}</span>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <MapPin size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-teal-600" />
          <input
            type="text"
            value={userLocation}
            onChange={(e) => setUserLocation(e.target.value)}
            placeholder="Enter your location or pin code..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <button
          onClick={handleUseMyLocation}
          disabled={isLocating}
          className="w-full sm:w-auto px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Navigation size={15} />
          {isLocating ? 'Detecting Location...' : 'Use My Location'}
        </button>
      </div>

      {loading ? (
        <LoadingSpinner label="Locating nearby pharmacies..." size="lg" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 space-y-4 max-h-[750px] overflow-y-auto pr-1">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Pharmacies Nearby ({filteredPharmacies.length})
              </h3>
            </div>

            {filteredPharmacies.map((pharmacy) => (
              <PharmacyCard
                key={pharmacy.id}
                pharmacy={pharmacy}
                onSelectOnMap={(p) => setSelectedPharmacy(p)}
              />
            ))}
          </div>

          <div className="lg:col-span-7 sticky top-24 h-[680px]">
            <MapPlaceholder
              pharmacies={filteredPharmacies}
              selectedPharmacy={selectedPharmacy}
              onSelectPharmacy={(p) => setSelectedPharmacy(p)}
              userLocation={userLocation}
            />
          </div>
        </div>
      )}
    </div>
  );
};
