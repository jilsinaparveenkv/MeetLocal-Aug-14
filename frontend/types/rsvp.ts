import { User } from './auth';

export type RSVPStatus = 'going' | 'maybe' | 'declined';

export interface Attendee {
  id: number;
  status: RSVPStatus;
  created_at: string;
  user: User;
}

export interface RSVPInput {
  status: RSVPStatus;
}
