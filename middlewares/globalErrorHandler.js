const errorDetection = require('../utils/errorDetection');
const { sendError } = require('../utils/sendResponse');

exports.globalErrorHandler = (err, req, res, next) => {
  err = errorDetection(err);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  sendError(err, res);
};
