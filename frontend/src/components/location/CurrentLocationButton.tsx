import React, { useState } from 'react';
import { Navigation, Loader2 } from 'lucide-react';
import type { LocationResult } from '../../types/pharmacy';

interface CurrentLocationButtonProps {
  onLocationFound: (location: LocationResult) => void;
  onError: (errorMessage: string) => void;
}

export const CurrentLocationButton: React.FC<CurrentLocationButtonProps> = ({
  onLocationFound,
  onError
}) => {
  const [loading, setLoading] = useState(false);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      onError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLoading(false);
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        let address = `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)} (Current GPS)`;

        // Reverse Geocode if Google Maps API is loaded
        if (window.google && window.google.maps && window.google.maps.Geocoder) {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
            if (status === 'OK' && results && results[0]) {
              address = results[0].formatted_address;
            }
            onLocationFound({ lat, lng, address });
          });
        } else {
          onLocationFound({ lat, lng, address });
        }
      },
      (error) => {
        setLoading(false);
        let errorMsg = 'Failed to retrieve your current location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = 'Location permission denied. Please allow location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = 'Location information is unavailable on your device.';
            break;
          case error.TIMEOUT:
            errorMsg = 'Location request timed out. Please try again.';
            break;
        }
        onError(errorMsg);
      },
      options
    );
  };

  return (
    <button
      type="button"
      onClick={handleGetCurrentLocation}
      disabled={loading}
      className="px-4 py-3 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200/80 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 shadow-2xs hover:shadow-xs disabled:opacity-60 cursor-pointer"
      title="Fetch your exact live location"
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin text-teal-600" />
      ) : (
        <Navigation size={16} className="text-teal-600 fill-teal-600/20" />
      )}
      <span>Use My Location</span>
    </button>
  );
};
