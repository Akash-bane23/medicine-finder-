import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { availabilityService } from '../../services/api';
import type { AvailabilityRecord, AvailabilityStatus } from '../../types';
import { AvailabilityBadge } from '../../components/AvailabilityBadge';
import { Modal } from '../../components/Modal';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import {
  CheckSquare,
  Edit3,
  Search,
  Menu,
  Save,
  Building2,
  RefreshCw
} from 'lucide-react';

export const AdminAvailability: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [records, setRecords] = useState<AvailabilityRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingRecord, setEditingRecord] = useState<AvailabilityRecord | null>(null);

  const [editQuantity, setEditQuantity] = useState<number>(0);
  const [editStatus, setEditStatus] = useState<AvailabilityStatus>('AVAILABLE');

  const loadRecords = async () => {
    setLoading(true);
    const data = await availabilityService.getAllRecords();
    setRecords(data);
    setLoading(false);
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleOpenEdit = (rec: AvailabilityRecord) => {
    setEditingRecord(rec);
    setEditQuantity(rec.quantity);
    setEditStatus(rec.status);
  };

  const handleSaveStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;

    await availabilityService.updateStock(
      editingRecord.pharmacyId,
      editingRecord.medicineId,
      editQuantity,
      editStatus
    );

    setEditingRecord(null);
    loadRecords();
  };

  const filteredRecords = records.filter(r =>
    r.pharmacyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.medicineName.toLowerCase().includes(searchQuery.toLowerCase())
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
              <CheckSquare size={18} className="text-emerald-400" />
              Medicine Stock & Availability Management
            </h1>
          </div>
        </header>

        <main className="p-4 sm:p-8 space-y-6 overflow-y-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pharmacy or medicine..."
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <button
              onClick={loadRecords}
              className="px-3.5 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw size={14} /> Refresh Stock Matrix
            </button>
          </div>

          {loading ? (
            <LoadingSpinner label="Loading availability database..." size="lg" />
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-4 px-5">Pharmacy Branch</th>
                      <th className="py-4 px-5">Medicine Name</th>
                      <th className="py-4 px-5 text-center">Stock Quantity</th>
                      <th className="py-4 px-5 text-center">Availability Status</th>
                      <th className="py-4 px-5 text-right">Last Updated</th>
                      <th className="py-4 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredRecords.map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 px-5 font-bold text-white flex items-center gap-2">
                          <Building2 size={16} className="text-teal-400 shrink-0" />
                          <span>{rec.pharmacyName}</span>
                        </td>
                        <td className="py-4 px-5 text-slate-200 font-semibold">{rec.medicineName}</td>
                        <td className="py-4 px-5 text-center font-extrabold text-white text-sm">
                          {rec.quantity} units
                        </td>
                        <td className="py-4 px-5 text-center">
                          <AvailabilityBadge status={rec.status} size="sm" />
                        </td>
                        <td className="py-4 px-5 text-right text-slate-400">{rec.lastUpdated}</td>
                        <td className="py-4 px-5 text-right">
                          <button
                            onClick={() => handleOpenEdit(rec)}
                            className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 rounded-lg text-xs font-semibold flex items-center gap-1 ml-auto transition-colors"
                          >
                            <Edit3 size={13} />
                            Update Stock
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
        isOpen={!!editingRecord}
        onClose={() => setEditingRecord(null)}
        title="Update Pharmacy Medicine Stock"
        maxWidth="md"
      >
        <form onSubmit={handleSaveStock} className="space-y-4 text-slate-900">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
            <p><span className="font-bold text-slate-500">Pharmacy:</span> <strong className="text-slate-900">{editingRecord?.pharmacyName}</strong></p>
            <p><span className="font-bold text-slate-500">Medicine:</span> <strong className="text-slate-900">{editingRecord?.medicineName}</strong></p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">In-Stock Quantity (Units)</label>
            <input
              type="number"
              min="0"
              value={editQuantity}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0;
                setEditQuantity(val);
                if (val === 0) setEditStatus('OUT OF STOCK');
                else if (val < 15) setEditStatus('LOW STOCK');
                else setEditStatus('AVAILABLE');
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Availability Status</label>
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value as AvailabilityStatus)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
            >
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="LOW STOCK">LOW STOCK</option>
              <option value="OUT OF STOCK">OUT OF STOCK</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setEditingRecord(null)}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
            >
              <Save size={14} />
              Save Availability
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
