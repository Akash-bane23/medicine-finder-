import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { pharmacyService } from '../../services/api';
import type { Pharmacy } from '../../types';
import { AvailabilityBadge } from '../../components/AvailabilityBadge';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { SearchBar } from '../../components/SearchBar';
import { formatCurrency, formatDate } from '../../utils/helpers';
import {
  Building2,
  MapPin,
  Phone,
  Clock,
  Navigation,
  ArrowLeft,
  Pill,
  UserCheck,
  ExternalLink
} from 'lucide-react';
import { openDirections, openGoogleMapsPinpoint, getGoogleMapEmbedUrl } from '../../utils/navigation';

export const PharmacyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      setLoading(true);
      const data = await pharmacyService.getById(id);
      setPharmacy(data || null);
      setLoading(false);
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return <LoadingSpinner label="Loading pharmacy details..." size="lg" />;
  }

  if (!pharmacy) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
          <Building2 size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Pharmacy Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">The requested pharmacy profile could not be found.</p>
        <Link to="/pharmacies" className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold shadow-xs">
          Back to Pharmacy Finder
        </Link>
      </div>
    );
  }

  const handleDirections = () => {
    openDirections(pharmacy.latitude, pharmacy.longitude, pharmacy.name, pharmacy.address);
  };

  const handleContact = () => {
    window.location.href = `tel:${pharmacy.phone}`;
  };

  const filteredMeds = pharmacy.medicines.filter(m =>
    m.medicineName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Pharmacies
      </button>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-md">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  pharmacy.status === 'Open'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {pharmacy.status}
              </span>
              {pharmacy.distance && (
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                  {pharmacy.distance} away
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {pharmacy.name}
            </h1>

            <div className="space-y-2 text-xs text-slate-600">
              <p className="flex items-start gap-2">
                <MapPin size={16} className="text-teal-600 shrink-0 mt-0.5" />
                <span className="font-semibold text-slate-800">{pharmacy.address}, {pharmacy.city}</span>
              </p>
              
              <div className="flex items-center gap-6 pt-1 flex-wrap">
                <p className="flex items-center gap-2">
                  <Phone size={15} className="text-teal-600" />
                  <span className="font-bold text-slate-900">{pharmacy.phone}</span>
                </p>

                <p className="flex items-center gap-2">
                  <Clock size={15} className="text-teal-600" />
                  <span>Hours: <strong className="text-slate-800">{pharmacy.openingTime} - {pharmacy.closingTime}</strong></span>
                </p>

                {pharmacy.ownerName && (
                  <p className="flex items-center gap-2">
                    <UserCheck size={15} className="text-teal-600" />
                    <span>License Owner: <strong className="text-slate-800">{pharmacy.ownerName}</strong></span>
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            <button
              onClick={handleContact}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
            >
              <Phone size={16} />
              Contact Pharmacy
            </button>

            <button
              onClick={handleDirections}
              className="px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2"
            >
              <Navigation size={16} />
              Get Directions
            </button>
          </div>
        </div>
      </div>

      {/* Google Map Pinpoint Location Block */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <MapPin size={22} className="text-teal-600 shrink-0" />
              Exact Medical Shop Pinpoint Location
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Live Google Map location pin for <strong className="text-slate-800">{pharmacy.name}</strong> ({pharmacy.address})
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => openGoogleMapsPinpoint(pharmacy.latitude, pharmacy.longitude, pharmacy.name)}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-teal-300 rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <MapPin size={14} className="text-teal-400" />
              <span>Open Google Maps Pin</span>
              <ExternalLink size={12} className="opacity-70" />
            </button>
            <button
              onClick={handleDirections}
              className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Navigation size={14} />
              <span>Directions</span>
            </button>
          </div>
        </div>

        <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100 relative">
          <iframe
            title={`Google Map pinpoint for ${pharmacy.name}`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={getGoogleMapEmbedUrl(pharmacy.latitude, pharmacy.longitude, pharmacy.name, 16)}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Pill size={20} className="text-teal-600" />
              Medicine Stock & Availability Catalog
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live inventory tracking for medications available at this specific branch.
            </p>
          </div>

          <div className="w-full sm:w-72">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search medicine in this pharmacy..."
            />
          </div>
        </div>

        {filteredMeds.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No matching medicines found in this pharmacy's stock catalog.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-y border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Medicine Name</th>
                  <th className="py-3.5 px-4 text-center">In-Stock Quantity</th>
                  <th className="py-3.5 px-4 text-center">Availability Status</th>
                  <th className="py-3.5 px-4 text-right">Est. Price</th>
                  <th className="py-3.5 px-4 text-right">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMeds.map((med) => (
                  <tr key={med.medicineId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900">
                      {med.medicineName}
                    </td>
                    <td className="py-4 px-4 text-center font-extrabold text-slate-800">
                      {med.quantity} units
                    </td>
                    <td className="py-4 px-4 text-center">
                      <AvailabilityBadge status={med.status} size="sm" />
                    </td>
                    <td className="py-4 px-4 text-right font-extrabold text-slate-900">
                      {formatCurrency(med.price)}
                    </td>
                    <td className="py-4 px-4 text-right text-slate-500 font-medium">
                      {formatDate(med.lastUpdated)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
