const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const claimSchema = new mongoose.Schema({
  claimId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  policyNumber: { type: String, required: true },
  incidentDate: { type: Date, required: true },
  claimAmount: { type: Number, required: true },
  description: { type: String, required: true },
  uploadedURLs: { type: [String], required: true },              
});

module.exports = mongoose.model('Claim', claimSchema);
