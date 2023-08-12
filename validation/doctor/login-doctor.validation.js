const Joi = require('joi');

const loginDoctorSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = loginDoctorSchema;
