const { AppDataSource } = require('../config/db');

/**
 * Event Ownership Middleware
 * Ensures that only the user who created an event (organizer) can modify or delete it.
 * Must run AFTER authMiddleware so req.user is available.
 */
const checkEventOwnership = async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.id, 10);
    const userId = req.user?.id;

    if (isNaN(eventId)) {
      return res.status(400).json({ message: 'Invalid event ID parameter.' });
    }

    const eventRepository = AppDataSource.getRepository('Event');
    const event = await eventRepository.findOne({ where: { id: eventId } });

    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    // Check if the current authenticated user is the organizer of the event
    if (event.organizer_id !== userId) {
      return res.status(403).json({
        message: 'Forbidden. You do not have permission to modify or delete this event.',
      });
    }

    // Attach fetched event object to request for downstream handlers to reuse
    req.event = event;
    next();
  } catch (error) {
    console.error('Error checking event ownership:', error.message);
    res.status(500).json({ message: 'Internal server error during authorization check.' });
  }
};

module.exports = checkEventOwnership;
