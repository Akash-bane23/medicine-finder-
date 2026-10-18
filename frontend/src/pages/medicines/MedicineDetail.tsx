import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { medicineService } from '../../services/api';
import type { Medicine } from '../../types';
import { AvailabilityBadge } from '../../components/AvailabilityBadge';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import {
  Pill,
  MapPin,
  AlertTriangle,
  ArrowLeft,
  ShieldAlert,
  Info,
  Thermometer,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

export const MedicineDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      setLoading(true);
      const data = await medicineService.getById(id);
      setMedicine(data || null);
      setLoading(false);
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return <LoadingSpinner label="Loading medicine detail..." size="lg" />;
  }

  if (!medicine) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
          <Pill size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Medicine Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">The requested medicine record could not be located in our database.</p>
        <Link to="/medicines" className="px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold shadow-xs">
          Back to Medicine Search
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Search
      </button>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold border border-sky-100">
                {medicine.category}
              </span>
              <AvailabilityBadge status={medicine.availabilityStatus || 'AVAILABLE'} size="md" />
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                medicine.prescriptionRequired
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}>
                {medicine.prescriptionRequired ? 'Rx Required' : 'Over the Counter (OTC)'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {medicine.name}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs pt-1">
              <p><span className="font-bold text-slate-500 uppercase tracking-wider">Generic Name:</span> <span className="font-bold text-slate-900">{medicine.genericName}</span></p>
              <p><span className="font-bold text-slate-500 uppercase tracking-wider">Brand Name:</span> <span className="font-bold text-slate-900">{medicine.brandName}</span></p>
              <p><span className="font-bold text-slate-500 uppercase tracking-wider">Manufacturer:</span> <span className="font-semibold text-slate-700">{medicine.manufacturer}</span></p>
              <p><span className="font-bold text-slate-500 uppercase tracking-wider">Form & Strength:</span> <span className="font-semibold text-slate-700">{medicine.dosageForm} ({medicine.strength})</span></p>
            </div>
          </div>

          <div className="shrink-0 bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center space-y-3 min-w-[200px]">
            {medicine.price && (
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Est. MRP</span>
                <span className="text-2xl font-extrabold text-slate-900">{formatCurrency(medicine.price)}</span>
              </div>
            )}

            <Link
              to={`/pharmacies?medicine=${encodeURIComponent(medicine.name)}`}
              className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-md shadow-sky-600/20 transition-all flex items-center justify-center gap-2"
            >
              <MapPin size={16} />
              Find Nearby Pharmacies
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600" />
              Primary Therapeutic Uses
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              {medicine.uses}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <ShieldAlert size={18} className="text-amber-600" />
              Precautions & Warnings
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              {medicine.precautions}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <AlertTriangle size={18} className="text-rose-600" />
              Common Side Effects
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              {medicine.sideEffects}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Thermometer size={16} className="text-sky-600" />
              Storage Information
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {medicine.storage}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Zap size={16} className="text-amber-600" />
              Known Drug Interactions
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {medicine.drugInteractions || 'Consult your prescribing doctor before combining with other clinical medications.'}
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-5 text-xs text-slate-600">
            <span className="font-bold text-slate-800 block mb-1">Prescription Status</span>
            <p>
              {medicine.prescriptionRequired
                ? 'This is a Schedule H/Prescription-only medicine. Valid medical prescription must be presented at the pharmacy counter.'
                : 'This medicine is classified as Over The Counter (OTC) and does not require a doctor prescription for purchase.'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 text-amber-900 flex items-start gap-3 shadow-xs">
        <Info size={20} className="text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
            Medical Disclaimer
          </h4>
          <p className="text-xs text-amber-800 leading-relaxed font-medium">
            Medicine information provided by this application is for informational purposes only. Consult a qualified healthcare professional before using medication. Never disregard professional medical advice or delay seeking it because of something you have read on this system.
          </p>
        </div>
      </div>
    </div>
  );
};
