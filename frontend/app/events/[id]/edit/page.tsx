'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '../../../../components/layout/ProtectedRoute';
import { EventForm } from '../../../../components/events/EventForm';
import { eventService } from '../../../../services/events/eventService';
import { eventDetailsService } from '../../../../services/events/eventDetailsService';
import { useToast } from '../../../../context/ToastContext';
import { CreateEventInput, Event } from '../../../../types/event';

export default function EditEventPage() {
  const params = useParams();
  const eventId = params.id as string;
  const { showToast } = useToast();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await eventDetailsService.getEventById(eventId);
        setEvent(res.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load event data.');
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const handleUpdate = async (data: CreateEventInput) => {
    setIsSubmitting(true);
    try {
      const res = await eventService.updateEvent(eventId, data);
      if (res.success && res.data) {
        showToast('Event updated successfully', 'success');
        router.push(`/events/${res.data.id}`);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update event', 'error');
    } finally {
      setIsSubmitting(false);
    }
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
        <p className="text-rose-400 text-sm">{error || 'Event not found.'}</p>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-white">Edit Meetup Event</h1>
          <p className="text-sm text-slate-400 mt-1">Update event details, location, or time</p>
        </div>

        <EventForm
          initialData={{
            title: event.title,
            description: event.description,
            location: event.location,
            date_time: event.date_time,
          }}
          onSubmit={handleUpdate}
          buttonText="Save Changes"
          isSubmitting={isSubmitting}
        />
      </div>
    </ProtectedRoute>
  );
}
