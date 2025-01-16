const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Counter schema to track the policy ID increment
const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  sequence_value: { type: Number, default: 0 }
});

// Create the Counter model
const Counter = mongoose.model('Counter', counterSchema);

module.exports = Counter;
