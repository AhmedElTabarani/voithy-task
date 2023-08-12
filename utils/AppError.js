class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 500;
    this.status = `${statusCode}`[0] === '4' ? 'fail' : 'error';

    this.isAppError = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
