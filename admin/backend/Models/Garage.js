const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GarageSchema =  new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true, 
    unique: true, 
  },
  password: {
    type: String,
    required: true,     
  }
});

const GarageModel = mongoose.model('admins', GarageSchema );
module.exports = GarageModel;