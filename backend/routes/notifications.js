const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.get('/agency', notificationController.getForAgency);
router.get('/client', notificationController.getForClient);
router.patch('/:id/read', notificationController.markOneRead);

module.exports = router;
