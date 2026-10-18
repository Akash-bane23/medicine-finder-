import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { medicineService } from '../../services/api';
import type { Medicine } from '../../types';
import { AvailabilityBadge } from '../../components/AvailabilityBadge';
import { Modal } from '../../components/Modal';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import {
  Pill,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Menu,
  AlertTriangle
} from 'lucide-react';

export const AdminMedicines: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [deletingMedicine, setDeletingMedicine] = useState<Medicine | null>(null);
  const [, setViewingMedicine] = useState<Medicine | null>(null);

  const [formData, setFormData] = useState<Omit<Medicine, 'id'>>({
    name: '',
    genericName: '',
    brandName: '',
    manufacturer: '',
    category: 'Analgesic & Antipyretic',
    dosageForm: 'Tablet',
    strength: '500mg',
    uses: '',
    precautions: '',
    sideEffects: '',
    storage: 'Store below 25°C in a dry place',
    prescriptionRequired: false,
    availabilityStatus: 'AVAILABLE',
    price: 50.00,
    stockCount: 100
  });

  const loadMedicines = async () => {
    setLoading(true);
    const data = await medicineService.getAll();
    setMedicines(data);
    setLoading(false);
  };

  useEffect(() => {
    loadMedicines();
  }, []);

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      genericName: '',
      brandName: '',
      manufacturer: '',
      category: 'Analgesic & Antipyretic',
      dosageForm: 'Tablet',
      strength: '500mg',
      uses: '',
      precautions: '',
      sideEffects: '',
      storage: 'Store below 25°C in a dry place',
      prescriptionRequired: false,
      availabilityStatus: 'AVAILABLE',
      price: 50.00,
      stockCount: 100
    });
    setEditingMedicine(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (med: Medicine) => {
    setEditingMedicine(med);
    setFormData({
      name: med.name,
      genericName: med.genericName,
      brandName: med.brandName,
      manufacturer: med.manufacturer,
      category: med.category,
      dosageForm: med.dosageForm,
      strength: med.strength,
      uses: med.uses,
      precautions: med.precautions,
      sideEffects: med.sideEffects,
      storage: med.storage,
      prescriptionRequired: med.prescriptionRequired,
      availabilityStatus: med.availabilityStatus || 'AVAILABLE',
      price: med.price || 50.00,
      stockCount: med.stockCount || 50
    });
    setIsAddModalOpen(true);
  };

  const handleSaveMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.genericName) return;

    if (editingMedicine) {
      await medicineService.update(editingMedicine.id, formData);
    } else {
      await medicineService.create(formData);
    }
    setIsAddModalOpen(false);
    loadMedicines();
  };

  const handleDeleteMedicine = async () => {
    if (deletingMedicine) {
      await medicineService.delete(deletingMedicine.id);
      setDeletingMedicine(null);
      loadMedicines();
    }
  };

  const filteredMeds = medicines.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-100">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Pill size={18} className="text-emerald-400" />
              Medicine Management
            </h1>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
          >
            <Plus size={16} />
            + Add Medicine
          </button>
        </header>

        <main className="p-4 sm:p-8 space-y-6 overflow-y-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search medicine catalog..."
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="text-xs text-slate-400 font-medium">
              Total Catalog Items: <strong className="text-white">{filteredMeds.length}</strong>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner label="Loading medicines..." size="lg" />
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-4 px-5">Medicine</th>
                      <th className="py-4 px-5">Generic Name</th>
                      <th className="py-4 px-5">Category</th>
                      <th className="py-4 px-5">Manufacturer</th>
                      <th className="py-4 px-5 text-center">Stock</th>
                      <th className="py-4 px-5 text-center">Status</th>
                      <th className="py-4 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredMeds.map((med) => (
                      <tr key={med.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 px-5 font-bold text-white">
                          {med.name}
                        </td>
                        <td className="py-4 px-5 text-slate-300">{med.genericName}</td>
                        <td className="py-4 px-5">
                          <span className="px-2.5 py-1 rounded-md bg-slate-800 text-sky-400 font-semibold border border-slate-700">
                            {med.category}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-slate-400">{med.manufacturer}</td>
                        <td className="py-4 px-5 text-center font-bold text-white">
                          {med.stockCount ?? 150} units
                        </td>
                        <td className="py-4 px-5 text-center">
                          <AvailabilityBadge status={med.availabilityStatus || 'AVAILABLE'} size="sm" />
                        </td>
                        <td className="py-4 px-5 text-right space-x-1">
                          <button
                            onClick={() => setViewingMedicine(med)}
                            className="p-1.5 text-slate-400 hover:text-sky-400 hover:bg-slate-800 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(med)}
                            className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            onClick={() => setDeletingMedicine(med)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingMedicine ? 'Edit Medicine Details' : 'Add New Medicine Formulation'}
        maxWidth="xl"
      >
        <form onSubmit={handleSaveMedicine} className="space-y-4 text-slate-900">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Medicine Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                placeholder="e.g. Paracetamol 500mg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Generic Name *</label>
              <input
                type="text"
                required
                value={formData.genericName}
                onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                placeholder="e.g. Acetaminophen"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Brand Name</label>
              <input
                type="text"
                value={formData.brandName}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                placeholder="e.g. Dolo / Panadol"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Manufacturer</label>
              <input
                type="text"
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                placeholder="e.g. Micro Labs Ltd"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                placeholder="Analgesic & Antipyretic"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Dosage Form & Strength</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={formData.dosageForm}
                  onChange={(e) => setFormData({ ...formData, dosageForm: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  placeholder="Tablet"
                />
                <input
                  type="text"
                  value={formData.strength}
                  onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  placeholder="500mg"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Therapeutic Uses</label>
            <textarea
              rows={2}
              value={formData.uses}
              onChange={(e) => setFormData({ ...formData, uses: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              placeholder="Fever reduction, pain relief..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Precautions & Side Effects</label>
            <textarea
              rows={2}
              value={formData.precautions}
              onChange={(e) => setFormData({ ...formData, precautions: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              placeholder="Do not exceed recommended dose..."
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.prescriptionRequired}
                onChange={(e) => setFormData({ ...formData, prescriptionRequired: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded-sm"
              />
              Prescription Required (Schedule H)
            </label>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-slate-700">Stock Status:</span>
              <select
                value={formData.availabilityStatus}
                onChange={(e) => setFormData({ ...formData, availabilityStatus: e.target.value as any })}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 font-semibold"
              >
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="LOW STOCK">LOW STOCK</option>
                <option value="OUT OF STOCK">OUT OF STOCK</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md"
            >
              Save Medicine
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={!!deletingMedicine}
        onClose={() => setDeletingMedicine(null)}
        title="Confirm Deletion"
        maxWidth="sm"
      >
        <div className="space-y-4 text-slate-800">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            <AlertTriangle size={20} className="shrink-0 text-rose-600" />
            <p className="font-bold">Are you sure you want to delete this medicine?</p>
          </div>

          <p className="text-xs text-slate-600">
            Medicine <strong className="text-slate-900">{deletingMedicine?.name}</strong> will be permanently removed from the catalog.
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setDeletingMedicine(null)}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteMedicine}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
