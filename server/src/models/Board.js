const mongoose = require('mongoose');

const BoardSchema = new mongoose.Schema({
  boardId: { type: String, required: true, unique: true, default: 'global-hyper-mesh' },
  name: { type: String, default: 'Architecting Enterprise Digital Knowledge' },
  topologyLayer: { type: String, default: 'Layer: L3 - Global Hyper-Mesh' },
  subtitle: { 
    type: String, 
    default: 'Spatial canvas for international technology consulting architecture, enterprise solution topology, and cloud governance frameworks.' 
  },
  telemetryThreshold: { type: Number, default: 15 },
  activeMeshFilters: {
    productionSplines: { type: Boolean, default: true },
    zeroTrustRoutes: { type: Boolean, default: true },
    complianceNodes: { type: Boolean, default: true }
  },
  zoom: { type: Number, default: 1.0 },
  pan: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 }
  },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Board', BoardSchema);
