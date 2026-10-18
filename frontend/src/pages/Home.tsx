import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, Pill, CheckCircle2, Building2, ArrowRight, Sparkles, Navigation, Phone, Star } from 'lucide-react';
import { initialMedicines } from '../data/medicines';
import { MedicineCard } from '../components/MedicineCard';
import { MapView } from '../components/map/MapView';
import { LocationSearch } from '../components/location/LocationSearch';
import { CurrentLocationButton } from '../components/location/CurrentLocationButton';
import { useNearbyPharmacies } from '../hooks/useNearbyPharmacies';
import { loadGoogleMaps } from '../services/googleMapsService';
import { openDirections } from '../utils/navigation';

export const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [isMapScriptLoaded, setIsMapScriptLoaded] = useState(false);
  const navigate = useNavigate();

  const {
    selectedLocation,
    setSelectedLocation,
    userLocation,
    setUserLocation,
    filteredPharmacies,
    selectedPharmacy,
    setSelectedPharmacy,
    isApiKeyMissing,
    setError
  } = useNearbyPharmacies(mapInstance);

  useEffect(() => {
    loadGoogleMaps()
      .then(() => setIsMapScriptLoaded(true))
      .catch((err) => {
        console.warn('Google Maps Loader info:', err);
        setIsMapScriptLoaded(false);
      });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/medicines?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/medicines');
    }
  };

  const handleLocationFound = (loc: { lat: number; lng: number; address: string }) => {
    setUserLocation({ lat: loc.lat, lng: loc.lng });
    setSelectedLocation(loc);
    setError(null);
  };

  const featuredMedicines = initialMedicines.slice(0, 4);

  return (
    <div className="space-y-16 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-50/80 via-white to-slate-50 pt-12 pb-16 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/80 text-sky-800 text-xs font-bold border border-sky-200/80 mb-6 shadow-xs">
              <Sparkles size={14} className="text-sky-600" />
              <span>Smart Healthcare & Medicine Store Locator</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Find Medicines. <br />
              <span className="bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
                Map Nearby Medicine Stores.
              </span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
              Search medicine info, check real-time stock status, and view nearby licensed pharmacies on an interactive GPS map.
            </p>

            <form onSubmit={handleSearch} className="mt-8 max-w-2xl mx-auto">
              <div className="bg-white p-2.5 rounded-3xl shadow-xl shadow-sky-900/5 border border-slate-200/90 flex flex-col sm:flex-row items-center gap-2">
                <div className="flex-1 flex items-center pl-4 w-full">
                  <Search className="text-slate-400 shrink-0 mr-3" size={22} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search medicine name (e.g. Paracetamol, Amoxicillin)..."
                    className="w-full py-3 bg-transparent text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-hidden"
                  />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3.5 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl text-sm font-bold shadow-md shadow-sky-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Search size={18} />
                    Search
                  </button>
                  <a
                    href="#nearby-map"
                    className="w-full sm:w-auto px-5 py-3.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200/80 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 shrink-0"
                  >
                    <MapPin size={18} className="text-teal-600" />
                    Locate Stores
                  </a>
                </div>
              </div>
            </form>

            <div className="mt-4 flex items-center justify-center gap-2 flex-wrap text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Popular Medicines:</span>
              {['Paracetamol 500mg', 'Amoxicillin', 'Metformin', 'Omeprazole'].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setSearchQuery(item);
                    navigate(`/medicines?search=${encodeURIComponent(item)}`);
                  }}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors font-medium"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE GPS MAP SECTION FOR NEARBY MEDICINE STORES */}
      <section id="nearby-map" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-slate-800 relative overflow-hidden">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-teal-400">
                  Live Healthcare GPS Module
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                <MapPin className="text-teal-400 shrink-0" size={28} />
                Nearby Medicine Stores Map
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                Locate open medicine stores near <span className="font-bold text-teal-300">{selectedLocation.address}</span>. Click on map markers for directions and details.
              </p>
            </div>

            <Link
              to="/nearby-pharmacies"
              className="shrink-0 px-5 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 transition-all flex items-center gap-2 self-start md:self-auto"
            >
              <Building2 size={16} /> Open Full Map View
            </Link>
          </div>

          {/* Location Search Bar + GPS Location Button */}
          <div className="flex flex-col md:flex-row items-center gap-3 mb-6 text-slate-900">
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
              onError={() => setError('GPS permission denied or unavailable.')}
            />
          </div>

          {/* Map + Selected Pharmacy Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Map Canvas */}
            <div className="lg:col-span-7 xl:col-span-8 h-[380px] sm:h-[460px] rounded-2xl overflow-hidden shadow-xl border border-slate-800">
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

            {/* Selected Pharmacy Quick Card / List Side Panel */}
            <div className="lg:col-span-5 xl:col-span-4 bg-slate-800/90 backdrop-blur-md rounded-2xl p-5 border border-slate-700 flex flex-col justify-between">
              {selectedPharmacy ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-teal-950 text-teal-300 border border-teal-800">
                      Selected Store Pin
                    </span>
                    {selectedPharmacy.distance !== undefined && (
                      <span className="text-xs font-bold text-teal-400 flex items-center gap-1">
                        <Navigation size={12} /> {selectedPharmacy.distance} km away
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      {selectedPharmacy.name}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 flex items-start gap-1.5">
                      <MapPin size={14} className="text-teal-400 shrink-0 mt-0.5" />
                      <span>{selectedPharmacy.address}</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-700/80">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Phone size={14} className="text-slate-400 shrink-0" />
                      <span className="truncate">{selectedPharmacy.phoneNumber || 'Available on Map'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                      <Star size={14} className="fill-amber-400 shrink-0" />
                      <span>{selectedPharmacy.rating || 4.5} / 5.0 Rating</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => openDirections(selectedPharmacy.latitude, selectedPharmacy.longitude, selectedPharmacy.name, selectedPharmacy.address)}
                      className="flex-1 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      <Navigation size={14} /> Get GPS Directions
                    </button>

                    <Link
                      to="/nearby-pharmacies"
                      className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1 shrink-0"
                    >
                      Full Details <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 space-y-3 my-auto">
                  <Building2 size={36} className="text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">Click any red pin on the map to view pharmacy details & directions.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE CARDS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive System Features
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Everything you need to locate medications and verify stock at local chemists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Pill size={28} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Medicine Information</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Get useful information about medicines including generic composition, dosage, uses, precautions, and side effects.
            </p>
            <Link to="/medicines" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700">
              Explore Medicines <ArrowRight size={14} />
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Medicine Availability</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Check real-time stock levels (Available, Low Stock, or Out of Stock) before making a physical trip to the chemist.
            </p>
            <Link to="/medicines" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700">
              Check Stock <ArrowRight size={14} />
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <MapPin size={28} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Nearby Pharmacies Map</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Find licensed pharmacies near your current GPS location with calculated distances and opening hours.
            </p>
            <Link to="/nearby-pharmacies" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700">
              Find Pharmacies <ArrowRight size={14} />
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Building2 size={28} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Pharmacy Details</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              View complete pharmacy contact details, owner info, precise location coordinates, and turn-by-turn directions.
            </p>
            <Link to="/nearby-pharmacies" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-700">
              View Details <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* POPULAR MEDICINES PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Popular Medicines</h2>
            <p className="text-xs text-slate-500">Frequently searched and requested medications.</p>
          </div>
          <Link
            to="/medicines"
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
          >
            View All Medicines ({initialMedicines.length}) <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredMedicines.map((medicine) => (
            <MedicineCard key={medicine.id} medicine={medicine} />
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;


