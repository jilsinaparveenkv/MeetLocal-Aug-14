const { AppDataSource } = require('../config/db');
const { getEventById } = require('./eventService');

const getRsvpRepository = () => AppDataSource.getRepository('Rsvp');
const getEventRepository = () => AppDataSource.getRepository('Event');

/**
 * Upsert (create or update) RSVP status for a given user and event
 */
const upsertRsvp = async (eventId, userId, status) => {
  const validStatuses = ['going', 'maybe', 'declined'];

  if (!status || !validStatuses.includes(status)) {
    const error = new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }

  const parsedEventId = parseInt(eventId, 10);
  const eventRepository = getEventRepository();

  const eventExists = await eventRepository.findOne({ where: { id: parsedEventId } });
  if (!eventExists) {
    const error = new Error('Event not found.');
    error.statusCode = 404;
    throw error;
  }

  const rsvpRepository = getRsvpRepository();

  // Check if RSVP record already exists for this (event_id, user_id)
  let rsvp = await rsvpRepository.findOne({
    where: {
      event_id: parsedEventId,
      user_id: userId,
    },
  });

  if (rsvp) {
    // Update status if record exists
    rsvp.status = status;
    await rsvpRepository.save(rsvp);
  } else {
    // Create new RSVP record
    rsvp = rsvpRepository.create({
      event_id: parsedEventId,
      user_id: userId,
      status,
    });
    await rsvpRepository.save(rsvp);
  }

  // Return updated event details with attendees
  return await getEventById(parsedEventId, userId);
};

/**
 * Get all RSVPs / attendees for an event
 */
const getEventRsvps = async (eventId) => {
  const parsedEventId = parseInt(eventId, 10);
  const rsvpRepository = getRsvpRepository();

  const rsvps = await rsvpRepository.find({
    where: { event_id: parsedEventId },
    relations: ['user'],
    order: { created_at: 'DESC' },
  });

  return rsvps.map((r) => ({
    id: r.id,
    status: r.status,
    created_at: r.created_at,
    user: {
      id: r.user?.id,
      name: r.user?.name,
      email: r.user?.email,
    },
  }));
};

module.exports = {
  upsertRsvp,
  getEventRsvps,
};
