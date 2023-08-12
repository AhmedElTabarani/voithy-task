const mongoose = require('mongoose');

const recordSchema = mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    notes: { type: String, required: true },
    sessionDate: { type: Date, required: true },
    treatment: { type: String, required: true },
    messages: [
      {
        text: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Record = mongoose.model('Record', recordSchema);

module.exports = Record;
