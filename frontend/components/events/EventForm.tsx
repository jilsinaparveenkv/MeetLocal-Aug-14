'use client';

import React, { useState } from 'react';
import { CreateEventInput } from '../../types/event';
import { Calendar, MapPin, AlignLeft, Type, AlertCircle } from 'lucide-react';

interface EventFormProps {
  initialData?: CreateEventInput;
  onSubmit: (data: CreateEventInput) => Promise<void>;
  buttonText: string;
  isSubmitting?: boolean;
}

export const EventForm: React.FC<EventFormProps> = ({
  initialData,
  onSubmit,
  buttonText,
  isSubmitting = false,
}) => {
  // Format ISO date string into standard "YYYY-MM-THH:mm" for datetime-local input
  const formatForInput = (dateStr?: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const pad = (num: number) => String(num).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [location, setLocation] = useState(initialData?.location || '');
  const [dateTime, setDateTime] = useState(formatForInput(initialData?.date_time));
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title || !description || !location || !dateTime) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      await onSubmit({
        title,
        description,
        location,
        date_time: dateTime,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to save event. Please check inputs.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800 border border-slate-700 p-8 rounded-xl shadow-xl max-w-2xl mx-auto">
      {error && (
        <div className="p-4 bg-rose-950/50 border border-rose-800 rounded-lg flex items-center gap-3 text-rose-300 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Event Title */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          Event Title *
        </label>
        <div className="relative">
          <Type className="w-5 h-5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Next.js & AI Developers Meetup"
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition text-sm"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          Event Description *
        </label>
        <div className="relative">
          <AlignLeft className="w-5 h-5 text-slate-500 absolute left-3 top-3" />
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what your meetup is about, agenda, speaker details..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition text-sm"
          />
        </div>
      </div>

      {/* Location & Date/Time Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Location / Venue *
          </label>
          <div className="relative">
            <MapPin className="w-5 h-5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Tech Hub Room 302, Main St"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Date & Time *
          </label>
          <div className="relative">
            <Calendar className="w-5 h-5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="datetime-local"
              required
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition text-sm"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition shadow-md text-sm"
      >
        {isSubmitting ? 'Saving Event...' : buttonText}
      </button>
    </form>
  );
};
