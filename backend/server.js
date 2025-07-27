const app = require('./src/app');
const Logger = require('./src/utils/logger');

const PORT = process.env.PORT || 3000;

// Validate environment
if (!process.env.GEMINI_API_KEY) {
  Logger.error('GEMINI_API_KEY not set in environment variables.');
  process.exit(1);
}

// Start server
app.listen(PORT, () => {
  Logger.info(`Rephraser backend server running on port ${PORT}`);
  Logger.info(`Health check available at http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  Logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  Logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
}); 