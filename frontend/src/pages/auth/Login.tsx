import React from 'react';
import { LoginForm } from '../../components/auth/LoginForm';
import { Pill, ShieldCheck, HeartPulse, Activity } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export const Login: React.FC = () => {
  const location = useLocation();
  const infoMessage = (location.state as any)?.infoMessage;

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-teal-50/20 to-cyan-50/30">
      {/* MediPlus Header Branding */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center p-3 bg-teal-600 text-white rounded-2xl shadow-lg shadow-teal-600/30 mb-3">
          <Pill className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
          <span>MediPlus</span>
          <span className="text-xs bg-teal-100 text-teal-800 font-bold px-2.5 py-1 rounded-full border border-teal-200">
            Healthcare SaaS
          </span>
        </h1>
        <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
          Smart Medicine Finder, Real-time Stock Tracking & Verified Pharmacy Locator
        </p>
      </div>

      {/* Optional Info Banner (e.g., from registration redirect) */}
      {infoMessage && (
        <div className="max-w-md w-full mb-6 p-4 bg-teal-50 border border-teal-200 rounded-xl text-teal-800 text-xs font-semibold flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0" />
          <span>{infoMessage}</span>
        </div>
      )}

      {/* Render LoginForm Component */}
      <LoginForm />

      {/* Trust Badges */}
      <div className="mt-8 flex items-center justify-center gap-6 text-slate-400 text-xs">
        <span className="flex items-center gap-1.5 font-medium">
          <ShieldCheck className="w-4 h-4 text-teal-600" /> 256-Bit SSL Encrypted
        </span>
        <span className="flex items-center gap-1.5 font-medium">
          <HeartPulse className="w-4 h-4 text-teal-600" /> HIPAA Compliant Data
        </span>
        <span className="flex items-center gap-1.5 font-medium">
          <Activity className="w-4 h-4 text-teal-600" /> 24/7 Verified System
        </span>
      </div>
    </div>
  );
};
