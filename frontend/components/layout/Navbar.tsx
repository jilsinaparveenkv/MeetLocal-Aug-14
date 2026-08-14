'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Calendar, PlusCircle, LogIn, LogOut, FolderCheck, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    showToast('Logged out successfully', 'info');
    router.push('/login');
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[4rem] flex items-center justify-between gap-4 py-2">
        
        {/* Brand Logo */}
        <Link
          href="/"
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center gap-2 text-indigo-400 font-bold text-xl hover:opacity-90 transition whitespace-nowrap shrink-0"
        >
          <Calendar className="w-6 h-6 text-indigo-500 shrink-0" />
          <span>Meetlocal</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 whitespace-nowrap">
          <Link
            href="/events"
            className={`text-sm font-medium transition whitespace-nowrap ${
              isActive('/events') || isActive('/') ? 'text-indigo-400 font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Browse Events
          </Link>

          {isAuthenticated && (
            <>
              <Link
                href="/events/create"
                className={`flex items-center gap-1.5 text-sm font-medium transition whitespace-nowrap ${
                  isActive('/events/create') ? 'text-indigo-400 font-semibold' : 'text-slate-300 hover:text-white'
                }`}
              >
                <PlusCircle className="w-4 h-4 text-indigo-400" />
                <span>Create Event</span>
              </Link>

              <Link
                href="/my-events"
                className={`flex items-center gap-1.5 text-sm font-medium transition whitespace-nowrap ${
                  isActive('/my-events') ? 'text-indigo-400 font-semibold' : 'text-slate-300 hover:text-white'
                }`}
              >
                <FolderCheck className="w-4 h-4 text-indigo-400" />
                <span>My Events</span>
              </Link>
            </>
          )}
        </nav>

        {/* Desktop User Session Action */}
        <div className="hidden md:flex items-center gap-4 whitespace-nowrap shrink-0">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700 max-w-[180px]">
                <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-xs font-medium text-slate-200 truncate">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-950/40 hover:bg-rose-900/50 px-3 py-1.5 rounded-lg border border-rose-800/50 transition whitespace-nowrap"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition shadow-sm whitespace-nowrap"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Menu Toggle Button */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white bg-slate-800 rounded-lg border border-slate-700 transition"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-rose-400" /> : <Menu className="w-6 h-6 text-indigo-400" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-6 space-y-4 shadow-2xl">
          {isAuthenticated && user && (
            <div className="flex items-center gap-3 p-3 bg-slate-800/80 rounded-xl border border-slate-700">
              <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{user.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
          )}

          <nav className="flex flex-col space-y-2">
            <Link
              href="/events"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive('/events') || isActive('/') ? 'bg-indigo-950 text-indigo-400 font-semibold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              Browse Events
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  href="/events/create"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive('/events/create') ? 'bg-indigo-950 text-indigo-400 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <PlusCircle className="w-4 h-4 text-indigo-400" />
                  <span>Create Event</span>
                </Link>

                <Link
                  href="/my-events"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive('/my-events') ? 'bg-indigo-950 text-indigo-400 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <FolderCheck className="w-4 h-4 text-indigo-400" />
                  <span>My Events</span>
                </Link>
              </>
            )}
          </nav>

          <div className="pt-2 border-t border-slate-800">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-rose-400 bg-rose-950/40 hover:bg-rose-900/60 py-2.5 rounded-lg border border-rose-800/60 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold py-2.5 rounded-lg transition shadow-md"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
