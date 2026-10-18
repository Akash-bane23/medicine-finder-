import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { medicineService } from '../../services/api';
import type { Medicine, MedicineFilterState } from '../../types';
import { MedicineCard } from '../../components/MedicineCard';
import { SearchBar } from '../../components/SearchBar';
import { FilterPanel } from '../../components/FilterPanel';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { Pill } from 'lucide-react';

export const MedicineList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<MedicineFilterState>({
    searchQuery: initialSearch,
    category: '',
    brand: '',
    dosageForm: '',
    prescriptionRequired: 'all',
    availability: 'all'
  });

  useEffect(() => {
    const fetchMeds = async () => {
      setLoading(true);
      const data = await medicineService.getAll();
      setMedicines(data);
      setLoading(false);
    };
    fetchMeds();
  }, []);

  useEffect(() => {
    const query = searchParams.get('search');
    if (query !== null && query !== filters.searchQuery) {
      setFilters(prev => ({ ...prev, searchQuery: query }));
    }
  }, [searchParams]);

  const categories = useMemo(() => Array.from(new Set(medicines.map(m => m.category))).sort(), [medicines]);
  const brands = useMemo(() => Array.from(new Set(medicines.map(m => m.manufacturer))).sort(), [medicines]);
  const dosageForms = useMemo(() => Array.from(new Set(medicines.map(m => m.dosageForm))).sort(), [medicines]);

  const filteredMedicines = useMemo(() => {
    return medicines.filter((med) => {
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchName = med.name.toLowerCase().includes(q);
        const matchGeneric = med.genericName.toLowerCase().includes(q);
        const matchBrand = med.brandName.toLowerCase().includes(q);
        const matchCategory = med.category.toLowerCase().includes(q);
        if (!matchName && !matchGeneric && !matchBrand && !matchCategory) return false;
      }

      if (filters.category && med.category !== filters.category) return false;
      if (filters.brand && med.manufacturer !== filters.brand) return false;

      if (filters.prescriptionRequired === 'yes' && !med.prescriptionRequired) return false;
      if (filters.prescriptionRequired === 'no' && med.prescriptionRequired) return false;

      if (filters.availability !== 'all') {
        const medStatus = (med.availabilityStatus || 'AVAILABLE').toUpperCase();
        if (medStatus !== filters.availability) return false;
      }

      return true;
    });
  }, [medicines, filters]);

  const handleSearchChange = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
    if (query) {
      setSearchParams({ search: query });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold border border-sky-100 mb-2">
            <Pill size={14} className="text-sky-600" />
            <span>Medicine Information Database</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Search & Discover Medicines
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Filter by generic formula, brand name, prescription type, and stock availability across partner pharmacies.
          </p>
        </div>

        <div className="text-right shrink-0 hidden sm:block">
          <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider">Results Found</span>
          <span className="text-2xl font-extrabold text-sky-600">{filteredMedicines.length}</span>
          <span className="text-xs text-slate-500 font-medium"> of {medicines.length} total</span>
        </div>
      </div>

      <SearchBar
        value={filters.searchQuery}
        onChange={handleSearchChange}
        placeholder="Search medicine by name (e.g. Paracetamol, Dolo 650, Amoxicillin)..."
      />

      <FilterPanel
        filters={filters}
        onChange={setFilters}
        categories={categories}
        brands={brands}
        dosageForms={dosageForms}
      />

      {loading ? (
        <LoadingSpinner label="Loading medicine database..." size="lg" />
      ) : filteredMedicines.length === 0 ? (
        <EmptyState
          title="No medicines match your search"
          description="Try broadening your filter criteria or search for generic names."
          iconType="medicine"
          actionLabel="Reset Search Filters"
          onAction={() => {
            setFilters({
              searchQuery: '',
              category: '',
              brand: '',
              dosageForm: '',
              prescriptionRequired: 'all',
              availability: 'all'
            });
            setSearchParams({});
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {filteredMedicines.map((med) => (
            <MedicineCard key={med.id} medicine={med} />
          ))}
        </div>
      )}

    </div>
  );
};
