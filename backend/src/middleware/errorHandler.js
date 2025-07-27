/**
 * Global error handling middleware
 */
function errorHandler(err, req, res, next) {
  console.error('Error:', err);
  
  // Default error
  let statusCode = 500;
  let message = 'Internal Server Error';
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
  } else if (err.message && err.message.includes('Gemini API error')) {
    statusCode = 502;
    message = 'External API error';
  }
  
  res.status(statusCode).json({
    error: message,
    timestamp: new Date().toISOString()
  });
}

module.exports = errorHandler; 