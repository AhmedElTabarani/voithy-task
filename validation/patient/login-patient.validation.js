const Joi = require('joi');

const loginPatientSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = loginPatientSchema;
