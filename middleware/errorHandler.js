const mongoose = require('mongoose');

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = 'Invalid note ID';
  }

  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = Object.values(err.errors)[0].message;
  }

  res.status(statusCode).json({
    success: false,
    message
  });
};

module.exports = errorHandler;
