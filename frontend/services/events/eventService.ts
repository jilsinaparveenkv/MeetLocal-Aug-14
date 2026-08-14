import { api } from '../../lib/api';
import { CreateEventInput, UpdateEventInput } from '../../types/event';

export const eventService = {
  getEvents: async (searchQuery: string = '') => {
    const query = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : '';
    return api.get(`/events${query}`);
  },

  createEvent: async (eventData: CreateEventInput) => {
    return api.post('/events', eventData);
  },

  updateEvent: async (id: number | string, eventData: UpdateEventInput) => {
    return api.put(`/events/${id}`, eventData);
  },

  deleteEvent: async (id: number | string) => {
    return api.delete(`/events/${id}`);
  },
};
