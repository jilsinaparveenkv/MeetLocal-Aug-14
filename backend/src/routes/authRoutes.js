const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * Auth Routes
 */
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.getMe);
router.get('/users', authController.getUsers);

module.exports = router;
