declare global {
  interface Window {
    google: any;
  }
}

export declare const google: any;

export interface Pharmacy {
  placeId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  rating?: number;
  reviewCount?: number;
  openNow?: boolean;
  phoneNumber?: string;
  website?: string;
  openingHours?: string[];
  distance?: number;
  googleMapsUrl?: string;
  photoUrl?: string;
  userRatingsTotal?: number;
}

export interface LocationResult {
  lat: number;
  lng: number;
  address: string;
  name?: string;
  placeId?: string;
}

export type DistanceRadius = 1 | 2 | 5 | 10;
export type MinimumRating = 0 | 3 | 4 | 4.5;

export interface PharmacyFiltersState {
  radius: DistanceRadius;
  minRating: MinimumRating;
  openNowOnly: boolean;
  sortBy: 'distance' | 'rating';
}
