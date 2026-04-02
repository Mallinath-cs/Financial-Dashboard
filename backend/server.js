const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB } = require('./config/database');
const { seedDatabase } = require('./utils/seed');
const transactionRoutes = require('./routes/transactions');
const insightRoutes = require('./routes/insights');

const app = express();
const PORT = process.env.PORT || 8001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGINS || '*',
  credentials: true
}));
app.use(express.json());

// Initialize database and start server
const startServer = async () => {
  try {
    const db = await connectDB();
    await seedDatabase(db);

    // Routes
    app.get('/api', (req, res) => {
      res.json({ message: 'Financial Dashboard API' });
    });

    app.use('/api/transactions', transactionRoutes);
    app.use('/api/insights', insightRoutes);

    // Start server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✓ Server running on http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();