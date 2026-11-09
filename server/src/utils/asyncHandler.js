/**
 * Wrap async controllers so rejected promises reach the error middleware.
 */
export const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);
