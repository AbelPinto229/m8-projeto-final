// backend/routes/clients.js

const express = require('express');
const router  = express.Router();
const clientController = require('../controllers/clientController');

router.get('/',       clientController.getAll);
router.get('/:id',    clientController.getById);

module.exports = router;