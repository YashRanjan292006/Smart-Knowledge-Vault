const express = require('express');
const router = express.Router();
const { uploadDocument, getDocuments } = require('../controllers/document.controller');
const { protect } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const { uploadLimiter } = require('../middlewares/rate-limiter');

router.route('/')
  .post(protect, uploadLimiter, upload.single('file'), uploadDocument)
  .get(protect, getDocuments);

module.exports = router;
