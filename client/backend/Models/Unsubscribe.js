const { required } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const unsubscribeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', required: true },
  subscriptionEndDate: { type: String,  },
  unsubscribeDate: { 
    type: String, 
    default: () => {
      const today = new Date();
      return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    },
  },
  reason: { type: String, required :true}, // Reason for unsubscribing
  clientInfo: {
    fullName: { type: String,  },
    dateOfBirth: { type: String,  },
    identificationNumber: { type: String,  },
    contactNumber: { type: String,  },
    emailAddress: { type: String, },
    permanentAddress: { type: String, },
  },
  vehicleDetails: {
    registrationNumber: { type: String, },
    model: { type: String, },
    color: { type: String, },
    type: { type: String,},
    chassisNumber: { type: String,},
    engineCapacity: { type: String, },
    fuelType: { type: String, },
  },
  paymentInfo: {
    cardHolderName: String,
    cardNumber: String,
    expiryDate: String,
    cvv: String,
    price: String,
    paymentDate: String,
    isExpired: Boolean,
  },
}, { timestamps: true }); // Adds createdAt and updatedAt fields

module.exports = mongoose.model('Unsubscribe', unsubscribeSchema, 'unsubscribedPlans');
