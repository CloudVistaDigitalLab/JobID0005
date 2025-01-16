const mongoose = require('mongoose');

// Payment Schema
const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  policyId: { type: String, required: true },
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
    vehicleNumber: { type: String, required: true },
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
    price: String,
    paymentDate: {
      type: String,
      required: true,
      default: () => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      },
    },
    isExpired: { type: Boolean, default: false },
    subscriptionEndDate: { 
      type: Date, 
      default: function () {
        const paymentDate = new Date(this.paymentInfo.paymentDate);
        paymentDate.setFullYear(paymentDate.getFullYear() + 1);
    
        
        const formattedDate = `${paymentDate.getFullYear()}-${String(paymentDate.getMonth() + 1).padStart(2, '0')}-${String(paymentDate.getDate()).padStart(2, '0')}`;
    
        return formattedDate;
      }
    }
    
  },
});

const Payment = mongoose.model('Payment', paymentSchema, 'insurancePaymentsPlans');

// Policy Counter Schema
const policyCounterSchema = new mongoose.Schema({
  modelName: { type: String, required: true },
  sequenceValue: { type: Number, required: true },
});

const PolicyCounter = mongoose.model('PolicyCounter', policyCounterSchema);

module.exports = { Payment, PolicyCounter };
