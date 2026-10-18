import React, { useState, useEffect } from 'react';
import { useNearbyPharmacies } from '../hooks/useNearbyPharmacies';
import { loadGoogleMaps } from '../services/googleMapsService';
import { LocationSearch } from '../components/location/LocationSearch';
import { CurrentLocationButton } from '../components/location/CurrentLocationButton';
import { MapView } from '../components/map/MapView';
import { PharmacyFilters } from '../components/pharmacy/PharmacyFilters';
import { PharmacyList } from '../components/pharmacy/PharmacyList';
import { PharmacyDetails } from '../components/pharmacy/PharmacyDetails';
import type { Pharmacy } from '../types/pharmacy';
import { Building2, AlertTriangle } from 'lucide-react';

export const NearbyPharmacies: React.FC = () => {
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [isMapScriptLoaded, setIsMapScriptLoaded] = useState(false);
  const [activeDetailsPharmacy, setActiveDetailsPharmacy] = useState<Pharmacy | null>(null);

  const {
    selectedLocation,
    setSelectedLocation,
    userLocation,
    setUserLocation,
    filteredPharmacies,
    selectedPharmacy,
    setSelectedPharmacy,
    searchRadius,
    setSearchRadius,
    minRating,
    setMinRating,
    openNowOnly,
    setOpenNowOnly,
    loading,
    loadingDetails,
    error,
    setError,
    isApiKeyMissing
  } = useNearbyPharmacies(mapInstance);

  useEffect(() => {
    loadGoogleMaps()
      .then(() => setIsMapScriptLoaded(true))
      .catch((err) => {
        console.warn('Google Maps Loader info:', err);
        setIsMapScriptLoaded(false);
      });
  }, []);

  const handleLocationFound = (loc: { lat: number; lng: number; address: string }) => {
    setUserLocation({ lat: loc.lat, lng: loc.lng });
    setSelectedLocation(loc);
    setError(null);
  };

  const handleLocationError = (errMsg: string) => {
    setError(errMsg);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white py-8 border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-teal-400">
                  Live Healthcare GPS Module
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Nearby Pharmacies
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                Locate verified pharmacies near <span className="font-bold text-teal-300">{selectedLocation.address}</span> dynamically powered by Google Places API.
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-2 bg-slate-800/80 px-3.5 py-2 rounded-2xl border border-slate-700/80 text-xs text-slate-300">
              <Building2 size={16} className="text-teal-400" />
              <span>Default Location: <strong>Sinhagad Road, Pune</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Error Alert Message */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-xs font-bold text-rose-700 hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Location Search Bar + Current Location Button */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="flex-1 w-full">
            <LocationSearch
              onLocationSelect={(loc) => {
                setSelectedLocation(loc);
                setError(null);
              }}
              currentAddress={selectedLocation.address}
              isMapLoaded={isMapScriptLoaded}
            />
          </div>

          <CurrentLocationButton
            onLocationFound={handleLocationFound}
            onError={handleLocationError}
          />
        </div>

        {/* Filter Controls Bar */}
        <PharmacyFilters
          radius={searchRadius}
          onRadiusChange={setSearchRadius}
          minRating={minRating}
          onMinRatingChange={setMinRating}
          openNowOnly={openNowOnly}
          onOpenNowOnlyChange={setOpenNowOnly}
          totalResultsCount={filteredPharmacies.length}
        />

        {/* Responsive Dual Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Pharmacy Cards Column */}
          <div className="lg:col-span-6 xl:col-span-5 space-y-4 order-2 lg:order-1">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Nearby Pharmacy Cards</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                  Sorted by Distance
                </span>
              </h2>
            </div>

            <PharmacyList
              pharmacies={filteredPharmacies}
              selectedPharmacy={selectedPharmacy}
              onSelectPharmacy={(p) => setSelectedPharmacy(p)}
              onViewDetails={(p) => setActiveDetailsPharmacy(p)}
              loading={loading}
              searchRadius={searchRadius}
              onIncreaseRadius={setSearchRadius}
            />
          </div>

          {/* Map Column (Sticky on Desktop) */}
          <div className="lg:col-span-6 xl:col-span-7 h-[440px] sm:h-[540px] lg:h-[620px] lg:sticky lg:top-20 order-1 lg:order-2">
            <MapView
              center={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
              pharmacies={filteredPharmacies}
              selectedPharmacy={selectedPharmacy}
              selectedLocation={selectedLocation}
              userLocation={userLocation}
              onPharmacySelect={(p) => setSelectedPharmacy(p)}
              onMapInstanceReady={(map) => setMapInstance(map)}
              isApiKeyMissing={isApiKeyMissing}
            />
          </div>
        </div>
      </div>

      {/* Pharmacy Details Modal / Side Panel */}
      <PharmacyDetails
        pharmacy={activeDetailsPharmacy}
        onClose={() => setActiveDetailsPharmacy(null)}
        loadingDetails={loadingDetails}
      />
    </div>
  );
};

export default NearbyPharmacies;
