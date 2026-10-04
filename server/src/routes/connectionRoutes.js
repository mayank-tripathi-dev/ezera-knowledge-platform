const express = require('express');
const router = express.Router();
const connectionController = require('../controllers/connectionController');

router.get('/', connectionController.getAllConnections);
router.post('/', connectionController.createConnection);
router.delete('/:connectionId', connectionController.deleteConnection);

module.exports = router;
