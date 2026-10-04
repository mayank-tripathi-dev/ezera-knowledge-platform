const Connection = require('../models/Connection');
const { getMemoryStoreStatus } = require('../config/db');
const { initialConnections } = require('../utils/seedData');

let memoryConnectionsStore = [...initialConnections];

exports.getAllConnections = async (req, res) => {
  try {
    if (getMemoryStoreStatus()) {
      return res.json(memoryConnectionsStore);
    }
    let connections = await Connection.find({});
    if (!connections || connections.length === 0) {
      connections = await Connection.insertMany(initialConnections);
      memoryConnectionsStore = connections.map(c => c.toObject());
    }
    res.json(connections);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving connections.' });
  }
};

exports.createConnection = async (req, res) => {
  try {
    const { sourceNodeId, targetNodeId, type, label } = req.body;
    if (!sourceNodeId || !targetNodeId) {
      return res.status(400).json({ message: 'sourceNodeId and targetNodeId are required.' });
    }

    const connectionId = 'conn-' + Date.now();
    const newConn = {
      connectionId,
      sourceNodeId,
      targetNodeId,
      type: type || 'Active Production',
      label: label || 'Sync Route',
      status: 'Active'
    };

    if (getMemoryStoreStatus()) {
      memoryConnectionsStore.push(newConn);
      return res.status(201).json(newConn);
    }

    const created = await Connection.create(newConn);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: 'Error creating spline connection.' });
  }
};

exports.deleteConnection = async (req, res) => {
  try {
    const { connectionId } = req.params;

    if (getMemoryStoreStatus()) {
      memoryConnectionsStore = memoryConnectionsStore.filter(c => c.connectionId !== connectionId);
      return res.json({ success: true, connectionId });
    }

    await Connection.findOneAndDelete({ connectionId });
    res.json({ success: true, connectionId });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting connection.' });
  }
};
