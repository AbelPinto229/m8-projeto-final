const express = require('express');
const router = express.Router();
const { create } = require('../controllers/contactController');

router.post('/', create);

module.exports = router;
