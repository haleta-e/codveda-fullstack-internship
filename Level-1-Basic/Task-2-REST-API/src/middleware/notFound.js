/**
 * 404 Not Found Middleware
 * Catches any incoming requests that do not match existing routes.
 */
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} - Route not found`,
  });
};

module.exports = notFound;
