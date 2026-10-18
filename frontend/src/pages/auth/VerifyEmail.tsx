import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { ShieldCheck, CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

export const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [message, setMessage] = useState('');

  const [resendEmail, setResendEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendStatus, setResendStatus] = useState('');

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setVerified(false);
      setMessage('No verification token provided in URL.');
      return;
    }

    const verify = async () => {
      try {
        const res = await authService.verifyEmail(token);
        if (res.success) {
          setVerified(true);
          setMessage(res.message || 'Email verified successfully! You can now log in.');
        } else {
          setVerified(false);
          setMessage(res.message || 'Verification token is invalid or has expired.');
        }
      } catch {
        setVerified(false);
        setMessage('Failed to verify token with server.');
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail.trim()) return;

    setResendLoading(true);
    setResendStatus('');
    try {
      const res = await authService.resendVerification(resendEmail.trim());
      setResendStatus(res.message);
    } catch {
      setResendStatus('Failed to send verification email.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-teal-50/20 to-cyan-50/30">
      <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-2xl shadow-xl p-8 backdrop-blur-sm text-center">
        <div className="inline-flex items-center justify-center p-3.5 bg-teal-600 text-white rounded-2xl shadow-lg shadow-teal-600/30 mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
          Email Verification
        </h2>

        {loading ? (
          <div className="py-8 space-y-3">
            <Loader2 className="w-8 h-8 text-teal-600 animate-spin mx-auto" />
            <p className="text-slate-500 text-sm">Verifying your email token with MediPlus...</p>
          </div>
        ) : verified ? (
          <div className="py-4 space-y-6">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center justify-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <span className="font-semibold text-left">{message}</span>
            </div>

            <button
              onClick={() => navigate('/login', { state: { infoMessage: 'Email verified successfully! Please log in.' } })}
              className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all cursor-pointer text-sm"
            >
              <span>Proceed to Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="py-4 space-y-6">
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm flex items-center justify-center gap-3">
              <AlertCircle className="w-6 h-6 text-rose-500 shrink-0" />
              <span className="font-medium text-left">{message}</span>
            </div>

            {/* Resend Verification Form */}
            <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl text-left space-y-3">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Need a new verification link?
              </p>
              <form onSubmit={handleResend} className="space-y-2">
                <input
                  type="email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-teal-600"
                  required
                />
                <button
                  type="submit"
                  disabled={resendLoading}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 px-3 rounded-lg text-xs transition-all cursor-pointer disabled:opacity-60"
                >
                  {resendLoading ? 'Sending...' : 'Resend Verification Email'}
                </button>
              </form>
              {resendStatus && <p className="text-xs text-teal-700 mt-1 font-medium">{resendStatus}</p>}
            </div>

            <Link
              to="/login"
              className="inline-block text-xs font-bold text-slate-600 hover:text-teal-600 transition-colors"
            >
              Back to Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
