const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');
const checkEventOwnership = require('../middleware/ownershipMiddleware');
const rsvpRoutes = require('./rsvpRoutes');

router.use('/:id/rsvp', rsvpRoutes);

router.get('/', eventController.getEvents);
router.get('/user/my-events', authMiddleware, eventController.getMyEvents);
router.get('/:id', eventController.getEventById);
router.post('/', authMiddleware, eventController.createEvent);
router.put('/:id', authMiddleware, checkEventOwnership, eventController.updateEvent);
router.delete('/:id', authMiddleware, checkEventOwnership, eventController.deleteEvent);

module.exports = router;
