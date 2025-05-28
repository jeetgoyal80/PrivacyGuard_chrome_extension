const mongoose = require('mongoose');

const consentLogSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  service: { 
    type: String, 
    required: true,
    trim: true 
  },
  // now store each permission as object with name+granted boolean
  dataShared: [{
    permission: { type: String, required: true },
    granted:    { type: Boolean, required: true }
  }],
  consentGiven: { // overall consent flag
    type: Boolean,
    required: true
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
},{ optimisticConcurrency: true });

module.exports = mongoose.models.ConsentLog || mongoose.model('ConsentLog', consentLogSchema);