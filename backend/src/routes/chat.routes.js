const express = require('express');
const router = express.Router();
const { queryDocuments } = require('../controllers/chat.controller');
const { protect } = require('../middlewares/auth.middleware');
const { cacheQuery } = require('../middlewares/cache.middleware');

router.post('/', protect, cacheQuery, queryDocuments);

module.exports = router;
