const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');

router.get('/', cardController.getAllCards);
router.post('/', cardController.createCard);
router.post('/auto-arrange', cardController.autoArrangeCards);
router.post('/reset', cardController.resetBoardCards);
router.put('/:nodeId', cardController.updateCard);
router.put('/:nodeId/position', cardController.updateCardPosition);
router.delete('/:nodeId', cardController.deleteCard);

module.exports = router;
