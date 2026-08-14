'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { LogIn, UserCheck, AlertCircle, Lock, Mail } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
      router.push('/events');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
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
      router.push('/events');
    } catch (err: any) {
      setError(err.message || 'Quick login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl p-8 shadow-xl">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-indigo-600/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-3">
          <LogIn className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
        <p className="text-sm text-slate-400 mt-1">Sign in to manage events and RSVPs</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-950/50 border border-rose-800 rounded-lg flex items-start gap-3 text-rose-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Manual Login Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-5 h-5 text-slate-500 absolute left-3 top-2.5" />
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
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="w-5 h-5 text-slate-500 absolute left-3 top-2.5" />
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
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition duration-200 shadow-md flex items-center justify-center gap-2 text-sm"
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

      {/* Quick Login Seeded Users Selector */}
      <div className="mt-8 pt-6 border-t border-slate-700">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-center mb-3">
          Quick Demo Logins (Seeded Users)
        </p>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => quickLogin('alice@example.com')}
            className="flex flex-col items-center justify-center p-2.5 bg-slate-900/80 hover:bg-indigo-950/40 border border-slate-700 hover:border-indigo-600 rounded-lg text-xs font-medium text-slate-300 hover:text-indigo-300 transition"
          >
            <UserCheck className="w-4 h-4 mb-1 text-indigo-400" />
            <span>Alice</span>
            <span className="text-[10px] text-slate-500">Organizer</span>
          </button>
          <button
            type="button"
            onClick={() => quickLogin('bob@example.com')}
            className="flex flex-col items-center justify-center p-2.5 bg-slate-900/80 hover:bg-indigo-950/40 border border-slate-700 hover:border-indigo-600 rounded-lg text-xs font-medium text-slate-300 hover:text-indigo-300 transition"
          >
            <UserCheck className="w-4 h-4 mb-1 text-emerald-400" />
            <span>Bob</span>
            <span className="text-[10px] text-slate-500">Member</span>
          </button>
          <button
            type="button"
            onClick={() => quickLogin('charlie@example.com')}
            className="flex flex-col items-center justify-center p-2.5 bg-slate-900/80 hover:bg-indigo-950/40 border border-slate-700 hover:border-indigo-600 rounded-lg text-xs font-medium text-slate-300 hover:text-indigo-300 transition"
          >
            <UserCheck className="w-4 h-4 mb-1 text-amber-400" />
            <span>Charlie</span>
            <span className="text-[10px] text-slate-500">Member</span>
          </button>
        </div>
      </div>
    </div>
  );
};
