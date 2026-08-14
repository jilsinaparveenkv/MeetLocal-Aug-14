const authService = require('../services/authService');

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate seeded user & get token
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get profile of currently logged-in user
 * @access  Private (Protected by authMiddleware)
 */
const getMe = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await authService.getUserProfile(userId);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/auth/users
 * @desc    Get list of seeded users for quick user switching in frontend
 * @access  Public
 */
const getUsers = async (req, res, next) => {
  try {
    const users = await authService.getAllUsers();
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  getMe,
  getUsers,
};
