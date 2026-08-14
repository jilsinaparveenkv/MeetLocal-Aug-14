const app = require('./src/app');
const { initializeDatabase } = require('./src/config/db');
const { seedData } = require('./src/utils/seedData');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Initialize TypeORM MySQL Database Connection
    await initializeDatabase();

    // 2. Automatically Seed Default Data (Users, Events, RSVPs)
    await seedData();

    // 3. Start HTTP Server
    app.listen(PORT, () => {
      console.log(`🚀 Meetlocal Backend Server running on port ${PORT}`);
      console.log(`🌐 Health Check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
