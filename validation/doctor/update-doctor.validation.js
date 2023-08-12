const Joi = require('joi');

const updateDoctorSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
  specialty: Joi.string(),
});

module.exports = updateDoctorSchema;
