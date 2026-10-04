const mongoose = require('mongoose');

const ConnectionSchema = new mongoose.Schema({
  connectionId: { type: String, required: true, unique: true },
  sourceNodeId: { type: String, required: true },
  targetNodeId: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['Active Production', 'Zero-Trust Encryption', 'Compliance & Governance'],
    default: 'Active Production'
  },
  label: { type: String, default: 'Sync' },
  status: { type: String, default: 'Continuous' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Connection', ConnectionSchema);
