import { User } from './auth';
import { Attendee, RSVPStatus } from './rsvp';

export interface EventCounts {
  going: number;
  maybe: number;
  declined: number;
  total: number;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  date_time: string;
  created_at: string;
  organizer: User;
  currentUserRsvp?: RSVPStatus | null;
  counts: EventCounts;
  attendees?: {
    going: Attendee[];
    maybe: Attendee[];
    declined: Attendee[];
    all: Attendee[];
  };
}

export interface CreateEventInput {
  title: string;
  description: string;
  location: string;
  date_time: string;
}

export interface UpdateEventInput {
  title?: string;
  description?: string;
  location?: string;
  date_time?: string;
}
