const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  clientInfo: {
    fullName: String,
    dateOfBirth: String,
    identificationNumber: String,
    contactNumber: String,
    emailAddress: String,
    permanentAddress: String,
  },
  vehicleDetails: {
    registrationNumber: { type: String, required: true },
    model: { type: String, required: true },
    color: { type: String, required: true },
    type: { type: String, required: true },
    chassisNumber: { type: String, required: true },
    engineCapacity: { type: String, required: true },
    fuelType: { type: String, required: true },
  },
  paymentInfo: {
    cardHolderName: String,
    cardNumber: String,
    expiryDate: String,
    cvv: String,
  },
});

module.exports = mongoose.model('Payment', paymentSchema, 'paymentsPlans');
