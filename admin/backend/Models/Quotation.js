const mongoose = require('mongoose');

const garageSchema = new mongoose.Schema({
  claimId: { type: String, required: true },
  vehicleNumber: { type: String, required: true },
  clientName: { type: String, required: true },
  garageName: { type: String, required: true },
  file: { type: [String], required: false },
  note: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Claimquotations', garageSchema);