const express = require('express');
const router = express.Router();

const Doctor = require('../models/doctor.model');

const recordController = require('../controllers/record.controller');
const authController = require('../controllers/auth.controller');

const validateRequest = require('../middlewares/validateRequest');
const createRecordSchema = require('../validation/record/create-record.validation');
const updateRecordSchema = require('../validation/record/update-record.validation');
const sendMessageRecordSchema = require('../validation/record/send-message-record.validation');

/**
 * @swagger
 * /api/records/owned:
 *  get:
 *   summary: Get all owned patients of doctor
 *   tags: [Record]
 *   responses:
 *    200:
 *     description: success to get all owned patients of doctor.
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
    recordController.getAllOwnedPatientsOfDoctor
  );

/**
 * @swagger
 * /api/records/owned/send-message:
 *  patch:
 *   summary: Send message to all owned patients of doctor
 *   tags: [Record]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/sendMessageRecordSchema'
 *   responses:
 *    204:
 *     description: success to send message to all owned patients of doctor.
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
 *   summary: Send message one owned patient of doctor
 *   tags: [Record]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/sendMessageRecordSchema'
 *   responses:
 *    204:
 *     description: success to send message to one owned patient of doctor.
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
 *   summary: Get one owned patients of doctor
 *   tags: [Record]
 *   responses:
 *    200:
 *     description: success to one all owned patient of doctor.
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
    recordController.getOneOwnedPatientOfDoctorByPatientId
  )

  /**
   * @swagger
   * /api/records/owned/{patientId}:
   *  patch:
   *   summary: Update one owned patients of doctor
   *   tags: [Record]
   *   requestBody:
   *    required: true
   *    content:
   *     application/json:
   *      schema:
   *       $ref: '#/components/schemas/updateRecordSchema'
   *   responses:
   *    200:
   *     description: success to update one owned patient of doctor.
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
 *   summary: Create a record
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

router.route('/').post(
  validateRequest(createRecordSchema),
  // TODO: should be a invitation system to create a record between doctor and a patient
  authController.auth(Doctor),
  recordController.create
);

module.exports = router;
