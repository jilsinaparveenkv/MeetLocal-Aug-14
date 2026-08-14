'use client';

import React from 'react';
import Link from 'next/link';
import { Event } from '../../types/event';
import { useAuth } from '../../context/AuthContext';
import { Calendar, MapPin, User, Users, CheckCircle, HelpCircle, XCircle, ArrowRight } from 'lucide-react';

interface EventCardProps {
  event: Event;
  onDelete?: (id: number) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onDelete }) => {
  const { user } = useAuth();
  const isOrganizer = user && user.id === event.organizer.id;

  const eventDate = new Date(event.date_time).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl p-6 shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            <span>{event.organizer.name}</span>
            {isOrganizer && <span className="text-[10px] bg-indigo-600 text-white px-1.5 rounded font-bold">You</span>}
          </span>

          {event.currentUserRsvp && (
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded capitalize ${
                event.currentUserRsvp === 'going'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : event.currentUserRsvp === 'maybe'
                  ? 'bg-amber-950 text-amber-400 border border-amber-800'
                  : 'bg-rose-950 text-rose-400 border border-rose-800'
              }`}
            >
              RSVP: {event.currentUserRsvp}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition mb-2">
          <Link href={`/events/${event.id}`}>{event.title}</Link>
        </h3>

        {/* Description Snippet */}
        <p className="text-sm text-slate-300 line-clamp-2 mb-4">
          {event.description}
        </p>

        {/* Date & Location Details */}
        <div className="space-y-2 text-xs text-slate-400 mb-5">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{eventDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>{event.location}</span>
          </div>
        </div>
      </div>

      <div>
        {/* RSVP Stats Bar */}
        <div className="flex items-center gap-4 py-3 px-3 bg-slate-900/70 rounded-lg border border-slate-700/60 text-xs mb-4">
          <div className="flex items-center gap-1 text-emerald-400 font-medium">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{event.counts?.going || 0} Going</span>
          </div>
          <div className="flex items-center gap-1 text-amber-400 font-medium">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{event.counts?.maybe || 0} Maybe</span>
          </div>
          <div className="flex items-center gap-1 text-rose-400 font-medium">
            <XCircle className="w-3.5 h-3.5" />
            <span>{event.counts?.declined || 0} Declined</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between">
          <Link
            href={`/events/${event.id}`}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 group-hover:translate-x-0.5 transition"
          >
            <span>View Event & Attendees</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {isOrganizer && onDelete && (
            <div className="flex items-center gap-2">
              <Link
                href={`/events/${event.id}/edit`}
                className="text-xs text-slate-400 hover:text-white transition px-2 py-1 bg-slate-700 rounded hover:bg-slate-600"
              >
                Edit
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
