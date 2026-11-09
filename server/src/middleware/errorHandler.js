import { ApiError } from '../utils/ApiError.js';
import { isProduction } from '../config/env.js';

export const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) return next(error);

  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal server error';

  // Mongoose validation errors
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(error.errors)
      .map((item) => item.message)
      .join(', ');
  }

  // Mongoose invalid ObjectId
  if (error.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${error.path}: ${error.value}`;
  }

  // Duplicate key (e.g. username already taken)
  if (error.code === 11000) {
    statusCode = 409;
    message = `Duplicate value for: ${Object.keys(error.keyValue).join(', ')}`;
  }

  if (statusCode >= 500) {
    console.error(error);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(isProduction ? {} : { stack: error.stack }),
  });
};
