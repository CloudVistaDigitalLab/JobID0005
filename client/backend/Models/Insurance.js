const mongoose = require('mongoose');

const insuranceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true }, 
  coverage: { type: String, required: true },
  benefits: { type: String, required: true },
  image: { type: String, required: true }, 
});

module.exports = mongoose.model('Insurance', insuranceSchema);

