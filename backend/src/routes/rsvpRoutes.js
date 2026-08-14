const express = require('express');
const router = express.Router({ mergeParams: true });
const rsvpController = require('../controllers/rsvpController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, rsvpController.postRsvp);
router.get('/', rsvpController.getRsvps);

module.exports = router;
