const Doctor = require('../models/doctor.model');
const Patient = require('../models/patient.model');
const Record = require('../models/record.model');
const APIFeatures = require('../utils/APIFeature');
const AppError = require('../utils/AppError');
const sendEmailNotificationToPatient = require('../utils/EmailService');
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
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return next(new AppError('Doctor not found', 404));

    const patientId = req.body.patientId;
    const patient = await Patient.findById(patientId);
    if (!patient) return next(new AppError('Patient not found', 404));

    const record = await Record.create(req.body);

    await sendEmailNotificationToPatient({
      to: patient.email,
      subject: 'You have connected with a doctor',
      message: `You have connected with Dr. ${doctor.name}`,
      patient: patient.name,
      doctor: doctor.name,
      from: doctor.email,
    });
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
      ).populate({
        path: 'patientId',
        select: 'name email',
      });

      if (!record)
        return next(
          new AppError(
            'There is no record between this doctor and this patient',
            404
          )
        );

      await sendEmailNotificationToPatient({
        to: record.patientId.email,
        subject: 'Your record has been updated',
        message: `Your ${Object.keys(req.body).join(', ')} with Dr. ${req.user.name} has been updated`,
        patient: record.patientId.name,
        doctor: req.user.name,
        from: req.user.email,
      });

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
      ).populate({
        path: 'patientId',
        select: 'name email',
      });

      if (!record)
        return next(
          new AppError(
            'There is no record between this doctor and this patient',
            404
          )
        );

      await sendEmailNotificationToPatient({
        to: record.patientId.email,
        subject: 'You have a new message from your doctor',
        message: req.body.message,
        patient: record.patientId.name,
        doctor: req.user.name,
        from: req.user.email,
      });
      sendSuccess(null, 204, res);
    }
  );

  sendMessageToAllOwnedPatientsOfDoctor = asyncHandler(
    async (req, res, next) => {
      const doctorId = req.params.id;
      const updatedResult = await Record.updateMany(
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

      if (updatedResult.matchedCount === 0)
        return next(
          new AppError(
            'You have noy any patients to send message to',
            404
          )
        );

      const records = await Record.find({
        doctorId,
      }).populate({
        path: 'patientId',
        select: 'name email',
      });

      await Promise.all(
        records.map((record) =>
          sendEmailNotificationToPatient({
            to: record.patientId.email,
            subject: 'You have a new message from your doctor',
            message: req.body.message,
            patient: record.patientId.name,
            doctor: req.user.name,
            from: req.user.email,
          })
        )
      );

      sendSuccess(null, 204, res);
    }
  );
}

module.exports = new RecordController();
