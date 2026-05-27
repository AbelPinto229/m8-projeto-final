// backend/routes/cards.js

const express = require('express');
const router  = express.Router();

router.get('/',           cardController.getAll);
router.get('/by-client', cardController.getByClient);

module.exports = router;