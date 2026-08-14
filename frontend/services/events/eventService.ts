import { apiRequest } from '../../lib/api';
import { CreateEventInput, Event, UpdateEventInput } from '../../types/event';

export const eventService = {
  /**
   * Fetch all events (with optional search query)
   */
  async getEvents(searchQuery: string = ''): Promise<{ success: boolean; count: number; data: Event[] }> {
    const query = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : '';
    return apiRequest<{ success: boolean; count: number; data: Event[] }>(`/events${query}`);
  },

  /**
   * Create a new meetup event
   */
  async createEvent(eventData: CreateEventInput): Promise<{ success: boolean; message: string; data: Event }> {
    return apiRequest<{ success: boolean; message: string; data: Event }>('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  },

  /**
   * Update an existing event
   */
  async updateEvent(id: number | string, eventData: UpdateEventInput): Promise<{ success: boolean; message: string; data: Event }> {
    return apiRequest<{ success: boolean; message: string; data: Event }>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  },

  /**
   * Delete an event
   */
  async deleteEvent(id: number | string): Promise<{ success: boolean; message: string }> {
    return apiRequest<{ success: boolean; message: string }>(`/events/${id}`, {
      method: 'DELETE',
    });
  },
};
