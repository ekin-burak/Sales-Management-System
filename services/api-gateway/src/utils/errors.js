const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
    timestamp: new Date().toISOString()
  });
};

module.exports = { errorHandler }; 