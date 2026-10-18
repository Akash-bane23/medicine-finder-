import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { pharmacyService } from '../../services/api';
import type { Pharmacy } from '../../types';
import { Modal } from '../../components/Modal';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  Search,
  Menu,
  AlertTriangle
} from 'lucide-react';

export const AdminPharmacies: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPharmacy, setEditingPharmacy] = useState<Pharmacy | null>(null);
  const [deletingPharmacy, setDeletingPharmacy] = useState<Pharmacy | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Central City',
    latitude: 28.6139,
    longitude: 77.2090,
    openingTime: '08:00 AM',
    closingTime: '10:00 PM',
    status: 'Open' as 'Open' | 'Closed'
  });

  const loadPharmacies = async () => {
    setLoading(true);
    const data = await pharmacyService.getAll();
    setPharmacies(data);
    setLoading(false);
  };

  useEffect(() => {
    loadPharmacies();
  }, []);

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      ownerName: '',
      email: '',
      phone: '',
      address: '',
      city: 'Central City',
      latitude: 28.6139,
      longitude: 77.2090,
      openingTime: '08:00 AM',
      closingTime: '10:00 PM',
      status: 'Open'
    });
    setEditingPharmacy(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (p: Pharmacy) => {
    setEditingPharmacy(p);
    setFormData({
      name: p.name,
      ownerName: p.ownerName,
      email: p.email,
      phone: p.phone,
      address: p.address,
      city: p.city,
      latitude: p.latitude,
      longitude: p.longitude,
      openingTime: p.openingTime,
      closingTime: p.closingTime,
      status: p.status
    });
    setIsAddModalOpen(true);
  };

  const handleSavePharmacy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.address) return;

    if (editingPharmacy) {
      await pharmacyService.update(editingPharmacy.id, formData);
    } else {
      await pharmacyService.create({
        ...formData,
        medicines: []
      });
    }
    setIsAddModalOpen(false);
    loadPharmacies();
  };

  const handleDeletePharmacy = async () => {
    if (deletingPharmacy) {
      await pharmacyService.delete(deletingPharmacy.id);
      setDeletingPharmacy(null);
      loadPharmacies();
    }
  };

  const filteredPharmacies = pharmacies.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.address.toLowerCase().includes(searchQuery.toLowerCase())
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
              <Building2 size={18} className="text-teal-400" />
              Pharmacy Management
            </h1>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
          >
            <Plus size={16} />
            + Add Pharmacy
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
                placeholder="Search pharmacy name or owner..."
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div className="text-xs text-slate-400 font-medium">
              Registered Chemists: <strong className="text-white">{filteredPharmacies.length}</strong>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner label="Loading pharmacy records..." size="lg" />
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-4 px-5">Pharmacy Name</th>
                      <th className="py-4 px-5">Owner</th>
                      <th className="py-4 px-5">Address</th>
                      <th className="py-4 px-5">Phone</th>
                      <th className="py-4 px-5">Opening Hours</th>
                      <th className="py-4 px-5 text-center">Status</th>
                      <th className="py-4 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredPharmacies.map((pharm) => (
                      <tr key={pharm.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 px-5 font-bold text-white">
                          {pharm.name}
                        </td>
                        <td className="py-4 px-5 text-slate-300">{pharm.ownerName}</td>
                        <td className="py-4 px-5 text-slate-400 max-w-xs truncate">{pharm.address}</td>
                        <td className="py-4 px-5 font-medium text-slate-200">{pharm.phone}</td>
                        <td className="py-4 px-5 text-slate-400">
                          {pharm.openingTime} - {pharm.closingTime}
                        </td>
                        <td className="py-4 px-5 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              pharm.status === 'Open'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {pharm.status}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-right space-x-1">
                          <button
                            onClick={() => handleOpenEditModal(pharm)}
                            className="p-1.5 text-slate-400 hover:text-teal-400 hover:bg-slate-800 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            onClick={() => setDeletingPharmacy(pharm)}
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
        title={editingPharmacy ? 'Edit Pharmacy Details' : 'Register New Pharmacy'}
        maxWidth="xl"
      >
        <form onSubmit={handleSavePharmacy} className="space-y-4 text-slate-900">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Pharmacy Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                placeholder="e.g. MediCare Plus Chemist"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Owner Name *</label>
              <input
                type="text"
                required
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                placeholder="e.g. Dr. Rajesh Verma"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                placeholder="contact@pharmacy.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Phone Number *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                placeholder="+91 98765 43210"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Full Street Address *</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                placeholder="45 Healthcare Boulevard, Sector 18"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">GPS Coordinates (Lat / Lng)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  placeholder="28.6139"
                />
                <input
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  placeholder="77.2090"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Opening Time</label>
              <input
                type="text"
                value={formData.openingTime}
                onChange={(e) => setFormData({ ...formData, openingTime: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                placeholder="08:00 AM"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Closing Time</label>
              <input
                type="text"
                value={formData.closingTime}
                onChange={(e) => setFormData({ ...formData, closingTime: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                placeholder="11:00 PM"
              />
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
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md"
            >
              Save Pharmacy
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={!!deletingPharmacy}
        onClose={() => setDeletingPharmacy(null)}
        title="Confirm Delete Pharmacy"
        maxWidth="sm"
      >
        <div className="space-y-4 text-slate-800">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            <AlertTriangle size={20} className="shrink-0 text-rose-600" />
            <p className="font-bold">Are you sure you want to delete this pharmacy?</p>
          </div>

          <p className="text-xs text-slate-600">
            Pharmacy <strong className="text-slate-900">{deletingPharmacy?.name}</strong> will be removed from system directory.
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setDeletingPharmacy(null)}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleDeletePharmacy}
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
