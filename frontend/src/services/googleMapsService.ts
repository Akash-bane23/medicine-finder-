import type { Pharmacy, LocationResult } from '../types/pharmacy';
import { calculateHaversineDistance } from '../utils/distance';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

let googleMapsPromise: Promise<any> | null = null;

/**
 * Dynamically loads the Google Maps JavaScript API script with Places and Geometry libraries.
 */
export const loadGoogleMaps = (): Promise<any> => {
  if (window.google && window.google.maps && window.google.maps.places) {
    return Promise.resolve(window.google.maps);
  }

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  const apiKey = GOOGLE_MAPS_API_KEY.trim();
  const isKeyValid = apiKey && apiKey !== 'YOUR_GOOGLE_MAPS_API_KEY';

  googleMapsPromise = new Promise((resolve) => {
    if (isKeyValid) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
      script.async = true;
      script.onload = () => resolve(window.google?.maps || null);
      script.onerror = () => resolve(null);
      document.head.appendChild(script);
    } else {
      resolve(null);
    }
  });

  return googleMapsPromise;
};

export const SINHAGAD_ROAD_PUNE_DEFAULT: LocationResult = {
  lat: 18.4752,
  lng: 73.8324,
  address: 'Sinhagad Road, Pune, Maharashtra, India',
  name: 'Sinhagad Road, Pune'
};

const SINHAGAD_ROAD_PHARMACIES: Pharmacy[] = [
  {
    placeId: 'place-apollo-sinhagad-01',
    name: 'Apollo Pharmacy - Sinhagad Road',
    address: 'Shop No 3, Anand Nagar, Sinhagad Road, Manik Baug, Pune, Maharashtra 411051',
    latitude: 18.4752,
    longitude: 73.8324,
    rating: 4.8,
    reviewCount: 342,
    openNow: true,
    phoneNumber: '+91 020 2435 6789',
    website: 'https://www.apollopharmacy.in',
    openingHours: ['Monday-Sunday: 07:00 AM - 11:00 PM'],
    googleMapsUrl: 'https://maps.google.com/?q=Apollo+Pharmacy+Sinhagad+Road+Pune'
  },
  {
    placeId: 'place-wellness-vadgaon-02',
    name: 'Wellness Forever 24x7 - Vadgaon',
    address: 'Near Vadgaon Bridge, Opp. Fun Time Multiplex, Sinhagad Road, Vadgaon Budruk, Pune 411041',
    latitude: 18.4680,
    longitude: 73.8290,
    rating: 4.7,
    reviewCount: 520,
    openNow: true,
    phoneNumber: '+91 020 2435 1122',
    website: 'https://www.wellnessforever.com',
    openingHours: ['Open 24 Hours, 7 Days a Week'],
    googleMapsUrl: 'https://maps.google.com/?q=Wellness+Forever+Sinhagad+Road+Pune'
  },
  {
    placeId: 'place-medplus-dhayari-03',
    name: 'MedPlus Pharmacy - Dhayari Phata',
    address: 'Shop 5, Near Dhayari Phata Signal, Sinhagad Road, Dhayari, Pune 411041',
    latitude: 18.4590,
    longitude: 73.8210,
    rating: 4.6,
    reviewCount: 215,
    openNow: true,
    phoneNumber: '+91 020 2439 8899',
    website: 'https://www.medplusmart.com',
    openingHours: ['Monday-Sunday: 08:00 AM - 10:30 PM'],
    googleMapsUrl: 'https://maps.google.com/?q=MedPlus+Pharmacy+Dhayari+Phata+Pune'
  },
  {
    placeId: 'place-sanjivani-hingne-04',
    name: 'Sanjivani Medical & General Stores',
    address: 'Near Rajaram Bridge, Sinhagad Road, Hingne Khurd, Pune, Maharashtra 411051',
    latitude: 18.4870,
    longitude: 73.8390,
    rating: 4.5,
    reviewCount: 189,
    openNow: true,
    phoneNumber: '+91 020 2434 5544',
    openingHours: ['Monday-Sunday: 08:30 AM - 11:00 PM'],
    googleMapsUrl: 'https://maps.google.com/?q=Sanjivani+Medical+Hingne+Khurd+Pune'
  },
  {
    placeId: 'place-lifecare-manikbaug-05',
    name: 'LifeCare Chemist & Health Centre',
    address: 'Sun City Road Corner, Opp. Abhiruchi Mall, Sinhagad Road, Pune 411041',
    latitude: 18.4715,
    longitude: 73.8305,
    rating: 4.6,
    reviewCount: 164,
    openNow: true,
    phoneNumber: '+91 020 2435 9900',
    openingHours: ['Monday-Sunday: 08:00 AM - 10:30 PM'],
    googleMapsUrl: 'https://maps.google.com/?q=LifeCare+Chemist+Manik+Baug+Pune'
  },
  {
    placeId: 'place-gajanana-datta-06',
    name: 'Shree Gajanana Medical & Surgical',
    address: 'Near Santosh Hall, Sinhagad Road, Anand Nagar, Pune 411051',
    latitude: 18.4780,
    longitude: 73.8345,
    rating: 4.4,
    reviewCount: 98,
    openNow: true,
    phoneNumber: '+91 020 2435 4411',
    openingHours: ['Monday-Sunday: 08:30 AM - 10:00 PM'],
    googleMapsUrl: 'https://maps.google.com/?q=Shree+Gajanana+Medical+Sinhagad+Road+Pune'
  },
  {
    placeId: 'place-noble-suncity-07',
    name: 'Noble Chemist - Sun City',
    address: 'Shop 12, Sun City Plaza, Sun City Road, Off Sinhagad Road, Pune 411051',
    latitude: 18.4735,
    longitude: 73.8280,
    rating: 4.8,
    reviewCount: 280,
    openNow: true,
    phoneNumber: '+91 020 2435 7788',
    openingHours: ['Monday-Sunday: 08:00 AM - 11:00 PM'],
    googleMapsUrl: 'https://maps.google.com/?q=Noble+Chemist+Sun+City+Pune'
  }
];

