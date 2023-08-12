const Record = require('../models/record.model');
const APIFeatures = require('../utils/APIFeature');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/sendResponse');
const factory = require('./factory.controller');

class RecordController {
  // getAll = factory.getAll(Record);
  getAllByPatientId = asyncHandler(async (req, res, next) => {
    const APIFeature = new APIFeatures(
      Record.find({
        patientId: req.params.patientId,
      }),
      req.query
    );
    const query = APIFeature.filter()
      .sort()
      .select()
      .paginate()
      .getQuery();

    const docs = await query;
    sendSuccess(docs, 200, res);
  });

  getAllByDoctorId = asyncHandler(async (req, res, next) => {
    const APIFeature = new APIFeatures(
      Record.find({
        doctorId: req.params.doctorId,
      }),
      req.query
    );
    const query = APIFeature.filter()
      .sort()
      .select()
      .paginate()
      .getQuery();

    const docs = await query;
    sendSuccess(docs, 200, res);
  });

  create = factory.create(Record);
  getOne = factory.getOne(Record);
  update = factory.update(Record);
  isValid = factory.isValidId(Record);
}

module.exports = new RecordController();
