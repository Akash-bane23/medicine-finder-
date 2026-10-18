import React from 'react';
import type { MedicineFilterState } from '../types';
import { Filter, RotateCcw } from 'lucide-react';

interface FilterPanelProps {
  filters: MedicineFilterState;
  onChange: (newFilters: MedicineFilterState) => void;
  categories: string[];
  brands: string[];
  dosageForms: string[];
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onChange,
  categories,
  brands
}) => {
  const handleReset = () => {
    onChange({
      searchQuery: filters.searchQuery,
      category: '',
      brand: '',
      dosageForm: '',
      prescriptionRequired: 'all',
      availability: 'all'
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Filter size={16} className="text-sky-600" />
          Filter Medicines
        </h3>
        <button
          onClick={handleReset}
          className="text-xs font-semibold text-slate-500 hover:text-sky-600 flex items-center gap-1 transition-colors"
        >
          <RotateCcw size={13} />
          Reset All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => onChange({ ...filters, category: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Brand / Manufacturer
          </label>
          <select
            value={filters.brand}
            onChange={(e) => onChange({ ...filters, brand: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
          >
            <option value="">All Brands</option>
            {brands.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Prescription Needed
          </label>
          <select
            value={filters.prescriptionRequired}
            onChange={(e) => onChange({ ...filters, prescriptionRequired: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
          >
            <option value="all">All Types</option>
            <option value="no">Over the Counter (OTC)</option>
            <option value="yes">Prescription Required</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Stock Status
          </label>
          <select
            value={filters.availability}
            onChange={(e) => onChange({ ...filters, availability: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
          >
            <option value="all">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="LOW STOCK">Low Stock</option>
            <option value="OUT OF STOCK">Out of Stock</option>
          </select>
        </div>
      </div>
    </div>
  );
};
