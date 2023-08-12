const Doctor = require('../models/doctor.model');
const Patient = require('../models/patient.model');
const Record = require('../models/record.model');
const APIFeatures = require('../utils/APIFeature');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/sendResponse');

class RecordController {
  getAllOwnedPatientsOfDoctor = asyncHandler(
    async (req, res, next) => {
      const APIFeature = new APIFeatures(
        Record.find({
          doctorId: req.params.id,
        }),
        req.query
      );
      const query = APIFeature.filter()
        .sort()
        .select()
        .paginate()
        .getQuery();

      const records = await query.populate({
        path: 'patientId',
        select: 'name email gender dateOfBirth',
      });
      sendSuccess(records, 200, res);
    }
  );

  getOneOwnedPatientOfDoctorByPatientId = asyncHandler(
    async (req, res, next) => {
      const doctorId = req.params.id;
      const patientId = req.params.patientId;

      const record = await Record.findOne({
        doctorId,
        patientId,
      }).populate({
        path: 'patientId',
        select: 'name email gender dateOfBirth',
      });

      if (!record)
        return next(
          new AppError(
            'There is no record between this doctor and this patient',
            404
          )
        );

      sendSuccess(record, 200, res);
    }
  );

  create = asyncHandler(async (req, res, next) => {
    const doctorId = req.body.doctorId;
    if (!(await Doctor.findById(doctorId)))
      return next(new AppError('Doctor not found', 404));

    const patientId = req.body.patientId;
    if (!(await Patient.findById(patientId)))
      return next(new AppError('Patient not found', 404));

    const record = await Record.create(req.body);
    sendSuccess(record, 201, res);
  });

  updateOneOwnedPatientOfDoctorByPatientId = asyncHandler(
    async (req, res, next) => {
      const doctorId = req.params.id;
      const patientId = req.params.patientId;
      const record = await Record.findOneAndUpdate(
        {
          doctorId,
          patientId,
        },
        req.body,

        {
          new: true,
          runValidators: true,
        }
      );

      if (!record)
        return next(
          new AppError(
            'There is no record between this doctor and this patient',
            404
          )
        );

      sendSuccess(record, 200, res);
    }
  );

  sendMessageToOneOwnedPatientOfDoctorByPatientId = asyncHandler(
    async (req, res, next) => {
      const doctorId = req.params.id;
      const patientId = req.params.patientId;
      const record = await Record.findOneAndUpdate(
        {
          doctorId,
          patientId,
        },
        {
          $push: {
            messages: {
              message: req.body.message,
              date: Date.now(),
            },
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!record)
        return next(
          new AppError(
            'There is no record between this doctor and this patient',
            404
          )
        );

      sendSuccess(record, 200, res);
    }
  );

  sendMessageToAllOwnedPatientsOfDoctor = asyncHandler(
    async (req, res, next) => {
      const doctorId = req.params.id;
      const records = await Record.updateMany(
        {
          doctorId,
        },
        {
          $push: {
            messages: {
              message: req.body.message,
              date: Date.now(),
            },
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!records)
        return next(
          new AppError(
            'There is no record between this doctor and this patient',
            404
          )
        );

      sendSuccess(records, 200, res);
    }
  );
}

module.exports = new RecordController();
