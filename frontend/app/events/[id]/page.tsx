'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Event } from '../../../types/event';
import { eventDetailsService } from '../../../services/events/eventDetailsService';
import { RSVPButtons } from '../../../components/rsvp/RSVPButtons';
import { AttendeeList } from '../../../components/rsvp/AttendeeList';
import { EventActions } from '../../../components/events/EventActions';
import { useAuth } from '../../../context/AuthContext';
import { Calendar, MapPin, User, ArrowLeft, Clock } from 'lucide-react';

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  const fetchEvent = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await eventDetailsService.getEventById(eventId);
      setEvent(res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load event details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const handleRsvpUpdate = (updatedEventData: Event) => {
    setEvent(updatedEventData);
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-slate-400 text-sm">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        Loading event details...
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 max-w-lg mx-auto text-center my-8">
        <h2 className="text-xl font-bold text-white mb-2">Event Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">{error || 'The requested event could not be found.'}</p>
        <Link
          href="/events"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Events</span>
        </Link>
      </div>
    );
  }

  const isOrganizer = user && user.id === event.organizer.id;

  const formattedDate = new Date(event.date_time).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Back Link */}
      <Link href="/events" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Events</span>
      </Link>

      {/* Main Event Card */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-700/80 pb-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 inline-flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>Hosted by {event.organizer.name}</span>
            </span>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">{event.title}</h1>
          </div>

          {isOrganizer && (
            <div className="shrink-0">
              <EventActions eventId={event.id} />
            </div>
          )}
        </div>

        {/* Date & Location Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-700/60 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-950 text-indigo-400 flex items-center justify-center border border-indigo-800/60">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-400">Date &amp; Time</p>
              <p className="text-white font-medium mt-0.5">{formattedDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-950 text-indigo-400 flex items-center justify-center border border-indigo-800/60">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-400">Location</p>
              <p className="text-white font-medium mt-0.5">{event.location}</p>
            </div>
          </div>
        </div>

        {/* Event Description */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">About This Event</h3>
          <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-line bg-slate-900/30 p-4 rounded-xl border border-slate-700/40">
            {event.description}
          </p>
        </div>

        {/* Interactive RSVP Action Controls */}
        <RSVPButtons
          eventId={event.id}
          currentStatus={event.currentUserRsvp}
          onRsvpSuccess={handleRsvpUpdate}
        />
      </div>

      {/* Attendees List Section */}
      <AttendeeList attendees={event.attendees || { going: [], maybe: [], declined: [], all: [] }} />
    </div>
  );
}
