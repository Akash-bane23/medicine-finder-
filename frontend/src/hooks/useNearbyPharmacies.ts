import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Pharmacy, LocationResult, DistanceRadius, MinimumRating } from '../types/pharmacy';
import {
  SINHAGAD_ROAD_PUNE_DEFAULT,
  fetchNearbyPharmaciesFromPlaces,
  fetchPlaceDetailsFromPlaces
} from '../services/googleMapsService';
import { calculateHaversineDistance } from '../utils/distance';

export const useNearbyPharmacies = (mapInstance: any) => {
  const [selectedLocation, setSelectedLocation] = useState<LocationResult>(SINHAGAD_ROAD_PUNE_DEFAULT);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  
  const [searchRadius, setSearchRadius] = useState<DistanceRadius>(5);
  const [minRating, setMinRating] = useState<MinimumRating>(0);
  const [openNowOnly, setOpenNowOnly] = useState<boolean>(false);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isApiKeyMissing = useMemo(() => {
    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    return !key || key === 'YOUR_GOOGLE_MAPS_API_KEY';
  }, []);

  // Fetch pharmacies based on location and radius
  const loadPharmacies = useCallback(async (loc: { lat: number; lng: number }, radius: number) => {
    setLoading(true);
    setError(null);
    try {
      const results = await fetchNearbyPharmaciesFromPlaces(mapInstance, loc, radius);
      
      const withDistance = results.map(p => ({
        ...p,
        distance: calculateHaversineDistance(loc.lat, loc.lng, p.latitude, p.longitude)
      }));

      setPharmacies(withDistance);
      if (withDistance.length > 0) {
        setSelectedPharmacy(withDistance[0]);
      } else {
        setSelectedPharmacy(null);
      }
    } catch (err: any) {
      console.error('Error fetching nearby pharmacies:', err);
      setError('Unable to search nearby pharmacies. Please check your network or location settings.');
    } finally {
      setLoading(false);
    }
  }, [mapInstance]);

  // Re-fetch when location or radius changes
  useEffect(() => {
    loadPharmacies({ lat: selectedLocation.lat, lng: selectedLocation.lng }, searchRadius);
  }, [selectedLocation, searchRadius, loadPharmacies]);

  // Handle selecting a pharmacy & fetching extra Google Place details (phone, website, hours)
  const handleSelectPharmacy = useCallback(async (pharmacy: Pharmacy) => {
    setSelectedPharmacy(pharmacy);

    if (mapInstance && pharmacy.placeId && (!pharmacy.phoneNumber || !pharmacy.website)) {
      setLoadingDetails(true);
      const details = await fetchPlaceDetailsFromPlaces(mapInstance, pharmacy.placeId);
      setLoadingDetails(false);

      if (Object.keys(details).length > 0) {
        const updated = { ...pharmacy, ...details };
        setSelectedPharmacy(updated);
        setPharmacies(prev => prev.map(p => (p.placeId === pharmacy.placeId ? updated : p)));
      }
    }
  }, [mapInstance]);

  // Filter & Sort Pharmacies
  const filteredPharmacies = useMemo(() => {
    return pharmacies
      .filter(p => {
        if (p.distance !== undefined && p.distance > searchRadius) return false;
        if (minRating > 0 && (p.rating === undefined || p.rating < minRating)) return false;
        if (openNowOnly && !p.openNow) return false;
        return true;
      })
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }, [pharmacies, searchRadius, minRating, openNowOnly]);

  return {
    selectedLocation,
    setSelectedLocation,
    userLocation,
    setUserLocation,
    pharmacies,
    filteredPharmacies,
    selectedPharmacy,
    setSelectedPharmacy: handleSelectPharmacy,
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
    isApiKeyMissing,
    refetch: () => loadPharmacies({ lat: selectedLocation.lat, lng: selectedLocation.lng }, searchRadius)
  };
};
