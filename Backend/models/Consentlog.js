const mongoose = require('mongoose');

const consentLogSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  service: { // this replaces "website"
    type: String, 
    required: true,
    trim: true 
  },
  dataShared: [{  // this replaces dataRequested/dataGranted
    type: String 
  }],
  consentGiven: { // true or false
    type: Boolean,
    required: true
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('ConsentLog', consentLogSchema);
