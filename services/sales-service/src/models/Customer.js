const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// This is a reference model only, not meant to be used for CRUD operations
// It's just to allow population of customer references in the Sale model
const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer; 