/**
 * Centralized Error Handling Middleware
 * Ensures consistent JSON error responses and protects sensitive system details.
 */
const errorHandler = (err, req, res, next) => {
  // Default error values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || null;

  // PostgreSQL Error Handling
  if (err.code) {
    switch (err.code) {
      case '22P02': // Invalid text representation (e.g. invalid integer syntax)
        statusCode = 400;
        message = 'Invalid data format or parameter type provided.';
        break;
      case '23502': // NOT NULL violation
        statusCode = 400;
        message = `Required field missing: ${err.column || 'check your input data'}.`;
        break;
      case '23514': // CHECK constraint violation
        statusCode = 400;
        message = 'Input violates database validation constraints (e.g., invalid opportunity type).';
        break;
      case '23505': // Unique constraint violation
        statusCode = 400;
        message = 'A record with duplicate unique values already exists.';
        break;
      case 'ECONNREFUSED':
      case 'ENOTFOUND':
        statusCode = 500;
        message = 'Unable to establish database connection. Please verify database server status.';
        break;
      default:
        // Do not leak raw database credentials or internal errors
        statusCode = 500;
        message = 'A database error occurred while processing the request.';
        break;
    }
  }

  // Syntax error in JSON body parsing
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    message = 'Malformed JSON payload in request body.';
  }

  const response = {
    success: false,
    message,
  };

  if (errors && errors.length > 0) {
    response.errors = errors;
  }

  // Only include stack trace if explicitly in development and not a database connection issue
  if (process.env.NODE_ENV === 'development' && statusCode !== 500) {
    response.debug = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
