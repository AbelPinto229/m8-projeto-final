// backend/routes/cards.js

const express = require('express');
const router  = express.Router();
const cardController = require('../controllers/cardController');

router.get('/',           cardController.getAll);
router.get('/by-client', cardController.getByClient);
router.get('/:id',        cardController.getById);
router.post('/',          cardController.create);
router.put('/:id',        cardController.update);
router.patch('/:id/status', cardController.updateStatus);
router.delete('/:id',     cardController.remove);

module.exports = router;