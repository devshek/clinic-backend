/* =========================================================
   GLOBAL ERROR HANDLER
========================================================= */

const errorHandler = (err, req, res, next) => {

  const statusCode = res.statusCode && res.statusCode !== 200
    ? res.statusCode
    : 500;

  const response = {
    success: false,
    message: err.message || "Server Error",
  };

  // Show stack only in development
  if (process.env.NODE_ENV !== "production") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;