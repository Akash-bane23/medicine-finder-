import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { ResetPassword } from './pages/auth/ResetPassword';
import { VerifyEmail } from './pages/auth/VerifyEmail';
import { AdminLogin } from './pages/auth/AdminLogin';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { MedicineList } from './pages/medicines/MedicineList';
import { MedicineDetail } from './pages/medicines/MedicineDetail';
import { PharmacyDetail } from './pages/pharmacies/PharmacyDetail';
import { NearbyPharmacies } from './pages/NearbyPharmacies';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminMedicines } from './pages/admin/AdminMedicines';
import { AdminPharmacies } from './pages/admin/AdminPharmacies';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminAvailability } from './pages/admin/AdminAvailability';
import { AdminReports } from './pages/admin/AdminReports';
import { AdminSettings } from './pages/admin/AdminSettings';

// Root route component: Shows Login page if not authenticated, Home if authenticated
const RootRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Home /> : <Login />;
};

// Main layout component
const MainLayout: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthRoute = ['/', '/login', '/register', '/admin/login', '/forgot-password', '/reset-password', '/verify-email'].includes(location.pathname) && !user;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {!isAdminRoute && <Navbar />}
      
      <div className="flex-1">
        <Routes>
          {/* Default Entry Route */}
          <Route path="/" element={<RootRoute />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />

          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* User Portal Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/prescriptions"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Medicine & Pharmacy Finder Routes */}
          <Route
            path="/nearby-pharmacies"
            element={
              <ProtectedRoute>
                <NearbyPharmacies />
              </ProtectedRoute>
            }
          />
          <Route
            path="/medicines"
            element={
              <ProtectedRoute>
                <MedicineList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/medicines/:id"
            element={
              <ProtectedRoute>
                <MedicineDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pharmacies"
            element={
              <ProtectedRoute>
                <NearbyPharmacies />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pharmacies/:id"
            element={
              <ProtectedRoute>
                <PharmacyDetail />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/medicines"
            element={
              <AdminRoute>
                <AdminMedicines />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/pharmacies"
            element={
              <AdminRoute>
                <AdminPharmacies />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/availability"
            element={
              <AdminRoute>
                <AdminAvailability />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <AdminRoute>
                <AdminReports />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <AdminRoute>
                <AdminSettings />
              </AdminRoute>
            }
          />

          {/* Catch-all Fallback */}
          <Route path="*" element={<RootRoute />} />
        </Routes>
      </div>

      {!isAdminRoute && !isAuthRoute && (
        <footer className="bg-slate-900 text-slate-400 py-10 border-t border-slate-800 text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-white font-extrabold text-base">
              <span>MediPlus System</span>
              <span className="text-[10px] text-teal-400 font-medium bg-teal-950 px-2 py-0.5 rounded border border-teal-800">
                Healthcare SaaS
              </span>
            </div>
            <p className="text-slate-400 text-center md:text-left">
              © {new Date().getFullYear()} MediPlus. Medicine Finder & Pharmacy Availability Platform.
            </p>
            <div className="flex items-center gap-4">
              <a href="/medicines" className="hover:text-white transition-colors">Medicines</a>
              <a href="/nearby-pharmacies" className="hover:text-white transition-colors">Nearby Pharmacies</a>
              <a href="/admin/login" className="text-teal-400 hover:text-teal-300 transition-colors font-semibold">Admin Portal</a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <Router>
        <MainLayout />
      </Router>
    </AuthProvider>
  );
}

export default App;
