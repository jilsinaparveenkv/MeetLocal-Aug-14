'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Calendar, PlusCircle, LogIn, LogOut, User, FolderCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 text-indigo-400 font-bold text-xl hover:opacity-90 transition">
          <Calendar className="w-6 h-6 text-indigo-500" />
          <span>Meetlocal</span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-6">
          <Link
            href="/events"
            className={`text-sm font-medium transition ${
              isActive('/events') || isActive('/') ? 'text-indigo-400 font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Browse Events
          </Link>

          {isAuthenticated && (
            <>
              <Link
                href="/events/create"
                className={`flex items-center gap-1 text-sm font-medium transition ${
                  isActive('/events/create') ? 'text-indigo-400 font-semibold' : 'text-slate-300 hover:text-white'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Event</span>
              </Link>

              <Link
                href="/my-events"
                className={`flex items-center gap-1 text-sm font-medium transition ${
                  isActive('/my-events') ? 'text-indigo-400 font-semibold' : 'text-slate-300 hover:text-white'
                }`}
              >
                <FolderCheck className="w-4 h-4" />
                <span>My Events</span>
              </Link>
            </>
          )}
        </nav>

        {/* User Session Action */}
        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
                <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                  {user.name.charAt(0)}
                </div>
                <span className="text-xs font-medium text-slate-200">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-950/40 hover:bg-rose-900/50 px-3 py-1.5 rounded-lg border border-rose-800/50 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
