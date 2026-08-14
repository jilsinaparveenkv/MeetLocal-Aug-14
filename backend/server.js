const app = require('./src/app');
const { initializeDatabase } = require('./src/config/db');
const { seedData } = require('./src/utils/seedData');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await initializeDatabase();
    await seedData();

    app.listen(PORT, () => {
      console.log(`Backend server running on port ${PORT}`);
      console.log(`Health Check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
