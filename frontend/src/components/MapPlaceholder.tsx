import React, { useState, useEffect } from 'react';
import type { Pharmacy } from '../types';
import { MapPin, Navigation, ArrowRight, Compass, CheckCircle2, Loader2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { openDirections } from '../utils/navigation';

interface MapPlaceholderProps {
  pharmacies: Pharmacy[];
  selectedPharmacy?: Pharmacy | null;
  onSelectPharmacy?: (pharmacy: Pharmacy) => void;
  userLocation?: string;
}

export const MapPlaceholder: React.FC<MapPlaceholderProps> = ({
  pharmacies,
  selectedPharmacy,
  onSelectPharmacy,
  userLocation = 'Sinhagad Road, Pune'
}) => {
  const [activePharmacy, setActivePharmacy] = useState<Pharmacy | null>(selectedPharmacy || (pharmacies.length > 0 ? pharmacies[0] : null));
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locStatus, setLocStatus] = useState<string>('Click to fetch your live location');

  useEffect(() => {
    if (selectedPharmacy) {
      setActivePharmacy(selectedPharmacy);
    }
  }, [selectedPharmacy]);

  // Request browser geolocation access
  const handleFetchLocation = () => {
    if (!navigator.geolocation) {
      setLocStatus('Geolocation is not supported by your browser');
      return;
    }
    setLocating(true);
    setLocStatus('Requesting GPS location access...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoords(coords);
        setLocating(false);
        setLocStatus(`GPS Location Granted (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`);
      },
      (err) => {
        console.warn('Location access denied:', err);
        setLocating(false);
        setLocStatus('Location permission denied. Using Sinhagad Road center.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleSelect = (pharmacy: Pharmacy) => {
    setActivePharmacy(pharmacy);
    if (onSelectPharmacy) onSelectPharmacy(pharmacy);
  };

  const handleDirectionsClick = (pharmacy: Pharmacy) => {
    openDirections(pharmacy.latitude, pharmacy.longitude, pharmacy.name, pharmacy.address);
  };

  // Google Maps iframe URL calculation
  const getMapEmbedUrl = () => {
    if (userCoords && activePharmacy) {
      return `https://maps.google.com/maps?saddr=${userCoords.lat},${userCoords.lng}&daddr=${activePharmacy.latitude},${activePharmacy.longitude}&z=14&output=embed`;
    }
    if (activePharmacy) {
      return `https://maps.google.com/maps?q=${activePharmacy.latitude},${activePharmacy.longitude}&z=15&output=embed`;
    }
    return `https://maps.google.com/maps?q=Sinhagad+Road,+Pune,+Maharashtra&z=14&output=embed`;
  };

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl flex flex-col h-full min-h-[520px] relative text-white">
      
      {/* Top Bar: GPS Location Access & Info */}
      <div className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-400 flex items-center justify-center shrink-0">
            <Compass size={18} className={locating ? 'animate-spin' : ''} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">Google Maps Live GPS ({userLocation})</span>
              {userCoords && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 size={10} /> Active GPS
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">{locStatus}</p>
          </div>
        </div>

        <button
          onClick={handleFetchLocation}
          disabled={locating}
          className="px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
        >
          {locating ? <Loader2 size={14} className="animate-spin" /> : <Navigation size={14} />}
          {userCoords ? 'Refresh My GPS' : 'Access My GPS Location'}
        </button>
      </div>

      {/* Main Map Display Area */}
      <div className="relative flex-1 w-full bg-slate-950 min-h-[320px]">
        <iframe
          title="Google Maps Medical Stores"
          width="100%"
          height="100%"
          style={{ border: 0, minHeight: '340px' }}
          loading="lazy"
          allowFullScreen
          src={getMapEmbedUrl()}
        />

        {/* Floating Quick Store Selector */}
        <div className="absolute top-3 left-3 z-20 max-w-[260px] max-h-[220px] overflow-y-auto bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-2 shadow-2xl space-y-1">
          <span className="block px-2 py-1 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
            Sinhagad Road Stores ({pharmacies.length})
          </span>
          {pharmacies.map((pharm) => {
            const isSelected = activePharmacy?.id === pharm.id;
            return (
              <button
                key={pharm.id}
                onClick={() => handleSelect(pharm)}
                className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between gap-2 transition-all ${
                  isSelected
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <MapPin size={13} className={isSelected ? 'text-slate-950 shrink-0' : 'text-teal-400 shrink-0'} />
                  <span className="truncate">{pharm.name}</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0 ${isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                  {pharm.distance || 'Near'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Selected Store Information Banner */}
      {activePharmacy && (
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
              <MapPin size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white line-clamp-1">{activePharmacy.name}</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {activePharmacy.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{activePharmacy.address}</p>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                <span className="text-teal-400 font-bold">{activePharmacy.distance || '0.5 km'} away</span>
                <span>•</span>
                <span>{activePharmacy.phone}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleDirectionsClick(activePharmacy)}
              className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-xs font-extrabold text-slate-950 flex items-center gap-1.5 transition-colors shadow-md"
              title="Open Google Maps Turn-by-Turn Navigation from your location"
            >
              <Navigation size={14} className="fill-slate-950" />
              Get Directions
              <ExternalLink size={12} />
            </button>

            <Link
              to={`/pharmacies/${activePharmacy.id}`}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1 transition-colors"
            >
              Details
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
