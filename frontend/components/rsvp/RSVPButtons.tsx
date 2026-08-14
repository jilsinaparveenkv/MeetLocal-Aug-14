'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { RSVPStatus } from '../../types/rsvp';
import { useAuth } from '../../context/AuthContext';
import { eventDetailsService } from '../../services/events/eventDetailsService';
import { CheckCircle, HelpCircle, XCircle, LogIn } from 'lucide-react';

interface RSVPButtonsProps {
  eventId: number;
  currentStatus?: RSVPStatus | null;
  onRsvpSuccess: (updatedEvent: any) => void;
}

export const RSVPButtons: React.FC<RSVPButtonsProps> = ({
  eventId,
  currentStatus,
  onRsvpSuccess,
}) => {
  const { isAuthenticated } = useAuth();
  const [activeStatus, setActiveStatus] = useState<RSVPStatus | null>(currentStatus || null);
  const [loadingStatus, setLoadingStatus] = useState<RSVPStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRsvp = async (status: RSVPStatus) => {
    if (!isAuthenticated) return;

    setLoadingStatus(status);
    setError(null);

    try {
      const res = await eventDetailsService.postRsvp(eventId, status);
      if (res.success && res.data) {
        setActiveStatus(status);
        onRsvpSuccess(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update RSVP.');
    } finally {
      setLoadingStatus(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-slate-900/80 border border-slate-700/70 rounded-xl p-5 text-center">
        <p className="text-xs text-slate-300 mb-3">
          Want to attend this meetup? Log in to your account to submit your RSVP.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition"
        >
          <LogIn className="w-4 h-4" />
          <span>Login to RSVP</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Your RSVP Status</h4>

      {error && <p className="text-xs text-rose-400 mb-3">{error}</p>}

      <div className="grid grid-cols-3 gap-3">
        {/* Going Button */}
        <button
          onClick={() => handleRsvp('going')}
          disabled={loadingStatus !== null}
          className={`flex flex-col items-center justify-center py-3 px-2 rounded-lg border text-xs font-semibold transition ${
            activeStatus === 'going'
              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-md ring-1 ring-emerald-500'
              : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:bg-emerald-950/30 hover:border-emerald-700'
          }`}
        >
          <CheckCircle className={`w-5 h-5 mb-1 ${activeStatus === 'going' ? 'text-emerald-400' : 'text-slate-400'}`} />
          <span>{loadingStatus === 'going' ? 'Saving...' : 'Going'}</span>
        </button>

        {/* Maybe Button */}
        <button
          onClick={() => handleRsvp('maybe')}
          disabled={loadingStatus !== null}
          className={`flex flex-col items-center justify-center py-3 px-2 rounded-lg border text-xs font-semibold transition ${
            activeStatus === 'maybe'
              ? 'bg-amber-950/80 border-amber-500 text-amber-300 shadow-md ring-1 ring-amber-500'
              : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:bg-amber-950/30 hover:border-amber-700'
          }`}
        >
          <HelpCircle className={`w-5 h-5 mb-1 ${activeStatus === 'maybe' ? 'text-amber-400' : 'text-slate-400'}`} />
          <span>{loadingStatus === 'maybe' ? 'Saving...' : 'Maybe'}</span>
        </button>

        {/* Declined Button */}
        <button
          onClick={() => handleRsvp('declined')}
          disabled={loadingStatus !== null}
          className={`flex flex-col items-center justify-center py-3 px-2 rounded-lg border text-xs font-semibold transition ${
            activeStatus === 'declined'
              ? 'bg-rose-950/80 border-rose-500 text-rose-300 shadow-md ring-1 ring-rose-500'
              : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:bg-rose-950/30 hover:border-rose-700'
          }`}
        >
          <XCircle className={`w-5 h-5 mb-1 ${activeStatus === 'declined' ? 'text-rose-400' : 'text-slate-400'}`} />
          <span>{loadingStatus === 'declined' ? 'Saving...' : 'Declined'}</span>
        </button>
      </div>
    </div>
  );
};
