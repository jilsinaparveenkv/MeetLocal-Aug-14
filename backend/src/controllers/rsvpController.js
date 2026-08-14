const rsvpService = require('../services/rsvpService');

const postRsvp = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;
    const { status } = req.body;

    const updatedEvent = await rsvpService.upsertRsvp(eventId, userId, status);
    res.status(200).json({
      success: true,
      message: `RSVP updated to '${status}'.`,
      data: updatedEvent,
    });
  } catch (error) {
    next(error);
  }
};

const getRsvps = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const attendees = await rsvpService.getEventRsvps(eventId);
    res.status(200).json({
      success: true,
      count: attendees.length,
      data: attendees,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  postRsvp,
  getRsvps,
};
