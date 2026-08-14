import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { Navbar } from '../components/layout/Navbar';

export const metadata: Metadata = {
  title: 'Meetlocal - Local Meetup RSVP Tracker',
  description: 'Organize local meetup events, browse upcoming gatherings, and track RSVPs.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-900 text-slate-100 min-h-screen flex flex-col antialiased">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <footer className="bg-slate-950 border-t border-slate-800 py-6 text-center text-xs text-slate-500">
            Meetlocal &copy; {new Date().getFullYear()} - Local Meetup RSVP Tracker
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
