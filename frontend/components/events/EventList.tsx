'use client';

import React from 'react';
import { Event } from '../../types/event';
import { EventCard } from './EventCard';
import { CalendarX } from 'lucide-react';

interface EventListProps {
  events: Event[];
  onDelete?: (id: number) => void;
}

export const EventList: React.FC<EventListProps> = ({ events, onDelete }) => {
  if (!events || events.length === 0) {
    return (
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-12 text-center max-w-md mx-auto my-8">
        <CalendarX className="w-12 h-12 text-slate-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-white mb-1">No Events Found</h3>
        <p className="text-sm text-slate-400">
          No meetup events match your search criteria. Try adjusting your search query or create a new event!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} onDelete={onDelete} />
      ))}
    </div>
  );
};
