import React, { useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import {
  Settings,
  User,
  Lock,
  Bell,
  Menu,
  Save,
  CheckCircle2,
  Shield,
  Server
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, updateUserProfile } = useAuth();

  const [adminName, setAdminName] = useState(user?.fullName || 'System Administrator');
  const [adminEmail, setAdminEmail] = useState(user?.email || 'admin@medifind.com');
  
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const [notifications, setNotifications] = useState({
    lowStockAlerts: true,
    userRegistrationAlerts: true,
    pharmacyStatusAlerts: true
  });

  const [apiBaseUrl, setApiBaseUrl] = useState('http://localhost:8000/api/v1');

  const [savedNotice, setSavedNotice] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ fullName: adminName, email: adminEmail });
    setSavedNotice('Admin profile settings updated!');
    setTimeout(() => setSavedNotice(''), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPass || newPass !== confirmPass) {
      alert('Passwords do not match.');
      return;
    }
    setSavedNotice('Admin password updated successfully!');
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    setTimeout(() => setSavedNotice(''), 3000);
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
              <Settings size={18} className="text-emerald-400" />
              Admin Portal Settings
            </h1>
          </div>
        </header>

        <main className="p-4 sm:p-8 space-y-8 max-w-4xl overflow-y-auto">
          {savedNotice && (
            <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-400" />
              <span>{savedNotice}</span>
            </div>
          )}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <User size={18} className="text-emerald-400" />
              Admin Profile Settings
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Admin Name
                  </label>
                  <input
                    type="text"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Save size={14} /> Save Profile
                </button>
              </div>
            </form>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <Shield size={18} className="text-emerald-400" />
              Security & Admin Password
            </h3>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Lock size={14} /> Update Password
                </button>
              </div>
            </form>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <Bell size={18} className="text-emerald-400" />
              Application & System Notification Settings
            </h3>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <div>
                  <span className="font-bold text-white block">Low Stock System Alerts</span>
                  <span className="text-slate-400">Receive notifications when pharmacy medicine inventory drops below 15 units.</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.lowStockAlerts}
                  onChange={(e) => setNotifications({ ...notifications, lowStockAlerts: e.target.checked })}
                  className="w-4 h-4 text-emerald-500 rounded bg-slate-900"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <div>
                  <span className="font-bold text-white block">User Registration Alerts</span>
                  <span className="text-slate-400">Get notified when new patients register on the portal.</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.userRegistrationAlerts}
                  onChange={(e) => setNotifications({ ...notifications, userRegistrationAlerts: e.target.checked })}
                  className="w-4 h-4 text-emerald-500 rounded bg-slate-900"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <div>
                  <span className="font-bold text-white block">Pharmacy Operational Status Updates</span>
                  <span className="text-slate-400">Track when chemists update their opening or closing hours.</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.pharmacyStatusAlerts}
                  onChange={(e) => setNotifications({ ...notifications, pharmacyStatusAlerts: e.target.checked })}
                  className="w-4 h-4 text-emerald-500 rounded bg-slate-900"
                />
              </label>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Server size={14} className="text-teal-400" />
                FastAPI Backend URL Endpoint Config
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={apiBaseUrl}
                  onChange={(e) => setApiBaseUrl(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-mono"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSavedNotice('API base URL updated for FastAPI backend!');
                    setTimeout(() => setSavedNotice(''), 3000);
                  }}
                  className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold"
                >
                  Save API Config
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
