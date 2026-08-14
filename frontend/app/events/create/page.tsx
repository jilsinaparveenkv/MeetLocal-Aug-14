'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '../../../components/layout/ProtectedRoute';
import { EventForm } from '../../../components/events/EventForm';
import { eventService } from '../../../services/events/eventService';
import { CreateEventInput } from '../../../types/event';

export default function CreateEventPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleCreate = async (data: CreateEventInput) => {
    setIsSubmitting(true);
    try {
      const res = await eventService.createEvent(data);
      if (res.success && res.data) {
        router.push(`/events/${res.data.id}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-white">Create a Local Meetup</h1>
          <p className="text-sm text-slate-400 mt-1">Host a gathering for your local tech community</p>
        </div>

        <EventForm
          onSubmit={handleCreate}
          buttonText="Publish Meetup Event"
          isSubmitting={isSubmitting}
        />
      </div>
    </ProtectedRoute>
  );
}
