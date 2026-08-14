'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Event } from '../types/event';
import { eventService } from '../services/events/eventService';
import { EventList } from '../components/events/EventList';
import { Calendar, PlusCircle, Sparkles } from 'lucide-react';

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await eventService.getEvents();
        setEvents(res.data || []);
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="space-y-10">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-indigo-900/60 via-slate-800 to-slate-900 border border-indigo-500/30 rounded-2xl p-8 sm:p-12 shadow-xl text-center sm:text-left relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-950/90 text-indigo-300 border border-indigo-700/60 rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover Local Community Gatherings</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Connect, Share &amp; Track Meetups Near You
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Meetlocal helps tech communities and local groups organize events, track real-time RSVPs, and manage attendees seamlessly.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4">
            <Link
              href="/events"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition shadow-lg flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Browse All Events</span>
            </Link>
            <Link
              href="/events/create"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-semibold rounded-xl text-sm transition flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-indigo-400" />
              <span>Host a Meetup</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Upcoming Events */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Upcoming Meetups</h2>
            <p className="text-sm text-slate-400">Discover gatherings happening in your local community</p>
          </div>
          <Link href="/events" className="text-sm font-semibold text-indigo-400 hover:underline">
            View All &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            Loading upcoming meetups...
          </div>
        ) : (
          <EventList events={events.slice(0, 6)} />
        )}
      </section>
    </div>
  );
}
