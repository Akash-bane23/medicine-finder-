import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { initialMedicines } from '../../data/medicines';
import { initialPharmacies } from '../../data/pharmacies';
import { MedicineCard } from '../../components/MedicineCard';
import { PharmacyCard } from '../../components/PharmacyCard';
import { SearchBar } from '../../components/SearchBar';
import { MedicineReminders } from '../../components/reminders/MedicineReminders';
import { AiMedicineAssistant } from '../../components/ai/AiMedicineAssistant';
import type { Medicine, MedicineReminder, SearchHistoryItem, Prescription } from '../../types';
import { favoriteService, reminderService, searchHistoryService, prescriptionService } from '../../services/api';
import {
  Search,
  MapPin,
  Clock,
  Pill,
  Building2,
  Sparkles,
  ArrowRight,
  Heart,
  FileText,
  Trash2
} from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const [favorites, setFavorites] = useState<Medicine[]>([]);
  const [reminders, setReminders] = useState<MedicineReminder[]>([]);
  const [historyItems, setHistoryItems] = useState<SearchHistoryItem[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

  useEffect(() => {
    favoriteService.getFavorites().then(setFavorites);
    reminderService.getReminders().then(setReminders);
    searchHistoryService.getHistory().then(setHistoryItems);
    prescriptionService.getMyPrescriptions().then(setPrescriptions);
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchHistoryService.recordSearch(searchQuery.trim());
      navigate(`/medicines?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleClearHistory = async () => {
    const ok = await searchHistoryService.clearHistory();
    if (ok) setHistoryItems([]);
  };

  const popularMedicines = initialMedicines.slice(0, 3);
  const nearbyPharmacies = initialPharmacies.slice(0, 2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-sky-700 via-teal-700 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-xs mb-3">
            <Sparkles size={14} className="text-emerald-300" />
            User Health Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome to MediFind, {user?.fullName || 'User'}!
          </h1>
          <p className="text-xs sm:text-sm text-sky-100 mt-1 max-w-xl">
            Check live medicine availability at registered pharmacies nearby, manage refill reminders, saved favorites, and uploaded prescriptions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/medicines"
            className="px-4 py-2.5 bg-white text-sky-800 hover:bg-sky-50 rounded-xl text-xs font-bold shadow-md transition-colors flex items-center gap-1.5"
          >
            <Pill size={16} />
            Search Medicines
          </Link>
          <Link
            to="/pharmacies"
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center gap-1.5"
          >
            <MapPin size={16} />
            Find Chemists
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Search size={16} className="text-sky-600" />
          Instant Medicine Availability Search
        </h3>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={handleSearch}
          placeholder="Search by medicine name, generic formulation, or health condition..."
        />
      </div>

      {/* Dashboard Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Clock size={20} />
            </div>
            <span className="text-xs font-bold text-slate-400">{historyItems.length} Logged</span>
          </div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Recent Searches</h4>
          <p className="text-xl font-extrabold text-slate-900 mt-1 truncate">
            {historyItems.length > 0 ? historyItems[0].searchQuery : 'No Searches Yet'}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Search activity saved</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Heart size={20} className="fill-rose-500/20" />
            </div>
            <span className="text-xs font-bold text-slate-400">{favorites.length} Items</span>
          </div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Favorite Medicines</h4>
          <p className="text-xl font-extrabold text-slate-900 mt-1">Saved Cabinet</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Quick reference list</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Clock size={20} />
            </div>
            <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
              {reminders.filter(r => r.isActive).length} Active
            </span>
          </div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Refill Reminders</h4>
          <p className="text-xl font-extrabold text-slate-900 mt-1">{reminders.length} Scheduled</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Dosage notifications</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileText size={20} />
            </div>
            <span className="text-xs font-bold text-emerald-600">{prescriptions.length} Files</span>
          </div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Prescriptions</h4>
          <p className="text-xl font-extrabold text-slate-900 mt-1">Uploaded Rx</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Encrypted records</p>
        </div>
      </div>

      {/* Recent Search History Pill Bar */}
      {historyItems.length > 0 && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-slate-400 shrink-0" />
            <span className="text-xs font-bold text-slate-700">Recent Searches:</span>
            <div className="flex flex-wrap gap-1.5">
              {historyItems.slice(0, 6).map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSearchQuery(item.searchQuery);
                    navigate(`/medicines?search=${encodeURIComponent(item.searchQuery)}`);
                  }}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-700 text-xs font-medium border border-slate-200 transition-colors cursor-pointer"
                >
                  {item.searchQuery}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleClearHistory}
            className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
          >
            <Trash2 size={13} />
            Clear Search History
          </button>
        </div>
      )}

      {/* Refill Reminders Section */}
      <MedicineReminders />

      {/* Saved Favorites Section */}
      {favorites.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Heart size={18} className="text-rose-500 fill-rose-500" />
              Your Favorite Saved Medicines
            </h3>
            <span className="text-xs font-bold text-slate-500">{favorites.length} Saved</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {favorites.slice(0, 3).map(med => (
              <MedicineCard key={med.id} medicine={med} />
            ))}
          </div>
        </section>
      )}

      {/* Recently Searched Medicines Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Pill size={18} className="text-sky-600" />
            Popular Medicines
          </h3>
          <Link to="/medicines" className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1">
            Browse All <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {popularMedicines.map(med => (
            <MedicineCard key={med.id} medicine={med} />
          ))}
        </div>
      </section>

      {/* Nearby Partner Pharmacies Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 size={18} className="text-teal-600" />
            Nearby Partner Pharmacies
          </h3>
          <Link to="/pharmacies" className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1">
            View Map Finder <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {nearbyPharmacies.map(pharm => (
            <PharmacyCard key={pharm.id} pharmacy={pharm} />
          ))}
        </div>
      </section>

      {/* AI Assistant Widget */}
      <AiMedicineAssistant />
    </div>
  );
};

export default UserDashboard;
