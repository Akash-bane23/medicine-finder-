import React from 'react';
import { RegisterForm } from '../../components/auth/RegisterForm';
import { Pill, ShieldCheck, UserCheck } from 'lucide-react';

export const Register: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-teal-50/20 to-cyan-50/30">
      {/* MediPlus Branding */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center p-3 bg-teal-600 text-white rounded-2xl shadow-lg shadow-teal-600/30 mb-3">
          <Pill className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
          <span>MediPlus</span>
          <span className="text-xs bg-teal-100 text-teal-800 font-bold px-2.5 py-1 rounded-full border border-teal-200">
            Registration
          </span>
        </h1>
        <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
          Create your account for personalized medicine availability & pharmacy search
        </p>
      </div>

      {/* RegisterForm Component */}
      <RegisterForm />

      {/* Badges */}
      <div className="mt-8 flex items-center justify-center gap-6 text-slate-400 text-xs">
        <span className="flex items-center gap-1.5 font-medium">
          <ShieldCheck className="w-4 h-4 text-teal-600" /> Password Hashing Security
        </span>
        <span className="flex items-center gap-1.5 font-medium">
          <UserCheck className="w-4 h-4 text-teal-600" /> Instant Email Verification
        </span>
      </div>
    </div>
  );
};
