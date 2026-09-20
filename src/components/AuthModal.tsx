import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Mail, Lock, User, Sparkles, AlertCircle, ExternalLink } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    authModalOpen, 
    setAuthModalOpen, 
    authMode, 
    setAuthMode, 
    signInWithGoogle, 
    signInWithEmail, 
    signUpWithEmail 
  } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (authMode === 'signup') {
        if (!name.trim()) throw new Error('Please enter your full name');
        if (password.length < 6) throw new Error('Password must be at least 6 characters');
        await signUpWithEmail(email, password, name);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed' || err.message?.includes('operation-not-allowed')) {
        setError('OPERATION_NOT_ALLOWED');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('This email address is already in use. Please sign in instead.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please use at least 6 characters.');
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password. Please check your credentials.');
      } else {
        setError(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      const code = err?.code || '';
      const msg = err?.message || '';
      if (code === 'auth/popup-closed-by-user' || msg.includes('popup-closed-by-user')) {
        setError('POPUP_CLOSED');
      } else if (code === 'auth/popup-blocked' || msg.includes('popup-blocked')) {
        setError('POPUP_BLOCKED');
      } else if (code === 'auth/cancelled-popup-request') {
        setError('');
      } else if (code === 'auth/unauthorized-domain' || msg.includes('unauthorized-domain')) {
        setError('UNAUTHORIZED_DOMAIN');
      } else {
        setError(msg || 'Failed to sign in with Google');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div 
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) setAuthModalOpen(false);
      }}
    >
      <div 
        id="auth-modal-dialog"
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden relative"
      >
        {/* Header decoration */}
        <div className="bg-[#0B192C] px-8 pt-8 pb-6 text-white relative">
          <button
            id="close-auth-modal-btn"
            onClick={() => setAuthModalOpen(false)}
            className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-blue-400 text-xs font-semibold tracking-wider uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>HomeLuxe Real Estate</span>
          </div>

          <h3 className="text-2xl font-bold tracking-tight text-white">
            {authMode === 'signin' ? 'Welcome Back' : 'Create an Account'}
          </h3>
          <p className="text-sm text-slate-300 mt-1">
            {authMode === 'signin' 
              ? 'Sign in to manage your listings and scheduled viewings.' 
              : 'Join HomeLuxe to list properties and schedule viewings.'}
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          {error === 'POPUP_CLOSED' ? (
            <div id="auth-popup-closed-notice" className="mb-5 p-4 rounded-xl bg-blue-50/90 border border-blue-200 text-slate-800 animate-fadeIn">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-blue-950">Google Sign-In Window Closed</h4>
                  <p className="text-[11px] text-blue-900 mt-1 leading-relaxed">
                    The sign-in popup window was closed before completing authentication. If you closed it by accident or if it closed automatically, you can retry or open the app in a full window.
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={submitting}
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-[#0B192C] hover:bg-[#1E3E62] text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer"
                    >
                      <span>Try Google Sign-In Again</span>
                    </button>
                    <a
                      href={window.location.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 py-2 px-3 bg-white border border-blue-200 hover:bg-blue-100 text-blue-800 text-xs font-semibold rounded-lg transition-colors"
                    >
                      <span>Open in Full Tab</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : error === 'POPUP_BLOCKED' ? (
            <div id="auth-popup-blocked-notice" className="mb-5 p-4 rounded-xl bg-amber-50/90 border border-amber-200 text-slate-800 animate-fadeIn">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-amber-950">Popup Blocked by Browser</h4>
                  <p className="text-[11px] text-amber-900 mt-1 leading-relaxed">
                    Your browser or iframe preview blocked the sign-in popup. Please allow popups for this site or open the app in a new browser tab.
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <a
                      href={window.location.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 py-2 px-3 bg-[#0B192C] hover:bg-[#1E3E62] text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer"
                    >
                      <span>Open in Full Tab</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={submitting}
                      className="inline-flex items-center py-2 px-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      <span>Retry</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : error === 'UNAUTHORIZED_DOMAIN' ? (
            <div id="auth-unauthorized-domain-notice" className="mb-5 p-4 rounded-xl bg-amber-50/90 border border-amber-200 text-slate-800 animate-fadeIn">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-amber-950">Domain Not Authorized</h4>
                  <p className="text-[11px] text-amber-900 mt-1 leading-relaxed">
                    This domain is not in your Firebase Authorized Domains list. Add <code>{window.location.hostname}</code> to the authorized domains in Firebase Console.
                  </p>
                  <a
                    href="https://console.firebase.google.com/project/flawless-sunup-t14dk/authentication/settings"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 hover:underline mt-2"
                  >
                    <span>Firebase Auth Settings</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ) : error === 'OPERATION_NOT_ALLOWED' ? (
            <div id="auth-error-message" className="mb-5 p-4 rounded-xl bg-amber-50/90 border border-amber-200 text-slate-800 animate-fadeIn">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-amber-950">Email Sign-Up Not Enabled in Firebase</h4>
                  <p className="text-[11px] text-amber-900 mt-1 leading-relaxed">
                    By default, Firebase requires enabling the Email/Password sign-in provider in the Firebase Console. <strong>Google Sign-In is already active and ready to use!</strong>
                  </p>
                  
                  <div className="mt-3 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={submitting}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#0B192C] hover:bg-[#1E3E62] text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer"
                    >
                      <span>Sign In with Google (Recommended)</span>
                    </button>
                    
                    <a
                      href="https://console.firebase.google.com/project/flawless-sunup-t14dk/authentication/providers"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-700 hover:text-blue-900 hover:underline pt-1"
                    >
                      <span>Enable Email/Password in Firebase Console</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : error ? (
            <div id="auth-error-message" className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          ) : null}

          {/* Quick Google Sign In */}
          <button
            id="google-signin-btn"
            type="button"
            onClick={handleGoogleSignIn}
            disabled={submitting}
            className="w-full flex items-center justify-center space-x-3 py-3 px-4 border border-slate-200 hover:border-blue-400 bg-white hover:bg-blue-50/40 rounded-xl text-sm font-semibold text-slate-700 hover:text-blue-900 transition-colors shadow-xs disabled:opacity-60"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full ml-1 hidden sm:inline-block">
              Ready
            </span>
          </button>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <span className="relative px-3 text-xs uppercase tracking-wider text-slate-400 bg-white font-medium">
              or use email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="auth-name-input"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="auth-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="auth-password-input"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900 transition-all"
                />
              </div>
            </div>

            <button
              id="auth-submit-btn"
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 bg-[#0B192C] hover:bg-[#1E3E62] text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 mt-2"
            >
              {submitting 
                ? 'Processing...' 
                : authMode === 'signin' 
                  ? 'Sign In to HomeLuxe' 
                  : 'Create Account'}
            </button>
          </form>

          {/* Toggle between Sign In / Sign Up */}
          <div className="mt-6 text-center text-xs text-slate-500">
            {authMode === 'signin' ? (
              <p>
                Don't have an account?{' '}
                <button
                  id="switch-to-signup-btn"
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setError('');
                  }}
                  className="font-bold text-blue-600 hover:text-blue-800 ml-1"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  id="switch-to-signin-btn"
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setError('');
                  }}
                  className="font-bold text-blue-600 hover:text-blue-800 ml-1"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
