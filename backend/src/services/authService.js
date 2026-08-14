const { AppDataSource } = require('../config/db');
const { comparePassword } = require('../utils/hashPassword');
const { generateToken } = require('../utils/generateToken');

const getUserRepository = () => AppDataSource.getRepository('User');

/**
 * Login user with email & password
 */
const loginUser = async (email, password) => {
  const userRepository = getUserRepository();

  if (!email || !password) {
    const error = new Error('Please provide email and password.');
    error.statusCode = 400;
    throw error;
  }

  const user = await userRepository.findOne({ where: { email } });
  if (!user) {
    const error = new Error('Invalid credentials. User not found.');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    const error = new Error('Invalid credentials. Incorrect password.');
    error.statusCode = 401;
    throw error;
  }

  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
  };

  const token = generateToken(payload);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
    },
    token,
  };
};

/**
 * Get profile of currently authenticated user
 */
const getUserProfile = async (userId) => {
  const userRepository = getUserRepository();
  const user = await userRepository.findOne({
    where: { id: userId },
    select: ['id', 'name', 'email', 'created_at'],
  });

  if (!user) {
    const error = new Error('User profile not found.');
    error.statusCode = 404;
    throw error;
  }

  return user;
};

/**
 * List all users (useful for user-switcher / quick login in frontend)
 */
const getAllUsers = async () => {
  const userRepository = getUserRepository();
  return await userRepository.find({
    select: ['id', 'name', 'email'],
    order: { name: 'ASC' },
  });
};

module.exports = {
  loginUser,
  getUserProfile,
  getAllUsers,
};
