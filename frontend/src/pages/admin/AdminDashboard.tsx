import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { StatCard } from '../../components/StatCard';
import { adminService } from '../../services/api';
import type { DashboardStats, SearchTrend, UserGrowth } from '../../types';
import {
  mockDashboardStats,
  mockSearchTrends,
  mockUserGrowth,
  mockMostSearchedMedicines
} from '../../data/admin';
import {
  Pill,
  Building2,
  Users,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Menu,
  Search,
  Bell,
  TrendingUp,
  BarChart2,
  PieChart as PieIcon
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [stats, setStats] = useState<DashboardStats>(mockDashboardStats);
  const [searchTrends, setSearchTrends] = useState<SearchTrend[]>(mockSearchTrends);
  const [userGrowth, setUserGrowth] = useState<UserGrowth[]>(mockUserGrowth);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const data = await adminService.getDashboardData();
        if (data.stats) setStats(data.stats);
        if (data.searchTrends) setSearchTrends(data.searchTrends);
        if (data.userGrowth) setUserGrowth(data.userGrowth);
      } catch (err) {
        console.error('Failed to fetch admin stats from API:', err);
      }
    };
    fetchAdminStats();
  }, []);

  const dynamicAvailabilityStats = [
    { name: 'Available', value: stats.availableMedicines, color: '#10b981' },
    { name: 'Low Stock', value: stats.lowStockMedicines, color: '#f59e0b' },
    { name: 'Out of Stock', value: stats.outOfStockMedicines, color: '#ef4444' }
  ];

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
            <h1 className="text-lg font-bold text-white tracking-tight">Admin Overview Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search admin portal..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <button className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 relative">
              <Bell size={18} />
              <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-1.5 right-1.5" />
            </button>

            <div className="h-4 w-px bg-slate-800" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold flex items-center justify-center text-xs">
                A
              </div>
              <span className="text-xs font-semibold text-slate-200 hidden sm:inline">Admin User</span>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-8 space-y-8 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <StatCard
              title="Total Medicines"
              value={stats.totalMedicines}
              icon={Pill}
              color="blue"
              change="+12 this month"
            />
            <StatCard
              title="Total Pharmacies"
              value={stats.totalPharmacies}
              icon={Building2}
              color="emerald"
              change="+5 new branches"
            />
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              icon={Users}
              color="indigo"
              change="+18% growth"
            />
            <StatCard
              title="Available Stock"
              value={stats.availableMedicines}
              icon={CheckCircle2}
              color="emerald"
              change={`${stats.totalMedicines ? ((stats.availableMedicines / stats.totalMedicines) * 100).toFixed(1) : 0}% of total`}
            />
            <StatCard
              title="Low Stock"
              value={stats.lowStockMedicines}
              icon={AlertTriangle}
              color="amber"
              change="Requires refill"
              changeType="negative"
            />
            <StatCard
              title="Out of Stock"
              value={stats.outOfStockMedicines}
              icon={XCircle}
              color="rose"
              change="Critical alert"
              changeType="negative"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <TrendingUp size={16} className="text-sky-400" />
                    Medicine Search Trends
                  </h3>
                  <p className="text-[11px] text-slate-400">Monthly patient search volume trajectory</p>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={searchTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" stroke="#64748b" textAnchor="end" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                    />
                    <Line type="monotone" dataKey="searches" stroke="#0284c7" strokeWidth={3} dot={{ r: 4, fill: '#0284c7' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <PieIcon size={16} className="text-emerald-400" />
                    Stock Status Breakdown
                  </h3>
                  <p className="text-[11px] text-slate-400">Inventory availability across active database</p>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dynamicAvailabilityStats}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {dynamicAvailabilityStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Users size={16} className="text-indigo-400" />
                    User Platform Growth
                  </h3>
                  <p className="text-[11px] text-slate-400">Total registered users over past 6 months</p>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                    />
                    <Bar dataKey="users" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <BarChart2 size={16} className="text-amber-400" />
                    Top Searched Medicines
                  </h3>
                  <p className="text-[11px] text-slate-400">High demand items in patient queries</p>
                </div>
              </div>
              <div className="space-y-3 pt-2">
                {mockMostSearchedMedicines.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
                    <span className="text-xs font-medium text-slate-200">{item.name}</span>
                    <span className="text-xs font-bold text-emerald-400">{item.searches.toLocaleString()} searches</span>
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
