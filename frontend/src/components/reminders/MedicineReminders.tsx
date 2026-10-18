import React, { useState, useEffect } from 'react';
import { Bell, Plus, Clock, Calendar, CheckCircle2, AlertTriangle, Trash2, Power, Loader2, Pill } from 'lucide-react';
import type { MedicineReminder, ReminderFrequency, Medicine } from '../../types';
import { reminderService, medicineService } from '../../services/api';

export const MedicineReminders: React.FC = () => {
  const [reminders, setReminders] = useState<MedicineReminder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [availableMedicines, setAvailableMedicines] = useState<Medicine[]>([]);
  const [formData, setFormData] = useState({
    medicineId: '',
    medicineName: '',
    dosage: '1 Tablet',
    frequency: 'Once Daily' as ReminderFrequency,
    reminderTime: '08:00',
    startDate: new Date().toISOString().split('T')[0],
    endDate: ''
  });

  const [warningMsg, setWarningMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadReminders = async () => {
    setLoading(true);
    try {
      const data = await reminderService.getReminders();
      setReminders(data);
    } catch (err) {
      console.error('Failed to load reminders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReminders();
    medicineService.getAll().then(setAvailableMedicines);
  }, []);

  const handleMedicineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const medId = e.target.value;
    if (!medId) {
      setFormData(prev => ({ ...prev, medicineId: '', medicineName: '' }));
      return;
    }
    const found = availableMedicines.find(m => m.id === medId);
    if (found) {
      setFormData(prev => ({
        ...prev,
        medicineId: found.id,
        medicineName: `${found.name} ${found.strength}`
      }));
    }
  };

  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setWarningMsg(null);
    setSuccessMsg(null);

    if (!formData.medicineName.trim()) {
      setErrorMsg('Please select or type a medicine name.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await reminderService.createReminder({
        medicineId: formData.medicineId || `med-custom-${Date.now()}`,
        medicineName: formData.medicineName.trim(),
        dosage: formData.dosage,
        frequency: formData.frequency,
        reminderTime: formData.reminderTime,
        startDate: formData.startDate,
        endDate: formData.endDate || undefined,
        isActive: true
      });

      if (res.success) {
        setSuccessMsg('Medicine refill reminder created!');
        if (res.warning) {
          setWarningMsg(res.warning);
        }
        setModalOpen(false);
        setFormData({
          medicineId: '',
          medicineName: '',
          dosage: '1 Tablet',
          frequency: 'Once Daily',
          reminderTime: '08:00',
          startDate: new Date().toISOString().split('T')[0],
          endDate: ''
        });
        await loadReminders();
      } else {
        setErrorMsg(res.message || 'Failed to create reminder.');
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Error creating reminder.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const ok = await reminderService.updateReminder(id, { isActive: !currentStatus });
    if (ok) {
      setReminders(prev => prev.map(r => r.id === id ? { ...r, isActive: !currentStatus } : r));
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await reminderService.deleteReminder(id);
    if (ok) {
      setReminders(prev => prev.filter(r => r.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
            <Bell size={20} />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Medicine Refill Reminders
            </h2>
            <p className="text-xs text-slate-500">
              Schedule automated dosage and refill notifications for your daily medications.
            </p>
          </div>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus size={16} />
          Add Reminder
        </button>
      </div>

      {/* Duplicate Active Ingredient Warning Alert */}
      {warningMsg && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-600 shrink-0" />
            <span>{warningMsg}</span>
          </div>
          <button onClick={() => setWarningMsg(null)} className="text-xs font-bold text-amber-700 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Success Alert */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Reminders List */}
      {loading ? (
        <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <Loader2 size={16} className="animate-spin text-sky-600" />
          Loading your reminders...
        </div>
      ) : reminders.length === 0 ? (
        <div className="py-10 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
          <Bell size={32} className="mx-auto text-slate-300 mb-2" />
          <p className="text-xs font-bold text-slate-600">No active medication reminders</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Click "Add Reminder" to set up your dose schedule.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reminders.map((r) => (
            <div
              key={r.id}
              className={`p-5 rounded-2xl border transition-all ${
                r.isActive
                  ? 'bg-white border-slate-200/80 shadow-2xs hover:border-sky-300'
                  : 'bg-slate-50/70 border-slate-200/50 opacity-70'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
                    <Pill size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">{r.medicineName}</h4>
                    <span className="text-[11px] font-semibold text-sky-700">{r.dosage}</span>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                    r.isActive
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                >
                  {r.isActive ? 'Active' : 'Paused'}
                </span>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Clock size={14} className="text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-800">{r.reminderTime}</span>
                  <span className="text-[11px] text-slate-500">({r.frequency})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-slate-400 shrink-0" />
                  <span className="text-[11px] text-slate-500">From {r.startDate}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => handleToggleActive(r.id, r.isActive)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                    r.isActive
                      ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  <Power size={13} />
                  {r.isActive ? 'Pause' : 'Activate'}
                </button>

                <button
                  onClick={() => handleDelete(r.id)}
                  className="px-3 py-1.5 rounded-xl font-bold text-rose-600 hover:text-rose-800 hover:bg-rose-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 size={13} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Creating Reminder */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2">
              <Bell size={20} className="text-sky-600" />
              Set Medicine Reminder
            </h3>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateReminder} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Select Medicine
                </label>
                <select
                  onChange={handleMedicineChange}
                  value={formData.medicineId}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                >
                  <option value="">-- Choose from Database or Type Below --</option>
                  {availableMedicines.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.strength}) - {m.genericName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Medicine Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.medicineName}
                  onChange={(e) => setFormData({ ...formData, medicineName: e.target.value })}
                  placeholder="e.g. Paracetamol 500 mg"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Dosage
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                    placeholder="e.g. 1 Tablet"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Frequency
                  </label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value as ReminderFrequency })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                  >
                    <option value="Once Daily">Once Daily</option>
                    <option value="Twice Daily">Twice Daily</option>
                    <option value="Every 8 Hours">Every 8 Hours</option>
                    <option value="Every 12 Hours">Every 12 Hours</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Reminder Time
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.reminderTime}
                    onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer disabled:opacity-60"
                >
                  {submitting ? 'Saving...' : 'Save Reminder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineReminders;
