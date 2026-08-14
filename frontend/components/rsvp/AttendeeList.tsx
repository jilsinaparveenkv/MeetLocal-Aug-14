'use client';

import React, { useState } from 'react';
import { Attendee } from '../../types/rsvp';
import { Users, CheckCircle, HelpCircle, XCircle } from 'lucide-react';

interface AttendeeListProps {
  attendees: {
    going: Attendee[];
    maybe: Attendee[];
    declined: Attendee[];
    all: Attendee[];
  };
}

export const AttendeeList: React.FC<AttendeeListProps> = ({ attendees }) => {
  const [activeTab, setActiveTab] = useState<'going' | 'maybe' | 'declined'>('going');

  const list = attendees ? attendees[activeTab] || [] : [];

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-base font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-400" />
          <span>Attendees List</span>
        </h4>
        <span className="text-xs text-slate-400 font-medium">
          Total RSVPs: {attendees?.all?.length || 0}
        </span>
      </div>

      {/* Status Tabs */}
      <div className="flex border-b border-slate-700 mb-4">
        <button
          onClick={() => setActiveTab('going')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border-b-2 transition ${
            activeTab === 'going'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Going ({attendees?.going?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('maybe')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border-b-2 transition ${
            activeTab === 'maybe'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Maybe ({attendees?.maybe?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('declined')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border-b-2 transition ${
            activeTab === 'declined'
              ? 'border-rose-500 text-rose-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <XCircle className="w-3.5 h-3.5" />
          <span>Declined ({attendees?.declined?.length || 0})</span>
        </button>
      </div>

      {/* Attendees List Render */}
      {list.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-400">
          No users have responded with &apos;{activeTab}&apos; for this meetup yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {list.map((attendee) => (
            <div
              key={attendee.id}
              className="flex items-center gap-3 p-3 bg-slate-900/80 border border-slate-700/70 rounded-lg"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-600/30 text-indigo-300 font-bold flex items-center justify-center text-xs border border-indigo-500/40">
                {attendee.user?.name ? attendee.user.name.charAt(0) : '?'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white truncate">{attendee.user?.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{attendee.user?.email}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
