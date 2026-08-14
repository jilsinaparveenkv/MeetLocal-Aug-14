const { DataSource } = require('typeorm');
const path = require('path');
require('dotenv').config();

const User = require('../entities/User');
const Event = require('../entities/Event');
const Rsvp = require('../entities/Rsvp');

/**
 * TypeORM Data Source Configuration
 * Connects to MySQL database and registers entity schemas.
 */
const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USER || 'meetlocal_user',
  password: process.env.DB_PASSWORD || 'meetlocal_pass',
  database: process.env.DB_NAME || 'meetlocal_db',
  synchronize: true, // Automatically sync entity schemas with DB tables on boot
  logging: false,
  entities: [User, Event, Rsvp],
  subscribers: [],
  migrations: [],
});

/**
 * Connect to MySQL Database
 */
const initializeDatabase = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('✅ MySQL Database connected successfully via TypeORM Data Source.');
    }
    return AppDataSource;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw error;
  }
};

module.exports = {
  AppDataSource,
  initializeDatabase,
};
