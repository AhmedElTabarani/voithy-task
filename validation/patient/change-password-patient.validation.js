const Joi = require('joi');

const changePasswordPatientSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
});

module.exports = changePasswordPatientSchema;
