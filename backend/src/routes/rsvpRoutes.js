const express = require('express');
const router = express.Router({ mergeParams: true });
const rsvpController = require('../controllers/rsvpController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * RSVP Routes (nested under /api/events/:id/rsvp)
 */
router.post('/', authMiddleware, rsvpController.postRsvp);
router.get('/', rsvpController.getRsvps);

module.exports = router;
