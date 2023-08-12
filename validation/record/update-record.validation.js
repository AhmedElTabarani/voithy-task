const Joi = require('joi');

const updateRecordSchema = Joi.object({
  notes: Joi.string(),
  sessionDate: Joi.date(),
  treatment: Joi.string(),
});

module.exports = updateRecordSchema;
