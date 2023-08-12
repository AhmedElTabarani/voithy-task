const Joi = require('joi');

const createRecordSchema = Joi.object({
  doctorId: Joi.string().required(),
  patientId: Joi.string().required(),
  notes: Joi.string().required(),
  sessionDate: Joi.date().required(),
  treatment: Joi.string().required(),
});

module.exports = createRecordSchema;
