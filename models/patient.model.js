const mongoose = require('mongoose');
const hashPassword = require('../utils/hashPassword');

const patientSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: { type: String, required: true, unique: true },
    dateOfBirth: { type: Date, required: true },
    gender: {
      type: String,
      enum: ['male', 'female'],
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    passwordChangedAt: Date,
  },

  { timestamps: true }
);

patientSchema.pre('save', async function (next) {
  if (
    !this.isModified('password') &&
    !this.isNew /* '!isNew' for hash the default password */
  )
    return next();
  this.password = await hashPassword(this.password);
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

patientSchema.pre('findOneAndUpdate', async function (next) {
  if (!this._update.password) return next();
  this._update.password = await hashPassword(this._update.password);
  this._update.passwordChangedAt = Date.now() - 1000;

  next();
});

const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;