/**
 * Searches nearby pharmacies using Google Places API Service.
 */
export const fetchNearbyPharmaciesFromPlaces = async (
  mapInstance: any,
  location: { lat: number; lng: number },
  radiusKm: number
): Promise<Pharmacy[]> => {
  const radiusMeters = radiusKm * 1000;

  if (mapInstance && window.google && window.google.maps && window.google.maps.places) {
    return new Promise((resolve) => {
      const service = new window.google.maps.places.PlacesService(mapInstance);
      const request = {
        location: new window.google.maps.LatLng(location.lat, location.lng),
        radius: radiusMeters,
        type: 'pharmacy'
      };

      service.nearbySearch(request, (results: any[], status: any) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          const pharmacies: Pharmacy[] = results.map((place: any) => {
            const lat = place.geometry?.location?.lat() || location.lat;
            const lng = place.geometry?.location?.lng() || location.lng;
            const dist = calculateHaversineDistance(location.lat, location.lng, lat, lng);

            return {
              placeId: place.place_id || `place-${Math.random()}`,
              name: place.name || 'Pharmacy',
              address: place.vicinity || 'Address unavailable',
              latitude: lat,
              longitude: lng,
              rating: place.rating,
              reviewCount: place.user_ratings_total,
              openNow: place.opening_hours?.isOpen ? place.opening_hours.isOpen() : place.business_status === 'OPERATIONAL',
              distance: dist,
              googleMapsUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
              photoUrl: place.photos && place.photos.length > 0 ? place.photos[0].getUrl({ maxWidth: 400 }) : undefined
            };
          });

          resolve(pharmacies.sort((a, b) => (a.distance || 0) - (b.distance || 0)));
        } else {
          console.warn('Google Places API returned status:', status, '- Using fallback location search.');
          resolve(getFallbackPharmacies(location, radiusKm));
        }
      });
    });
  }

  return getFallbackPharmacies(location, radiusKm);
};

/**
 * Fetches extended place details (phone number, website, opening hours)
 */
export const fetchPlaceDetailsFromPlaces = (
  mapInstance: any,
  placeId: string
): Promise<Partial<Pharmacy>> => {
  if (mapInstance && window.google && window.google.maps && window.google.maps.places) {
    return new Promise((resolve) => {
      const service = new window.google.maps.places.PlacesService(mapInstance);
      service.getDetails(
        {
          placeId: placeId,
          fields: ['formatted_phone_number', 'website', 'opening_hours', 'url', 'rating', 'user_ratings_total']
        },
        (place: any, status: any) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
            resolve({
              phoneNumber: place.formatted_phone_number,
              website: place.website,
              openingHours: place.opening_hours?.weekday_text,
              googleMapsUrl: place.url,
              rating: place.rating,
              reviewCount: place.user_ratings_total
            });
          } else {
            resolve({});
          }
        }
      );
    });
  }
  return Promise.resolve({});
};

const getFallbackPharmacies = (
  location: { lat: number; lng: number },
  radiusKm: number
): Pharmacy[] => {
  return SINHAGAD_ROAD_PHARMACIES.map((p) => {
    const dist = calculateHaversineDistance(location.lat, location.lng, p.latitude, p.longitude);
    return { ...p, distance: dist };
  })
    .filter((p) => (p.distance || 0) <= radiusKm)
    .sort((a, b) => (a.distance || 0) - (b.distance || 0));
};
