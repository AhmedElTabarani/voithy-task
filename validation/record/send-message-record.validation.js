const Joi = require('joi');

const sendMessageRecordSchema = Joi.object({
  message: Joi.string().required(),
});

module.exports = sendMessageRecordSchema;
