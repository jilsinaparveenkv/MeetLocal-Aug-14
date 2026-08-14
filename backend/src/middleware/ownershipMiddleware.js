const { AppDataSource } = require('../config/db');

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

    if (event.organizer_id !== userId) {
      return res.status(403).json({
        message: 'Forbidden. You do not have permission to modify or delete this event.',
      });
    }

    req.event = event;
    next();
  } catch (error) {
    console.error('Error checking event ownership:', error.message);
    res.status(500).json({ message: 'Internal server error during authorization check.' });
  }
};

module.exports = checkEventOwnership;
