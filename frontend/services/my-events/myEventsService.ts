import { apiRequest } from '../../lib/api';
import { Event } from '../../types/event';

export const myEventsService = {
  /**
   * Fetch events created by the logged-in user
   */
  async getMyEvents(): Promise<{ success: boolean; count: number; data: Event[] }> {
    return apiRequest<{ success: boolean; count: number; data: Event[] }>('/events/user/my-events');
  },
};
