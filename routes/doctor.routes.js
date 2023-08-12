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

router
  .route('/signup')
  .post(
    validateRequest(signupDoctorSchema),
    authController.signup(Doctor)
  );
router
  .route('/login')
  .post(
    validateRequest(loginDoctorSchema),
    authController.login(Doctor)
  );

router
  .route('/me')
  .get(
    authController.auth(Doctor),
    authController.getMe,
    doctorController.getOne
  )
  .patch(
    validateRequest(updateDoctorSchema),
    authController.auth(Doctor),
    authController.getMe,
    doctorController.update
  );

router
  .route('/changePassword')
  .patch(
    validateRequest(changePasswordDoctorSchema),
    authController.auth(Doctor),
    authController.updatePassword(Doctor)
  );

module.exports = router;
