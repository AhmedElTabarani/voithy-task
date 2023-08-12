const AppError = require('../utils/AppError');

module.exports = validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error)
      return next(new AppError(error.details[0].message, 400));

    next();
  };
};
