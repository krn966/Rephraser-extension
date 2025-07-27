const express = require('express');
require('dotenv').config();

const GeminiService = require('./services/geminiService');
const RephraseController = require('./controllers/rephraseController');
const { validateRephraseRequest } = require('./middleware/validation');
const errorHandler = require('./middleware/errorHandler');
const Logger = require('./utils/logger');

// Initialize services
const geminiService = new GeminiService(process.env.GEMINI_API_KEY);
const rephraseController = new RephraseController(geminiService);

// Create Express app
const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS middleware for browser extensions
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Routes
app.post('/rephrase', validateRephraseRequest, (req, res) => {
  rephraseController.rephrase(req, res);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    availableEndpoints: ['POST /rephrase', 'GET /health']
  });
});

module.exports = app; 