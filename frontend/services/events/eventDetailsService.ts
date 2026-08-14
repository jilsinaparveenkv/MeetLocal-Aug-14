import { apiRequest } from '../../lib/api';
import { Event } from '../../types/event';
import { RSVPStatus } from '../../types/rsvp';

export const eventDetailsService = {
  async getEventById(id: number | string): Promise<{ success: boolean; data: Event }> {
    return apiRequest<{ success: boolean; data: Event }>(`/events/${id}`);
  },

  async postRsvp(eventId: number | string, status: RSVPStatus): Promise<{ success: boolean; message: string; data: Event }> {
    return apiRequest<{ success: boolean; message: string; data: Event }>(`/events/${eventId}/rsvp`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    });
  },
};
