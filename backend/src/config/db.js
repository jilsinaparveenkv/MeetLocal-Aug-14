const { DataSource } = require('typeorm');
require('dotenv').config();

const User = require('../entities/User');
const Event = require('../entities/Event');
const Rsvp = require('../entities/Rsvp');

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USER || 'meetlocal_user',
  password: process.env.DB_PASSWORD || 'meetlocal_pass',
  database: process.env.DB_NAME || 'meetlocal_db',
  synchronize: true,
  logging: false,
  entities: [User, Event, Rsvp],
  subscribers: [],
  migrations: [],
});

const initializeDatabase = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('MySQL Database connected successfully.');
    }
    return AppDataSource;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    throw error;
  }
};

module.exports = {
  AppDataSource,
  initializeDatabase,
};
