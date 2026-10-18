import React, { useState, useEffect, useRef } from 'react';
import type { Pharmacy, LocationResult } from '../../types/pharmacy';
import { openDirections, openGoogleMapsPinpoint, getGoogleMapEmbedUrl } from '../../utils/navigation';
import { MapPin, Navigation, ExternalLink, Layers, Compass, Store } from 'lucide-react';

interface MapViewProps {
  center: { lat: number; lng: number };
  zoom?: number;
  pharmacies: Pharmacy[];
  selectedPharmacy: Pharmacy | null;
  selectedLocation: LocationResult;
  userLocation: { lat: number; lng: number } | null;
  onPharmacySelect: (pharmacy: Pharmacy) => void;
  onMapInstanceReady?: (map: any) => void;
  isApiKeyMissing?: boolean;
}

export const MapView: React.FC<MapViewProps> = ({
  center,
  zoom = 14,
  pharmacies,
  selectedPharmacy,
  selectedLocation,
  userLocation,
  onPharmacySelect,
}) => {
  const [viewMode, setViewMode] = useState<'google' | 'interactive'>('google');
  const leafletContainerRef = useRef<HTMLDivElement | null>(null);
  const leafletMapInstanceRef = useRef<any>(null);
  const leafletMarkersGroupRef = useRef<any>(null);
  const [isLeafletReady, setIsLeafletReady] = useState(false);

  const activeTargetLat = selectedPharmacy ? selectedPharmacy.latitude : center.lat;
  const activeTargetLng = selectedPharmacy ? selectedPharmacy.longitude : center.lng;
  const activeTargetName = selectedPharmacy ? selectedPharmacy.name : selectedLocation.name || selectedLocation.address;

  // Dynamically load Leaflet for interactive multi-pin map view without API keys
  useEffect(() => {
    let isMounted = true;
    if ((window as any).L) {
      if (isMounted) setIsLeafletReady(true);
      return;
    }

    // Load Leaflet CSS
    if (!document.getElementById('leaflet-css-cdn')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css-cdn';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Load Leaflet JS
    if (!document.getElementById('leaflet-js-cdn')) {
      const script = document.createElement('script');
      script.id = 'leaflet-js-cdn';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => {
        if (isMounted) setIsLeafletReady(true);
      };
      document.head.appendChild(script);
    } else {
      const timer = setInterval(() => {
        if ((window as any).L && isMounted) {
          setIsLeafletReady(true);
          clearInterval(timer);
        }
      }, 100);
      return () => clearInterval(timer);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Initialize and update Leaflet Interactive Map
  useEffect(() => {
    if (viewMode !== 'interactive' || !isLeafletReady || !leafletContainerRef.current) return;
    const L = (window as any).L;
    if (!L) return;

    if (!leafletMapInstanceRef.current) {
      const map = L.map(leafletContainerRef.current, {
        zoomControl: true,
        attributionControl: true
      }).setView([center.lat, center.lng], zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      leafletMarkersGroupRef.current = L.layerGroup().addTo(map);
      leafletMapInstanceRef.current = map;
    }

    const map = leafletMapInstanceRef.current;
    const markersGroup = leafletMarkersGroupRef.current;

    if (markersGroup) {
      markersGroup.clearLayers();
    }

    // Center map when center or selected pharmacy changes
    map.setView([activeTargetLat, activeTargetLng], selectedPharmacy ? 16 : zoom);

    // Create custom SVG icons
    const createCustomIcon = (color: string, isPulse: boolean = false, size: number = 32) => {
      const html = `
        <div style="position: relative; width: ${size}px; height: ${size}px; display: flex; items-center; justify-content: center;">
          ${isPulse ? `<div style="position: absolute; width: 100%; height: 100%; background-color: ${color}; opacity: 0.3; border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>` : ''}
          <div style="width: ${size * 0.75}px; height: ${size * 0.75}px; background-color: ${color}; border: 2.5px solid white; border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 11px;">
            🏥
          </div>
        </div>
      `;
      return L.divIcon({
        html,
        className: 'custom-leaflet-marker',
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -size / 2]
      });
    };

    const userIcon = L.divIcon({
      html: `
        <div style="width: 24px; height: 24px; background-color: #0284c7; border: 3px solid white; border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.3);"></div>
      `,
      className: 'user-leaflet-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    // 1. Add User GPS location marker if active
    if (userLocation) {
      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .bindTooltip('Your Current GPS Location', { permanent: false, direction: 'top' })
        .addTo(markersGroup);
    }

    // 2. Add Pharmacy markers
    pharmacies.forEach((pharmacy) => {
      const isSelected = selectedPharmacy?.placeId === pharmacy.placeId;
      const markerColor = isSelected ? '#0d9488' : '#e11d48';
      const icon = createCustomIcon(markerColor, isSelected, isSelected ? 38 : 30);

      const marker = L.marker([pharmacy.latitude, pharmacy.longitude], { icon }).addTo(markersGroup);

      const popupHtml = `
        <div style="padding: 4px; font-family: system-ui, sans-serif; min-width: 200px;">
          <div style="font-weight: 800; font-size: 13px; color: #0f172a; margin-bottom: 2px;">${pharmacy.name}</div>
          <div style="font-size: 11px; color: #475569; margin-bottom: 6px; line-height: 1.3;">${pharmacy.address}</div>
          <div style="display: flex; items-center; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-size: 11px; font-weight: 700; color: #0d9488;">⭐ ${pharmacy.rating || 4.5}</span>
            <span style="font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 9999px; background-color: ${pharmacy.openNow ? '#dcfce7' : '#ffe4e6'}; color: ${pharmacy.openNow ? '#15803d' : '#be123c'};">
              ${pharmacy.openNow ? 'Open Now' : 'Closed'}
            </span>
          </div>
          <button id="leaflet-dir-${pharmacy.placeId}" style="width: 100%; padding: 6px 10px; background-color: #0d9488; color: white; border: none; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
            🚀 Open Google Maps Pinpoint
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        onPharmacySelect(pharmacy);
      });

      marker.on('popupopen', () => {
        setTimeout(() => {
          const btn = document.getElementById(`leaflet-dir-${pharmacy.placeId}`);
          if (btn) {
            btn.onclick = () => {
              openGoogleMapsPinpoint(pharmacy.latitude, pharmacy.longitude, pharmacy.name);
            };
          }
        }, 100);
      });
    });
  }, [viewMode, isLeafletReady, pharmacies, selectedPharmacy, center, zoom, userLocation, activeTargetLat, activeTargetLng, onPharmacySelect]);

  const handleOpenGoogleMapsPinpoint = () => {
    openGoogleMapsPinpoint(activeTargetLat, activeTargetLng, activeTargetName);
  };

  const handleOpenDirections = () => {
    if (selectedPharmacy) {
      openDirections(selectedPharmacy.latitude, selectedPharmacy.longitude, selectedPharmacy.name, selectedPharmacy.address);
    } else {
      openDirections(center.lat, center.lng, selectedLocation.name, selectedLocation.address);
    }
  };

  const iframeSrc = getGoogleMapEmbedUrl(activeTargetLat, activeTargetLng, activeTargetName, selectedPharmacy ? 16 : 14);

  return (
    <div className="w-full h-full min-h-[420px] rounded-3xl overflow-hidden border border-slate-200/80 shadow-md relative bg-slate-900 flex flex-col group">
      
      {/* Top Map Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Mode Switcher Pill */}
        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md p-1 rounded-2xl border border-slate-700/80 shadow-lg flex items-center gap-1">
          <button
            type="button"
            onClick={() => setViewMode('google')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'google'
                ? 'bg-teal-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Compass size={14} />
            <span>Google Map Pinpoint</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('interactive')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'interactive'
                ? 'bg-teal-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers size={14} />
            <span>Interactive Map Pins ({pharmacies.length})</span>
          </button>
        </div>

        {/* Direct Google Maps Action Buttons */}
        <div className="pointer-events-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleOpenGoogleMapsPinpoint}
            className="px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md text-teal-300 hover:text-white text-xs font-extrabold rounded-2xl border border-teal-500/40 shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
            title="Open exact pinpoint location directly in Google Maps"
          >
            <MapPin size={14} className="text-teal-400 shrink-0" />
            <span className="hidden sm:inline">Google Maps Pin</span>
            <ExternalLink size={12} className="opacity-70" />
          </button>

          <button
            type="button"
            onClick={handleOpenDirections}
            className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-extrabold rounded-2xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
            title="Get turn-by-turn navigation on Google Maps"
          >
            <Navigation size={14} className="shrink-0 fill-white" />
            <span>Directions</span>
          </button>
        </div>
      </div>

      {/* Main Map View Area */}
      <div className="w-full flex-1 min-h-[380px] relative bg-slate-100 overflow-hidden">
        
        {/* Google Maps Pinpoint Embed View */}
        {viewMode === 'google' && (
          <iframe
            key={`${activeTargetLat}-${activeTargetLng}`}
            title="Real Google Maps Pinpoint View"
            width="100%"
            height="100%"
            className="w-full h-full border-0 min-h-[420px]"
            loading="lazy"
            allowFullScreen
            src={iframeSrc}
          />
        )}

        {/* Interactive Leaflet Multi-Pin Map View */}
        {viewMode === 'interactive' && (
          <div ref={leafletContainerRef} className="w-full h-full min-h-[420px] z-10" />
        )}
      </div>

      {/* Bottom Floating Card Overlay for Selected Medical Shop */}
      {selectedPharmacy && (
        <div className="absolute bottom-3 left-3 right-3 z-20 bg-slate-900/95 backdrop-blur-md text-white p-3.5 sm:p-4 rounded-2xl border border-slate-700/90 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 text-[10px] font-extrabold uppercase border border-teal-500/30 flex items-center gap-1">
                <Store size={10} /> Selected Medical Store
              </span>
              {selectedPharmacy.distance !== undefined && (
                <span className="text-[11px] font-bold text-slate-400">
                  • {selectedPharmacy.distance.toFixed(1)} km away
                </span>
              )}
            </div>
            <h4 className="text-sm font-bold text-white tracking-tight line-clamp-1">
              {selectedPharmacy.name}
            </h4>
            <p className="text-xs text-slate-300 line-clamp-1">
              {selectedPharmacy.address}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleOpenGoogleMapsPinpoint}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-xl text-xs font-bold border border-slate-700 transition-all flex items-center gap-1 cursor-pointer"
            >
              <MapPin size={14} />
              <span>Exact Pin</span>
            </button>
            <button
              type="button"
              onClick={handleOpenDirections}
              className="px-3.5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl text-xs font-extrabold shadow-sm transition-all flex items-center gap-1 cursor-pointer"
            >
              <Navigation size={14} className="fill-slate-950" />
              <span>Get Directions</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
