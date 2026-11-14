const express = require('express');
const cors = require('cors');
const opportunityRoutes = require('./routes/opportunityRoutes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'UP',
    service: 'Menged Opportunity Discovery REST API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Root API Information Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Menged REST API (Codveda Level 1 - Task 2)',
    documentation: '/api/health or view README.md',
    endpoints: {
      health: 'GET /api/health',
      opportunities: {
        getAll: 'GET /api/opportunities',
        getById: 'GET /api/opportunities/:id',
        create: 'POST /api/opportunities',
        update: 'PUT /api/opportunities/:id',
        delete: 'DELETE /api/opportunities/:id',
      },
    },
  });
});

// API Routes
app.use('/api/opportunities', opportunityRoutes);

// 404 Route Handler
app.use(notFound);

// Centralized Error Handler Middleware
app.use(errorHandler);

module.exports = app;
