import { apiRequest } from '../../lib/api';
import { CreateEventInput, Event, UpdateEventInput } from '../../types/event';

export const eventService = {
  async getEvents(searchQuery: string = ''): Promise<{ success: boolean; count: number; data: Event[] }> {
    const query = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : '';
    return apiRequest<{ success: boolean; count: number; data: Event[] }>(`/events${query}`);
  },

  async createEvent(eventData: CreateEventInput): Promise<{ success: boolean; message: string; data: Event }> {
    return apiRequest<{ success: boolean; message: string; data: Event }>('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  },

  async updateEvent(id: number | string, eventData: UpdateEventInput): Promise<{ success: boolean; message: string; data: Event }> {
    return apiRequest<{ success: boolean; message: string; data: Event }>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  },

  async deleteEvent(id: number | string): Promise<{ success: boolean; message: string }> {
    return apiRequest<{ success: boolean; message: string }>(`/events/${id}`, {
      method: 'DELETE',
    });
  },
};
