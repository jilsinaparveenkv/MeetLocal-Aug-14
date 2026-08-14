'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { LogIn, AlertCircle, Lock, Mail, UserCheck } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
      showToast('Login successful', 'success');
      router.push('/events');
    } catch (err: any) {
      const msg = err.message || 'Invalid email or password';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickLogin = async (quickEmail: string) => {
    setEmail(quickEmail);
    setPassword('password123');
    setError(null);
    setIsSubmitting(true);

    try {
      await login(quickEmail, 'password123');
      showToast('Login successful', 'success');
      router.push('/events');
    } catch (err: any) {
      const msg = err.message || 'Quick login failed';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl p-6 sm:p-8 shadow-xl">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-indigo-600/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-3">
          <LogIn className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-white">Sign In</h2>
        <p className="text-sm text-slate-400 mt-1">Access events and manage RSVPs</p>
      </div>

      {error && (
        <div className="mb-6 p-3.5 bg-rose-950/50 border border-rose-800 rounded-lg flex items-start gap-3 text-rose-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-5 h-5 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alice@example.com"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="w-5 h-5 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition duration-200 shadow-md flex items-center justify-center gap-2 text-sm mt-2"
        >
          {isSubmitting ? (
            <span>Signing in...</span>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </>
          )}
        </button>
      </form>

      {/* Quick Login - Seeded Accounts */}
      <div className="mt-8 pt-6 border-t border-slate-700/80">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-center mb-3">
          Quick Demo Accounts
        </p>
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => quickLogin('alice@example.com')}
            className="w-full flex items-center justify-between p-3 bg-slate-900/90 hover:bg-slate-700/60 border border-slate-700 hover:border-indigo-500 rounded-lg transition text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-xs font-semibold">
                A
              </div>
              <div>
                <p className="text-xs font-semibold text-white group-hover:text-indigo-300">Alice Johnson</p>
                <p className="text-[11px] text-slate-400">alice@example.com</p>
              </div>
            </div>
            <span className="text-xs text-indigo-400 font-medium opacity-0 group-hover:opacity-100 transition">
              Log in &rarr;
            </span>
          </button>

          <button
            type="button"
            onClick={() => quickLogin('bob@example.com')}
            className="w-full flex items-center justify-between p-3 bg-slate-900/90 hover:bg-slate-700/60 border border-slate-700 hover:border-indigo-500 rounded-lg transition text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center text-xs font-semibold">
                B
              </div>
              <div>
                <p className="text-xs font-semibold text-white group-hover:text-emerald-300">Bob Smith</p>
                <p className="text-[11px] text-slate-400">bob@example.com</p>
              </div>
            </div>
            <span className="text-xs text-emerald-400 font-medium opacity-0 group-hover:opacity-100 transition">
              Log in &rarr;
            </span>
          </button>

          <button
            type="button"
            onClick={() => quickLogin('charlie@example.com')}
            className="w-full flex items-center justify-between p-3 bg-slate-900/90 hover:bg-slate-700/60 border border-slate-700 hover:border-indigo-500 rounded-lg transition text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-600/20 text-amber-400 flex items-center justify-center text-xs font-semibold">
                C
              </div>
              <div>
                <p className="text-xs font-semibold text-white group-hover:text-amber-300">Charlie Davis</p>
                <p className="text-[11px] text-slate-400">charlie@example.com</p>
              </div>
            </div>
            <span className="text-xs text-amber-400 font-medium opacity-0 group-hover:opacity-100 transition">
              Log in &rarr;
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
