const Joi = require('joi');

const updatePatientSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  dateOfBirth: Joi.date(),
  gender: Joi.string().valid('male', 'female'),
});

module.exports = updatePatientSchema;
