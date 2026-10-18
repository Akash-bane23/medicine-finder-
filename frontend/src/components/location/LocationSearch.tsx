import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import type { LocationResult } from '../../types/pharmacy';

interface LocationSearchProps {
  onLocationSelect: (location: LocationResult) => void;
  currentAddress?: string;
  isMapLoaded?: boolean;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({
  onLocationSelect,
  currentAddress = 'Sinhagad Road, Pune, Maharashtra, India'
}) => {
  const [inputVal, setInputVal] = useState(currentAddress);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setInputVal(currentAddress);
  }, [currentAddress]);

  useEffect(() => {
    if (!inputRef.current || !window.google || !window.google.maps || !window.google.maps.places) {
      return;
    }

    try {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['geocode', 'establishment'],
        componentRestrictions: { country: 'in' } // Restrict to India by default for high precision
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry && place.geometry.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const formattedAddress = place.formatted_address || place.name || inputVal;

          setInputVal(formattedAddress);
          onLocationSelect({
            lat,
            lng,
            address: formattedAddress,
            name: place.name,
            placeId: place.place_id
          });
        }
      });
    } catch (err) {
      console.warn('Google Places Autocomplete initialization warning:', err);
    }
  }, [onLocationSelect]);

  const handleManualSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    if (window.google && window.google.maps && window.google.maps.Geocoder) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: inputVal }, (results: any, status: any) => {
        if (status === 'OK' && results && results[0]) {
          const res = results[0];
          const lat = res.geometry.location.lat();
          const lng = res.geometry.location.lng();
          onLocationSelect({
            lat,
            lng,
            address: res.formatted_address,
            placeId: res.place_id
          });
        }
      });
    }
  };

  const handleClear = () => {
    setInputVal('');
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <form onSubmit={handleManualSearchSubmit} className="relative w-full">
      <div className="relative flex items-center w-full">
        <MapPin size={18} className="absolute left-3.5 text-teal-600 shrink-0 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Search Area, City, Landmark, Address or Pincode..."
          className="w-full pl-10 pr-20 py-3 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500/80 focus:border-teal-500 shadow-sm transition-all"
        />
        
        {inputVal && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-12 text-slate-400 hover:text-slate-600 p-1 rounded-full transition-colors"
          >
            <X size={15} />
          </button>
        )}

        <button
          type="submit"
          className="absolute right-2.5 p-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-xs transition-colors shrink-0"
          title="Search Location"
        >
          <Search size={16} />
        </button>
      </div>
    </form>
  );
};
