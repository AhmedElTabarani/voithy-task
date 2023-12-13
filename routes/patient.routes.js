const router = require('express').Router();

const Patient = require('../models/patient.model');
const patientController = require('../controllers/patient.controller');
const authController = require('../controllers/auth.controller');

const validateRequest = require('../middlewares/validateRequest');
const signupPatientSchema = require('../validation/patient/signup-patient.validation');
const loginPatientSchema = require('../validation/patient/login-patient.validation');
const updatePatientSchema = require('../validation/patient/update-patient.validation');
const changePasswordPatientSchema = require('../validation/patient/change-password-patient.validation');

/**
 * @swagger
 * /api/patients/signup:
 *  post:
 *   summary: Signup a patient
 *   tags: [Patient]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/signupPatientSchema'
 *   responses:
 *    200:
 *     description: success to signup a patient.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         status:
 *          type: string
 *         token:
 *          type: string
 *          description: The token of the patient
 *         data:
 *          $ref: '#/components/schemas/patient'
 */

router
  .route('/signup')
  .post(
    validateRequest(signupPatientSchema),
    authController.signup(Patient)
  );

/**
 * @swagger
 * /api/patients/login:
 *  post:
 *   summary: Login a patient
 *   tags: [Patient]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *        $ref: '#/components/schemas/loginPatientSchema'
 *   responses:
 *    200:
 *     description: success to login a patient.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         status:
 *          type: string
 *         token:
 *          type: string
 *          description: The token of the patient
 *         data:
 *          $ref: '#/components/schemas/patient'
 */

router
  .route('/login')
  .post(
    validateRequest(loginPatientSchema),
    authController.login(Patient)
  );

/**
 * @swagger
 * /api/patients/me:
 *  get:
 *   summary: Get the current logged in patient
 *   tags: [Patient]
 *   responses:
 *    200:
 *     description: success to get the current logged in patient.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         status:
 *          type: string
 *         token:
 *          type: string
 *          description: The token of the patient
 *         data:
 *          $ref: '#/components/schemas/patient'
 */

router
  .route('/me')
  .get(
    authController.auth(Patient),
    authController.getMe,
    patientController.getOne
  )

  /**
   * @swagger
   * /api/patients/me:
   *  patch:
   *   summary: Update the current logged in patient
   *   tags: [Patient]
   *   requestBody:
   *    required: true
   *   content:
   *    application/json:
   *     schema:
   *      $ref: '#/components/schemas/updatePatientSchema'
   *   responses:
   *    200:
   *      description: success to update the current logged in patient.
   *      content:
   *       application/json:
   *        schema:
   *         type: object
   *         properties:
   *          status:
   *            type: string
   *          token:
   *            type: string
   *            description: The token of the patient
   *          data:
   *            $ref: '#/components/schemas/patient'
   */

  .patch(
    validateRequest(updatePatientSchema),
    authController.auth(Patient),
    authController.getMe,
    patientController.update
  );

/**
 * @swagger
 * /api/patients/changePassword:
 *  patch:
 *   summary: Change the password of the current logged in patient
 *   tags: [Patient]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/changePasswordPatientSchema'
 *   responses:
 *    200:
 *     description: success to change the password of the current logged in patient.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         status:
 *          type: string
 *         data:
 *          $ref: '#/components/schemas/patient'
 */

router
  .route('/changePassword')
  .patch(
    validateRequest(changePasswordPatientSchema),
    authController.auth(Patient),
    authController.updatePassword(Patient)
  );

module.exports = router;
