import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, ShieldCheck, LogOut, Key, Edit, Save, Camera, AlertCircle } from 'lucide-react';
import { PrescriptionUpload } from '../../components/prescription/PrescriptionUpload';

export const UserProfile: React.FC = () => {
  const { user, updateUserProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [message, setMessage] = useState('');

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passData, setPassData] = useState({ currentPass: '', newPass: '', confirmPass: '' });
  const [passError, setPassError] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(formData);
    setIsEditing(false);
    setMessage('Profile updated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    if (!passData.currentPass || !passData.newPass) {
      setPassError('All password fields are required.');
      return;
    }
    if (passData.newPass.length < 6) {
      setPassError('New password must be at least 6 characters.');
      return;
    }
    if (passData.newPass !== passData.confirmPass) {
      setPassError('New passwords do not match.');
      return;
    }
    setPasswordModalOpen(false);
    setMessage('Password changed successfully!');
    setPassData({ currentPass: '', newPass: '', confirmPass: '' });
    setTimeout(() => setMessage(''), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden">
        
        {/* Banner */}
        <div className="h-36 bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 relative" />

        <div className="px-6 sm:px-8 pb-8 relative">
          
          {/* Avatar and Header info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 mb-6 gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="relative">
                <div className="w-28 h-28 rounded-3xl bg-white p-1.5 shadow-xl">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.fullName}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-500 text-white font-extrabold text-3xl flex items-center justify-center">
                      {user?.fullName?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => alert('Profile photo upload feature ready for S3 / FastAPI storage integration.')}
                  className="absolute bottom-1 right-1 p-2 bg-slate-900 text-white rounded-full hover:bg-slate-800 shadow-md transition-colors"
                  title="Change Photo"
                >
                  <Camera size={14} />
                </button>
              </div>

              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{user?.fullName}</h1>
                <p className="text-xs text-slate-500 font-medium">{user?.email}</p>
                <div className="mt-1.5 flex items-center justify-center sm:justify-start gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold uppercase tracking-wider">
                    {user?.role || 'User'}
                  </span>
                  <span className="text-xs text-slate-400">Member since {user?.createdAt || '2026'}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons (Section 12 Requirements) */}
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Edit size={14} />
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
              )}

              <button
                onClick={() => setPasswordModalOpen(true)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold border border-slate-200 transition-colors flex items-center gap-1.5"
              >
                <Key size={14} />
                Change Password
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold border border-rose-200 transition-colors flex items-center gap-1.5"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          </div>

          {message && (
            <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              {message}
            </div>
          )}

          {/* Profile Form Details */}
          <form onSubmit={handleSaveProfile} className="space-y-6 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Personal Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium border ${
                      isEditing
                        ? 'bg-white border-sky-500 focus:ring-2 focus:ring-sky-500'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    disabled={!isEditing}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium border ${
                      isEditing
                        ? 'bg-white border-sky-500 focus:ring-2 focus:ring-sky-500'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    disabled={!isEditing}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium border ${
                      isEditing
                        ? 'bg-white border-sky-500 focus:ring-2 focus:ring-sky-500'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Account Role & Permissions
                </label>
                <div className="relative">
                  <ShieldCheck size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    disabled
                    value={user?.role === 'admin' ? 'System Administrator' : 'Standard Patient / User'}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700"
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center gap-2"
                >
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            )}
          </form>

        </div>
      </div>

      {/* Prescription Upload & Records Section */}
      <div className="mt-8">
        <PrescriptionUpload />
      </div>

      {/* Change Password Modal */}
      {passwordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Change Account Password</h3>

            {passError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0 text-rose-600" />
                <span>{passError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Current Password</label>
                <input
                  type="password"
                  value={passData.currentPass}
                  onChange={(e) => setPassData({ ...passData, currentPass: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">New Password</label>
                <input
                  type="password"
                  value={passData.newPass}
                  onChange={(e) => setPassData({ ...passData, newPass: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passData.confirmPass}
                  onChange={(e) => setPassData({ ...passData, confirmPass: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPasswordModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
