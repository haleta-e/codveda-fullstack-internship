require('dotenv').config();
const app = require('./app');
const { pool } = require('./config/db');

const PORT = process.env.PORT || 5000;

// Test database connection before serving traffic
const startServer = async () => {
  try {
    const client = await pool.connect();
    console.log('----------------------------------------------------');
    console.log('PostgreSQL database connected successfully.');
    console.log(`Database: ${process.env.DB_NAME || 'menged_db'} on ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}`);
    client.release();

    app.listen(PORT, () => {
      console.log(`Menged REST API server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
      console.log(`Opportunities: http://localhost:${PORT}/api/opportunities`);
      console.log('----------------------------------------------------');
    });
  } catch (err) {
    console.error('Failed to connect to PostgreSQL database:');
    console.error(err.message);
    console.log('Starting server in offline-database mode...');
    
    // Still start Express server so health route and error handlers can respond
    app.listen(PORT, () => {
      console.log(`Menged REST API server running on port ${PORT} (Database pending connection)`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  }
};

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down server gracefully...');
  await pool.end();
  process.exit(0);
});
