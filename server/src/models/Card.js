const mongoose = require('mongoose');

const MetricSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true },
  color: { type: String, default: 'emerald' } // emerald, gold, cyan, slate, red
}, { _id: false });

const CardSchema = new mongoose.Schema({
  nodeId: { type: String, required: true, unique: true },
  nodeCode: { type: String, required: true },
  title: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Digital Transformation', 'Cloud Architecture', 'Cyber Security', 'Enterprise Integration'],
    default: 'Cloud Architecture'
  },
  status: { type: String, default: 'IN PRODUCTION' },
  statusType: { type: String, default: 'production' }, // production, audit, active, synchronized, enforced
  description: { type: String, required: true },
  tags: [{ type: String }],
  metrics: [MetricSchema],
  revision: { type: String, default: 'Rev: 1.00 • Lead Architect' },
  author: { type: String, default: 'Enterprise Architecture Team' },
  position: {
    x: { type: Number, default: 100 },
    y: { type: Number, default: 100 }
  },
  dimensions: {
    width: { type: Number, default: 340 },
    height: { type: Number, default: 280 }
  },
  type: { type: String, enum: ['card', 'note', 'image'], default: 'card' },
  specifications: { type: String, default: '' },
  isPinned: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Card', CardSchema);
