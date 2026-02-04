// /middleware/errorHandler.js
export const errorHandler = (err, req, res, next) => {
    // Default error response
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    const status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
  
    // Send the error response
    res.status(statusCode).json({
      status: status,
      message: message,
    });
  };