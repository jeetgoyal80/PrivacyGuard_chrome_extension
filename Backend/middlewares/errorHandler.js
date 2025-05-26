module.exports = (err, req, res, next) => {
  console.error('ErrorHandler:', err);

  // Set default status code if not set
  const statusCode = err.statusCode || 500;
  // In production, you might hide err.stack
  res.status(statusCode).json({
    error: err.message || 'Internal Server Error'
  });
};
