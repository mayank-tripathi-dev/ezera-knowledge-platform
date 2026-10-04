const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');

router.get('/', boardController.getBoard);
router.put('/', boardController.updateBoard);

module.exports = router;
