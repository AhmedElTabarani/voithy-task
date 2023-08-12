const Joi = require('joi');

const signupPatientSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  dateOfBirth: Joi.date().required(),
  gender: Joi.string().valid('male', 'female').required(),
});

module.exports = signupPatientSchema;
