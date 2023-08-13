const m2s = require('mongoose-to-swagger');
const j2s = require('joi-to-swagger');

const doctor = m2s(require('../models/doctor.model'));
const patient = m2s(require('../models/patient.model'));
const record = m2s(require('../models/record.model'));

const { swagger: createRecordSchema } = j2s(
  require('../validation/record/create-record.validation')
);
const { swagger: updateRecordSchema } = j2s(
  require('../validation/record/update-record.validation')
);
const { swagger: sendMessageRecordSchema } = j2s(
  require('../validation/record/send-message-record.validation')
);
const { swagger: signupDoctorSchema } = j2s(
  require('../validation/doctor/signup-doctor.validation')
);
const { swagger: loginDoctorSchema } = j2s(
  require('../validation/doctor/login-doctor.validation')
);
const { swagger: updateDoctorSchema } = j2s(
  require('../validation/doctor/update-doctor.validation')
);
const { swagger: changePasswordDoctorSchema } = j2s(
  require('../validation/doctor/change-password-doctor.validation')
);
const { swagger: signupPatientSchema } = j2s(
  require('../validation/patient/signup-patient.validation')
);
const { swagger: loginPatientSchema } = j2s(
  require('../validation/patient/login-patient.validation')
);
const { swagger: updatePatientSchema } = j2s(
  require('../validation/patient/update-patient.validation')
);
const { swagger: changePasswordPatientSchema } = j2s(
  require('../validation/patient/change-password-patient.validation')
);

module.exports = {
  doctor,
  patient,
  record,
  createRecordSchema,
  updateRecordSchema,
  sendMessageRecordSchema,
  signupDoctorSchema,
  loginDoctorSchema,
  updateDoctorSchema,
  changePasswordDoctorSchema,
  signupPatientSchema,
  loginPatientSchema,
  updatePatientSchema,
  changePasswordPatientSchema,
};
