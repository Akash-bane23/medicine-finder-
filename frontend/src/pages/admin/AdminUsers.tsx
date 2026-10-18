import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { userService } from '../../services/api';
import type { User } from '../../types';
import { Modal } from '../../components/Modal';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import {
  Users,
  Search,
  Menu,
  Trash2,
  AlertTriangle
} from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    const data = await userService.getAll();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleBlock = async (user: User) => {
    const newStatus = user.status === 'blocked' ? 'active' : 'blocked';
    await userService.updateStatus(user.id, newStatus);
    loadUsers();
  };

  const handleDeleteUser = async () => {
    if (deletingUser) {
      await userService.delete(deletingUser.id);
      setDeletingUser(null);
      loadUsers();
    }
  };

  const filteredUsers = users.filter(u => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = u.fullName.toLowerCase().includes(q);
      const matchEmail = u.email.toLowerCase().includes(q);
      const matchPhone = u.phone.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchPhone) return false;
    }

    if (statusFilter !== 'all' && u.status !== statusFilter) return false;

    return true;
  });

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
              <Users size={18} className="text-purple-400" />
              User Account Management
            </h1>
          </div>
        </header>

        <main className="p-4 sm:p-8 space-y-6 overflow-y-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-72">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search user name or email..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="blocked">Blocked Only</option>
              </select>
            </div>

            <div className="text-xs text-slate-400 font-medium">
              Registered Accounts: <strong className="text-white">{filteredUsers.length}</strong>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner label="Loading user accounts..." size="lg" />
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-4 px-5">User Name</th>
                      <th className="py-4 px-5">Email</th>
                      <th className="py-4 px-5">Phone</th>
                      <th className="py-4 px-5">Registration Date</th>
                      <th className="py-4 px-5 text-center">Status</th>
                      <th className="py-4 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 px-5 font-bold text-white flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center border border-purple-500/30 shrink-0">
                            {u.fullName.charAt(0)}
                          </div>
                          <span>{u.fullName}</span>
                        </td>
                        <td className="py-4 px-5 text-slate-300">{u.email}</td>
                        <td className="py-4 px-5 text-slate-400">{u.phone}</td>
                        <td className="py-4 px-5 text-slate-400">{u.createdAt}</td>
                        <td className="py-4 px-5 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              u.status === 'active'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {u.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-right space-x-2">
                          <button
                            onClick={() => handleToggleBlock(u)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                              u.status === 'blocked'
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30'
                            }`}
                          >
                            {u.status === 'blocked' ? 'Unblock' : 'Block'}
                          </button>
                          <button
                            onClick={() => setDeletingUser(u)}
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
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        title="Confirm User Account Deletion"
        maxWidth="sm"
      >
        <div className="space-y-4 text-slate-800">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            <AlertTriangle size={20} className="shrink-0 text-rose-600" />
            <p className="font-bold">Are you sure you want to delete this user account?</p>
          </div>

          <p className="text-xs text-slate-600">
            User <strong className="text-slate-900">{deletingUser?.fullName}</strong> ({deletingUser?.email}) will be removed.
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setDeletingUser(null)}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteUser}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs"
            >
              Delete User
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
