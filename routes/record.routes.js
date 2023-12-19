const express = require('express');
const router = express.Router();

const Doctor = require('../models/doctor.model');

const recordController = require('../controllers/record.controller');
const authController = require('../controllers/auth.controller');

const validateRequest = require('../middlewares/validateRequest');
const createRecordSchema = require('../validation/record/create-record.validation');
const updateRecordSchema = require('../validation/record/update-record.validation');
const sendMessageRecordSchema = require('../validation/record/send-message-record.validation');
const Patient = require('../models/patient.model');

/**
 * @swagger
 * /api/records/owned:
 *  get:
 *   summary: Get all owned records of current logged in doctor
 *   tags: [Record]
 *   responses:
 *    200:
 *     description: success to get all owned records of current logged in doctor.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         status:
 *          type: string
 *         data:
 *          type: array
 *          items:
 *           $ref: '#/components/schemas/record'
 */

router
  .route('/owned')
  .get(
    authController.auth(Doctor),
    authController.getMe,
    recordController.getAllRecordsByDoctorId
  );

/**
 * @swagger
 * /api/records/patient/owned:
 *  get:
 *   summary: Get all owned records of current logged in patient
 *   tags: [Record]
 *   responses:
 *    200:
 *     description: success to owned records of current logged in patient.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         status:
 *          type: string
 *         data:
 *          type: array
 *          items:
 *           $ref: '#/components/schemas/record'
 */

router
  .route('/patient/owned')
  .get(
    authController.auth(Patient),
    authController.getMe,
    recordController.getAllRecordsByPatientId
  );

/**
 * @swagger
 * /api/records/owned/send-message:
 *  patch:
 *   summary: Send message to all owned patients in the records of current logged in doctor
 *   tags: [Record]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/sendMessageRecordSchema'
 *   responses:
 *    204:
 *     description: success to send message to all owned patients of current logged in doctor
 */

router
  .route('/owned/send-message')
  .patch(
    validateRequest(sendMessageRecordSchema),
    authController.auth(Doctor),
    authController.getMe,
    recordController.sendMessageToAllOwnedPatientsOfDoctor
  );

/**
 * @swagger
 * /api/records/owned/send-message/{patientId}:
 *  patch:
 *   summary: Send message one owned patient of current logged in doctor
 *   tags: [Record]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/sendMessageRecordSchema'
 *   responses:
 *    204:
 *     description: success to send message to one owned patient of current logged in doctor.
 */

router
  .route('/owned/send-message/:patientId')
  .patch(
    validateRequest(sendMessageRecordSchema),
    authController.auth(Doctor),
    authController.getMe,
    recordController.sendMessageToOneOwnedPatientOfDoctorByPatientId
  );

/**
 * @swagger
 * /api/records/owned/{patientId}:
 *  get:
 *   summary: Get one owned patient of current logged in doctor
 *   tags: [Record]
 *   responses:
 *    200:
 *     description: success to one all owned patient of current logged in doctor.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         status:
 *          type: string
 *         data:
 *           $ref: '#/components/schemas/record'
 */

router
  .route('/owned/:patientId')
  .get(
    authController.auth(Doctor),
    authController.getMe,
    recordController.getOneRecordsByDoctorAndPatientIds
  )

  /**
   * @swagger
   * /api/records/owned/{patientId}:
   *  patch:
   *   summary: Update one owned patients of current logged in doctor
   *   tags: [Record]
   *   requestBody:
   *    required: true
   *    content:
   *     application/json:
   *      schema:
   *       $ref: '#/components/schemas/updateRecordSchema'
   *   responses:
   *    200:
   *     description: success to update one owned patient of current logged in doctor.
   *     content:
   *      application/json:
   *       schema:
   *        type: object
   *        properties:
   *         status:
   *          type: string

   *         data:
   *          $ref: '#/components/schemas/record'
   */

  .patch(
    validateRequest(updateRecordSchema),
    authController.auth(Doctor),
    authController.getMe,
    recordController.updateOneOwnedPatientOfDoctorByPatientId
  );

/**
 * @swagger
 * /api/records:
 *  post:
 *   summary: Create a record with a patient
 *   tags: [Record]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/createRecordSchema'
 *   responses:
 *    201:
 *     description: success to create a record.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         status:
 *          type: string
 *         data:
 *          $ref: '#/components/schemas/record'
 */

router
  .route('/')
  .post(
    validateRequest(createRecordSchema),
    authController.auth(Doctor),
    recordController.create
  );

module.exports = router;
