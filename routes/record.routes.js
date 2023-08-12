const express = require('express');
const router = express.Router();

const Doctor = require('../models/doctor.model');

const recordController = require('../controllers/record.controller');
const authController = require('../controllers/auth.controller');

const validateRequest = require('../middlewares/validateRequest');
const createRecordSchema = require('../validation/record/create-record.validation');
const updateRecordSchema = require('../validation/record/update-record.validation');
const sendMessageRecordSchema = require('../validation/record/send-message-record.validation');

router
  .route('/owned')
  .get(
    authController.auth(Doctor),
    authController.getMe,
    recordController.getAllOwnedPatientsOfDoctor
  );

router
  .route('/owned/send-message')
  .patch(
    validateRequest(sendMessageRecordSchema),
    authController.auth(Doctor),
    authController.getMe,
    recordController.sendMessageToAllOwnedPatientsOfDoctor
  );

router
  .route('/owned/send-message/:patientId')
  .patch(
    validateRequest(sendMessageRecordSchema),
    authController.auth(Doctor),
    authController.getMe,
    recordController.sendMessageToOneOwnedPatientOfDoctorByPatientId
  );

router
  .route('/owned/:patientId')
  .get(
    authController.auth(Doctor),
    authController.getMe,
    recordController.getOneOwnedPatientOfDoctorByPatientId
  )
  .patch(
    validateRequest(updateRecordSchema),
    authController.auth(Doctor),
    authController.getMe,
    recordController.updateOneOwnedPatientOfDoctorByPatientId
  );

router.route('/').post(
  validateRequest(createRecordSchema),
  // TODO: should be a invitation system to create a record between doctor and a patient
  authController.auth(Doctor),
  recordController.create
);

module.exports = router;
