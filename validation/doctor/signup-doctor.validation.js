const Joi = require('joi');

const signupDoctorSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  phone: Joi.string().required(),
  specialty: Joi.string().required(),
});

module.exports = signupDoctorSchema;
