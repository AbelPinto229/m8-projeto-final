// backend/routes/metrics.js

const express = require('express');
const router  = express.Router();
const metricController = require('../controllers/metricController');

router.get('/',    metricController.getByCard);
router.post('/',   metricController.create);

module.exports = router;
