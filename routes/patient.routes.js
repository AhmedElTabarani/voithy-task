const router = require('express').Router();

const Doctor = require('../models/doctor.model');
const Patient = require('../models/patient.model');
const patientController = require('../controllers/patient.controller');
const authController = require('../controllers/auth.controller');

const validateRequest = require('../middlewares/validateRequest');
const signupPatientSchema = require('../validation/patient/signup-patient.validation');
const loginPatientSchema = require('../validation/patient/login-patient.validation');
const updatePatientSchema = require('../validation/patient/update-patient.validation');
const changePasswordPatientSchema = require('../validation/patient/change-password-patient.validation');

router
  .route('/signup')
  .post(
    validateRequest(signupPatientSchema),
    authController.signup(Patient)
  );
router
  .route('/login')
  .post(
    validateRequest(loginPatientSchema),
    authController.login(Patient)
  );

router
  .route('/me')
  .get(
    authController.auth(Patient),
    authController.getMe,
    patientController.getOne
  )
  .patch(
    validateRequest(updatePatientSchema),
    authController.auth(Patient),
    authController.getMe,
    patientController.update
  );

router
  .route('/changePassword')
  .patch(
    validateRequest(changePasswordPatientSchema),
    authController.auth(Patient),
    authController.updatePassword(Patient)
  );

module.exports = router;
