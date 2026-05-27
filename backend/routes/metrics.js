// backend/routes/metrics.js

const express = require('express');
const router  = express.Router();
const metricController = require('../controllers/metricController');

router.get('/',    metricController.getByCard);

module.exports = router;
