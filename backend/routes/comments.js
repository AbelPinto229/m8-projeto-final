// backend/routes/comments.js

const express = require('express');
const router  = express.Router();
const commentController = require('../controllers/commentController');

router.get('/',    commentController.getByCard);

module.exports = router;