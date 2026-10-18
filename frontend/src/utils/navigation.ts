/**
 * Generates exact Google Maps Directions URL for target pharmacy coordinates
 */
export const getDirectionsUrl = (latitude: number, longitude: number): string => {
  return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
};

/**
 * Validates pharmacy coordinates and opens Google Maps Directions to the exact selected pharmacy location
 */
export const openDirections = (latitude: number, longitude: number, _name?: string, _address?: string) => {
  if (
    latitude === undefined ||
    longitude === undefined ||
    typeof latitude !== 'number' ||
    typeof longitude !== 'number' ||
    isNaN(latitude) ||
    isNaN(longitude)
  ) {
    console.error('Invalid or missing pharmacy coordinates for directions:', latitude, longitude);
    return;
  }

  const destinationUrl = getDirectionsUrl(latitude, longitude);

  if (typeof navigator !== 'undefined' && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const url = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${latitude},${longitude}&travelmode=driving`;
        window.open(url, '_blank');
      },
      (_error) => {
        window.open(destinationUrl, '_blank');
      },
      { timeout: 4000, enableHighAccuracy: true }
    );
  } else {
    window.open(destinationUrl, '_blank');
  }
};

/**
 * Opens Google Maps with exact pinpoint marker at the specified coordinates
 */
export const openGoogleMapsPinpoint = (latitude: number, longitude: number, name?: string) => {
  if (typeof latitude !== 'number' || typeof longitude !== 'number') return;
  const query = name ? `${name}, ${latitude},${longitude}` : `${latitude},${longitude}`;
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  window.open(url, '_blank');
};

/**
 * Generates an iframe embed URL for real Google Maps pinpoint without API key requirement
 */
export const getGoogleMapEmbedUrl = (latitude: number, longitude: number, query?: string, zoom: number = 16) => {
  const searchParam = query ? `${query}, ${latitude},${longitude}` : `${latitude},${longitude}`;
  return `https://maps.google.com/maps?q=${encodeURIComponent(searchParam)}&z=${zoom}&output=embed`;
};
