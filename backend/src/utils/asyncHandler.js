/**
 * Wraps async Express route handlers to ensure rejected promises are caught
 * and forwarded to next(err) in Express 4.
 *
 * @param {Function} fn Async route handler function (req, res, next)
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;

