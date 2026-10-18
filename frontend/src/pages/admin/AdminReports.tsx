import React, { useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { StatCard } from '../../components/StatCard';
import {
  mockDashboardStats,
  mockCategoryStats,
  mockUserGrowth
} from '../../data/admin';
import { initialMedicines } from '../../data/medicines';
import {
  BarChart3,
  Download,
  Menu,
  Pill,
  Building2,
  Users,
  AlertTriangle,
  XCircle,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts';

export const AdminReports: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [exportNotice, setExportNotice] = useState('');

  const lowStockMeds = initialMedicines.filter(m => m.availabilityStatus === 'LOW STOCK');
  const outOfStockMeds = initialMedicines.filter(m => m.availabilityStatus === 'OUT OF STOCK');

  const handleExportReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      summaryStats: mockDashboardStats,
      lowStockItems: lowStockMeds.map(m => m.name),
      outOfStockItems: outOfStockMeds.map(m => m.name)
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MediFind_System_Report_${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    setExportNotice('System analytical report exported successfully!');
    setTimeout(() => setExportNotice(''), 4000);
  };

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
              <BarChart3 size={18} className="text-emerald-400" />
              Reports & System Analytics
            </h1>
          </div>

          <button
            onClick={handleExportReport}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2"
          >
            <Download size={16} />
            Export Report
          </button>
        </header>

        <main className="p-4 sm:p-8 space-y-8 overflow-y-auto">
          {exportNotice && (
            <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-400" />
              <span>{exportNotice}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <StatCard title="Total Medicines" value={mockDashboardStats.totalMedicines} icon={Pill} color="blue" />
            <StatCard title="Total Pharmacies" value={mockDashboardStats.totalPharmacies} icon={Building2} color="emerald" />
            <StatCard title="Total Users" value={mockDashboardStats.totalUsers} icon={Users} color="indigo" />
            <StatCard title="Available Stock" value={mockDashboardStats.availableMedicines} icon={CheckCircle2} color="emerald" />
            <StatCard title="Low Stock Items" value={mockDashboardStats.lowStockMedicines} icon={AlertTriangle} color="amber" />
            <StatCard title="Out of Stock" value={mockDashboardStats.outOfStockMedicines} icon={XCircle} color="rose" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-lg space-y-4">
              <h3 className="text-sm font-bold text-white">User Registration Statistics</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockUserGrowth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '12px', color: '#fff' }} />
                    <Line type="monotone" dataKey="users" stroke="#a855f7" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-lg space-y-4">
              <h3 className="text-sm font-bold text-white">Therapeutic Category Breakdown</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockCategoryStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="category" stroke="#64748b" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '12px', color: '#fff' }} />
                    <Bar dataKey="count" fill="#0d9488" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <AlertTriangle size={16} />
                Low Stock Medicine Alerts ({lowStockMeds.length})
              </h3>
              <div className="space-y-2">
                {lowStockMeds.map(m => (
                  <div key={m.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white block">{m.name}</span>
                      <span className="text-slate-400">{m.category}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                      {m.stockCount} units left
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
              <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
                <XCircle size={16} />
                Out of Stock Medicine Alerts ({outOfStockMeds.length})
              </h3>
              <div className="space-y-2">
                {outOfStockMeds.map(m => (
                  <div key={m.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white block">{m.name}</span>
                      <span className="text-slate-400">{m.manufacturer}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
                      0 units
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
