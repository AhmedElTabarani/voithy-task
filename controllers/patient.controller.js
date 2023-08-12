const Patient = require('../models/patient.model');
const factory = require('./factory.controller');

class PatientController {
  getAll = factory.getAll(Patient);
  create = factory.create(Patient);
  getOne = factory.getOne(Patient);
  update = factory.update(Patient);
}

module.exports = new PatientController();
