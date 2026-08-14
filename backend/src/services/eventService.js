const { AppDataSource } = require('../config/db');

const getEventRepository = () => AppDataSource.getRepository('Event');
const getRsvpRepository = () => AppDataSource.getRepository('Rsvp');

/**
 * Fetch all meetup events with optional search query & RSVP counts
 */
const getAllEvents = async (searchQuery = '') => {
  const eventRepository = getEventRepository();

  let queryBuilder = eventRepository
    .createQueryBuilder('event')
    .leftJoinAndSelect('event.organizer', 'organizer')
    .leftJoinAndSelect('event.rsvps', 'rsvp')
    .leftJoinAndSelect('rsvp.user', 'rsvpUser')
    .orderBy('event.date_time', 'ASC');

  if (searchQuery && searchQuery.trim() !== '') {
    const term = `%${searchQuery.trim()}%`;
    queryBuilder = queryBuilder.where(
      '(event.title LIKE :term OR event.description LIKE :term OR event.location LIKE :term)',
      { term }
    );
  }

  const events = await queryBuilder.getMany();

  // Format events to include organized RSVP counts
  return events.map((event) => {
    const goingCount = event.rsvps ? event.rsvps.filter((r) => r.status === 'going').length : 0;
    const maybeCount = event.rsvps ? event.rsvps.filter((r) => r.status === 'maybe').length : 0;
    const declinedCount = event.rsvps ? event.rsvps.filter((r) => r.status === 'declined').length : 0;

    return {
      id: event.id,
      title: event.title,
      description: event.description,
      location: event.location,
      date_time: event.date_time,
      created_at: event.created_at,
      organizer: {
        id: event.organizer?.id,
        name: event.organizer?.name,
        email: event.organizer?.email,
      },
      counts: {
        going: goingCount,
        maybe: maybeCount,
        declined: declinedCount,
        total: event.rsvps ? event.rsvps.length : 0,
      },
    };
  });
};

/**
 * Fetch single event details with organizer & attendee list
 */
const getEventById = async (eventId, currentUserId = null) => {
  const eventRepository = getEventRepository();

  const event = await eventRepository.findOne({
    where: { id: parseInt(eventId, 10) },
    relations: ['organizer', 'rsvps', 'rsvps.user'],
  });

  if (!event) {
    const error = new Error('Event not found.');
    error.statusCode = 404;
    throw error;
  }

  // Format attendees list safely (without sensitive password data)
  const attendees = event.rsvps.map((rsvp) => ({
    id: rsvp.id,
    status: rsvp.status,
    created_at: rsvp.created_at,
    user: {
      id: rsvp.user?.id,
      name: rsvp.user?.name,
      email: rsvp.user?.email,
    },
  }));

  // Identify current user's RSVP status if logged in
  let currentUserRsvp = null;
  if (currentUserId) {
    const userRsvp = event.rsvps.find((r) => r.user_id === currentUserId);
    if (userRsvp) {
      currentUserRsvp = userRsvp.status;
    }
  }

  const goingList = attendees.filter((a) => a.status === 'going');
  const maybeList = attendees.filter((a) => a.status === 'maybe');
  const declinedList = attendees.filter((a) => a.status === 'declined');

  return {
    id: event.id,
    title: event.title,
    description: event.description,
    location: event.location,
    date_time: event.date_time,
    created_at: event.created_at,
    organizer: {
      id: event.organizer?.id,
      name: event.organizer?.name,
      email: event.organizer?.email,
    },
    currentUserRsvp,
    counts: {
      going: goingList.length,
      maybe: maybeList.length,
      declined: declinedList.length,
      total: attendees.length,
    },
    attendees: {
      going: goingList,
      maybe: maybeList,
      declined: declinedList,
      all: attendees,
    },
  };
};

/**
 * Create a new event
 */
const createEvent = async (eventData, organizerId) => {
  const { title, description, location, date_time } = eventData;

  if (!title || !description || !location || !date_time) {
    const error = new Error('Please fill in all required event fields (title, description, location, date_time).');
    error.statusCode = 400;
    throw error;
  }

  const eventRepository = getEventRepository();
  const newEvent = eventRepository.create({
    title,
    description,
    location,
    date_time: new Date(date_time),
    organizer_id: organizerId,
  });

  const savedEvent = await eventRepository.save(newEvent);
  return await getEventById(savedEvent.id, organizerId);
};

/**
 * Update existing event
 */
const updateEvent = async (eventId, eventData) => {
  const eventRepository = getEventRepository();
  const event = await eventRepository.findOne({ where: { id: parseInt(eventId, 10) } });

  if (!event) {
    const error = new Error('Event not found.');
    error.statusCode = 404;
    throw error;
  }

  const { title, description, location, date_time } = eventData;

  if (title) event.title = title;
  if (description) event.description = description;
  if (location) event.location = location;
  if (date_time) event.date_time = new Date(date_time);

  await eventRepository.save(event);
  return await getEventById(event.id);
};

/**
 * Delete an event
 */
const deleteEvent = async (eventId) => {
  const eventRepository = getEventRepository();
  const result = await eventRepository.delete({ id: parseInt(eventId, 10) });

  if (result.affected === 0) {
    const error = new Error('Event not found or already deleted.');
    error.statusCode = 404;
    throw error;
  }

  return { message: 'Event deleted successfully.' };
};

/**
 * Fetch events organized by a specific user
 */
const getEventsByOrganizer = async (organizerId) => {
  const eventRepository = getEventRepository();
  const events = await eventRepository.find({
    where: { organizer_id: organizerId },
    relations: ['organizer', 'rsvps'],
    order: { date_time: 'ASC' },
  });

  return events.map((event) => ({
    id: event.id,
    title: event.title,
    description: event.description,
    location: event.location,
    date_time: event.date_time,
    created_at: event.created_at,
    counts: {
      going: event.rsvps ? event.rsvps.filter((r) => r.status === 'going').length : 0,
      maybe: event.rsvps ? event.rsvps.filter((r) => r.status === 'maybe').length : 0,
      declined: event.rsvps ? event.rsvps.filter((r) => r.status === 'declined').length : 0,
      total: event.rsvps ? event.rsvps.length : 0,
    },
  }));
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventsByOrganizer,
};
