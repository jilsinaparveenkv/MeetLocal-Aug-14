'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Event } from '../../types/event';
import { eventService } from '../../services/events/eventService';
import { EventList } from '../../components/events/EventList';
import { EventFilters } from '../../components/events/EventFilters';
import { PlusCircle, RefreshCw } from 'lucide-react';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async (query: string = '') => {
    setLoading(true);
    setError(null);
    try {
      const res = await eventService.getEvents(query);
      setEvents(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(searchQuery);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEvents(searchQuery);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Local Meetup Events</h1>
          <p className="text-sm text-slate-400 mt-1">Browse upcoming local events or search for specific topics</p>
        </div>
        <Link
          href="/events/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition shadow-md self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Event</span>
        </Link>
      </div>

      {/* Search Bar */}
      <EventFilters
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          fetchEvents(q);
        }}
        onSearch={handleSearch}
      />

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-rose-950/60 border border-rose-800 rounded-xl text-rose-300 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => fetchEvents(searchQuery)}
            className="flex items-center gap-1 text-xs underline font-semibold hover:text-white"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      {/* Loading & Grid Output */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-sm">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          Loading meetup events...
        </div>
      ) : (
        <EventList events={events} />
      )}
    </div>
  );
}
