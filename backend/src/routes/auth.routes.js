const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const { loginLimiter } = require('../middlewares/rate-limiter');

router.post('/register', loginLimiter, registerUser);
router.post('/login', loginLimiter, loginUser);
router.get('/profile', protect, getUserProfile);

module.exports = router;
