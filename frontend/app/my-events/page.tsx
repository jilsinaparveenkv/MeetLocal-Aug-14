'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '../../components/layout/ProtectedRoute';
import { Event } from '../../types/event';
import { myEventsService } from '../../services/my-events/myEventsService';
import { EventList } from '../../components/events/EventList';
import { PlusCircle, FolderCheck } from 'lucide-react';

export default function MyEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await myEventsService.getMyEvents();
      setEvents(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch your events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
              <FolderCheck className="w-8 h-8 text-indigo-400" />
              <span>My Hosted Events</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">Manage events you have created and view attendee responses</p>
          </div>
          <Link
            href="/events/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition shadow-md self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Event</span>
          </Link>
        </div>

        {error && (
          <div className="p-4 bg-rose-950/60 border border-rose-800 rounded-xl text-rose-300 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            Loading your events...
          </div>
        ) : (
          <EventList events={events} />
        )}
      </div>
    </ProtectedRoute>
  );
}
