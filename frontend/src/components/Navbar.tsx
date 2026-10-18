import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Pill, MapPin, ShieldCheck, LogOut, Menu, X, LayoutDashboard, HeartPulse } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <Link to={user ? "/home" : "/login"} className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform duration-200">
              <HeartPulse size={24} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-sky-700 via-teal-700 to-emerald-700 bg-clip-text text-transparent">
                MediFind
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 -mt-1">
                Pharmacy & Info
              </span>
            </div>
          </Link>

          {/* Show Navigation links ONLY when user is logged in */}
          {user && (
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              <Link
                to="/home"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/home') || isActive('/') ? 'bg-sky-50 text-sky-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                Home
              </Link>
              <Link
                to="/medicines"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/medicines') ? 'bg-sky-50 text-sky-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Pill size={16} className="text-sky-600" />
                Medicines
              </Link>
              <Link
                to="/nearby-pharmacies"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/nearby-pharmacies') || isActive('/pharmacies') ? 'bg-sky-50 text-sky-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <MapPin size={16} className="text-teal-600" />
                Nearby Pharmacies
              </Link>
            </nav>
          )}

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {role === 'admin' ? (
                  <Link
                    to="/admin/dashboard"
                    className="px-3.5 py-2 rounded-lg text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <ShieldCheck size={16} className="text-emerald-400" />
                    Admin Portal
                  </Link>
                ) : (
                  <Link
                    to="/user/dashboard"
                    className="px-3.5 py-2 rounded-lg text-sm font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 transition-colors flex items-center gap-1.5"
                  >
                    <LayoutDashboard size={16} />
                    My Dashboard
                  </Link>
                )}

                <Link
                  to="/user/profile"
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-700 font-semibold transition-colors"
                  title={user.fullName}
                >
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 shadow-sm shadow-sky-600/20 transition-all"
                >
                  Register
                </Link>

                <div className="h-4 w-px bg-slate-200 mx-1" />

                <Link
                  to="/admin/login"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors flex items-center gap-1"
                >
                  <ShieldCheck size={14} className="text-slate-600" />
                  Admin Login
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
          {user && (
            <>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                Home
              </Link>
              <Link
                to="/medicines"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                Medicines
              </Link>
              <Link
                to="/nearby-pharmacies"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
              >
                Nearby Pharmacies
              </Link>
            </>
          )}

          <div className="pt-3 border-t border-slate-200 space-y-2">
            {user ? (
              <>
                <Link
                  to="/user/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-sky-700 bg-sky-50"
                >
                  Dashboard
                </Link>
                <Link
                  to="/user/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
                >
                  Profile ({user.fullName})
                </Link>
                {role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-slate-900 bg-slate-100"
                  >
                    Admin Portal
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-rose-600 hover:bg-rose-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="space-y-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2 rounded-lg text-base font-medium text-slate-700 border border-slate-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2 rounded-lg text-base font-medium text-white bg-sky-600"
                >
                  Register
                </Link>
                <Link
                  to="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2 rounded-lg text-xs font-semibold text-slate-800 bg-slate-100 border border-slate-200"
                >
                  Admin Portal Login
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
