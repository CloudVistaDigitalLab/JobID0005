const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const claimIdCounterSchema = new Schema({
  modelName: { type: String, required: true, unique: true },
  sequenceValue: { type: Number, required: true, default: 0 },
});

module.exports = mongoose.model('ClaimIdCounter', claimIdCounterSchema);
