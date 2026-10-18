import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GoogleLoginButton } from './GoogleLoginButton';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { authService } from '../../services/authService';

export const LoginForm: React.FC = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showResend, setShowResend] = useState(false);
  const [resendSending, setResendSending] = useState(false);
  const [resendStatus, setResendStatus] = useState('');

  // Target location to redirect after login
  const fromPath = (location.state as any)?.from?.pathname || '/dashboard';

  const validateForm = (): boolean => {
    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return false;
    }

    const emailPattern = /^[\w\.-]+@[\w\.-]+\.\w+$/;
    if (!emailPattern.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setShowResend(false);

    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await loginUser(email.trim(), password, rememberMe);
      if (res.success) {
        setSuccessMessage('Login successful! Redirecting...');
        setTimeout(() => {
          navigate(fromPath, { replace: true });
        }, 600);
      } else {
        const msg = res.message || 'Invalid email or password.';
        setErrorMessage(msg);
        if (msg.toLowerCase().includes('verify your email')) {
          setShowResend(true);
        }
      }
    } catch (err: any) {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendClick = async () => {
    setResendSending(true);
    setResendStatus('');
    try {
      const res = await authService.resendVerification(email.trim());
      setResendStatus(res.message);
    } catch {
      setResendStatus('Failed to send verification email.');
    } finally {
      setResendSending(false);
    }
  };

  const handleGoogleSuccess = () => {
    setSuccessMessage('Google authentication successful! Redirecting...');
    setTimeout(() => {
      navigate(fromPath, { replace: true });
    }, 600);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white border border-slate-200/80 rounded-2xl shadow-xl p-8 backdrop-blur-sm">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome back</h2>
        <p className="text-slate-500 text-sm mt-1">
          Access your MediPlus patient portal & medicine finder
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">{errorMessage}</p>
            {showResend && (
              <div className="mt-2 pt-2 border-t border-rose-200/80">
                <button
                  type="button"
                  onClick={handleResendClick}
                  disabled={resendSending}
                  className="text-xs text-rose-800 hover:text-rose-950 font-bold underline cursor-pointer"
                >
                  {resendSending ? 'Sending email...' : 'Resend Verification Email'}
                </button>
                {resendStatus && <p className="text-xs text-slate-700 mt-1">{resendStatus}</p>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Success Alert */}
      {successMessage && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="font-medium">{successMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Email Address */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all placeholder:text-slate-400"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all placeholder:text-slate-400"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember Me */}
        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded cursor-pointer"
          />
          <label htmlFor="remember-me" className="ml-2.5 block text-xs font-medium text-slate-700 cursor-pointer">
            Remember me on this device
          </label>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold py-3.5 px-4 rounded-xl shadow-md hover:shadow-teal-600/20 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-sm"
        >
          {loading ? (
            <span>Signing in...</span>
          ) : (
            <>
              <span>Sign In to MediPlus</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">
            OR
          </span>
        </div>
      </div>

      {/* Google Login */}
      <GoogleLoginButton
        onSuccessRedirect={handleGoogleSuccess}
        onError={(msg) => setErrorMessage(msg)}
        text="Continue with Google"
      />

      {/* Footer Register Prompt */}
      <div className="mt-8 text-center text-xs text-slate-500">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-bold text-teal-600 hover:text-teal-700 transition-colors">
          Create account now
        </Link>
      </div>
    </div>
  );
};
