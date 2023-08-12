const Doctor = require('../models/doctor.model');
const factory = require('./factory.controller');

class DoctorController {
  // create = factory.create(Doctor);
  getAll = factory.getAll(Doctor);
  getOne = factory.getOne(Doctor);
  update = factory.update(Doctor);
}

module.exports = new DoctorController();
