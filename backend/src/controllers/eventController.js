const eventService = require('../services/eventService');

/**
 * @route   GET /api/events
 * @desc    Get all meetup events (supports optional ?search= parameter)
 * @access  Public
 */
const getEvents = async (req, res, next) => {
  try {
    const { search } = req.query;
    const events = await eventService.getAllEvents(search);
    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/events/:id
 * @desc    Get event by ID with attendee list
 * @access  Public
 */
const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user ? req.user.id : null;
    const event = await eventService.getEventById(id, currentUserId);
    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/events
 * @desc    Create a new meetup event
 * @access  Private (Logged-in users only)
 */
const createEvent = async (req, res, next) => {
  try {
    const organizerId = req.user.id;
    const newEvent = await eventService.createEvent(req.body, organizerId);
    res.status(201).json({
      success: true,
      message: 'Event created successfully.',
      data: newEvent,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/events/:id
 * @desc    Update event details
 * @access  Private (Event organizer only - verified by ownershipMiddleware)
 */
const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedEvent = await eventService.updateEvent(id, req.body);
    res.status(200).json({
      success: true,
      message: 'Event updated successfully.',
      data: updatedEvent,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/events/:id
 * @desc    Delete an event
 * @access  Private (Event organizer only - verified by ownershipMiddleware)
 */
const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await eventService.deleteEvent(id);
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/events/user/my-events
 * @desc    Get events created by the authenticated user
 * @access  Private (Logged-in users only)
 */
const getMyEvents = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const events = await eventService.getEventsByOrganizer(userId);
    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents,
};
