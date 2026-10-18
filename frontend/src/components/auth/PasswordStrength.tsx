import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthProps {
  password: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  if (!password) return null;

  const checks = [
    { label: 'At least 8 characters', valid: password.length >= 8 },
    { label: 'One uppercase letter (A-Z)', valid: /[A-Z]/.test(password) },
    { label: 'One lowercase letter (a-z)', valid: /[a-z]/.test(password) },
    { label: 'One number (0-9)', valid: /\d/.test(password) },
    { label: 'One special character (!@#$%^&*)', valid: /[@$!%*?&]/.test(password) }
  ];

  const score = checks.filter(c => c.valid).length;

  const getStrengthConfig = () => {
    if (score <= 1) return { label: 'Weak', color: 'bg-rose-500', width: '20%', textColor: 'text-rose-600' };
    if (score <= 3) return { label: 'Fair', color: 'bg-amber-500', width: '50%', textColor: 'text-amber-600' };
    if (score === 4) return { label: 'Good', color: 'bg-emerald-500', width: '80%', textColor: 'text-emerald-600' };
    return { label: 'Strong', color: 'bg-teal-600', width: '100%', textColor: 'text-teal-600' };
  };

  const strength = getStrengthConfig();

  return (
    <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
      <div className="flex items-center justify-between font-semibold">
        <span className="text-slate-600">Password Security Strength</span>
        <span className={strength.textColor}>{strength.label}</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${strength.color}`}
          style={{ width: strength.width }}
        />
      </div>

      {/* Requirement Rules Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
        {checks.map((check, idx) => (
          <div key={idx} className="flex items-center gap-1.5">
            {check.valid ? (
              <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            ) : (
              <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            )}
            <span className={check.valid ? 'text-slate-800 font-medium' : 'text-slate-500'}>
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
