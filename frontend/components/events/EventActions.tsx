'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { eventService } from '../../services/events/eventService';
import { Edit3, Trash2, AlertTriangle } from 'lucide-react';

interface EventActionsProps {
  eventId: number;
}

export const EventActions: React.FC<EventActionsProps> = ({ eventId }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      await eventService.deleteEvent(eventId);
      router.push('/events');
    } catch (err: any) {
      setError(err.message || 'Failed to delete event.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Edit Link */}
      <Link
        href={`/events/${eventId}/edit`}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-xs font-semibold text-slate-200 transition"
      >
        <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
        <span>Edit Event</span>
      </Link>

      {/* Delete Trigger */}
      <button
        onClick={() => setShowConfirm(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/80 rounded-lg text-xs font-semibold text-rose-300 transition"
      >
        <Trash2 className="w-3.5 h-3.5 text-rose-400" />
        <span>Delete</span>
      </button>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-10 h-10 bg-rose-950 text-rose-400 rounded-full flex items-center justify-center mb-3 mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-white text-center mb-1">Delete Event?</h4>
            <p className="text-xs text-slate-300 text-center mb-6">
              Are you sure you want to delete this event? This action cannot be undone and all RSVPs will be removed.
            </p>

            {error && <p className="text-xs text-rose-400 mb-3 text-center">{error}</p>}

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
                className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
