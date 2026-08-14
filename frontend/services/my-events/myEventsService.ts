import { api } from '../../lib/api';

export const myEventsService = {
  getMyEvents: async () => {
    return api.get('/events/user/my-events');
  },
};
