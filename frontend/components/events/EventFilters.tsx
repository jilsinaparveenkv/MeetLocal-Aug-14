'use client';

import React from 'react';
import { Search, X } from 'lucide-react';

interface EventFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: (e: React.FormEvent) => void;
}

export const EventFilters: React.FC<EventFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  onSearch,
}) => {
  return (
    <form onSubmit={onSearch} className="w-full max-w-lg mb-8">
      <div className="relative flex items-center">
        <Search className="w-5 h-5 text-slate-400 absolute left-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search events by title, description, or location..."
          className="w-full pl-11 pr-10 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition text-sm shadow-sm"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  );
};
