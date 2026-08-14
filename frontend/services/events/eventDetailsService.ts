import { api } from '../../lib/api';
import { RSVPStatus } from '../../types/rsvp';

export const eventDetailsService = {
  getEventById: async (id: number | string) => {
    return api.get(`/events/${id}`);
  },

  postRsvp: async (eventId: number | string, status: RSVPStatus) => {
    return api.post(`/events/${eventId}/rsvp`, { status });
  },
};
