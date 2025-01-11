const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClaimSchema =  new Schema({
    fullName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    policyNumber: { type: String, required: true },
    incidentDate: { type: Date, required: true },
    claimAmount: { type: Number, required: true },
    description: { type: String, required: true },
    evidence: { type: String }, 
    status: { type: String, default: 'Pending' }
});

const ClaimModel = mongoose.model('claims',ClaimSchema );
module.exports = ClaimModel;


