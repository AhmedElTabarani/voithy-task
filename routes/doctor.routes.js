const express = require('express');
const router = express.Router();

const Doctor = require('../models/doctor.model');
const doctorController = require('../controllers/doctor.controller');
const authController = require('../controllers/auth.controller');

const validateRequest = require('../middlewares/validateRequest');
const signupDoctorSchema = require('../validation/doctor/signup-doctor.validation');
const loginDoctorSchema = require('../validation/doctor/login-doctor.validation');
const updateDoctorSchema = require('../validation/doctor/update-doctor.validation');
const changePasswordDoctorSchema = require('../validation/doctor/change-password-doctor.validation');

/**
 * @swagger
 * /api/doctors:
 *  get:
 *   summary: Get all doctors
 *   tags: [Doctor]
 *   responses:
 *    200:
 *     description: success to get all doctors.
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
 *           $ref: '#/components/schemas/doctor'
 */

router.route('/').get(doctorController.getAll);

/**
 * @swagger
 * /api/doctors/signup:
 *  post:
 *   summary: Signup a doctor
 *   tags: [Doctor]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/signupDoctorSchema'
 *   responses:
 *    200:
 *     description: success to signup a doctor.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         status:
 *          type: string
 *         token:
 *          type: string
 *          description: The token of the doctor
 *         data:
 *          $ref: '#/components/schemas/doctor'
 */

router
  .route('/signup')
  .post(
    validateRequest(signupDoctorSchema),
    authController.signup(Doctor)
  );

/**
 * @swagger
 * /api/doctors/login:
 *  post:
 *   summary: Login a doctor
 *   tags: [Doctor]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *        $ref: '#/components/schemas/loginDoctorSchema'
 *   responses:
 *    200:
 *     description: success to login a doctor.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         status:
 *          type: string
 *         token:
 *          type: string
 *          description: The token of the doctor
 *         data:
 *          $ref: '#/components/schemas/doctor'
 */

router
  .route('/login')
  .post(
    validateRequest(loginDoctorSchema),
    authController.login(Doctor)
  );

/**
 * @swagger
 * /api/doctors/me:
 *  get:
 *   summary: Get the current logged in doctor
 *   tags: [Doctor]
 *   responses:
 *    200:
 *     description: success to get the current logged in doctor.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         status:
 *          type: string
 *         token:
 *          type: string
 *          description: The token of the doctor
 *         data:
 *          $ref: '#/components/schemas/doctor'
 */

router
  .route('/me')
  .get(
    authController.auth(Doctor),
    authController.getMe,
    doctorController.getOne
  )

  /**
   * @swagger
   * /api/doctors/me:
   *  patch:
   *   summary: Update the current logged in doctor
   *   tags: [Doctor]
   *   requestBody:
   *    required: true
   *   content:
   *    application/json:
   *     schema:
   *      $ref: '#/components/schemas/updateDoctorSchema'
   *   responses:
   *    200:
   *     description: success to update the current logged in doctor.
   *     content:
   *      application/json:
   *       schema:
   *        type: object
   *        properties:
   *         status:
   *          type: string
   *         token:
   *          type: string
   *          description: The token of the doctor
   *         data:
   *          $ref: '#/components/schemas/doctor'
   */

  .patch(
    validateRequest(updateDoctorSchema),
    authController.auth(Doctor),
    authController.getMe,
    doctorController.update
  );

/**
 * @swagger
 * /api/doctors/changePassword:
 *  patch:
 *   summary: Change the password of the current logged in doctor
 *   tags: [Doctor]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/changePasswordDoctorSchema'
 *   responses:
 *    200:
 *     description: success to change the password of the current logged in doctor.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         status:
 *          type: string
 *         data:
 *          $ref: '#/components/schemas/doctor'
 */

router
  .route('/changePassword')
  .patch(
    validateRequest(changePasswordDoctorSchema),
    authController.auth(Doctor),
    authController.updatePassword(Doctor)
  );

module.exports = router;
