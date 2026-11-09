import { validationResult } from 'express-validator';
import { ApiError } from '../utils/ApiError.js';

/**
 * Convert express-validator errors into a single readable message.
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const message = errors
    .array()
    .map((error) => error.msg)
    .join(', ');

  next(new ApiError(400, message));
};
