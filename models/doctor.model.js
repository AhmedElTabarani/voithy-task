const mongoose = require('mongoose');
const hashPassword = require('../utils/hashPassword');

const doctorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: { type: String, required: true },
    specialty: { type: String, required: true },
    password: {
      type: String,
      required: true,
      select: false,
    },
    passwordChangedAt: Date,
  },
  { timestamps: true }
);
doctorSchema.pre('save', async function (next) {
  if (!this.isModified('password') && !this.isNew) return next();
  this.password = await hashPassword(this.password);
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

doctorSchema.pre('findOneAndUpdate', async function (next) {
  if (!this._update.password) return next();
  console.log(this._update.password);
  this._update.password = await hashPassword(this._update.password);
  this._update.passwordChangedAt = Date.now() - 1000;
  console.log(this._update.password);
  console.log(this._update.passwordChangedAt);

  next();
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
